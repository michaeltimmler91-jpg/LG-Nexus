import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Flame,
  Heart,
  HeartPulse,
  Home,
  LockKeyhole,
  Mail,
  Map,
  MapPin,
  MessageSquareText,
  Newspaper,
  Phone,
  Radio,
  Search,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type OrganizationStatus = 'open' | 'limited' | 'closed'
type PageId =
  | 'dashboard'
  | 'businesses'
  | 'events'
  | 'hub'
  | 'map'
  | 'calendar'
  | 'mail'
  | 'medical'
  | 'police'
  | 'fire'
  | 'account'

type Organization = {
  id: string
  name: string
  short: string
  description: string
  status: OrganizationStatus
  status_message: string | null
  phone: string | null
  location_label: string | null
  organization_type: 'government' | 'business' | 'justice'
  category: string
  rating: number
  favorite?: boolean
  offers: string[]
  opening: string
}

type NavItem = {
  id: PageId
  label: string
  icon: LucideIcon
  section: 'public' | 'service' | 'system'
  badge?: number
}

type EventItem = {
  id: string
  title: string
  date: string
  time: string
  place: string
  organizer: string
  category: string
  participants: number
}

type MailItem = {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  unread?: boolean
  verified?: boolean
}

const navigation: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'public' },
  { id: 'businesses', label: 'Unternehmen', icon: Building2, section: 'public' },
  { id: 'events', label: 'Events', icon: Ticket, section: 'public' },
  { id: 'hub', label: 'City Hub', icon: Radio, section: 'public', badge: 1 },
  { id: 'map', label: 'LS Map', icon: Map, section: 'public' },
  { id: 'calendar', label: 'Kalender', icon: CalendarDays, section: 'public' },
  { id: 'mail', label: 'Mail', icon: Mail, section: 'public', badge: 3 },
  { id: 'medical', label: 'Medical', icon: HeartPulse, section: 'service' },
  { id: 'police', label: 'Police', icon: Shield, section: 'service' },
  { id: 'fire', label: 'Fire & Rescue', icon: Flame, section: 'service' },
  { id: 'account', label: 'Account', icon: CircleUserRound, section: 'system' },
]

const demoOrganizations: Organization[] = [
  {
    id: 'demo-medical',
    name: 'Los Santos Medical Center',
    short: 'LSMC',
    description: 'Medizinische Versorgung, Rettungsdienst und Notfallbehandlung für Los Santos.',
    status: 'open',
    status_message: 'Regelbetrieb – Notaufnahme besetzt',
    phone: '911',
    location_label: 'Pillbox Hill',
    organization_type: 'government',
    category: 'Gesundheit',
    rating: 4.8,
    offers: ['Notfallversorgung', 'Nachkontrolle', 'Bescheinigung'],
    opening: '24 / 7 Notfallversorgung',
  },
  {
    id: 'demo-bennys',
    name: "Benny's Motorworks",
    short: 'BM',
    description: 'Werkstatt, Reparaturen und individuelle Fahrzeugumbauten.',
    status: 'limited',
    status_message: 'Nur Werkstattbetrieb – Tuning derzeit ausgelastet',
    phone: '555-0184',
    location_label: 'Strawberry',
    organization_type: 'business',
    category: 'Werkstatt',
    rating: 4.6,
    favorite: true,
    offers: ['Motorservice', 'Lackierung', 'Felgen & Reifen'],
    opening: 'Heute 16:00 – 23:00',
  },
  {
    id: 'demo-taxi',
    name: 'Los Santos Taxi',
    short: 'LST',
    description: 'Personenbeförderung, Eventfahrten und Fahrservice in der gesamten Stadt.',
    status: 'open',
    status_message: '2 Fahrer verfügbar',
    phone: '555-8294',
    location_label: 'Downtown',
    organization_type: 'business',
    category: 'Mobilität',
    rating: 4.9,
    offers: ['Normale Fahrt', 'Bambi-Tour', 'Event-Shuttle'],
    opening: 'Heute bis 02:00',
  },
  {
    id: 'demo-pd',
    name: 'Los Santos Police Department',
    short: 'LSPD',
    description: 'Polizeiliche Anlaufstelle, öffentliche Hinweise und Bürgerkontakt.',
    status: 'open',
    status_message: 'Wache besetzt',
    phone: '911',
    location_label: 'Mission Row',
    organization_type: 'government',
    category: 'Sicherheit',
    rating: 4.3,
    offers: ['Bürgeranliegen', 'Dokumentenauskunft', 'Fundmeldung'],
    opening: 'Wache durchgehend erreichbar',
  },
  {
    id: 'demo-pizzeria',
    name: 'La Familia Pizzeria',
    short: 'LF',
    description: 'Pizza, Pasta und Lieferdienst für gemütliche RP-Abende.',
    status: 'closed',
    status_message: 'Öffnet später wieder',
    phone: '555-4402',
    location_label: 'Vespucci',
    organization_type: 'business',
    category: 'Gastronomie',
    rating: 4.7,
    offers: ['Pizza', 'Pasta', 'Lieferung'],
    opening: 'Heute ab 18:00',
  },
  {
    id: 'demo-city',
    name: 'Stadtverwaltung Los Santos',
    short: 'LS',
    description: 'Bürgeranträge, Unternehmensregister und offizielle Stadtinformationen.',
    status: 'open',
    status_message: 'Bürgerservice geöffnet',
    phone: '555-0100',
    location_label: 'City Hall',
    organization_type: 'government',
    category: 'Verwaltung',
    rating: 4.5,
    offers: ['Bürgerantrag', 'Namensänderung', 'Unternehmensregister'],
    opening: 'Heute 14:00 – 22:00',
  },
]

const demoEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'Los Santos Summer Night',
    date: '12.08.2026',
    time: '20:00',
    place: 'Vespucci Beach',
    organizer: 'Stadtverwaltung + La Familia',
    category: 'Stadtfest',
    participants: 42,
  },
  {
    id: 'event-2',
    title: 'Open Garage Night',
    date: '14.08.2026',
    time: '19:30',
    place: "Benny's Motorworks",
    organizer: "Benny's Motorworks",
    category: 'Unternehmen',
    participants: 18,
  },
  {
    id: 'event-3',
    title: 'Blaulicht-Tag',
    date: '16.08.2026',
    time: '17:00',
    place: 'Legion Square',
    organizer: 'LSMC · LSPD · Fire & Rescue',
    category: 'Community',
    participants: 67,
  },
]

const demoMails: MailItem[] = [
  {
    id: 'mail-1',
    from: 'Stadtverwaltung Los Santos',
    subject: 'Dein Antrag wurde angenommen',
    preview: 'Der Status deines Bürgerantrags wurde auf „In Bearbeitung“ geändert.',
    time: '21:04',
    unread: true,
    verified: true,
  },
  {
    id: 'mail-2',
    from: 'Los Santos Taxi',
    subject: 'Reservierung bestätigt',
    preview: 'Deine Reservierung für Samstag 18:30 Uhr wurde bestätigt.',
    time: '19:48',
    unread: true,
    verified: true,
  },
  {
    id: 'mail-3',
    from: 'Alex Morgan',
    subject: 'Wegen morgen',
    preview: 'Passt 20 Uhr bei dir? Dann treffen wir uns direkt am Pier.',
    time: 'Gestern',
    unread: true,
  },
  {
    id: 'mail-4',
    from: "Benny's Motorworks",
    subject: 'Termin-Erinnerung',
    preview: 'Dein Werkstatttermin beginnt morgen um 17:00 Uhr.',
    time: 'Gestern',
    verified: true,
  },
]

const statusText: Record<OrganizationStatus, string> = {
  open: 'Geöffnet',
  limited: 'Eingeschränkt',
  closed: 'Geschlossen',
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [organizations, setOrganizations] = useState<Organization[]>(demoOrganizations)
  const [search, setSearch] = useState('')
  const [usingDemoData, setUsingDemoData] = useState(true)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

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

      const enhanced = (data as Array<Omit<Organization, 'short' | 'category' | 'rating' | 'offers' | 'opening'>>).map(
        (organization) => ({
          ...organization,
          short: organization.name
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word[0])
            .join('')
            .toUpperCase(),
          category: organization.organization_type === 'government' ? 'Behörde' : 'Unternehmen',
          rating: 4.5,
          offers: [],
          opening: 'Öffnungszeiten im Profil',
        }),
      )

      setOrganizations(enhanced)
      setUsingDemoData(false)
    }

    void loadOrganizations()

    const channel = supabase
      .channel('organizations-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations' }, () => void loadOrganizations())
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
      [organization.name, organization.description, organization.location_label ?? '', organization.category]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [organizations, search])

  const activeNav = navigation.find((item) => item.id === activePage)

  const openPage = (page: PageId) => {
    setActivePage(page)
    setSelectedOrganization(null)
    setNotificationsOpen(false)
  }

  return (
    <div className="nexus-shell">
      <aside className="sidebar" aria-label="Hauptnavigation">
        <button className="brand" onClick={() => openPage('dashboard')} aria-label="LG Nexus">
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
                  onClick={() => openPage(item.id)}
                  aria-label={item.label}
                >
                  <Icon size={21} strokeWidth={1.8} />
                  {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                  <span className="nav-tooltip">{item.label}</span>
                </button>
              </div>
            )
          })}
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            <div className="eyebrow">LG NEXUS · V1 PREVIEW</div>
            <h1>{selectedOrganization?.name ?? activeNav?.label ?? 'Dashboard'}</h1>
          </div>
          <div className="topbar-actions">
            <div className="top-search">
              <Search size={16} />
              <span>Globale Suche</span>
              <kbd>⌘ K</kbd>
            </div>
            <div className="notification-wrap">
              <button
                className={`icon-button ${notificationsOpen ? 'is-active' : ''}`}
                onClick={() => setNotificationsOpen((value) => !value)}
                aria-label="Benachrichtigungen"
              >
                <Bell size={18} />
                <span className="notification-dot">3</span>
              </button>
              {notificationsOpen ? <NotificationPopover onClose={() => setNotificationsOpen(false)} /> : null}
            </div>
            <button className="user-chip" onClick={() => setAuthOpen(true)}>
              <span className="user-avatar">DB</span>
              <span>
                <strong>Demo Bürger</strong>
                <small>NX-000042</small>
              </span>
            </button>
          </div>
        </header>

        {selectedOrganization ? (
          <OrganizationDetail organization={selectedOrganization} onBack={() => setSelectedOrganization(null)} />
        ) : activePage === 'dashboard' ? (
          <Dashboard
            organizations={organizations}
            usingDemoData={usingDemoData}
            onOpenBusinesses={() => openPage('businesses')}
            onOpenPage={openPage}
            onOpenOrganization={setSelectedOrganization}
          />
        ) : activePage === 'businesses' ? (
          <Businesses
            organizations={filteredOrganizations}
            search={search}
            setSearch={setSearch}
            usingDemoData={usingDemoData}
            onOpenOrganization={setSelectedOrganization}
          />
        ) : activePage === 'events' ? (
          <EventsPage />
        ) : activePage === 'hub' ? (
          <CityHubPage />
        ) : activePage === 'map' ? (
          <MapPage organizations={organizations} onOpenOrganization={setSelectedOrganization} />
        ) : activePage === 'calendar' ? (
          <CalendarPage />
        ) : activePage === 'mail' ? (
          <MailPage />
        ) : activePage === 'account' ? (
          <AccountPage onOpenAuth={() => setAuthOpen(true)} />
        ) : (
          <ProtectedModule page={activePage} />
        )}
      </main>

      {authOpen ? <AuthPreview onClose={() => setAuthOpen(false)} /> : null}
    </div>
  )
}

function Dashboard({
  organizations,
  usingDemoData,
  onOpenBusinesses,
  onOpenPage,
  onOpenOrganization,
}: {
  organizations: Organization[]
  usingDemoData: boolean
  onOpenBusinesses: () => void
  onOpenPage: (page: PageId) => void
  onOpenOrganization: (organization: Organization) => void
}) {
  const openCount = organizations.filter((organization) => organization.status === 'open').length

  return (
    <div className="page-content">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker"><Sparkles size={13} /> Connecting Los Santos</span>
          <h2>Deine Stadt.<br />Ein System.</h2>
          <p>
            Unternehmen finden, Termine verwalten, Nachrichten lesen und später geschützte Behördenarbeit – alles in einer gemeinsamen Nexus-Oberfläche.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onOpenBusinesses}>Unternehmen entdecken <ChevronRight size={17} /></button>
            <button className="secondary-button" onClick={() => onOpenPage('hub')}>City Hub öffnen</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="nexus-core"><span>N</span><small>NEXUS</small></div>
          <span className="orbit-chip chip-one">BUSINESS</span>
          <span className="orbit-chip chip-two">CITY</span>
          <span className="orbit-chip chip-three">SERVICE</span>
        </div>
      </section>

      {usingDemoData ? (
        <div className="demo-banner">
          <Sparkles size={15} />
          <span><strong>Interaktive Vorschau:</strong> Diese Inhalte sind Demo-Daten. Die Oberfläche ist bereits klickbar, echte Bürger-/Organisationsdaten kommen schrittweise dazu.</span>
        </div>
      ) : null}

      <section className="dashboard-metrics">
        <article className="metric-card">
          <div className="metric-icon"><Building2 size={19} /></div>
          <div><span>Öffentliche Einträge</span><strong>{organizations.length}</strong><small>{openCount} aktuell geöffnet</small></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon"><CalendarDays size={19} /></div>
          <div><span>Meine Termine</span><strong>4</strong><small>Nächster morgen, 17:00</small></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon"><Mail size={19} /></div>
          <div><span>Neue Nachrichten</span><strong>3</strong><small>2 offizielle Absender</small></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon"><Star size={19} /></div>
          <div><span>Favoriten</span><strong>5</strong><small>Profile & Angebote</small></div>
        </article>
      </section>

      <section className="content-grid dashboard-main-grid">
        <article className="surface-card agenda-card">
          <div className="card-heading">
            <div><span className="eyebrow">HEUTE</span><h3>Dein Überblick</h3></div>
            <button className="text-button" onClick={() => onOpenPage('calendar')}>Kalender <ChevronRight size={15} /></button>
          </div>
          <div className="timeline-list">
            <TimelineItem time="17:00" title="Werkstatttermin" detail="Benny's Motorworks · Strawberry" icon={Settings2} />
            <TimelineItem time="18:30" title="Taxi-Reservierung" detail="Abholung: Legion Square" icon={MapPin} />
            <TimelineItem time="20:00" title="Summer Night" detail="Vespucci Beach · Stadtfest" icon={Ticket} />
          </div>
        </article>

        <article className="surface-card inbox-preview">
          <div className="card-heading">
            <div><span className="eyebrow">NEXUS MAIL</span><h3>Posteingang</h3></div>
            <button className="text-button" onClick={() => onOpenPage('mail')}>Alle <ChevronRight size={15} /></button>
          </div>
          {demoMails.slice(0, 3).map((mail) => (
            <div className="mini-mail" key={mail.id}>
              <span className={`mail-unread ${mail.unread ? 'show' : ''}`} />
              <div><strong>{mail.from}</strong><span>{mail.subject}</span></div>
              <small>{mail.time}</small>
            </div>
          ))}
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">CITY DIRECTORY</span><h3>Gerade interessant</h3><p>Öffnungsstatus und Angebote auf einen Blick.</p></div>
          <button className="text-button" onClick={onOpenBusinesses}>Alle Unternehmen <ChevronRight size={16} /></button>
        </div>
        <div className="organization-grid compact">
          {organizations.slice(0, 3).map((organization) => (
            <OrganizationCard key={organization.id} organization={organization} onOpen={() => onOpenOrganization(organization)} />
          ))}
        </div>
      </section>

      <section className="content-grid quick-grid">
        <button className="quick-card" onClick={() => onOpenPage('events')}>
          <Ticket size={22} /><span><strong>Events</strong><small>3 kommende Veranstaltungen</small></span><ChevronRight size={18} />
        </button>
        <button className="quick-card" onClick={() => onOpenPage('map')}>
          <Map size={22} /><span><strong>LS Map</strong><small>Unternehmen, Events & Hinweise</small></span><ChevronRight size={18} />
        </button>
        <button className="quick-card" onClick={() => onOpenPage('hub')}>
          <Radio size={22} /><span><strong>City Hub</strong><small>1 wichtige Stadtmeldung</small></span><ChevronRight size={18} />
        </button>
      </section>
    </div>
  )
}

function TimelineItem({ time, title, detail, icon: Icon }: { time: string; title: string; detail: string; icon: LucideIcon }) {
  return (
    <div className="timeline-item">
      <span className="timeline-time">{time}</span>
      <span className="timeline-line"><i /></span>
      <span className="timeline-icon"><Icon size={16} /></span>
      <div><strong>{title}</strong><small>{detail}</small></div>
    </div>
  )
}

function Businesses({
  organizations,
  search,
  setSearch,
  usingDemoData,
  onOpenOrganization,
}: {
  organizations: Organization[]
  search: string
  setSearch: (value: string) => void
  usingDemoData: boolean
  onOpenOrganization: (organization: Organization) => void
}) {
  return (
    <div className="page-content">
      <section className="page-intro">
        <div>
          <span className="eyebrow">CITY DIRECTORY</span>
          <h2>Unternehmen & Behörden</h2>
          <p>Öffnungszeiten, Angebote, Bewertungen und Kontakt – ohne fünf verschiedene Systeme.</p>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, Kategorie oder Standort …" />
        </label>
      </section>

      <div className="filter-row">
        {['Alle', 'Geöffnet', 'Unternehmen', 'Behörden', 'Favoriten'].map((filter, index) => (
          <button className={`filter-chip ${index === 0 ? 'is-active' : ''}`} key={filter}>{filter}</button>
        ))}
        <span className="result-count">{organizations.length} Einträge</span>
      </div>

      {usingDemoData ? <div className="demo-banner compact-banner"><Sparkles size={14} /> Vorschau-Daten aktiv</div> : null}

      <div className="organization-grid">
        {organizations.map((organization) => (
          <OrganizationCard key={organization.id} organization={organization} onOpen={() => onOpenOrganization(organization)} />
        ))}
      </div>

      {organizations.length === 0 ? <div className="empty-state">Keine passenden Einträge gefunden.</div> : null}
    </div>
  )
}

function OrganizationCard({ organization, onOpen }: { organization: Organization; onOpen: () => void }) {
  return (
    <button className="organization-card" onClick={onOpen}>
      <div className="organization-cover">
        <div className="organization-monogram">{organization.short}</div>
        <div className="card-top-actions">
          {organization.favorite ? <span className="favorite-badge"><Heart size={13} fill="currentColor" /></span> : null}
          <span className={`status-pill status-${organization.status}`}>{statusText[organization.status]}</span>
        </div>
      </div>
      <div className="organization-body">
        <div className="organization-title-row">
          <div><span className="organization-type">{organization.category}</span><h3>{organization.name}</h3></div>
          <span className="rating"><Star size={13} fill="currentColor" /> {organization.rating.toFixed(1)}</span>
        </div>
        <p>{organization.description}</p>
        <div className="offer-chips">{organization.offers.slice(0, 3).map((offer) => <span key={offer}>{offer}</span>)}</div>
        <dl className="organization-meta">
          <div><dt>Standort</dt><dd>{organization.location_label ?? 'Nicht angegeben'}</dd></div>
          <div><dt>Heute</dt><dd>{organization.opening}</dd></div>
        </dl>
        {organization.status_message ? <div className="status-message">{organization.status_message}</div> : null}
      </div>
    </button>
  )
}

function OrganizationDetail({ organization, onBack }: { organization: Organization; onBack: () => void }) {
  return (
    <div className="page-content">
      <button className="back-button" onClick={onBack}>← Zurück zum Verzeichnis</button>
      <section className="org-profile-hero">
        <div className="org-profile-mark">{organization.short}</div>
        <div className="org-profile-copy">
          <div className="org-profile-labels">
            <span className={`status-pill static status-${organization.status}`}>{statusText[organization.status]}</span>
            <span className="soft-chip">{organization.category}</span>
          </div>
          <h2>{organization.name}</h2>
          <p>{organization.description}</p>
          <div className="org-profile-meta">
            <span><MapPin size={15} /> {organization.location_label}</span>
            <span><Phone size={15} /> {organization.phone}</span>
            <span><Clock3 size={15} /> {organization.opening}</span>
          </div>
        </div>
        <div className="org-profile-actions">
          <button className="primary-button"><MessageSquareText size={17} /> Anfrage senden</button>
          <button className="secondary-button"><CalendarDays size={17} /> Reservieren</button>
          <button className="icon-button large"><Heart size={18} /></button>
        </div>
      </section>

      <section className="content-grid org-detail-grid">
        <article className="surface-card">
          <div className="card-heading"><div><span className="eyebrow">ANGEBOTE</span><h3>Produkte & Leistungen</h3></div><span className="rating big"><Star size={14} fill="currentColor" /> {organization.rating.toFixed(1)}</span></div>
          <div className="offer-list">
            {organization.offers.map((offer, index) => (
              <div className="offer-row" key={offer}>
                <span className="offer-icon"><Sparkles size={16} /></span>
                <div><strong>{offer}</strong><small>{index === 0 ? 'Ab $ 250 · verfügbar' : index === 1 ? 'Preis auf Anfrage' : 'Nur mit Termin'}</small></div>
                <ChevronRight size={17} />
              </div>
            ))}
          </div>
        </article>
        <article className="surface-card">
          <div className="card-heading"><div><span className="eyebrow">INFORMATION</span><h3>Aktueller Status</h3></div></div>
          <div className="status-feature"><span className={`status-light status-${organization.status}`} /><div><strong>{statusText[organization.status]}</strong><small>{organization.status_message ?? 'Keine zusätzliche Statusmeldung'}</small></div></div>
          <div className="info-list">
            <div><span>Hauptstandort</span><strong>{organization.location_label}</strong></div>
            <div><span>Telefon</span><strong>{organization.phone}</strong></div>
            <div><span>Heute</span><strong>{organization.opening}</strong></div>
          </div>
        </article>
      </section>

      <section className="surface-card faq-card">
        <div className="card-heading"><div><span className="eyebrow">FAQ</span><h3>Häufige Fragen</h3></div></div>
        <details open><summary>Wie stelle ich eine Kundenanfrage?</summary><p>Über „Anfrage senden“ startest du einen strukturierten Vorgang direkt im Nexus. Antworten und Statusänderungen landen anschließend in deinem persönlichen Bereich.</p></details>
        <details><summary>Kann ich direkt einen Termin buchen?</summary><p>Wenn die Organisation Reservierungen aktiviert hat, kannst du verfügbare Zeitfenster auswählen und eine Bestätigung anfordern.</p></details>
      </section>
    </div>
  )
}

function EventsPage() {
  const [joined, setJoined] = useState<string[]>(['event-3'])
  return (
    <div className="page-content">
      <section className="page-intro">
        <div><span className="eyebrow">LOS SANTOS EVENTS</span><h2>Was geht in der Stadt?</h2><p>Öffentliche Veranstaltungen, Unternehmens-Events und Community-Termine.</p></div>
        <button className="primary-button"><Ticket size={17} /> Event erstellen</button>
      </section>
      <div className="feature-banner event-banner">
        <span className="feature-kicker">NÄCHSTES HIGHLIGHT</span>
        <h3>Los Santos Summer Night</h3>
        <p>Musik, Foodtrucks und Community am Vespucci Beach.</p>
        <div><span><CalendarDays size={15} /> 12.08.2026</span><span><Clock3 size={15} /> 20:00</span><span><MapPin size={15} /> Vespucci Beach</span></div>
      </div>
      <div className="event-grid">
        {demoEvents.map((event) => {
          const isJoined = joined.includes(event.id)
          return (
            <article className="event-card" key={event.id}>
              <div className="event-date"><strong>{event.date.slice(0, 2)}</strong><span>AUG</span></div>
              <div className="event-body"><span className="soft-chip">{event.category}</span><h3>{event.title}</h3><p>{event.organizer}</p><div className="event-meta"><span><Clock3 size={14} /> {event.time}</span><span><MapPin size={14} /> {event.place}</span><span><Users size={14} /> {event.participants + (isJoined ? 1 : 0)}</span></div></div>
              <button className={isJoined ? 'joined-button' : 'secondary-button'} onClick={() => setJoined((items) => isJoined ? items.filter((id) => id !== event.id) : [...items, event.id])}>{isJoined ? <><Check size={16} /> Zugesagt</> : 'Teilnehmen'}</button>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function CityHubPage() {
  return (
    <div className="page-content">
      <section className="page-intro"><div><span className="eyebrow">CITY HUB</span><h2>Offiziell. Aktuell. Stadtweit.</h2><p>Meldungen, Pressemitteilungen, Hinweise und Nexus-Änderungen.</p></div></section>
      <div className="city-warning"><Radio size={20} /><div><strong>Stadtweite Verkehrswarnung</strong><span>Baustelle am Olympic Freeway – mit Verzögerungen rund um Pillbox Hill rechnen.</span></div><small>vor 18 Min.</small></div>
      <div className="content-grid hub-grid">
        <article className="surface-card news-feature"><span className="eyebrow">STADTVERWALTUNG</span><h3>Neue Unternehmensprofile jetzt mit Reservierungen</h3><p>Organisationen können verfügbare Termine und Reservierungsarten künftig direkt in Nexus pflegen.</p><div className="news-footer"><span><Newspaper size={14} /> Pressemitteilung</span><span>Heute · 18:42</span></div></article>
        <article className="surface-card"><span className="eyebrow">LSMC</span><h3>Hinweis zur Notaufnahme</h3><p>Die Zufahrt an der Südseite bleibt heute frei. Bitte keine Fahrzeuge im Rettungsbereich abstellen.</p><div className="news-footer"><span>Behördenhinweis</span><span>Heute · 17:10</span></div></article>
        <article className="surface-card"><span className="eyebrow">NEXUS CHANGELOG</span><h3>V1 Preview · Build 0.2</h3><p>Neues Dashboard, interaktive Unternehmensprofile, Mail-Vorschau und Kalenderansicht.</p><div className="news-footer"><span>System</span><span>Heute · 21:30</span></div></article>
      </div>
    </div>
  )
}

function MapPage({ organizations, onOpenOrganization }: { organizations: Organization[]; onOpenOrganization: (organization: Organization) => void }) {
  return (
    <div className="page-content map-page">
      <section className="page-intro compact-intro"><div><span className="eyebrow">LS MAP</span><h2>Los Santos auf einen Blick</h2></div><div className="map-tools"><button className="filter-chip is-active">Öffentlich</button><button className="filter-chip">Events</button><button className="filter-chip">Hinweise</button></div></section>
      <div className="map-shell">
        <div className="fake-map-grid" />
        <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
        {organizations.slice(0, 5).map((organization, index) => (
          <button
            key={organization.id}
            className={`map-marker marker-${index + 1} status-${organization.status}`}
            onClick={() => onOpenOrganization(organization)}
            title={organization.name}
          >
            <Building2 size={17} /><span>{organization.short}</span>
          </button>
        ))}
        <button className="map-marker event-map-marker"><Ticket size={17} /><span>EVENT</span></button>
        <div className="map-legend"><strong>Legende</strong><span><i className="legend-dot open" /> geöffnet</span><span><i className="legend-dot limited" /> eingeschränkt</span><span><i className="legend-dot event" /> Event</span></div>
      </div>
    </div>
  )
}

function CalendarPage() {
  return (
    <div className="page-content">
      <section className="page-intro"><div><span className="eyebrow">MEIN KALENDER</span><h2>August 2026</h2><p>Persönliche Termine, Reservierungen und manuell eingetragene Geburtstage.</p></div><button className="primary-button"><CalendarDays size={17} /> Neuer Termin</button></section>
      <div className="calendar-layout">
        <div className="calendar-card">
          <div className="calendar-weekdays">{['MO','DI','MI','DO','FR','SA','SO'].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {Array.from({ length: 35 }).map((_, index) => {
              const day = index - 4
              const valid = day > 0 && day <= 31
              const has = [10, 11, 12, 14, 16, 21].includes(day)
              return <button key={index} className={`${!valid ? 'muted-day' : ''} ${day === 9 ? 'today' : ''}`}><span>{valid ? day : ''}</span>{has ? <i /> : null}</button>
            })}
          </div>
        </div>
        <aside className="surface-card calendar-agenda">
          <div className="card-heading"><div><span className="eyebrow">NÄCHSTES</span><h3>Deine Termine</h3></div></div>
          <TimelineItem time="MORGEN" title="Alex hat Geburtstag" detail="Manueller Geburtstagseintrag" icon={CircleUserRound} />
          <TimelineItem time="17:00" title="Werkstatttermin" detail="Benny's Motorworks" icon={Settings2} />
          <TimelineItem time="18:30" title="Taxi-Reservierung" detail="Los Santos Taxi" icon={MapPin} />
          <TimelineItem time="20:00" title="Summer Night" detail="Vespucci Beach" icon={Ticket} />
        </aside>
      </div>
    </div>
  )
}

function MailPage() {
  const [selectedId, setSelectedId] = useState(demoMails[0].id)
  const selected = demoMails.find((mail) => mail.id === selectedId) ?? demoMails[0]
  return (
    <div className="mail-page">
      <aside className="mail-list-panel">
        <div className="mail-panel-head"><div><span className="eyebrow">NEXUS MAIL</span><h2>Posteingang</h2></div><button className="compose-button">+</button></div>
        <label className="mail-search"><Search size={15} /><input placeholder="Nachrichten suchen …" /></label>
        <div className="mail-tabs"><button className="is-active">Posteingang <span>3</span></button><button>Archiv</button></div>
        <div className="mail-list">{demoMails.map((mail) => <button className={`mail-list-item ${mail.id === selectedId ? 'is-active' : ''}`} onClick={() => setSelectedId(mail.id)} key={mail.id}><span className={`mail-unread ${mail.unread ? 'show' : ''}`} /><div><strong>{mail.from}{mail.verified ? <ShieldCheck size={13} /> : null}</strong><span>{mail.subject}</span><small>{mail.preview}</small></div><time>{mail.time}</time></button>)}</div>
      </aside>
      <section className="mail-thread-panel">
        <div className="thread-head"><div><span className="eyebrow">NACHRICHT</span><h2>{selected.subject}</h2></div><button className="secondary-button">Archivieren</button></div>
        <div className="thread-message"><div className="thread-avatar">{selected.from.slice(0, 2).toUpperCase()}</div><div className="thread-bubble"><div className="thread-sender"><strong>{selected.from}{selected.verified ? <ShieldCheck size={14} /> : null}</strong><span>{selected.time}</span></div><p>{selected.preview}</p><p>Diese Ansicht zeigt bereits, wie persönliche und offizielle Nexus-Nachrichten später in Threads dargestellt werden können.</p></div></div>
        <div className="reply-box"><textarea placeholder="Antwort schreiben …" /><div><span>Markdown & Links unterstützt</span><button className="primary-button">Senden</button></div></div>
      </section>
    </div>
  )
}

function AccountPage({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [highContrast, setHighContrast] = useState(false)
  return (
    <div className={`page-content ${highContrast ? 'preview-high-contrast' : ''}`}>
      <section className="profile-header-card">
        <div className="profile-avatar-large">DB</div>
        <div><span className="eyebrow">BÜRGERPROFIL</span><h2>Demo Bürger <ShieldCheck size={19} /></h2><p>NX-000042 · demo.buerger@nexus.ls</p><div className="badge-row"><span>Verifiziert</span><span>Eventhelfer</span><span>Unternehmer</span></div></div>
        <button className="secondary-button" onClick={onOpenAuth}>Login / Registrierung ansehen</button>
      </section>
      <div className="settings-grid">
        <article className="surface-card"><div className="card-heading"><div><span className="eyebrow">PRIVATSPHÄRE</span><h3>Sichtbarkeit</h3></div><LockKeyhole size={19} /></div><SettingRow title="Telefonnummer" value="Niemand" /><SettingRow title="Nexus-Mail" value="Bürger" /><SettingRow title="Geburtsdatum" value="Niemand" /><SettingRow title="Neue Direktkontakte" value="Erlaubt" /></article>
        <article className="surface-card"><div className="card-heading"><div><span className="eyebrow">DARSTELLUNG</span><h3>Persönliche Ansicht</h3></div><Settings2 size={19} /></div><SettingRow title="Design" value="Dark" /><SettingRow title="Akzent" value="Violett" /><div className="toggle-row"><div><strong>High Contrast</strong><small>Nur für deinen Account</small></div><button className={`toggle ${highContrast ? 'on' : ''}`} onClick={() => setHighContrast((value) => !value)}><span /></button></div></article>
        <article className="surface-card wide-setting"><div className="card-heading"><div><span className="eyebrow">BADGES</span><h3>Profil-Abzeichen</h3></div><Star size={19} /></div><p className="setting-description">Die Stadt kann Badges vergeben. Du entscheidest selbst, welche deiner erhaltenen Badges öffentlich angezeigt werden.</p><div className="badge-manager"><span className="selected">✓ Verifiziert</span><span className="selected">✓ Eventhelfer</span><span>Unternehmer</span><span>Community</span></div></article>
      </div>
    </div>
  )
}

function SettingRow({ title, value }: { title: string; value: string }) {
  return <button className="setting-row"><span>{title}</span><strong>{value}</strong><ChevronRight size={15} /></button>
}

function ProtectedModule({ page }: { page: PageId }) {
  const config: Partial<Record<PageId, { title: string; icon: LucideIcon; description: string; items: string[] }>> = {
    medical: { title: 'Medical', icon: HeartPulse, description: 'Krankenakten, Behandlungen, Ausbildung und medizinische Wissensdatenbank.', items: ['Patientensuche', 'Krankenakten', 'Behandlungen', 'Ausbildung & Tests'] },
    police: { title: 'Police', icon: Shield, description: 'Fälle, Beweismittel, Fahndungen, Fahrzeuge und Bußgelder.', items: ['Fälle & Ermittlungen', 'Beweismittel', 'Fahndungen', 'Bußgelder'] },
    fire: { title: 'Fire & Rescue', icon: Flame, description: 'Einsatzberichte, Objektdaten, Fahrzeuge, Geräte und Brandschutz.', items: ['Einsatzberichte', 'Objektpläne', 'Fahrzeugchecks', 'Brandschutz'] },
  }
  const entry = config[page] ?? config.medical!
  const Icon = entry.icon
  return (
    <div className="page-content">
      <section className="protected-hero"><div className="protected-icon"><Icon size={30} /></div><div><span className="eyebrow">GESCHÜTZTES MODUL · VORSCHAU</span><h2>{entry.title}</h2><p>{entry.description}</p></div><span className="permission-pill"><LockKeyhole size={14} /> Rechtebasiert</span></section>
      <div className="protected-grid">{entry.items.map((item, index) => <article className="protected-card" key={item}><div><span>0{index + 1}</span><BookOpen size={20} /></div><h3>{item}</h3><p>Später nur sichtbar, wenn die Organisationsrolle die passende Nexus-Berechtigung besitzt.</p><button>Vorschau öffnen <ChevronRight size={15} /></button></article>)}</div>
      <div className="permission-note"><ShieldCheck size={18} /><div><strong>Technische Admins sehen Fachakten nicht automatisch.</strong><span>Der Zugriff auf Medical-, Police- und Justice-Daten bleibt strikt von Systemrollen getrennt.</span></div></div>
    </div>
  )
}

function NotificationPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="notification-popover">
      <div className="popover-head"><div><span className="eyebrow">BENACHRICHTIGUNGEN</span><strong>3 neue</strong></div><button onClick={onClose}><X size={16} /></button></div>
      <div className="notification-item"><span className="notification-icon"><CalendarDays size={16} /></span><div><strong>Reservierung bestätigt</strong><small>Los Santos Taxi · vor 12 Min.</small></div></div>
      <div className="notification-item"><span className="notification-icon"><Mail size={16} /></span><div><strong>Neue offizielle Mail</strong><small>Stadtverwaltung · vor 26 Min.</small></div></div>
      <div className="notification-item"><span className="notification-icon"><Radio size={16} /></span><div><strong>Verkehrswarnung</strong><small>City Hub · vor 18 Min.</small></div></div>
      <button className="popover-footer">Alle Benachrichtigungen anzeigen</button>
    </div>
  )
}

function AuthPreview({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true) }
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <div className="auth-brand"><span>N</span><div><strong>LG NEXUS</strong><small>Connecting Los Santos</small></div></div>
        <div className="auth-tabs"><button className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login'); setSubmitted(false) }}>Anmelden</button><button className={mode === 'register' ? 'is-active' : ''} onClick={() => { setMode('register'); setSubmitted(false) }}>Registrieren</button></div>
        {submitted ? (
          <div className="auth-success"><span><Check size={24} /></span><h3>{mode === 'login' ? 'Demo-Anmeldung erfolgreich' : 'Registrierung als Vorschau erfasst'}</h3><p>Die echte Authentifizierung wird als nächstes an die bereits vorbereitete Supabase-Accountstruktur angeschlossen.</p><button className="primary-button" onClick={onClose}>Nexus öffnen</button></div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' ? <div className="form-row"><label>Vorname<input required placeholder="Alex" /></label><label>Nachname<input required placeholder="Morgan" /></label></div> : null}
            <label>Benutzername<input required placeholder="benutzername" /></label>
            {mode === 'register' ? <label>RP-Geburtsdatum<input required type="date" /></label> : null}
            <label>Passwort<input required type="password" placeholder="••••••••••" /></label>
            {mode === 'register' ? <label>Passwort wiederholen<input required type="password" placeholder="••••••••••" /></label> : null}
            <button className="primary-button auth-submit" type="submit">{mode === 'login' ? 'Anmelden' : 'Registrierung absenden'} <ChevronRight size={17} /></button>
            <p className="auth-hint">{mode === 'register' ? 'Neue Accounts landen zunächst im Status „pending“ und müssen freigeschaltet werden.' : 'Dies ist aktuell eine klickbare UI-Vorschau, noch kein echter Login.'}</p>
          </form>
        )}
      </div>
    </div>
  )
}

export default App
