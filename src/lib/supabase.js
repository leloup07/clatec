import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (service role key — NEVER expose to the browser).
// All database access goes through API routes; the browser never talks to
// Supabase directly, and RLS denies everything to the anon key.
export function createServerClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
