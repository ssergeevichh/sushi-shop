import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../app/types/database'

const serverClientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
} as const

export function createServerSupabaseClient() {
  const config = useRuntimeConfig()
  const { supabaseUrl } = config.public

  if (!supabaseUrl || !config.supabaseSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase server configuration is missing',
    })
  }

  return createClient<Database>(
    supabaseUrl,
    config.supabaseSecretKey,
    serverClientOptions,
  )
}
