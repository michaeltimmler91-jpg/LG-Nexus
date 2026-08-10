import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardPlus,
  HeartPulse,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type MedicalContext = {
  can_open: boolean
  can_view_records: boolean
  can_edit_records: boolean
  can_create_treatments: boolean
  can_edit_treatments: boolean
}

type PatientSearchResult = {
  profile_id: string
  display_name: string
  nexus_id: string | null
  date_of_birth: string | null
  phone: string | null
  record_number: string | null
}

type MedicalTreatment = {
  id: string
  treatment_number: string
  status: 'open' | 'completed'
  summary: string | null
  responsible_name: string | null
  created_at: string
  completed_at: string | null
  row_version: number
}

type PatientOverview = {
  profile_id: string
  display_name: string
  nexus_id: string | null
  date_of_birth: string | null
  phone: string | null
  record: {
    id: string
    record_number: string
    blood_group: string | null
    emergency_notes: string | null
    internal_warning: string | null
    deceased: boolean
    created_at: string
    updated_at: string
    row_version: number
  }
  treatments: MedicalTreatment[]
}

const dateFormatter = new Intl.DateTimeFormat('de-DE')
const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const bloodGroups = ['', '0+', '0-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

function formatDate(value: string | null) {
  if (!value) return 'Nicht angegeben'
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

export default function MedicalModuleMount() {
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
      setActive(button.getAttribute('aria-label') === 'Medical' && document.body.dataset.nexusMedical === 'true')
    }

    document.addEventListener('click', onNavigation)
    return () => document.removeEventListener('click', onNavigation)
  }, [])

  useEffect(() => {
    if (active && document.body.dataset.nexusMedical !== 'true') setActive(false)

    if (active) document.body.dataset.nexusMedicalWorkspace = 'true'
    else delete document.body.dataset.nexusMedicalWorkspace

    return () => {
      delete document.body.dataset.nexusMedicalWorkspace
    }
  }, [active])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (active && document.body.dataset.nexusMedical !== 'true') setActive(false)
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-nexus-medical'] })
    return () => observer.disconnect()
  }, [active])

  if (!target || !active) return null

  return createPortal(
    <div className="nexus-medical-page-slot">
      <MedicalWorkspace />
    </div>,
    target,
  )
}

function MedicalWorkspace() {
  const [context, setContext] = useState<MedicalContext | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PatientSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<PatientOverview | null>(null)
  const [loadingPatient, setLoadingPatient] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [bloodGroup, setBloodGroup] = useState('')
  const [emergencyNotes, setEmergencyNotes] = useState('')
  const [internalWarning, setInternalWarning] = useState('')
  const [savingRecord, setSavingRecord] = useState(false)

  const [treatmentSummary, setTreatmentSummary] = useState('')
  const [creatingTreatment, setCreatingTreatment] = useState(false)
  const [workingTreatment, setWorkingTreatment] = useState<string | null>(null)

  const loadContext = useCallback(async () => {
    setContextLoading(true)
    const { data, error: contextError } = await supabase.rpc('medical_get_my_context')
    setContextLoading(false)

    if (contextError) {
      setContext(null)
      setError('Die Medical-Berechtigungen konnten nicht geladen werden.')
      return
    }

    setContext(data as MedicalContext)
  }, [])

  useEffect(() => {
    void loadContext()
  }, [loadContext])

  const applyOverview = (overview: PatientOverview) => {
    setSelected(overview)
    setBloodGroup(overview.record.blood_group ?? '')
    setEmergencyNotes(overview.record.emergency_notes ?? '')
    setInternalWarning(overview.record.internal_warning ?? '')
  }

  const loadPatient = useCallback(async (profileId: string) => {
    setLoadingPatient(true)
    setError('')
    setNotice('')

    const { data, error: patientError } = await supabase.rpc('medical_get_patient_overview', {
      target_profile: profileId,
    })

    setLoadingPatient(false)
    if (patientError || !data) {
      setError('Die Krankenakte konnte nicht geladen werden.')
      return
    }

    applyOverview(data as PatientOverview)
  }, [])

  const searchPatients = async () => {
    const needle = query.trim()
    if (needle.length < 2) {
      setResults([])
      setError('Bitte gib mindestens zwei Zeichen für die Patientensuche ein.')
      return
    }

    setSearching(true)
    setError('')
    setNotice('')
    const { data, error: searchError } = await supabase.rpc('medical_search_patients', { search_text: needle })
    setSearching(false)

    if (searchError) {
      setResults([])
      setError('Die Patientensuche konnte nicht ausgeführt werden.')
      return
    }

    setResults(Array.isArray(data) ? (data as PatientSearchResult[]) : [])
  }

  const recordDirty = useMemo(() => {
    if (!selected) return false
    return (
      bloodGroup !== (selected.record.blood_group ?? '')
      || emergencyNotes !== (selected.record.emergency_notes ?? '')
      || internalWarning !== (selected.record.internal_warning ?? '')
    )
  }, [bloodGroup, emergencyNotes, internalWarning, selected])

  const saveRecord = async () => {
    if (!selected || !context?.can_edit_records) return
    setSavingRecord(true)
    setError('')
    setNotice('')

    const { error: saveError } = await supabase.rpc('medical_update_record_basics', {
      target_profile: selected.profile_id,
      next_blood_group: bloodGroup || null,
      next_emergency_notes: emergencyNotes || null,
      next_internal_warning: internalWarning || null,
      expected_row_version: selected.record.row_version,
    })

    setSavingRecord(false)
    if (saveError) {
      setError(
        saveError.message?.includes('conflict')
          ? 'Die Akte wurde zwischenzeitlich verändert. Sie wurde neu geladen.'
          : 'Die medizinischen Stammdaten konnten nicht gespeichert werden.',
      )
      await loadPatient(selected.profile_id)
      return
    }

    setNotice('Die medizinischen Stammdaten wurden gespeichert.')
    await loadPatient(selected.profile_id)
  }

  const createTreatment = async () => {
    if (!selected || !context?.can_create_treatments) return
    setCreatingTreatment(true)
    setError('')
    setNotice('')

    const { data, error: createError } = await supabase.rpc('medical_create_treatment', {
      target_profile: selected.profile_id,
      treatment_summary: treatmentSummary.trim() || null,
    })

    setCreatingTreatment(false)
    if (createError) {
      setError('Die Behandlung konnte nicht angelegt werden.')
      return
    }

    const number = (data as { treatment_number?: string } | null)?.treatment_number
    setTreatmentSummary('')
    setNotice(number ? `Behandlung ${number} wurde angelegt.` : 'Die Behandlung wurde angelegt.')
    await loadPatient(selected.profile_id)
  }

  const completeTreatment = async (treatment: MedicalTreatment) => {
    if (!selected || !context?.can_edit_treatments) return
    setWorkingTreatment(treatment.id)
    setError('')
    setNotice('')

    const { error: completeError } = await supabase.rpc('medical_complete_treatment', {
      target_treatment: treatment.id,
      expected_row_version: treatment.row_version,
    })

    setWorkingTreatment(null)
    if (completeError) {
      setError('Die Behandlung konnte nicht abgeschlossen werden. Die Akte wird neu geladen.')
      await loadPatient(selected.profile_id)
      return
    }

    setNotice(`${treatment.treatment_number} wurde abgeschlossen.`)
    await loadPatient(selected.profile_id)
  }

  return (
    <div className="page-content nexus-medical-workspace">
      <section className="medical-hero">
        <div className="medical-hero-icon"><HeartPulse size={30} /></div>
        <div>
          <span className="eyebrow">LSMC · INTERN</span>
          <h2>Medical</h2>
          <p>Patientensuche, zentrale Krankenakten und Behandlungsvorgänge.</p>
        </div>
        <span className="medical-live-pill"><ShieldCheck size={14} /> Live & rechtebasiert</span>
      </section>

      {error ? <div className="medical-message is-error"><AlertTriangle size={15} />{error}</div> : null}
      {notice ? <div className="medical-message is-success"><Check size={15} />{notice}</div> : null}

      {contextLoading ? (
        <div className="medical-empty">Medical-Berechtigungen werden geladen …</div>
      ) : !context?.can_view_records ? (
        <div className="medical-permission-block">
          <LockKeyhole size={28} />
          <div>
            <strong>Kein Zugriff auf Krankenakten</strong>
            <span>Der Medical-Bereich ist sichtbar, aber deine Rolle besitzt derzeit keine Berechtigung zum Lesen von Akten.</span>
          </div>
        </div>
      ) : (
        <>
          <section className="medical-search-card">
            <div className="medical-section-heading">
              <div>
                <span className="eyebrow">PATIENTENSUCHE</span>
                <h3>Patient finden</h3>
                <p>Suche nach Name, Nexus-ID oder Geburtsdatum. Telefonnummern werden nur berücksichtigt, wenn sie für dich sichtbar sind.</p>
              </div>
              <button className="medical-icon-button" onClick={() => { setQuery(''); setResults([]); setSelected(null); setError(''); setNotice('') }}>
                <RefreshCw size={15} /> Zurücksetzen
              </button>
            </div>

            <div className="medical-search-row">
              <label>
                <Search size={17} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') void searchPatients() }}
                  placeholder="z. B. Lennox Davis, NX-000001 oder 10.08.1985"
                />
              </label>
              <button onClick={() => void searchPatients()} disabled={searching}>
                {searching ? 'Suche …' : 'Suchen'}
              </button>
            </div>

            {results.length > 0 ? (
              <div className="medical-search-results">
                {results.map((patient) => (
                  <button key={patient.profile_id} onClick={() => void loadPatient(patient.profile_id)}>
                    <span className="medical-avatar"><UserRound size={18} /></span>
                    <span className="medical-result-main">
                      <strong>{patient.display_name}</strong>
                      <small>{patient.nexus_id ?? 'Keine Nexus-ID'} · geb. {formatDate(patient.date_of_birth)}</small>
                    </span>
                    <span className="medical-record-number">{patient.record_number ?? 'Akte wird angelegt'}</span>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 && !searching ? (
              <div className="medical-search-hint">Noch keine Treffer angezeigt. Starte die Suche.</div>
            ) : null}
          </section>

          {loadingPatient ? <div className="medical-empty">Krankenakte wird geladen …</div> : null}

          {selected && !loadingPatient ? (
            <section className="medical-record-layout">
              <div className="medical-patient-header">
                <div className="medical-patient-identity">
                  <span className="medical-patient-avatar">{selected.display_name.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <span className="eyebrow">KRANKENAKTE · {selected.record.record_number}</span>
                    <h3>{selected.display_name}</h3>
                    <p>{selected.nexus_id ?? 'Keine Nexus-ID'} · geboren {formatDate(selected.date_of_birth)}{selected.phone ? ` · ${selected.phone}` : ''}</p>
                  </div>
                </div>
                <div className="medical-patient-status">
                  {selected.record.deceased ? <span className="is-warning">Verstorben markiert</span> : <span>Aktive Akte</span>}
                  <small>Aktualisiert {dateTimeFormatter.format(new Date(selected.record.updated_at))}</small>
                </div>
              </div>

              <div className="medical-record-grid">
                <article className="medical-card medical-basics-card">
                  <div className="medical-card-head">
                    <div><span className="eyebrow">STAMMDATEN</span><h4>Medizinische Hinweise</h4></div>
                    <Stethoscope size={20} />
                  </div>

                  <label className="medical-field compact">
                    <span>Blutgruppe</span>
                    <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)} disabled={!context.can_edit_records}>
                      {bloodGroups.map((group) => <option key={group || 'empty'} value={group}>{group || 'Nicht eingetragen'}</option>)}
                    </select>
                  </label>

                  <label className="medical-field">
                    <span>Wichtige medizinische Notfallhinweise</span>
                    <textarea
                      value={emergencyNotes}
                      onChange={(event) => setEmergencyNotes(event.target.value)}
                      placeholder="Noch keine Hinweise eingetragen."
                      disabled={!context.can_edit_records}
                    />
                  </label>

                  <label className="medical-field">
                    <span>Interner medizinischer Warnhinweis</span>
                    <textarea
                      value={internalWarning}
                      onChange={(event) => setInternalWarning(event.target.value)}
                      placeholder="Nur für berechtigte Medical-Mitarbeiter sichtbar."
                      disabled={!context.can_edit_records}
                    />
                  </label>

                  {context.can_edit_records ? (
                    <button className="medical-primary-button" disabled={!recordDirty || savingRecord} onClick={() => void saveRecord()}>
                      <CheckCircle2 size={15} /> {savingRecord ? 'Speichert …' : 'Stammdaten speichern'}
                    </button>
                  ) : null}
                </article>

                <article className="medical-card medical-treatment-card">
                  <div className="medical-card-head">
                    <div><span className="eyebrow">BEHANDLUNGEN</span><h4>Vorgänge</h4></div>
                    <ClipboardPlus size={20} />
                  </div>

                  {context.can_create_treatments ? (
                    <div className="medical-treatment-create">
                      <textarea
                        value={treatmentSummary}
                        onChange={(event) => setTreatmentSummary(event.target.value)}
                        placeholder="Kurze Zusammenfassung der neuen Behandlung …"
                      />
                      <button onClick={() => void createTreatment()} disabled={creatingTreatment}>
                        <ClipboardPlus size={15} /> {creatingTreatment ? 'Wird angelegt …' : 'Neue Behandlung'}
                      </button>
                    </div>
                  ) : null}

                  <div className="medical-treatment-list">
                    {selected.treatments.length === 0 ? (
                      <div className="medical-empty compact">Noch keine Behandlungsvorgänge vorhanden.</div>
                    ) : selected.treatments.map((treatment) => (
                      <div className="medical-treatment-row" key={treatment.id}>
                        <span className={`medical-treatment-status ${treatment.status}`}>{treatment.status === 'open' ? 'Offen' : 'Abgeschlossen'}</span>
                        <div>
                          <strong>{treatment.treatment_number}</strong>
                          <span>{treatment.summary || 'Keine Zusammenfassung hinterlegt.'}</span>
                          <small>{dateTimeFormatter.format(new Date(treatment.created_at))} · {treatment.responsible_name ?? 'Verantwortlicher nicht verfügbar'}</small>
                        </div>
                        {treatment.status === 'open' && context.can_edit_treatments ? (
                          <button disabled={workingTreatment === treatment.id} onClick={() => void completeTreatment(treatment)}>
                            <Check size={14} /> Abschließen
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="medical-next-grid">
                {['Diagnosen & Allergien', 'Medikamente', 'Rezepte & Bescheinigungen', 'Ausbildung & Wissen'].map((title) => (
                  <div className="medical-next-card" key={title}>
                    <strong>{title}</strong>
                    <span>Wird als nächster Medical-Baustein verbunden.</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
