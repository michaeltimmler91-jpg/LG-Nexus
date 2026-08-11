import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Building2, CalendarDays, Clock3, MapPin, RefreshCw, Search, Ticket } from 'lucide-react'
import { supabase } from './lib/supabase'

type EventStatus = 'planned' | 'live' | 'finished' | 'cancelled'
type EventFilter = 'upcoming' | 'live' | 'finished' | 'cancelled' | 'all'

type PublicEvent = {
  id: string
  organization_id: string
  organization_name: string
  organization_short_name: string | null
  organization_logo_url: string | null
  title: string
  description: string
  category: string | null
  location_label: string | null
  starts_at: string
  ends_at: string | null
  status: EventStatus
  image_url: string | null
  created_at: string
  updated_at: string
}

const statusLabels: Record<EventStatus, string> = {
  planned: 'Geplant',
  live: 'Läuft',
  finished: 'Beendet',
  cancelled: 'Abgesagt',
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
})

function effectiveStatus(event: PublicEvent): EventStatus {
  if (event.status === 'cancelled' || event.status === 'finished' || event.status === 'live') return event.status
  const now = Date.now()
  const start = new Date(event.starts_at).getTime()
  const end = event.ends_at ? new Date(event.ends_at).getTime() : null
  if (start <= now && end !== null && end <= now) return 'finished'
  if (start <= now && (end === null || end > now)) return 'live'
  return 'planned'
}

function initials(event: PublicEvent) {
  if (event.organization_short_name?.trim()) return event.organization_short_name.trim().slice(0, 5).toUpperCase()
  return event.organization_name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'LS'
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function formatTimeRange(event: PublicEvent) {
  const start = timeFormatter.format(new Date(event.starts_at))
  if (!event.ends_at) return `${start} Uhr`
  const end = timeFormatter.format(new Date(event.ends_at))
  return `${start} – ${end} Uhr`
}

export default function EventsLiveMount() {
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
    const syncFromDom = () => {
      const button = document.querySelector('.nav-button[aria-label="Events"]')
      setActive(Boolean(button?.classList.contains('is-active')))
    }
    syncFromDom()

    const onClick = (event: MouseEvent) => {
      const element = event.target as Element | null
      const button = element?.closest('.nav-button')
      if (!button) return
      setActive(button.getAttribute('aria-label') === 'Events')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (active) document.body.dataset.nexusEventsWorkspace = 'true'
    else delete document.body.dataset.nexusEventsWorkspace
    return () => { delete document.body.dataset.nexusEventsWorkspace }
  }, [active])

  if (!target || !active) return null

  return createPortal(
    <div className="nexus-events-page-slot">
      <EventsDirectory />
    </div>,
    target,
  )
}

function EventsDirectory() {
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<EventFilter>('upcoming')
  const [selected, setSelected] = useState<PublicEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: loadError } = await supabase.rpc('events_list_public', { search_text: null })
    if (loadError) {
      setEvents([])
      setError('Die Veranstaltungen konnten gerade nicht geladen werden.')
    } else {
      setEvents(Array.isArray(data) ? data as PublicEvent[] : [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const decorated = useMemo(() => events.map((event) => ({ event, effective: effectiveStatus(event) })), [events])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return decorated.filter(({ event, effective }) => {
      const matchesFilter = filter === 'all'
        || (filter === 'upcoming' && (effective === 'planned' || effective === 'live'))
        || effective === filter
      if (!matchesFilter) return false
      if (!term) return true
      return [event.title, event.description, event.category ?? '', event.location_label ?? '', event.organization_name]
        .join(' ').toLowerCase().includes(term)
    }).sort((a, b) => {
      if (filter === 'finished' || filter === 'cancelled') return new Date(b.event.starts_at).getTime() - new Date(a.event.starts_at).getTime()
      return new Date(a.event.starts_at).getTime() - new Date(b.event.starts_at).getTime()
    })
  }, [decorated, filter, search])

  const upcomingCount = decorated.filter(({ effective }) => effective === 'planned' || effective === 'live').length
  const liveCount = decorated.filter(({ effective }) => effective === 'live').length

  if (selected) return <EventDetail event={selected} onBack={() => setSelected(null)} />

  return (
    <div className="page-content live-events">
      <section className="live-events-hero">
        <div className="live-events-hero-icon"><Ticket size={30} /></div>
        <div>
          <span className="eyebrow">LOS SANTOS · VERANSTALTUNGEN</span>
          <h2>Events</h2>
          <p>Was in der Stadt ansteht – direkt von den Veranstaltern veröffentlicht.</p>
        </div>
        <div className="live-events-hero-stats">
          <span><strong>{upcomingCount}</strong> kommende</span>
          <span><strong>{liveCount}</strong> laufen gerade</span>
        </div>
        <button type="button" className="live-events-refresh" onClick={() => void load()} disabled={loading}><RefreshCw size={15} /> Aktualisieren</button>
      </section>

      <section className="live-events-toolbar">
        <label className="live-events-search">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Event, Veranstalter oder Ort suchen …" />
        </label>
        <div className="live-events-filters">
          {([
            ['upcoming', 'Kommende'],
            ['live', 'Läuft'],
            ['finished', 'Beendet'],
            ['cancelled', 'Abgesagt'],
            ['all', 'Alle'],
          ] as Array<[EventFilter, string]>).map(([key, label]) => (
            <button key={key} type="button" className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
      </section>

      {error ? <div className="live-events-message">{error}</div> : null}

      <div className="live-events-grid">
        {loading && events.length === 0 ? (
          <div className="live-events-empty">Veranstaltungen werden geladen …</div>
        ) : filtered.length === 0 ? (
          <div className="live-events-empty">Hier ist aktuell nichts eingetragen.</div>
        ) : filtered.map(({ event, effective }) => (
          <button type="button" className="live-event-card" key={event.id} onClick={() => setSelected(event)}>
            <div
              className={`live-event-image ${event.image_url ? 'has-image' : ''}`}
              style={event.image_url ? { backgroundImage: `linear-gradient(180deg, rgba(8,12,18,.04), rgba(8,12,18,.76)), url(${event.image_url})` } : undefined}
            >
              {!event.image_url ? <Ticket size={30} /> : null}
              <span className={`live-event-status is-${effective}`}>{statusLabels[effective]}</span>
              {event.category ? <span className="live-event-category">{event.category}</span> : null}
            </div>
            <div className="live-event-card-body">
              <div className="live-event-date"><CalendarDays size={15} /><strong>{formatDate(event.starts_at)}</strong><span>{formatTimeRange(event)}</span></div>
              <h3>{event.title}</h3>
              <p>{event.description.trim() || 'Weitere Informationen folgen.'}</p>
              <div className="live-event-meta">
                <span><MapPin size={14} /> {event.location_label || 'Ort noch nicht angegeben'}</span>
                <span><Building2 size={14} /> {event.organization_name}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function EventDetail({ event, onBack }: { event: PublicEvent; onBack: () => void }) {
  const status = effectiveStatus(event)
  return (
    <div className="page-content live-event-detail">
      <button type="button" className="live-event-back" onClick={onBack}><ArrowLeft size={16} /> Zurück zu Events</button>

      <section
        className={`live-event-detail-hero ${event.image_url ? 'has-image' : ''}`}
        style={event.image_url ? { backgroundImage: `linear-gradient(90deg, rgba(8,12,18,.96), rgba(8,12,18,.44)), url(${event.image_url})` } : undefined}
      >
        <div className="live-event-detail-copy">
          <div className="live-event-detail-tags">
            <span className={`live-event-status is-${status}`}>{statusLabels[status]}</span>
            {event.category ? <span className="live-event-category">{event.category}</span> : null}
          </div>
          <h2>{event.title}</h2>
          <p>{event.description.trim() || 'Für diese Veranstaltung wurde noch keine Beschreibung hinterlegt.'}</p>
        </div>
      </section>

      <div className="live-event-detail-grid">
        <article><CalendarDays size={22} /><span>Datum</span><strong>{formatDate(event.starts_at)}</strong></article>
        <article><Clock3 size={22} /><span>Uhrzeit</span><strong>{formatTimeRange(event)}</strong></article>
        <article><MapPin size={22} /><span>Ort</span><strong>{event.location_label || 'Noch nicht angegeben'}</strong></article>
        <article>
          <div
            className={`live-event-org-logo ${event.organization_logo_url ? 'has-logo' : ''}`}
            style={event.organization_logo_url ? { backgroundImage: `url(${event.organization_logo_url})` } : undefined}
          >{!event.organization_logo_url ? initials(event) : null}</div>
          <span>Veranstalter</span><strong>{event.organization_name}</strong>
        </article>
      </div>
    </div>
  )
}
