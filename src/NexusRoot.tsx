import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Session } from '@supabase/supabase-js'
import App from './App'
import { nexusAuthEmail, registerNexusUser, supabase } from './lib/supabase'

type AccountStatus = 'pending' | 'active' | 'suspended' | 'rejected' | 'disabled'

type NexusProfile = {
  id: string
  display_name: string
  username: string | null
  first_name: string | null
  last_name: string | null
  account_status: AccountStatus
  nexus_id: string | null
  nexus_email: string | null
}

type OrganizationContext = {
  organization_id: string
  organization_name: string
  role_name: string
  is_owner: boolean
  permissions: string[]
}

const statusLabels: Record<AccountStatus, string> = {
  pending: 'Wartet auf Freischaltung',
  active: 'Aktiv',
  suspended: 'Gesperrt',
  rejected: 'Abgelehnt',
  disabled: 'Deaktiviert',
}

function initials(profile: NexusProfile | null) {
  if (!profile) return 'AN'
  const first = profile.first_name?.trim().charAt(0) ?? ''
  const last = profile.last_name?.trim().charAt(0) ?? ''
  const combined = `${first}${last}`.toUpperCase()
  return combined || profile.username?.slice(0, 2).toUpperCase() || 'NX'
}

export default function NexusRoot() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<NexusProfile | null>(null)
  const [organizations, setOrganizations] = useState<OrganizationContext[]>([])
  const [authLoading, setAuthLoading] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)
  const [topbarTarget, setTopbarTarget] = useState<Element | null>(null)
  const [accountTarget, setAccountTarget] = useState<Element | null>(null)

  const loadAccount = async (activeSession: Session | null) => {
    if (!activeSession?.user?.id) {
      setProfile(null)
      setOrganizations([])
      setAuthLoading(false)
      return
    }

    setAuthLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id,display_name,username,first_name,last_name,account_status,nexus_id,nexus_email')
      .eq('id', activeSession.user.id)
      .maybeSingle()

    if (error || !data) {
      setProfile(null)
      setOrganizations([])
      setAuthLoading(false)
      return
    }

    const nextProfile = data as NexusProfile
    setProfile(nextProfile)

    if (nextProfile.account_status === 'active') {
      const { data: orgData } = await supabase.rpc('get_my_organization_context')
      setOrganizations(Array.isArray(orgData) ? (orgData as OrganizationContext[]) : [])
    } else {
      setOrganizations([])
    }

    setAuthLoading(false)
  }

  useEffect(() => {
    document.body.classList.add('nexus-auth-live')

    const syncTargets = () => {
      const nextTopbar = document.querySelector('.topbar-actions')
      const nextAccount = document.querySelector('.profile-header-card')
      setTopbarTarget((current) => current === nextTopbar ? current : nextTopbar)
      setAccountTarget((current) => current === nextAccount ? current : nextAccount)
    }

    syncTargets()
    const observer = new MutationObserver(syncTargets)
    observer.observe(document.body, { childList: true, subtree: true })

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      void loadAccount(data.session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      window.setTimeout(() => void loadAccount(nextSession), 0)
    })

    return () => {
      observer.disconnect()
      authListener.subscription.unsubscribe()
      document.body.classList.remove('nexus-auth-live')
    }
  }, [])

  const accountLabel = useMemo(() => {
    if (authLoading) return 'Account wird geladen'
    if (!session) return 'Anmelden / Registrieren'
    if (!profile) return 'Profil nicht verfügbar'
    return profile.account_status === 'active'
      ? profile.nexus_id ?? statusLabels.active
      : statusLabels[profile.account_status]
  }, [authLoading, profile, session])

  return (
    <>
      <App />

      {topbarTarget ? createPortal(
        <button className="real-user-chip" onClick={() => setAuthOpen(true)}>
          <span className="real-user-avatar">{initials(profile)}</span>
          <span className="real-user-copy">
            <strong>{profile?.display_name || (session ? 'Nexus Account' : 'Nicht angemeldet')}</strong>
            <small>{accountLabel}</small>
          </span>
        </button>,
        topbarTarget,
      ) : null}

      {accountTarget ? createPortal(
        <RealAccountHeader
          session={session}
          profile={profile}
          organizations={organizations}
          loading={authLoading}
          onOpenAuth={() => setAuthOpen(true)}
        />,
        accountTarget,
      ) : null}

      {authOpen ? (
        <RealAuthModal
          session={session}
          profile={profile}
          organizations={organizations}
          loading={authLoading}
          onClose={() => setAuthOpen(false)}
        />
      ) : null}
    </>
  )
}

function RealAccountHeader({
  session,
  profile,
  organizations,
  loading,
  onOpenAuth,
}: {
  session: Session | null
  profile: NexusProfile | null
  organizations: OrganizationContext[]
  loading: boolean
  onOpenAuth: () => void
}) {
  return (
    <div className="real-account-overlay">
      <div className="real-account-avatar">{initials(profile)}</div>
      <div className="real-account-main">
        <span className="real-account-kicker">NEXUS ACCOUNT</span>
        <h2>{loading ? 'Account wird geladen …' : profile?.display_name ?? 'Noch nicht angemeldet'}</h2>
        {profile ? (
          <p>
            {profile.account_status === 'active'
              ? `${profile.nexus_id ?? 'Nexus-ID wird erstellt'} · ${profile.nexus_email ?? 'Nexus-Mail wird erstellt'}`
              : statusLabels[profile.account_status]}
          </p>
        ) : (
          <p>{session ? 'Für diesen Login konnte kein Bürgerprofil geladen werden.' : 'Melde dich an oder erstelle einen neuen Account.'}</p>
        )}
        {profile?.account_status === 'active' ? (
          <div className="real-account-meta">
            <span>{organizations.length} Organisation{organizations.length === 1 ? '' : 'en'}</span>
            <span>Benutzername: {profile.username}</span>
          </div>
        ) : null}
      </div>
      <button className="secondary-button" onClick={onOpenAuth}>
        {session ? 'Account verwalten' : 'Anmelden / Registrieren'}
      </button>
    </div>
  )
}

function RealAuthModal({
  session,
  profile,
  organizations,
  loading,
  onClose,
}: {
  session: Session | null
  profile: NexusProfile | null
  organizations: OrganizationContext[]
  loading: boolean
  onClose: () => void
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    const form = new FormData(event.currentTarget)
    const username = String(form.get('username') ?? '').trim().toLowerCase()
    const password = String(form.get('password') ?? '')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: nexusAuthEmail(username),
      password,
    })

    setSubmitting(false)
    if (signInError) {
      setError('Benutzername oder Passwort ist falsch.')
      return
    }

    setMessage('Anmeldung erfolgreich.')
    window.setTimeout(onClose, 450)
  }

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const form = new FormData(event.currentTarget)
    const firstName = String(form.get('firstName') ?? '').trim()
    const lastName = String(form.get('lastName') ?? '').trim()
    const username = String(form.get('username') ?? '').trim().toLowerCase()
    const dateOfBirth = String(form.get('dateOfBirth') ?? '').trim()
    const password = String(form.get('password') ?? '')
    const passwordRepeat = String(form.get('passwordRepeat') ?? '')

    if (password !== passwordRepeat) {
      setError('Die beiden Passwörter stimmen nicht überein.')
      return
    }

    setSubmitting(true)
    try {
      const result = await registerNexusUser({ username, firstName, lastName, dateOfBirth, password })
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: nexusAuthEmail(username),
        password,
      })

      if (signInError) throw new Error('Der Account wurde erstellt, die automatische Anmeldung ist aber fehlgeschlagen.')
      setMessage(result.message ?? 'Registrierung erfolgreich. Dein Account wartet auf Freischaltung.')
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Die Registrierung ist fehlgeschlagen.')
    } finally {
      setSubmitting(false)
    }
  }

  const signOut = async () => {
    setSubmitting(true)
    setError('')
    await supabase.auth.signOut()
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="real-auth-backdrop" onMouseDown={onClose}>
      <div className="real-auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="real-auth-close" onClick={onClose} aria-label="Schließen">×</button>
        <div className="real-auth-brand">
          <span>N</span>
          <div><strong>LG NEXUS</strong><small>Connecting Los Santos</small></div>
        </div>

        {session ? (
          <div className="real-auth-account">
            <div className="real-auth-status-row">
              <span className={`real-status-badge status-${profile?.account_status ?? 'pending'}`}>
                {loading ? 'Wird geladen …' : profile ? statusLabels[profile.account_status] : 'Profil fehlt'}
              </span>
            </div>
            <h3>{profile?.display_name ?? 'Nexus Account'}</h3>
            <p className="real-auth-muted">Benutzername: {profile?.username ?? '–'}</p>

            {profile?.account_status === 'pending' ? (
              <div className="real-auth-info">
                <strong>Deine Registrierung ist eingegangen.</strong>
                <span>Bitte wende dich zur Freischaltung an einen Mitarbeiter der Stadthalle. Bis zur Freigabe bleiben geschützte Bereiche gesperrt.</span>
              </div>
            ) : null}

            {profile?.account_status === 'active' ? (
              <div className="real-auth-details">
                <div><span>Nexus-ID</span><strong>{profile.nexus_id ?? '–'}</strong></div>
                <div><span>Nexus-Mail</span><strong>{profile.nexus_email ?? '–'}</strong></div>
                <div><span>Organisationen</span><strong>{organizations.length}</strong></div>
              </div>
            ) : null}

            {profile && ['suspended', 'rejected', 'disabled'].includes(profile.account_status) ? (
              <div className="real-auth-info warning">
                <strong>Der Account kann derzeit nicht vollständig genutzt werden.</strong>
                <span>Der aktuelle Status lautet „{statusLabels[profile.account_status]}“.</span>
              </div>
            ) : null}

            <button className="real-auth-danger" disabled={submitting} onClick={signOut}>Abmelden</button>
          </div>
        ) : (
          <>
            <div className="real-auth-tabs">
              <button className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login'); setError(''); setMessage('') }}>Anmelden</button>
              <button className={mode === 'register' ? 'is-active' : ''} onClick={() => { setMode('register'); setError(''); setMessage('') }}>Registrieren</button>
            </div>

            {mode === 'login' ? (
              <form className="real-auth-form" onSubmit={submitLogin}>
                <label>Benutzername<input name="username" required autoComplete="username" placeholder="benutzername" /></label>
                <label>Passwort<input name="password" required type="password" autoComplete="current-password" placeholder="••••••••" /></label>
                {error ? <div className="real-auth-error">{error}</div> : null}
                {message ? <div className="real-auth-success">{message}</div> : null}
                <button className="primary-button real-auth-submit" type="submit" disabled={submitting}>{submitting ? 'Anmeldung läuft …' : 'Anmelden'}</button>
              </form>
            ) : (
              <form className="real-auth-form" onSubmit={submitRegistration}>
                <div className="real-auth-form-row">
                  <label>Vorname<input name="firstName" required autoComplete="given-name" placeholder="Alex" /></label>
                  <label>Nachname<input name="lastName" required autoComplete="family-name" placeholder="Morgan" /></label>
                </div>
                <label>Benutzername<input name="username" required autoComplete="username" placeholder="alex.morgan" /></label>
                <label>Geburtsdatum<input name="dateOfBirth" required type="date" /></label>
                <label>Passwort<input name="password" required minLength={8} type="password" autoComplete="new-password" placeholder="Mindestens 8 Zeichen" /></label>
                <label>Passwort wiederholen<input name="passwordRepeat" required minLength={8} type="password" autoComplete="new-password" placeholder="••••••••" /></label>
                {error ? <div className="real-auth-error">{error}</div> : null}
                {message ? <div className="real-auth-success">{message}</div> : null}
                <button className="primary-button real-auth-submit" type="submit" disabled={submitting}>{submitting ? 'Registrierung läuft …' : 'Registrierung absenden'}</button>
                <p className="real-auth-hint">Neue Accounts warten nach der Registrierung auf Freischaltung durch die Stadtverwaltung.</p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
