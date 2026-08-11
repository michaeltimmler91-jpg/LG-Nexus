import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Building2, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, RefreshCw, Ticket, Trash2 } from 'lucide-react'
import { supabase } from './lib/supabase'

type EventStatus = 'planned' | 'live' | 'finished' | 'cancelled'

type CalendarEvent = {
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
  saved_at: string
}

const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const monthFormatter = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
const dateFormatter = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' })

const statusLabels: Record<EventStatus, string> = {
  planned: 'Geplant',
  live: 'Läuft',
  finished: 'Beendet',
  cancelled: 'Abgesagt',
}

function effectiveStatus(event: CalendarEvent): EventStatus {
  if (event.status === 'cancelled' || event.status === 'finished' || event.status === 'live') return event.status
  const now = Date.now()
  const start = new Date(event.starts_at).getTime()
  const end = event.ends_at ? new Date(event.ends_at).getTime() : null
  if (start <= now && end !== null && end <= now) return 'finished'
  if (start <= now && (end === null || end > now)) return 'live'
  return 'planned'
}

function sameDay(value: string, year: number, month: number, day: number) {
  const date = new Date(value)
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
}

function openNavigation(label: string) {
  document.querySelector<HTMLButtonElement>(`.nav-button[aria-label="${label}"]`)?.click()
}

export default function CalendarLiveMount() {
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
      const button = document.querySelector('.nav-button[aria-label="Kalender"]')
      setActive(Boolean(button?.classList.contains('is-active')))
    }
    syncFromDom()

    const onClick = (event: MouseEvent) => {
      const element = event.target as Element | null
      const button = element?.closest('.nav-button')
      if (!button) return
      setActive(button.getAttribute('aria-label') === 'Kalender')
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (active) document.body.dataset.nexusCalendarWorkspace = 'true'
    else delete document.body.dataset.nexusCalendarWorkspace
    return () => { delete document.body.dataset.nexusCalendarWorkspace }
  }, [active])

  if (!target || !active) return null
  return createPortal(<div className="nexus-calendar-page-slot"><CalendarWorkspace /></div>, target)
}

function CalendarWorkspace() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workingId, setWorkingId] = useState<string | null>(null)
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: loadError } = await supabase.rpc('calendar_list_my_events')
    setLoading(false)
    if (loadError) {
      setEvents([])
      setError('Dein Kalender konnte gerade nicht geladen werden.')
      return
    }
    setEvents(Array.isArray(data) ? data as CalendarEvent[] : [])
  }, [])

  useEffect(() => {
    let mounted = true
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSignedIn(Boolean(data.session))
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => { if (mounted) setSignedIn(Boolean(session)) }, 0)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (signedIn === true) void load()
    if (signedIn === false) setEvents([])
  }, [signedIn, load])

  useEffect(() => {
    const refresh = () => { if (signedIn) void load() }
    window.addEventListener('nexus:calendar-changed', refresh)
    return () => window.removeEventListener('nexus:calendar-changed', refresh)
  }, [signedIn, load])

  const monthCells = useMemo(() => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const firstDayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    return [
      ...Array.from({ length: firstDayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ]
  }, [month])

  const upcoming = useMemo(() => [...events]
    .filter((event) => effectiveStatus(event) !== 'finished')
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()), [events])

  const remove = async (eventId: string) => {
    setWorkingId(eventId)
    setError('')
    const { error: removeError } = await supabase.rpc('calendar_set_event_saved', { target_event: eventId, should_save: false })
    setWorkingId(null)
    if (removeError) {
      setError('Das Event konnte nicht aus deinem Kalender entfernt werden.')
      return
    }
    setEvents((current) => current.filter((event) => event.id !== eventId))
    window.dispatchEvent(new CustomEvent('nexus:calendar-changed'))
  }

  if (signedIn === null) return <div className="page-content live-calendar"><div className="live-calendar-empty">Kalender wird geladen …</div></div>

  if (!signedIn) {
    return (
      <div className="page-content live-calendar">
        <section className="live-calendar-hero">
          <div className="live-calendar-hero-icon"><CalendarDays size={30} /></div>
          <div><span className="eyebrow">PERSÖNLICHER BEREICH</span><h2>Mein Kalender</h2><p>Speichere Veranstaltungen und behalte deine Termine an einem Ort.</p></div>
        </section>
        <div className="live-calendar-empty is-login">
          <CalendarDays size={34} />
          <h3>Bitte anmelden</h3>
          <p>Dein persönlicher Kalender ist mit deinem Nexus-Konto verbunden.</p>
          <button type="button" className="primary-button" onClick={() => openNavigation('Account')}>Zum Account</button>
        </div>
      </div>
    )
  }

  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  return (
    <div className="page-content live-calendar">
      <section className="live-calendar-hero">
        <div className="live-calendar-hero-icon"><CalendarDays size={30} /></div>
        <div><span className="eyebrow">PERSÖNLICHER BEREICH</span><h2>Mein Kalender</h2><p>Gespeicherte Events bleiben mit dem Original verknüpft und zeigen immer die aktuellen Angaben.</p></div>
        <div className="live-calendar-count"><strong>{events.length}</strong><span>gespeicherte Events</span></div>
        <button type="button" className="live-calendar-refresh" onClick={() => void load()} disabled={loading}><RefreshCw size={15} /> Aktualisieren</button>
      </section>

      {error ? <div className="live-calendar-message">{error}</div> : null}

      <section className="live-calendar-toolbar">
        <button type="button" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}><ChevronLeft size={17} /></button>
        <strong>{monthFormatter.format(month)}</strong>
        <button type="button" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}><ChevronRight size={17} /></button>
        <button type="button" className="today" onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>Heute</button>
      </section>

      <section className="live-calendar-grid">
        {weekdays.map((day) => <div key={day} className="live-calendar-weekday">{day}</div>)}
        {monthCells.map((day, index) => {
          if (day === null) return <div className="live-calendar-day is-empty" key={`empty-${index}`} />
          const dayEvents = events.filter((event) => sameDay(event.starts_at, year, monthIndex, day))
          const today = new Date()
          const isToday = today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day
          return (
            <div className={`live-calendar-day ${isToday ? 'is-today' : ''}`} key={day}>
              <span className="live-calendar-day-number">{day}</span>
              <div className="live-calendar-day-events">
                {dayEvents.slice(0, 3).map((event) => {
                  const status = effectiveStatus(event)
                  return <button key={event.id} type="button" className={`is-${status}`} title={`${timeFormatter.format(new Date(event.starts_at))} · ${event.title}`}><i />{timeFormatter.format(new Date(event.starts_at))} {event.title}</button>
                })}
                {dayEvents.length > 3 ? <small>+ {dayEvents.length - 3} weitere</small> : null}
              </div>
            </div>
          )
        })}
      </section>

      <section className="live-calendar-agenda">
        <div className="live-calendar-agenda-head">
          <div><span className="eyebrow">MEIN KALENDER</span><h3>Gespeicherte Events</h3></div>
          <button type="button" onClick={() => openNavigation('Events')}><Ticket size={15} /> Events entdecken</button>
        </div>

        {events.length === 0 ? (
          <div className="live-calendar-empty">
            <Ticket size={32} />
            <h3>Noch nichts gespeichert</h3>
            <p>Öffne ein Event und wähle „In meinen Kalender“.</p>
            <button type="button" className="primary-button" onClick={() => openNavigation('Events')}>Events öffnen</button>
          </div>
        ) : (
          <div className="live-calendar-agenda-list">
            {(upcoming.length > 0 ? upcoming : events).map((event) => {
              const status = effectiveStatus(event)
              return (
                <article key={event.id} className={`live-calendar-agenda-item is-${status}`}>
                  <div className="live-calendar-agenda-date"><strong>{new Date(event.starts_at).getDate()}</strong><span>{new Intl.DateTimeFormat('de-DE', { month: 'short' }).format(new Date(event.starts_at))}</span></div>
                  <div className="live-calendar-agenda-copy">
                    <div><span className={`live-calendar-status is-${status}`}>{statusLabels[status]}</span>{event.category ? <span className="live-calendar-category">{event.category}</span> : null}</div>
                    <h4>{event.title}</h4>
                    <p>{dateFormatter.format(new Date(event.starts_at))} · {timeFormatter.format(new Date(event.starts_at))} Uhr</p>
                    <div className="live-calendar-agenda-meta">
                      <span><Building2 size={13} /> {event.organization_name}</span>
                      <span><MapPin size={13} /> {event.location_label || 'Ort noch nicht angegeben'}</span>
                      <span><Clock3 size={13} /> {event.ends_at ? `bis ${timeFormatter.format(new Date(event.ends_at))} Uhr` : 'Ende offen'}</span>
                    </div>
                  </div>
                  <button type="button" className="live-calendar-remove" onClick={() => void remove(event.id)} disabled={workingId === event.id}><Trash2 size={15} /> {workingId === event.id ? 'Entfernt …' : 'Entfernen'}</button>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
