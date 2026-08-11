import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Building2, ChevronRight, FileText, Landmark, LockKeyhole, ShieldCheck, UserCheck, Users } from 'lucide-react'
import CityOrganizationAdminPanel from './CityOrganizationAdminPanel'

function canOpenCity() {
  return document.body.dataset.nexusCity === 'true'
}

export default function ServiceNavigationMount() {
  const [navTarget, setNavTarget] = useState<Element | null>(null)
  const [pageTarget, setPageTarget] = useState<Element | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const syncTargets = () => {
      const nextNav = document.querySelector('.nav-stack')
      const nextPage = document.querySelector('.main-area')
      setNavTarget((current) => current === nextNav ? current : nextNav)
      setPageTarget((current) => current === nextPage ? current : nextPage)
    }
    syncTargets()
    const observer = new MutationObserver(syncTargets)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onNavigation = (event: MouseEvent) => {
      const target = event.target as Element | null
      const button = target?.closest('.nav-button')
      if (!button) return
      if (button.getAttribute('aria-label') === 'Stadtverwaltung') setActive(canOpenCity())
      else if (active) setActive(false)
    }
    document.addEventListener('click', onNavigation)
    return () => document.removeEventListener('click', onNavigation)
  }, [active])

  useEffect(() => {
    if (active && !canOpenCity()) {
      setActive(false)
      return
    }
    if (active) {
      document.body.dataset.nexusExternalPage = 'city'
      document.querySelectorAll('.nav-button.is-active:not([aria-label="Stadtverwaltung"])').forEach((button) => button.classList.remove('is-active'))
      const title = document.querySelector('.topbar-title h1')
      if (title) title.textContent = 'Stadtverwaltung'
    } else if (document.body.dataset.nexusExternalPage === 'city') {
      delete document.body.dataset.nexusExternalPage
    }
    return () => {
      if (document.body.dataset.nexusExternalPage === 'city') delete document.body.dataset.nexusExternalPage
    }
  }, [active])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (active && !canOpenCity()) setActive(false)
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-nexus-city'] })
    return () => observer.disconnect()
  }, [active])

  return <>
    {navTarget ? createPortal(
      <div className="nav-item-wrap nexus-service-injected nexus-city-nav">
        <button className={`nav-button nexus-service-nav-button ${active ? 'is-active' : ''}`} aria-label="Stadtverwaltung">
          <Landmark size={21} strokeWidth={1.8} />
          <span className="nav-tooltip">Stadtverwaltung</span>
        </button>
      </div>, navTarget,
    ) : null}
    {pageTarget && active ? createPortal(<div className="nexus-service-page-slot"><CityAdministrationPage /></div>, pageTarget) : null}
  </>
}

function CityAdministrationPage() {
  return (
    <div className="page-content nexus-service-page">
      <section className="protected-hero">
        <div className="protected-icon"><Landmark size={30} /></div>
        <div>
          <span className="eyebrow">STADTHALLE · INTERN</span>
          <h2>Stadtverwaltung</h2>
          <p>Accountfreischaltungen, Bürgeranträge, Organisationsaufsicht und interne Verwaltungsaufgaben.</p>
        </div>
        <span className="permission-pill"><LockKeyhole size={14} /> Rechtebasiert</span>
      </section>

      <div className="protected-grid nexus-city-grid">
        <article className="protected-card nexus-city-focus-card">
          <div><span>01</span><UserCheck size={20} /></div>
          <h3>Accountfreischaltungen</h3>
          <p>Neue Bürgerkonten prüfen, freischalten oder mit Begründung ablehnen.</p>
          <span className="nexus-live-pill">Live verbunden</span>
        </article>
        <article className="protected-card nexus-city-focus-card">
          <div><span>02</span><Users size={20} /></div>
          <h3>Mitarbeiter & Rollen</h3>
          <p>Mitarbeiter aufnehmen, normale Rollen zuweisen und Mitglieder verwalten.</p>
          <span className="nexus-live-pill">Live verbunden</span>
        </article>
        <article className="protected-card">
          <div><span>03</span><FileText size={20} /></div>
          <h3>Namensänderungen</h3>
          <p>Anträge prüfen und genehmigte Änderungen mit interner Historie verwalten.</p>
          <button>Wird als Nächstes gebaut <ChevronRight size={15} /></button>
        </article>
        <article className="protected-card">
          <div><span>04</span><Building2 size={20} /></div>
          <h3>Unternehmensregister</h3>
          <p>Unternehmen, Registerdaten und Verwaltungsfreigaben zentral bearbeiten.</p>
          <button>Vorschau <ChevronRight size={15} /></button>
        </article>
      </div>

      <div id="city-account-admin-target" className="nexus-city-admin-target" />
      <CityOrganizationAdminPanel />

      <div className="permission-note">
        <ShieldCheck size={18} />
        <div>
          <strong>Stadthallenrechte bleiben von Fachakten getrennt.</strong>
          <span>Auch Organisationsaufsicht oder Owner-Zuweisung geben keinen pauschalen Einblick in fremde Fachakten.</span>
        </div>
      </div>
    </div>
  )
}
