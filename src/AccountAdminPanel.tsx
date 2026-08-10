import { useCallback, useEffect, useState } from 'react'
import { Check, RefreshCw, UserCheck, UserX } from 'lucide-react'
import { supabase } from './lib/supabase'

type AccountAdminContext = {
  can_view: boolean
  can_approve: boolean
  can_reject: boolean
  is_system_admin: boolean
}

type PendingAccount = {
  id: string
  display_name: string
  username: string | null
  first_name: string | null
  last_name: string | null
  date_of_birth: string | null
  created_at: string
  row_version: number
}

const dateFormatter = new Intl.DateTimeFormat('de-DE')
const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export default function AccountAdminPanel() {
  const [context, setContext] = useState<AccountAdminContext | null>(null)
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [workingId, setWorkingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: contextData, error: contextError } = await supabase.rpc('get_account_admin_context')
    if (contextError) {
      setContext(null)
      setLoading(false)
      return
    }

    const nextContext = contextData as AccountAdminContext
    setContext(nextContext)

    if (!nextContext?.can_view) {
      setPendingAccounts([])
      setLoading(false)
      return
    }

    const { data, error: listError } = await supabase.rpc('list_pending_accounts')
    if (listError) {
      setError('Die offenen Registrierungen konnten nicht geladen werden.')
      setPendingAccounts([])
    } else {
      setPendingAccounts(Array.isArray(data) ? (data as PendingAccount[]) : [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const review = async (account: PendingAccount, decision: 'approve' | 'reject') => {
    const reason = decision === 'reject' ? rejectReason.trim() : null
    if (decision === 'reject' && !reason) {
      setError('Bitte gib einen Grund für die Ablehnung an.')
      return
    }

    setWorkingId(account.id)
    setError('')
    setNotice('')

    const { error: reviewError } = await supabase.rpc('review_pending_account', {
      target_profile: account.id,
      decision,
      reason,
    })

    if (reviewError) {
      setError(
        decision === 'approve'
          ? 'Der Account konnte nicht freigeschaltet werden.'
          : 'Der Account konnte nicht abgelehnt werden.',
      )
      setWorkingId(null)
      return
    }

    setNotice(
      decision === 'approve'
        ? `${account.display_name} wurde freigeschaltet.`
        : `${account.display_name} wurde abgelehnt.`,
    )
    setRejectingId(null)
    setRejectReason('')
    setWorkingId(null)
    await loadData()
  }

  if (!context?.can_view && !loading) return null

  return (
    <section className="account-admin-panel">
      <div className="account-admin-head">
        <div className="account-admin-title">
          <span className="account-admin-icon"><UserCheck size={19} /></span>
          <div>
            <span className="account-admin-kicker">STADTHALLE</span>
            <h3>Accountfreischaltungen</h3>
            <p>Neue Bürgeraccounts prüfen, freischalten oder mit Begründung ablehnen.</p>
          </div>
        </div>
        <div className="account-admin-head-actions">
          {context?.is_system_admin ? <span className="account-admin-access">Technischer Zugriff</span> : null}
          <button className="account-admin-refresh" onClick={() => void loadData()} disabled={loading}>
            <RefreshCw size={14} />
            Aktualisieren
          </button>
        </div>
      </div>

      {error ? <div className="account-admin-message is-error">{error}</div> : null}
      {notice ? <div className="account-admin-message is-success"><Check size={14} />{notice}</div> : null}

      {loading ? (
        <div className="account-admin-empty">Offene Registrierungen werden geladen …</div>
      ) : pendingAccounts.length === 0 ? (
        <div className="account-admin-empty">
          <UserCheck size={24} />
          <strong>Keine offenen Registrierungen</strong>
          <span>Aktuell wartet kein Bürgeraccount auf Freischaltung.</span>
        </div>
      ) : (
        <div className="account-admin-list">
          {pendingAccounts.map((account) => {
            const birthday = account.date_of_birth
              ? dateFormatter.format(new Date(`${account.date_of_birth}T00:00:00`))
              : 'Nicht angegeben'
            const registeredAt = dateTimeFormatter.format(new Date(account.created_at))
            const isRejecting = rejectingId === account.id
            const isWorking = workingId === account.id

            return (
              <article className="account-admin-entry" key={account.id}>
                <div className="account-admin-avatar">
                  {(account.first_name?.[0] ?? account.display_name?.[0] ?? 'N')}
                  {(account.last_name?.[0] ?? '')}
                </div>
                <div className="account-admin-person">
                  <strong>{account.display_name}</strong>
                  <span>@{account.username ?? 'kein-benutzername'}</span>
                  <div className="account-admin-meta">
                    <span><b>Geburtsdatum</b>{birthday}</span>
                    <span><b>Registriert</b>{registeredAt}</span>
                  </div>
                </div>
                <div className="account-admin-actions">
                  {context?.can_approve ? (
                    <button
                      className="account-admin-approve"
                      disabled={isWorking}
                      onClick={() => void review(account, 'approve')}
                    >
                      <UserCheck size={14} />
                      {isWorking ? 'Wird verarbeitet …' : 'Freischalten'}
                    </button>
                  ) : null}
                  {context?.can_reject ? (
                    <button
                      className="account-admin-reject"
                      disabled={isWorking}
                      onClick={() => {
                        setRejectingId((current) => current === account.id ? null : account.id)
                        setRejectReason('')
                        setError('')
                      }}
                    >
                      <UserX size={14} />
                      Ablehnen
                    </button>
                  ) : null}
                </div>

                {isRejecting ? (
                  <div className="account-admin-reject-box">
                    <label>
                      Grund der Ablehnung
                      <textarea
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                        placeholder="Kurze interne Begründung …"
                        maxLength={500}
                        autoFocus
                      />
                    </label>
                    <div>
                      <button onClick={() => { setRejectingId(null); setRejectReason('') }}>Abbrechen</button>
                      <button
                        className="confirm-reject"
                        disabled={isWorking || !rejectReason.trim()}
                        onClick={() => void review(account, 'reject')}
                      >
                        Ablehnung bestätigen
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
