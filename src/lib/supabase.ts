import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const defaultSupabaseUrl = 'https://pfbjblrtwpnhsuvshpcc.supabase.co'
const defaultSupabasePublishableKey = 'sb_publishable_-UD_eG0phDb3tXpaudPpVA_kNCFukOy'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? defaultSupabaseUrl
const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? defaultSupabasePublishableKey

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
