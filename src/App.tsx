import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Flame,
  HeartPulse,
  Home,
  Mail,
  Map,
  Radio,
  Search,
  Shield,
  Ticket,
  Users,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type OrganizationStatus = 'open' | 'limited' | 'closed'

type Organization = {
  id: string
  name: string
  description: string
  status: OrganizationStatus
  status_message: string | null
  phone: string | null
  location_label: string | null
  organization_type: string
}

type NavItem = {
  id: string
  label: string
  icon: typeof Home
  section?: 'public' | 'service' | 'system'
}

const navigation: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'public' },
  { id: 'businesses', label: 'Unternehmen', icon: Building2, section: 'public' },
  { id: 'events', label: 'Events', icon: Ticket, section: 'public' },
  { id: 'hub', label: 'City Hub', icon: Radio, section: 'public' },
  { id: 'map', label: 'LS Map', icon: Map, section: 'public' },
  { id: 'calendar', label: 'Kalender', icon: CalendarDays, section: 'public' },
  { id: 'mail', label: 'Mail', icon: Mail, section: 'public' },
  { id: 'medical', label: 'Medical', icon: HeartPulse, section: 'service' },
  { id: 'police', label: 'Police', icon: Shield, section: 'service' },
  { id: 'fire', label: 'Fire & Rescue', icon: Flame, section: 'service' },
  { id: 'account', label: 'Account', icon: CircleUserRound, section: 'system' },
]

const demoOrganizations: Organization[] = [
  {
    id: 'demo-1',
    name: 'Los Santos Medical Center',
    description: 'Medizinische Versorgung und Rettungsdienst für Los Santos.',
    status: 'open',
    status_message: 'Regelbetrieb',
    phone: '911',
    location_label: 'Pillbox Hill',
    organization_type: 'government',
  },
  {
    id: 'demo-2',
    name: "Benny's Motorworks",
    description: 'Werkstatt, Reparaturen und individuelle Fahrzeugumbauten.',
    status: 'limited',
    status_message: 'Nur Werkstattbetrieb',
    phone: '555-0184',
    location_label: 'Strawberry',
    organization_type: 'business',
  },
  {
    id: 'demo-3',
    name: 'Los Santos Taxi',
    description: 'Personenbeförderung und Fahrservice in der gesamten Stadt.',
    status: 'closed',
    status_message: null,
    phone: '555-8294',
    location_label: 'Downtown',
    organization_type: 'business',
  },
]

const statusText: Record<OrganizationStatus, string> = {
  open: 'Geöffnet',
  limited: 'Eingeschränkt',
  closed: 'Geschlossen',
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [organizations, setOrganizations] = useState<Organization[]>(demoOrganizations)
  const [search, setSearch] = useState('')
  const [usingDemoData, setUsingDemoData] = useState(true)

  useEffect(() => {
    if (!supabase) return

    let mounted = true

    const loadOrganizations = async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('id,name,description,status,status_message,phone,location_label,organization_type')
        .eq('is_public', true)
        .order('name')

      if (!mounted || error || !data || data.length === 0) return
      setOrganizations(data as Organization[])
      setUsingDemoData(false)
    }

    void loadOrganizations()

    const channel = supabase
      .channel('organizations-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'organizations' },
        () => void loadOrganizations(),
      )
      .subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [])

  const filteredOrganizations = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return organizations
    return organizations.filter((organization) =>
      [organization.name, organization.description, organization.location_label ?? '']
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [organizations, search])

  const activeNav = navigation.find((item) => item.id === activePage)

  return (
    <div className="nexus-shell">
      <aside className="sidebar" aria-label="Hauptnavigation">
        <button className="brand" onClick={() => setActivePage('dashboard')} aria-label="LG Nexus">
          <span className="brand-mark">N</span>
        </button>

        <nav className="nav-stack">
          {navigation.map((item, index) => {
            const Icon = item.icon
            const previous = navigation[index - 1]
            const showDivider = index > 0 && previous.section !== item.section

            return (
              <div className="nav-item-wrap" key={item.id}>
                {showDivider ? <div className="nav-divider" /> : null}
                <button
                  className={`nav-button ${activePage === item.id ? 'is-active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon size={21} strokeWidth={1.8} />
                  <span className="nav-tooltip">{item.label}</span>
                </button>
              </div>
            )
          })}
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">LG NEXUS</div>
            <h1>{activeNav?.label ?? 'Dashboard'}</h1>
          </div>
          <div className="topbar-actions">
            <button className="user-chip">
              <span className="user-avatar">LG</span>
              <span>
                <strong>Willkommen</strong>
                <small>Account</small>
              </span>
            </button>
          </div>
        </header>

        {activePage === 'dashboard' ? (
          <Dashboard organizations={organizations} usingDemoData={usingDemoData} onOpenBusinesses={() => setActivePage('businesses')} />
        ) : activePage === 'businesses' ? (
          <Businesses organizations={filteredOrganizations} search={search} setSearch={setSearch} usingDemoData={usingDemoData} />
        ) : (
          <Placeholder title={activeNav?.label ?? 'Modul'} icon={activeNav?.icon ?? Home} />
        )}
      </main>
    </div>
  )
}

function Dashboard({
  organizations,
  usingDemoData,
  onOpenBusinesses,
}: {
  organizations: Organization[]
  usingDemoData: boolean
  onOpenBusinesses: () => void
}) {
  const openCount = organizations.filter((organization) => organization.status === 'open').length

  return (
    <div className="page-content">
      <section className="hero-card">
        <div>
          <span className="hero-kicker">Zentrale Plattform für Los Santos</span>
          <h2>Alles, was die Stadt verbindet.</h2>
          <p>
            Unternehmen, Behörden, Events, Kommunikation und später die internen Bereiche von Medical, Police und Fire & Rescue – in einem System.
          </p>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span>NEXUS</span>
        </div>
      </section>

      {usingDemoData ? (
        <div className="demo-banner">Demo-Daten aktiv – sobald die Supabase-Umgebungsvariablen gesetzt sind, werden echte Organisationsdaten geladen.</div>
      ) : null}

      <section className="stat-grid">
        <article className="stat-card">
          <span>Unternehmen & Behörden</span>
          <strong>{organizations.length}</strong>
          <small>im öffentlichen Verzeichnis</small>
        </article>
        <article className="stat-card">
          <span>Aktuell geöffnet</span>
          <strong>{openCount}</strong>
          <small>Status wird live aktualisiert</small>
        </article>
        <article className="stat-card">
          <span>Behördenmodule</span>
          <strong>3</strong>
          <small>Medical · Police · Fire</small>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">STATUS</span>
            <h3>Was ist gerade geöffnet?</h3>
          </div>
          <button className="text-button" onClick={onOpenBusinesses}>
            Alle anzeigen <ChevronRight size={17} />
          </button>
        </div>
        <div className="organization-grid compact">
          {organizations.slice(0, 3).map((organization) => (
            <OrganizationCard key={organization.id} organization={organization} />
          ))}
        </div>
      </section>

      <section className="dashboard-columns">
        <article className="panel-card">
          <div className="panel-icon"><CalendarDays size={20} /></div>
          <div>
            <span className="eyebrow">KALENDER</span>
            <h3>Kommende Events</h3>
            <p>Noch keine Events eingetragen. Dieses Modul kommt als nächster öffentlicher Baustein.</p>
          </div>
        </article>
        <article className="panel-card">
          <div className="panel-icon"><Users size={20} /></div>
          <div>
            <span className="eyebrow">STAATLICH</span>
            <h3>Gemeinsame Zusammenarbeit</h3>
            <p>Medical, Police und Fire & Rescue erhalten eigene Bereiche mit gemeinsam nutzbaren Einsatzdaten.</p>
          </div>
        </article>
      </section>
    </div>
  )
}

function Businesses({
  organizations,
  search,
  setSearch,
  usingDemoData,
}: {
  organizations: Organization[]
  search: string
  setSearch: (value: string) => void
  usingDemoData: boolean
}) {
  return (
    <div className="page-content">
      <section className="section-heading businesses-heading">
        <div>
          <span className="eyebrow">CITY DIRECTORY</span>
          <h2>Unternehmen & Behörden</h2>
          <p>Öffnungsstatus, Kontakt und Standort auf einen Blick.</p>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Unternehmen suchen …" />
        </label>
      </section>

      {usingDemoData ? <div className="demo-banner">Aktuell werden Vorschau-Daten angezeigt.</div> : null}

      <div className="organization-grid">
        {organizations.map((organization) => (
          <OrganizationCard key={organization.id} organization={organization} />
        ))}
      </div>

      {organizations.length === 0 ? <div className="empty-state">Keine passenden Einträge gefunden.</div> : null}
    </div>
  )
}

function OrganizationCard({ organization }: { organization: Organization }) {
  return (
    <article className="organization-card">
      <div className="organization-cover">
        <div className="organization-monogram">{organization.name.slice(0, 2).toUpperCase()}</div>
        <span className={`status-pill status-${organization.status}`}>{statusText[organization.status]}</span>
      </div>
      <div className="organization-body">
        <div>
          <span className="organization-type">{organization.organization_type === 'government' ? 'Behörde' : 'Unternehmen'}</span>
          <h3>{organization.name}</h3>
          <p>{organization.description}</p>
        </div>
        <dl className="organization-meta">
          <div>
            <dt>Standort</dt>
            <dd>{organization.location_label ?? 'Nicht angegeben'}</dd>
          </div>
          <div>
            <dt>Kontakt</dt>
            <dd>{organization.phone ?? 'Nicht angegeben'}</dd>
          </div>
        </dl>
        {organization.status_message ? <div className="status-message">{organization.status_message}</div> : null}
      </div>
    </article>
  )
}

function Placeholder({ title, icon: Icon }: { title: string; icon: typeof Home }) {
  return (
    <div className="page-content placeholder-page">
      <div className="placeholder-icon"><Icon size={34} /></div>
      <span className="eyebrow">MODUL</span>
      <h2>{title}</h2>
      <p>Der Bereich ist bereits in der Navigation vorgesehen und wird Schritt für Schritt ausgebaut.</p>
    </div>
  )
}

export default App
