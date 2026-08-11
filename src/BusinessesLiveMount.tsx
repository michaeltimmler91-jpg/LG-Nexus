import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Building2, ChevronRight, Mail, MapPin, Phone, RefreshCw, Search, ShieldCheck } from 'lucide-react'
import { supabase } from './lib/supabase'

type OrganizationStatus = 'open' | 'limited' | 'closed'
type DirectoryFilter = 'all' | 'open' | 'business' | 'authority'

type DirectoryOrganization = {
  id: string
  name: string
  short_name: string | null
  organization_type: string
  service_module: string | null
  description: string | null
  phone: string | null
  public_email: string | null
  location_label: string | null
  status: OrganizationStatus
  status_message: string | null
  logo_url: string | null
  banner_url: string | null
}

const statusLabels: Record<OrganizationStatus, string> = {
  open: 'Geöffnet',
  limited: 'Eingeschränkt',
  closed: 'Geschlossen',
}

const serviceLabels: Record<string, string> = {
  city: 'Stadtverwaltung',
  medical: 'Gesundheit',
  police: 'Sicherheit',
  fire: 'Feuerwehr & Rettung',
  justice: 'Justiz',
}

function organizationKind(organization: DirectoryOrganization) {
  return organization.organization_type === 'business' ? 'Unternehmen' : 'Öffentliche Einrichtung'
}

function initials(organization: DirectoryOrganization) {
  if (organization.short_name?.trim()) return organization.short_name.trim().slice(0, 5).toUpperCase()
  return organization.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'LS'
}

export default function BusinessesLiveMount() {
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
      const button = document.querySelector('.nav-button[aria-label="Unternehmen"]')
      setActive(Boolean(button?.classList.contains('is-active')))
    }

    syncFromDom()

    const onClick = (event: MouseEvent) => {
      const element = event.target as Element | null
      const button = element?.closest('.nav-button')
      if (!button) return
      setActive(button.getAttribute('aria-label') === 'Unternehmen')
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (active) document.body.dataset.nexusBusinessesWorkspace = 'true'
    else delete document.body.dataset.nexusBusinessesWorkspace
    return () => { delete document.body.dataset.nexusBusinessesWorkspace }
  }, [active])

  if (!target || !active) return null

  return createPortal(
    <div className="nexus-businesses-page-slot">
      <BusinessDirectory />
    </div>,
    target,
  )
}

function BusinessDirectory() {
  const [organizations, setOrganizations] = useState<DirectoryOrganization[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<DirectoryFilter>('all')
  const [selected, setSelected] = useState<DirectoryOrganization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error: loadError } = await supabase
      .from('organizations')
      .select('id,name,short_name,organization_type,service_module,description,phone,public_email,location_label,status,status_message,logo_url,banner_url')
      .eq('is_public', true)
      .eq('is_archived', false)
      .order('name')

    if (loadError) {
      setOrganizations([])
      setError('Das Stadtverzeichnis konnte gerade nicht geladen werden.')
    } else {
      setOrganizations(Array.isArray(data) ? data as DirectoryOrganization[] : [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()

    const channel = supabase
      .channel('nexus-business-directory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations' }, () => void load())
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return organizations.filter((organization) => {
      const matchesFilter = filter === 'all'
        || (filter === 'open' && organization.status === 'open')
        || (filter === 'business' && organization.organization_type === 'business')
        || (filter === 'authority' && organization.organization_type !== 'business')

      if (!matchesFilter) return false
      if (!term) return true

      return [
        organization.name,
        organization.short_name ?? '',
        organization.description ?? '',
        organization.location_label ?? '',
        organization.status_message ?? '',
        organization.service_module ? serviceLabels[organization.service_module] ?? organization.service_module : '',
      ].join(' ').toLowerCase().includes(term)
    })
  }, [organizations, search, filter])

  const businessCount = organizations.filter((organization) => organization.organization_type === 'business').length
  const openCount = organizations.filter((organization) => organization.status === 'open').length

  if (selected) {
    return <OrganizationDetail organization={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="page-content live-businesses">
      <section className="live-businesses-hero">
        <div>
          <span className="eyebrow">STADTVERZEICHNIS</span>
          <h2>Unternehmen & Einrichtungen</h2>
          <p>Öffnungsstatus, Standort und Kontaktdaten direkt aus Nexus.</p>
        </div>
        <button type="button" className="live-businesses-refresh" onClick={() => void load()} disabled={loading}>
          <RefreshCw size={15} /> Aktualisieren
        </button>
      </section>

      <section className="live-businesses-toolbar">
        <label className="live-businesses-search">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, Standort oder Bereich suchen …" />
        </label>
        <div className="live-businesses-stats">
          <span><strong>{organizations.length}</strong> Einträge</span>
          <span><strong>{openCount}</strong> geöffnet</span>
          <span><strong>{businessCount}</strong> Unternehmen</span>
        </div>
      </section>

      <div className="live-businesses-filters">
        {([
          ['all', 'Alle'],
          ['open', 'Geöffnet'],
          ['business', 'Unternehmen'],
          ['authority', 'Öffentliche Einrichtungen'],
        ] as Array<[DirectoryFilter, string]>).map(([key, label]) => (
          <button key={key} type="button" className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>
        ))}
        <span>{filtered.length} angezeigt</span>
      </div>

      {error ? <div className="live-businesses-message">{error}</div> : null}

      <div className="live-businesses-grid">
        {loading && organizations.length === 0 ? (
          <div className="live-businesses-empty">Stadtverzeichnis wird geladen …</div>
        ) : filtered.length === 0 ? (
          <div className="live-businesses-empty">Keine passenden Einträge gefunden.</div>
        ) : filtered.map((organization) => (
          <button type="button" className="live-business-card" key={organization.id} onClick={() => setSelected(organization)}>
            <div
              className={`live-business-card-top ${organization.banner_url ? 'has-image' : ''}`}
              style={organization.banner_url ? { backgroundImage: `linear-gradient(180deg, rgba(8,12,18,.12), rgba(8,12,18,.7)), url(${organization.banner_url})` } : undefined}
            >
              <div
                className={`live-business-monogram ${organization.logo_url ? 'has-logo' : ''}`}
                style={organization.logo_url ? { backgroundImage: `url(${organization.logo_url})` } : undefined}
              >
                {!organization.logo_url ? initials(organization) : null}
              </div>
              <span className={`live-business-status is-${organization.status}`}>{statusLabels[organization.status]}</span>
            </div>
            <div className="live-business-card-body">
              <span className="live-business-kind">{organization.service_module ? serviceLabels[organization.service_module] ?? organizationKind(organization) : organizationKind(organization)}</span>
              <h3>{organization.name}</h3>
              <p>{organization.description?.trim() || 'Für diesen Eintrag ist noch keine Beschreibung hinterlegt.'}</p>
              <div className="live-business-meta">
                <span><MapPin size={13} /> {organization.location_label || 'Standort nicht angegeben'}</span>
                {organization.phone ? <span><Phone size={13} /> {organization.phone}</span> : null}
              </div>
              {organization.status_message ? <div className="live-business-status-message">{organization.status_message}</div> : null}
            </div>
            <div className="live-business-card-footer">Details öffnen <ChevronRight size={15} /></div>
          </button>
        ))}
      </div>
    </div>
  )
}

function OrganizationDetail({ organization, onBack }: { organization: DirectoryOrganization; onBack: () => void }) {
  return (
    <div className="page-content live-business-detail">
      <button type="button" className="live-business-back" onClick={onBack}><ArrowLeft size={16} /> Zurück zum Verzeichnis</button>

      <section
        className={`live-business-detail-hero ${organization.banner_url ? 'has-image' : ''}`}
        style={organization.banner_url ? { backgroundImage: `linear-gradient(90deg, rgba(10,14,22,.94), rgba(10,14,22,.48)), url(${organization.banner_url})` } : undefined}
      >
        <div
          className={`live-business-detail-monogram ${organization.logo_url ? 'has-logo' : ''}`}
          style={organization.logo_url ? { backgroundImage: `url(${organization.logo_url})` } : undefined}
        >
          {!organization.logo_url ? initials(organization) : null}
        </div>
        <div className="live-business-detail-title">
          <span className="eyebrow">{organizationKind(organization).toUpperCase()}</span>
          <h2>{organization.name}</h2>
          <p>{organization.description?.trim() || 'Noch keine öffentliche Beschreibung hinterlegt.'}</p>
        </div>
        <span className={`live-business-status is-${organization.status}`}>{statusLabels[organization.status]}</span>
      </section>

      {organization.status_message ? (
        <section className="live-business-detail-status">
          <ShieldCheck size={18} />
          <div><strong>Aktueller Status</strong><span>{organization.status_message}</span></div>
        </section>
      ) : null}

      <div className="live-business-detail-grid">
        <article>
          <span className="eyebrow">STANDORT</span>
          <MapPin size={22} />
          <h3>{organization.location_label || 'Nicht angegeben'}</h3>
          <p>Öffentlicher Standort dieses Eintrags.</p>
        </article>
        <article>
          <span className="eyebrow">TELEFON</span>
          <Phone size={22} />
          <h3>{organization.phone || 'Nicht angegeben'}</h3>
          <p>Öffentliche Rufnummer.</p>
        </article>
        <article>
          <span className="eyebrow">E-MAIL</span>
          <Mail size={22} />
          <h3>{organization.public_email || 'Nicht angegeben'}</h3>
          <p>Öffentliche Kontaktadresse.</p>
        </article>
        <article>
          <span className="eyebrow">BEREICH</span>
          <Building2 size={22} />
          <h3>{organization.service_module ? serviceLabels[organization.service_module] ?? organizationKind(organization) : organizationKind(organization)}</h3>
          <p>{organizationKind(organization)} in Los Santos.</p>
        </article>
      </div>
    </div>
  )
}
