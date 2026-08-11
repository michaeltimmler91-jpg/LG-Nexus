import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ImagePlus, Link2, RefreshCw } from 'lucide-react'
import { supabase } from './lib/supabase'

type OrganizationContext = {
  organization_id: string
  name: string
  short_name: string | null
  description: string
  phone: string | null
  public_email: string | null
  location_label: string | null
  logo_url: string | null
  banner_url: string | null
  is_public: boolean
  row_version: number
}

function currentOrganizationId() {
  const select = document.querySelector('.org-control-select select') as HTMLSelectElement | null
  return select?.value ?? ''
}

function validateExternalImageUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'https:') return 'Bitte nur sichere https://-Bildlinks verwenden.'
    if (url.hostname.toLowerCase() === 'pfbjblrtwpnhsuvshpcc.supabase.co') {
      return 'Bitte einen externen Bildhoster verwenden. Nexus-Speicher ist für Bilder nicht vorgesehen.'
    }
    return null
  } catch {
    return 'Der Bildlink ist keine gültige URL.'
  }
}

export default function OrganizationExternalMediaMount() {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    const syncTarget = () => {
      const next = document.querySelector('.org-media-grid')
      setTarget((current) => current === next ? current : next)
    }

    syncTarget()
    const observer = new MutationObserver(syncTarget)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  if (!target) return null
  return createPortal(<ExternalMediaEditor />, target)
}

function ExternalMediaEditor() {
  const [organization, setOrganization] = useState<OrganizationContext | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error: contextError } = await supabase.rpc('organization_management_get_context')
    const rows = Array.isArray(data) ? data as OrganizationContext[] : []
    const selectedId = currentOrganizationId()
    const next = rows.find((item) => item.organization_id === selectedId) ?? rows[0] ?? null

    if (contextError || !next) {
      setOrganization(null)
      setError('Die Bildverwaltung konnte gerade nicht geladen werden.')
      setLoading(false)
      return
    }

    setOrganization(next)
    setLogoUrl(next.logo_url ?? '')
    setBannerUrl(next.banner_url ?? '')
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()

    const onChange = (event: Event) => {
      const element = event.target as Element | null
      if (element?.matches('.org-control-select select')) void load()
    }

    document.addEventListener('change', onChange)
    return () => document.removeEventListener('change', onChange)
  }, [load])

  const save = async () => {
    if (!organization) return

    const logoError = validateExternalImageUrl(logoUrl)
    const bannerError = validateExternalImageUrl(bannerUrl)
    if (logoError || bannerError) {
      setError(logoError ?? bannerError ?? 'Bitte die Bildlinks prüfen.')
      return
    }

    setWorking(true)
    setError('')
    setNotice('')

    const { error: saveError } = await supabase.rpc('organization_management_save_profile', {
      target_org: organization.organization_id,
      expected_row_version: organization.row_version,
      new_name: organization.name,
      new_short_name: organization.short_name,
      new_description: organization.description,
      new_phone: organization.phone,
      new_public_email: organization.public_email,
      new_location_label: organization.location_label,
      new_logo_url: logoUrl.trim() || null,
      new_banner_url: bannerUrl.trim() || null,
      new_is_public: organization.is_public,
    })

    setWorking(false)
    if (saveError) {
      setError(saveError.message?.includes('conflict')
        ? 'Die Organisation wurde inzwischen geändert. Bitte aktualisieren.'
        : 'Die Bildlinks konnten nicht gespeichert werden.')
      return
    }

    setNotice('Bildlinks gespeichert.')
    await load()
  }

  return (
    <div className="org-external-media-editor">
      <div className="org-external-media-info">
        <div>
          <span className="eyebrow">EXTERNE BILDER</span>
          <strong>Bilder über einen Hoster einbinden</strong>
          <p>Nexus speichert keine Bilddateien. Hinterlege hier direkte https://-Links zu Logo und Titelbild.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading || working}><RefreshCw size={14} /> Aktualisieren</button>
      </div>

      {error ? <div className="org-control-message is-error">{error}</div> : null}
      {notice ? <div className="org-control-message is-success"><Check size={14} /> {notice}</div> : null}

      {loading || !organization ? (
        <div className="org-control-empty">Bildverwaltung wird geladen …</div>
      ) : (
        <div className="org-external-media-grid">
          <ExternalImageCard
            title="Logo"
            description="Am besten quadratisch. Wird im Stadtverzeichnis und im Organisationsprofil angezeigt."
            value={logoUrl}
            onChange={setLogoUrl}
          />
          <ExternalImageCard
            title="Titelbild"
            description="Breites Bild für die Detailansicht der Organisation."
            value={bannerUrl}
            onChange={setBannerUrl}
            banner
          />
        </div>
      )}

      {!loading && organization ? (
        <div className="org-control-actions">
          <button className="primary-button" type="button" onClick={() => void save()} disabled={working}>
            <Link2 size={14} /> {working ? 'Speichert …' : 'Bildlinks speichern'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function ExternalImageCard({ title, description, value, onChange, banner = false }: {
  title: string
  description: string
  value: string
  onChange: (value: string) => void
  banner?: boolean
}) {
  const validationError = validateExternalImageUrl(value)
  const previewUrl = value.trim() && !validationError ? value.trim() : ''

  return (
    <article className="org-external-image-card">
      <div className={`org-external-image-preview ${banner ? 'is-banner' : ''}`} style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined}>
        {!previewUrl ? <ImagePlus size={28} /> : null}
      </div>
      <div className="org-external-image-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <label className="org-external-image-input">
        <span><Link2 size={13} /> Bild-URL</span>
        <input
          type="url"
          inputMode="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://bilder.example.de/datei.webp"
        />
      </label>
      {validationError ? <small className="org-external-image-error">{validationError}</small> : null}
      <small className="org-external-image-hint">Feld leeren, um das Bild zu entfernen.</small>
    </article>
  )
}
