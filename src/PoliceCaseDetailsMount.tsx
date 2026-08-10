import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Archive, ChevronRight, Plus, Search, Trash2, UserPlus, UserRound } from 'lucide-react'
import { supabase } from './lib/supabase'

type PoliceContext = { can_edit_cases: boolean; can_search_people: boolean }
type PersonResult = { profile_id: string; display_name: string; nexus_id: string | null; date_of_birth: string | null }
type CasePerson = { profile_id: string; display_name: string; nexus_id: string | null; person_role: 'accused' | 'victim' | 'witness' | 'other'; note: string | null }
type Evidence = { id: string; evidence_number: string; evidence_type: 'object' | 'photo' | 'document' | 'digital' | 'statement' | 'other'; title: string; description: string | null; reference_text: string | null; created_by_name: string | null; created_at: string }

type Target = { slot: HTMLDivElement; caseNumber: string; closed: boolean }

const roleLabels: Record<CasePerson['person_role'], string> = {
  accused: 'Beschuldigter', victim: 'Opfer', witness: 'Zeuge', other: 'Sonstige',
}

const evidenceLabels: Record<Evidence['evidence_type'], string> = {
  object: 'Gegenstand', photo: 'Foto', document: 'Dokument', digital: 'Digital', statement: 'Aussage', other: 'Sonstiges',
}

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

function findCaseNumber(detail: HTMLElement) {
  const value = detail.querySelector('.police-simple-section-head .eyebrow')?.textContent?.trim() ?? ''
  return /^PD-\d{6}$/.test(value) ? value : null
}

export default function PoliceCaseDetailsMount() {
  const [target, setTarget] = useState<Target | null>(null)

  useEffect(() => {
    const sync = () => {
      if (document.body.dataset.nexusPoliceWorkspace !== 'true') return setTarget(null)
      const detail = document.querySelector<HTMLElement>('.police-simple-case-detail')
      if (!detail) return setTarget(null)
      const caseNumber = findCaseNumber(detail)
      if (!caseNumber) return setTarget(null)

      let slot = detail.querySelector<HTMLDivElement>(':scope > .police-case-details-slot')
      if (!slot) {
        slot = document.createElement('div')
        slot.className = 'police-case-details-slot'
        const timelineSlot = detail.querySelector(':scope > .police-case-timeline-slot')
        if (timelineSlot) detail.insertBefore(slot, timelineSlot)
        else detail.appendChild(slot)
      }

      const status = detail.querySelector<HTMLElement>('.police-simple-status')
      const closed = Boolean(status?.classList.contains('is-completed') || status?.classList.contains('is-archived'))
      setTarget((current) => current?.slot === slot && current.caseNumber === caseNumber && current.closed === closed ? current : { slot, caseNumber, closed })
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-nexus-police-workspace'] })
    return () => observer.disconnect()
  }, [])

  if (!target) return null
  return createPortal(<CaseDetails key={target.caseNumber} caseNumber={target.caseNumber} closed={target.closed} />, target.slot)
}

function CaseDetails({ caseNumber, closed }: { caseNumber: string; closed: boolean }) {
  const [context, setContext] = useState<PoliceContext | null>(null)
  const [people, setPeople] = useState<CasePerson[]>([])
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PersonResult[]>([])
  const [selected, setSelected] = useState<PersonResult | null>(null)
  const [role, setRole] = useState<CasePerson['person_role']>('witness')
  const [personNote, setPersonNote] = useState('')
  const [evidenceType, setEvidenceType] = useState<Evidence['evidence_type']>('object')
  const [evidenceTitle, setEvidenceTitle] = useState('')
  const [evidenceDescription, setEvidenceDescription] = useState('')
  const [evidenceReference, setEvidenceReference] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    const [{ data: contextData }, { data: peopleData }, { data: evidenceData }] = await Promise.all([
      supabase.rpc('police_get_my_context'),
      supabase.rpc('police_list_case_people', { target_case_number: caseNumber }),
      supabase.rpc('police_list_case_evidence', { target_case_number: caseNumber }),
    ])
    setContext(contextData as PoliceContext)
    setPeople(Array.isArray(peopleData) ? peopleData as CasePerson[] : [])
    setEvidence(Array.isArray(evidenceData) ? evidenceData as Evidence[] : [])
  }, [caseNumber])

  useEffect(() => { void load() }, [load])

  const search = async () => {
    if (query.trim().length < 2 || !context?.can_search_people) return
    const { data } = await supabase.rpc('police_search_people', { search_text: query.trim() })
    setResults(Array.isArray(data) ? data as PersonResult[] : [])
  }

  const addPerson = async () => {
    if (!selected || closed || !context?.can_edit_cases) return
    setBusy(true); setMessage('')
    const { error } = await supabase.rpc('police_add_case_person', {
      target_case_number: caseNumber,
      target_profile: selected.profile_id,
      target_person_role: role,
      person_note: personNote.trim() || null,
    })
    setBusy(false)
    if (error) return setMessage('Person konnte nicht hinzugefügt werden.')
    setSelected(null); setResults([]); setQuery(''); setPersonNote(''); setMessage('Person wurde hinzugefügt.')
    await load()
  }

  const removePerson = async (person: CasePerson) => {
    if (closed || !context?.can_edit_cases) return
    setBusy(true); setMessage('')
    const { error } = await supabase.rpc('police_remove_case_person', {
      target_case_number: caseNumber,
      target_profile: person.profile_id,
      target_person_role: person.person_role,
      reason: 'Zuordnung aus dem aktuellen Fall entfernt',
    })
    setBusy(false)
    if (error) return setMessage('Person konnte nicht entfernt werden.')
    setMessage('Person wurde aus dem aktuellen Fall entfernt.')
    await load()
  }

  const addEvidence = async () => {
    if (closed || !context?.can_edit_cases || evidenceTitle.trim().length < 2) return
    setBusy(true); setMessage('')
    const { data, error } = await supabase.rpc('police_add_case_evidence', {
      target_case_number: caseNumber,
      target_evidence_type: evidenceType,
      evidence_title: evidenceTitle.trim(),
      evidence_description: evidenceDescription.trim() || null,
      evidence_reference: evidenceReference.trim() || null,
    })
    setBusy(false)
    if (error) return setMessage('Beweismittel konnte nicht gespeichert werden.')
    const number = (data as { evidence_number?: string } | null)?.evidence_number
    setEvidenceTitle(''); setEvidenceDescription(''); setEvidenceReference('')
    setMessage(number ? `${number} wurde gespeichert.` : 'Beweismittel wurde gespeichert.')
    await load()
  }

  return (
    <section className="police-case-extra">
      {message ? <div className="police-case-extra-message">{message}</div> : null}

      <div className="police-case-extra-grid">
        <div className="police-case-extra-card">
          <div className="police-case-extra-head"><div><span className="eyebrow">BETEILIGTE</span><h3>Personen im Fall</h3></div><UserRound size={18} /></div>
          <div className="police-case-extra-list">
            {people.length === 0 ? <p>Keine Personen verknüpft.</p> : people.map((person) => (
              <div key={`${person.profile_id}-${person.person_role}`}>
                <span><strong>{person.display_name}</strong><small>{roleLabels[person.person_role]} · {person.nexus_id ?? 'Keine Nexus-ID'}{person.note ? ` · ${person.note}` : ''}</small></span>
                {context?.can_edit_cases && !closed ? <button type="button" title="Zuordnung entfernen" onClick={() => void removePerson(person)} disabled={busy}><Trash2 size={14} /></button> : null}
              </div>
            ))}
          </div>

          {context?.can_edit_cases && context.can_search_people && !closed ? (
            <div className="police-case-extra-form">
              <label><span>Weitere Person suchen</span><div className="police-case-extra-search"><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void search() }} placeholder="Name oder Nexus-ID" /><button type="button" onClick={() => void search()}><Search size={14} /></button></div></label>
              {!selected && results.length > 0 ? <div className="police-case-extra-results">{results.map((person) => <button key={person.profile_id} type="button" onClick={() => setSelected(person)}><span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'}</small></span><ChevronRight size={14} /></button>)}</div> : null}
              {selected ? <>
                <div className="police-case-extra-selected"><UserPlus size={15} /><span><strong>{selected.display_name}</strong><small>{selected.nexus_id ?? 'Keine Nexus-ID'}</small></span></div>
                <label><span>Rolle im Fall</span><select value={role} onChange={(e) => setRole(e.target.value as CasePerson['person_role'])}>{Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
                <label><span>Kurzer Hinweis (optional)</span><input value={personNote} onChange={(e) => setPersonNote(e.target.value)} placeholder="z. B. Erstmelder" /></label>
                <button className="police-case-extra-primary" type="button" onClick={() => void addPerson()} disabled={busy}><Plus size={14} /> Hinzufügen</button>
              </> : null}
            </div>
          ) : null}
        </div>

        <div className="police-case-extra-card">
          <div className="police-case-extra-head"><div><span className="eyebrow">BEWEISMITTEL</span><h3>Beweise & Unterlagen</h3></div><Archive size={18} /></div>
          <div className="police-case-extra-list evidence">
            {evidence.length === 0 ? <p>Noch keine Beweismittel erfasst.</p> : evidence.map((item) => (
              <div key={item.id}>
                <span><strong>{item.evidence_number} · {item.title}</strong><small>{evidenceLabels[item.evidence_type]} · {item.created_by_name ?? 'Police'} · {dateTimeFormatter.format(new Date(item.created_at))}</small>{item.description ? <em>{item.description}</em> : null}{item.reference_text ? <em>Referenz: {item.reference_text}</em> : null}</span>
              </div>
            ))}
          </div>

          {context?.can_edit_cases && !closed ? (
            <div className="police-case-extra-form">
              <label><span>Art</span><select value={evidenceType} onChange={(e) => setEvidenceType(e.target.value as Evidence['evidence_type'])}>{Object.entries(evidenceLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
              <label><span>Bezeichnung</span><input value={evidenceTitle} onChange={(e) => setEvidenceTitle(e.target.value)} placeholder="z. B. Mobiltelefon" /></label>
              <label><span>Beschreibung (optional)</span><textarea value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} placeholder="Kurze Beschreibung" /></label>
              <label><span>Referenz (optional)</span><input value={evidenceReference} onChange={(e) => setEvidenceReference(e.target.value)} placeholder="z. B. Asservatenfach, Foto-Link, Dokument-ID" /></label>
              <button className="police-case-extra-primary" type="button" onClick={() => void addEvidence()} disabled={busy || evidenceTitle.trim().length < 2}><Plus size={14} /> Beweismittel erfassen</button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
