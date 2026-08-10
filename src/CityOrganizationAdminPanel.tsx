import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Check,
  ChevronDown,
  Crown,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type MemberAdminContext = {
  organization_id: string
  organization_name: string
  organization_short_name: string | null
  service_module: string | null
  role_id: string
  role_name: string
  hierarchy_rank: number
  is_owner: boolean
  can_view: boolean
  can_add: boolean
  can_assign: boolean
  can_remove: boolean
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

type Role = {
  id: string
  name: string
  description: string
  hierarchy_rank: number
  is_standard: boolean
}

type ProfileSearchResult = {
  profile_id: string
  display_name: string
  username: string | null
  nexus_id: string | null
}

type OwnerlessOrganization = {
  organization_id: string
  organization_name: string
  organization_short_name: string | null
  service_module: string | null
  member_count: number
}

const joinedFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export default function CityOrganizationAdminPanel() {
  const [context, setContext] = useState<MemberAdminContext | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [ownerless, setOwnerless] = useState<OwnerlessOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [memberSearch, setMemberSearch] = useState('')
  const [memberResults, setMemberResults] = useState<ProfileSearchResult[]>([])
  const [searchingMembers, setSearchingMembers] = useState(false)
  const [workingProfile, setWorkingProfile] = useState<string | null>(null)
  const [roleDrafts, setRoleDrafts] = useState<Record<string, string>>({})
  const [removingProfile, setRemovingProfile] = useState<string | null>(null)
  const [removalReason, setRemovalReason] = useState('')

  const [ownerOrg, setOwnerOrg] = useState<string | null>(null)
  const [ownerSearch, setOwnerSearch] = useState('')
  const [ownerResults, setOwnerResults] = useState<ProfileSearchResult[]>([])
  const [selectedOwner, setSelectedOwner] = useState<ProfileSearchResult | null>(null)
  const [searchingOwner, setSearchingOwner] = useState(false)
  const [assigningOwner, setAssigningOwner] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: contextData, error: contextError } = await supabase.rpc('get_my_member_admin_context')
    if (contextError) {
      setContext(null)
      setMembers([])
      setRoles([])
      setOwnerless([])
      setLoading(false)
      return
    }

    const contexts = Array.isArray(contextData) ? (contextData as MemberAdminContext[]) : []
    const city = contexts.find((entry) => entry.service_module === 'city') ?? null
    setContext(city)

    if (!city) {
      setMembers([])
      setRoles([])
      setOwnerless([])
      setLoading(false)
      return
    }

    const [memberResponse, roleResponse, ownerlessResponse] = await Promise.all([
      supabase.rpc('list_organization_members_for_admin', { target_org: city.organization_id }),
      city.can_assign
        ? supabase.rpc('list_assignable_organization_roles', { target_org: city.organization_id })
        : Promise.resolve({ data: [], error: null }),
      supabase.rpc('list_ownerless_organizations'),
    ])

    if (memberResponse.error) setError('Die Mitarbeiterliste konnte nicht geladen werden.')
    setMembers(Array.isArray(memberResponse.data) ? (memberResponse.data as Member[]) : [])
    setRoles(Array.isArray(roleResponse.data) ? (roleResponse.data as Role[]) : [])

    // This RPC intentionally fails for City Hall roles without the emergency-owner permission.
    setOwnerless(
      !ownerlessResponse.error && Array.isArray(ownerlessResponse.data)
        ? (ownerlessResponse.data as OwnerlessOrganization[])
        : [],
    )

    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const memberById = useMemo(
    () => new Map(members.map((member) => [member.profile_id, member])),
    [members],
  )

  const searchMembers = async () => {
    if (!context || memberSearch.trim().length < 2) {
      setMemberResults([])
      setError('Bitte gib mindestens zwei Zeichen für die Suche ein.')
      return
    }

    setSearchingMembers(true)
    setError('')
    const { data, error: searchError } = await supabase.rpc('search_active_profiles_for_organization', {
      target_org: context.organization_id,
      search_text: memberSearch.trim(),
    })
    setSearchingMembers(false)

    if (searchError) {
      setError('Die Bürgersuche konnte nicht ausgeführt werden.')
      setMemberResults([])
      return
    }

    setMemberResults(Array.isArray(data) ? (data as ProfileSearchResult[]) : [])
  }

  const addMember = async (profile: ProfileSearchResult) => {
    if (!context) return
    setWorkingProfile(profile.profile_id)
    setError('')
    setNotice('')

    const { error: addError } = await supabase.rpc('add_organization_member', {
      target_org: context.organization_id,
      target_profile: profile.profile_id,
    })

    setWorkingProfile(null)
    if (addError) {
      setError('Der Bürger konnte nicht als Mitarbeiter aufgenommen werden.')
      return
    }

    setNotice(`${profile.display_name} wurde aufgenommen und hat die Standardrolle erhalten.`)
    setMemberResults((current) => current.filter((entry) => entry.profile_id !== profile.profile_id))
    await load()
  }

  const saveRole = async (member: Member) => {
    if (!context) return
    const targetRole = roleDrafts[member.profile_id]
    if (!targetRole || targetRole === member.role_id) return

    setWorkingProfile(member.profile_id)
    setError('')
    setNotice('')

    const { error: roleError } = await supabase.rpc('assign_organization_member_role', {
      target_org: context.organization_id,
      target_profile: member.profile_id,
      target_role: targetRole,
      expected_member_row_version: member.row_version,
      change_reason: null,
    })

    setWorkingProfile(null)
    if (roleError) {
      setError(
        roleError.message?.includes('conflict')
          ? 'Die Mitgliedschaft wurde inzwischen geändert. Die Liste wurde neu geladen.'
          : 'Die Rolle konnte nicht geändert werden.',
      )
      await load()
      return
    }

    const roleName = roles.find((role) => role.id === targetRole)?.name ?? 'neue Rolle'
    setNotice(`${member.display_name} hat jetzt die Rolle „${roleName}“.`)
    setRoleDrafts((current) => {
      const next = { ...current }
      delete next[member.profile_id]
      return next
    })
    await load()
  }

  const removeMember = async (member: Member) => {
    if (!context) return
    setWorkingProfile(member.profile_id)
    setError('')
    setNotice('')

    const { error: removeError } = await supabase.rpc('remove_organization_member', {
      target_org: context.organization_id,
      target_profile: member.profile_id,
      expected_member_row_version: member.row_version,
      removal_reason: removalReason.trim() || null,
    })

    setWorkingProfile(null)
    if (removeError) {
      setError(
        removeError.message?.includes('conflict')
          ? 'Die Mitgliedschaft wurde inzwischen geändert. Die Liste wurde neu geladen.'
          : 'Das Mitglied konnte nicht entfernt werden.',
      )
      await load()
      return
    }

    setNotice(`${member.display_name} wurde aus der Organisation entfernt.`)
    setRemovingProfile(null)
    setRemovalReason('')
    await load()
  }

  const searchEmergencyOwner = async () => {
    if (!ownerOrg || ownerSearch.trim().length < 2) {
      setOwnerResults([])
      setError('Bitte gib mindestens zwei Zeichen für die Suche ein.')
      return
    }

    setSearchingOwner(true)
    setError('')
    setSelectedOwner(null)
    const { data, error: searchError } = await supabase.rpc('search_active_profiles_for_emergency_owner', {
      target_org: ownerOrg,
      search_text: ownerSearch.trim(),
    })
    setSearchingOwner(false)

    if (searchError) {
      setError('Die Suche für die Owner-Zuweisung konnte nicht ausgeführt werden.')
      setOwnerResults([])
      return
    }

    setOwnerResults(Array.isArray(data) ? (data as ProfileSearchResult[]) : [])
  }

  const assignEmergencyOwner = async () => {
    if (!ownerOrg || !selectedOwner) return
    setAssigningOwner(true)
    setError('')
    setNotice('')

    const organization = ownerless.find((entry) => entry.organization_id === ownerOrg)
    const { error: assignError } = await supabase.rpc('assign_emergency_organization_owner', {
      target_org: ownerOrg,
      target_profile: selectedOwner.profile_id,
    })

    setAssigningOwner(false)
    if (assignError) {
      setError('Der Notfall-Owner konnte nicht eingesetzt werden. Prüfe, ob inzwischen bereits ein Owner existiert.')
      await load()
      return
    }

    setNotice(`${selectedOwner.display_name} wurde als Owner von ${organization?.organization_name ?? 'der Organisation'} eingesetzt.`)
    setOwnerOrg(null)
    setOwnerSearch('')
    setOwnerResults([])
    setSelectedOwner(null)
    window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
    await load()
  }

  if (!context && !loading) return null

  return (
    <div className="city-org-admin-stack">
      <section className="city-org-admin-panel">
        <div className="city-org-admin-head">
          <div className="city-org-admin-title">
            <span className="city-org-admin-icon"><Users size={19} /></span>
            <div>
              <span className="eyebrow">ORGANISATION</span>
              <h3>Mitarbeiter & Rollen</h3>
              <p>{context?.organization_name ?? 'Stadtverwaltung'} · Änderungen werden serverseitig geprüft.</p>
            </div>
          </div>
          <button className="city-org-refresh" onClick={() => void load()} disabled={loading}>
            <RefreshCw size={14} /> Aktualisieren
          </button>
        </div>

        {error ? <div className="city-org-message is-error">{error}</div> : null}
        {notice ? <div className="city-org-message is-success"><Check size={14} />{notice}</div> : null}

        {context?.can_add ? (
          <div className="city-org-add-box">
            <div>
              <strong>Mitarbeiter aufnehmen</strong>
              <span>Suche nach Name, Benutzername oder Nexus-ID. Neue Mitglieder erhalten automatisch die Standardrolle.</span>
            </div>
            <div className="city-org-search-row">
              <label>
                <Search size={15} />
                <input
                  value={memberSearch}
                  onChange={(event) => setMemberSearch(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') void searchMembers() }}
                  placeholder="z. B. NX-000002 oder Name"
                />
              </label>
              <button onClick={() => void searchMembers()} disabled={searchingMembers}>
                {searchingMembers ? 'Suche …' : 'Suchen'}
              </button>
            </div>

            {memberResults.length > 0 ? (
              <div className="city-org-search-results">
                {memberResults.map((profile) => (
                  <div key={profile.profile_id}>
                    <span className="city-org-avatar">{profile.display_name.slice(0, 2).toUpperCase()}</span>
                    <div><strong>{profile.display_name}</strong><span>{profile.nexus_id ?? 'Keine Nexus-ID'} · @{profile.username ?? '—'}</span></div>
                    <button disabled={workingProfile === profile.profile_id} onClick={() => void addMember(profile)}>
                      <UserPlus size={14} /> Aufnehmen
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="city-org-member-list">
          {loading ? (
            <div className="city-org-empty">Mitarbeiter werden geladen …</div>
          ) : members.length === 0 ? (
            <div className="city-org-empty">Noch keine Mitarbeiter vorhanden.</div>
          ) : members.map((member) => {
            const draftRole = roleDrafts[member.profile_id] ?? member.role_id
            const roleChanged = draftRole !== member.role_id
            const canEditThisRole = Boolean(context?.can_assign && !member.is_owner && member.profile_id !== context?.organization_id)
            const isRemoving = removingProfile === member.profile_id
            const working = workingProfile === member.profile_id

            return (
              <article className={`city-org-member ${member.is_active ? '' : 'is-inactive'}`} key={member.profile_id}>
                <span className="city-org-avatar">{member.display_name.slice(0, 2).toUpperCase()}</span>
                <div className="city-org-member-main">
                  <div className="city-org-member-name">
                    <strong>{member.display_name}</strong>
                    {member.is_owner ? <span className="city-org-owner-pill"><Crown size={12} /> Owner</span> : null}
                    {!member.is_active ? <span className="city-org-inactive-pill">Inaktiv</span> : null}
                  </div>
                  <span>{member.nexus_id ?? 'Keine Nexus-ID'} · @{member.username ?? '—'} · seit {joinedFormatter.format(new Date(member.joined_at))}</span>
                </div>

                <div className="city-org-role-cell">
                  {member.is_owner || !context?.can_assign ? (
                    <strong>{member.role_name}</strong>
                  ) : (
                    <label>
                      <select
                        value={draftRole}
                        onChange={(event) => setRoleDrafts((current) => ({ ...current, [member.profile_id]: event.target.value }))}
                        disabled={working}
                      >
                        {!roles.some((role) => role.id === member.role_id) ? <option value={member.role_id}>{member.role_name}</option> : null}
                        {roles.map((role) => <option value={role.id} key={role.id}>{role.name}{role.is_standard ? ' · Standard' : ''}</option>)}
                      </select>
                      <ChevronDown size={14} />
                    </label>
                  )}
                  {roleChanged && canEditThisRole ? (
                    <button className="city-org-save-role" disabled={working} onClick={() => void saveRole(member)}>Rolle speichern</button>
                  ) : null}
                </div>

                {context?.can_remove && !member.is_owner ? (
                  <button
                    className="city-org-remove"
                    onClick={() => {
                      setRemovingProfile((current) => current === member.profile_id ? null : member.profile_id)
                      setRemovalReason('')
                    }}
                    disabled={working}
                    title="Mitglied entfernen"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : <span className="city-org-remove-placeholder" />}

                {isRemoving ? (
                  <div className="city-org-remove-box">
                    <div><strong>{member.display_name} wirklich entfernen?</strong><span>Ein Grund ist optional und wird der betroffenen Person angezeigt.</span></div>
                    <input value={removalReason} onChange={(event) => setRemovalReason(event.target.value)} maxLength={500} placeholder="Optionaler Grund …" autoFocus />
                    <div><button onClick={() => { setRemovingProfile(null); setRemovalReason('') }}>Abbrechen</button><button className="danger" disabled={working} onClick={() => void removeMember(member)}>Entfernen bestätigen</button></div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>

      {ownerless.length > 0 ? (
        <section className="city-org-admin-panel city-ownerless-panel">
          <div className="city-org-admin-head">
            <div className="city-org-admin-title">
              <span className="city-org-admin-icon warning"><ShieldAlert size={19} /></span>
              <div>
                <span className="eyebrow">ORGANISATIONSAUFSICHT</span>
                <h3>Organisationen ohne Owner</h3>
                <p>Die Stadthalle darf nur dann einen Notfall-Owner einsetzen, wenn aktuell überhaupt kein Owner vorhanden ist.</p>
              </div>
            </div>
          </div>

          <div className="city-ownerless-list">
            {ownerless.map((organization) => {
              const open = ownerOrg === organization.organization_id
              return (
                <article key={organization.organization_id}>
                  <div className="city-ownerless-row">
                    <span className="city-ownerless-mark"><Building2 size={18} /></span>
                    <div><strong>{organization.organization_name}</strong><span>{organization.organization_short_name ?? 'Keine Kurzbezeichnung'} · {organization.member_count} aktuelle Mitglieder</span></div>
                    <button onClick={() => {
                      setOwnerOrg(open ? null : organization.organization_id)
                      setOwnerSearch('')
                      setOwnerResults([])
                      setSelectedOwner(null)
                      setError('')
                    }}>{open ? 'Schließen' : 'Owner einsetzen'}</button>
                  </div>

                  {open ? (
                    <div className="city-ownerless-editor">
                      <div className="city-owner-warning"><Crown size={17} /><span><strong>Vollständige Owner-Rechte</strong>Diese Zuweisung wirkt sofort und gibt Zugriff auf das Fachmodul dieser Organisation. Sie ist nur für den Owner-Notfall gedacht.</span></div>
                      <div className="city-org-search-row">
                        <label><Search size={15} /><input value={ownerSearch} onChange={(event) => setOwnerSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void searchEmergencyOwner() }} placeholder="Bürger nach Name oder Nexus-ID suchen" /></label>
                        <button onClick={() => void searchEmergencyOwner()} disabled={searchingOwner}>{searchingOwner ? 'Suche …' : 'Suchen'}</button>
                      </div>

                      {ownerResults.length > 0 ? (
                        <div className="city-owner-candidates">
                          {ownerResults.map((profile) => (
                            <button className={selectedOwner?.profile_id === profile.profile_id ? 'selected' : ''} onClick={() => setSelectedOwner(profile)} key={profile.profile_id}>
                              <span className="city-org-avatar">{profile.display_name.slice(0, 2).toUpperCase()}</span>
                              <span><strong>{profile.display_name}</strong><small>{profile.nexus_id ?? 'Keine Nexus-ID'} · @{profile.username ?? '—'}</small></span>
                              {selectedOwner?.profile_id === profile.profile_id ? <Check size={15} /> : null}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {selectedOwner ? (
                        <div className="city-owner-confirm">
                          <span><strong>{selectedOwner.display_name}</strong> als Owner von <b>{organization.organization_name}</b> einsetzen?</span>
                          <button disabled={assigningOwner} onClick={() => void assignEmergencyOwner()}><Crown size={14} /> {assigningOwner ? 'Wird eingesetzt …' : 'Owner-Zuweisung bestätigen'}</button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}
