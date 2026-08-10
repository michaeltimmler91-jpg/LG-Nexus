import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardPlus,
  HeartPulse,
  LockKeyhole,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type MedicalContext = {
  can_open: boolean
  can_view_records: boolean
  can_edit_records: boolean
  can_create_treatments: boolean
  can_edit_treatments: boolean
  can_manage_templates: boolean
}

type PatientSearchResult = {
  profile_id: string
  display_name: string
  nexus_id: string | null
  date_of_birth: string | null
  phone: string | null
  record_number: string | null
}

type TreatmentTemplate = {
  id: string
  name: string
  treatment_text: string
  row_version: number
}

type MedicalTreatment = {
  id: string
  treatment_number: string
  performed_text: string
  template_name: string | null
  treated_by_name: string | null
  created_at: string
  followup_required: boolean
  followup_mode: 'exact' | 'range' | null
  followup_from: string | null
  followup_to: string | null
  followup_checkpoints: string[]
  followup_attended_at: string | null
  followup_attended_by_name: string | null
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
    allergies: string | null
    emergency_contacts: string | null
    medical_notes: string | null
    updated_at: string
    row_version: number
  }
  treatments: MedicalTreatment[]
}

const bloodGroups = ['', '0+', '0-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
const dateFormatter = new Intl.DateTimeFormat('de-DE')
const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(value: string | null) {
  if (!value) return 'Nicht angegeben'
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

function parseCheckpoints(value: string) {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim().replace(/^[-•]\s*/, ''))
    .filter(Boolean)
}

function followupLabel(treatment: MedicalTreatment) {
  if (!treatment.followup_from) return 'Termin offen'
  if (treatment.followup_mode === 'range' && treatment.followup_to && treatment.followup_to !== treatment.followup_from) {
    return `${formatDate(treatment.followup_from)} – ${formatDate(treatment.followup_to)}`
  }
  return formatDate(treatment.followup_from)
}

export default function MedicalSimpleMount() {
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
    return () => { delete document.body.dataset.nexusMedicalWorkspace }
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
  const [allergies, setAllergies] = useState('')
  const [emergencyContacts, setEmergencyContacts] = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')
  const [savingRecord, setSavingRecord] = useState(false)

  const [templates, setTemplates] = useState<TreatmentTemplate[]>([])
  const [templateId, setTemplateId] = useState('')
  const [treatmentText, setTreatmentText] = useState('')
  const [followupRequired, setFollowupRequired] = useState(false)
  const [followupMode, setFollowupMode] = useState<'exact' | 'range'>('exact')
  const [followupFrom, setFollowupFrom] = useState('')
  const [followupTo, setFollowupTo] = useState('')
  const [followupChecks, setFollowupChecks] = useState('')
  const [creatingTreatment, setCreatingTreatment] = useState(false)
  const [workingFollowup, setWorkingFollowup] = useState<string | null>(null)

  const [showTemplates, setShowTemplates] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TreatmentTemplate | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [templateText, setTemplateText] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)

  const loadContext = useCallback(async () => {
    setContextLoading(true)
    const { data, error: contextError } = await supabase.rpc('medical_simple_get_context')
    setContextLoading(false)
    if (contextError) {
      setError('Die Medical-Berechtigungen konnten nicht geladen werden.')
      return
    }
    setContext(data as MedicalContext)
  }, [])

  const loadTemplates = useCallback(async () => {
    const { data, error: templateError } = await supabase.rpc('medical_simple_list_templates')
    if (templateError) return
    const items = Array.isArray(data) ? (data as TreatmentTemplate[]) : []
    setTemplates(items)
  }, [])

  useEffect(() => { void loadContext() }, [loadContext])

  useEffect(() => {
    if (context?.can_create_treatments || context?.can_manage_templates) void loadTemplates()
  }, [context?.can_create_treatments, context?.can_manage_templates, loadTemplates])

  const applyPatient = (overview: PatientOverview) => {
    const normalized = {
      ...overview,
      treatments: Array.isArray(overview.treatments) ? overview.treatments.map((item) => ({
        ...item,
        followup_checkpoints: Array.isArray(item.followup_checkpoints) ? item.followup_checkpoints : [],
      })) : [],
    }
    setSelected(normalized)
    setBloodGroup(overview.record.blood_group ?? '')
    setAllergies(overview.record.allergies ?? '')
    setEmergencyContacts(overview.record.emergency_contacts ?? '')
    setMedicalNotes(overview.record.medical_notes ?? '')
  }

  const loadPatient = useCallback(async (profileId: string) => {
    setLoadingPatient(true)
    setError('')
    const { data, error: patientError } = await supabase.rpc('medical_simple_get_patient', { target_profile: profileId })
    setLoadingPatient(false)
    if (patientError || !data) {
      setError('Die Krankenakte konnte nicht geladen werden.')
      return
    }
    applyPatient(data as PatientOverview)
  }, [])

  const searchPatients = async () => {
    const needle = query.trim()
    if (needle.length < 2) {
      setError('Bitte gib mindestens zwei Zeichen ein.')
      setResults([])
      return
    }
    setSearching(true)
    setError('')
    setNotice('')
    const { data, error: searchError } = await supabase.rpc('medical_search_patients', { search_text: needle })
    setSearching(false)
    if (searchError) {
      setError('Die Patientensuche konnte nicht ausgeführt werden.')
      setResults([])
      return
    }
    setResults(Array.isArray(data) ? (data as PatientSearchResult[]) : [])
  }

  const recordDirty = useMemo(() => {
    if (!selected) return false
    return bloodGroup !== (selected.record.blood_group ?? '')
      || allergies !== (selected.record.allergies ?? '')
      || emergencyContacts !== (selected.record.emergency_contacts ?? '')
      || medicalNotes !== (selected.record.medical_notes ?? '')
  }, [allergies, bloodGroup, emergencyContacts, medicalNotes, selected])

  const saveRecord = async () => {
    if (!selected || !context?.can_edit_records) return
    setSavingRecord(true)
    setError('')
    setNotice('')
    const { error: saveError } = await supabase.rpc('medical_simple_update_record', {
      target_profile: selected.profile_id,
      next_blood_group: bloodGroup || null,
      next_allergies: allergies || null,
      next_emergency_contacts: emergencyContacts || null,
      next_medical_notes: medicalNotes || null,
      expected_row_version: selected.record.row_version,
    })
    setSavingRecord(false)
    if (saveError) {
      setError('Die Stammdaten konnten nicht gespeichert werden. Die Akte wird neu geladen.')
      await loadPatient(selected.profile_id)
      return
    }
    setNotice('Stammdaten gespeichert.')
    await loadPatient(selected.profile_id)
  }

  const chooseTemplate = (id: string) => {
    setTemplateId(id)
    const template = templates.find((entry) => entry.id === id)
    setTreatmentText(template?.treatment_text ?? '')
  }

  const resetTreatment = () => {
    setTemplateId('')
    setTreatmentText('')
    setFollowupRequired(false)
    setFollowupMode('exact')
    setFollowupFrom('')
    setFollowupTo('')
    setFollowupChecks('')
  }

  const createTreatment = async () => {
    if (!selected || !context?.can_create_treatments) return
    if (treatmentText.trim().length < 2) {
      setError('Bitte trage ein, was gemacht wurde.')
      return
    }

    const checkpoints = parseCheckpoints(followupChecks)
    if (followupRequired) {
      if (!followupFrom || (followupMode === 'range' && !followupTo)) {
        setError('Bitte gib den Termin für die Nachbehandlung an.')
        return
      }
      if (checkpoints.length === 0) {
        setError('Bitte gib mindestens einen Kontrollpunkt für die Nachbehandlung an.')
        return
      }
    }

    setCreatingTreatment(true)
    setError('')
    setNotice('')
    const { data, error: createError } = await supabase.rpc('medical_simple_create_treatment', {
      target_profile: selected.profile_id,
      target_template: templateId || null,
      treatment_text: treatmentText.trim(),
      needs_followup: followupRequired,
      next_followup_mode: followupRequired ? followupMode : null,
      next_followup_from: followupRequired ? followupFrom : null,
      next_followup_to: followupRequired && followupMode === 'range' ? followupTo : null,
      next_followup_checkpoints: followupRequired ? checkpoints : [],
    })
    setCreatingTreatment(false)
    if (createError) {
      setError('Die Behandlung konnte nicht gespeichert werden.')
      return
    }
    const number = (data as { treatment_number?: string } | null)?.treatment_number
    setNotice(number ? `${number} wurde gespeichert.` : 'Behandlung gespeichert.')
    resetTreatment()
    await loadPatient(selected.profile_id)
  }

  const markFollowupAttended = async (treatment: MedicalTreatment) => {
    if (!selected || !context?.can_edit_treatments) return
    setWorkingFollowup(treatment.id)
    setError('')
    setNotice('')
    const { error: followupError } = await supabase.rpc('medical_simple_mark_followup_attended', {
      target_treatment: treatment.id,
      expected_row_version: treatment.row_version,
    })
    setWorkingFollowup(null)
    if (followupError) {
      setError('Die Nachbehandlung konnte nicht bestätigt werden. Die Akte wird neu geladen.')
      await loadPatient(selected.profile_id)
      return
    }
    setNotice('Nachbehandlung als erledigt markiert.')
    await loadPatient(selected.profile_id)
  }

  const startNewTemplate = () => {
    setEditingTemplate(null)
    setTemplateName('')
    setTemplateText('')
  }

  const startEditTemplate = (template: TreatmentTemplate) => {
    setEditingTemplate(template)
    setTemplateName(template.name)
    setTemplateText(template.treatment_text)
  }

  const saveTemplate = async () => {
    if (!context?.can_manage_templates) return
    if (templateName.trim().length < 2 || templateText.trim().length < 2) {
      setError('Vorlagenname und Behandlungstext müssen ausgefüllt sein.')
      return
    }
    setSavingTemplate(true)
    setError('')
    setNotice('')
    const { error: templateError } = await supabase.rpc('medical_simple_save_template', {
      target_template: editingTemplate?.id ?? null,
      template_name: templateName.trim(),
      template_text: templateText.trim(),
      expected_row_version: editingTemplate?.row_version ?? null,
    })
    setSavingTemplate(false)
    if (templateError) {
      setError('Die Vorlage konnte nicht gespeichert werden.')
      return
    }
    setNotice(editingTemplate ? 'Vorlage aktualisiert.' : 'Vorlage angelegt.')
    startNewTemplate()
    await loadTemplates()
  }

  const pendingFollowups = selected?.treatments.filter((item) => item.followup_required && !item.followup_attended_at) ?? []

  return (
    <div className="page-content nexus-medical-workspace medical-simple-workspace">
      <section className="medical-hero medical-simple-hero">
        <div className="medical-hero-icon"><HeartPulse size={30} /></div>
        <div>
          <span className="eyebrow">LSMC · INTERN</span>
          <h2>Medical</h2>
          <p>Eine Krankenakte pro Patient. Stammdaten, Behandlung eintragen, Nachbehandlung abhaken.</p>
        </div>
        <div className="medical-simple-hero-actions">
          <span className="medical-live-pill"><ShieldCheck size={14} /> Rechtebasiert</span>
          {context?.can_manage_templates ? (
            <button className="medical-simple-secondary" onClick={() => setShowTemplates((value) => !value)}>
              <Settings2 size={14} /> Vorlagen
            </button>
          ) : null}
        </div>
      </section>

      {error ? <div className="medical-message is-error"><AlertTriangle size={15} />{error}</div> : null}
      {notice ? <div className="medical-message is-success"><Check size={15} />{notice}</div> : null}

      {contextLoading ? (
        <div className="medical-empty">Medical-Berechtigungen werden geladen …</div>
      ) : !context?.can_view_records ? (
        <div className="medical-permission-block">
          <LockKeyhole size={28} />
          <div><strong>Kein Zugriff auf Krankenakten</strong><span>Deine Rolle darf derzeit keine Krankenakten lesen.</span></div>
        </div>
      ) : (
        <>
          {showTemplates && context.can_manage_templates ? (
            <section className="medical-simple-template-panel">
              <div className="medical-simple-section-head">
                <div><span className="eyebrow">VORLAGEN</span><h3>Behandlungsvorlagen</h3></div>
                <button className="medical-simple-secondary" onClick={startNewTemplate}><Plus size={14} /> Neue Vorlage</button>
              </div>
              <div className="medical-simple-template-grid">
                <div className="medical-simple-template-list">
                  {templates.map((template) => (
                    <button key={template.id} onClick={() => startEditTemplate(template)}>
                      <span><strong>{template.name}</strong><small>{template.treatment_text}</small></span>
                      <Pencil size={14} />
                    </button>
                  ))}
                </div>
                <div className="medical-simple-template-form">
                  <label><span>Name</span><input value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="z. B. Platzwunde" /></label>
                  <label><span>Text der Vorlage</span><textarea value={templateText} onChange={(event) => setTemplateText(event.target.value)} placeholder="Was wird bei dieser Behandlung normalerweise gemacht?" /></label>
                  <button onClick={() => void saveTemplate()} disabled={savingTemplate}><Save size={14} /> {savingTemplate ? 'Speichert …' : editingTemplate ? 'Vorlage speichern' : 'Vorlage anlegen'}</button>
                </div>
              </div>
            </section>
          ) : null}

          <section className="medical-search-card">
            <div className="medical-section-heading">
              <div><span className="eyebrow">PATIENTENSUCHE</span><h3>Patient finden</h3><p>Suche nach Name, Nexus-ID oder Geburtsdatum.</p></div>
              <button className="medical-icon-button" onClick={() => { setQuery(''); setResults([]); setSelected(null); setError(''); setNotice('') }}><RefreshCw size={15} /> Zurücksetzen</button>
            </div>
            <div className="medical-search-row">
              <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void searchPatients() }} placeholder="Name oder Nexus-ID" /></label>
              <button onClick={() => void searchPatients()} disabled={searching}>{searching ? 'Suche …' : 'Suchen'}</button>
            </div>
            {results.length > 0 ? (
              <div className="medical-search-results">
                {results.map((patient) => (
                  <button key={patient.profile_id} onClick={() => void loadPatient(patient.profile_id)}>
                    <span className="medical-avatar"><UserRound size={18} /></span>
                    <span className="medical-result-main"><strong>{patient.display_name}</strong><small>{patient.nexus_id ?? 'Keine Nexus-ID'} · geb. {formatDate(patient.date_of_birth)}</small></span>
                    <span className="medical-record-number">{patient.record_number ?? 'Krankenakte'}</span>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          {loadingPatient ? <div className="medical-empty">Krankenakte wird geladen …</div> : null}

          {selected && !loadingPatient ? (
            <section className="medical-simple-record">
              <div className="medical-patient-header">
                <div className="medical-patient-identity">
                  <span className="medical-patient-avatar">{selected.display_name.slice(0, 2).toUpperCase()}</span>
                  <div><span className="eyebrow">KRANKENAKTE · {selected.record.record_number}</span><h3>{selected.display_name}</h3><p>{selected.nexus_id ?? 'Keine Nexus-ID'} · geboren {formatDate(selected.date_of_birth)}{selected.phone ? ` · ${selected.phone}` : ''}</p></div>
                </div>
              </div>

              <div className="medical-simple-main-grid">
                <article className="medical-simple-card">
                  <div className="medical-simple-section-head"><div><span className="eyebrow">STAMMDATEN</span><h3>Medizinische Stammdaten</h3></div></div>
                  <div className="medical-simple-fields">
                    <label className="compact"><span>Blutgruppe</span><select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)} disabled={!context.can_edit_records}>{bloodGroups.map((group) => <option key={group || 'empty'} value={group}>{group || 'Nicht eingetragen'}</option>)}</select></label>
                    <label><span>Allergien</span><textarea value={allergies} onChange={(event) => setAllergies(event.target.value)} disabled={!context.can_edit_records} placeholder="z. B. Penicillin, Nüsse …" /></label>
                    <label><span>Notfallkontakte</span><textarea value={emergencyContacts} onChange={(event) => setEmergencyContacts(event.target.value)} disabled={!context.can_edit_records} placeholder="Name, Beziehung, Telefonnummer" /></label>
                    <label><span>Wichtige medizinische Hinweise</span><textarea value={medicalNotes} onChange={(event) => setMedicalNotes(event.target.value)} disabled={!context.can_edit_records} placeholder="Nur das, was Medical wirklich wissen muss." /></label>
                  </div>
                  {context.can_edit_records ? <button className="medical-simple-primary" disabled={!recordDirty || savingRecord} onClick={() => void saveRecord()}><Save size={14} /> {savingRecord ? 'Speichert …' : 'Stammdaten speichern'}</button> : null}
                </article>

                <article className="medical-simple-card">
                  <div className="medical-simple-section-head"><div><span className="eyebrow">BEHANDLUNG</span><h3>Neue Behandlung eintragen</h3></div><ClipboardPlus size={20} /></div>
                  {context.can_create_treatments ? (
                    <div className="medical-simple-treatment-form">
                      <label><span>Vorlage</span><select value={templateId} onChange={(event) => chooseTemplate(event.target.value)}><option value="">Ohne Vorlage</option>{templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}</select></label>
                      <label><span>Was wurde gemacht?</span><textarea value={treatmentText} onChange={(event) => setTreatmentText(event.target.value)} placeholder="Kurz eintragen, was beim Patienten gemacht wurde." /></label>
                      <label className="medical-simple-check"><input type="checkbox" checked={followupRequired} onChange={(event) => setFollowupRequired(event.target.checked)} /><span>Nachbehandlung erforderlich</span></label>
                      {followupRequired ? (
                        <div className="medical-simple-followup-form">
                          <div className="medical-simple-mode-row">
                            <label className="medical-simple-radio"><input type="radio" checked={followupMode === 'exact'} onChange={() => setFollowupMode('exact')} /><span>Am Datum</span></label>
                            <label className="medical-simple-radio"><input type="radio" checked={followupMode === 'range'} onChange={() => setFollowupMode('range')} /><span>Zwischen zwei Daten</span></label>
                          </div>
                          <div className="medical-simple-date-row">
                            <label><span>{followupMode === 'exact' ? 'Am' : 'Von'}</span><input type="date" value={followupFrom} onChange={(event) => setFollowupFrom(event.target.value)} /></label>
                            {followupMode === 'range' ? <label><span>Bis</span><input type="date" value={followupTo} onChange={(event) => setFollowupTo(event.target.value)} /></label> : null}
                          </div>
                          <label><span>Was muss kontrolliert werden?</span><textarea value={followupChecks} onChange={(event) => setFollowupChecks(event.target.value)} placeholder={'Eine Zeile pro Punkt, z. B.\nWundheilung\nSchwellung\nVerband'} /></label>
                        </div>
                      ) : null}
                      <button className="medical-simple-primary" onClick={() => void createTreatment()} disabled={creatingTreatment}><Save size={14} /> {creatingTreatment ? 'Speichert …' : 'Behandlung speichern'}</button>
                    </div>
                  ) : <div className="medical-empty compact">Deine Rolle darf keine Behandlungen anlegen.</div>}
                </article>
              </div>

              {pendingFollowups.length > 0 ? (
                <section className="medical-simple-followups">
                  <div className="medical-simple-section-head"><div><span className="eyebrow">NACHBEHANDLUNG</span><h3>Offene Nachbehandlungen</h3></div><CalendarDays size={20} /></div>
                  <div className="medical-simple-followup-list">
                    {pendingFollowups.map((treatment) => (
                      <article key={treatment.id}>
                        <div className="medical-simple-followup-top"><div><strong>{followupLabel(treatment)}</strong><small>{treatment.treatment_number}</small></div>{context.can_edit_treatments ? <button onClick={() => void markFollowupAttended(treatment)} disabled={workingFollowup === treatment.id}><Check size={14} /> {workingFollowup === treatment.id ? 'Speichert …' : 'Patient war da'}</button> : null}</div>
                        <ul>{treatment.followup_checkpoints.map((point) => <li key={point}>{point}</li>)}</ul>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="medical-simple-history">
                <div className="medical-simple-section-head"><div><span className="eyebrow">VERLAUF</span><h3>Behandlungen</h3></div></div>
                {selected.treatments.length === 0 ? <div className="medical-empty compact">Noch keine Behandlung eingetragen.</div> : (
                  <div className="medical-simple-history-list">
                    {selected.treatments.map((treatment) => (
                      <article key={treatment.id}>
                        <div className="medical-simple-history-head"><div><strong>{treatment.treatment_number}</strong><small>{dateTimeFormatter.format(new Date(treatment.created_at))} · {treatment.treated_by_name ?? 'Medical'}</small></div>{treatment.template_name ? <span>{treatment.template_name}</span> : null}</div>
                        <p>{treatment.performed_text}</p>
                        {treatment.followup_required ? (
                          <div className={`medical-simple-followup-status ${treatment.followup_attended_at ? 'done' : 'open'}`}>
                            <CalendarDays size={14} />
                            <span>{treatment.followup_attended_at ? `Nachbehandlung erledigt am ${dateTimeFormatter.format(new Date(treatment.followup_attended_at))}` : `Nachbehandlung vorgesehen: ${followupLabel(treatment)}`}</span>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
