import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, Pencil, Save, X } from 'lucide-react'
import { supabase } from './lib/supabase'

type EditContext = {
  can_edit_treatments: boolean
}

type TreatmentEditData = {
  id: string
  treatment_number: string
  performed_text: string
  row_version: number
}

type EditTarget = {
  slot: HTMLDivElement
  article: HTMLElement
  treatmentNumber: string
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
        next.push({ slot, article, treatmentNumber })
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
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<TreatmentEditData | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const openEditor = async () => {
    setLoading(true)
    setError('')
    setNotice('')

    const { data: response, error: loadError } = await supabase.rpc('medical_simple_get_treatment_for_edit', {
      target_treatment_number: target.treatmentNumber,
    })

    setLoading(false)
    if (loadError || !response) {
      setError('Die Behandlung konnte nicht zum Bearbeiten geöffnet werden.')
      return
    }

    const treatment = response as TreatmentEditData
    setData(treatment)
    setDraft(treatment.performed_text)
    setEditing(true)
  }

  const save = async () => {
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
      setEditing(false)
      setData(null)
      return
    }

    const paragraph = target.article.querySelector<HTMLParagraphElement>(':scope > p')
    if (paragraph) paragraph.textContent = draft.trim()

    setEditing(false)
    setData(null)
    setNotice('Verlauf aktualisiert.')
  }

  if (!editing) {
    return (
      <div className="medical-treatment-edit-actions">
        {error ? <span className="medical-treatment-edit-message is-error"><AlertTriangle size={13} />{error}</span> : null}
        {notice ? <span className="medical-treatment-edit-message is-success"><Check size={13} />{notice}</span> : null}
        <button type="button" className="medical-treatment-edit-button" onClick={() => void openEditor()} disabled={loading}>
          <Pencil size={13} /> {loading ? 'Öffnet …' : 'Verlauf bearbeiten'}
        </button>
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
        <button type="button" onClick={() => void save()} disabled={saving || draft.trim().length < 2}>
          <Save size={13} /> {saving ? 'Speichert …' : 'Speichern'}
        </button>
        <button type="button" className="secondary" onClick={() => { setEditing(false); setData(null); setError('') }} disabled={saving}>
          <X size={13} /> Abbrechen
        </button>
      </div>
    </div>
  )
}
