import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { BadgeDollarSign, Car, FileText, FileWarning, Siren, UserRound } from 'lucide-react'
import { supabase } from './lib/supabase'

type PoliceView = 'citizens' | 'cases' | 'wanted' | 'vehicles' | 'fines' | 'warrants'

type PoliceContext = {
  can_open: boolean
  can_search_people: boolean
  can_view_cases: boolean
}

type PoliceToolsContext = {
  can_open: boolean
  can_manage_wanted: boolean
  can_manage_vehicles: boolean
  can_manage_fines: boolean
  can_manage_warrants: boolean
}

const toolLabels: Partial<Record<PoliceView, string>> = {
  wanted: 'Fahndungen',
  vehicles: 'Fahrzeuge',
  fines: 'Bußgelder',
  warrants: 'Haftbefehle',
}

export default function PoliceWorkspaceNavMount() {
  const [slot, setSlot] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const sync = () => {
      if (document.body.dataset.nexusPoliceWorkspace !== 'true') {
        setSlot(null)
        delete document.body.dataset.nexusPoliceView
        return
      }

      const workspace = document.querySelector<HTMLElement>('.police-easy-workspace')
      const hero = workspace?.querySelector<HTMLElement>('.police-easy-hero')
      if (!workspace || !hero) {
        setSlot(null)
        return
      }

      let target = workspace.querySelector<HTMLDivElement>(':scope > .police-workspace-nav-slot')
      if (!target) {
        target = document.createElement('div')
        target.className = 'police-workspace-nav-slot'
        hero.insertAdjacentElement('afterend', target)
      }
      setSlot((current) => current === target ? current : target)
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-nexus-police-workspace'] })
    return () => {
      observer.disconnect()
      delete document.body.dataset.nexusPoliceView
    }
  }, [])

  if (!slot) return null
  return createPortal(<PoliceWorkspaceNavigation />, slot)
}

function PoliceWorkspaceNavigation() {
  const [view, setView] = useState<PoliceView>('citizens')
  const [context, setContext] = useState<PoliceContext | null>(null)
  const [tools, setTools] = useState<PoliceToolsContext | null>(null)

  useEffect(() => {
    void (async () => {
      const [{ data: policeData }, { data: toolsData }] = await Promise.all([
        supabase.rpc('police_get_my_context'),
        supabase.rpc('police_tools_get_context'),
      ])
      setContext((policeData ?? null) as PoliceContext | null)
      setTools((toolsData ?? null) as PoliceToolsContext | null)
    })()
  }, [])

  const tabs = useMemo(() => [
    context?.can_search_people ? { key: 'citizens' as const, label: 'Bürger', icon: <UserRound size={16} /> } : null,
    context?.can_view_cases ? { key: 'cases' as const, label: 'Vorgänge', icon: <FileText size={16} /> } : null,
    tools?.can_manage_wanted ? { key: 'wanted' as const, label: 'Fahndungen', icon: <Siren size={16} /> } : null,
    tools?.can_manage_vehicles ? { key: 'vehicles' as const, label: 'Fahrzeuge', icon: <Car size={16} /> } : null,
    tools?.can_manage_fines ? { key: 'fines' as const, label: 'Bußgelder', icon: <BadgeDollarSign size={16} /> } : null,
    tools?.can_manage_warrants ? { key: 'warrants' as const, label: 'Haftbefehle', icon: <FileWarning size={16} /> } : null,
  ].filter(Boolean) as Array<{ key: PoliceView; label: string; icon: JSX.Element }>, [context, tools])

  useEffect(() => {
    if (tabs.length === 0) return
    if (!tabs.some((tab) => tab.key === view)) setView(tabs[0].key)
  }, [tabs, view])

  useEffect(() => {
    if (tabs.length === 0) return
    document.body.dataset.nexusPoliceView = view

    const toolLabel = toolLabels[view]
    if (!toolLabel) return

    const clickToolTab = () => {
      const button = Array.from(document.querySelectorAll<HTMLButtonElement>('.police-tools-tabs button'))
        .find((item) => item.textContent?.trim() === toolLabel)
      button?.click()
    }

    requestAnimationFrame(clickToolTab)
    const timer = window.setTimeout(clickToolTab, 80)
    return () => window.clearTimeout(timer)
  }, [view, tabs.length])

  if (!context?.can_open || tabs.length === 0) return null

  return (
    <nav className="police-workspace-nav" aria-label="Police Bereiche">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={view === tab.key ? 'is-active' : ''}
          onClick={() => setView(tab.key)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
