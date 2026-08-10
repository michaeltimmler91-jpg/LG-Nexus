import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, ChevronRight, FilePlus2, RefreshCw, Search, Shield, UserRound } from 'lucide-react'
import { supabase } from './lib/supabase'

type PoliceContext = {
  can_open: boolean
  can_search_people: boolean
  can_view_cases: boolean
  can_create_cases: boolean
  can_edit_cases: boolean
}

type PersonResult = {
  profile_id: string
  display_name: string
  nexus_id: string | null
  date_of_birth: string | null
}

type CasePerson = {
  profile_id: string
  display_name: string
  nexus_id: string | null
  person_role: 'accused' | 'victim' | 'witness' | 'other'
  note: string | null
}

type PoliceCase = {
  id: string
  case_number: string
  title: string
  summary: string | null
  status: 'new' | 'investigation' | 'review' | 'completed' | 'archived'
  lead_name: string | null
  created_at: string
  updated_at: string
  row_version: number
  people: CasePerson[]
}

const dateFormatter = new Intl.DateTimeFormat('de-DE')
const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const statusLabels: Record<PoliceCase['status'], string> = {
  new: 'Neu',
  investigation: 'Ermittlung',
  review: 'Prüfung',
  completed: 'Abgeschlossen',
  archived: 'Archiviert',
}

const personRoleLabels: Record<CasePerson['person_role'], string> = {
  accused: 'Beschuldigter',
  victim: 'Opfer',
  witness: 'Zeuge',
  other: 'Sonstige',
}

function formatDate(value: string | null) {
  if (!value) return 'Nicht angegeben'
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

export default function PoliceSimpleMount() {
  const [target, setTarget] = useState<Element | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const syncTarget = () => setTarget(document.querySelector('.main-area'))
    syncTarget()
    const observer = new MutationObserver(syncTarget)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onNavigation = (event: MouseEvent) => {
      const element = event.target as Element | null
      const button = element?.closest('.nav-button')
      if (!button) return
      setActive(button.getAttribute('aria-label') === 'Police' && document.body.dataset.nexusPolice === 'true')
    }

    document.addEventListener('click', onNavigation)
    return () => document.removeEventListener('click', onNavigation)
  }, [])

  useEffect(() => {
    if (active && document.body.dataset.nexusPolice !== 'true') setActive(false)
    if (active) document.body.dataset.nexusPoliceWorkspace = 'true'
    else delete document.body.dataset.nexusPoliceWorkspace
    return () => { delete document.body.dataset.nexusPoliceWorkspace }
  }, [active])

  if (!target || !active) return null
  return createPortal(<div className="nexus-police-page-slot"><PoliceWorkspace /></div>, target)
}

function PoliceWorkspace() {
  const [context, setContext] = useState<PoliceContext | null>(null)
  const [loadingContext, setLoadingContext] = useState(true)
  const [cases, setCases] = useState<PoliceCase[]>([])
  const [caseQuery, setCaseQuery] = useState('')
  const [loadingCases, setLoadingCases] = useState(false)
  const [selectedCase, setSelectedCase] = useState<PoliceCase | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [personQuery, setPersonQuery] = useState('')
  const [people, setPeople] = useState<PersonResult[]>([])
  const [searchingPeople, setSearchingPeople] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<PersonResult | null>(null)
  const [personRole, setPersonRole] = useState<CasePerson['person_role']>('accused')
  const [newTitle, setNewTitle] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [creating, setCreating] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  const loadContext = useCallback(async () => {
    setLoadingContext(true)
    const { data, error: contextError } = await supabase.rpc('police_get_my_context')
    setLoadingContext(false)
    if (contextError) {
      setError('Die Police-Berechtigungen konnten nicht geladen werden.')
      return
    }
    setContext(data as PoliceContext)
  }, [])

  const loadCases = useCallback(async (query = '') => {
    setLoadingCases(true)
    const { data, error: caseError } = await supabase.rpc('police_list_cases', { search_text: query.trim() || null })
    setLoadingCases(false)
    if (caseError) {
      setError('Die Fälle konnten nicht geladen werden.')
      return
    }
    const next = Array.isArray(data) ? (data as PoliceCase[]) : []
    setCases(next.map((entry) => ({ ...entry, people: Array.isArray(entry.people) ? entry.people : [] })))
    if (selectedCase) {
      const refreshed = next.find((entry) => entry.id === selectedCase.id)
      if (refreshed) setSelectedCase({ ...refreshed, people: Array.isArray(refreshed.people) ? refreshed.people : [] })
    }
  }, [selectedCase])

  useEffect(() => { void loadContext() }, [loadContext])
  useEffect(() => {
    if (context?.can_view_cases) void loadCases()
  }, [context?.can_view_cases])

  const searchPeople = async () => {
    const needle = personQuery.trim()
    if (needle.length < 2) {
      setError('Bitte gib mindestens zwei Zeichen für die Personensuche ein.')
      return
    }
    setSearchingPeople(true)
    setError('')
    setNotice('')
    const { data, error: searchError } = await supabase.rpc('police_search_people', { search_text: needle })
    setSearchingPeople(false)
    if (searchError) {
      setError('Die Personensuche konnte nicht ausgeführt werden.')
      return
    }
    setPeople(Array.isArray(data) ? (data as PersonResult[]) : [])
  }

  const createCase = async () => {
    if (!context?.can_create_cases || newTitle.trim().length < 3) return
    setCreating(true)
    setError('')
    setNotice('')
    const { data, error: createError } = await supabase.rpc('police_create_case', {
      case_title: newTitle.trim(),
      case_summary: newSummary.trim() || null,
      target_profile: selectedPerson?.profile_id ?? null,
      target_person_role: selectedPerson ? personRole : null,
    })
    setCreating(false)
    if (createError) {
      setError('Der Fall konnte nicht angelegt werden.')
      return
    }
    const number = (data as { case_number?: string } | null)?.case_number
    setNotice(number ? `${number} wurde angelegt.` : 'Fall wurde angelegt.')
    setNewTitle('')
    setNewSummary('')
    setSelectedPerson(null)
    setPeople([])
    setPersonQuery('')
    await loadCases()
  }

  const updateStatus = async (nextStatus: PoliceCase['status']) => {
    if (!selectedCase || !context?.can_edit_cases) return
    setChangingStatus(true)
    setError('')
    setNotice('')
    const { error: statusError } = await supabase.rpc('police_update_case_status', {
      target_case: selectedCase.id,
      next_status: nextStatus,
      expected_row_version: selectedCase.row_version,
    })
    setChangingStatus(false)
    if (statusError) {
      setError('Der Fall wurde zwischenzeitlich geändert. Bitte erneut öffnen.')
      await loadCases(caseQuery)
      return
    }
    setNotice('Fallstatus aktualisiert.')
    await loadCases(caseQuery)
  }

  const openCount = useMemo(() => cases.filter((entry) => !['completed', 'archived'].includes(entry.status)).length, [cases])

  return (
    <div className="page-content police-simple-workspace">
      <section className="police-simple-hero">
        <div className="police-simple-hero-icon"><Shield size={30} /></div>
        <div>
          <span className="eyebrow">LSPD · INTERN</span>
          <h2>Police</h2>
          <p>Person suchen, Fall anlegen und den aktuellen Ermittlungsstand pflegen.</p>
        </div>
        <div className="police-simple-stat"><strong>{openCount}</strong><span>offene Fälle</span></div>
      </section>

      {error ? <div className="police-simple-message is-error"><AlertTriangle size={15} />{error}</div> : null}
      {notice ? <div className="police-simple-message is-success"><Check size={15} />{notice}</div> : null}

      {loadingContext ? <div className="police-simple-empty">Berechtigungen werden geladen …</div> : !context?.can_open ? (
        <div className="police-simple-empty">Kein Zugriff auf Police.</div>
      ) : (
        <>
          <div className="police-simple-grid">
            <section className="police-simple-card">
              <div className="police-simple-section-head">
                <div><span className="eyebrow">FÄLLE</span><h3>Fallübersicht</h3></div>
                <button className="police-simple-icon-button" onClick={() => void loadCases(caseQuery)}><RefreshCw size={14} /> Aktualisieren</button>
              </div>
              {context.can_view_cases ? (
                <>
                  <div className="police-simple-search-row">
                    <label><Search size={16} /><input value={caseQuery} onChange={(event) => setCaseQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void loadCases(caseQuery) }} placeholder="Fallnummer, Titel oder Person" /></label>
                    <button onClick={() => void loadCases(caseQuery)} disabled={loadingCases}>{loadingCases ? 'Lädt …' : 'Suchen'}</button>
                  </div>
                  <div className="police-simple-case-list">
                    {cases.length === 0 ? <div className="police-simple-empty compact">Keine Fälle gefunden.</div> : cases.map((entry) => (
                      <button key={entry.id} onClick={() => setSelectedCase(entry)} className={selectedCase?.id === entry.id ? 'is-active' : ''}>
                        <span><strong>{entry.case_number} · {entry.title}</strong><small>{statusLabels[entry.status]} · {entry.lead_name ?? 'Police'} · {dateTimeFormatter.format(new Date(entry.updated_at))}</small></span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </>
              ) : <div className="police-simple-empty compact">Deine Rolle darf keine Fälle lesen.</div>}
            </section>

            <section className="police-simple-card">
              <div className="police-simple-section-head"><div><span className="eyebrow">NEUER FALL</span><h3>Fall anlegen</h3></div><FilePlus2 size={19} /></div>
              {context.can_create_cases ? (
                <div className="police-simple-form">
                  <label><span>Titel</span><input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Kurzer Falltitel" /></label>
                  <label><span>Kurzbeschreibung</span><textarea value={newSummary} onChange={(event) => setNewSummary(event.target.value)} placeholder="Worum geht es?" /></label>

                  {context.can_search_people ? (
                    <div className="police-simple-person-picker">
                      <label><span>Person verknüpfen</span><div className="police-simple-search-row"><label><Search size={16} /><input value={personQuery} onChange={(event) => setPersonQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void searchPeople() }} placeholder="Name oder Nexus-ID" /></label><button type="button" onClick={() => void searchPeople()} disabled={searchingPeople}>{searchingPeople ? 'Sucht …' : 'Suchen'}</button></div></label>
                      {selectedPerson ? (
                        <div className="police-simple-selected-person"><UserRound size={17} /><span><strong>{selectedPerson.display_name}</strong><small>{selectedPerson.nexus_id ?? 'Keine Nexus-ID'} · geb. {formatDate(selectedPerson.date_of_birth)}</small></span><button type="button" onClick={() => setSelectedPerson(null)}>Entfernen</button></div>
                      ) : people.length > 0 ? (
                        <div className="police-simple-person-results">{people.map((person) => <button type="button" key={person.profile_id} onClick={() => setSelectedPerson(person)}><span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'}</small></span><ChevronRight size={14} /></button>)}</div>
                      ) : null}
                      {selectedPerson ? <label><span>Rolle im Fall</span><select value={personRole} onChange={(event) => setPersonRole(event.target.value as CasePerson['person_role'])}>{Object.entries(personRoleLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label> : null}
                    </div>
                  ) : null}

                  <button className="police-simple-primary" onClick={() => void createCase()} disabled={creating || newTitle.trim().length < 3}>{creating ? 'Wird angelegt …' : 'Fall anlegen'}</button>
                </div>
              ) : <div className="police-simple-empty compact">Deine Rolle darf keine Fälle anlegen.</div>}
            </section>
          </div>

          {selectedCase ? (
            <section className="police-simple-case-detail">
              <div className="police-simple-section-head">
                <div><span className="eyebrow">{selectedCase.case_number}</span><h3>{selectedCase.title}</h3><p>{selectedCase.summary || 'Keine Kurzbeschreibung hinterlegt.'}</p></div>
                <span className={`police-simple-status is-${selectedCase.status}`}>{statusLabels[selectedCase.status]}</span>
              </div>

              <div className="police-simple-detail-grid">
                <div><span>Federführung</span><strong>{selectedCase.lead_name ?? 'Police'}</strong></div>
                <div><span>Angelegt</span><strong>{dateTimeFormatter.format(new Date(selectedCase.created_at))}</strong></div>
              </div>

              {selectedCase.people.length > 0 ? (
                <div className="police-simple-linked-people">
                  <span className="eyebrow">BETEILIGTE</span>
                  {selectedCase.people.map((person) => <div key={`${person.profile_id}-${person.person_role}`}><UserRound size={15} /><span><strong>{person.display_name}</strong><small>{personRoleLabels[person.person_role]} · {person.nexus_id ?? 'Keine Nexus-ID'}</small></span></div>)}
                </div>
              ) : null}

              {context.can_edit_cases ? (
                <div className="police-simple-status-actions">
                  <span>Status ändern:</span>
                  {(Object.keys(statusLabels) as PoliceCase['status'][]).map((status) => <button key={status} disabled={changingStatus || selectedCase.status === status} onClick={() => void updateStatus(status)}>{statusLabels[status]}</button>)}
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
