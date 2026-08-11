import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Building2,
  Check,
  ChevronDown,
  Crown,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type OrganizationContext = {
  organization_id: string
  name: string
  short_name: string | null
  description: string
  phone: string | null
  public_email: string | null
  location_label: string | null
  logo_url: string | null
  banner_url: string | null
  status: 'open' | 'limited' | 'closed'
  status_message: string | null
  is_public: boolean
  organization_type: string
  service_module: string | null
  row_version: number
  can_profile: boolean
  can_status: boolean
  can_media: boolean
  can_members: boolean
  can_roles: boolean
  can_assign_roles: boolean
  is_global_admin: boolean
  is_owner: boolean
}

type Member = {
  profile_id: string
  display_name: string
  username: string | null
  nexus_id: string | null
  account_status: string
  member_id: string
  role_id: string
  role_name: string
  hierarchy_rank: number
  is_owner: boolean
  is_active: boolean
  joined_at: string
  row_version: number
}

type AssignableRole = {
  id: string
  name: string
  description: string
  hierarchy_rank: number
  is_standard: boolean
}

type ManagedRole = AssignableRole & {
  is_owner: boolean
  is_active: boolean
  row_version: number
  permissions: string[]
}

type Permission = {
  key: string
  module: string
  name: string
  description: string
  is_sensitive: boolean
}

type SearchResult = {
  profile_id: string
  display_name: string
  username: string | null
  nexus_id: string | null
}

type TabKey = 'profile' | 'status' | 'media' | 'members' | 'roles'

const statusLabel = {
  open: 'Geöffnet',
  limited: 'Eingeschränkt',
  closed: 'Geschlossen',
} as const

const moduleLabels: Record<string, string> = {
  organization: 'Organisation',
  business: 'Unternehmen',
  events: 'Veranstaltungen',
  calendar: 'Kalender',
  documents: 'Dokumente',
  jobs: 'Personal',
  mail: 'Mail',
  map: 'Karte',
  tasks: 'Aufgaben',
  city: 'Stadtverwaltung',
  medical: 'Medical',
  police: 'Police',
  fire: 'Fire & Rescue',
  justice: 'Justice',
}

function accountTarget() {
  return document.querySelector('.profile-header-card')?.parentElement ?? null
}

export default function OrganizationManagementMount() {
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

  return target ? createPortal(<OrganizationManagementPanel />, target) : null
}

function OrganizationManagementPanel() {
  const [organizations, setOrganizations] = useState<OrganizationContext[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [tab, setTab] = useState<TabKey>('profile')
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [members, setMembers] = useState<Member[]>([])
  const [assignableRoles, setAssignableRoles] = useState<AssignableRole[]>([])
  const [managedRoles, setManagedRoles] = useState<ManagedRole[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [memberSearch, setMemberSearch] = useState('')
  const [memberResults, setMemberResults] = useState<SearchResult[]>([])
  const [working, setWorking] = useState(false)

  const selected = organizations.find((item) => item.organization_id === selectedId) ?? null

  const loadContexts = useCallback(async () => {
    setLoading(true)
    setError('')
    const [{ data, error: contextError }, { data: sessionData }] = await Promise.all([
      supabase.rpc('organization_management_get_context'),
      supabase.auth.getSession(),
    ])
    setCurrentUserId(sessionData.session?.user?.id ?? null)
    if (contextError) {
      setOrganizations([])
      setLoading(false)
      return
    }
    const rows = Array.isArray(data) ? data as OrganizationContext[] : []
    setOrganizations(rows)
    setSelectedId((current) => rows.some((item) => item.organization_id === current) ? current : rows[0]?.organization_id ?? '')
    setLoading(false)
  }, [])

  const loadOrganizationData = useCallback(async (org: OrganizationContext | null) => {
    if (!org) {
      setMembers([])
      setAssignableRoles([])
      setManagedRoles([])
      setPermissions([])
      return
    }

    const requests: PromiseLike<{ data: unknown; error: { message?: string } | null }>[] = []
    requests.push(org.can_members
      ? supabase.rpc('list_organization_members_for_admin', { target_org: org.organization_id })
      : Promise.resolve({ data: [], error: null }))
    requests.push(org.can_assign_roles
      ? supabase.rpc('list_assignable_organization_roles', { target_org: org.organization_id })
      : Promise.resolve({ data: [], error: null }))
    requests.push(org.can_roles
      ? supabase.rpc('organization_management_get_roles', { target_org: org.organization_id })
      : Promise.resolve({ data: [], error: null }))
    requests.push(org.can_roles
      ? supabase.rpc('organization_management_get_permissions', { target_org: org.organization_id })
      : Promise.resolve({ data: [], error: null }))

    const [memberResponse, assignableResponse, rolesResponse, permissionResponse] = await Promise.all(requests)
    setMembers(Array.isArray(memberResponse.data) ? memberResponse.data as Member[] : [])
    setAssignableRoles(Array.isArray(assignableResponse.data) ? assignableResponse.data as AssignableRole[] : [])
    setManagedRoles(Array.isArray(rolesResponse.data) ? rolesResponse.data as ManagedRole[] : [])
    setPermissions(Array.isArray(permissionResponse.data) ? permissionResponse.data as Permission[] : [])
  }, [])

  useEffect(() => { void loadContexts() }, [loadContexts])
  useEffect(() => { void loadOrganizationData(selected) }, [selected?.organization_id, selected?.row_version, loadOrganizationData])

  if (!loading && organizations.length === 0) return null

  const reload = async (message?: string) => {
    await loadContexts()
    if (message) setNotice(message)
    window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  const tabs: Array<{ key: TabKey; label: string; visible: boolean }> = [
    { key: 'profile', label: 'Profil', visible: Boolean(selected?.can_profile) },
    { key: 'status', label: 'Öffnungsstatus', visible: Boolean(selected?.can_status) },
    { key: 'media', label: 'Bilder', visible: Boolean(selected?.can_media) },
    { key: 'members', label: 'Mitarbeiter', visible: Boolean(selected?.can_members) },
    { key: 'roles', label: 'Rollen & Rechte', visible: Boolean(selected?.can_roles) },
  ]

  const visibleTabs = tabs.filter((item) => item.visible)
  if (selected && !visibleTabs.some((item) => item.key === tab)) setTab(visibleTabs[0]?.key ?? 'profile')

  return (
    <section className="org-control-panel">
      <div className="org-control-head">
        <div className="org-control-heading">
          <span className="org-control-icon"><Building2 size={20} /></span>
          <div>
            <span className="eyebrow">ORGANISATION</span>
            <h3>Organisation verwalten</h3>
            <p>Profil, Öffnungsstatus, Bilder, Mitarbeiter und Rechte an einem Ort.</p>
          </div>
        </div>
        <div className="org-control-head-actions">
          {organizations.length > 1 ? (
            <label className="org-control-select">
              <select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setNotice(''); setError('') }}>
                {organizations.map((organization) => <option key={organization.organization_id} value={organization.organization_id}>{organization.name}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
          ) : null}
          <button type="button" onClick={() => void reload()} disabled={loading}><RefreshCw size={14} /> Aktualisieren</button>
        </div>
      </div>

      {selected?.is_global_admin ? <div className="org-control-global"><ShieldCheck size={14} /> Globaler Verwaltungszugriff</div> : null}
      {error ? <div className="org-control-message is-error">{error}</div> : null}
      {notice ? <div className="org-control-message is-success"><Check size={14} /> {notice}</div> : null}

      {loading || !selected ? <div className="org-control-empty">Organisationen werden geladen …</div> : (
        <>
          <div className="org-control-tabs">
            {visibleTabs.map((item) => <button key={item.key} className={tab === item.key ? 'is-active' : ''} onClick={() => setTab(item.key)}>{item.label}</button>)}
          </div>

          {tab === 'profile' ? <ProfileTab organization={selected} setError={setError} setWorking={setWorking} working={working} reload={reload} /> : null}
          {tab === 'status' ? <StatusTab organization={selected} setError={setError} setWorking={setWorking} working={working} reload={reload} /> : null}
          {tab === 'media' ? <MediaTab organization={selected} setError={setError} setWorking={setWorking} working={working} reload={reload} /> : null}
          {tab === 'members' ? (
            <MembersTab
              organization={selected}
              members={members}
              roles={assignableRoles}
              currentUserId={currentUserId}
              memberSearch={memberSearch}
              setMemberSearch={setMemberSearch}
              memberResults={memberResults}
              setMemberResults={setMemberResults}
              setError={setError}
              setNotice={setNotice}
              refresh={() => loadOrganizationData(selected)}
            />
          ) : null}
          {tab === 'roles' ? <RolesTab organization={selected} roles={managedRoles} permissions={permissions} setError={setError} setNotice={setNotice} refresh={() => loadOrganizationData(selected)} /> : null}
        </>
      )}
    </section>
  )
}

function ProfileTab({ organization, setError, setWorking, working, reload }: {
  organization: OrganizationContext
  setError: (value: string) => void
  setWorking: (value: boolean) => void
  working: boolean
  reload: (message?: string) => Promise<void>
}) {
  const [name, setName] = useState(organization.name)
  const [shortName, setShortName] = useState(organization.short_name ?? '')
  const [description, setDescription] = useState(organization.description ?? '')
  const [phone, setPhone] = useState(organization.phone ?? '')
  const [email, setEmail] = useState(organization.public_email ?? '')
  const [location, setLocation] = useState(organization.location_label ?? '')
  const [isPublic, setIsPublic] = useState(organization.is_public)

  useEffect(() => {
    setName(organization.name); setShortName(organization.short_name ?? ''); setDescription(organization.description ?? '')
    setPhone(organization.phone ?? ''); setEmail(organization.public_email ?? ''); setLocation(organization.location_label ?? ''); setIsPublic(organization.is_public)
  }, [organization.organization_id, organization.row_version])

  const save = async () => {
    setWorking(true); setError('')
    const { error } = await supabase.rpc('organization_management_save_profile', {
      target_org: organization.organization_id,
      expected_row_version: organization.row_version,
      new_name: name,
      new_short_name: shortName,
      new_description: description,
      new_phone: phone,
      new_public_email: email,
      new_location_label: location,
      new_logo_url: organization.logo_url,
      new_banner_url: organization.banner_url,
      new_is_public: isPublic,
    })
    setWorking(false)
    if (error) { setError(error.message?.includes('conflict') ? 'Die Organisation wurde inzwischen geändert. Bitte aktualisieren.' : 'Das Profil konnte nicht gespeichert werden.'); return }
    await reload('Organisationsprofil gespeichert.')
  }

  return <div className="org-control-tab org-profile-tab">
    <div className="org-form-grid">
      <label><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
      <label><span>Kurzname</span><input value={shortName} onChange={(event) => setShortName(event.target.value)} placeholder="z. B. LST" /></label>
      <label><span><Phone size={13} /> Telefonnummer</span><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="555-0100" /></label>
      <label><span><Mail size={13} /> Öffentliche E-Mail</span><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="kontakt@nexus.ls" /></label>
      <label className="org-form-wide"><span><MapPin size={13} /> Standort</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="z. B. Mission Row" /></label>
      <label className="org-form-wide"><span>Beschreibung</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} /></label>
    </div>
    <label className="org-control-toggle"><input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} /><span>Im öffentlichen Stadtverzeichnis anzeigen</span></label>
    <div className="org-control-actions"><button className="primary-button" onClick={() => void save()} disabled={working || name.trim().length < 2}>{working ? 'Speichert …' : 'Profil speichern'}</button></div>
  </div>
}

function StatusTab({ organization, setError, setWorking, working, reload }: {
  organization: OrganizationContext
  setError: (value: string) => void
  setWorking: (value: boolean) => void
  working: boolean
  reload: (message?: string) => Promise<void>
}) {
  const [status, setStatus] = useState(organization.status)
  const [message, setMessage] = useState(organization.status_message ?? '')
  useEffect(() => { setStatus(organization.status); setMessage(organization.status_message ?? '') }, [organization.organization_id, organization.row_version])

  const save = async () => {
    setWorking(true); setError('')
    const { error } = await supabase.rpc('organization_management_save_status', {
      target_org: organization.organization_id,
      expected_row_version: organization.row_version,
      new_status: status,
      new_status_message: message,
    })
    setWorking(false)
    if (error) { setError(error.message?.includes('conflict') ? 'Der Status wurde inzwischen geändert. Bitte aktualisieren.' : 'Der Öffnungsstatus konnte nicht gespeichert werden.'); return }
    await reload('Öffnungsstatus gespeichert.')
  }

  return <div className="org-control-tab">
    <div className="org-status-options">
      {(['open','limited','closed'] as const).map((value) => <button key={value} className={`${status === value ? 'is-active' : ''} is-${value}`} onClick={() => setStatus(value)}><span />{statusLabel[value]}</button>)}
    </div>
    <label className="org-status-message"><span>Statusmeldung</span><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="z. B. Werkstatt geöffnet · 2 Mitarbeiter im Dienst" /></label>
    <div className="org-control-actions"><button className="primary-button" disabled={working} onClick={() => void save()}>{working ? 'Speichert …' : 'Status speichern'}</button></div>
  </div>
}

function MediaTab({ organization, setError, setWorking, working, reload }: {
  organization: OrganizationContext
  setError: (value: string) => void
  setWorking: (value: boolean) => void
  working: boolean
  reload: (message?: string) => Promise<void>
}) {
  const upload = async (kind: 'logo' | 'banner', file: File | undefined) => {
    if (!file) return
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { setError('Bitte JPG, PNG oder WEBP verwenden.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Das Bild darf maximal 5 MB groß sein.'); return }
    setWorking(true); setError('')
    const extension = file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/png' ? 'png' : 'jpg')
    const path = `${organization.organization_id}/${kind}-${Date.now()}.${extension}`
    const { error: uploadError } = await supabase.storage.from('organization-media').upload(path, file, { contentType: file.type, upsert: false })
    if (uploadError) { setWorking(false); setError('Das Bild konnte nicht hochgeladen werden.'); return }
    const { data: publicData } = supabase.storage.from('organization-media').getPublicUrl(path)
    const nextLogo = kind === 'logo' ? publicData.publicUrl : organization.logo_url
    const nextBanner = kind === 'banner' ? publicData.publicUrl : organization.banner_url
    const { error: saveError } = await supabase.rpc('organization_management_save_profile', {
      target_org: organization.organization_id,
      expected_row_version: organization.row_version,
      new_name: organization.name,
      new_short_name: organization.short_name,
      new_description: organization.description,
      new_phone: organization.phone,
      new_public_email: organization.public_email,
      new_location_label: organization.location_label,
      new_logo_url: nextLogo,
      new_banner_url: nextBanner,
      new_is_public: organization.is_public,
    })
    setWorking(false)
    if (saveError) { setError('Das Bild wurde hochgeladen, konnte aber nicht mit der Organisation verknüpft werden. Bitte aktualisieren und erneut versuchen.'); return }
    await reload(kind === 'logo' ? 'Logo aktualisiert.' : 'Titelbild aktualisiert.')
  }

  return <div className="org-control-tab org-media-grid">
    <MediaCard title="Logo" description="Quadratisches Bild für Karten und das Unternehmensprofil." image={organization.logo_url} working={working} onFile={(file) => void upload('logo', file)} />
    <MediaCard title="Titelbild" description="Breites Bild für die Detailseite der Organisation." image={organization.banner_url} banner working={working} onFile={(file) => void upload('banner', file)} />
  </div>
}

function MediaCard({ title, description, image, banner, working, onFile }: { title: string; description: string; image: string | null; banner?: boolean; working: boolean; onFile: (file?: File) => void }) {
  return <article className="org-media-card">
    <div className={`org-media-preview ${banner ? 'is-banner' : ''}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>{!image ? <ImagePlus size={28} /> : null}</div>
    <div><strong>{title}</strong><span>{description}</span></div>
    <label className="org-upload-button"><Upload size={14} /> {working ? 'Bitte warten …' : 'Bild auswählen'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={working} onChange={(event) => { onFile(event.target.files?.[0]); event.currentTarget.value = '' }} /></label>
  </article>
}

function MembersTab({ organization, members, roles, currentUserId, memberSearch, setMemberSearch, memberResults, setMemberResults, setError, setNotice, refresh }: {
  organization: OrganizationContext
  members: Member[]
  roles: AssignableRole[]
  currentUserId: string | null
  memberSearch: string
  setMemberSearch: (value: string) => void
  memberResults: SearchResult[]
  setMemberResults: (value: SearchResult[]) => void
  setError: (value: string) => void
  setNotice: (value: string) => void
  refresh: () => Promise<void>
}) {
  const [workingId, setWorkingId] = useState<string | null>(null)

  const search = async () => {
    if (memberSearch.trim().length < 2) { setError('Bitte mindestens zwei Zeichen eingeben.'); return }
    const { data, error } = await supabase.rpc('search_active_profiles_for_organization', { target_org: organization.organization_id, search_text: memberSearch.trim() })
    if (error) { setError('Die Bürgersuche konnte nicht ausgeführt werden.'); return }
    setMemberResults(Array.isArray(data) ? data as SearchResult[] : [])
  }

  const add = async (profile: SearchResult) => {
    setWorkingId(profile.profile_id); setError(''); setNotice('')
    const { error } = await supabase.rpc('add_organization_member', { target_org: organization.organization_id, target_profile: profile.profile_id })
    setWorkingId(null)
    if (error) { setError(error.message ?? 'Der Bürger konnte nicht aufgenommen werden.'); return }
    setNotice(`${profile.display_name} wurde aufgenommen.`); setMemberResults(memberResults.filter((item) => item.profile_id !== profile.profile_id)); await refresh()
  }

  const changeRole = async (member: Member, roleId: string) => {
    if (roleId === member.role_id) return
    setWorkingId(member.profile_id); setError(''); setNotice('')
    const { error } = await supabase.rpc('assign_organization_member_role', {
      target_org: organization.organization_id,
      target_profile: member.profile_id,
      target_role: roleId,
      expected_member_row_version: member.row_version,
      change_reason: null,
    })
    setWorkingId(null)
    if (error) { setError(error.message ?? 'Die Rolle konnte nicht geändert werden.'); return }
    setNotice(`Rolle von ${member.display_name} geändert.`); await refresh(); window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  const remove = async (member: Member) => {
    const reason = window.prompt(member.is_owner ? 'Grund für das Entfernen des Owners:' : 'Grund für das Entfernen (optional):', '')
    if (reason === null) return
    setWorkingId(member.profile_id); setError(''); setNotice('')
    const { error } = await supabase.rpc('remove_organization_member', {
      target_org: organization.organization_id,
      target_profile: member.profile_id,
      expected_member_row_version: member.row_version,
      removal_reason: reason,
    })
    setWorkingId(null)
    if (error) { setError(error.message ?? 'Das Mitglied konnte nicht entfernt werden.'); return }
    setNotice(`${member.display_name} wurde aus der Organisation entfernt.`); await refresh(); window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  const makeOwner = async (member: Member) => {
    const reason = window.prompt(`Grund für die Owner-Zuweisung an ${member.display_name}:`, '')
    if (!reason?.trim()) return
    setWorkingId(member.profile_id); setError(''); setNotice('')
    const { error } = await supabase.rpc('global_admin_assign_owner', { target_org: organization.organization_id, target_profile: member.profile_id, action_reason: reason.trim() })
    setWorkingId(null)
    if (error) { setError(error.message ?? 'Der Owner konnte nicht gesetzt werden.'); return }
    setNotice(`${member.display_name} ist jetzt Owner.`); await refresh(); window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  return <div className="org-control-tab">
    <div className="org-member-search">
      <div><strong>Mitarbeiter aufnehmen</strong><span>Neue Mitarbeiter erhalten zunächst die Standardrolle.</span></div>
      <div className="org-search-row"><label><Search size={15} /><input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void search() }} placeholder="Name, Benutzername oder Nexus-ID" /></label><button onClick={() => void search()}>Suchen</button></div>
      {memberResults.length > 0 ? <div className="org-search-results">{memberResults.map((profile) => <div key={profile.profile_id}><span className="org-avatar">{profile.display_name.slice(0,2).toUpperCase()}</span><div><strong>{profile.display_name}</strong><small>{profile.nexus_id ?? 'Keine Nexus-ID'} · @{profile.username ?? '—'}</small></div><button disabled={workingId === profile.profile_id} onClick={() => void add(profile)}><UserPlus size={14} /> Aufnehmen</button></div>)}</div> : null}
    </div>

    <div className="org-member-list">
      {members.length === 0 ? <div className="org-control-empty">Noch keine Mitarbeiter vorhanden.</div> : members.map((member) => {
        const own = member.profile_id === currentUserId
        const workingMember = workingId === member.profile_id
        return <article key={member.profile_id} className="org-member-row">
          <span className="org-avatar">{member.display_name.slice(0,2).toUpperCase()}</span>
          <div className="org-member-main"><div><strong>{member.display_name}</strong>{member.is_owner ? <span className="org-owner-pill"><Crown size={11} /> Owner</span> : null}</div><small>{member.nexus_id ?? 'Keine Nexus-ID'} · @{member.username ?? '—'}</small></div>
          <div className="org-member-role">
            {member.is_owner || !organization.can_assign_roles ? <strong>{member.role_name}</strong> : <select value={member.role_id} disabled={workingMember} onChange={(event) => void changeRole(member,event.target.value)}>{!roles.some((role) => role.id === member.role_id) ? <option value={member.role_id}>{member.role_name}</option> : null}{roles.map((role) => <option key={role.id} value={role.id}>{role.name}{role.is_standard ? ' · Standard' : ''}</option>)}</select>}
          </div>
          <div className="org-member-actions">
            {organization.is_global_admin && !member.is_owner && !own ? <button onClick={() => void makeOwner(member)} disabled={workingMember}><Crown size={13} /> Owner setzen</button> : null}
            {!own && (!member.is_owner || organization.is_global_admin) ? <button className="is-danger" onClick={() => void remove(member)} disabled={workingMember}><Trash2 size={13} /> Entfernen</button> : null}
          </div>
        </article>
      })}
    </div>
  </div>
}

function RolesTab({ organization, roles, permissions, setError, setNotice, refresh }: {
  organization: OrganizationContext
  roles: ManagedRole[]
  permissions: Permission[]
  setError: (value: string) => void
  setNotice: (value: string) => void
  refresh: () => Promise<void>
}) {
  const editableRoles = roles.filter((role) => !role.is_owner)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(editableRoles[0]?.id ?? '')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [standard, setStandard] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? null

  useEffect(() => {
    if (!creating && !roles.some((role) => role.id === selectedRoleId && !role.is_owner)) setSelectedRoleId(editableRoles[0]?.id ?? '')
  }, [roles, creating, selectedRoleId])

  useEffect(() => {
    if (creating) {
      setName(''); setDescription(''); setStandard(false); setSelectedPermissions(new Set())
    } else if (selectedRole) {
      setName(selectedRole.name); setDescription(selectedRole.description ?? ''); setStandard(selectedRole.is_standard); setSelectedPermissions(new Set(selectedRole.permissions ?? []))
    }
  }, [creating, selectedRoleId, selectedRole?.row_version])

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, Permission[]>()
    for (const permission of permissions) groups.set(permission.module, [...(groups.get(permission.module) ?? []), permission])
    return [...groups.entries()]
  }, [permissions])

  const togglePermission = (key: string) => setSelectedPermissions((current) => {
    const next = new Set(current)
    if (next.has(key)) next.delete(key); else next.add(key)
    return next
  })

  const save = async () => {
    if (name.trim().length < 2) { setError('Der Rollenname ist zu kurz.'); return }
    setSaving(true); setError(''); setNotice('')
    const { data: roleId, error: roleError } = await supabase.rpc('organization_management_save_role', {
      target_org: organization.organization_id,
      target_role: creating ? null : selectedRoleId,
      new_name: name.trim(),
      new_description: description,
      make_standard: standard,
    })
    if (roleError || !roleId) { setSaving(false); setError(roleError?.message ?? 'Die Rolle konnte nicht gespeichert werden.'); return }
    const { error: permissionError } = await supabase.rpc('organization_management_set_role_permissions', {
      target_org: organization.organization_id,
      target_role: roleId,
      permission_keys: [...selectedPermissions],
    })
    setSaving(false)
    if (permissionError) { setError(permissionError.message ?? 'Die Rechte konnten nicht gespeichert werden.'); return }
    setCreating(false); setSelectedRoleId(String(roleId)); setNotice(`Rolle „${name.trim()}“ gespeichert.`); await refresh(); window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  const ownerRole = roles.find((role) => role.is_owner)

  return <div className="org-control-tab org-role-layout">
    <aside className="org-role-list">
      {ownerRole ? <div className="org-role-fixed"><Crown size={14} /><span><strong>{ownerRole.name}</strong><small>Alle Rechte · geschützt</small></span></div> : null}
      {editableRoles.map((role) => <button key={role.id} className={!creating && selectedRoleId === role.id ? 'is-active' : ''} onClick={() => { setCreating(false); setSelectedRoleId(role.id) }}><span><strong>{role.name}</strong><small>{role.permissions.length} Rechte{role.is_standard ? ' · Standard' : ''}</small></span></button>)}
      <button className={`org-role-new ${creating ? 'is-active' : ''}`} onClick={() => setCreating(true)}><Plus size={14} /> Neue Rolle</button>
    </aside>

    <div className="org-role-editor">
      {(creating || selectedRole) ? <>
        <div className="org-form-grid">
          <label><span>Rollenname</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="z. B. Mitarbeiter" /></label>
          <label className="org-form-wide"><span>Beschreibung</span><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Kurze interne Beschreibung" /></label>
        </div>
        <label className="org-control-toggle"><input type="checkbox" checked={standard} onChange={(event) => setStandard(event.target.checked)} /><span>Standardrolle für neue Mitarbeiter</span></label>
        <div className="org-permission-groups">
          {groupedPermissions.map(([module, entries]) => <section key={module}><div className="org-permission-title"><strong>{moduleLabels[module] ?? module}</strong><span>{entries.filter((entry) => selectedPermissions.has(entry.key)).length}/{entries.length}</span></div>{entries.map((permission) => <label key={permission.key} className={permission.is_sensitive ? 'is-sensitive' : ''}><input type="checkbox" checked={selectedPermissions.has(permission.key)} onChange={() => togglePermission(permission.key)} /><span><strong>{permission.name}</strong><small>{permission.description}</small></span></label>)}</section>)}
        </div>
        <div className="org-control-actions"><button className="primary-button" onClick={() => void save()} disabled={saving}>{saving ? 'Speichert …' : 'Rolle & Rechte speichern'}</button></div>
      </> : <div className="org-control-empty">Wähle eine Rolle aus oder lege eine neue an.</div>}
    </div>
  </div>
}
