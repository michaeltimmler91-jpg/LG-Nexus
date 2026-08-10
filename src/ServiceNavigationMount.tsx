import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Building2, ChevronRight, FileText, Landmark, LockKeyhole, Scale, ShieldCheck, UserCheck, Users } from 'lucide-react'
import CityOrganizationAdminPanel from './CityOrganizationAdminPanel'

type ServicePage = 'city' | 'justice'

const pageTitles: Record<ServicePage, string> = {
  city: 'Stadtverwaltung',
  justice: 'Justice',
}

function canOpen(page: ServicePage) {
  return page === 'city'
    ? document.body.dataset.nexusCity === 'true'
    : document.body.dataset.nexusJustice === 'true'
}

export default function ServiceNavigationMount() {
  const [navTarget, setNavTarget] = useState<Element | null>(null)
  const [pageTarget, setPageTarget] = useState<Element | null>(null)
  const [activePage, setActivePage] = useState<ServicePage | null>(null)

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
    const onCoreNavigation = (event: MouseEvent) => {
      const target = event.target as Element | null
      const button = target?.closest('.nav-button')
      if (!button || button.classList.contains('nexus-service-nav-button')) return
      setActivePage(null)
    }

    document.addEventListener('click', onCoreNavigation)
    return () => document.removeEventListener('click', onCoreNavigation)
  }, [])

  useEffect(() => {
    if (activePage && !canOpen(activePage)) {
      setActivePage(null)
      return
    }

    if (activePage) {
      document.body.dataset.nexusExternalPage = activePage
      document
        .querySelectorAll('.nav-button.is-active:not(.nexus-service-nav-button)')
        .forEach((button) => button.classList.remove('is-active'))
      const title = document.querySelector('.topbar-title h1')
      if (title) title.textContent = pageTitles[activePage]
    } else {
      delete document.body.dataset.nexusExternalPage
    }
  }, [activePage])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (activePage && !canOpen(activePage)) setActivePage(null)
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-nexus-city', 'data-nexus-justice'] })
    return () => observer.disconnect()
  }, [activePage])

  const open = (page: ServicePage) => {
    if (!canOpen(page)) return
    setActivePage(page)
  }

  return (
    <>
      {navTarget ? createPortal(
        <>
          <div className="nav-item-wrap nexus-service-injected nexus-city-nav">
            <button
              className={`nav-button nexus-service-nav-button ${activePage === 'city' ? 'is-active' : ''}`}
              onClick={() => open('city')}
              aria-label="Stadtverwaltung"
            >
              <Landmark size={21} strokeWidth={1.8} />
              <span className="nav-tooltip">Stadtverwaltung</span>
            </button>
          </div>
          <div className="nav-item-wrap nexus-service-injected nexus-justice-nav">
            <button
              className={`nav-button nexus-service-nav-button ${activePage === 'justice' ? 'is-active' : ''}`}
              onClick={() => open('justice')}
              aria-label="Justice"
            >
              <Scale size={21} strokeWidth={1.8} />
              <span className="nav-tooltip">Justice</span>
            </button>
          </div>
        </>,
        navTarget,
      ) : null}

      {pageTarget && activePage ? createPortal(
        <div className="nexus-service-page-slot">
          {activePage === 'city' ? <CityAdministrationPage /> : <JusticePage />}
        </div>,
        pageTarget,
      ) : null}
    </>
  )
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

function JusticePage() {
  return (
    <div className="page-content nexus-service-page">
      <section className="protected-hero">
        <div className="protected-icon"><Scale size={30} /></div>
        <div>
          <span className="eyebrow">JUSTICE · INTERN</span>
          <h2>Justice</h2>
          <p>Verfahren, Beweisanträge, Anhörungen, Entscheidungen und Vollstreckung.</p>
        </div>
        <span className="permission-pill"><LockKeyhole size={14} /> Rechtebasiert</span>
      </section>

      <div className="protected-grid">
        {[
          ['01', 'Verfahren', 'Verfahren anlegen, bearbeiten und miteinander verknüpfen.'],
          ['02', 'Anhörungen & Termine', 'Termine, Beteiligte und Protokolle verwalten.'],
          ['03', 'Entscheidungen', 'Urteile, Beschlüsse und Korrekturen nachvollziehbar führen.'],
          ['04', 'Beweismittel', 'Freigegebene Police-Beweise fallbezogen und schreibgeschützt verwenden.'],
        ].map(([number, title, description]) => (
          <article className="protected-card" key={title}>
            <div><span>{number}</span><Scale size={20} /></div>
            <h3>{title}</h3>
            <p>{description}</p>
            <button>Vorschau öffnen <ChevronRight size={15} /></button>
          </article>
        ))}
      </div>

      <div className="permission-note">
        <ShieldCheck size={18} />
        <div>
          <strong>Justice bleibt ein eigener geschützter Fachbereich.</strong>
          <span>Technische Rollen oder Stadtverwaltungsrechte geben keinen automatischen Zugriff auf Verfahren.</span>
        </div>
      </div>
    </div>
  )
}
