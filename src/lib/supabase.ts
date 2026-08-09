import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

// Runtime may intentionally be null in preview/demo mode. App.tsx guards the
// value before use. The explicit client type keeps TypeScript from losing that
// narrowing inside the async/realtime callbacks created after the guard.
export const supabase = (
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null
) as SupabaseClient
