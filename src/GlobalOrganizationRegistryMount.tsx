import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Archive, Building2, Check, ChevronDown, Plus, RefreshCw, RotateCcw, Search } from 'lucide-react'
import { supabase } from './lib/supabase'

type GlobalContext = {
  is_global_admin: boolean
}

type RegistryOrganization = {
  organization_id: string
  name: string
  short_name: string | null
  organization_type: string
  service_module: string | null
  status: string
  is_public: boolean
  is_archived: boolean
  archived_at: string | null
  member_count: number
  owner_name: string | null
}

function accountTarget() {
  return document.querySelector('.profile-header-card')?.parentElement ?? null
}

export default function GlobalOrganizationRegistryMount() {
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

  return target ? createPortal(<GlobalOrganizationRegistry />, target) : null
}

function GlobalOrganizationRegistry() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [organizations, setOrganizations] = useState<RegistryOrganization[]>([])
  const [query, setQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [creating, setCreating] = useState(false)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    const { data: contextData, error: contextError } = await supabase.rpc('get_my_global_admin_context')
    const context = contextData as GlobalContext | null
    if (contextError || !context?.is_global_admin) {
      setAllowed(false)
      setOrganizations([])
      return
    }
    setAllowed(true)
    const { data, error: listError } = await supabase.rpc('global_admin_list_organizations')
    if (listError) {
      setError('Das Organisationsregister konnte nicht geladen werden.')
      setOrganizations([])
      return
    }
    setOrganizations(Array.isArray(data) ? data as RegistryOrganization[] : [])
  }, [])

  useEffect(() => { void load() }, [load])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return organizations.filter((organization) => {
      if (!showArchived && organization.is_archived) return false
      if (!term) return true
      return [organization.name, organization.short_name ?? '', organization.owner_name ?? '', organization.service_module ?? ''].join(' ').toLowerCase().includes(term)
    })
  }, [organizations, query, showArchived])

  if (allowed === false) return null
  if (allowed === null) return null

  const archive = async (organization: RegistryOrganization, archived: boolean) => {
    const reason = window.prompt(archived ? `Grund für das Archivieren von ${organization.name}:` : `Grund für die Wiederherstellung von ${organization.name}:`, '')?.trim()
    if (!reason) return
    setWorking(true); setError(''); setNotice('')
    const { error: actionError } = await supabase.rpc('global_admin_set_organization_archived', {
      target_org: organization.organization_id,
      archived,
      action_reason: reason,
    })
    setWorking(false)
    if (actionError) { setError(actionError.message ?? 'Die Organisation konnte nicht geändert werden.'); return }
    setNotice(archived ? `${organization.name} wurde archiviert.` : `${organization.name} wurde wiederhergestellt.`)
    await load()
    window.dispatchEvent(new CustomEvent('nexus:permissions-changed'))
  }

  return <section className="global-org-registry">
    <div className="global-org-registry-head">
      <div className="global-org-registry-title"><span><Building2 size={20} /></span><div><span className="eyebrow">SYSTEMVERWALTUNG</span><h3>Organisationsregister</h3><p>Unternehmen und öffentliche Einrichtungen anlegen, archivieren und wiederherstellen.</p></div></div>
      <div className="global-org-registry-head-actions"><button onClick={() => setCreating((value) => !value)}><Plus size={14} /> Neue Organisation</button><button onClick={() => void load()}><RefreshCw size={14} /> Aktualisieren</button></div>
    </div>

    {error ? <div className="global-org-registry-message is-error">{error}</div> : null}
    {notice ? <div className="global-org-registry-message is-success"><Check size={14} /> {notice}</div> : null}
    {creating ? <CreateOrganization onCancel={() => setCreating(false)} onCreated={async (name) => { setCreating(false); setNotice(`${name} wurde angelegt.`); await load() }} setError={setError} /> : null}

    <div className="global-org-registry-toolbar">
      <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Organisation oder Owner suchen …" /></label>
      <label className="global-org-registry-toggle"><input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} /> Archivierte anzeigen</label>
    </div>

    <div className="global-org-registry-list">
      {filtered.length === 0 ? <div className="global-org-registry-empty">Keine passenden Organisationen gefunden.</div> : filtered.map((organization) => <article key={organization.organization_id} className={organization.is_archived ? 'is-archived' : ''}>
        <div className="global-org-registry-main"><strong>{organization.name}</strong><small>{organization.short_name || 'Kein Kurzname'} · {organization.organization_type === 'business' ? 'Unternehmen' : 'Öffentliche Einrichtung'}{organization.service_module ? ` · ${organization.service_module}` : ''}</small></div>
        <div className="global-org-registry-meta"><span>Owner: <strong>{organization.owner_name ?? 'Nicht vergeben'}</strong></span><span>{organization.member_count} Mitglied{organization.member_count === 1 ? '' : 'er'}</span><span>{organization.is_archived ? 'Archiviert' : organization.status === 'open' ? 'Geöffnet' : organization.status === 'limited' ? 'Eingeschränkt' : 'Geschlossen'}</span></div>
        <button className={organization.is_archived ? '' : 'is-danger'} disabled={working} onClick={() => void archive(organization,!organization.is_archived)}>{organization.is_archived ? <RotateCcw size={13} /> : <Archive size={13} />}{organization.is_archived ? ' Wiederherstellen' : ' Archivieren'}</button>
      </article>)}
    </div>
  </section>
}

function CreateOrganization({ onCancel, onCreated, setError }: { onCancel: () => void; onCreated: (name: string) => Promise<void>; setError: (value: string) => void }) {
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('business')
  const [service, setService] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [working, setWorking] = useState(false)

  const create = async () => {
    if (name.trim().length < 2) { setError('Bitte einen Organisationsnamen angeben.'); return }
    setWorking(true); setError('')
    const { error } = await supabase.rpc('global_admin_create_organization', {
      new_name: name.trim(),
      new_short_name: shortName,
      new_organization_type: type,
      new_service_module: service || null,
      new_description: description,
      new_is_public: isPublic,
    })
    setWorking(false)
    if (error) { setError(error.message ?? 'Die Organisation konnte nicht angelegt werden.'); return }
    await onCreated(name.trim())
  }

  return <div className="global-org-create">
    <div className="global-org-create-grid">
      <label><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="z. B. Los Santos Taxi" /></label>
      <label><span>Kurzname</span><input value={shortName} onChange={(event) => setShortName(event.target.value)} placeholder="z. B. LST" /></label>
      <label><span>Art</span><span className="global-org-create-select"><select value={type} onChange={(event) => { setType(event.target.value); if (event.target.value === 'business') setService('') }}><option value="business">Unternehmen</option><option value="government">Öffentliche Einrichtung</option><option value="justice">Justiz</option><option value="other">Sonstige Organisation</option></select><ChevronDown size={14} /></span></label>
      <label><span>Fachbereich</span><span className="global-org-create-select"><select value={service} onChange={(event) => setService(event.target.value)} disabled={type === 'business'}><option value="">Keiner</option><option value="city">Stadtverwaltung</option><option value="medical">Medical</option><option value="police">Police</option><option value="fire">Fire & Rescue</option><option value="justice">Justice</option></select><ChevronDown size={14} /></span></label>
      <label className="global-org-create-wide"><span>Beschreibung</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} /></label>
    </div>
    <label className="global-org-registry-toggle"><input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} /> Im Stadtverzeichnis anzeigen</label>
    <div className="global-org-create-actions"><button onClick={onCancel}>Abbrechen</button><button className="primary-button" disabled={working || name.trim().length < 2} onClick={() => void create()}>{working ? 'Wird angelegt …' : 'Organisation anlegen'}</button></div>
  </div>
}
