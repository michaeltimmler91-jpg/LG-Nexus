import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, Pill, Plus, X } from 'lucide-react'
import { supabase } from './lib/supabase'

type MedicationContext = {
  can_view_records: boolean
  can_manage_medications: boolean
}

type MedicalMedication = {
  id: string
  medication_name: string
  dosage: string
  instructions: string | null
  indication: string | null
  status: 'active' | 'stopped'
  recorded_by_name: string | null
  recorded_at: string
  stopped_by_name: string | null
  stopped_at: string | null
  stop_reason: string | null
  row_version: number
}

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function readSelectedRecordNumber() {
  const label = document.querySelector('.medical-patient-header .eyebrow')?.textContent ?? ''
  return label.match(/MA-\d{6}/)?.[0] ?? null
}

export default function MedicalMedicationMount() {
  const [target, setTarget] = useState<Element | null>(null)
  const [recordNumber, setRecordNumber] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => {
      const medicalOpen = document.body.dataset.nexusMedicalWorkspace === 'true'
      setTarget(medicalOpen ? document.querySelector('.medical-record-layout') : null)
      setRecordNumber(medicalOpen ? readSelectedRecordNumber() : null)
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true })
    return () => observer.disconnect()
  }, [])

  if (!target || !recordNumber) return null

  return createPortal(
    <MedicationWorkspace recordNumber={recordNumber} />,
    target,
  )
}

function MedicationWorkspace({ recordNumber }: { recordNumber: string }) {
  const [context, setContext] = useState<MedicationContext | null>(null)
  const [medications, setMedications] = useState<MedicalMedication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [instructions, setInstructions] = useState('')
  const [indication, setIndication] = useState('')
  const [adding, setAdding] = useState(false)

  const [stoppingId, setStoppingId] = useState<string | null>(null)
  const [stopReason, setStopReason] = useState('')
  const [workingId, setWorkingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const [{ data: contextData, error: contextError }, { data: medicationData, error: medicationError }] = await Promise.all([
      supabase.rpc('medical_get_my_context'),
      supabase.rpc('medical_list_medications', { target_record_number: recordNumber }),
    ])

    setLoading(false)

    if (contextError || medicationError) {
      setError('Die Medikamentendaten konnten nicht geladen werden.')
      return
    }

    setContext(contextData as MedicationContext)
    setMedications(Array.isArray(medicationData) ? (medicationData as MedicalMedication[]) : [])
  }, [recordNumber])

  useEffect(() => {
    void load()
  }, [load])

  const addMedication = async () => {
    if (!context?.can_manage_medications) return
    if (name.trim().length < 2 || dosage.trim().length < 1) {
      setError('Medikament und Dosierung müssen angegeben werden.')
      return
    }

    setAdding(true)
    setError('')
    setNotice('')

    const { error: addError } = await supabase.rpc('medical_add_medication', {
      target_record_number: recordNumber,
      medication_name: name.trim(),
      medication_dosage: dosage.trim(),
      medication_instructions: instructions.trim() || null,
      medication_indication: indication.trim() || null,
    })

    setAdding(false)
    if (addError) {
      setError('Das Medikament konnte nicht eingetragen werden.')
      return
    }

    const savedName = name.trim()
    setName('')
    setDosage('')
    setInstructions('')
    setIndication('')
    setNotice(`${savedName} wurde in die Krankenakte eingetragen.`)
    await load()
  }

  const stopMedication = async (medication: MedicalMedication) => {
    if (!context?.can_manage_medications) return

    setWorkingId(medication.id)
    setError('')
    setNotice('')

    const { error: stopError } = await supabase.rpc('medical_stop_medication', {
      target_medication: medication.id,
      expected_row_version: medication.row_version,
      medication_stop_reason: stopReason.trim() || null,
    })

    setWorkingId(null)
    if (stopError) {
      setError('Das Medikament konnte nicht abgesetzt werden. Die Liste wurde neu geladen.')
      setStoppingId(null)
      setStopReason('')
      await load()
      return
    }

    setNotice(`${medication.medication_name} wurde als abgesetzt markiert.`)
    setStoppingId(null)
    setStopReason('')
    await load()
  }

  return (
    <section className="medical-medication-section">
      <div className="medical-card-head medical-medication-heading">
        <div>
          <span className="eyebrow">MEDIKAMENTE</span>
          <h4>Medikation & Dosierung</h4>
          <p>Aktuelle und frühere Medikamente bleiben dauerhaft nachvollziehbar.</p>
        </div>
        <Pill size={22} />
      </div>

      {error ? <div className="medical-medication-message is-error"><AlertTriangle size={14} />{error}</div> : null}
      {notice ? <div className="medical-medication-message is-success"><Check size={14} />{notice}</div> : null}

      {loading ? (
        <div className="medical-empty compact">Medikamente werden geladen …</div>
      ) : (
        <>
          {context?.can_manage_medications ? (
            <div className="medical-medication-create">
              <label>
                <span>Medikament</span>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="z. B. Ibuprofen" />
              </label>
              <label>
                <span>Dosierung</span>
                <input value={dosage} onChange={(event) => setDosage(event.target.value)} placeholder="z. B. 400 mg · 1-0-1" />
              </label>
              <label>
                <span>Einnahme / Hinweise</span>
                <input value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Optional …" />
              </label>
              <label>
                <span>Grund / Indikation</span>
                <input value={indication} onChange={(event) => setIndication(event.target.value)} placeholder="Optional …" />
              </label>
              <button disabled={adding || name.trim().length < 2 || dosage.trim().length < 1} onClick={() => void addMedication()}>
                <Plus size={14} /> {adding ? 'Wird eingetragen …' : 'Medikament eintragen'}
              </button>
            </div>
          ) : null}

          <div className="medical-medication-list">
            {medications.length === 0 ? (
              <div className="medical-empty compact">Noch keine Medikamente dokumentiert.</div>
            ) : medications.map((medication) => (
              <article className={`medical-medication-row ${medication.status}`} key={medication.id}>
                <div className="medical-medication-row-head">
                  <div>
                    <span className={`medical-medication-status ${medication.status}`}>
                      {medication.status === 'active' ? 'Aktiv' : 'Abgesetzt'}
                    </span>
                    <strong>{medication.medication_name}</strong>
                  </div>
                  <b>{medication.dosage}</b>
                </div>

                {(medication.instructions || medication.indication) ? (
                  <div className="medical-medication-details">
                    {medication.instructions ? <span><b>Einnahme:</b> {medication.instructions}</span> : null}
                    {medication.indication ? <span><b>Grund:</b> {medication.indication}</span> : null}
                  </div>
                ) : null}

                <div className="medical-medication-meta">
                  <span>Eingetragen {dateTimeFormatter.format(new Date(medication.recorded_at))}</span>
                  <span>{medication.recorded_by_name ?? 'Medical'}</span>
                  {medication.stopped_at ? <span>Abgesetzt {dateTimeFormatter.format(new Date(medication.stopped_at))}</span> : null}
                </div>

                {medication.status === 'stopped' && medication.stop_reason ? (
                  <div className="medical-medication-stop-note"><b>Grund für Absetzen:</b> {medication.stop_reason}</div>
                ) : null}

                {medication.status === 'active' && context?.can_manage_medications ? (
                  stoppingId === medication.id ? (
                    <div className="medical-medication-stop-form">
                      <input value={stopReason} onChange={(event) => setStopReason(event.target.value)} placeholder="Grund für das Absetzen (optional) …" />
                      <button disabled={workingId === medication.id} onClick={() => void stopMedication(medication)}>
                        <Check size={13} /> {workingId === medication.id ? 'Wird gespeichert …' : 'Bestätigen'}
                      </button>
                      <button className="secondary" disabled={workingId === medication.id} onClick={() => { setStoppingId(null); setStopReason('') }}>
                        <X size={13} /> Abbrechen
                      </button>
                    </div>
                  ) : (
                    <button className="medical-medication-stop-button" onClick={() => { setStoppingId(medication.id); setStopReason('') }}>
                      Absetzen
                    </button>
                  )
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
