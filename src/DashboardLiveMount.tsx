import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Building2, ChevronRight, Flame, HeartPulse, Landmark, MapPin, RefreshCw, Scale, Shield } from 'lucide-react'
import NexusOrbitMark from './NexusOrbitMark'
import { supabase } from './lib/supabase'

type Profile = {
  id: string
  display_name: string
  nexus_id: string | null
  account_status: string
}

type OrganizationContext = {
  organization_id: string
  organization_name: string
  organization_short_name: string | null
  role_name: string
  is_owner: boolean
  permissions?: string[]
}

type PublicOrganization = {
  id: string
  name: string
  short_name: string | null
  status: 'open' | 'limited' | 'closed'
  status_message: string | null
  location_label: string | null
  service_module: string | null
  organization_type: string
}

type ServiceShortcut = {
  key: 'city' | 'medical' | 'police' | 'fire' | 'justice'
  label: string
  navLabel: string
  permission: string
  icon: typeof Landmark
}

const shortcuts: ServiceShortcut[] = [
  { key: 'city', label: 'Stadtverwaltung', navLabel: 'Stadtverwaltung', permission: 'city.access', icon: Landmark },
  { key: 'medical', label: 'Medical', navLabel: 'Medical', permission: 'medical.access', icon: HeartPulse },
  { key: 'police', label: 'Police', navLabel: 'Police', permission: 'police.access', icon: Shield },
  { key: 'fire', label: 'Fire & Rescue', navLabel: 'Fire & Rescue', permission: 'fire.access', icon: Flame },
  { key: 'justice', label: 'Justice', navLabel: 'Justice', permission: 'justice.access', icon: Scale },
]

const statusLabel: Record<PublicOrganization['status'], string> = {
  open: 'Geöffnet',
  limited: 'Eingeschränkt',
  closed: 'Geschlossen',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'NX'
}

function setText(element: Element | null | undefined, value: string) {
  if (element && element.textContent !== value) element.textContent = value
}

function openNavigation(label: string) {
  const button = document.querySelector<HTMLButtonElement>(`.nav-button[aria-label="${label}"]`)
  button?.click()
}

export default function DashboardLiveMount() {
  const [target, setTarget] = useState<Element | null>(null)
  const [active, setActive] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const sync = () => {
      setTarget(document.querySelector('.main-area'))
      const button = document.querySelector('.nav-button[aria-label="Dashboard"]')
      setActive(Boolean(button?.classList.contains('is-active')))
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let disposed = false

    const updateShell = (nextProfile: Profile | null) => {
      const chip = document.querySelector('.user-chip')
      const avatar = chip?.querySelector('.user-avatar')
      const name = chip?.querySelector('strong')
      const nexusId = chip?.querySelector('small')

      if (nextProfile) {
        setText(avatar, initials(nextProfile.display_name))
        setText(name, nextProfile.display_name)
        setText(nexusId, nextProfile.nexus_id ?? 'Nexus-ID folgt')
      } else {
        setText(avatar, 'NX')
        setText(name, 'Nicht angemeldet')
        setText(nexusId, 'Anmelden')
      }

      setText(document.querySelector('.topbar-title .eyebrow'), 'LG NEXUS')
    }

    const refresh = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id
      if (!userId) {
        if (!disposed) {
          setProfile(null)
          updateShell(null)
        }
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('id,display_name,nexus_id,account_status')
        .eq('id', userId)
        .maybeSingle()

      if (disposed) return
      const next = data && data.account_status === 'active' ? data as Profile : null
      setProfile(next)
      updateShell(next)
    }

    document.body.dataset.nexusLiveShell = 'true'
    void refresh()

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void refresh(), 0)
    })

    return () => {
      disposed = true
      authListener.subscription.unsubscribe()
      delete document.body.dataset.nexusLiveShell
    }
  }, [])

  useEffect(() => {
    if (active) document.body.dataset.nexusDashboardWorkspace = 'true'
    else delete document.body.dataset.nexusDashboardWorkspace
    return () => { delete document.body.dataset.nexusDashboardWorkspace }
  }, [active])

  if (!target || !active) return null
  return createPortal(<div className="nexus-dashboard-page-slot"><LiveDashboard profile={profile} /></div>, target)
}

function LiveDashboard({ profile }: { profile: Profile | null }) {
  const [contexts, setContexts] = useState<OrganizationContext[]>([])
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const organizationRequest = supabase
      .from('organizations')
      .select('id,name,short_name,status,status_message,location_label,service_module,organization_type')
      .eq('is_public', true)
      .eq('is_archived', false)
      .order('name')

    const contextRequest = profile
      ? supabase.rpc('get_my_organization_context')
      : Promise.resolve({ data: [], error: null })

    const [organizationResult, contextResult] = await Promise.all([organizationRequest, contextRequest])

    if (organizationResult.error) setError('Die Stadtübersicht konnte nicht vollständig geladen werden.')
    setOrganizations(Array.isArray(organizationResult.data) ? organizationResult.data as PublicOrganization[] : [])
    setContexts(Array.isArray(contextResult.data) ? contextResult.data as OrganizationContext[] : [])
    setLoading(false)
  }, [profile?.id])

  useEffect(() => { void load() }, [load])

  const permissionSet = useMemo(() => {
    const set = new Set<string>()
    for (const context of contexts) for (const permission of context.permissions ?? []) set.add(permission)
    return set
  }, [contexts])

  const myShortcuts = shortcuts.filter((shortcut) => permissionSet.has(shortcut.permission))
  const visibleOrganizations = organizations.slice(0, 8)

  return (
    <div className="page-content live-dashboard">
      <section className="live-dashboard-hero nexus-brand-hero">
        <div className="live-dashboard-hero-copy nexus-brand-hero-copy">
          <span className="eyebrow">LG NEXUS · CONNECTING LOS SANTOS</span>
          <h2>{profile ? `Willkommen, ${profile.display_name}.` : 'Deine Stadt. Ein System.'}</h2>
          <p>{profile ? `${profile.nexus_id ?? 'Nexus-ID folgt'} · Unternehmen finden, Termine verwalten und deine freigeschalteten Bereiche direkt öffnen.` : 'Unternehmen finden, Termine verwalten und alles Wichtige in einer gemeinsamen Nexus-Oberfläche.'}</p>
          <div className="live-dashboard-hero-actions">
            <button type="button" className="primary-button" onClick={() => openNavigation('Unternehmen')}>Unternehmen entdecken <ChevronRight size={15} /></button>
            <button type="button" className="live-dashboard-refresh" onClick={() => void load()} disabled={loading}><RefreshCw size={15} /> Aktualisieren</button>
          </div>
        </div>
        <NexusOrbitMark className="nexus-brand-hero-logo" />
      </section>

      {error ? <div className="live-dashboard-message">{error}</div> : null}

      <section className="live-dashboard-block">
        <div className="live-dashboard-heading">
          <div><span className="eyebrow">MEINE BEREICHE</span><h3>Schnellzugriff</h3></div>
          <small>{myShortcuts.length} verfügbar</small>
        </div>
        <div className="live-dashboard-shortcuts">
          {profile && myShortcuts.length > 0 ? myShortcuts.map((shortcut) => {
            const Icon = shortcut.icon
            const memberships = contexts.filter((context) => context.permissions?.includes(shortcut.permission))
            return <button key={shortcut.key} type="button" onClick={() => openNavigation(shortcut.navLabel)}>
              <span className="live-dashboard-shortcut-icon"><Icon size={19} /></span>
              <span><strong>{shortcut.label}</strong><small>{memberships.map((item) => item.role_name).filter(Boolean).join(' · ') || 'Zugriff aktiv'}</small></span>
              <ChevronRight size={16} />
            </button>
          }) : <div className="live-dashboard-empty">{profile ? 'Für diesen Account sind aktuell keine Fachbereiche freigeschaltet.' : 'Nach der Anmeldung erscheinen hier deine freigeschalteten Bereiche.'}</div>}
        </div>
      </section>

      <section className="live-dashboard-block">
        <div className="live-dashboard-heading">
          <div><span className="eyebrow">STADTÜBERSICHT</span><h3>Organisationen</h3></div>
          <button type="button" className="live-dashboard-text-button" onClick={() => openNavigation('Unternehmen')}>Alle ansehen <ChevronRight size={14} /></button>
        </div>
        <div className="live-dashboard-organizations">
          {loading && visibleOrganizations.length === 0 ? <div className="live-dashboard-empty">Stadtübersicht wird geladen …</div> : visibleOrganizations.length === 0 ? <div className="live-dashboard-empty">Noch keine öffentlichen Organisationen vorhanden.</div> : visibleOrganizations.map((organization) => <article key={organization.id}>
            <div className="live-dashboard-org-icon"><Building2 size={18} /></div>
            <div className="live-dashboard-org-main">
              <strong>{organization.name}</strong>
              <small>{organization.location_label ? <><MapPin size={12} /> {organization.location_label}</> : 'Los Santos'}</small>
              {organization.status_message ? <p>{organization.status_message}</p> : null}
            </div>
            <span className={`live-dashboard-status is-${organization.status}`}>{statusLabel[organization.status]}</span>
          </article>)}
        </div>
      </section>

      <section className="live-dashboard-footer-card">
        <div><strong>Alles Wichtige direkt erreichbar.</strong><span>Fachbereiche erscheinen nur, wenn dein Account die passende Freigabe besitzt.</span></div>
        <Landmark size={22} />
      </section>
    </div>
  )
}
