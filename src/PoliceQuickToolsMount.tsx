import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { BadgeDollarSign, Car, Check, FileWarning, RefreshCw, Search, Siren, UserRound } from 'lucide-react'
import { supabase } from './lib/supabase'

type PoliceToolsContext = {
  can_open: boolean
  can_search_people: boolean
  can_view_cases: boolean
  can_manage_wanted: boolean
  can_manage_vehicles: boolean
  can_manage_fines: boolean
  can_manage_warrants: boolean
}

type PersonResult = {
  profile_id: string
  display_name: string
  nexus_id: string | null
}

type WantedEntry = {
  id: string
  wanted_number: string
  target_type: 'person' | 'vehicle'
  profile_id: string | null
  display_name: string | null
  nexus_id: string | null
  plate: string | null
  reason: string
  note: string | null
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'active' | 'done'
  created_by_name: string | null
  created_at: string
  closed_by_name: string | null
  closed_at: string | null
  close_reason: string | null
  row_version: number
}

type VehicleEntry = {
  id: string
  plate: string
  owner_profile_id: string | null
  owner_name: string | null
  owner_nexus_id: string | null
  model: string | null
  color: string | null
  notes: string | null
  wanted_active: boolean
  updated_at: string
  row_version: number
}

type FineEntry = {
  id: string
  fine_number: string
  profile_id: string
  display_name: string
  nexus_id: string | null
  case_number: string | null
  reason: string
  amount: number
  status: 'open' | 'paid' | 'waived' | 'cancelled'
  issued_by_name: string | null
  issued_at: string
  changed_at: string | null
  row_version: number
}

type WarrantEntry = {
  id: string
  warrant_number: string
  profile_id: string
  display_name: string
  nexus_id: string | null
  case_number: string | null
  reason: string
  note: string | null
  status: 'active' | 'done' | 'cancelled'
  issued_by_name: string | null
  issued_at: string
  closed_by_name: string | null
  closed_at: string | null
  close_reason: string | null
  row_version: number
}

type ToolTab = 'wanted' | 'vehicles' | 'fines' | 'warrants'

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

const priorityLabels: Record<WantedEntry['priority'], string> = {
  low: 'Niedrig',
  normal: 'Normal',
  high: 'Hoch',
  urgent: 'Dringend',
}

const fineStatusLabels: Record<FineEntry['status'], string> = {
  open: 'Offen',
  paid: 'Bezahlt',
  waived: 'Erlassen',
  cancelled: 'Storniert',
}

const warrantStatusLabels: Record<WarrantEntry['status'], string> = {
  active: 'Aktiv',
  done: 'Erledigt',
  cancelled: 'Aufgehoben',
}

function money(value: number) {
  return `$${Number(value).toLocaleString('de-DE', { maximumFractionDigits: 2 })}`
}

export default function PoliceQuickToolsMount() {
  const [slot, setSlot] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const sync = () => {
      if (document.body.dataset.nexusPoliceWorkspace !== 'true') {
        setSlot(null)
        return
      }

      const workspace = document.querySelector<HTMLElement>('.police-easy-workspace')
      const citizenSlot = workspace?.querySelector<HTMLElement>('.police-citizen-history-slot')
      const hero = workspace?.querySelector<HTMLElement>('.police-easy-hero')
      if (!workspace || !hero) {
        setSlot(null)
        return
      }

      let target = workspace.querySelector<HTMLDivElement>(':scope > .police-quick-tools-slot')
      if (!target) {
        target = document.createElement('div')
        target.className = 'police-quick-tools-slot'
        if (citizenSlot) citizenSlot.insertAdjacentElement('afterend', target)
        else hero.insertAdjacentElement('afterend', target)
      }
      setSlot((current) => current === target ? current : target)
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-nexus-police-workspace'] })
    return () => observer.disconnect()
  }, [])

  if (!slot) return null
  return createPortal(<PoliceQuickTools />, slot)
}

function PoliceQuickTools() {
  const [context, setContext] = useState<PoliceToolsContext | null>(null)
  const [tab, setTab] = useState<ToolTab>('wanted')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    void (async () => {
      const { data, error: contextError } = await supabase.rpc('police_tools_get_context')
      if (contextError) {
        setError('Police-Werkzeuge konnten nicht geladen werden.')
        return
      }
      setContext(data as PoliceToolsContext)
    })()
  }, [])

  const availableTabs = useMemo(() => [
    context?.can_manage_wanted ? { key: 'wanted' as const, label: 'Fahndungen', icon: <Siren size={15} /> } : null,
    context?.can_manage_vehicles ? { key: 'vehicles' as const, label: 'Fahrzeuge', icon: <Car size={15} /> } : null,
    context?.can_manage_fines ? { key: 'fines' as const, label: 'Bußgelder', icon: <BadgeDollarSign size={15} /> } : null,
    context?.can_manage_warrants ? { key: 'warrants' as const, label: 'Haftbefehle', icon: <FileWarning size={15} /> } : null,
  ].filter(Boolean) as Array<{ key: ToolTab; label: string; icon: JSX.Element }>, [context])

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.some((item) => item.key === tab)) setTab(availableTabs[0].key)
  }, [availableTabs, tab])

  if (!context) return <section className="police-tools-shell"><p>Police-Werkzeuge werden geladen …</p></section>
  if (!context.can_open || availableTabs.length === 0) return null

  return (
    <section className="police-tools-shell">
      <div className="police-tools-head">
        <div><span className="eyebrow">SCHNELLWERKZEUGE</span><h3>Alles Wichtige an einem Ort</h3><p>Kurze Einträge, schnelle Suche, kein unnötiger Papierkram.</p></div>
      </div>

      <div className="police-tools-tabs">
        {availableTabs.map((item) => (
          <button key={item.key} type="button" className={tab === item.key ? 'is-active' : ''} onClick={() => { setTab(item.key); setError(''); setMessage('') }}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      {error ? <div className="police-tools-message is-error">{error}</div> : null}
      {message ? <div className="police-tools-message is-success"><Check size={14} />{message}</div> : null}

      {tab === 'wanted' ? <WantedPanel context={context} onError={setError} onMessage={setMessage} /> : null}
      {tab === 'vehicles' ? <VehiclesPanel context={context} onError={setError} onMessage={setMessage} /> : null}
      {tab === 'fines' ? <FinesPanel context={context} onError={setError} onMessage={setMessage} /> : null}
      {tab === 'warrants' ? <WarrantsPanel context={context} onError={setError} onMessage={setMessage} /> : null}
    </section>
  )
}

function PersonPicker({ value, onChange, disabled = false }: { value: PersonResult | null; onChange: (person: PersonResult | null) => void; disabled?: boolean }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PersonResult[]>([])
  const [busy, setBusy] = useState(false)

  const search = async () => {
    const needle = query.trim()
    if (needle.length < 2 || disabled) return
    setBusy(true)
    const { data } = await supabase.rpc('police_search_people', { search_text: needle })
    setBusy(false)
    setResults(Array.isArray(data) ? data as PersonResult[] : [])
  }

  if (value) {
    return (
      <div className="police-tools-selected-person">
        <UserRound size={15} />
        <span><strong>{value.display_name}</strong><small>{value.nexus_id ?? 'Keine Nexus-ID'}</small></span>
        <button type="button" onClick={() => { onChange(null); setQuery('') }}>Ändern</button>
      </div>
    )
  }

  return (
    <div className="police-tools-person-picker">
      <div className="police-tools-search-line">
        <Search size={15} />
        <input value={query} disabled={disabled} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void search() }} placeholder="Name oder Nexus-ID" />
        <button type="button" onClick={() => void search()} disabled={busy || query.trim().length < 2}>{busy ? '…' : 'Suchen'}</button>
      </div>
      {results.length > 0 ? <div className="police-tools-person-results">{results.map((person) => (
        <button type="button" key={person.profile_id} onClick={() => { onChange(person); setResults([]); setQuery('') }}>
          <span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'}</small></span>
        </button>
      ))}</div> : null}
    </div>
  )
}

function WantedPanel({ context, onError, onMessage }: { context: PoliceToolsContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [entries, setEntries] = useState<WantedEntry[]>([])
  const [showDone, setShowDone] = useState(false)
  const [targetType, setTargetType] = useState<'person' | 'vehicle'>('person')
  const [person, setPerson] = useState<PersonResult | null>(null)
  const [plate, setPlate] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [priority, setPriority] = useState<WantedEntry['priority']>('normal')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc('police_list_wanted', { show_done: showDone })
    if (error) return onError('Fahndungen konnten nicht geladen werden.')
    setEntries(Array.isArray(data) ? data as WantedEntry[] : [])
  }, [showDone, onError])

  useEffect(() => { void load() }, [load])

  const create = async () => {
    if (!context.can_manage_wanted || reason.trim().length < 2) return
    if (targetType === 'person' && !person) return
    if (targetType === 'vehicle' && plate.trim().length < 2) return
    setBusy(true); onError(''); onMessage('')
    const request = targetType === 'person'
      ? supabase.rpc('police_create_person_wanted', { target_profile: person!.profile_id, wanted_reason: reason.trim(), wanted_note: note.trim() || null, wanted_priority: priority })
      : supabase.rpc('police_create_vehicle_wanted', { target_plate: plate.trim(), wanted_reason: reason.trim(), wanted_note: note.trim() || null, wanted_priority: priority })
    const { data, error } = await request
    setBusy(false)
    if (error) return onError('Fahndung konnte nicht angelegt werden.')
    const result = data as { wanted_number?: string } | null
    onMessage(result?.wanted_number ? `${result.wanted_number} wurde angelegt.` : 'Fahndung wurde angelegt.')
    setPerson(null); setPlate(''); setReason(''); setNote(''); setPriority('normal')
    await load()
  }

  const close = async (entry: WantedEntry) => {
    const reasonText = window.prompt('Warum wird die Fahndung beendet?', 'Erledigt')
    if (!reasonText?.trim()) return
    const { error } = await supabase.rpc('police_close_wanted', { target_wanted: entry.id, close_reason: reasonText.trim() })
    if (error) return onError('Fahndung konnte nicht beendet werden.')
    onMessage(`${entry.wanted_number} wurde beendet.`)
    await load()
  }

  return (
    <div className="police-tools-grid">
      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">NEU</span><h4>Fahndung anlegen</h4></div><Siren size={18} /></div>
        <div className="police-tools-form">
          <div className="police-tools-segment"><button type="button" className={targetType === 'person' ? 'is-active' : ''} onClick={() => setTargetType('person')}>Person</button><button type="button" className={targetType === 'vehicle' ? 'is-active' : ''} onClick={() => setTargetType('vehicle')}>Fahrzeug</button></div>
          {targetType === 'person' ? <PersonPicker value={person} onChange={setPerson} /> : <label><span>Kennzeichen</span><input value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="z. B. LS 1234" /></label>}
          <label><span>Grund</span><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Warum wird gesucht?" /></label>
          <label><span>Hinweis <small>optional</small></span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Kurzer wichtiger Hinweis" /></label>
          <label><span>Priorität</span><select value={priority} onChange={(e) => setPriority(e.target.value as WantedEntry['priority'])}><option value="low">Niedrig</option><option value="normal">Normal</option><option value="high">Hoch</option><option value="urgent">Dringend</option></select></label>
          <button type="button" className="police-tools-primary" onClick={() => void create()} disabled={busy}>{busy ? 'Speichert …' : 'Fahndung anlegen'}</button>
        </div>
      </div>

      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">ÜBERSICHT</span><h4>Fahndungen</h4></div><label className="police-tools-check"><input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Erledigte</label></div>
        <div className="police-tools-list">
          {entries.length === 0 ? <p>Keine Fahndungen vorhanden.</p> : entries.map((entry) => (
            <article key={entry.id} className={entry.status === 'active' ? 'is-active-entry' : ''}>
              <div className="police-tools-row-head"><strong>{entry.wanted_number} · {entry.target_type === 'person' ? entry.display_name : entry.plate}</strong><span className={`priority-${entry.priority}`}>{priorityLabels[entry.priority]}</span></div>
              <small>{entry.target_type === 'person' ? (entry.nexus_id ?? 'Keine Nexus-ID') : 'Fahrzeug'} · {dateTimeFormatter.format(new Date(entry.created_at))}</small>
              <p>{entry.reason}</p>
              {entry.note ? <p className="muted">{entry.note}</p> : null}
              {entry.status === 'active' ? <button type="button" className="police-tools-inline-action" onClick={() => void close(entry)}>Erledigen</button> : <small>Beendet{entry.close_reason ? ` · ${entry.close_reason}` : ''}</small>}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function VehiclesPanel({ context, onError, onMessage }: { context: PoliceToolsContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [query, setQuery] = useState('')
  const [entries, setEntries] = useState<VehicleEntry[]>([])
  const [selected, setSelected] = useState<VehicleEntry | null>(null)
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [notes, setNotes] = useState('')
  const [owner, setOwner] = useState<PersonResult | null>(null)
  const [busy, setBusy] = useState(false)

  const search = useCallback(async (needle = query) => {
    const { data, error } = await supabase.rpc('police_search_vehicles', { search_text: needle.trim() || null })
    if (error) return onError('Fahrzeuge konnten nicht geladen werden.')
    setEntries(Array.isArray(data) ? data as VehicleEntry[] : [])
  }, [query, onError])

  useEffect(() => { void search('') }, [])

  const open = (entry: VehicleEntry) => {
    setSelected(entry); setPlate(entry.plate); setModel(entry.model ?? ''); setColor(entry.color ?? ''); setNotes(entry.notes ?? '')
    setOwner(entry.owner_profile_id ? { profile_id: entry.owner_profile_id, display_name: entry.owner_name ?? 'Unbekannt', nexus_id: entry.owner_nexus_id } : null)
  }

  const clear = () => { setSelected(null); setPlate(''); setModel(''); setColor(''); setNotes(''); setOwner(null) }

  const save = async () => {
    if (!context.can_manage_vehicles || plate.trim().length < 2) return
    setBusy(true); onError(''); onMessage('')
    const { data, error } = await supabase.rpc('police_save_vehicle', {
      target_vehicle: selected?.id ?? null,
      vehicle_plate: plate.trim(),
      target_owner: owner?.profile_id ?? null,
      vehicle_model: model.trim() || null,
      vehicle_color: color.trim() || null,
      vehicle_notes: notes.trim() || null,
      expected_row_version: selected?.row_version ?? null,
    })
    setBusy(false)
    if (error) return onError('Fahrzeug konnte nicht gespeichert werden. Prüfe auch, ob das Kennzeichen schon existiert.')
    const result = data as { plate?: string } | null
    onMessage(`${result?.plate ?? plate.toUpperCase()} wurde gespeichert.`)
    clear(); await search('')
  }

  return (
    <div className="police-tools-grid">
      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">KENNZEICHEN</span><h4>Fahrzeug suchen</h4></div><Car size={18} /></div>
        <div className="police-tools-search-line"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void search(query) }} placeholder="Kennzeichen, Modell oder Halter" /><button type="button" onClick={() => void search(query)}>Suchen</button></div>
        <div className="police-tools-list compact">
          {entries.length === 0 ? <p>Keine Fahrzeuge gefunden.</p> : entries.map((entry) => <button type="button" className="police-tools-list-button" key={entry.id} onClick={() => open(entry)}><span><strong>{entry.plate}{entry.wanted_active ? ' · FAHNDUNG' : ''}</strong><small>{[entry.model, entry.color, entry.owner_name].filter(Boolean).join(' · ') || 'Keine weiteren Angaben'}</small></span></button>)}
        </div>
      </div>

      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">{selected ? 'BEARBEITEN' : 'NEU'}</span><h4>Fahrzeugdaten</h4></div>{selected ? <button type="button" className="police-tools-text-button" onClick={clear}>Neu</button> : null}</div>
        <div className="police-tools-form">
          <label><span>Kennzeichen</span><input value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="LS 1234" /></label>
          <label><span>Modell <small>optional</small></span><input value={model} onChange={(e) => setModel(e.target.value)} placeholder="z. B. Sultan" /></label>
          <label><span>Farbe <small>optional</small></span><input value={color} onChange={(e) => setColor(e.target.value)} placeholder="z. B. Schwarz" /></label>
          <div><span className="field-label">Halter <small>optional</small></span><PersonPicker value={owner} onChange={setOwner} /></div>
          <label><span>Hinweis <small>optional</small></span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Kurzer interner Hinweis" /></label>
          <button type="button" className="police-tools-primary" onClick={() => void save()} disabled={busy || plate.trim().length < 2}>{busy ? 'Speichert …' : 'Speichern'}</button>
        </div>
      </div>
    </div>
  )
}

function FinesPanel({ context, onError, onMessage }: { context: PoliceToolsContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [entries, setEntries] = useState<FineEntry[]>([])
  const [query, setQuery] = useState('')
  const [person, setPerson] = useState<PersonResult | null>(null)
  const [reason, setReason] = useState('')
  const [amount, setAmount] = useState('')
  const [caseNumber, setCaseNumber] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async (needle = query) => {
    const { data, error } = await supabase.rpc('police_list_fines', { search_text: needle.trim() || null })
    if (error) return onError('Bußgelder konnten nicht geladen werden.')
    setEntries(Array.isArray(data) ? data as FineEntry[] : [])
  }, [query, onError])

  useEffect(() => { void load('') }, [])

  const issue = async () => {
    const numericAmount = Number(amount.replace(',', '.'))
    if (!context.can_manage_fines || !person || reason.trim().length < 2 || Number.isNaN(numericAmount) || numericAmount < 0) return
    setBusy(true); onError(''); onMessage('')
    const { data, error } = await supabase.rpc('police_issue_fine', { target_profile: person.profile_id, fine_reason: reason.trim(), fine_amount: numericAmount, linked_case_number: caseNumber.trim() || null })
    setBusy(false)
    if (error) return onError('Bußgeld konnte nicht ausgestellt werden. Prüfe ggf. die Vorgangsnummer.')
    const result = data as { fine_number?: string } | null
    onMessage(result?.fine_number ? `${result.fine_number} wurde ausgestellt.` : 'Bußgeld wurde ausgestellt.')
    setPerson(null); setReason(''); setAmount(''); setCaseNumber(''); await load('')
  }

  const setStatus = async (entry: FineEntry, next: 'paid' | 'waived' | 'cancelled') => {
    const { error } = await supabase.rpc('police_set_fine_status', { target_fine: entry.id, next_status: next })
    if (error) return onError('Status konnte nicht geändert werden.')
    onMessage(`${entry.fine_number}: ${fineStatusLabels[next]}.`)
    await load(query)
  }

  return (
    <div className="police-tools-grid">
      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">NEU</span><h4>Bußgeld ausstellen</h4></div><BadgeDollarSign size={18} /></div>
        <div className="police-tools-form">
          <div><span className="field-label">Bürger</span><PersonPicker value={person} onChange={setPerson} /></div>
          <label><span>Grund</span><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="z. B. Geschwindigkeitsüberschreitung" /></label>
          <label><span>Betrag in $</span><input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="500" /></label>
          <label><span>Vorgang <small>optional</small></span><input value={caseNumber} onChange={(e) => setCaseNumber(e.target.value.toUpperCase())} placeholder="PD-000001" /></label>
          <button type="button" className="police-tools-primary" onClick={() => void issue()} disabled={busy}>{busy ? 'Speichert …' : 'Bußgeld ausstellen'}</button>
        </div>
      </div>

      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">ÜBERSICHT</span><h4>Bußgelder</h4></div></div>
        <div className="police-tools-search-line"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void load(query) }} placeholder="Person, Nummer, Grund" /><button type="button" onClick={() => void load(query)}>Suchen</button></div>
        <div className="police-tools-list">
          {entries.length === 0 ? <p>Keine Bußgelder vorhanden.</p> : entries.map((entry) => (
            <article key={entry.id}>
              <div className="police-tools-row-head"><strong>{entry.fine_number} · {entry.display_name}</strong><span>{money(entry.amount)}</span></div>
              <small>{entry.nexus_id ?? 'Keine Nexus-ID'} · {fineStatusLabels[entry.status]}{entry.case_number ? ` · ${entry.case_number}` : ''}</small>
              <p>{entry.reason}</p>
              {entry.status === 'open' ? <div className="police-tools-actions"><button type="button" onClick={() => void setStatus(entry, 'paid')}>Bezahlt</button><button type="button" onClick={() => void setStatus(entry, 'waived')}>Erlassen</button><button type="button" onClick={() => void setStatus(entry, 'cancelled')}>Stornieren</button></div> : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function WarrantsPanel({ context, onError, onMessage }: { context: PoliceToolsContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [entries, setEntries] = useState<WarrantEntry[]>([])
  const [query, setQuery] = useState('')
  const [person, setPerson] = useState<PersonResult | null>(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [caseNumber, setCaseNumber] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async (needle = query) => {
    const { data, error } = await supabase.rpc('police_list_warrants', { search_text: needle.trim() || null })
    if (error) return onError('Haftbefehle konnten nicht geladen werden.')
    setEntries(Array.isArray(data) ? data as WarrantEntry[] : [])
  }, [query, onError])

  useEffect(() => { void load('') }, [])

  const issue = async () => {
    if (!context.can_manage_warrants || !person || reason.trim().length < 2) return
    setBusy(true); onError(''); onMessage('')
    const { data, error } = await supabase.rpc('police_issue_warrant', { target_profile: person.profile_id, warrant_reason: reason.trim(), warrant_note: note.trim() || null, linked_case_number: caseNumber.trim() || null })
    setBusy(false)
    if (error) return onError('Haftbefehl konnte nicht angelegt werden. Prüfe ggf. die Vorgangsnummer.')
    const result = data as { warrant_number?: string } | null
    onMessage(result?.warrant_number ? `${result.warrant_number} wurde angelegt.` : 'Haftbefehl wurde angelegt.')
    setPerson(null); setReason(''); setNote(''); setCaseNumber(''); await load('')
  }

  const close = async (entry: WarrantEntry, next: 'done' | 'cancelled') => {
    const closeReason = next === 'cancelled' ? window.prompt('Grund für die Aufhebung?', '') : null
    if (next === 'cancelled' && !closeReason?.trim()) return
    const { error } = await supabase.rpc('police_close_warrant', { target_warrant: entry.id, next_status: next, close_reason: closeReason?.trim() || null })
    if (error) return onError('Haftbefehl konnte nicht geändert werden.')
    onMessage(`${entry.warrant_number}: ${warrantStatusLabels[next]}.`)
    await load(query)
  }

  return (
    <div className="police-tools-grid">
      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">NEU</span><h4>Haftbefehl anlegen</h4></div><FileWarning size={18} /></div>
        <div className="police-tools-form">
          <div><span className="field-label">Bürger</span><PersonPicker value={person} onChange={setPerson} /></div>
          <label><span>Grund</span><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Grund für den Haftbefehl" /></label>
          <label><span>Hinweis <small>optional</small></span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Kurzer Hinweis" /></label>
          <label><span>Vorgang <small>optional</small></span><input value={caseNumber} onChange={(e) => setCaseNumber(e.target.value.toUpperCase())} placeholder="PD-000001" /></label>
          <button type="button" className="police-tools-primary" onClick={() => void issue()} disabled={busy}>{busy ? 'Speichert …' : 'Haftbefehl anlegen'}</button>
        </div>
      </div>

      <div className="police-tools-card">
        <div className="police-tools-card-head"><div><span className="eyebrow">ÜBERSICHT</span><h4>Haftbefehle</h4></div><button type="button" className="police-tools-text-button" onClick={() => void load(query)}><RefreshCw size={13} /> Aktualisieren</button></div>
        <div className="police-tools-search-line"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void load(query) }} placeholder="Person, Nummer, Grund" /><button type="button" onClick={() => void load(query)}>Suchen</button></div>
        <div className="police-tools-list">
          {entries.length === 0 ? <p>Keine Haftbefehle vorhanden.</p> : entries.map((entry) => (
            <article key={entry.id} className={entry.status === 'active' ? 'is-active-entry' : ''}>
              <div className="police-tools-row-head"><strong>{entry.warrant_number} · {entry.display_name}</strong><span>{warrantStatusLabels[entry.status]}</span></div>
              <small>{entry.nexus_id ?? 'Keine Nexus-ID'}{entry.case_number ? ` · ${entry.case_number}` : ''} · {dateTimeFormatter.format(new Date(entry.issued_at))}</small>
              <p>{entry.reason}</p>{entry.note ? <p className="muted">{entry.note}</p> : null}
              {entry.status === 'active' ? <div className="police-tools-actions"><button type="button" onClick={() => void close(entry, 'done')}>Erledigt</button><button type="button" onClick={() => void close(entry, 'cancelled')}>Aufheben</button></div> : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
