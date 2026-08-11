import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Settings } from 'lucide-react'
import { supabase } from './lib/supabase'

type ServiceKey = 'medical' | 'police' | 'fire' | 'justice'

type ServiceConfig = {
  key: ServiceKey
  module: string
  workspaceSelector: string
  navSelector: string
  datasetKey: 'nexusMedicalWorkspace' | 'nexusPoliceWorkspace' | 'nexusFireWorkspace' | 'nexusJusticeWorkspace'
}

type OrganizationContext = {
  organization_id: string
  name: string
  short_name: string | null
  status: 'open' | 'limited' | 'closed'
  status_message: string | null
  service_module: string | null
  can_profile: boolean
  can_status: boolean
  can_media: boolean
  can_members: boolean
  can_roles: boolean
  can_assign_roles: boolean
  can_events: boolean
}

const services: ServiceConfig[] = [
  {
    key: 'medical',
    module: 'medical',
    workspaceSelector: '.medical-workspace',
    navSelector: '.medical-workspace-nav',
    datasetKey: 'nexusMedicalWorkspace',
  },
  {
    key: 'police',
    module: 'police',
    workspaceSelector: '.police-easy-workspace',
    navSelector: '.police-workspace-nav',
    datasetKey: 'nexusPoliceWorkspace',
  },
  {
    key: 'fire',
    module: 'fire',
    workspaceSelector: '.fire-workspace',
    navSelector: '.fire-tabs',
    datasetKey: 'nexusFireWorkspace',
  },
  {
    key: 'justice',
    module: 'justice',
    workspaceSelector: '.justice-workspace',
    navSelector: '.justice-tabs',
    datasetKey: 'nexusJusticeWorkspace',
  },
]

const statusLabels: Record<OrganizationContext['status'], string> = {
  open: 'Geöffnet',
  limited: 'Eingeschränkt',
  closed: 'Geschlossen',
}

function activeService() {
  return services.find((service) => document.body.dataset[service.datasetKey] === 'true') ?? null
}

function hasManagementAccess(context: OrganizationContext) {
  return context.can_profile
    || context.can_status
    || context.can_media
    || context.can_members
    || context.can_roles
    || context.can_assign_roles
    || context.can_events
}

export default function ServiceOrganizationAdminMount() {
  const [service, setService] = useState<ServiceConfig | null>(null)
  const [workspaceTarget, setWorkspaceTarget] = useState<Element | null>(null)
  const [navTarget, setNavTarget] = useState<Element | null>(null)
  const [organization, setOrganization] = useState<OrganizationContext | null>(null)
  const [adminOpen, setAdminOpen] = useState(false)

  const syncTargets = useCallback(() => {
    const nextService = activeService()
    const nextWorkspace = nextService ? document.querySelector(nextService.workspaceSelector) : null
    const nextNav = nextService ? document.querySelector(nextService.navSelector) : null

    setService((current) => current?.key === nextService?.key ? current : nextService)
    setWorkspaceTarget((current) => current === nextWorkspace ? current : nextWorkspace)
    setNavTarget((current) => current === nextNav ? current : nextNav)
  }, [])

  const loadOrganization = useCallback(async (currentService: ServiceConfig | null) => {
    if (!currentService) {
      setOrganization(null)
      return
    }

    const { data, error } = await supabase.rpc('organization_management_get_context')
    if (error) {
      setOrganization(null)
      return
    }

    const rows = Array.isArray(data) ? data as OrganizationContext[] : []
    const next = rows.find((item) => item.service_module === currentService.module && hasManagementAccess(item)) ?? null
    setOrganization(next)
  }, [])

  useEffect(() => {
    syncTargets()
    const observer = new MutationObserver(syncTargets)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'data-nexus-medical-workspace',
        'data-nexus-police-workspace',
        'data-nexus-fire-workspace',
        'data-nexus-justice-workspace',
      ],
    })
    return () => observer.disconnect()
  }, [syncTargets])

  useEffect(() => {
    setAdminOpen(false)
    void loadOrganization(service)
  }, [service?.key, loadOrganization])

  useEffect(() => {
    const refresh = () => void loadOrganization(service)
    window.addEventListener('nexus:permissions-changed', refresh)
    return () => window.removeEventListener('nexus:permissions-changed', refresh)
  }, [service, loadOrganization])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!adminOpen || !service) return
      const element = event.target as Element | null
      const navigation = element?.closest(service.navSelector)
      if (navigation && !element?.closest('.service-org-admin-button')) setAdminOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [adminOpen, service])

  useEffect(() => {
    if (adminOpen && service) document.body.dataset.nexusServiceOrgAdmin = service.key
    else delete document.body.dataset.nexusServiceOrgAdmin
    return () => { delete document.body.dataset.nexusServiceOrgAdmin }
  }, [adminOpen, service])

  useEffect(() => {
    if (!adminOpen || !organization) return

    const selectOrganization = () => {
      const host = document.querySelector('.service-org-admin-host')
      const select = host?.querySelector<HTMLSelectElement>('.org-control-select select')
      if (!select || select.value === organization.organization_id) return
      if (!Array.from(select.options).some((option) => option.value === organization.organization_id)) return
      select.value = organization.organization_id
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }

    selectOrganization()
    const observer = new MutationObserver(selectOrganization)
    const host = document.querySelector('.service-org-admin-host')
    if (host) observer.observe(host, { childList: true, subtree: true })
    const timer = window.setTimeout(selectOrganization, 120)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [adminOpen, organization?.organization_id])

  const button = useMemo(() => {
    if (!organization) return null
    return (
      <button
        type="button"
        className={`service-org-admin-button ${adminOpen ? 'is-active' : ''}`}
        onClick={() => setAdminOpen((current) => !current)}
        title={`${organization.name} verwalten`}
      >
        <Settings size={16} />
        <span>Verwaltung</span>
        <small className={`service-org-status is-${organization.status}`}>
          <i />{statusLabels[organization.status]}
        </small>
      </button>
    )
  }, [adminOpen, organization])

  return (
    <>
      {navTarget && button ? createPortal(button, navTarget) : null}
      {workspaceTarget && organization && adminOpen ? createPortal(
        <div className="service-org-admin-host" data-organization-id={organization.organization_id}>
          <div className="profile-header-card service-org-admin-anchor" aria-hidden="true" />
        </div>,
        workspaceTarget,
      ) : null}
    </>
  )
}
