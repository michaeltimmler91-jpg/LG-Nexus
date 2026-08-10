import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CalendarDays, Check, Pencil, Save, X } from 'lucide-react'
import { supabase } from './lib/supabase'

type EditContext = {
  can_edit_treatments: boolean
}

type TreatmentEditData = {
  id: string
  treatment_number: string
  performed_text: string
  followup_required: boolean
  followup_mode: 'exact' | 'range' | null
  followup_from: string | null
  followup_to: string | null
  followup_checkpoints: string[]
  followup_attended_at: string | null
  followup_attended_by_name: string | null
  row_version: number
}

type EditTarget = {
  slot: HTMLDivElement
  article: HTMLElement
  treatmentNumber: string
  hasFollowup: boolean
  followupDone: boolean
}

type EditorMode = 'none' | 'text' | 'followup'

const dateFormatter = new Intl.DateTimeFormat('de-DE')

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

function followupLabel(mode: 'exact' | 'range', from: string, to: string) {
  if (mode === 'range' && to && to !== from) return `${formatDate(from)} – ${formatDate(to)}`
  return formatDate(from)
}

function parseCheckpoints(value: string) {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim().replace(/^[-•]\s*/, ''))
    .filter(Boolean)
}

function findTreatmentNumber(article: HTMLElement) {
  const text = article.querySelector('.medical-simple-history-head strong')?.textContent ?? ''
  return text.match(/BH-\d{6}/)?.[0] ?? null
}

export default function MedicalTreatmentEditMount() {
  const [allowed, setAllowed] = useState(false)
  const [targets, setTargets] = useState<EditTarget[]>([])

  useEffect(() => {
    let cancelled = false

    const loadContext = async () => {
      const { data, error } = await supabase.rpc('medical_simple_get_context')
      if (!cancelled && !error) {
        setAllowed(Boolean((data as EditContext | null)?.can_edit_treatments))
      }
    }

    void loadContext()
    const { data: listener } = supabase.auth.onAuthStateChange(() => { void loadContext() })
    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!allowed) {
      setTargets([])
      return
    }

    const sync = () => {
      const next: EditTarget[] = []
      document.querySelectorAll<HTMLElement>('.medical-simple-history-list article').forEach((article) => {
        const treatmentNumber = findTreatmentNumber(article)
        if (!treatmentNumber) return

        let slot = article.querySelector<HTMLDivElement>(':scope > .medical-treatment-edit-slot')
        if (!slot) {
          slot = document.createElement('div')
          slot.className = 'medical-treatment-edit-slot'
          article.appendChild(slot)
        }

        next.push({
          slot,
          article,
          treatmentNumber,
          hasFollowup: Boolean(article.querySelector('.medical-simple-followup-status')),
          followupDone: Boolean(article.querySelector('.medical-simple-followup-status.done')),
        })
      })
      setTargets(next)
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [allowed])

  if (!allowed) return null

  return (
    <>
      {targets.map((target) => createPortal(
        <TreatmentEditor key={target.treatmentNumber} target={target} />,
        target.slot,
      ))}
    </>
  )
}

function TreatmentEditor({ target }: { target: EditTarget }) {
  const [mode, setMode] = useState<EditorMode>('none')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<TreatmentEditData | null>(null)
  const [metadata, setMetadata] = useState<TreatmentEditData | null>(null)
  const [draft, setDraft] = useState('')
  const [followupMode, setFollowupMode] = useState<'exact' | 'range'>('exact')
  const [followupFrom, setFollowupFrom] = useState('')
  const [followupTo, setFollowupTo] = useState('')
  const [followupChecks, setFollowupChecks] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const fetchTreatment = async () => {
    const { data: response, error: loadError } = await supabase.rpc('medical_simple_get_treatment_for_edit', {
      target_treatment_number: target.treatmentNumber,
    })
    if (loadError || !response) return null
    return response as TreatmentEditData
  }

  useEffect(() => {
    let cancelled = false
    if (!target.followupDone) {
      setMetadata(null)
      return
    }

    const loadMetadata = async () => {
      const treatment = await fetchTreatment()
      if (!cancelled && treatment) setMetadata(treatment)
    }

    void loadMetadata()
    return () => { cancelled = true }
  }, [target.followupDone, target.treatmentNumber])

  const openTextEditor = async () => {
    setLoading(true)
    setError('')
    setNotice('')
    const treatment = await fetchTreatment()
    setLoading(false)

    if (!treatment) {
      setError('Die Behandlung konnte nicht zum Bearbeiten geöffnet werden.')
      return
    }

    setData(treatment)
    setDraft(treatment.performed_text)
    setMode('text')
  }

  const openFollowupEditor = async () => {
    setLoading(true)
    setError('')
    setNotice('')
    const treatment = await fetchTreatment()
    setLoading(false)

    if (!treatment || !treatment.followup_required || !treatment.followup_from) {
      setError('Die Nachbehandlung konnte nicht zum Bearbeiten geöffnet werden.')
      return
    }

    setData(treatment)
    setFollowupMode(treatment.followup_mode === 'range' ? 'range' : 'exact')
    setFollowupFrom(treatment.followup_from)
    setFollowupTo(treatment.followup_to ?? treatment.followup_from)
    setFollowupChecks((treatment.followup_checkpoints ?? []).join('\n'))
    setMode('followup')
  }

  const saveText = async () => {
    if (!data || draft.trim().length < 2) return

    setSaving(true)
    setError('')
    setNotice('')

    const { error: saveError } = await supabase.rpc('medical_simple_update_treatment_text', {
      target_treatment: data.id,
      next_treatment_text: draft.trim(),
      expected_row_version: data.row_version,
    })

    setSaving(false)
    if (saveError) {
      setError('Die Behandlung wurde zwischenzeitlich geändert. Bitte erneut öffnen.')
      setMode('none')
      setData(null)
      return
    }

    const paragraph = target.article.querySelector<HTMLParagraphElement>(':scope > p')
    if (paragraph) paragraph.textContent = draft.trim()

    setMode('none')
    setData(null)
    setNotice('Verlauf aktualisiert.')
  }

  const saveFollowup = async () => {
    if (!data || !followupFrom) return
    const checkpoints = parseCheckpoints(followupChecks)
    if (followupMode === 'range' && !followupTo) {
      setError('Bitte gib auch das Bis-Datum an.')
      return
    }
    if (followupMode === 'range' && followupTo < followupFrom) {
      setError('Das Bis-Datum darf nicht vor dem Von-Datum liegen.')
      return
    }
    if (checkpoints.length === 0) {
      setError('Bitte gib mindestens einen Kontrollpunkt an.')
      return
    }

    setSaving(true)
    setError('')
    setNotice('')

    const { data: newVersion, error: saveError } = await supabase.rpc('medical_simple_update_followup', {
      target_treatment: data.id,
      next_followup_mode: followupMode,
      next_followup_from: followupFrom,
      next_followup_to: followupMode === 'range' ? followupTo : followupFrom,
      next_followup_checkpoints: checkpoints,
      expected_row_version: data.row_version,
    })

    setSaving(false)
    if (saveError) {
      setError('Die Nachbehandlung wurde zwischenzeitlich geändert. Bitte erneut öffnen.')
      setMode('none')
      setData(null)
      return
    }

    const label = followupLabel(followupMode, followupFrom, followupMode === 'range' ? followupTo : followupFrom)
    const historyStatus = target.article.querySelector<HTMLElement>('.medical-simple-followup-status.open span')
    if (historyStatus) historyStatus.textContent = `Nachbehandlung vorgesehen: ${label}`

    document.querySelectorAll<HTMLElement>('.medical-simple-followup-list article').forEach((article) => {
      const number = article.querySelector('small')?.textContent?.trim()
      if (number !== target.treatmentNumber) return
      const date = article.querySelector<HTMLElement>('strong')
      if (date) date.textContent = label
      const list = article.querySelector('ul')
      if (list) {
        list.replaceChildren(...checkpoints.map((point) => {
          const item = document.createElement('li')
          item.textContent = point
          return item
        }))
      }
    })

    setData({
      ...data,
      followup_mode: followupMode,
      followup_from: followupFrom,
      followup_to: followupMode === 'range' ? followupTo : followupFrom,
      followup_checkpoints: checkpoints,
      row_version: typeof newVersion === 'number' ? newVersion : data.row_version + 1,
    })
    setMode('none')
    setNotice('Nachbehandlung aktualisiert.')
  }

  if (mode === 'none') {
    return (
      <div className="medical-treatment-edit-block">
        {target.followupDone && metadata?.followup_attended_at ? (
          <span className="medical-treatment-attendance-meta">
            <Check size={13} /> Bestätigt von {metadata.followup_attended_by_name ?? 'Medical'}
          </span>
        ) : null}
        <div className="medical-treatment-edit-actions">
          {error ? <span className="medical-treatment-edit-message is-error"><AlertTriangle size={13} />{error}</span> : null}
          {notice ? <span className="medical-treatment-edit-message is-success"><Check size={13} />{notice}</span> : null}
          {target.hasFollowup ? (
            <button type="button" className="medical-treatment-edit-button" onClick={() => void openFollowupEditor()} disabled={loading}>
              <CalendarDays size={13} /> {loading ? 'Öffnet …' : 'Nachbehandlung bearbeiten'}
            </button>
          ) : null}
          <button type="button" className="medical-treatment-edit-button" onClick={() => void openTextEditor()} disabled={loading}>
            <Pencil size={13} /> {loading ? 'Öffnet …' : 'Verlauf bearbeiten'}
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'followup') {
    return (
      <div className="medical-treatment-edit-form medical-followup-edit-form">
        <div className="medical-followup-edit-mode">
          <label><input type="radio" checked={followupMode === 'exact'} onChange={() => setFollowupMode('exact')} /> <span>Am Datum</span></label>
          <label><input type="radio" checked={followupMode === 'range'} onChange={() => setFollowupMode('range')} /> <span>Zwischen zwei Daten</span></label>
        </div>
        <div className="medical-followup-edit-dates">
          <label><span>{followupMode === 'exact' ? 'Am' : 'Von'}</span><input type="date" value={followupFrom} onChange={(event) => setFollowupFrom(event.target.value)} /></label>
          {followupMode === 'range' ? <label><span>Bis</span><input type="date" value={followupTo} onChange={(event) => setFollowupTo(event.target.value)} /></label> : null}
        </div>
        <label>
          <span>Was muss kontrolliert werden?</span>
          <textarea value={followupChecks} onChange={(event) => setFollowupChecks(event.target.value)} />
        </label>
        {error ? <span className="medical-treatment-edit-message is-error"><AlertTriangle size={13} />{error}</span> : null}
        <div className="medical-treatment-edit-form-actions">
          <button type="button" onClick={() => void saveFollowup()} disabled={saving || !followupFrom || parseCheckpoints(followupChecks).length === 0}>
            <Save size={13} /> {saving ? 'Speichert …' : 'Nachbehandlung speichern'}
          </button>
          <button type="button" className="secondary" onClick={() => { setMode('none'); setData(null); setError('') }} disabled={saving}>
            <X size={13} /> Abbrechen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="medical-treatment-edit-form">
      <label>
        <span>Behandlungsverlauf bearbeiten</span>
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} autoFocus />
      </label>
      {error ? <span className="medical-treatment-edit-message is-error"><AlertTriangle size={13} />{error}</span> : null}
      <div className="medical-treatment-edit-form-actions">
        <button type="button" onClick={() => void saveText()} disabled={saving || draft.trim().length < 2}>
          <Save size={13} /> {saving ? 'Speichert …' : 'Speichern'}
        </button>
        <button type="button" className="secondary" onClick={() => { setMode('none'); setData(null); setError('') }} disabled={saving}>
          <X size={13} /> Abbrechen
        </button>
      </div>
    </div>
  )
}
