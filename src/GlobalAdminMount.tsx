import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Ban, Check, Crown, Eye, KeyRound, RefreshCw, Search, ShieldCheck, ShieldPlus, Trash2, UserCheck } from 'lucide-react'
import { supabase } from './lib/supabase'

type GlobalContext = {
  is_root: boolean
  is_superadmin: boolean
  is_global_admin: boolean
  can_manage_superadmins: boolean
}

type Membership = {
  organization_id: string
  organization_name: string
  role_name: string
  is_owner: boolean
  row_version: number
}

type ProfileResult = {
  profile_id: string
  display_name: string
  username: string | null
  nexus_id: string | null
  account_status: string
  must_change_password: boolean
  is_root: boolean
  is_superadmin: boolean
  memberships: Membership[]
}

type AuditEntry = {
  id: number
  action_key: string
  reason: string | null
  metadata: Record<string, unknown>
  created_at: string
  actor_name: string
  target_name: string | null
  organization_name: string | null
}

type AccessInfo = {
  is_root: boolean
  is_superadmin: boolean
  services: { city: boolean; medical: boolean; police: boolean; fire: boolean; justice: boolean }
  memberships: Array<{ organization_name: string; organization_id: string; role_name: string; is_owner: boolean; permissions: string[] }>
}

const dateTime = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

function accountTarget() {
  return document.querySelector('.profile-header-card')?.parentElement ?? null
}

export default function GlobalAdminMount() {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    const sync = () => {
      const next = accountTarget()
      setTarget((current) => current === next ? current : next)
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return target ? createPortal(<GlobalAdminPanel />, target) : null
}

function GlobalAdminPanel() {
  const [context, setContext] = useState<GlobalContext | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProfileResult[]>([])
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [accessFor, setAccessFor] = useState<string | null>(null)
  const [access, setAccess] = useState<AccessInfo | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: contextError } = await supabase.rpc('get_my_global_admin_context')
    if (contextError) {
      setContext(null)
      setAudit([])
      setLoading(false)
      return
    }
    const next = data as GlobalContext
    setContext(next)
    if (next?.is_global_admin) {
      const { data: auditData } = await supabase.rpc('global_admin_list_audit', { limit_count: 30 })
      setAudit(Array.isArray(auditData) ? auditData as AuditEntry[] : [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  const search = async () => {
    if (query.trim().length < 2) { setError('Bitte mindestens zwei Zeichen eingeben.'); return }
    setError(''); setNotice('')
    const { data, error: searchError } = await supabase.rpc('global_admin_search_profiles', { search_text: query.trim() })
    if (searchError) { setError('Die Bürgersuche konnte nicht ausgeführt werden.'); return }
    setResults(Array.isArray(data) ? data as ProfileResult[] : [])
  }

  const refreshSearch = async () => {
    if (query.trim().length >= 2) await search()
    await load()
  }

  const reason = (label: string) => window.prompt(label, '')?.trim() ?? ''

  const setStatus = async (profile: ProfileResult, status: 'active' | 'suspended') => {
    const why = reason(status === 'suspended' ? `Grund für die Sperre von ${profile.display_name}:` : `Grund für die Freigabe von ${profile.display_name}:`)
    if (!why) return
    setWorking(profile.profile_id); setError(''); setNotice('')
    const { error: actionError } = await supabase.rpc('global_admin_set_account_status', { target_profile: profile.profile_id, new_status: status, action_reason: why })
    setWorking(null)
    if (actionError) { setError(actionError.message ?? 'Der Accountstatus konnte nicht geändert werden.'); return }
    setNotice(status === 'suspended' ? `${profile.display_name} wurde gesperrt.` : `${profile.display_name} wurde freigegeben.`)
    await refreshSearch(); window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  const forcePassword = async (profile: ProfileResult) => {
    const why = reason(`Grund für den erzwungenen Passwortwechsel bei ${profile.display_name}:`)
    if (!why) return
    setWorking(profile.profile_id); setError(''); setNotice('')
    const { error: actionError } = await supabase.rpc('global_admin_force_password_change', { target_profile: profile.profile_id, action_reason: why })
    setWorking(null)
    if (actionError) { setError(actionError.message ?? 'Der Passwortwechsel konnte nicht angefordert werden.'); return }
    setNotice(`${profile.display_name} muss beim nächsten vorgesehenen Ablauf das Passwort ändern.`)
    await refreshSearch()
  }

  const setSuperadmin = async (profile: ProfileResult, enabled: boolean) => {
    const why = reason(enabled ? `Grund für die Ernennung von ${profile.display_name} zum Superadmin:` : `Grund für den Entzug des Superadmin-Zugriffs bei ${profile.display_name}:`)
    if (!why) return
    setWorking(profile.profile_id); setError(''); setNotice('')
    const { error: actionError } = await supabase.rpc('root_set_superadmin', { target_profile: profile.profile_id, enabled, action_reason: why })
    setWorking(null)
    if (actionError) { setError(actionError.message ?? 'Die Superadmin-Zuweisung konnte nicht geändert werden.'); return }
    setNotice(enabled ? `${profile.display_name} ist jetzt Superadmin.` : `${profile.display_name} ist kein Superadmin mehr.`)
    await refreshSearch(); window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  const removeMembership = async (profile: ProfileResult, membership: Membership) => {
    const why = reason(`Grund für das Entfernen von ${profile.display_name} aus ${membership.organization_name}:`)
    if (!why && membership.is_owner) return
    setWorking(`${profile.profile_id}:${membership.organization_id}`); setError(''); setNotice('')
    const { error: actionError } = await supabase.rpc('remove_organization_member', {
      target_org: membership.organization_id,
      target_profile: profile.profile_id,
      expected_member_row_version: membership.row_version,
      removal_reason: why,
    })
    setWorking(null)
    if (actionError) { setError(actionError.message ?? 'Die Mitgliedschaft konnte nicht beendet werden.'); return }
    setNotice(`${profile.display_name} wurde aus ${membership.organization_name} entfernt.`)
    await refreshSearch(); window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  const inspectAccess = async (profile: ProfileResult) => {
    setAccessFor(profile.profile_id); setAccess(null); setError('')
    const { data, error: accessError } = await supabase.rpc('global_admin_get_profile_access', { target_profile: profile.profile_id })
    if (accessError) { setAccessFor(null); setError('Der Zugriff konnte nicht geprüft werden.'); return }
    setAccess(data as AccessInfo)
  }

  if (!loading && !context?.is_global_admin) return null

  return <section className="global-admin-panel">
    <div className="global-admin-head">
      <div className="global-admin-title">
        <span className="global-admin-icon">{context?.is_root ? <Crown size={20} /> : <ShieldCheck size={20} />}</span>
        <div><span className="eyebrow">SYSTEMVERWALTUNG</span><h3>{context?.is_root ? 'Root-Verwaltung' : 'Superadmin'}</h3><p>Accounts und Organisationen global verwalten. Kritische Änderungen werden protokolliert.</p></div>
      </div>
      <button onClick={() => void load()} disabled={loading}><RefreshCw size={14} /> Aktualisieren</button>
    </div>

    {context?.is_root ? <div className="global-admin-root-note"><Crown size={14} /> Nur Root kann Superadmins ernennen oder ihnen den Zugriff entziehen.</div> : null}
    {error ? <div className="global-admin-message is-error">{error}</div> : null}
    {notice ? <div className="global-admin-message is-success"><Check size={14} /> {notice}</div> : null}

    <div className="global-admin-search">
      <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void search() }} placeholder="Name, Benutzername oder Nexus-ID" /></label>
      <button onClick={() => void search()}>Bürger suchen</button>
    </div>

    <div className="global-admin-results">
      {results.map((profile) => {
        const protectedTarget = profile.is_root || (profile.is_superadmin && !context?.is_root)
        const busy = working === profile.profile_id
        return <article key={profile.profile_id} className="global-admin-person">
          <div className="global-admin-person-head">
            <span className="global-admin-avatar">{profile.display_name.slice(0,2).toUpperCase()}</span>
            <div><div className="global-admin-name"><strong>{profile.display_name}</strong>{profile.is_root ? <span><Crown size={11} /> Root</span> : profile.is_superadmin ? <span><ShieldCheck size={11} /> Superadmin</span> : null}</div><small>{profile.nexus_id ?? 'Keine Nexus-ID'} · @{profile.username ?? '—'} · {profile.account_status === 'active' ? 'Aktiv' : profile.account_status === 'suspended' ? 'Gesperrt' : profile.account_status}</small></div>
          </div>

          <div className="global-admin-actions">
            <button onClick={() => void inspectAccess(profile)}><Eye size={13} /> Zugriff prüfen</button>
            {!protectedTarget && profile.account_status === 'active' ? <button className="is-danger" disabled={busy} onClick={() => void setStatus(profile,'suspended')}><Ban size={13} /> Sperren</button> : null}
            {!protectedTarget && profile.account_status === 'suspended' ? <button disabled={busy} onClick={() => void setStatus(profile,'active')}><UserCheck size={13} /> Entsperren</button> : null}
            {!protectedTarget ? <button disabled={busy} onClick={() => void forcePassword(profile)}><KeyRound size={13} /> Passwortwechsel</button> : null}
            {context?.can_manage_superadmins && !profile.is_root ? <button disabled={busy} onClick={() => void setSuperadmin(profile,!profile.is_superadmin)}>{profile.is_superadmin ? <ShieldCheck size={13} /> : <ShieldPlus size={13} />}{profile.is_superadmin ? ' Superadmin entziehen' : ' Superadmin machen'}</button> : null}
          </div>

          {profile.memberships.length > 0 ? <div className="global-admin-memberships">{profile.memberships.map((membership) => <div key={membership.organization_id}><span><strong>{membership.organization_name}</strong><small>{membership.role_name}{membership.is_owner ? ' · Owner' : ''}</small></span>{!protectedTarget ? <button className="is-danger" disabled={working === `${profile.profile_id}:${membership.organization_id}`} onClick={() => void removeMembership(profile,membership)}><Trash2 size={12} /> Entfernen</button> : null}</div>)}</div> : <div className="global-admin-no-membership">Keine Organisationsmitgliedschaft.</div>}

          {accessFor === profile.profile_id ? <AccessPreview info={access} loading={!access} /> : null}
        </article>
      })}
    </div>

    <div className="global-admin-audit">
      <div className="global-admin-section-title"><div><span className="eyebrow">PROTOKOLL</span><h4>Letzte Admin-Aktionen</h4></div><small>{audit.length} Einträge</small></div>
      {audit.length === 0 ? <div className="global-admin-empty">Noch keine protokollierten globalen Änderungen.</div> : audit.map((entry) => <div className="global-admin-audit-row" key={entry.id}><span>{dateTime.format(new Date(entry.created_at))}</span><div><strong>{entry.actor_name}</strong><small>{formatAction(entry.action_key)}{entry.target_name ? ` · ${entry.target_name}` : ''}{entry.organization_name ? ` · ${entry.organization_name}` : ''}</small>{entry.reason ? <p>{entry.reason}</p> : null}</div></div>)}
    </div>
  </section>
}

function AccessPreview({ info, loading }: { info: AccessInfo | null; loading: boolean }) {
  if (loading || !info) return <div className="global-admin-access-preview">Zugriff wird geprüft …</div>
  const services = [
    ['Stadtverwaltung', info.services.city],
    ['Medical', info.services.medical],
    ['Police', info.services.police],
    ['Fire & Rescue', info.services.fire],
    ['Justice', info.services.justice],
  ] as const
  return <div className="global-admin-access-preview">
    <div className="global-admin-service-access">{services.map(([name, active]) => <span key={name} className={active ? 'is-active' : ''}>{active ? '✓' : '–'} {name}</span>)}</div>
    {info.memberships.map((membership) => <div className="global-admin-access-membership" key={membership.organization_id}><strong>{membership.organization_name} · {membership.role_name}</strong><small>{membership.is_owner ? 'Owner · alle passenden Rechte' : `${membership.permissions.length} Rechte`}</small></div>)}
  </div>
}

function formatAction(action: string) {
  const labels: Record<string,string> = {
    'account.status.changed': 'Accountstatus geändert',
    'account.password_change.forced': 'Passwortwechsel angefordert',
    'superadmin.granted': 'Superadmin ernannt',
    'superadmin.revoked': 'Superadmin entzogen',
    'organization.member.added': 'Mitglied aufgenommen',
    'organization.member.removed': 'Mitglied entfernt',
    'organization.member.role_changed': 'Rolle geändert',
    'organization.owner.assigned': 'Owner eingesetzt',
    'organization.profile.updated': 'Organisationsprofil geändert',
    'organization.status.updated': 'Öffnungsstatus geändert',
  }
  return labels[action] ?? action
}
