import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear, actionable message instead of a cryptic crash deep in a
  // server component render (which previously took down the whole page).
  console.error(
    '[supabase] Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
  );
}

let client: SupabaseClient | null = null;

/**
 * Single shared public (anon) client. This is the read-only client used for
 * site content; it deliberately does NOT persist a session. The admin auth
 * client lives in lib/supabase-admin.ts and is the only one that manages a
 * session — keeping persistSession off here prevents a second GoTrueClient
 * from registering in the browser ("Multiple GoTrueClient instances detected").
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      // Fall back to harmless placeholders so importing this module never
      // throws at eval time; queries fail and data fetchers return fallbacks.
      supabaseUrl ?? 'http://localhost:54321',
      supabaseAnonKey ?? 'public-anon-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }
  return client;
}

/** Backwards-compatible singleton instance used across lib/data.ts. */
export const supabase = getSupabaseClient();
