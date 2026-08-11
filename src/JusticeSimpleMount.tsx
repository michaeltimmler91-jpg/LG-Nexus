import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, CalendarClock, Check, ChevronRight, FileText, Gavel, Plus, RefreshCw, Scale, Search, UserRound, Users, X } from 'lucide-react'
import { supabase } from './lib/supabase'

type JusticeTab = 'cases' | 'people' | 'appointments' | 'knowledge'

type JusticeContext = {
  can_open: boolean
  can_view_cases: boolean
  can_manage_cases: boolean
  can_search_people: boolean
  can_view_appointments: boolean
  can_manage_appointments: boolean
  can_view_knowledge: boolean
  can_manage_knowledge: boolean
}

type Person = {
  profile_id: string
  display_name: string
  nexus_id: string | null
  date_of_birth: string | null
}

type Staff = {
  profile_id: string
  display_name: string
  role_title: string | null
}

type CasePerson = Person & {
  id: string
  role_label: string
}

type TimelineEntry = {
  id: string
  entry_type: 'created' | 'note' | 'status'
  body: string | null
  author_name: string | null
  created_at: string
}

type JusticeCase = {
  id: string
  case_number: string
  title: string
  summary: string | null
  result_text: string | null
  state: 'open' | 'done'
  responsible_profile: string | null
  responsible_name: string | null
  created_by_name: string | null
  created_at: string
  updated_at: string
  row_version: number
  people: CasePerson[]
  timeline: TimelineEntry[]
}

type PersonOverview = Person & {
  cases: Array<{
    id: string
    case_number: string
    title: string
    state: 'open' | 'done'
    role_label: string
    responsible_name: string | null
    updated_at: string
  }>
}

type Appointment = {
  id: string
  case_id: string | null
  case_number: string | null
  appointment_type: string
  title: string
  starts_at: string
  location: string | null
  participants_text: string | null
  note: string | null
  state: 'scheduled' | 'done'
  updated_by_name: string | null
  updated_at: string
  row_version: number
}

type KnowledgeArticle = {
  id: string
  article_kind: 'law' | 'guide' | 'template'
  title: string
  category: string | null
  body: string
  updated_by_name: string | null
  updated_at: string
  row_version: number
}

type DraftPerson = Person & { role_label: string }

const dateFormatter = new Intl.DateTimeFormat('de-DE')
const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

const participantRoles = ['Beteiligter', 'Angeklagter', 'Antragsteller', 'Zeuge', 'Vertretung', 'Sonstige']
const articleLabels: Record<KnowledgeArticle['article_kind'], string> = {
  law: 'Gesetz',
  guide: 'Hinweis',
  template: 'Vorlage',
}

function formatDate(value: string | null) {
  if (!value) return 'Nicht angegeben'
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

function toLocalInput(value: string) {
  const date = new Date(value)
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function JusticeSimpleMount() {
  const [navTarget, setNavTarget] = useState<Element | null>(null)
  const [pageTarget, setPageTarget] = useState<Element | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const syncTargets = () => {
      const nextNav = document.querySelector('.nav-stack')
      const nextPage = document.querySelector('.main-area')
      setNavTarget((current) => current === nextNav ? current : nextNav)
      setPageTarget((current) => current === nextPage ? current : nextPage)
    }
    syncTargets()
    const observer = new MutationObserver(syncTargets)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onNavigation = (event: MouseEvent) => {
      const element = event.target as Element | null
      const button = element?.closest('.nav-button')
      if (!button) return
      const label = button.getAttribute('aria-label')
      if (label === 'Justice') setActive(document.body.dataset.nexusJustice === 'true')
      else if (active) setActive(false)
    }
    document.addEventListener('click', onNavigation)
    return () => document.removeEventListener('click', onNavigation)
  }, [active])

  useEffect(() => {
    if (active && document.body.dataset.nexusJustice !== 'true') setActive(false)
    if (active) {
      document.body.dataset.nexusJusticeWorkspace = 'true'
      document.querySelectorAll('.nav-button.is-active:not([aria-label="Justice"])').forEach((node) => node.classList.remove('is-active'))
      const title = document.querySelector('.topbar-title h1')
      if (title) title.textContent = 'Justice'
    } else {
      delete document.body.dataset.nexusJusticeWorkspace
    }
    return () => { delete document.body.dataset.nexusJusticeWorkspace }
  }, [active])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (active && document.body.dataset.nexusJustice !== 'true') setActive(false)
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-nexus-justice'] })
    return () => observer.disconnect()
  }, [active])

  return <>
    {navTarget ? createPortal(
      <div className="nav-item-wrap nexus-service-injected nexus-justice-nav">
        <button className={`nav-button nexus-service-nav-button ${active ? 'is-active' : ''}`} aria-label="Justice">
          <Scale size={21} strokeWidth={1.8} />
          <span className="nav-tooltip">Justice</span>
        </button>
      </div>, navTarget,
    ) : null}
    {pageTarget && active ? createPortal(<div className="nexus-justice-page-slot"><JusticeWorkspace /></div>, pageTarget) : null}
  </>
}

function JusticeWorkspace() {
  const [context, setContext] = useState<JusticeContext | null>(null)
  const [tab, setTab] = useState<JusticeTab>('cases')
  const [staff, setStaff] = useState<Staff[]>([])
  const [openCases, setOpenCases] = useState(0)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    void (async () => {
      const { data, error: contextError } = await supabase.rpc('justice_get_my_context')
      if (contextError || !data) return setError('Justice konnte nicht geladen werden.')
      const next = data as JusticeContext
      setContext(next)
      if (next.can_view_cases) {
        const { data: staffData } = await supabase.rpc('justice_list_staff')
        setStaff(Array.isArray(staffData) ? staffData as Staff[] : [])
      }
    })()
  }, [])

  const tabs = useMemo(() => [
    context?.can_view_cases ? { key: 'cases' as const, label: 'Fälle', icon: <FileText size={16} /> } : null,
    context?.can_search_people ? { key: 'people' as const, label: 'Personen', icon: <Users size={16} /> } : null,
    context?.can_view_appointments ? { key: 'appointments' as const, label: 'Termine', icon: <CalendarClock size={16} /> } : null,
    context?.can_view_knowledge ? { key: 'knowledge' as const, label: 'Wissen', icon: <BookOpen size={16} /> } : null,
  ].filter(Boolean) as Array<{ key: JusticeTab; label: string; icon: JSX.Element }>, [context])

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((item) => item.key === tab)) setTab(tabs[0].key)
  }, [tabs, tab])

  if (!context) return <div className="page-content justice-empty">Justice wird geladen …</div>
  if (!context.can_open) return <div className="page-content justice-empty">Kein Zugriff auf Justice.</div>

  return <div className="page-content justice-workspace">
    <section className="justice-hero">
      <div className="justice-hero-icon"><Scale size={28} /></div>
      <div><span className="eyebrow">JUSTIZ LOS SANTOS · INTERN</span><h2>Justice</h2><p>Fälle, Bürgerbezug, Termine und wichtige Grundlagen an einem Ort.</p></div>
      <div className="justice-count"><strong>{openCases}</strong><span>offene Fälle</span></div>
    </section>

    <nav className="justice-tabs" aria-label="Justice Bereiche">
      {tabs.map((item) => <button key={item.key} type="button" className={tab === item.key ? 'is-active' : ''} onClick={() => { setTab(item.key); setError(''); setMessage('') }}>{item.icon}<span>{item.label}</span></button>)}
    </nav>

    {error ? <div className="justice-message is-error">{error}</div> : null}
    {message ? <div className="justice-message is-success"><Check size={15} />{message}</div> : null}

    {tab === 'cases' ? <CasesPanel context={context} staff={staff} setOpenCases={setOpenCases} onError={setError} onMessage={setMessage} /> : null}
    {tab === 'people' ? <PeoplePanel context={context} onError={setError} /> : null}
    {tab === 'appointments' ? <AppointmentsPanel context={context} onError={setError} onMessage={setMessage} /> : null}
    {tab === 'knowledge' ? <KnowledgePanel context={context} onError={setError} onMessage={setMessage} /> : null}
  </div>
}

function SearchLine({ value, setValue, onSearch, placeholder, reset }: { value: string; setValue: (value: string) => void; onSearch: () => void; placeholder: string; reset?: () => void }) {
  return <div className="justice-search-line"><Search size={16} /><input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }} placeholder={placeholder} /><button type="button" onClick={onSearch}>Suchen</button>{reset ? <button type="button" className="secondary" onClick={reset}><RefreshCw size={14} /> Alle</button> : null}</div>
}

function CasesPanel({ context, staff, setOpenCases, onError, onMessage }: { context: JusticeContext; staff: Staff[]; setOpenCases: (count: number) => void; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [items, setItems] = useState<JusticeCase[]>([])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (needle = query) => {
    setLoading(true)
    const { data, error } = await supabase.rpc('justice_list_cases', { search_text: needle.trim() || null })
    setLoading(false)
    if (error) return onError('Fälle konnten nicht geladen werden.')
    const next = (Array.isArray(data) ? data as JusticeCase[] : []).map((item) => ({ ...item, people: Array.isArray(item.people) ? item.people : [], timeline: Array.isArray(item.timeline) ? item.timeline : [] }))
    setItems(next)
    setOpenCases(next.filter((item) => item.state === 'open').length)
    setSelectedId((current) => current && next.some((item) => item.id === current) ? current : null)
  }, [query, onError, setOpenCases])

  useEffect(() => { void load('') }, [])
  const selected = items.find((item) => item.id === selectedId) ?? null

  return <section className="justice-section">
    <SearchLine value={query} setValue={setQuery} onSearch={() => void load(query)} reset={() => { setQuery(''); void load('') }} placeholder="Aktenzeichen, Titel, Person oder zuständiger Mitarbeiter" />
    <div className="justice-two-column">
      <div className="justice-card">
        <div className="justice-card-head"><div><span className="eyebrow">FÄLLE</span><h3>{items.length} gefunden</h3></div>{context.can_manage_cases ? <button type="button" className="justice-new-button" onClick={() => { setCreating(true); setSelectedId(null) }}><Plus size={15} /> Neuer Fall</button> : null}</div>
        <div className="justice-list">{loading ? <p>Lädt …</p> : items.length === 0 ? <p>Keine Fälle gefunden.</p> : items.map((item) => <button type="button" key={item.id} className={selectedId === item.id ? 'is-active' : ''} onClick={() => { setSelectedId(item.id); setCreating(false) }}><span><strong>{item.case_number} · {item.title}</strong><small>{item.responsible_name ?? 'Nicht zugewiesen'} · {item.state === 'open' ? 'Offen' : 'Erledigt'}</small></span><ChevronRight size={15} /></button>)}</div>
      </div>
      {creating ? <CaseEditor staff={staff} onSaved={async (id, number) => { onMessage(`${number} wurde angelegt.`); setCreating(false); await load(''); setSelectedId(id) }} onCancel={() => setCreating(false)} onError={onError} /> : selected ? <CaseDetails item={selected} context={context} staff={staff} reload={() => load(query)} onError={onError} onMessage={onMessage} /> : <EmptyChoice icon={<Gavel size={28} />} title="Fall auswählen" text="Links einen Fall öffnen oder einen neuen Fall anlegen." />}
    </div>
  </section>
}

function CaseEditor({ staff, onSaved, onCancel, onError }: { staff: Staff[]; onSaved: (id: string, number: string) => Promise<void>; onCancel: () => void; onError: (text: string) => void }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [result, setResult] = useState('')
  const [responsible, setResponsible] = useState(staff[0]?.profile_id ?? '')
  const [people, setPeople] = useState<DraftPerson[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (!responsible && staff[0]) setResponsible(staff[0].profile_id) }, [staff, responsible])

  const save = async () => {
    if (title.trim().length < 2 || !responsible) return
    setBusy(true); onError('')
    const { data, error } = await supabase.rpc('justice_create_case', {
      case_title: title.trim(), case_summary: summary.trim() || null, case_result: result.trim() || null,
      responsible_profile: responsible,
      participants: people.map((person) => ({ profile_id: person.profile_id, role_label: person.role_label })),
    })
    setBusy(false)
    if (error || !data) return onError('Der Fall konnte nicht gespeichert werden.')
    const saved = data as { id: string; case_number: string }
    await onSaved(saved.id, saved.case_number)
  }

  return <div className="justice-card">
    <div className="justice-card-head"><div><span className="eyebrow">NEUER FALL</span><h3>Fall anlegen</h3></div><button type="button" className="justice-icon-button" onClick={onCancel}><X size={15} /></button></div>
    <div className="justice-form">
      <label><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Körperverletzung am Pier" /></label>
      <label><span>Zuständig</span><select value={responsible} onChange={(e) => setResponsible(e.target.value)}><option value="">Mitarbeiter wählen</option>{staff.map((entry) => <option key={entry.profile_id} value={entry.profile_id}>{entry.display_name}{entry.role_title ? ` · ${entry.role_title}` : ''}</option>)}</select></label>
      <ParticipantPicker people={people} setPeople={setPeople} onError={onError} />
      <label><span>Beschreibung</span><textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Kurz beschreiben, worum es geht …" /></label>
      <label><span>Entscheidung / Ergebnis <small>optional</small></span><textarea value={result} onChange={(e) => setResult(e.target.value)} placeholder="Kann auch später ergänzt werden." /></label>
      <button type="button" className="justice-primary" disabled={busy || title.trim().length < 2 || !responsible} onClick={() => void save()}>{busy ? 'Speichert …' : 'Fall speichern'}</button>
    </div>
  </div>
}

function ParticipantPicker({ people, setPeople, onError }: { people: DraftPerson[]; setPeople: (people: DraftPerson[]) => void; onError: (text: string) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Person[]>([])
  const [role, setRole] = useState('Beteiligter')

  const search = async () => {
    if (query.trim().length < 2) return onError('Bitte mindestens zwei Zeichen für die Personensuche eingeben.')
    const { data, error } = await supabase.rpc('justice_search_people', { search_text: query.trim() })
    if (error) return onError('Personensuche konnte nicht ausgeführt werden.')
    setResults(Array.isArray(data) ? data as Person[] : [])
  }

  const add = (person: Person) => {
    if (!people.some((entry) => entry.profile_id === person.profile_id && entry.role_label === role)) setPeople([...people, { ...person, role_label: role }])
    setResults([]); setQuery('')
  }

  return <div className="justice-participant-picker">
    <span className="justice-field-label">Beteiligte</span>
    {people.length > 0 ? <div className="justice-chips">{people.map((person) => <span key={`${person.profile_id}-${person.role_label}`}><b>{person.display_name}</b><small>{person.role_label}</small><button type="button" onClick={() => setPeople(people.filter((entry) => !(entry.profile_id === person.profile_id && entry.role_label === person.role_label)))}><X size={12} /></button></span>)}</div> : <p className="justice-muted">Noch niemand hinzugefügt.</p>}
    <div className="justice-person-add"><select value={role} onChange={(e) => setRole(e.target.value)}>{participantRoles.map((entry) => <option key={entry}>{entry}</option>)}</select><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void search() }} placeholder="Name oder Nexus-ID" /><button type="button" onClick={() => void search()}>Suchen</button></div>
    {results.length > 0 ? <div className="justice-person-results">{results.map((person) => <button type="button" key={person.profile_id} onClick={() => add(person)}><span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'} · geb. {formatDate(person.date_of_birth)}</small></span><Plus size={14} /></button>)}</div> : null}
  </div>
}

function CaseDetails({ item, context, staff, reload, onError, onMessage }: { item: JusticeCase; context: JusticeContext; staff: Staff[]; reload: () => Promise<void>; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [summary, setSummary] = useState(item.summary ?? '')
  const [result, setResult] = useState(item.result_text ?? '')
  const [responsible, setResponsible] = useState(item.responsible_profile ?? '')
  const [note, setNote] = useState('')
  const [personQuery, setPersonQuery] = useState('')
  const [personResults, setPersonResults] = useState<Person[]>([])
  const [personRole, setPersonRole] = useState('Beteiligter')
  const [busy, setBusy] = useState(false)

  useEffect(() => { setEditing(false); setTitle(item.title); setSummary(item.summary ?? ''); setResult(item.result_text ?? ''); setResponsible(item.responsible_profile ?? ''); setNote(''); setPersonQuery(''); setPersonResults([]) }, [item.id, item.row_version])

  const save = async () => {
    setBusy(true); onError('')
    const { error } = await supabase.rpc('justice_update_case', { target_case: item.id, case_title: title.trim(), case_summary: summary.trim() || null, case_result: result.trim() || null, responsible_profile: responsible || null, expected_row_version: item.row_version })
    setBusy(false)
    if (error) return onError('Änderung konnte nicht gespeichert werden. Bitte neu laden und erneut versuchen.')
    setEditing(false); onMessage(`${item.case_number} wurde gespeichert.`); await reload()
  }

  const setState = async (next: 'open' | 'done') => {
    setBusy(true); onError('')
    const { error } = await supabase.rpc('justice_set_case_state', { target_case: item.id, next_state: next, expected_row_version: item.row_version })
    setBusy(false)
    if (error) return onError('Status konnte nicht geändert werden.')
    onMessage(next === 'done' ? `${item.case_number} wurde abgeschlossen.` : `${item.case_number} wurde wieder geöffnet.`); await reload()
  }

  const addNote = async () => {
    if (note.trim().length < 2) return
    setBusy(true); const { error } = await supabase.rpc('justice_add_case_note', { target_case: item.id, note_text: note.trim() }); setBusy(false)
    if (error) return onError('Verlauf konnte nicht ergänzt werden.')
    setNote(''); await reload()
  }

  const searchPerson = async () => {
    if (personQuery.trim().length < 2) return
    const { data, error } = await supabase.rpc('justice_search_people', { search_text: personQuery.trim() })
    if (error) return onError('Personensuche konnte nicht ausgeführt werden.')
    setPersonResults(Array.isArray(data) ? data as Person[] : [])
  }

  const addPerson = async (person: Person) => {
    setBusy(true); const { error } = await supabase.rpc('justice_add_case_person', { target_case: item.id, target_profile: person.profile_id, role_label: personRole }); setBusy(false)
    if (error) return onError('Person konnte nicht hinzugefügt werden.')
    setPersonQuery(''); setPersonResults([]); await reload()
  }

  const removePerson = async (person: CasePerson) => {
    setBusy(true); const { error } = await supabase.rpc('justice_remove_case_person', { target_case: item.id, target_profile: person.profile_id, role_label: person.role_label }); setBusy(false)
    if (error) return onError('Person konnte nicht entfernt werden.')
    await reload()
  }

  return <div className="justice-card justice-detail">
    <div className="justice-detail-head"><div><span className="eyebrow">{item.case_number}</span><h3>{item.title}</h3><small>Zuständig: {item.responsible_name ?? 'Nicht zugewiesen'} · {dateTimeFormatter.format(new Date(item.created_at))}</small></div><div className="justice-detail-actions">{context.can_manage_cases && item.state === 'open' && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}<button type="button" className={item.state === 'open' ? 'is-active' : 'is-done'} disabled={busy || !context.can_manage_cases} onClick={() => void setState(item.state === 'open' ? 'done' : 'open')}>{item.state === 'open' ? 'Als erledigt markieren' : 'Wieder öffnen'}</button></div></div>

    {editing ? <div className="justice-form justice-edit-form">
      <label><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label><span>Zuständig</span><select value={responsible} onChange={(e) => setResponsible(e.target.value)}><option value="">Mitarbeiter wählen</option>{staff.map((entry) => <option key={entry.profile_id} value={entry.profile_id}>{entry.display_name}</option>)}</select></label>
      <label><span>Beschreibung</span><textarea value={summary} onChange={(e) => setSummary(e.target.value)} /></label>
      <label><span>Entscheidung / Ergebnis</span><textarea value={result} onChange={(e) => setResult(e.target.value)} /></label>
      <div className="justice-button-row"><button type="button" onClick={() => setEditing(false)}>Abbrechen</button><button type="button" className="justice-primary" disabled={busy || title.trim().length < 2 || !responsible} onClick={() => void save()}>Speichern</button></div>
    </div> : <div className="justice-detail-grid"><InfoBlock title="Beschreibung" text={item.summary || 'Keine Beschreibung eingetragen.'} wide /><InfoBlock title="Entscheidung / Ergebnis" text={item.result_text || 'Noch kein Ergebnis eingetragen.'} wide /></div>}

    <div className="justice-people-block"><div className="justice-block-head"><span>Beteiligte</span></div>{item.people.length === 0 ? <p className="justice-muted">Keine Beteiligten eingetragen.</p> : <div className="justice-chips">{item.people.map((person) => <span key={person.id}><b>{person.display_name}</b><small>{person.role_label}{person.nexus_id ? ` · ${person.nexus_id}` : ''}</small>{context.can_manage_cases && item.state === 'open' ? <button type="button" onClick={() => void removePerson(person)}><X size={12} /></button> : null}</span>)}</div>}
      {context.can_manage_cases && item.state === 'open' ? <><div className="justice-person-add"><select value={personRole} onChange={(e) => setPersonRole(e.target.value)}>{participantRoles.map((entry) => <option key={entry}>{entry}</option>)}</select><input value={personQuery} onChange={(e) => setPersonQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void searchPerson() }} placeholder="Weitere Person suchen" /><button type="button" onClick={() => void searchPerson()}>Suchen</button></div>{personResults.length > 0 ? <div className="justice-person-results">{personResults.map((person) => <button type="button" key={person.profile_id} onClick={() => void addPerson(person)}><span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'}</small></span><Plus size={14} /></button>)}</div> : null}</> : null}
    </div>

    <div className="justice-timeline"><div className="justice-block-head"><span>Verlauf</span></div>{context.can_manage_cases && item.state === 'open' ? <div className="justice-note-row"><input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void addNote() }} placeholder="Kurzen Verlauf hinzufügen …" /><button type="button" disabled={busy || note.trim().length < 2} onClick={() => void addNote()}><Plus size={14} /> Hinzufügen</button></div> : null}<div className="justice-timeline-list">{item.timeline.length === 0 ? <p>Noch kein Verlauf.</p> : item.timeline.map((entry) => <div key={entry.id}><span>{dateTimeFormatter.format(new Date(entry.created_at))}</span><strong>{entry.body || 'Eintrag'}</strong><small>{entry.author_name ?? 'Justice'}</small></div>)}</div></div>
  </div>
}

function PeoplePanel({ context, onError }: { context: JusticeContext; onError: (text: string) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Person[]>([])
  const [selected, setSelected] = useState<PersonOverview | null>(null)
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!context.can_search_people || query.trim().length < 2) return onError('Bitte mindestens zwei Zeichen eingeben.')
    setLoading(true); const { data, error } = await supabase.rpc('justice_search_people', { search_text: query.trim() }); setLoading(false)
    if (error) return onError('Personensuche konnte nicht ausgeführt werden.')
    setResults(Array.isArray(data) ? data as Person[] : [])
  }

  const open = async (person: Person) => {
    setLoading(true); const { data, error } = await supabase.rpc('justice_get_person_overview', { target_profile: person.profile_id }); setLoading(false)
    if (error || !data) return onError('Personenübersicht konnte nicht geladen werden.')
    const overview = data as PersonOverview
    setSelected({ ...overview, cases: Array.isArray(overview.cases) ? overview.cases : [] })
  }

  return <section className="justice-section"><SearchLine value={query} setValue={setQuery} onSearch={() => void search()} reset={() => { setQuery(''); setResults([]); setSelected(null) }} placeholder="Name oder Nexus-ID" /><div className="justice-two-column"><div className="justice-card"><div className="justice-card-head"><div><span className="eyebrow">PERSONEN</span><h3>{results.length} gefunden</h3></div></div><div className="justice-list">{loading ? <p>Lädt …</p> : results.length === 0 ? <p>Nach einer Person suchen.</p> : results.map((person) => <button type="button" key={person.profile_id} className={selected?.profile_id === person.profile_id ? 'is-active' : ''} onClick={() => void open(person)}><span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'} · geb. {formatDate(person.date_of_birth)}</small></span><ChevronRight size={15} /></button>)}</div></div>{selected ? <div className="justice-card justice-person-overview"><div className="justice-person-head"><span className="justice-avatar"><UserRound size={22} /></span><div><span className="eyebrow">BÜRGER</span><h3>{selected.display_name}</h3><p>{selected.nexus_id ?? 'Keine Nexus-ID'} · geboren {formatDate(selected.date_of_birth)}</p></div></div><div className="justice-person-case-list"><div className="justice-block-head"><span>Justice-Fälle</span><b>{selected.cases.length}</b></div>{selected.cases.length === 0 ? <p className="justice-muted">Keine Fälle mit dieser Person.</p> : selected.cases.map((entry) => <article key={`${entry.id}-${entry.role_label}`}><div><strong>{entry.case_number} · {entry.title}</strong><small>{entry.role_label} · Zuständig: {entry.responsible_name ?? 'Nicht zugewiesen'}</small></div><span className={`justice-status ${entry.state === 'open' ? 'is-open' : 'is-done'}`}>{entry.state === 'open' ? 'Offen' : 'Erledigt'}</span></article>)}</div></div> : <EmptyChoice icon={<UserRound size={28} />} title="Person auswählen" text="Links eine Person auswählen, um ihre Justice-Fälle zu sehen." />}</div></section>
}

function AppointmentsPanel({ context, onError, onMessage }: { context: JusticeContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [items, setItems] = useState<Appointment[]>([])
  const [cases, setCases] = useState<JusticeCase[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (needle = query) => {
    setLoading(true)
    const [{ data, error }, caseResult] = await Promise.all([
      supabase.rpc('justice_list_appointments', { search_text: needle.trim() || null }),
      supabase.rpc('justice_list_cases', { search_text: null }),
    ])
    setLoading(false)
    if (error) return onError('Termine konnten nicht geladen werden.')
    setItems(Array.isArray(data) ? data as Appointment[] : [])
    setCases(Array.isArray(caseResult.data) ? caseResult.data as JusticeCase[] : [])
  }, [query, onError])
  useEffect(() => { void load('') }, [])

  return <section className="justice-section"><SearchLine value={query} setValue={setQuery} onSearch={() => void load(query)} reset={() => { setQuery(''); void load('') }} placeholder="Termin, Ort, Beteiligte oder Aktenzeichen" /><div className="justice-two-column"><div className="justice-card"><div className="justice-card-head"><div><span className="eyebrow">TERMINE</span><h3>{items.filter((item) => item.state === 'scheduled').length} offen</h3></div>{context.can_manage_appointments ? <button type="button" className="justice-new-button" onClick={() => { setCreating(true); setSelected(null) }}><Plus size={15} /> Neuer Termin</button> : null}</div><div className="justice-list">{loading ? <p>Lädt …</p> : items.length === 0 ? <p>Keine Termine vorhanden.</p> : items.map((item) => <button type="button" key={item.id} className={selected?.id === item.id ? 'is-active' : ''} onClick={() => { setSelected(item); setCreating(false) }}><span><strong>{item.appointment_type} · {item.title}</strong><small>{dateTimeFormatter.format(new Date(item.starts_at))}{item.case_number ? ` · ${item.case_number}` : ''} · {item.state === 'scheduled' ? 'Offen' : 'Erledigt'}</small></span><ChevronRight size={15} /></button>)}</div></div>{creating || selected ? <AppointmentEditor item={selected} cases={cases} context={context} onSaved={async () => { onMessage('Termin wurde gespeichert.'); setCreating(false); setSelected(null); await load(query) }} onCancel={() => { setCreating(false); setSelected(null) }} onError={onError} /> : <EmptyChoice icon={<CalendarClock size={28} />} title="Termin auswählen" text="Links einen Termin öffnen oder neu anlegen." />}</div></section>
}

function AppointmentEditor({ item, cases, context, onSaved, onCancel, onError }: { item: Appointment | null; cases: JusticeCase[]; context: JusticeContext; onSaved: () => Promise<void>; onCancel: () => void; onError: (text: string) => void }) {
  const [type, setType] = useState(item?.appointment_type ?? 'Verhandlung')
  const [title, setTitle] = useState(item?.title ?? '')
  const [startsAt, setStartsAt] = useState(item ? toLocalInput(item.starts_at) : '')
  const [caseId, setCaseId] = useState(item?.case_id ?? '')
  const [location, setLocation] = useState(item?.location ?? '')
  const [participants, setParticipants] = useState(item?.participants_text ?? '')
  const [note, setNote] = useState(item?.note ?? '')
  const [editing, setEditing] = useState(!item)
  const [busy, setBusy] = useState(false)
  useEffect(() => { setType(item?.appointment_type ?? 'Verhandlung'); setTitle(item?.title ?? ''); setStartsAt(item ? toLocalInput(item.starts_at) : ''); setCaseId(item?.case_id ?? ''); setLocation(item?.location ?? ''); setParticipants(item?.participants_text ?? ''); setNote(item?.note ?? ''); setEditing(!item) }, [item?.id, item?.row_version])

  const save = async () => {
    if (!startsAt || title.trim().length < 2 || type.trim().length < 2) return
    setBusy(true); onError('')
    const { error } = await supabase.rpc('justice_save_appointment', { target_appointment: item?.id ?? null, target_case: caseId || null, appointment_type: type.trim(), appointment_title: title.trim(), appointment_starts_at: new Date(startsAt).toISOString(), appointment_location: location.trim() || null, appointment_participants: participants.trim() || null, appointment_note: note.trim() || null, expected_row_version: item?.row_version ?? null })
    setBusy(false)
    if (error) return onError('Termin konnte nicht gespeichert werden.')
    await onSaved()
  }

  const setState = async (next: 'scheduled' | 'done') => {
    if (!item) return
    setBusy(true); const { error } = await supabase.rpc('justice_set_appointment_state', { target_appointment: item.id, next_state: next, expected_row_version: item.row_version }); setBusy(false)
    if (error) return onError('Terminstatus konnte nicht geändert werden.')
    await onSaved()
  }

  return <div className="justice-card"><div className="justice-card-head"><div><span className="eyebrow">{item ? 'TERMIN' : 'NEUER TERMIN'}</span><h3>{item?.title ?? 'Termin anlegen'}</h3></div><div className="justice-head-actions">{item && context.can_manage_appointments && item.state === 'scheduled' && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}<button type="button" className="justice-icon-button" onClick={onCancel}><X size={15} /></button></div></div>{editing ? <div className="justice-form"><div className="justice-form-grid"><label><span>Art</span><select value={type} onChange={(e) => setType(e.target.value)}><option>Verhandlung</option><option>Gespräch</option><option>Besprechung</option></select></label><label><span>Datum & Uhrzeit</span><input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></label></div><label><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kurzer Terminname" /></label><label><span>Fall <small>optional</small></span><select value={caseId} onChange={(e) => setCaseId(e.target.value)}><option value="">Ohne Fallbezug</option>{cases.map((entry) => <option key={entry.id} value={entry.id}>{entry.case_number} · {entry.title}</option>)}</select></label><label><span>Ort <small>optional</small></span><input value={location} onChange={(e) => setLocation(e.target.value)} /></label><label><span>Beteiligte</span><textarea value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="Namen kurz eintragen …" /></label><label><span>Hinweis</span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Wichtige Info zum Termin …" /></label><div className="justice-button-row"><button type="button" onClick={item ? () => setEditing(false) : onCancel}>Abbrechen</button><button type="button" className="justice-primary" disabled={busy || !startsAt || title.trim().length < 2} onClick={() => void save()}>Speichern</button></div></div> : <><div className="justice-detail-grid"><InfoBlock title="Art" text={item?.appointment_type ?? ''} /><InfoBlock title="Datum & Uhrzeit" text={item ? dateTimeFormatter.format(new Date(item.starts_at)) : ''} /><InfoBlock title="Aktenzeichen" text={item?.case_number || 'Kein Fallbezug'} /><InfoBlock title="Ort" text={item?.location || 'Nicht eingetragen.'} /><InfoBlock title="Beteiligte" text={item?.participants_text || 'Keine eingetragen.'} wide /><InfoBlock title="Hinweis" text={item?.note || 'Kein Hinweis.'} wide /></div>{item && context.can_manage_appointments ? <div className="justice-button-row"><button type="button" className={item.state === 'scheduled' ? 'justice-primary' : ''} disabled={busy} onClick={() => void setState(item.state === 'scheduled' ? 'done' : 'scheduled')}>{item.state === 'scheduled' ? 'Als erledigt markieren' : 'Wieder öffnen'}</button></div> : null}</>}</div>
}

function KnowledgePanel({ context, onError, onMessage }: { context: JusticeContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [items, setItems] = useState<KnowledgeArticle[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null)
  const [creating, setCreating] = useState(false)
  const load = useCallback(async (needle = query) => { const { data, error } = await supabase.rpc('justice_list_knowledge', { search_text: needle.trim() || null }); if (error) return onError('Wissen konnte nicht geladen werden.'); setItems(Array.isArray(data) ? data as KnowledgeArticle[] : []) }, [query, onError])
  useEffect(() => { void load('') }, [])
  return <section className="justice-section"><SearchLine value={query} setValue={setQuery} onSearch={() => void load(query)} reset={() => { setQuery(''); void load('') }} placeholder="Gesetz, Hinweis, Vorlage oder Inhalt" /><div className="justice-two-column"><div className="justice-card"><div className="justice-card-head"><div><span className="eyebrow">WISSEN</span><h3>{items.length} Einträge</h3></div>{context.can_manage_knowledge ? <button type="button" className="justice-new-button" onClick={() => { setCreating(true); setSelected(null) }}><Plus size={15} /> Neuer Eintrag</button> : null}</div><div className="justice-list">{items.length === 0 ? <p>Noch keine Einträge vorhanden.</p> : items.map((item) => <button type="button" key={item.id} className={selected?.id === item.id ? 'is-active' : ''} onClick={() => { setSelected(item); setCreating(false) }}><span><strong>{item.title}</strong><small>{articleLabels[item.article_kind]}{item.category ? ` · ${item.category}` : ''}</small></span><ChevronRight size={15} /></button>)}</div></div>{creating || selected ? <KnowledgeEditor item={selected} context={context} onSaved={async () => { onMessage('Wissenseintrag wurde gespeichert.'); setCreating(false); setSelected(null); await load(query) }} onCancel={() => { setCreating(false); setSelected(null) }} onError={onError} /> : <EmptyChoice icon={<BookOpen size={28} />} title="Eintrag auswählen" text="Gesetz, Hinweis oder Vorlage öffnen oder neu anlegen." />}</div></section>
}

function KnowledgeEditor({ item, context, onSaved, onCancel, onError }: { item: KnowledgeArticle | null; context: JusticeContext; onSaved: () => Promise<void>; onCancel: () => void; onError: (text: string) => void }) {
  const [kind, setKind] = useState<KnowledgeArticle['article_kind']>(item?.article_kind ?? 'law')
  const [title, setTitle] = useState(item?.title ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [body, setBody] = useState(item?.body ?? '')
  const [editing, setEditing] = useState(!item)
  const [busy, setBusy] = useState(false)
  useEffect(() => { setKind(item?.article_kind ?? 'law'); setTitle(item?.title ?? ''); setCategory(item?.category ?? ''); setBody(item?.body ?? ''); setEditing(!item) }, [item?.id, item?.row_version])
  const save = async () => { setBusy(true); onError(''); const { error } = await supabase.rpc('justice_save_knowledge', { target_article: item?.id ?? null, article_kind: kind, article_title: title.trim(), article_category: category.trim() || null, article_body: body.trim(), expected_row_version: item?.row_version ?? null }); setBusy(false); if (error) return onError('Eintrag konnte nicht gespeichert werden.'); await onSaved() }
  return <div className="justice-card"><div className="justice-card-head"><div><span className="eyebrow">{item ? articleLabels[item.article_kind].toUpperCase() : 'NEUER EINTRAG'}</span><h3>{item?.title ?? 'Wissen hinzufügen'}</h3></div><div className="justice-head-actions">{item && context.can_manage_knowledge && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}<button type="button" className="justice-icon-button" onClick={onCancel}><X size={15} /></button></div></div>{editing ? <div className="justice-form"><div className="justice-form-grid"><label><span>Art</span><select value={kind} onChange={(e) => setKind(e.target.value as KnowledgeArticle['article_kind'])}><option value="law">Gesetz</option><option value="guide">Hinweis</option><option value="template">Vorlage</option></select></label><label><span>Kategorie <small>optional</small></span><input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="z. B. Strafrecht" /></label></div><label><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label><label><span>Inhalt</span><textarea className="justice-knowledge-textarea" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Kurz und verständlich …" /></label><div className="justice-button-row"><button type="button" onClick={item ? () => setEditing(false) : onCancel}>Abbrechen</button><button type="button" className="justice-primary" disabled={busy || title.trim().length < 2 || body.trim().length < 2} onClick={() => void save()}>Speichern</button></div></div> : <div className="justice-article"><div className="justice-article-meta"><span>{item ? articleLabels[item.article_kind] : ''}</span>{item?.category ? <span>{item.category}</span> : null}</div><p>{item?.body}</p><small>Zuletzt bearbeitet {item ? dateTimeFormatter.format(new Date(item.updated_at)) : ''}{item?.updated_by_name ? ` · ${item.updated_by_name}` : ''}</small></div>}</div>
}

function InfoBlock({ title, text, wide = false }: { title: string; text: string; wide?: boolean }) {
  return <div className={`justice-info-block${wide ? ' is-wide' : ''}`}><span>{title}</span><p>{text}</p></div>
}

function EmptyChoice({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return <div className="justice-card justice-placeholder">{icon}<div><span className="eyebrow">DETAILS</span><h3>{title}</h3><p>{text}</p></div></div>
}
