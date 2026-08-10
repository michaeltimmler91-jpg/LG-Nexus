import { useEffect } from 'react'
import { supabase } from './lib/supabase'

type OrganizationContext = {
  permissions?: string[]
}

const protectedNavigation = [
  { label: 'Stadtverwaltung', permission: 'city.access', bodyKey: 'city' },
  { label: 'Medical', permission: 'medical.access', bodyKey: 'medical' },
  { label: 'Police', permission: 'police.access', bodyKey: 'police' },
  { label: 'Fire & Rescue', permission: 'fire.access', bodyKey: 'fire' },
  { label: 'Justice', permission: 'justice.access', bodyKey: 'justice' },
] as const

function dataKey(bodyKey: string) {
  return `nexus${bodyKey.charAt(0).toUpperCase()}${bodyKey.slice(1)}`
}

function setPermissionState(permissions: Set<string>) {
  for (const item of protectedNavigation) {
    document.body.dataset[dataKey(item.bodyKey)] = permissions.has(item.permission) ? 'true' : 'false'
  }
  document.body.dataset.nexusPermissionsReady = 'true'
}

function syncServiceDivider() {
  document.querySelectorAll('.nav-item-wrap.nexus-live-first-service').forEach((node) => {
    node.classList.remove('nexus-live-first-service')
  })

  const firstVisible = protectedNavigation.find((item) => document.body.dataset[dataKey(item.bodyKey)] === 'true')
  if (!firstVisible || firstVisible.label === 'Medical') return

  const button = document.querySelector(`.nav-button[aria-label="${firstVisible.label}"]`)
  button?.closest('.nav-item-wrap')?.classList.add('nexus-live-first-service')
}

function normalizeVisibleLanguage() {
  const root = document.querySelector('.nexus-shell')
  if (!root) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()

  while (node) {
    const value = node.nodeValue
    if (value) {
      const next = value
        .replace(/\bRP-Abende\b/g, 'Abende')
        .replace(/\bRP[- ](?=[A-ZÄÖÜa-zäöü])/g, '')
        .replace(/\bIC\b/g, '')
        .replace(/\bOOC\b/g, '')
        .replace(/ {2,}/g, ' ')

      if (next !== value) node.nodeValue = next
    }
    node = walker.nextNode()
  }
}

export default function PermissionNavigationGuard() {
  useEffect(() => {
    let disposed = false

    const applyEmpty = () => {
      if (disposed) return
      setPermissionState(new Set())
      window.setTimeout(() => {
        syncServiceDivider()
        normalizeVisibleLanguage()
      }, 0)
    }

    const refresh = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData.session

      if (!session?.user?.id) {
        applyEmpty()
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('account_status')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile || profile.account_status !== 'active') {
        applyEmpty()
        return
      }

      const { data: contextData, error } = await supabase.rpc('get_my_organization_context')
      if (disposed) return

      const permissions = new Set<string>()
      if (!error && Array.isArray(contextData)) {
        for (const context of contextData as OrganizationContext[]) {
          for (const permission of context.permissions ?? []) permissions.add(permission)
        }
      }

      setPermissionState(permissions)
      window.setTimeout(() => {
        syncServiceDivider()
        normalizeVisibleLanguage()
      }, 0)
    }

    document.body.dataset.nexusPermissionsReady = 'false'
    applyEmpty()
    void refresh()

    const observer = new MutationObserver(() => {
      syncServiceDivider()
      normalizeVisibleLanguage()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void refresh(), 0)
    })

    const onFocus = () => void refresh()
    window.addEventListener('focus', onFocus)

    return () => {
      disposed = true
      observer.disconnect()
      authListener.subscription.unsubscribe()
      window.removeEventListener('focus', onFocus)
      delete document.body.dataset.nexusPermissionsReady
      delete document.body.dataset.nexusCity
      delete document.body.dataset.nexusMedical
      delete document.body.dataset.nexusPolice
      delete document.body.dataset.nexusFire
      delete document.body.dataset.nexusJustice
    }
  }, [])

  return null
}
