import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const nexusSupabaseUrl = 'https://pfbjblrtwpnhsuvshpcc.supabase.co'
export const nexusSupabasePublishableKey = 'sb_publishable_-UD_eG0phDb3tXpaudPpVA_kNCFukOy'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? nexusSupabaseUrl
const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? nexusSupabasePublishableKey

// The publishable key is intentionally safe for browser use. All protected data
// remains guarded by Supabase Auth, RLS and permission-checked RPCs.
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
}) as SupabaseClient

export const nexusAuthEmail = (username: string) => `${username.trim().toLowerCase()}@auth.nexus.ls`

type RegistrationPayload = {
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string
  password: string
}

type RegistrationResponse = {
  ok?: boolean
  userId?: string
  username?: string
  accountStatus?: string
  message?: string
  error?: string
}

export async function registerNexusUser(payload: RegistrationPayload): Promise<RegistrationResponse> {
  const response = await fetch(`${supabaseUrl}/functions/v1/register-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabasePublishableKey,
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as RegistrationResponse
  if (!response.ok) throw new Error(data.error ?? 'Die Registrierung konnte nicht abgeschlossen werden.')
  return data
}
