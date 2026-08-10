import { createClient } from 'npm:@supabase/supabase-js@2'

const allowedOrigins = new Set([
  'https://michaeltimmler91-jpg.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const jsonHeaders = (origin: string | null) => ({
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'https://michaeltimmler91-jpg.github.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
})

const respond = (origin: string | null, status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), { status, headers: jsonHeaders(origin) })

const normalizeUsername = (value: unknown) => String(value ?? '').trim().toLowerCase()
const normalizeName = (value: unknown) => String(value ?? '').trim().replace(/\s+/g, ' ')

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')

  if (req.method === 'OPTIONS') {
    if (origin && !allowedOrigins.has(origin)) return respond(origin, 403, { error: 'Origin nicht erlaubt.' })
    return new Response('ok', { headers: jsonHeaders(origin) })
  }

  if (req.method !== 'POST') return respond(origin, 405, { error: 'Methode nicht erlaubt.' })
  if (origin && !allowedOrigins.has(origin)) return respond(origin, 403, { error: 'Origin nicht erlaubt.' })

  try {
    const body = await req.json()
    const username = normalizeUsername(body.username)
    const firstName = normalizeName(body.firstName)
    const lastName = normalizeName(body.lastName)
    const dateOfBirth = String(body.dateOfBirth ?? '').trim()
    const password = String(body.password ?? '')

    if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
      return respond(origin, 400, { error: 'Der Benutzername muss 3–32 Zeichen lang sein und darf nur Buchstaben, Zahlen, Punkt, Unterstrich und Bindestrich enthalten.' })
    }
    if (firstName.length < 2 || firstName.length > 50 || lastName.length < 2 || lastName.length > 50) {
      return respond(origin, 400, { error: 'Bitte gib einen gültigen Vor- und Nachnamen ein.' })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || Number.isNaN(Date.parse(`${dateOfBirth}T00:00:00Z`))) {
      return respond(origin, 400, { error: 'Bitte gib ein gültiges Geburtsdatum ein.' })
    }
    if (password.length < 8 || password.length > 128) {
      return respond(origin, 400, { error: 'Das Passwort muss mindestens 8 Zeichen lang sein.' })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const secretKeysRaw = Deno.env.get('SUPABASE_SECRET_KEYS')
    if (!supabaseUrl || !secretKeysRaw) throw new Error('Supabase server environment is incomplete')

    const secretKey = JSON.parse(secretKeysRaw).default
    if (!secretKey) throw new Error('Default Supabase secret key is unavailable')

    const admin = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    const clientIp = req.headers.get('cf-connecting-ip') ?? forwardedFor ?? 'unknown'
    const throttleKey = await sha256(`register-v1:${clientIp}`)

    const { data: allowed, error: throttleError } = await admin.rpc('consume_registration_throttle', {
      throttle_key: throttleKey,
      maximum_attempts: 5,
      window_minutes: 15,
    })

    if (throttleError) throw throttleError
    if (!allowed) return respond(origin, 429, { error: 'Zu viele Registrierungsversuche. Bitte versuche es später erneut.' })

    const { data: duplicateProfile, error: duplicateError } = await admin
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .maybeSingle()

    if (duplicateError) throw duplicateError
    if (duplicateProfile) return respond(origin, 409, { error: 'Dieser Benutzername ist bereits vergeben.' })

    const authEmail = `${username}@auth.nexus.ls`
    const { data, error } = await admin.auth.admin.createUser({
      email: authEmail,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
      },
      app_metadata: {
        registration_source: 'nexus_edge_v1',
      },
    })

    if (error) {
      const duplicate = /already|registered|exists|duplicate/i.test(error.message)
      return respond(origin, duplicate ? 409 : 400, {
        error: duplicate ? 'Dieser Benutzername ist bereits vergeben.' : 'Die Registrierung konnte nicht abgeschlossen werden.',
      })
    }

    return respond(origin, 201, {
      ok: true,
      userId: data.user.id,
      username,
      accountStatus: 'pending',
      message: 'Registrierung erfolgreich. Dein Account wartet jetzt auf Freischaltung.',
    })
  } catch (error) {
    console.error('register-user failed', error)
    return respond(origin, 500, { error: 'Die Registrierung ist momentan nicht verfügbar.' })
  }
})
