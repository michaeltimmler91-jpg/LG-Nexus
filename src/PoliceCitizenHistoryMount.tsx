import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronRight, Search, UserRound } from 'lucide-react'
import { supabase } from './lib/supabase'

type PersonResult = {
  profile_id: string
  display_name: string
  nexus_id: string | null
}

type PersonRole = 'accused' | 'victim' | 'witness' | 'other'

type CitizenCase = {
  id: string
  case_number: string
  title: string
  state: 'open' | 'done'
  summary: string | null
  actions_text: string | null
  evidence_text: string | null
  created_at: string
  updated_at: string
  roles: PersonRole[]
}

type CitizenHistory = {
  profile_id: string
  display_name: string
  nexus_id: string | null
  date_of_birth: string | null
  cases: CitizenCase[]
}

const roleLabels: Record<PersonRole, string> = {
  accused: 'Beschuldigter',
  victim: 'Opfer',
  witness: 'Zeuge',
  other: 'Sonstige',
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric',
})

export default function PoliceCitizenHistoryMount() {
  const [slot, setSlot] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const sync = () => {
      if (document.body.dataset.nexusPoliceWorkspace !== 'true') {
        setSlot(null)
        return
      }

      const workspace = document.querySelector<HTMLElement>('.police-easy-workspace')
      const hero = workspace?.querySelector<HTMLElement>('.police-easy-hero')
      if (!workspace || !hero) {
        setSlot(null)
        return
      }

      let target = workspace.querySelector<HTMLDivElement>(':scope > .police-citizen-history-slot')
      if (!target) {
        target = document.createElement('div')
        target.className = 'police-citizen-history-slot'
        hero.insertAdjacentElement('afterend', target)
      }
      setSlot((current) => current === target ? current : target)
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-nexus-police-workspace'] })
    return () => observer.disconnect()
  }, [])

  if (!slot) return null
  return createPortal(<CitizenLookup />, slot)
}

function CitizenLookup() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PersonResult[]>([])
  const [history, setHistory] = useState<CitizenHistory | null>(null)
  const [expandedCase, setExpandedCase] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState('')

  const caseCountLabel = useMemo(() => {
    const count = history?.cases.length ?? 0
    return `${count} ${count === 1 ? 'Vorgang' : 'Vorgänge'}`
  }, [history])

  const search = async () => {
    const needle = query.trim()
    if (needle.length < 2) {
      setError('Bitte mindestens zwei Zeichen eingeben.')
      return
    }

    setSearching(true)
    setError('')
    setHistory(null)
    setExpandedCase(null)
    const { data, error: searchError } = await supabase.rpc('police_search_people', { search_text: needle })
    setSearching(false)

    if (searchError) {
      setError('Die Bürgersuche konnte nicht ausgeführt werden.')
      return
    }

    setResults(Array.isArray(data) ? data as PersonResult[] : [])
  }

  const openCitizen = async (person: PersonResult) => {
    setLoadingHistory(true)
    setError('')
    setResults([])
    setExpandedCase(null)

    const { data, error: historyError } = await supabase.rpc('police_get_citizen_history', {
      target_profile: person.profile_id,
    })

    setLoadingHistory(false)
    if (historyError) {
      setError('Die Bürgerübersicht konnte nicht geladen werden.')
      return
    }

    const next = data as CitizenHistory
    setHistory({ ...next, cases: Array.isArray(next?.cases) ? next.cases : [] })
    setQuery(person.display_name)
  }

  return (
    <section className="police-citizen-history">
      <div className="police-citizen-history-head">
        <div>
          <span className="eyebrow">BÜRGERSUCHE</span>
          <h3>Was ist über die Person bekannt?</h3>
          <p>Name oder Nexus-ID suchen und bisherige Vorgänge direkt ansehen.</p>
        </div>
        <UserRound size={20} />
      </div>

      <div className="police-citizen-history-search">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') void search() }}
          placeholder="Name oder Nexus-ID"
        />
        <button type="button" onClick={() => void search()} disabled={searching}>
          {searching ? 'Sucht …' : 'Suchen'}
        </button>
      </div>

      {error ? <div className="police-citizen-history-error">{error}</div> : null}

      {results.length > 0 ? (
        <div className="police-citizen-history-results">
          {results.map((person) => (
            <button type="button" key={person.profile_id} onClick={() => void openCitizen(person)}>
              <span><strong>{person.display_name}</strong><small>{person.nexus_id ?? 'Keine Nexus-ID'}</small></span>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      ) : null}

      {loadingHistory ? <div className="police-citizen-history-empty">Bürgerübersicht wird geladen …</div> : null}

      {history && !loadingHistory ? (
        <div className="police-citizen-profile">
          <div className="police-citizen-profile-head">
            <div className="police-citizen-avatar"><UserRound size={20} /></div>
            <div>
              <strong>{history.display_name}</strong>
              <span>{history.nexus_id ?? 'Keine Nexus-ID'}{history.date_of_birth ? ` · geb. ${dateFormatter.format(new Date(`${history.date_of_birth}T00:00:00`))}` : ''}</span>
            </div>
            <div className="police-citizen-count"><strong>{history.cases.length}</strong><span>{caseCountLabel}</span></div>
          </div>

          {history.cases.length === 0 ? (
            <div className="police-citizen-history-empty">Zu dieser Person gibt es keine bisherigen Vorgänge.</div>
          ) : (
            <div className="police-citizen-case-list">
              {history.cases.map((item) => {
                const expanded = expandedCase === item.id
                return (
                  <article key={item.id} className={expanded ? 'is-expanded' : ''}>
                    <button type="button" className="police-citizen-case-toggle" onClick={() => setExpandedCase(expanded ? null : item.id)}>
                      <span>
                        <strong>{item.case_number} · {item.title}</strong>
                        <small>{item.roles.map((role) => roleLabels[role] ?? role).join(', ') || 'Beteiligter'} · {item.state === 'open' ? 'Offen' : 'Erledigt'} · {dateFormatter.format(new Date(item.created_at))}</small>
                      </span>
                      {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {expanded ? (
                      <div className="police-citizen-case-details">
                        <div><span>Sachverhalt</span><p>{item.summary || 'Kein Sachverhalt hinterlegt.'}</p></div>
                        {item.actions_text ? <div><span>Maßnahmen</span><p>{item.actions_text}</p></div> : null}
                        {item.evidence_text ? <div><span>Beweise / Links</span><p>{item.evidence_text}</p></div> : null}
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}
