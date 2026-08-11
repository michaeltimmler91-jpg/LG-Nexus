import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  BookOpen,
  CalendarClock,
  Check,
  ChevronRight,
  ClipboardPlus,
  HeartPulse,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type MedicalTab = 'patients' | 'treatments' | 'followups' | 'knowledge'

type MedicalContext = {
  can_open: boolean
  can_view_records: boolean
  can_edit_records: boolean
  can_create_treatments: boolean
  can_edit_treatments: boolean
  can_manage_templates: boolean
  can_view_knowledge: boolean
  can_manage_knowledge: boolean
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

type FollowupItem = {
  treatment_id: string
  treatment_number: string
  patient_id: string
  patient_name: string
  nexus_id: string | null
  record_number: string
  performed_text: string
  followup_mode: 'exact' | 'range' | null
  followup_from: string | null
  followup_to: string | null
  followup_checkpoints: string[]
  treated_by_name: string | null
  created_at: string
  row_version: number
}

type KnowledgeArticle = {
  id: string
  title: string
  category: string | null
  body: string
  updated_by_name: string | null
  updated_at: string
  row_version: number
}

const bloodGroups = ['', '0+', '0-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
const dateFormatter = new Intl.DateTimeFormat('de-DE')
const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
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

function followupLabel(mode: 'exact' | 'range' | null, from: string | null, to: string | null) {
  if (!from) return 'Termin offen'
  if (mode === 'range' && to && to !== from) return `${formatDate(from)} – ${formatDate(to)}`
  return formatDate(from)
}

export default function MedicalWorkspaceMount() {
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
  return createPortal(<MedicalWorkspace />, target)
}

function MedicalWorkspace() {
  const [context, setContext] = useState<MedicalContext | null>(null)
  const [tab, setTab] = useState<MedicalTab>('patients')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [patientQuery, setPatientQuery] = useState('')
  const [patientResults, setPatientResults] = useState<PatientSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<PatientOverview | null>(null)
  const [loadingPatient, setLoadingPatient] = useState(false)

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

  const [followups, setFollowups] = useState<FollowupItem[]>([])
  const [followupQuery, setFollowupQuery] = useState('')
  const [loadingFollowups, setLoadingFollowups] = useState(false)
  const [workingFollowup, setWorkingFollowup] = useState<string | null>(null)

  const [knowledge, setKnowledge] = useState<KnowledgeArticle[]>([])
  const [knowledgeQuery, setKnowledgeQuery] = useState('')
  const [loadingKnowledge, setLoadingKnowledge] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeArticle | null>(null)
  const [knowledgeTitle, setKnowledgeTitle] = useState('')
  const [knowledgeCategory, setKnowledgeCategory] = useState('')
  const [knowledgeBody, setKnowledgeBody] = useState('')
  const [savingKnowledge, setSavingKnowledge] = useState(false)

  const [editingTemplate, setEditingTemplate] = useState<TreatmentTemplate | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [templateBody, setTemplateBody] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)

  const applyPatient = useCallback((overview: PatientOverview) => {
    const normalized: PatientOverview = {
      ...overview,
      treatments: Array.isArray(overview.treatments)
        ? overview.treatments.map((item) => ({ ...item, followup_checkpoints: Array.isArray(item.followup_checkpoints) ? item.followup_checkpoints : [] }))
        : [],
    }
    setSelected(normalized)
    setBloodGroup(normalized.record.blood_group ?? '')
    setAllergies(normalized.record.allergies ?? '')
    setEmergencyContacts(normalized.record.emergency_contacts ?? '')
    setMedicalNotes(normalized.record.medical_notes ?? '')
  }, [])

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
  }, [applyPatient])

  const loadTemplates = useCallback(async () => {
    const { data } = await supabase.rpc('medical_simple_list_templates')
    setTemplates(Array.isArray(data) ? data as TreatmentTemplate[] : [])
  }, [])

  const loadFollowups = useCallback(async (query = '') => {
    setLoadingFollowups(true)
    const { data, error: followupError } = await supabase.rpc('medical_list_open_followups', { search_text: query.trim() || null })
    setLoadingFollowups(false)
    if (followupError) {
      setError('Die offenen Nachbehandlungen konnten nicht geladen werden.')
      return
    }
    setFollowups(Array.isArray(data) ? data as FollowupItem[] : [])
  }, [])

  const loadKnowledge = useCallback(async (query = '') => {
    setLoadingKnowledge(true)
    const { data, error: knowledgeError } = await supabase.rpc('medical_list_knowledge', { search_text: query.trim() || null })
    setLoadingKnowledge(false)
    if (knowledgeError) {
      setError('Die Wissenssammlung konnte nicht geladen werden.')
      return
    }
    setKnowledge(Array.isArray(data) ? data as KnowledgeArticle[] : [])
  }, [])

  useEffect(() => {
    void (async () => {
      const { data, error: contextError } = await supabase.rpc('medical_workspace_get_context')
      if (contextError || !data) {
        setError('Die Medical-Berechtigungen konnten nicht geladen werden.')
        return
      }
      const next = data as MedicalContext
      setContext(next)
      if (next.can_create_treatments || next.can_manage_templates) void loadTemplates()
      if (next.can_view_records) void loadFollowups('')
      if (next.can_view_knowledge) void loadKnowledge('')
    })()
  }, [loadFollowups, loadKnowledge, loadTemplates])

  const searchPatients = async () => {
    const needle = patientQuery.trim()
    if (needle.length < 2) {
      setError('Bitte gib mindestens zwei Zeichen ein.')
      setPatientResults([])
      return
    }
    setSearching(true)
    setError('')
    setNotice('')
    const { data, error: searchError } = await supabase.rpc('medical_search_patients', { search_text: needle })
    setSearching(false)
    if (searchError) {
      setError('Die Patientensuche konnte nicht ausgeführt werden.')
      setPatientResults([])
      return
    }
    setPatientResults(Array.isArray(data) ? data as PatientSearchResult[] : [])
  }

  const choosePatient = async (profileId: string, destination: MedicalTab = tab) => {
    await loadPatient(profileId)
    setPatientResults([])
    setPatientQuery('')
    setTab(destination)
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
    const template = templates.find((item) => item.id === id)
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
    const cleanText = treatmentText.trim()
    if (cleanText.length < 2) return setError('Bitte trage ein, was gemacht wurde.')
    const checkpoints = parseCheckpoints(followupChecks)
    if (followupRequired && (!followupFrom || (followupMode === 'range' && !followupTo) || checkpoints.length === 0)) {
      return setError('Bitte Termin und mindestens einen Kontrollpunkt für die Nachbehandlung eintragen.')
    }
    setCreatingTreatment(true)
    setError('')
    setNotice('')
    const { data, error: createError } = await supabase.rpc('medical_simple_create_treatment', {
      target_profile: selected.profile_id,
      target_template: templateId || null,
      treatment_text: cleanText,
      needs_followup: followupRequired,
      next_followup_mode: followupRequired ? followupMode : null,
      next_followup_from: followupRequired ? followupFrom : null,
      next_followup_to: followupRequired ? (followupMode === 'range' ? followupTo : followupFrom) : null,
      next_followup_checkpoints: followupRequired ? checkpoints : [],
    })
    setCreatingTreatment(false)
    if (createError) return setError('Die Behandlung konnte nicht gespeichert werden.')
    const number = (data as { treatment_number?: string } | null)?.treatment_number
    setNotice(number ? `${number} wurde gespeichert.` : 'Behandlung gespeichert.')
    resetTreatment()
    await Promise.all([loadPatient(selected.profile_id), loadFollowups('')])
  }

  const markFollowupDone = async (item: FollowupItem) => {
    if (!context?.can_edit_treatments) return
    setWorkingFollowup(item.treatment_id)
    setError('')
    setNotice('')
    const { error: followupError } = await supabase.rpc('medical_simple_mark_followup_attended', {
      target_treatment: item.treatment_id,
      expected_row_version: item.row_version,
    })
    setWorkingFollowup(null)
    if (followupError) return setError('Die Nachbehandlung konnte nicht abgeschlossen werden. Bitte neu laden.')
    setNotice('Nachbehandlung als erledigt markiert.')
    await loadFollowups(followupQuery)
    if (selected?.profile_id === item.patient_id) await loadPatient(item.patient_id)
  }

  const openPatientFromFollowup = async (profileId: string) => {
    await choosePatient(profileId, 'patients')
  }

  const startNewTemplate = () => {
    setEditingTemplate(null)
    setTemplateName('')
    setTemplateBody('')
  }

  const startEditTemplate = (template: TreatmentTemplate) => {
    setEditingTemplate(template)
    setTemplateName(template.name)
    setTemplateBody(template.treatment_text)
  }

  const saveTemplate = async () => {
    if (!context?.can_manage_templates || templateName.trim().length < 2 || templateBody.trim().length < 2) return
    setSavingTemplate(true)
    const { error: templateError } = await supabase.rpc('medical_simple_save_template', {
      target_template: editingTemplate?.id ?? null,
      template_name: templateName.trim(),
      template_text: templateBody.trim(),
      expected_row_version: editingTemplate?.row_version ?? null,
    })
    setSavingTemplate(false)
    if (templateError) return setError('Die Behandlungsvorlage konnte nicht gespeichert werden.')
    setNotice(editingTemplate ? 'Behandlungsvorlage aktualisiert.' : 'Behandlungsvorlage angelegt.')
    startNewTemplate()
    await loadTemplates()
  }

  const startNewKnowledge = () => {
    setEditingKnowledge(null)
    setKnowledgeTitle('')
    setKnowledgeCategory('')
    setKnowledgeBody('')
  }

  const startEditKnowledge = (article: KnowledgeArticle) => {
    setEditingKnowledge(article)
    setKnowledgeTitle(article.title)
    setKnowledgeCategory(article.category ?? '')
    setKnowledgeBody(article.body)
  }

  const saveKnowledge = async () => {
    if (!context?.can_manage_knowledge || knowledgeTitle.trim().length < 2 || knowledgeBody.trim().length < 2) return
    setSavingKnowledge(true)
    const { error: knowledgeError } = await supabase.rpc('medical_save_knowledge', {
      target_article: editingKnowledge?.id ?? null,
      article_title: knowledgeTitle.trim(),
      article_category: knowledgeCategory.trim() || null,
      article_body: knowledgeBody.trim(),
      expected_row_version: editingKnowledge?.row_version ?? null,
    })
    setSavingKnowledge(false)
    if (knowledgeError) return setError('Der Wissenseintrag konnte nicht gespeichert werden.')
    setNotice(editingKnowledge ? 'Wissenseintrag aktualisiert.' : 'Wissenseintrag angelegt.')
    startNewKnowledge()
    await loadKnowledge(knowledgeQuery)
  }

  if (!context) return <div className="page-content medical-workspace-empty">Medical wird geladen …</div>
  if (!context.can_open) return <div className="page-content medical-workspace-empty">Kein Zugriff auf Medical.</div>

  const tabs = [
    context.can_view_records ? { key: 'patients' as const, label: 'Patienten', icon: <UserRound size={16} /> } : null,
    context.can_create_treatments ? { key: 'treatments' as const, label: 'Behandlungen', icon: <Stethoscope size={16} /> } : null,
    context.can_view_records ? { key: 'followups' as const, label: 'Nachbehandlungen', icon: <CalendarClock size={16} />, badge: followups.length } : null,
    (context.can_view_knowledge || context.can_create_treatments || context.can_manage_templates) ? { key: 'knowledge' as const, label: 'Wissen', icon: <BookOpen size={16} /> } : null,
  ].filter(Boolean) as Array<{ key: MedicalTab; label: string; icon: JSX.Element; badge?: number }>

  return (
    <div className="page-content medical-workspace">
      <section className="medical-workspace-hero">
        <div className="medical-workspace-hero-icon"><HeartPulse size={29} /></div>
        <div>
          <span className="eyebrow">LSMC · INTERN</span>
          <h2>Medical</h2>
          <p>Patienten versorgen, Behandlungen dokumentieren und offene Nachbehandlungen im Blick behalten.</p>
        </div>
        <div className="medical-workspace-count"><strong>{followups.length}</strong><span>offene Nachbehandlungen</span></div>
      </section>

      <nav className="medical-workspace-nav" aria-label="Medical Bereiche">
        {tabs.map((item) => (
          <button key={item.key} type="button" className={tab === item.key ? 'is-active' : ''} onClick={() => { setTab(item.key); setError(''); setNotice('') }}>
            {item.icon}<span>{item.label}</span>{typeof item.badge === 'number' && item.badge > 0 ? <b>{item.badge}</b> : null}
          </button>
        ))}
      </nav>

      {error ? <div className="medical-workspace-message is-error"><AlertTriangle size={15} />{error}</div> : null}
      {notice ? <div className="medical-workspace-message is-success"><Check size={15} />{notice}</div> : null}

      {tab === 'patients' ? (
        <PatientsTab
          context={context}
          query={patientQuery}
          setQuery={setPatientQuery}
          results={patientResults}
          searching={searching}
          search={searchPatients}
          choose={(id) => choosePatient(id, 'patients')}
          selected={selected}
          loadingPatient={loadingPatient}
          bloodGroup={bloodGroup}
          setBloodGroup={setBloodGroup}
          allergies={allergies}
          setAllergies={setAllergies}
          emergencyContacts={emergencyContacts}
          setEmergencyContacts={setEmergencyContacts}
          medicalNotes={medicalNotes}
          setMedicalNotes={setMedicalNotes}
          recordDirty={recordDirty}
          savingRecord={savingRecord}
          saveRecord={saveRecord}
          clear={() => { setSelected(null); setPatientResults([]); setPatientQuery('') }}
          goTreatment={() => setTab('treatments')}
        />
      ) : null}

      {tab === 'treatments' ? (
        <TreatmentsTab
          context={context}
          selected={selected}
          query={patientQuery}
          setQuery={setPatientQuery}
          results={patientResults}
          searching={searching}
          search={searchPatients}
          choose={(id) => choosePatient(id, 'treatments')}
          clearPatient={() => { setSelected(null); setPatientResults([]); setPatientQuery('') }}
          templates={templates}
          templateId={templateId}
          chooseTemplate={chooseTemplate}
          treatmentText={treatmentText}
          setTreatmentText={setTreatmentText}
          followupRequired={followupRequired}
          setFollowupRequired={setFollowupRequired}
          followupMode={followupMode}
          setFollowupMode={setFollowupMode}
          followupFrom={followupFrom}
          setFollowupFrom={setFollowupFrom}
          followupTo={followupTo}
          setFollowupTo={setFollowupTo}
          followupChecks={followupChecks}
          setFollowupChecks={setFollowupChecks}
          creatingTreatment={creatingTreatment}
          createTreatment={createTreatment}
        />
      ) : null}

      {tab === 'followups' ? (
        <FollowupsTab
          items={followups}
          loading={loadingFollowups}
          query={followupQuery}
          setQuery={setFollowupQuery}
          search={() => loadFollowups(followupQuery)}
          reset={() => { setFollowupQuery(''); void loadFollowups('') }}
          canComplete={context.can_edit_treatments}
          workingId={workingFollowup}
          complete={markFollowupDone}
          openPatient={openPatientFromFollowup}
        />
      ) : null}

      {tab === 'knowledge' ? (
        <KnowledgeTab
          context={context}
          templates={templates}
          editingTemplate={editingTemplate}
          startNewTemplate={startNewTemplate}
          startEditTemplate={startEditTemplate}
          templateName={templateName}
          setTemplateName={setTemplateName}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          savingTemplate={savingTemplate}
          saveTemplate={saveTemplate}
          knowledge={knowledge}
          loadingKnowledge={loadingKnowledge}
          knowledgeQuery={knowledgeQuery}
          setKnowledgeQuery={setKnowledgeQuery}
          searchKnowledge={() => loadKnowledge(knowledgeQuery)}
          resetKnowledge={() => { setKnowledgeQuery(''); void loadKnowledge('') }}
          editingKnowledge={editingKnowledge}
          startNewKnowledge={startNewKnowledge}
          startEditKnowledge={startEditKnowledge}
          knowledgeTitle={knowledgeTitle}
          setKnowledgeTitle={setKnowledgeTitle}
          knowledgeCategory={knowledgeCategory}
          setKnowledgeCategory={setKnowledgeCategory}
          knowledgeBody={knowledgeBody}
          setKnowledgeBody={setKnowledgeBody}
          savingKnowledge={savingKnowledge}
          saveKnowledge={saveKnowledge}
        />
      ) : null}
    </div>
  )
}

function PatientSearch({ query, setQuery, results, searching, search, choose }: {
  query: string
  setQuery: (value: string) => void
  results: PatientSearchResult[]
  searching: boolean
  search: () => void
  choose: (id: string) => void
}) {
  return (
    <section className="medical-workspace-search-card">
      <div className="medical-workspace-section-head"><div><span className="eyebrow">PATIENTENSUCHE</span><h3>Patient finden</h3></div></div>
      <div className="medical-workspace-search-row">
        <label><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search() }} placeholder="Name oder Nexus-ID" /></label>
        <button type="button" onClick={search} disabled={searching}>{searching ? 'Suche …' : 'Suchen'}</button>
      </div>
      {results.length > 0 ? <div className="medical-workspace-results">{results.map((patient) => (
        <button key={patient.profile_id} type="button" onClick={() => choose(patient.profile_id)}>
          <span className="medical-workspace-avatar"><UserRound size={18} /></span>
          <span><strong>{patient.display_name}</strong><small>{patient.nexus_id ?? 'Keine Nexus-ID'} · geb. {formatDate(patient.date_of_birth)}</small></span>
          <span className="medical-workspace-record-number">{patient.record_number ?? 'Krankenakte'}</span>
          <ChevronRight size={16} />
        </button>
      ))}</div> : null}
    </section>
  )
}

function PatientIdentity({ patient, onClear }: { patient: PatientOverview; onClear?: () => void }) {
  return (
    <div className="medical-workspace-patient-head">
      <div className="medical-workspace-patient-main">
        <span className="medical-workspace-patient-avatar">{patient.display_name.slice(0, 2).toUpperCase()}</span>
        <div><span className="eyebrow">KRANKENAKTE · {patient.record.record_number}</span><h3>{patient.display_name}</h3><p>{patient.nexus_id ?? 'Keine Nexus-ID'} · geboren {formatDate(patient.date_of_birth)}{patient.phone ? ` · ${patient.phone}` : ''}</p></div>
      </div>
      {onClear ? <button type="button" className="medical-workspace-secondary" onClick={onClear}><RefreshCw size={14} /> Anderen Patient wählen</button> : null}
    </div>
  )
}

function PatientsTab(props: {
  context: MedicalContext
  query: string
  setQuery: (value: string) => void
  results: PatientSearchResult[]
  searching: boolean
  search: () => void
  choose: (id: string) => void
  selected: PatientOverview | null
  loadingPatient: boolean
  bloodGroup: string
  setBloodGroup: (value: string) => void
  allergies: string
  setAllergies: (value: string) => void
  emergencyContacts: string
  setEmergencyContacts: (value: string) => void
  medicalNotes: string
  setMedicalNotes: (value: string) => void
  recordDirty: boolean
  savingRecord: boolean
  saveRecord: () => void
  clear: () => void
  goTreatment: () => void
}) {
  const p = props
  return (
    <div className="medical-workspace-tab">
      <PatientSearch query={p.query} setQuery={p.setQuery} results={p.results} searching={p.searching} search={p.search} choose={p.choose} />
      {p.loadingPatient ? <div className="medical-workspace-empty">Krankenakte wird geladen …</div> : null}
      {p.selected && !p.loadingPatient ? (
        <section className="medical-workspace-patient-panel">
          <PatientIdentity patient={p.selected} onClear={p.clear} />
          <div className="medical-workspace-two-col">
            <article className="medical-workspace-card">
              <div className="medical-workspace-section-head"><div><span className="eyebrow">STAMMDATEN</span><h3>Medizinische Hinweise</h3></div></div>
              <div className="medical-workspace-fields">
                <label className="compact"><span>Blutgruppe</span><select value={p.bloodGroup} onChange={(e) => p.setBloodGroup(e.target.value)} disabled={!p.context.can_edit_records}>{bloodGroups.map((group) => <option key={group || 'empty'} value={group}>{group || 'Nicht eingetragen'}</option>)}</select></label>
                <label><span>Allergien</span><textarea value={p.allergies} onChange={(e) => p.setAllergies(e.target.value)} disabled={!p.context.can_edit_records} placeholder="z. B. Penicillin, Nüsse …" /></label>
                <label><span>Notfallkontakte</span><textarea value={p.emergencyContacts} onChange={(e) => p.setEmergencyContacts(e.target.value)} disabled={!p.context.can_edit_records} placeholder="Name, Beziehung, Telefonnummer" /></label>
                <label><span>Wichtige medizinische Hinweise</span><textarea value={p.medicalNotes} onChange={(e) => p.setMedicalNotes(e.target.value)} disabled={!p.context.can_edit_records} placeholder="Nur das, was Medical wirklich wissen muss." /></label>
              </div>
              {p.context.can_edit_records ? <button type="button" className="medical-workspace-primary" disabled={!p.recordDirty || p.savingRecord} onClick={p.saveRecord}><Save size={14} /> {p.savingRecord ? 'Speichert …' : 'Stammdaten speichern'}</button> : null}
            </article>

            <article className="medical-workspace-card">
              <div className="medical-workspace-section-head"><div><span className="eyebrow">BEHANDLUNGEN</span><h3>Bisheriger Verlauf</h3></div>{p.context.can_create_treatments ? <button className="medical-workspace-secondary" type="button" onClick={p.goTreatment}><Plus size={14} /> Behandlung</button> : null}</div>
              <div className="medical-simple-history-list medical-workspace-history">
                {p.selected.treatments.length === 0 ? <p className="medical-workspace-muted">Noch keine Behandlungen eingetragen.</p> : p.selected.treatments.map((treatment) => (
                  <article key={treatment.id}>
                    <div className="medical-simple-history-head">
                      <strong>{treatment.treatment_number}</strong>
                      <small>{dateTimeFormatter.format(new Date(treatment.created_at))}{treatment.treated_by_name ? ` · ${treatment.treated_by_name}` : ''}</small>
                    </div>
                    <p>{treatment.performed_text}</p>
                    {treatment.followup_required ? (
                      <div className={`medical-simple-followup-status ${treatment.followup_attended_at ? 'done' : ''}`}>
                        <CalendarClock size={14} />
                        <span>{treatment.followup_attended_at ? 'Nachbehandlung erledigt' : `Nachbehandlung: ${followupLabel(treatment.followup_mode, treatment.followup_from, treatment.followup_to)}`}</span>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function TreatmentsTab(props: {
  context: MedicalContext
  selected: PatientOverview | null
  query: string
  setQuery: (value: string) => void
  results: PatientSearchResult[]
  searching: boolean
  search: () => void
  choose: (id: string) => void
  clearPatient: () => void
  templates: TreatmentTemplate[]
  templateId: string
  chooseTemplate: (id: string) => void
  treatmentText: string
  setTreatmentText: (value: string) => void
  followupRequired: boolean
  setFollowupRequired: (value: boolean) => void
  followupMode: 'exact' | 'range'
  setFollowupMode: (value: 'exact' | 'range') => void
  followupFrom: string
  setFollowupFrom: (value: string) => void
  followupTo: string
  setFollowupTo: (value: string) => void
  followupChecks: string
  setFollowupChecks: (value: string) => void
  creatingTreatment: boolean
  createTreatment: () => void
}) {
  const p = props
  return (
    <div className="medical-workspace-tab">
      {!p.selected ? <PatientSearch query={p.query} setQuery={p.setQuery} results={p.results} searching={p.searching} search={p.search} choose={p.choose} /> : (
        <section className="medical-workspace-treatment-panel">
          <PatientIdentity patient={p.selected} onClear={p.clearPatient} />
          <article className="medical-workspace-card medical-workspace-treatment-card">
            <div className="medical-workspace-section-head"><div><span className="eyebrow">NEUE BEHANDLUNG</span><h3>Behandlung dokumentieren</h3></div><ClipboardPlus size={21} /></div>
            <div className="medical-workspace-fields">
              <label><span>Vorlage</span><select value={p.templateId} onChange={(e) => p.chooseTemplate(e.target.value)}><option value="">Ohne Vorlage</option>{p.templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select></label>
              <label><span>Was wurde gemacht?</span><textarea className="large" value={p.treatmentText} onChange={(e) => p.setTreatmentText(e.target.value)} placeholder="Kurz eintragen, was beim Patienten gemacht wurde." /></label>
              <label className="medical-workspace-check"><input type="checkbox" checked={p.followupRequired} onChange={(e) => p.setFollowupRequired(e.target.checked)} /><span>Nachbehandlung erforderlich</span></label>
              {p.followupRequired ? (
                <div className="medical-workspace-followup-form">
                  <div className="medical-workspace-radio-row">
                    <label><input type="radio" checked={p.followupMode === 'exact'} onChange={() => p.setFollowupMode('exact')} /><span>Am Datum</span></label>
                    <label><input type="radio" checked={p.followupMode === 'range'} onChange={() => p.setFollowupMode('range')} /><span>Zwischen zwei Daten</span></label>
                  </div>
                  <div className="medical-workspace-date-row">
                    <label><span>Von / Datum</span><input type="date" value={p.followupFrom} onChange={(e) => p.setFollowupFrom(e.target.value)} /></label>
                    {p.followupMode === 'range' ? <label><span>Bis</span><input type="date" value={p.followupTo} onChange={(e) => p.setFollowupTo(e.target.value)} /></label> : null}
                  </div>
                  <label><span>Was soll kontrolliert werden?</span><textarea value={p.followupChecks} onChange={(e) => p.setFollowupChecks(e.target.value)} placeholder={'- Wundkontrolle\n- Verband wechseln'} /></label>
                </div>
              ) : null}
              <button className="medical-workspace-primary" type="button" onClick={p.createTreatment} disabled={p.creatingTreatment || p.treatmentText.trim().length < 2}><Save size={14} /> {p.creatingTreatment ? 'Speichert …' : 'Behandlung speichern'}</button>
            </div>
          </article>
        </section>
      )}
    </div>
  )
}

function FollowupsTab(props: {
  items: FollowupItem[]
  loading: boolean
  query: string
  setQuery: (value: string) => void
  search: () => void
  reset: () => void
  canComplete: boolean
  workingId: string | null
  complete: (item: FollowupItem) => void
  openPatient: (profileId: string) => void
}) {
  const p = props
  return (
    <div className="medical-workspace-tab">
      <section className="medical-workspace-search-card">
        <div className="medical-workspace-section-head"><div><span className="eyebrow">NACHBEHANDLUNGEN</span><h3>{p.items.length} offen</h3></div></div>
        <div className="medical-workspace-search-row">
          <label><Search size={17} /><input value={p.query} onChange={(e) => p.setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') p.search() }} placeholder="Patient, Nexus-ID oder Behandlungsnummer" /></label>
          <button type="button" onClick={p.search}>Suchen</button>
          <button type="button" className="secondary" onClick={p.reset}><RefreshCw size={14} /> Alle</button>
        </div>
      </section>
      <section className="medical-workspace-followup-list">
        {p.loading ? <div className="medical-workspace-empty">Nachbehandlungen werden geladen …</div> : p.items.length === 0 ? <div className="medical-workspace-empty"><Check size={22} /> Keine offenen Nachbehandlungen.</div> : p.items.map((item) => (
          <article key={item.treatment_id}>
            <div className="medical-workspace-followup-head">
              <div><span className="eyebrow">{item.treatment_number} · {item.record_number}</span><h3>{item.patient_name}</h3><p>{item.nexus_id ?? 'Keine Nexus-ID'} · {followupLabel(item.followup_mode, item.followup_from, item.followup_to)}</p></div>
              <CalendarClock size={22} />
            </div>
            <p className="medical-workspace-followup-treatment">{item.performed_text}</p>
            <div className="medical-workspace-checkpoints"><strong>Kontrollieren</strong>{item.followup_checkpoints.map((entry) => <span key={entry}><Check size={13} />{entry}</span>)}</div>
            <div className="medical-workspace-card-actions">
              <button type="button" className="medical-workspace-secondary" onClick={() => p.openPatient(item.patient_id)}><UserRound size={14} /> Krankenakte</button>
              {p.canComplete ? <button type="button" className="medical-workspace-primary" disabled={p.workingId === item.treatment_id} onClick={() => p.complete(item)}><Check size={14} /> {p.workingId === item.treatment_id ? 'Speichert …' : 'Erledigt'}</button> : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

function KnowledgeTab(props: {
  context: MedicalContext
  templates: TreatmentTemplate[]
  editingTemplate: TreatmentTemplate | null
  startNewTemplate: () => void
  startEditTemplate: (template: TreatmentTemplate) => void
  templateName: string
  setTemplateName: (value: string) => void
  templateBody: string
  setTemplateBody: (value: string) => void
  savingTemplate: boolean
  saveTemplate: () => void
  knowledge: KnowledgeArticle[]
  loadingKnowledge: boolean
  knowledgeQuery: string
  setKnowledgeQuery: (value: string) => void
  searchKnowledge: () => void
  resetKnowledge: () => void
  editingKnowledge: KnowledgeArticle | null
  startNewKnowledge: () => void
  startEditKnowledge: (article: KnowledgeArticle) => void
  knowledgeTitle: string
  setKnowledgeTitle: (value: string) => void
  knowledgeCategory: string
  setKnowledgeCategory: (value: string) => void
  knowledgeBody: string
  setKnowledgeBody: (value: string) => void
  savingKnowledge: boolean
  saveKnowledge: () => void
}) {
  const p = props
  return (
    <div className="medical-workspace-tab medical-workspace-knowledge-grid">
      <section className="medical-workspace-card">
        <div className="medical-workspace-section-head">
          <div><span className="eyebrow">BEHANDLUNGSVORLAGEN</span><h3>Schnelle Vorlagen</h3></div>
          {p.context.can_manage_templates ? <button type="button" className="medical-workspace-secondary" onClick={p.startNewTemplate}><Plus size={14} /> Neu</button> : null}
        </div>
        <div className="medical-workspace-knowledge-list">
          {p.templates.length === 0 ? <p className="medical-workspace-muted">Noch keine Behandlungsvorlagen.</p> : p.templates.map((template) => (
            <button key={template.id} type="button" onClick={() => { if (p.context.can_manage_templates) p.startEditTemplate(template) }}>
              <span><strong>{template.name}</strong><small>{template.treatment_text}</small></span>{p.context.can_manage_templates ? <Pencil size={14} /> : null}
            </button>
          ))}
        </div>
        {p.context.can_manage_templates ? (
          <div className="medical-workspace-editor">
            <label><span>Name</span><input value={p.templateName} onChange={(e) => p.setTemplateName(e.target.value)} placeholder="z. B. Platzwunde" /></label>
            <label><span>Behandlungstext</span><textarea value={p.templateBody} onChange={(e) => p.setTemplateBody(e.target.value)} placeholder="Was wird normalerweise gemacht?" /></label>
            <button className="medical-workspace-primary" type="button" onClick={p.saveTemplate} disabled={p.savingTemplate || p.templateName.trim().length < 2 || p.templateBody.trim().length < 2}><Save size={14} /> {p.savingTemplate ? 'Speichert …' : p.editingTemplate ? 'Vorlage speichern' : 'Vorlage anlegen'}</button>
          </div>
        ) : null}
      </section>

      {p.context.can_view_knowledge ? (
        <section className="medical-workspace-card">
          <div className="medical-workspace-section-head">
            <div><span className="eyebrow">WISSEN</span><h3>Interne Anleitungen</h3></div>
            {p.context.can_manage_knowledge ? <button type="button" className="medical-workspace-secondary" onClick={p.startNewKnowledge}><Plus size={14} /> Neu</button> : null}
          </div>
          <div className="medical-workspace-inline-search"><Search size={15} /><input value={p.knowledgeQuery} onChange={(e) => p.setKnowledgeQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') p.searchKnowledge() }} placeholder="Wissen durchsuchen" /><button type="button" onClick={p.searchKnowledge}>Suchen</button><button type="button" className="secondary" onClick={p.resetKnowledge}>Alle</button></div>
          <div className="medical-workspace-knowledge-list">
            {p.loadingKnowledge ? <p className="medical-workspace-muted">Lädt …</p> : p.knowledge.length === 0 ? <p className="medical-workspace-muted">Noch keine internen Anleitungen.</p> : p.knowledge.map((article) => (
              <button key={article.id} type="button" onClick={() => { if (p.context.can_manage_knowledge) p.startEditKnowledge(article) }}>
                <span><strong>{article.title}</strong><small>{article.category ? `${article.category} · ` : ''}{article.body}</small></span>{p.context.can_manage_knowledge ? <Pencil size={14} /> : null}
              </button>
            ))}
          </div>
          {p.context.can_manage_knowledge ? (
            <div className="medical-workspace-editor">
              <label><span>Titel</span><input value={p.knowledgeTitle} onChange={(e) => p.setKnowledgeTitle(e.target.value)} placeholder="z. B. Verbrennungen" /></label>
              <label><span>Kategorie</span><input value={p.knowledgeCategory} onChange={(e) => p.setKnowledgeCategory(e.target.value)} placeholder="z. B. Notfallmedizin" /></label>
              <label><span>Inhalt</span><textarea className="large" value={p.knowledgeBody} onChange={(e) => p.setKnowledgeBody(e.target.value)} placeholder="Kurze interne Anleitung …" /></label>
              <button className="medical-workspace-primary" type="button" onClick={p.saveKnowledge} disabled={p.savingKnowledge || p.knowledgeTitle.trim().length < 2 || p.knowledgeBody.trim().length < 2}><Save size={14} /> {p.savingKnowledge ? 'Speichert …' : p.editingKnowledge ? 'Eintrag speichern' : 'Eintrag anlegen'}</button>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
