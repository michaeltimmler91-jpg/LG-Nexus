import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, Check, ChevronRight, ClipboardCheck, Flame, MapPinned, Plus, RefreshCw, Search, Truck, X } from 'lucide-react'
import { supabase } from './lib/supabase'

type FireContext = {
  can_open: boolean
  can_view_incidents: boolean
  can_manage_incidents: boolean
  can_view_objects: boolean
  can_manage_objects: boolean
  can_view_assets: boolean
  can_manage_assets: boolean
  can_view_knowledge: boolean
  can_manage_knowledge: boolean
}

type FireTab = 'incidents' | 'objects' | 'assets' | 'knowledge'

type TimelineEntry = {
  id: string
  entry_type: 'created' | 'note' | 'status'
  body: string | null
  author_name: string | null
  created_at: string
}

type Incident = {
  id: string
  incident_number: string
  incident_type: string
  location: string
  units_text: string | null
  vehicles_text: string | null
  situation_text: string | null
  actions_text: string | null
  state: 'open' | 'done'
  created_by_name: string | null
  created_at: string
  updated_at: string
  row_version: number
  timeline: TimelineEntry[]
}

type FireObject = {
  id: string
  name: string
  address: string | null
  access_text: string | null
  hydrant_text: string | null
  hazards_text: string | null
  notes_text: string | null
  updated_by_name: string | null
  updated_at: string
  row_version: number
}

type FireAsset = {
  id: string
  asset_type: 'vehicle' | 'equipment'
  name: string
  identifier: string | null
  status: 'ready' | 'defect' | 'maintenance' | 'out'
  note: string | null
  checklist_text: string | null
  updated_by_name: string | null
  updated_at: string
  row_version: number
}

type KnowledgeArticle = {
  id: string
  title: string
  category: string | null
  body: string
  updated_by_name: string | null
  updated_at: string
  row_version: number
}

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

const assetStatusLabels: Record<FireAsset['status'], string> = {
  ready: 'Einsatzbereit',
  defect: 'Defekt',
  maintenance: 'In Wartung',
  out: 'Außer Dienst',
}

export default function FireSimpleMount() {
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
      setActive(button.getAttribute('aria-label') === 'Fire & Rescue' && document.body.dataset.nexusFire === 'true')
    }
    document.addEventListener('click', onNavigation)
    return () => document.removeEventListener('click', onNavigation)
  }, [])

  useEffect(() => {
    if (active && document.body.dataset.nexusFire !== 'true') setActive(false)
    if (active) document.body.dataset.nexusFireWorkspace = 'true'
    else delete document.body.dataset.nexusFireWorkspace
    return () => { delete document.body.dataset.nexusFireWorkspace }
  }, [active])

  if (!target || !active) return null
  return createPortal(<div className="nexus-fire-page-slot"><FireWorkspace /></div>, target)
}

function FireWorkspace() {
  const [context, setContext] = useState<FireContext | null>(null)
  const [tab, setTab] = useState<FireTab>('incidents')
  const [openIncidents, setOpenIncidents] = useState(0)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    void (async () => {
      const { data, error: contextError } = await supabase.rpc('fire_get_my_context')
      if (contextError) return setError('Fire & Rescue konnte nicht geladen werden.')
      setContext(data as FireContext)
    })()
  }, [])

  const tabs = useMemo(() => [
    context?.can_view_incidents ? { key: 'incidents' as const, label: 'Einsätze', icon: <Flame size={16} /> } : null,
    context?.can_view_objects ? { key: 'objects' as const, label: 'Objekte', icon: <MapPinned size={16} /> } : null,
    context?.can_view_assets ? { key: 'assets' as const, label: 'Fahrzeuge / Geräte', icon: <Truck size={16} /> } : null,
    context?.can_view_knowledge ? { key: 'knowledge' as const, label: 'Wissen', icon: <BookOpen size={16} /> } : null,
  ].filter(Boolean) as Array<{ key: FireTab; label: string; icon: JSX.Element }>, [context])

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((item) => item.key === tab)) setTab(tabs[0].key)
  }, [tabs, tab])

  if (!context) return <div className="page-content fire-empty">Fire & Rescue wird geladen …</div>
  if (!context.can_open) return <div className="page-content fire-empty">Kein Zugriff auf Fire & Rescue.</div>

  return (
    <div className="page-content fire-workspace">
      <section className="fire-hero">
        <div className="fire-hero-icon"><Flame size={27} /></div>
        <div><span className="eyebrow">LSFR · INTERN</span><h2>Fire & Rescue</h2><p>Einsätze dokumentieren, wichtige Objektinfos finden und Fahrzeuge im Blick behalten.</p></div>
        <div className="fire-count"><strong>{openIncidents}</strong><span>offene Einsätze</span></div>
      </section>

      <nav className="fire-tabs" aria-label="Fire & Rescue Bereiche">
        {tabs.map((item) => <button key={item.key} type="button" className={tab === item.key ? 'is-active' : ''} onClick={() => { setTab(item.key); setError(''); setMessage('') }}>{item.icon}<span>{item.label}</span></button>)}
      </nav>

      {error ? <div className="fire-message is-error">{error}</div> : null}
      {message ? <div className="fire-message is-success"><Check size={15} />{message}</div> : null}

      {tab === 'incidents' ? <IncidentsPanel context={context} setOpenIncidents={setOpenIncidents} onError={setError} onMessage={setMessage} /> : null}
      {tab === 'objects' ? <ObjectsPanel context={context} onError={setError} onMessage={setMessage} /> : null}
      {tab === 'assets' ? <AssetsPanel context={context} onError={setError} onMessage={setMessage} /> : null}
      {tab === 'knowledge' ? <KnowledgePanel context={context} onError={setError} onMessage={setMessage} /> : null}
    </div>
  )
}

function SearchLine({ value, setValue, onSearch, placeholder }: { value: string; setValue: (value: string) => void; onSearch: () => void; placeholder: string }) {
  return <div className="fire-search-line"><Search size={16} /><input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }} placeholder={placeholder} /><button type="button" onClick={onSearch}>Suchen</button></div>
}

function IncidentsPanel({ context, setOpenIncidents, onError, onMessage }: { context: FireContext; setOpenIncidents: (count: number) => void; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [items, setItems] = useState<Incident[]>([])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (needle = query) => {
    setLoading(true)
    const { data, error } = await supabase.rpc('fire_list_incidents', { search_text: needle.trim() || null })
    setLoading(false)
    if (error) return onError('Einsätze konnten nicht geladen werden.')
    const next = Array.isArray(data) ? data as Incident[] : []
    setItems(next.map((item) => ({ ...item, timeline: Array.isArray(item.timeline) ? item.timeline : [] })))
    setOpenIncidents(next.filter((item) => item.state === 'open').length)
    setSelectedId((current) => current && next.some((item) => item.id === current) ? current : null)
  }, [query, onError, setOpenIncidents])

  useEffect(() => { void load('') }, [])
  const selected = items.find((item) => item.id === selectedId) ?? null

  return <section className="fire-section">
    <SearchLine value={query} setValue={setQuery} onSearch={() => void load(query)} placeholder="Einsatznummer, Art, Ort oder Einheit" />
    <div className="fire-two-column">
      <div className="fire-card">
        <div className="fire-card-head"><div><span className="eyebrow">EINSÄTZE</span><h3>{items.length} gefunden</h3></div>{context.can_manage_incidents ? <button type="button" className="fire-new-button" onClick={() => { setShowNew(true); setSelectedId(null) }}><Plus size={15} /> Neuer Einsatz</button> : null}</div>
        <div className="fire-list">
          {loading ? <p>Lädt …</p> : items.length === 0 ? <p>Keine Einsätze gefunden.</p> : items.map((item) => <button key={item.id} type="button" className={selectedId === item.id ? 'is-active' : ''} onClick={() => { setSelectedId(item.id); setShowNew(false) }}><span><strong>{item.incident_number} · {item.incident_type}</strong><small>{item.location} · {item.state === 'open' ? 'Offen' : 'Erledigt'}</small></span><ChevronRight size={15} /></button>)}
        </div>
      </div>
      {showNew ? <IncidentEditor context={context} onSaved={async (id, number) => { onMessage(`${number} wurde angelegt.`); setShowNew(false); await load(''); setSelectedId(id) }} onCancel={() => setShowNew(false)} onError={onError} /> : selected ? <IncidentDetails item={selected} context={context} reload={() => load(query)} onError={onError} onMessage={onMessage} /> : <EmptyChoice title="Einsatz auswählen" text="Links einen Einsatz öffnen oder einen neuen Einsatz anlegen." />}
    </div>
  </section>
}

function IncidentEditor({ context, onSaved, onCancel, onError }: { context: FireContext; onSaved: (id: string, number: string) => Promise<void>; onCancel: () => void; onError: (text: string) => void }) {
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')
  const [units, setUnits] = useState('')
  const [vehicles, setVehicles] = useState('')
  const [situation, setSituation] = useState('')
  const [actions, setActions] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!context.can_manage_incidents || type.trim().length < 2 || location.trim().length < 2) return
    setBusy(true); onError('')
    const { data, error } = await supabase.rpc('fire_create_incident', { incident_type: type.trim(), incident_location: location.trim(), incident_units: units.trim() || null, incident_vehicles: vehicles.trim() || null, incident_situation: situation.trim() || null, incident_actions: actions.trim() || null })
    setBusy(false)
    if (error) return onError('Der Einsatz konnte nicht gespeichert werden.')
    const result = data as { id: string; incident_number: string }
    await onSaved(result.id, result.incident_number)
  }

  return <div className="fire-card">
    <div className="fire-card-head"><div><span className="eyebrow">NEUER EINSATZ</span><h3>Einsatz anlegen</h3></div><button type="button" className="fire-icon-button" onClick={onCancel}><X size={15} /></button></div>
    <div className="fire-form">
      <label><span>Einsatzart</span><input value={type} onChange={(e) => setType(e.target.value)} placeholder="z. B. Gebäudebrand" /></label>
      <label><span>Ort</span><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Straße, Gebäude oder Treffpunkt" /></label>
      <label><span>Einheiten <small>optional</small></span><input value={units} onChange={(e) => setUnits(e.target.value)} placeholder="z. B. Löschzug 1, Rescue 2" /></label>
      <label><span>Fahrzeuge <small>optional</small></span><input value={vehicles} onChange={(e) => setVehicles(e.target.value)} placeholder="z. B. Engine 1, Ladder 1" /></label>
      <label><span>Lage</span><textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="Kurz beschreiben, was vor Ort los ist …" /></label>
      <label><span>Maßnahmen</span><textarea value={actions} onChange={(e) => setActions(e.target.value)} placeholder={'- Bereich abgesichert\n- Brandbekämpfung begonnen'} /></label>
      <button type="button" className="fire-primary" disabled={busy || type.trim().length < 2 || location.trim().length < 2} onClick={() => void save()}>{busy ? 'Speichert …' : 'Einsatz speichern'}</button>
    </div>
  </div>
}

function IncidentDetails({ item, context, reload, onError, onMessage }: { item: Incident; context: FireContext; reload: () => Promise<void>; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [type, setType] = useState(item.incident_type)
  const [location, setLocation] = useState(item.location)
  const [units, setUnits] = useState(item.units_text ?? '')
  const [vehicles, setVehicles] = useState(item.vehicles_text ?? '')
  const [situation, setSituation] = useState(item.situation_text ?? '')
  const [actions, setActions] = useState(item.actions_text ?? '')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setEditing(false); setType(item.incident_type); setLocation(item.location); setUnits(item.units_text ?? ''); setVehicles(item.vehicles_text ?? ''); setSituation(item.situation_text ?? ''); setActions(item.actions_text ?? ''); setNote('')
  }, [item.id, item.row_version])

  const save = async () => {
    setBusy(true); onError('')
    const { error } = await supabase.rpc('fire_update_incident', { target_incident: item.id, incident_type: type.trim(), incident_location: location.trim(), incident_units: units.trim() || null, incident_vehicles: vehicles.trim() || null, incident_situation: situation.trim() || null, incident_actions: actions.trim() || null, expected_row_version: item.row_version })
    setBusy(false)
    if (error) return onError('Änderung konnte nicht gespeichert werden. Bitte neu laden und erneut versuchen.')
    setEditing(false); onMessage(`${item.incident_number} wurde gespeichert.`); await reload()
  }

  const setState = async (next: 'open' | 'done') => {
    setBusy(true); onError('')
    const { error } = await supabase.rpc('fire_set_incident_state', { target_incident: item.id, next_state: next, expected_row_version: item.row_version })
    setBusy(false)
    if (error) return onError('Status konnte nicht geändert werden.')
    onMessage(next === 'done' ? `${item.incident_number} wurde abgeschlossen.` : `${item.incident_number} wurde wieder geöffnet.`); await reload()
  }

  const addNote = async () => {
    if (note.trim().length < 2) return
    setBusy(true); onError('')
    const { error } = await supabase.rpc('fire_add_incident_note', { target_incident: item.id, note_text: note.trim() })
    setBusy(false)
    if (error) return onError('Verlauf konnte nicht ergänzt werden.')
    setNote(''); await reload()
  }

  return <div className="fire-card fire-detail">
    <div className="fire-detail-head"><div><span className="eyebrow">{item.incident_number}</span><h3>{item.incident_type}</h3><small>{item.location} · {item.created_by_name ?? 'Fire & Rescue'} · {dateTimeFormatter.format(new Date(item.created_at))}</small></div><div className="fire-detail-actions">{context.can_manage_incidents && item.state === 'open' && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}<button type="button" className={item.state === 'open' ? 'is-active' : 'is-done'} disabled={busy || !context.can_manage_incidents} onClick={() => void setState(item.state === 'open' ? 'done' : 'open')}>{item.state === 'open' ? 'Als erledigt markieren' : 'Wieder öffnen'}</button></div></div>

    {editing ? <div className="fire-form fire-edit-form">
      <div className="fire-form-grid"><label><span>Einsatzart</span><input value={type} onChange={(e) => setType(e.target.value)} /></label><label><span>Ort</span><input value={location} onChange={(e) => setLocation(e.target.value)} /></label><label><span>Einheiten</span><input value={units} onChange={(e) => setUnits(e.target.value)} /></label><label><span>Fahrzeuge</span><input value={vehicles} onChange={(e) => setVehicles(e.target.value)} /></label></div>
      <label><span>Lage</span><textarea value={situation} onChange={(e) => setSituation(e.target.value)} /></label><label><span>Maßnahmen</span><textarea value={actions} onChange={(e) => setActions(e.target.value)} /></label>
      <div className="fire-button-row"><button type="button" onClick={() => setEditing(false)}>Abbrechen</button><button type="button" className="fire-primary" disabled={busy || type.trim().length < 2 || location.trim().length < 2} onClick={() => void save()}>Speichern</button></div>
    </div> : <div className="fire-detail-grid">
      <InfoBlock title="Einheiten" text={item.units_text || 'Keine eingetragen.'} /><InfoBlock title="Fahrzeuge" text={item.vehicles_text || 'Keine eingetragen.'} /><InfoBlock title="Lage" text={item.situation_text || 'Keine Lage eingetragen.'} wide /><InfoBlock title="Maßnahmen" text={item.actions_text || 'Keine Maßnahmen eingetragen.'} wide />
    </div>}

    <div className="fire-timeline"><div className="fire-block-head"><span>Verlauf</span></div>{context.can_manage_incidents && item.state === 'open' ? <div className="fire-note-row"><input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void addNote() }} placeholder="Kurzen Verlauf hinzufügen …" /><button type="button" disabled={busy || note.trim().length < 2} onClick={() => void addNote()}><Plus size={14} /> Hinzufügen</button></div> : null}<div className="fire-timeline-list">{item.timeline.length === 0 ? <p>Noch kein Verlauf.</p> : item.timeline.map((entry) => <div key={entry.id}><span>{dateTimeFormatter.format(new Date(entry.created_at))}</span><strong>{entry.body || 'Eintrag'}</strong><small>{entry.author_name ?? 'Fire & Rescue'}</small></div>)}</div></div>
  </div>
}

function InfoBlock({ title, text, wide = false }: { title: string; text: string; wide?: boolean }) {
  return <div className={`fire-info-block${wide ? ' is-wide' : ''}`}><span>{title}</span><p>{text}</p></div>
}

function ObjectsPanel({ context, onError, onMessage }: { context: FireContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [items, setItems] = useState<FireObject[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<FireObject | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async (needle = query) => {
    const { data, error } = await supabase.rpc('fire_list_objects', { search_text: needle.trim() || null })
    if (error) return onError('Objekte konnten nicht geladen werden.')
    setItems(Array.isArray(data) ? data as FireObject[] : [])
  }, [query, onError])
  useEffect(() => { void load('') }, [])

  return <section className="fire-section"><SearchLine value={query} setValue={setQuery} onSearch={() => void load(query)} placeholder="Objekt, Adresse oder Gefahr" /><div className="fire-two-column"><div className="fire-card"><div className="fire-card-head"><div><span className="eyebrow">OBJEKTE</span><h3>{items.length} gefunden</h3></div>{context.can_manage_objects ? <button type="button" className="fire-new-button" onClick={() => { setCreating(true); setSelected(null) }}><Plus size={15} /> Neues Objekt</button> : null}</div><div className="fire-list">{items.length === 0 ? <p>Keine Objekte vorhanden.</p> : items.map((item) => <button type="button" key={item.id} className={selected?.id === item.id ? 'is-active' : ''} onClick={() => { setSelected(item); setCreating(false) }}><span><strong>{item.name}</strong><small>{item.address || 'Keine Adresse'}{item.hazards_text ? ' · Gefahrhinweis' : ''}</small></span><ChevronRight size={15} /></button>)}</div></div>{creating || selected ? <ObjectEditor item={selected} context={context} onSaved={async () => { onMessage('Objekt wurde gespeichert.'); setCreating(false); setSelected(null); await load(query) }} onCancel={() => { setCreating(false); setSelected(null) }} onError={onError} /> : <EmptyChoice title="Objekt auswählen" text="Objekt öffnen oder ein neues Objekt anlegen." />}</div></section>
}

function ObjectEditor({ item, context, onSaved, onCancel, onError }: { item: FireObject | null; context: FireContext; onSaved: () => Promise<void>; onCancel: () => void; onError: (text: string) => void }) {
  const [name, setName] = useState(item?.name ?? '')
  const [address, setAddress] = useState(item?.address ?? '')
  const [access, setAccess] = useState(item?.access_text ?? '')
  const [hydrant, setHydrant] = useState(item?.hydrant_text ?? '')
  const [hazards, setHazards] = useState(item?.hazards_text ?? '')
  const [notes, setNotes] = useState(item?.notes_text ?? '')
  const [editing, setEditing] = useState(!item)
  const [busy, setBusy] = useState(false)
  useEffect(() => { setName(item?.name ?? ''); setAddress(item?.address ?? ''); setAccess(item?.access_text ?? ''); setHydrant(item?.hydrant_text ?? ''); setHazards(item?.hazards_text ?? ''); setNotes(item?.notes_text ?? ''); setEditing(!item) }, [item?.id, item?.row_version])

  const save = async () => {
    setBusy(true); onError('')
    const { error } = await supabase.rpc('fire_save_object', { target_object: item?.id ?? null, object_name: name.trim(), object_address: address.trim() || null, object_access: access.trim() || null, object_hydrant: hydrant.trim() || null, object_hazards: hazards.trim() || null, object_notes: notes.trim() || null, expected_row_version: item?.row_version ?? null })
    setBusy(false)
    if (error) return onError('Objekt konnte nicht gespeichert werden.')
    await onSaved()
  }

  return <div className="fire-card"><div className="fire-card-head"><div><span className="eyebrow">{item ? 'OBJEKT' : 'NEUES OBJEKT'}</span><h3>{item?.name ?? 'Objekt anlegen'}</h3></div><div className="fire-head-actions">{item && context.can_manage_objects && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}<button type="button" className="fire-icon-button" onClick={onCancel}><X size={15} /></button></div></div>{editing ? <div className="fire-form"><label><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Maze Bank Tower" /></label><label><span>Adresse / Ort</span><input value={address} onChange={(e) => setAddress(e.target.value)} /></label><label><span>Zufahrt</span><textarea value={access} onChange={(e) => setAccess(e.target.value)} placeholder="Beste Zufahrt, Tore, Besonderheiten …" /></label><label><span>Hydrant / Wasser</span><textarea value={hydrant} onChange={(e) => setHydrant(e.target.value)} placeholder="Standort oder Hinweis …" /></label><label><span>Gefahren</span><textarea value={hazards} onChange={(e) => setHazards(e.target.value)} placeholder="Gas, Hochspannung, schwierige Zufahrt …" /></label><label><span>Weitere Hinweise</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label><div className="fire-button-row"><button type="button" onClick={item ? () => setEditing(false) : onCancel}>Abbrechen</button><button type="button" className="fire-primary" disabled={busy || name.trim().length < 2} onClick={() => void save()}>Speichern</button></div></div> : <div className="fire-detail-grid"><InfoBlock title="Adresse / Ort" text={item?.address || 'Nicht eingetragen.'} /><InfoBlock title="Zufahrt" text={item?.access_text || 'Nicht eingetragen.'} /><InfoBlock title="Hydrant / Wasser" text={item?.hydrant_text || 'Nicht eingetragen.'} /><InfoBlock title="Gefahren" text={item?.hazards_text || 'Keine besonderen Gefahren eingetragen.'} /><InfoBlock title="Weitere Hinweise" text={item?.notes_text || 'Keine.'} wide /></div>}</div>
}

function AssetsPanel({ context, onError, onMessage }: { context: FireContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [items, setItems] = useState<FireAsset[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<FireAsset | null>(null)
  const [creating, setCreating] = useState(false)
  const load = useCallback(async (needle = query) => { const { data, error } = await supabase.rpc('fire_list_assets', { search_text: needle.trim() || null }); if (error) return onError('Fahrzeuge und Geräte konnten nicht geladen werden.'); setItems(Array.isArray(data) ? data as FireAsset[] : []) }, [query, onError])
  useEffect(() => { void load('') }, [])
  return <section className="fire-section"><SearchLine value={query} setValue={setQuery} onSearch={() => void load(query)} placeholder="Fahrzeug, Gerät oder Kennung" /><div className="fire-two-column"><div className="fire-card"><div className="fire-card-head"><div><span className="eyebrow">FAHRZEUGE / GERÄTE</span><h3>{items.length} Einträge</h3></div>{context.can_manage_assets ? <button type="button" className="fire-new-button" onClick={() => { setCreating(true); setSelected(null) }}><Plus size={15} /> Neu</button> : null}</div><div className="fire-list">{items.length === 0 ? <p>Noch keine Fahrzeuge oder Geräte eingetragen.</p> : items.map((item) => <button type="button" key={item.id} className={selected?.id === item.id ? 'is-active' : ''} onClick={() => { setSelected(item); setCreating(false) }}><span><strong>{item.name}</strong><small>{item.asset_type === 'vehicle' ? 'Fahrzeug' : 'Gerät'}{item.identifier ? ` · ${item.identifier}` : ''} · {assetStatusLabels[item.status]}</small></span><span className={`fire-status is-${item.status}`}>{assetStatusLabels[item.status]}</span></button>)}</div></div>{creating || selected ? <AssetEditor item={selected} context={context} onSaved={async () => { onMessage('Eintrag wurde gespeichert.'); setCreating(false); setSelected(null); await load(query) }} onCancel={() => { setCreating(false); setSelected(null) }} onError={onError} /> : <EmptyChoice title="Fahrzeug oder Gerät auswählen" text="Links einen Eintrag öffnen oder neu anlegen." />}</div></section>
}

function AssetEditor({ item, context, onSaved, onCancel, onError }: { item: FireAsset | null; context: FireContext; onSaved: () => Promise<void>; onCancel: () => void; onError: (text: string) => void }) {
  const [type, setType] = useState<FireAsset['asset_type']>(item?.asset_type ?? 'vehicle')
  const [name, setName] = useState(item?.name ?? '')
  const [identifier, setIdentifier] = useState(item?.identifier ?? '')
  const [status, setStatus] = useState<FireAsset['status']>(item?.status ?? 'ready')
  const [note, setNote] = useState(item?.note ?? '')
  const [checklist, setChecklist] = useState(item?.checklist_text ?? '')
  const [editing, setEditing] = useState(!item)
  const [busy, setBusy] = useState(false)
  useEffect(() => { setType(item?.asset_type ?? 'vehicle'); setName(item?.name ?? ''); setIdentifier(item?.identifier ?? ''); setStatus(item?.status ?? 'ready'); setNote(item?.note ?? ''); setChecklist(item?.checklist_text ?? ''); setEditing(!item) }, [item?.id, item?.row_version])
  const save = async () => { setBusy(true); onError(''); const { error } = await supabase.rpc('fire_save_asset', { target_asset: item?.id ?? null, asset_type: type, asset_name: name.trim(), asset_identifier: identifier.trim() || null, asset_status: status, asset_note: note.trim() || null, asset_checklist: checklist.trim() || null, expected_row_version: item?.row_version ?? null }); setBusy(false); if (error) return onError('Eintrag konnte nicht gespeichert werden.'); await onSaved() }
  return <div className="fire-card"><div className="fire-card-head"><div><span className="eyebrow">{item ? 'EINTRAG' : 'NEU'}</span><h3>{item?.name ?? 'Fahrzeug / Gerät'}</h3></div><div className="fire-head-actions">{item && context.can_manage_assets && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}<button type="button" className="fire-icon-button" onClick={onCancel}><X size={15} /></button></div></div>{editing ? <div className="fire-form"><div className="fire-form-grid"><label><span>Art</span><select value={type} onChange={(e) => setType(e.target.value as FireAsset['asset_type'])}><option value="vehicle">Fahrzeug</option><option value="equipment">Gerät</option></select></label><label><span>Status</span><select value={status} onChange={(e) => setStatus(e.target.value as FireAsset['status'])}>{Object.entries(assetStatusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Engine 1" /></label><label><span>Kennung <small>optional</small></span><input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="z. B. E-01" /></label></div><label><span>Hinweis</span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Defekt, Besonderheit oder kurzer Hinweis …" /></label><label><span>Checkliste</span><textarea value={checklist} onChange={(e) => setChecklist(e.target.value)} placeholder={'- Licht geprüft\n- Funk geprüft\n- Ausrüstung vollständig'} /></label><div className="fire-button-row"><button type="button" onClick={item ? () => setEditing(false) : onCancel}>Abbrechen</button><button type="button" className="fire-primary" disabled={busy || name.trim().length < 2} onClick={() => void save()}>Speichern</button></div></div> : <div className="fire-detail-grid"><InfoBlock title="Art" text={item?.asset_type === 'vehicle' ? 'Fahrzeug' : 'Gerät'} /><InfoBlock title="Status" text={item ? assetStatusLabels[item.status] : ''} /><InfoBlock title="Kennung" text={item?.identifier || 'Keine.'} /><InfoBlock title="Hinweis" text={item?.note || 'Kein Hinweis.'} /><InfoBlock title="Checkliste" text={item?.checklist_text || 'Keine Checkliste hinterlegt.'} wide /></div>}</div>
}

function KnowledgePanel({ context, onError, onMessage }: { context: FireContext; onError: (text: string) => void; onMessage: (text: string) => void }) {
  const [items, setItems] = useState<KnowledgeArticle[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null)
  const [creating, setCreating] = useState(false)
  const load = useCallback(async (needle = query) => { const { data, error } = await supabase.rpc('fire_list_knowledge', { search_text: needle.trim() || null }); if (error) return onError('Wissen konnte nicht geladen werden.'); setItems(Array.isArray(data) ? data as KnowledgeArticle[] : []) }, [query, onError])
  useEffect(() => { void load('') }, [])
  return <section className="fire-section"><SearchLine value={query} setValue={setQuery} onSearch={() => void load(query)} placeholder="Thema, Kategorie oder Inhalt" /><div className="fire-two-column"><div className="fire-card"><div className="fire-card-head"><div><span className="eyebrow">WISSEN</span><h3>{items.length} Einträge</h3></div>{context.can_manage_knowledge ? <button type="button" className="fire-new-button" onClick={() => { setCreating(true); setSelected(null) }}><Plus size={15} /> Neuer Eintrag</button> : null}</div><div className="fire-list">{items.length === 0 ? <p>Noch keine Wissenseinträge vorhanden.</p> : items.map((item) => <button type="button" key={item.id} className={selected?.id === item.id ? 'is-active' : ''} onClick={() => { setSelected(item); setCreating(false) }}><span><strong>{item.title}</strong><small>{item.category || 'Allgemein'}</small></span><ChevronRight size={15} /></button>)}</div></div>{creating || selected ? <KnowledgeEditor item={selected} context={context} onSaved={async () => { onMessage('Wissenseintrag wurde gespeichert.'); setCreating(false); setSelected(null); await load(query) }} onCancel={() => { setCreating(false); setSelected(null) }} onError={onError} /> : <EmptyChoice title="Eintrag auswählen" text="Links einen Wissenseintrag öffnen oder neu anlegen." />}</div></section>
}

function KnowledgeEditor({ item, context, onSaved, onCancel, onError }: { item: KnowledgeArticle | null; context: FireContext; onSaved: () => Promise<void>; onCancel: () => void; onError: (text: string) => void }) {
  const [title, setTitle] = useState(item?.title ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [body, setBody] = useState(item?.body ?? '')
  const [editing, setEditing] = useState(!item)
  const [busy, setBusy] = useState(false)
  useEffect(() => { setTitle(item?.title ?? ''); setCategory(item?.category ?? ''); setBody(item?.body ?? ''); setEditing(!item) }, [item?.id, item?.row_version])
  const save = async () => { setBusy(true); onError(''); const { error } = await supabase.rpc('fire_save_knowledge', { target_article: item?.id ?? null, article_title: title.trim(), article_category: category.trim() || null, article_body: body.trim(), expected_row_version: item?.row_version ?? null }); setBusy(false); if (error) return onError('Wissenseintrag konnte nicht gespeichert werden.'); await onSaved() }
  return <div className="fire-card"><div className="fire-card-head"><div><span className="eyebrow">{item ? item.category || 'WISSEN' : 'NEUER EINTRAG'}</span><h3>{item?.title ?? 'Wissen hinzufügen'}</h3></div><div className="fire-head-actions">{item && context.can_manage_knowledge && !editing ? <button type="button" onClick={() => setEditing(true)}>Bearbeiten</button> : null}<button type="button" className="fire-icon-button" onClick={onCancel}><X size={15} /></button></div></div>{editing ? <div className="fire-form"><label><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label><label><span>Kategorie <small>optional</small></span><input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="z. B. Technische Hilfe" /></label><label><span>Inhalt</span><textarea className="fire-knowledge-textarea" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Kurze, praktische Anleitung …" /></label><div className="fire-button-row"><button type="button" onClick={item ? () => setEditing(false) : onCancel}>Abbrechen</button><button type="button" className="fire-primary" disabled={busy || title.trim().length < 2 || body.trim().length < 2} onClick={() => void save()}>Speichern</button></div></div> : <div className="fire-article"><p>{item?.body}</p><small>Zuletzt bearbeitet {item ? dateTimeFormatter.format(new Date(item.updated_at)) : ''}{item?.updated_by_name ? ` · ${item.updated_by_name}` : ''}</small></div>}</div>
}

function EmptyChoice({ title, text }: { title: string; text: string }) {
  return <div className="fire-card fire-placeholder"><ClipboardCheck size={28} /><div><span className="eyebrow">DETAILS</span><h3>{title}</h3><p>{text}</p></div></div>
}
