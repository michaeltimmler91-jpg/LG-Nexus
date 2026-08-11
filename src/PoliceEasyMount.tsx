import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronRight, Plus, RefreshCw, Search, Shield, Trash2, UserPlus, UserRound, X } from 'lucide-react'
import { supabase } from './lib/supabase'

type PoliceContext = {
  can_open: boolean
  can_search_people: boolean
  can_view_cases: boolean
  can_create_cases: boolean
  can_edit_cases: boolean
}

type PersonResult = {
  profile_id: string
  display_name: string
  nexus_id: string | null
}

type PersonRole = 'accused' | 'victim' | 'witness' | 'other'

type CasePerson = PersonResult & {
  person_role: PersonRole
}

type TimelineEntry = {
  id: string
  entry_type: 'created' | 'note' | 'status'
  body: string | null
  from_status: string | null
  to_status: string | null
  author_name: string | null
  created_at: string
}

type PoliceCase = {
  id: string
  case_number: string
  title: string
  summary: string | null
  actions_text: string | null
  evidence_text: string | null
  state: 'open' | 'done'
  lead_name: string | null
  created_at: string
  updated_at: string
  row_version: number
  people: CasePerson[]
  timeline: TimelineEntry[]
}

type DraftPerson = PersonResult & { person_role: PersonRole }

const roleLabels: Record<PersonRole, string> = {
  accused: 'Beschuldigter',
  victim: 'Opfer',
  witness: 'Zeuge',
  other: 'Sonstige',
}

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

function normalizeCase(entry: PoliceCase): PoliceCase {
  return {
    ...entry,
    people: Array.isArray(entry.people) ? entry.people : [],
    timeline: Array.isArray(entry.timeline) ? entry.timeline : [],
  }
}

export default function PoliceEasyMount() {
  const [target, setTarget] = useState<Element | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const syncTarget = () => setTarget(document.querySelector('.main-area'))
    syncTarget()
    const observer = new MutationObserver(syncTarget)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onNavigation = (event: MouseEvent) => {
      const element = event.target as Element | null
      const button = element?.closest('.nav-button')
      if (!button) return
      setActive(button.getAttribute('aria-label') === 'Police' && document.body.dataset.nexusPolice === 'true')
    }
    document.addEventListener('click', onNavigation)
    return () => document.removeEventListener('click', onNavigation)
  }, [])

  useEffect(() => {
    if (active && document.body.dataset.nexusPolice !== 'true') setActive(false)
    if (active) document.body.dataset.nexusPoliceWorkspace = 'true'
    else delete document.body.dataset.nexusPoliceWorkspace
    return () => { delete document.body.dataset.nexusPoliceWorkspace }
  }, [active])

  if (!target || !active) return null
  return createPortal(<div className="nexus-police-page-slot"><PoliceEasyWorkspace /></div>, target)
}

function PoliceEasyWorkspace() {
  const [context, setContext] = useState<PoliceContext | null>(null)
  const [cases, setCases] = useState<PoliceCase[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNewCase, setShowNewCase] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newActions, setNewActions] = useState('')
  const [newEvidence, setNewEvidence] = useState('')
  const [newPeople, setNewPeople] = useState<DraftPerson[]>([])
  const [newPersonQuery, setNewPersonQuery] = useState('')
  const [newPersonResults, setNewPersonResults] = useState<PersonResult[]>([])
  const [newPersonRole, setNewPersonRole] = useState<PersonRole>('accused')
  const [busy, setBusy] = useState(false)

  const loadContext = useCallback(async () => {
    const { data, error: contextError } = await supabase.rpc('police_get_my_context')
    if (contextError) {
      setError('Police konnte nicht geladen werden.')
      setLoading(false)
      return
    }
    setContext(data as PoliceContext)
  }, [])

  const loadCases = useCallback(async (search = query) => {
    setLoading(true)
    const { data, error: listError } = await supabase.rpc('police_simple_list_cases', { search_text: search.trim() || null })
    setLoading(false)
    if (listError) {
      setError('Die Vorgänge konnten nicht geladen werden.')
      return
    }
    const next = Array.isArray(data) ? (data as PoliceCase[]).map(normalizeCase) : []
    setCases(next)
    setSelectedId((current) => current && next.some((entry) => entry.id === current) ? current : null)
  }, [query])

  useEffect(() => { void loadContext() }, [loadContext])
  useEffect(() => {
    if (context?.can_view_cases) void loadCases('')
  }, [context?.can_view_cases])

  const selectedCase = useMemo(() => cases.find((entry) => entry.id === selectedId) ?? null, [cases, selectedId])
  const openCount = useMemo(() => cases.filter((entry) => entry.state === 'open').length, [cases])

  const searchNewPerson = async () => {
    if (!context?.can_search_people || newPersonQuery.trim().length < 2) return
    const { data, error: searchError } = await supabase.rpc('police_search_people', { search_text: newPersonQuery.trim() })
    if (searchError) return setError('Personensuche fehlgeschlagen.')
    setNewPersonResults(Array.isArray(data) ? data as PersonResult[] : [])
  }

  const addDraftPerson = (person: PersonResult) => {
    if (newPeople.some((entry) => entry.profile_id === person.profile_id && entry.person_role === newPersonRole)) return
    setNewPeople((current) => [...current, { ...person, person_role: newPersonRole }])
    setNewPersonResults([])
    setNewPersonQuery('')
  }

  const resetNewCase = () => {
    setNewTitle('')
    setNewSummary('')
    setNewActions('')
    setNewEvidence('')
    setNewPeople([])
    setNewPersonQuery('')
    setNewPersonResults([])
    setNewPersonRole('accused')
  }

  const createCase = async () => {
    if (!context?.can_create_cases || newTitle.trim().length < 3) return
    setBusy(true); setError(''); setMessage('')
    const { data, error: createError } = await supabase.rpc('police_simple_create_case', {
      case_title: newTitle.trim(),
      case_summary: newSummary.trim() || null,
      case_actions: newActions.trim() || null,
      case_evidence: newEvidence.trim() || null,
      participants: newPeople.map(({ profile_id, person_role }) => ({ profile_id, person_role })),
    })
    setBusy(false)
    if (createError) return setError('Der Vorgang konnte nicht gespeichert werden.')
    const result = data as { id?: string; case_number?: string } | null
    setMessage(result?.case_number ? `${result.case_number} wurde gespeichert.` : 'Vorgang wurde gespeichert.')
    resetNewCase()
    setShowNewCase(false)
    await loadCases('')
    if (result?.id) setSelectedId(result.id)
  }

  if (loading && !context) return <div className="page-content police-easy-empty">Police wird geladen …</div>
  if (!context?.can_open) return <div className="page-content police-easy-empty">Kein Zugriff auf Police.</div>

  return (
    <div className="page-content police-easy-workspace">
      <section className="police-easy-hero">
        <div className="police-easy-hero-icon"><Shield size={28} /></div>
        <div><span className="eyebrow">LSPD · INTERN</span><h2>Police</h2><p>Bürger prüfen, Vorgänge führen und wichtige Einträge schnell finden.</p></div>
        <div className="police-easy-count"><strong>{openCount}</strong><span>offene Vorgänge</span></div>
      </section>

      {error ? <div className="police-easy-message is-error">{error}</div> : null}
      {message ? <div className="police-easy-message is-success"><Check size={15} />{message}</div> : null}

      <div className="police-easy-cases-view">
        <section className="police-easy-searchbar">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void loadCases(query) }} placeholder="Vorgangsnummer, Titel oder Beteiligte" />
          <button type="button" onClick={() => void loadCases(query)}>Suchen</button>
          <button type="button" className="secondary" onClick={() => { setQuery(''); void loadCases('') }}><RefreshCw size={14} /> Alle</button>
        </section>

        <div className="police-easy-grid">
          <section className="police-easy-card police-easy-list-card">
            <div className="police-easy-card-head">
              <div><span className="eyebrow">VORGÄNGE</span><h3>{cases.length} gefunden</h3></div>
              {context.can_create_cases ? <button type="button" className="police-easy-new-button" onClick={() => { setShowNewCase(true); setSelectedId(null) }}><Plus size={15} /> Neuer Vorgang</button> : null}
            </div>
            <div className="police-easy-case-list">
              {loading ? <p>Lädt …</p> : cases.length === 0 ? <p>Keine Vorgänge gefunden.</p> : cases.map((entry) => (
                <button key={entry.id} type="button" className={selectedId === entry.id ? 'is-active' : ''} onClick={() => { setSelectedId(entry.id); setShowNewCase(false) }}>
                  <span><strong>{entry.case_number} · {entry.title}</strong><small>{entry.state === 'open' ? 'Offen' : 'Erledigt'} · {entry.people.map((person) => person.display_name).join(', ') || 'ohne Beteiligte'}</small></span>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
          </section>

          {showNewCase && context.can_create_cases ? (
            <section className="police-easy-card police-easy-create-card">
              <div className="police-easy-card-head"><div><span className="eyebrow">NEUER VORGANG</span><h3>Vorgang anlegen</h3></div><button type="button" className="police-easy-icon-button" onClick={() => { setShowNewCase(false); resetNewCase() }} title="Schließen"><X size={15} /></button></div>
              <div className="police-easy-form">
                <label><span>Titel</span><input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="z. B. Schlägerei am Pier" /></label>

                {context.can_search_people ? (
                  <div className="police-easy-people-picker">
                    <span className="field-label">Beteiligte</span>
                    {newPeople.length > 0 ? <div className="police-easy-chips">{newPeople.map((person) => <button type="button" key={`${person.profile_id}-${person.person_role}`} onClick={() => setNewPeople((current) => current.filter((entry) => !(entry.profile_id === person.profile_id && entry.person_role === person.person_role)))}>{person.display_name} · {roleLabels[person.person_role]} ×</button>)}</div> : null}
                    <div className="police-easy-person-search">
                      <select value={newPersonRole} onChange={(e) => setNewPersonRole(e.target.value as PersonRole)}>{Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
                      <input value={newPersonQuery} onChange={(e) => setNewPersonQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void searchNewPerson() }} placeholder="Name oder Nexus-ID" />
                      <button type="button" onClick={() => void searchNewPerson()}><Search size={14} /></button>
                    </div>
                    {newPersonResults.length > 0 ? <div className="police-easy-person-results">{newPersonResults.map((person) => <button type="button" key={person.profile_id} onClick={() => addDraftPerson(person)}><span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'}</small></span><UserPlus size={14} /></button>)}</div> : null}
                  </div>
                ) : null}

                <label><span>Sachverhalt</span><textarea value={newSummary} onChange={(e) => setNewSummary(e.target.value)} placeholder="Kurz beschreiben, was passiert ist …" /></label>
                <label><span>Maßnahmen</span><textarea value={newActions} onChange={(e) => setNewActions(e.target.value)} placeholder={'- Person kontrolliert\n- Aussage aufgenommen\n- Platzverweis ausgesprochen'} /></label>
                <label><span>Beweise / Links <small>optional</small></span><textarea value={newEvidence} onChange={(e) => setNewEvidence(e.target.value)} placeholder={'- Foto vom Tatort: https://…\n- Dashcam vorhanden'} /></label>
                <button className="police-easy-primary" type="button" onClick={() => void createCase()} disabled={busy || newTitle.trim().length < 3}>{busy ? 'Speichert …' : 'Vorgang speichern'}</button>
              </div>
            </section>
          ) : selectedCase ? (
            <CaseView policeCase={selectedCase} context={context} reload={() => loadCases(query)} />
          ) : (
            <section className="police-easy-card police-easy-placeholder">
              <div><span className="eyebrow">DETAILS</span><h3>Vorgang auswählen</h3><p>Links einen Vorgang öffnen oder einen neuen Vorgang anlegen.</p></div>
              {context.can_create_cases ? <button type="button" className="police-easy-primary" onClick={() => setShowNewCase(true)}><Plus size={15} /> Neuer Vorgang</button> : null}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function CaseView({ policeCase, context, reload }: { policeCase: PoliceCase; context: PoliceContext; reload: () => Promise<void> }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(policeCase.title)
  const [summary, setSummary] = useState(policeCase.summary ?? '')
  const [actions, setActions] = useState(policeCase.actions_text ?? '')
  const [evidence, setEvidence] = useState(policeCase.evidence_text ?? '')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [personQuery, setPersonQuery] = useState('')
  const [personResults, setPersonResults] = useState<PersonResult[]>([])
  const [personRole, setPersonRole] = useState<PersonRole>('witness')

  useEffect(() => {
    setEditing(false)
    setTitle(policeCase.title)
    setSummary(policeCase.summary ?? '')
    setActions(policeCase.actions_text ?? '')
    setEvidence(policeCase.evidence_text ?? '')
    setNote('')
    setPersonQuery('')
    setPersonResults([])
  }, [policeCase.id, policeCase.row_version])

  const save = async () => {
    if (!context.can_edit_cases || policeCase.state === 'done') return
    setBusy(true)
    const { error } = await supabase.rpc('police_simple_update_case', {
      target_case: policeCase.id,
      case_title: title.trim(),
      case_summary: summary.trim() || null,
      case_actions: actions.trim() || null,
      case_evidence: evidence.trim() || null,
      expected_row_version: policeCase.row_version,
    })
    setBusy(false)
    if (!error) { setEditing(false); await reload() }
  }

  const setState = async (nextState: 'open' | 'done') => {
    if (!context.can_edit_cases || policeCase.state === nextState) return
    setBusy(true)
    const { error } = await supabase.rpc('police_simple_set_case_state', { target_case: policeCase.id, next_state: nextState, expected_row_version: policeCase.row_version })
    setBusy(false)
    if (!error) await reload()
  }

  const addNote = async () => {
    if (!context.can_edit_cases || policeCase.state === 'done' || note.trim().length < 2) return
    setBusy(true)
    const { error } = await supabase.rpc('police_simple_add_note', { target_case: policeCase.id, note_text: note.trim() })
    setBusy(false)
    if (!error) { setNote(''); await reload() }
  }

  const searchPerson = async () => {
    if (!context.can_search_people || personQuery.trim().length < 2) return
    const { data } = await supabase.rpc('police_search_people', { search_text: personQuery.trim() })
    setPersonResults(Array.isArray(data) ? data as PersonResult[] : [])
  }

  const addPerson = async (person: PersonResult) => {
    setBusy(true)
    const { error } = await supabase.rpc('police_simple_add_person', { target_case: policeCase.id, target_profile: person.profile_id, target_person_role: personRole })
    setBusy(false)
    if (!error) { setPersonQuery(''); setPersonResults([]); await reload() }
  }

  const removePerson = async (person: CasePerson) => {
    setBusy(true)
    const { error } = await supabase.rpc('police_simple_remove_person', { target_case: policeCase.id, target_profile: person.profile_id, target_person_role: person.person_role })
    setBusy(false)
    if (!error) await reload()
  }

  return (
    <section className="police-easy-detail">
      <div className="police-easy-detail-head">
        <div><span className="eyebrow">{policeCase.case_number}</span><h3>{policeCase.title}</h3><small>{policeCase.lead_name ?? 'Police'} · {dateTimeFormatter.format(new Date(policeCase.created_at))}</small></div>
        <div className="police-easy-detail-actions">
          {context.can_edit_cases && policeCase.state === 'open' && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}
          <div className="police-easy-state-actions">
            <button type="button" className={policeCase.state === 'open' ? 'is-active' : ''} disabled={busy || !context.can_edit_cases} onClick={() => void setState('open')}>Offen</button>
            <button type="button" className={policeCase.state === 'done' ? 'is-done' : ''} disabled={busy || !context.can_edit_cases} onClick={() => void setState('done')}>Erledigt</button>
          </div>
        </div>
      </div>

      <div className="police-easy-detail-grid">
        <div className="police-easy-block police-easy-block-wide">
          <div className="police-easy-block-head"><span>Beteiligte</span></div>
          {policeCase.people.length === 0 ? <p>Keine Beteiligten eingetragen.</p> : <div className="police-easy-person-list">{policeCase.people.map((person) => <div key={`${person.profile_id}-${person.person_role}`}><UserRound size={14} /><span><strong>{person.display_name}</strong><small>{roleLabels[person.person_role]} · {person.nexus_id ?? 'Keine Nexus-ID'}</small></span>{editing ? <button type="button" title="Entfernen" onClick={() => void removePerson(person)}><Trash2 size={13} /></button> : null}</div>)}</div>}

          {editing && context.can_search_people ? <div className="police-easy-inline-person">
            <select value={personRole} onChange={(e) => setPersonRole(e.target.value as PersonRole)}>{Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
            <div><input value={personQuery} onChange={(e) => setPersonQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void searchPerson() }} placeholder="Weitere Person suchen" /><button type="button" onClick={() => void searchPerson()}><Search size={13} /></button></div>
            {personResults.length > 0 ? <div className="police-easy-person-results">{personResults.map((person) => <button type="button" key={person.profile_id} onClick={() => void addPerson(person)}><span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'}</small></span><Plus size={13} /></button>)}</div> : null}
          </div> : null}
        </div>

        <div className="police-easy-block police-easy-block-wide">
          <div className="police-easy-block-head"><span>Sachverhalt</span></div>
          {editing ? <textarea value={summary} onChange={(e) => setSummary(e.target.value)} /> : <p>{policeCase.summary || 'Nicht eingetragen.'}</p>}
        </div>
        <div className="police-easy-block">
          <div className="police-easy-block-head"><span>Maßnahmen</span></div>
          {editing ? <textarea value={actions} onChange={(e) => setActions(e.target.value)} /> : <p className="preline">{policeCase.actions_text || 'Nicht eingetragen.'}</p>}
        </div>
        <div className="police-easy-block">
          <div className="police-easy-block-head"><span>Beweise / Links</span></div>
          {editing ? <textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} /> : <p className="preline">{policeCase.evidence_text || 'Keine.'}</p>}
        </div>
      </div>

      {editing ? <div className="police-easy-edit-actions"><label><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label><div><button type="button" onClick={() => setEditing(false)}>Abbrechen</button><button type="button" className="primary" disabled={busy || title.trim().length < 3} onClick={() => void save()}>Änderungen speichern</button></div></div> : null}

      <div className="police-easy-history">
        <div className="police-easy-block-head"><span>Verlauf</span></div>
        {context.can_edit_cases && policeCase.state === 'open' ? <div className="police-easy-note-row"><input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void addNote() }} placeholder="Kurze Ergänzung …" /><button type="button" onClick={() => void addNote()} disabled={busy || note.trim().length < 2}><Plus size={14} /> Hinzufügen</button></div> : null}
        <div className="police-easy-history-list">
          {policeCase.timeline.length === 0 ? <p>Noch kein Verlauf.</p> : policeCase.timeline.map((entry) => <div key={entry.id}><span>{dateTimeFormatter.format(new Date(entry.created_at))}</span><strong>{entry.entry_type === 'created' ? 'Vorgang angelegt' : entry.entry_type === 'status' ? (entry.to_status === 'completed' ? 'Als erledigt markiert' : 'Wieder geöffnet') : entry.body}</strong><small>{entry.author_name ?? 'Police'}</small></div>)}
        </div>
      </div>
    </section>
  )
}
