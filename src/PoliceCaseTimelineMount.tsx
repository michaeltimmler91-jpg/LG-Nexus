import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, FileClock, Plus, RefreshCw } from 'lucide-react'
import { supabase } from './lib/supabase'

type TimelineEntry = {
  id: string
  entry_type: 'created' | 'note' | 'status'
  body: string | null
  from_status: string | null
  to_status: string | null
  author_name: string | null
  created_at: string
}

type PoliceContext = {
  can_edit_cases: boolean
}

type TimelineTarget = {
  slot: HTMLDivElement
  caseNumber: string
  closed: boolean
}

const statusLabels: Record<string, string> = {
  new: 'Neu',
  investigation: 'Ermittlung',
  review: 'Prüfung',
  completed: 'Abgeschlossen',
  archived: 'Archiviert',
}

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function findCaseNumber(detail: HTMLElement) {
  const value = detail.querySelector('.police-simple-section-head .eyebrow')?.textContent?.trim() ?? ''
  return /^PD-\d{6}$/.test(value) ? value : null
}

export default function PoliceCaseTimelineMount() {
  const [target, setTarget] = useState<TimelineTarget | null>(null)

  useEffect(() => {
    const sync = () => {
      if (document.body.dataset.nexusPoliceWorkspace !== 'true') {
        setTarget(null)
        return
      }

      const detail = document.querySelector<HTMLElement>('.police-simple-case-detail')
      if (!detail) {
        setTarget(null)
        return
      }

      const caseNumber = findCaseNumber(detail)
      if (!caseNumber) {
        setTarget(null)
        return
      }

      let slot = detail.querySelector<HTMLDivElement>(':scope > .police-case-timeline-slot')
      if (!slot) {
        slot = document.createElement('div')
        slot.className = 'police-case-timeline-slot'
        detail.appendChild(slot)
      }

      const status = detail.querySelector<HTMLElement>('.police-simple-status')
      const closed = Boolean(status?.classList.contains('is-completed') || status?.classList.contains('is-archived'))

      setTarget((current) => {
        if (current?.slot === slot && current.caseNumber === caseNumber && current.closed === closed) return current
        return { slot, caseNumber, closed }
      })
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-nexus-police-workspace'] })
    return () => observer.disconnect()
  }, [])

  if (!target) return null
  return createPortal(<CaseTimeline key={target.caseNumber} caseNumber={target.caseNumber} closed={target.closed} />, target.slot)
}

function CaseTimeline({ caseNumber, closed }: { caseNumber: string; closed: boolean }) {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [canEdit, setCanEdit] = useState(false)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const [{ data: timeline, error: timelineError }, { data: context }] = await Promise.all([
      supabase.rpc('police_list_case_timeline', { target_case_number: caseNumber }),
      supabase.rpc('police_get_my_context'),
    ])

    setLoading(false)
    if (timelineError) {
      setError('Der Fallverlauf konnte nicht geladen werden.')
      return
    }

    setEntries(Array.isArray(timeline) ? timeline as TimelineEntry[] : [])
    setCanEdit(Boolean((context as PoliceContext | null)?.can_edit_cases))
  }, [caseNumber])

  useEffect(() => { void load() }, [load])

  const addNote = async () => {
    const clean = note.trim()
    if (clean.length < 2 || closed) return

    setSaving(true)
    setError('')
    setNotice('')
    const { error: saveError } = await supabase.rpc('police_add_case_note', {
      target_case_number: caseNumber,
      note_text: clean,
    })
    setSaving(false)

    if (saveError) {
      setError('Die Ermittlungsnotiz konnte nicht gespeichert werden.')
      return
    }

    setNote('')
    setNotice('Ermittlungsnotiz gespeichert.')
    await load()
  }

  return (
    <section className="police-case-timeline">
      <div className="police-case-timeline-head">
        <div>
          <span className="eyebrow">FALLVERLAUF</span>
          <h3>Ermittlungsverlauf</h3>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading}>
          <RefreshCw size={14} /> Aktualisieren
        </button>
      </div>

      {error ? <div className="police-case-timeline-message is-error"><AlertTriangle size={14} />{error}</div> : null}
      {notice ? <div className="police-case-timeline-message is-success"><Check size={14} />{notice}</div> : null}

      {canEdit && !closed ? (
        <div className="police-case-note-form">
          <label>
            <span>Ermittlungsnotiz hinzufügen</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={4000}
              placeholder="Neue Feststellung, Maßnahme oder Information zum Fall …"
            />
          </label>
          <button type="button" onClick={() => void addNote()} disabled={saving || note.trim().length < 2}>
            <Plus size={14} /> {saving ? 'Speichert …' : 'Notiz hinzufügen'}
          </button>
        </div>
      ) : closed ? (
        <div className="police-case-timeline-closed"><FileClock size={15} /> Der Fall ist abgeschlossen. Der Verlauf bleibt unverändert erhalten.</div>
      ) : null}

      <div className="police-case-timeline-list">
        {loading ? <div className="police-case-timeline-empty">Fallverlauf wird geladen …</div> : entries.length === 0 ? (
          <div className="police-case-timeline-empty">Noch keine Einträge vorhanden.</div>
        ) : entries.map((entry) => (
          <article key={entry.id} className={`is-${entry.entry_type}`}>
            <div className="police-case-timeline-marker"><FileClock size={14} /></div>
            <div>
              <div className="police-case-timeline-entry-head">
                <strong>{entry.entry_type === 'note' ? 'Ermittlungsnotiz' : entry.entry_type === 'status' ? 'Status geändert' : 'Fall angelegt'}</strong>
                <span>{dateTimeFormatter.format(new Date(entry.created_at))}</span>
              </div>
              {entry.entry_type === 'status' ? (
                <p>{statusLabels[entry.from_status ?? ''] ?? entry.from_status ?? '–'} → {statusLabels[entry.to_status ?? ''] ?? entry.to_status ?? '–'}</p>
              ) : entry.entry_type === 'note' ? <p>{entry.body}</p> : null}
              <small>{entry.author_name ?? 'Police'}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
