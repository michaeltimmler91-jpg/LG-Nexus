import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Building2,
  CalendarDays,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Settings,
  Store,
  Ticket,
  UserRound,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type OrganizationStatus = 'open' | 'limited' | 'closed'
type WorkspaceTab = 'overview' | 'events' | 'management'

type MembershipContext = {
  organization_id: string
  organization_name: string
  role_name: string
  is_owner: boolean
  permissions?: string[]
}

type BusinessRow = {
  id: string
  name: string
  short_name: string | null
  description: string | null
  phone: string | null
  public_email: string | null
  location_label: string | null
  logo_url: string | null
  banner_url: string | null
  status: OrganizationStatus
  status_message: string | null
  organization_type: string
  service_module: string | null
}

type BusinessOrganization = BusinessRow & {
  role_name: string
  is_owner: boolean
  permissions: string[]
}

type ManagementContext = {
  organization_id: string
  name: string
  status: OrganizationStatus
  status_message: string | null
  row_version: number
  can_profile: boolean
  can_status: boolean
  can_media: boolean
  can_members: boolean
  can_roles: boolean
  can_assign_roles: boolean
  can_events: boolean
}

type PublicEvent = {
  id: string
  organization_id: string
  title: string
  description: string
  category: string | null
  location_label: string | null
  starts_at: string
  ends_at: string | null
  status: 'planned' | 'live' | 'finished' | 'cancelled'
  image_url: string | null
}

const statusLabels: Record<OrganizationStatus, string> = {
  open: 'Geöffnet',
  limited: 'Eingeschränkt',
  closed: 'Geschlossen',
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

function hasManagementAccess(context: ManagementContext | undefined) {
  if (!context) return false
  return context.can_profile
    || context.can_status
    || context.can_media
    || context.can_members
    || context.can_roles
    || context.can_assign_roles
    || context.can_events
}

function initials(organization: BusinessOrganization) {
  if (organization.short_name?.trim()) return organization.short_name.trim().slice(0, 5).toUpperCase()
  return organization.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'NX'
}

function openBaseDashboardIfNeeded() {
  if (!document.querySelector('.profile-header-card')) return
  document.querySelector<HTMLButtonElement>('.nav-button[aria-label="Dashboard"]')?.click()
}

export default function BusinessWorkspaceMount() {
  const [navTarget, setNavTarget] = useState<Element | null>(null)
  const [pageTarget, setPageTarget] = useState<Element | null>(null)
  const [active, setActive] = useState(false)
  const [businesses, setBusinesses] = useState<BusinessOrganization[]>([])
  const [management, setManagement] = useState<Record<string, ManagementContext>>({})
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setBusinesses([])
      setManagement({})
      setEvents([])
      setSelectedId('')
      setLoading(false)
      return
    }

    const [membershipResult, managementResult, eventResult] = await Promise.all([
      supabase.rpc('get_my_organization_context'),
      supabase.rpc('organization_management_get_context'),
      supabase.rpc('events_list_public', { search_text: null }),
    ])

    if (membershipResult.error) {
      setBusinesses([])
      setManagement({})
      setEvents([])
      setError('Deine Unternehmensbereiche konnten gerade nicht geladen werden.')
      setLoading(false)
      return
    }

    const memberships = Array.isArray(membershipResult.data) ? membershipResult.data as MembershipContext[] : []
    const ids = memberships.map((item) => item.organization_id)

    if (ids.length === 0) {
      setBusinesses([])
      setManagement({})
      setEvents(Array.isArray(eventResult.data) ? eventResult.data as PublicEvent[] : [])
      setSelectedId('')
      setLoading(false)
      return
    }

    const { data: organizationData, error: organizationError } = await supabase
      .from('organizations')
      .select('id,name,short_name,description,phone,public_email,location_label,logo_url,banner_url,status,status_message,organization_type,service_module')
      .in('id', ids)

    if (organizationError) {
      setError('Die Unternehmensdaten konnten nicht vollständig geladen werden.')
    }

    const rows = Array.isArray(organizationData) ? organizationData as BusinessRow[] : []
    const membershipById = new Map(memberships.map((item) => [item.organization_id, item]))
    const businessRows = rows
      .filter((item) => item.organization_type === 'business')
      .map((item) => {
        const membership = membershipById.get(item.id)
        return {
          ...item,
          role_name: membership?.role_name ?? 'Mitarbeiter',
          is_owner: Boolean(membership?.is_owner),
          permissions: membership?.permissions ?? [],
        } satisfies BusinessOrganization
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'de'))

    const managementRows = Array.isArray(managementResult.data) ? managementResult.data as ManagementContext[] : []
    const managementMap = Object.fromEntries(managementRows.map((item) => [item.organization_id, item]))

    setBusinesses(businessRows)
    setManagement(managementMap)
    setEvents(Array.isArray(eventResult.data) ? eventResult.data as PublicEvent[] : [])
    setSelectedId((current) => businessRows.some((item) => item.id === current) ? current : businessRows[0]?.id ?? '')
    setLoading(false)
  }, [])

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
    void load()
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void load(), 0)
    })
    const refresh = () => void load()
    window.addEventListener('focus', refresh)
    window.addEventListener('nexus:permissions-changed', refresh)
    return () => {
      authListener.subscription.unsubscribe()
      window.removeEventListener('focus', refresh)
      window.removeEventListener('nexus:permissions-changed', refresh)
    }
  }, [load])

  useEffect(() => {
    if (businesses.length === 0 && active) setActive(false)
  }, [businesses.length, active])

  useEffect(() => {
    const onNavigation = (event: MouseEvent) => {
      const element = event.target as Element | null
      const button = element?.closest('.nav-button')
      if (!button) return
      const label = button.getAttribute('aria-label')
      if (label === 'Mein Unternehmen') setActive(true)
      else if (active) setActive(false)
    }
    document.addEventListener('click', onNavigation)
    return () => document.removeEventListener('click', onNavigation)
  }, [active])

  const selected = businesses.find((item) => item.id === selectedId) ?? null

  useEffect(() => {
    if (!active || !selected) {
      delete document.body.dataset.nexusBusinessWorkspace
      return
    }

    document.body.dataset.nexusBusinessWorkspace = 'true'
    document.querySelectorAll('.nav-button.is-active:not([aria-label="Mein Unternehmen"])').forEach((button) => button.classList.remove('is-active'))
    const title = document.querySelector('.topbar-title h1')
    if (title) title.textContent = selected.name

    return () => {
      delete document.body.dataset.nexusBusinessWorkspace
    }
  }, [active, selected?.id, selected?.name])

  const openWorkspace = () => {
    openBaseDashboardIfNeeded()
    setActive(true)
  }

  return <>
    {navTarget && businesses.length > 0 ? createPortal(
      <div className="nav-item-wrap nexus-business-workspace-nav">
        <button type="button" className={`nav-button ${active ? 'is-active' : ''}`} aria-label="Mein Unternehmen" onClick={openWorkspace}>
          <Store size={21} strokeWidth={1.8} />
          <span className="nav-tooltip">{businesses.length === 1 ? businesses[0].name : 'Meine Unternehmen'}</span>
        </button>
      </div>,
      navTarget,
    ) : null}

    {pageTarget && active && selected ? createPortal(
      <div className="nexus-business-workspace-slot">
        <BusinessWorkspace
          businesses={businesses}
          selected={selected}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          management={management[selected.id]}
          events={events.filter((event) => event.organization_id === selected.id)}
          loading={loading}
          error={error}
          reload={load}
        />
      </div>,
      pageTarget,
    ) : null}
  </>
}

function BusinessWorkspace({
  businesses,
  selected,
  selectedId,
  setSelectedId,
  management,
  events,
  loading,
  error,
  reload,
}: {
  businesses: BusinessOrganization[]
  selected: BusinessOrganization
  selectedId: string
  setSelectedId: (value: string) => void
  management?: ManagementContext
  events: PublicEvent[]
  loading: boolean
  error: string
  reload: () => Promise<void>
}) {
  const [tab, setTab] = useState<WorkspaceTab>('overview')
  const [statusWorking, setStatusWorking] = useState(false)
  const [statusError, setStatusError] = useState('')

  const canManage = hasManagementAccess(management)

  useEffect(() => {
    if (tab === 'management' && !canManage) setTab('overview')
  }, [tab, canManage])

  useEffect(() => {
    if (tab !== 'management' || !management) return

    const selectOrganization = () => {
      const host = document.querySelector('.business-org-admin-host')
      const select = host?.querySelector<HTMLSelectElement>('.org-control-select select')
      if (!select || select.value === selected.id) return
      if (!Array.from(select.options).some((option) => option.value === selected.id)) return
      select.value = selected.id
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }

    selectOrganization()
    const host = document.querySelector('.business-org-admin-host')
    const observer = new MutationObserver(selectOrganization)
    if (host) observer.observe(host, { childList: true, subtree: true })
    const timer = window.setTimeout(selectOrganization, 120)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [tab, management?.organization_id, selected.id])

  const upcomingEvents = useMemo(() => [...events]
    .filter((event) => event.status !== 'finished' && event.status !== 'cancelled' && new Date(event.starts_at).getTime() >= Date.now() - 6 * 60 * 60 * 1000)
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()), [events])

  const saveStatus = async (status: OrganizationStatus) => {
    if (!management?.can_status || statusWorking) return
    setStatusWorking(true)
    setStatusError('')
    const { error: saveError } = await supabase.rpc('organization_management_save_status', {
      target_org: selected.id,
      expected_row_version: management.row_version,
      new_status: status,
      new_status_message: management.status_message ?? selected.status_message ?? '',
    })
    setStatusWorking(false)
    if (saveError) {
      setStatusError(saveError.message?.includes('conflict') ? 'Der Status wurde inzwischen geändert. Bitte aktualisieren.' : 'Der Öffnungsstatus konnte nicht gespeichert werden.')
      return
    }
    await reload()
  }

  return (
    <div className="page-content business-workspace">
      <section
        className={`business-workspace-hero ${selected.banner_url ? 'has-banner' : ''}`}
        style={selected.banner_url ? { backgroundImage: `linear-gradient(110deg, rgba(13,16,24,.97), rgba(22,18,45,.76)), url(${selected.banner_url})` } : undefined}
      >
        <div className="business-workspace-hero-copy">
          <span className="eyebrow">LG NEXUS · MEIN UNTERNEHMEN</span>
          <h2>{selected.name}</h2>
          <p>{selected.description?.trim() || 'Interner Unternehmensbereich für Informationen, Events und Verwaltung.'}</p>
          <div className="business-workspace-hero-meta">
            <span><UserRound size={14} /> {selected.role_name}{selected.is_owner ? ' · Leitung' : ''}</span>
            <span className={`business-workspace-status is-${selected.status}`}><i />{statusLabels[selected.status]}</span>
          </div>
        </div>

        <div className="business-workspace-brand" aria-hidden="true">
          <div className="business-workspace-orbit orbit-a" />
          <div className="business-workspace-orbit orbit-b" />
          <div
            className={`business-workspace-logo ${selected.logo_url ? 'has-logo' : ''}`}
            style={selected.logo_url ? { backgroundImage: `url(${selected.logo_url})` } : undefined}
          >
            {!selected.logo_url ? <strong>{initials(selected)}</strong> : null}
          </div>
        </div>
      </section>

      <div className="business-workspace-toolbar">
        <div className="business-workspace-tabs">
          <button type="button" className={tab === 'overview' ? 'is-active' : ''} onClick={() => setTab('overview')}><Building2 size={15} /> Übersicht</button>
          <button type="button" className={tab === 'events' ? 'is-active' : ''} onClick={() => setTab('events')}><Ticket size={15} /> Events</button>
          {canManage ? <button type="button" className={tab === 'management' ? 'is-active' : ''} onClick={() => setTab('management')}><Settings size={15} /> Verwaltung</button> : null}
        </div>

        <div className="business-workspace-toolbar-actions">
          {businesses.length > 1 ? (
            <label className="business-workspace-select">
              <select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setTab('overview') }}>
                {businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
          ) : null}
          <button type="button" className="business-workspace-refresh" onClick={() => void reload()} disabled={loading}><RefreshCw size={14} /> Aktualisieren</button>
        </div>
      </div>

      {error ? <div className="business-workspace-message is-error">{error}</div> : null}
      {statusError ? <div className="business-workspace-message is-error">{statusError}</div> : null}

      {tab === 'overview' ? (
        <>
          <section className="business-workspace-grid">
            <article>
              <span className="eyebrow">ÖFFNUNGSSTATUS</span>
              <strong>{statusLabels[selected.status]}</strong>
              <p>{selected.status_message?.trim() || 'Keine zusätzliche Statusmeldung hinterlegt.'}</p>
            </article>
            <article>
              <span className="eyebrow">STANDORT</span>
              <strong><MapPin size={17} /> {selected.location_label || 'Nicht angegeben'}</strong>
              <p>Öffentlicher Unternehmensstandort.</p>
            </article>
            <article>
              <span className="eyebrow">KONTAKT</span>
              <strong><Phone size={17} /> {selected.phone || 'Nicht angegeben'}</strong>
              <p>{selected.public_email ? <><Mail size={13} /> {selected.public_email}</> : 'Keine öffentliche E-Mail hinterlegt.'}</p>
            </article>
            <article>
              <span className="eyebrow">DEIN ZUGANG</span>
              <strong><UserRound size={17} /> {selected.role_name}</strong>
              <p>{selected.is_owner ? 'Du bist als Leitung eingetragen.' : 'Dein Unternehmenszugang ist aktiv.'}</p>
            </article>
          </section>

          {management?.can_status ? (
            <section className="business-workspace-status-control">
              <div>
                <span className="eyebrow">SCHNELLZUGRIFF</span>
                <h3>Unternehmen geöffnet oder geschlossen?</h3>
                <p>Der neue Status ist direkt im öffentlichen Stadtverzeichnis sichtbar.</p>
              </div>
              <div className="business-workspace-status-buttons">
                {(['open', 'limited', 'closed'] as OrganizationStatus[]).map((status) => (
                  <button key={status} type="button" className={`is-${status} ${selected.status === status ? 'is-active' : ''}`} disabled={statusWorking} onClick={() => void saveStatus(status)}>
                    <i />{statusLabels[status]}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className="business-workspace-events-preview">
            <div className="business-workspace-section-head">
              <div><span className="eyebrow">NÄCHSTE TERMINE</span><h3>Events von {selected.short_name || selected.name}</h3></div>
              <button type="button" onClick={() => setTab('events')}>Alle Events</button>
            </div>
            {upcomingEvents.length === 0 ? <div className="business-workspace-empty">Aktuell sind keine kommenden öffentlichen Events eingetragen.</div> : (
              <div className="business-workspace-event-list compact">
                {upcomingEvents.slice(0, 3).map((event) => <EventRow key={event.id} event={event} />)}
              </div>
            )}
          </section>
        </>
      ) : null}

      {tab === 'events' ? (
        <section className="business-workspace-events-page">
          <div className="business-workspace-section-head">
            <div><span className="eyebrow">VERANSTALTUNGEN</span><h3>Events von {selected.name}</h3></div>
            <span>{events.length} eingetragen</span>
          </div>
          {events.length === 0 ? <div className="business-workspace-empty">Für dieses Unternehmen sind aktuell keine öffentlichen Events eingetragen.</div> : (
            <div className="business-workspace-event-list">
              {[...events].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()).map((event) => <EventRow key={event.id} event={event} />)}
            </div>
          )}
        </section>
      ) : null}

      {tab === 'management' && canManage ? (
        <div className="service-org-admin-host business-org-admin-host" data-organization-id={selected.id}>
          <div className="profile-header-card business-org-admin-anchor" aria-hidden="true" />
        </div>
      ) : null}
    </div>
  )
}

function EventRow({ event }: { event: PublicEvent }) {
  return (
    <article className={`business-workspace-event is-${event.status}`}>
      <div className="business-workspace-event-date">
        <CalendarDays size={18} />
        <strong>{dateFormatter.format(new Date(event.starts_at))}</strong>
        <span>{timeFormatter.format(new Date(event.starts_at))} Uhr</span>
      </div>
      <div className="business-workspace-event-copy">
        <div>{event.category ? <span className="business-workspace-event-category">{event.category}</span> : null}<span className={`business-workspace-event-state is-${event.status}`}>{event.status === 'planned' ? 'Geplant' : event.status === 'live' ? 'Läuft' : event.status === 'cancelled' ? 'Abgesagt' : 'Beendet'}</span></div>
        <h4>{event.title}</h4>
        <p>{event.description?.trim() || 'Weitere Informationen folgen.'}</p>
        <span><MapPin size={13} /> {event.location_label || 'Ort noch nicht angegeben'}</span>
      </div>
      {event.ends_at ? <div className="business-workspace-event-end"><Clock3 size={14} /> bis {timeFormatter.format(new Date(event.ends_at))} Uhr</div> : null}
    </article>
  )
}
