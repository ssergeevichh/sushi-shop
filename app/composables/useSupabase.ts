import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

let browserClient: SupabaseClient<Database> | undefined

export function useSupabase() {
  const config = useRuntimeConfig()
  const { supabaseUrl, supabasePublishableKey } = config.public

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase public configuration is missing')
  }

  if (import.meta.client) {
    browserClient ??= createClient<Database>(
      supabaseUrl,
      supabasePublishableKey,
    )

    return browserClient
  }

  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}
