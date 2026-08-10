import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AccountAdminPanel from './AccountAdminPanel'

export default function AccountAdminMount() {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    const syncTarget = () => {
      const header = document.querySelector('.profile-header-card')
      const nextTarget = header?.parentElement ?? null
      setTarget((current) => current === nextTarget ? current : nextTarget)
    }

    syncTarget()
    const observer = new MutationObserver(syncTarget)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return target ? createPortal(<AccountAdminPanel />, target) : null
}
