import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, Check, Clock3, ImagePlus, MapPin, Plus, RefreshCw, Save, Ticket, X } from 'lucide-react'
import { supabase } from './lib/supabase'

type EventStatus = 'planned' | 'live' | 'finished' | 'cancelled'

type OrganizationContext = {
  organization_id: string
  name: string
  can_events: boolean
}

type ManagedEvent = {
  id: string
  organization_id: string
  title: string
  description: string
  category: string | null
  location_label: string | null
  starts_at: string
  ends_at: string | null
  status: EventStatus
  image_url: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  row_version: number
}

type Draft = {
  title: string
  description: string
  category: string
  location: string
  startsAt: string
  endsAt: string
  status: EventStatus
  imageUrl: string
  isPublic: boolean
}

const statusLabels: Record<EventStatus, string> = {
  planned: 'Geplant',
  live: 'Läuft',
  finished: 'Beendet',
  cancelled: 'Abgesagt',
}

const emptyDraft: Draft = {
  title: '',
  description: '',
  category: '',
  location: '',
  startsAt: '',
  endsAt: '',
  status: 'planned',
  imageUrl: '',
  isPublic: true,
}

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

function toLocalInput(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function validateImageUrl(value: string) {
  const clean = value.trim()
  if (!clean) return null
  try {
    const url = new URL(clean)
    if (url.protocol !== 'https:') return 'Bitte nur https://-Bildlinks verwenden.'
    if (url.hostname.toLowerCase() === 'pfbjblrtwpnhsuvshpcc.supabase.co') return 'Bitte einen externen Bildhoster verwenden.'
    return null
  } catch {
    return 'Der Bildlink ist keine gültige URL.'
  }
}

function draftFromEvent(event: ManagedEvent): Draft {
  return {
    title: event.title,
    description: event.description ?? '',
    category: event.category ?? '',
    location: event.location_label ?? '',
    startsAt: toLocalInput(event.starts_at),
    endsAt: toLocalInput(event.ends_at),
    status: event.status,
    imageUrl: event.image_url ?? '',
    isPublic: event.is_public,
  }
}

function selectedOrganizationId(panel: Element, rows: OrganizationContext[]) {
  const serviceHost = panel.closest('.service-org-admin-host') as HTMLElement | null
  if (serviceHost?.dataset.organizationId) return serviceHost.dataset.organizationId
  const select = panel.querySelector<HTMLSelectElement>('.org-control-select select')
  if (select?.value) return select.value
  return rows[0]?.organization_id ?? ''
}

export default function OrganizationEventsMount() {
  const [panel, setPanel] = useState<Element | null>(null)
  const [tabsTarget, setTabsTarget] = useState<Element | null>(null)
  const [organization, setOrganization] = useState<OrganizationContext | null>(null)
  const [active, setActive] = useState(false)

  const syncTargets = useCallback(() => {
    const nextPanel = document.querySelector('.org-control-panel')
    const nextTabs = nextPanel?.querySelector('.org-control-tabs') ?? null
    setPanel((current) => current === nextPanel ? current : nextPanel)
    setTabsTarget((current) => current === nextTabs ? current : nextTabs)
    if (!nextPanel) setActive(false)
  }, [])

  const loadOrganization = useCallback(async (currentPanel: Element | null) => {
    if (!currentPanel) {
      setOrganization(null)
      return
    }
    const { data, error } = await supabase.rpc('organization_management_get_context')
    if (error) {
      setOrganization(null)
      return
    }
    const rows = Array.isArray(data) ? data as OrganizationContext[] : []
    const id = selectedOrganizationId(currentPanel, rows)
    setOrganization(rows.find((row) => row.organization_id === id && row.can_events) ?? null)
  }, [])

  useEffect(() => {
    syncTargets()
    const observer = new MutationObserver(syncTargets)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [syncTargets])

  useEffect(() => { void loadOrganization(panel) }, [panel, loadOrganization])

  useEffect(() => {
    const onChange = (event: Event) => {
      const element = event.target as Element | null
      if (!element?.matches('.org-control-select select')) return
      setActive(false)
      void loadOrganization(panel)
    }
    const onClick = (event: MouseEvent) => {
      const element = event.target as Element | null
      if (element?.closest('.org-control-tabs > button:not(.org-events-tab-button)')) setActive(false)
    }
    document.addEventListener('change', onChange)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('change', onChange)
      document.removeEventListener('click', onClick)
    }
  }, [panel, loadOrganization])

  useEffect(() => {
    if (active) document.body.dataset.nexusOrganizationEvents = 'true'
    else delete document.body.dataset.nexusOrganizationEvents
    return () => { delete document.body.dataset.nexusOrganizationEvents }
  }, [active])

  if (!panel || !tabsTarget || !organization) return null

  return (
    <>
      {createPortal(
        <button type="button" className={`org-events-tab-button ${active ? 'is-active' : ''}`} onClick={() => setActive(true)}>
          <Ticket size={14} /> Events
        </button>,
        tabsTarget,
      )}
      {active ? createPortal(<OrganizationEventsPanel organization={organization} />, panel) : null}
    </>
  )
}

function OrganizationEventsPanel({ organization }: { organization: OrganizationContext }) {
  const [events, setEvents] = useState<ManagedEvent[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const selected = useMemo(() => events.find((event) => event.id === selectedId) ?? null, [events, selectedId])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: loadError } = await supabase.rpc('organization_events_list', { target_org: organization.organization_id })
    setLoading(false)
    if (loadError) {
      setEvents([])
      setError('Die Events dieser Organisation konnten nicht geladen werden.')
      return
    }
    const next = Array.isArray(data) ? data as ManagedEvent[] : []
    setEvents(next)
    setSelectedId((current) => current && next.some((event) => event.id === current) ? current : null)
  }, [organization.organization_id])

  useEffect(() => {
    setSelectedId(null)
    setCreating(false)
    setDraft(emptyDraft)
    void load()
  }, [organization.organization_id, load])

  const openEvent = (event: ManagedEvent) => {
    setSelectedId(event.id)
    setCreating(false)
    setDraft(draftFromEvent(event))
    setError('')
    setNotice('')
  }

  const startNew = () => {
    setSelectedId(null)
    setCreating(true)
    setDraft(emptyDraft)
    setError('')
    setNotice('')
  }

  const cancelEdit = () => {
    setSelectedId(null)
    setCreating(false)
    setDraft(emptyDraft)
  }

  const save = async () => {
    const imageError = validateImageUrl(draft.imageUrl)
    if (imageError) return setError(imageError)
    if (draft.title.trim().length < 3) return setError('Bitte einen Eventnamen eintragen.')
    if (!draft.startsAt) return setError('Bitte Startdatum und Uhrzeit eintragen.')
    if (draft.endsAt && new Date(draft.endsAt).getTime() < new Date(draft.startsAt).getTime()) return setError('Das Ende darf nicht vor dem Start liegen.')

    setWorking(true)
    setError('')
    setNotice('')
    const { data, error: saveError } = await supabase.rpc('organization_events_save', {
      target_org: organization.organization_id,
      target_event: selected?.id ?? null,
      event_title: draft.title.trim(),
      event_description: draft.description.trim(),
      event_category: draft.category.trim() || null,
      event_location: draft.location.trim() || null,
      event_starts_at: new Date(draft.startsAt).toISOString(),
      event_ends_at: draft.endsAt ? new Date(draft.endsAt).toISOString() : null,
      event_status: draft.status,
      event_image_url: draft.imageUrl.trim() || null,
      event_is_public: draft.isPublic,
      expected_row_version: selected?.row_version ?? null,
    })
    setWorking(false)

    if (saveError) {
      setError(saveError.message?.includes('conflict') ? 'Das Event wurde inzwischen geändert. Bitte neu laden.' : 'Das Event konnte nicht gespeichert werden.')
      return
    }

    const saved = data as ManagedEvent | null
    setNotice(selected ? 'Event aktualisiert.' : 'Event angelegt.')
    await load()
    setCreating(false)
    if (saved?.id) {
      setSelectedId(saved.id)
      setDraft(draftFromEvent(saved))
    }
    window.dispatchEvent(new CustomEvent('nexus:events-changed'))
  }

  return (
    <div className="org-events-admin-panel">
      <div className="org-events-admin-head">
        <div>
          <span className="eyebrow">VERANSTALTUNGEN</span>
          <h3>Events verwalten</h3>
          <p>{organization.name} · Öffentliche Events erscheinen automatisch im Stadtbereich.</p>
        </div>
        <div className="org-events-admin-actions">
          <button type="button" onClick={() => void load()} disabled={loading || working}><RefreshCw size={14} /> Aktualisieren</button>
          <button type="button" className="primary-button" onClick={startNew}><Plus size={14} /> Neues Event</button>
        </div>
      </div>

      {error ? <div className="org-control-message is-error">{error}</div> : null}
      {notice ? <div className="org-control-message is-success"><Check size={14} /> {notice}</div> : null}

      <div className="org-events-admin-layout">
        <section className="org-events-admin-list">
          {loading && events.length === 0 ? <div className="org-events-admin-empty">Events werden geladen …</div> : null}
          {!loading && events.length === 0 ? <div className="org-events-admin-empty">Noch keine Events angelegt.</div> : null}
          {events.map((event) => (
            <button type="button" key={event.id} className={selectedId === event.id && !creating ? 'is-active' : ''} onClick={() => openEvent(event)}>
              <span className={`org-event-list-status is-${event.status}`} />
              <div><strong>{event.title}</strong><small>{dateTimeFormatter.format(new Date(event.starts_at))} · {event.location_label || 'Ort offen'}</small></div>
              <span>{statusLabels[event.status]}</span>
            </button>
          ))}
        </section>

        <section className="org-events-editor">
          {!creating && !selected ? (
            <div className="org-events-admin-empty is-editor"><Ticket size={28} /><strong>Event auswählen</strong><span>Links ein Event öffnen oder ein neues anlegen.</span></div>
          ) : (
            <>
              <div className="org-events-editor-head">
                <div><span className="eyebrow">{creating ? 'NEUES EVENT' : 'EVENT BEARBEITEN'}</span><h3>{creating ? 'Veranstaltung anlegen' : selected?.title}</h3></div>
                <button type="button" onClick={cancelEdit}><X size={15} /></button>
              </div>

              <div className="org-events-form">
                <label className="wide"><span>Eventname</span><input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="z. B. Open Garage Night" /></label>
                <label><span>Kategorie</span><input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} placeholder="z. B. Stadtfest" /></label>
                <label><span><MapPin size={13} /> Ort</span><input value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} placeholder="z. B. Vespucci Beach" /></label>
                <label><span><CalendarDays size={13} /> Start</span><input type="datetime-local" value={draft.startsAt} onChange={(event) => setDraft((current) => ({ ...current, startsAt: event.target.value }))} /></label>
                <label><span><Clock3 size={13} /> Ende <small>optional</small></span><input type="datetime-local" value={draft.endsAt} onChange={(event) => setDraft((current) => ({ ...current, endsAt: event.target.value }))} /></label>
                <label className="wide"><span>Beschreibung</span><textarea rows={5} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Was erwartet die Besucher?" /></label>
                <label className="wide"><span><ImagePlus size={13} /> Titelbild · externe https://-URL</span><input type="url" value={draft.imageUrl} onChange={(event) => setDraft((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="https://bilder.example.de/event.webp" /></label>
              </div>

              {draft.imageUrl.trim() && !validateImageUrl(draft.imageUrl) ? <div className="org-event-image-preview" style={{ backgroundImage: `url(${draft.imageUrl.trim()})` }} /> : null}
              {validateImageUrl(draft.imageUrl) ? <small className="org-event-image-error">{validateImageUrl(draft.imageUrl)}</small> : null}

              <div className="org-events-status-row">
                <span>Status</span>
                {(['planned','live','finished','cancelled'] as EventStatus[]).map((status) => (
                  <button type="button" key={status} className={`${draft.status === status ? 'is-active' : ''} is-${status}`} onClick={() => setDraft((current) => ({ ...current, status }))}>{statusLabels[status]}</button>
                ))}
              </div>

              <label className="org-control-toggle"><input type="checkbox" checked={draft.isPublic} onChange={(event) => setDraft((current) => ({ ...current, isPublic: event.target.checked }))} /><span>Öffentlich unter Events anzeigen</span></label>

              <div className="org-events-save-row">
                <button type="button" className="primary-button" onClick={() => void save()} disabled={working}><Save size={14} /> {working ? 'Speichert …' : 'Event speichern'}</button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
