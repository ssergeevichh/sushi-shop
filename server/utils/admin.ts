import type { H3Event } from 'h3'
import type { OrderStatus } from '../../app/types/admin'

export const orderStatuses: readonly OrderStatus[] = [
  'new',
  'confirmed',
  'preparing',
  'ready',
  'delivering',
  'completed',
  'cancelled',
]

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function requireAdmin(event: H3Event) {
  const authorization = getHeader(event, 'authorization')
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Потрібно увійти до адмін-панелі',
    })
  }

  const supabase = createServerSupabaseClient()
  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)

  if (authError || !authData.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Сесія завершилася. Увійди ще раз.',
    })
  }

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', authData.user.id)
    .maybeSingle()

  if (adminError) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Не вдалося перевірити доступ адміністратора',
    })
  }

  if (!admin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Немає доступу до адмін-панелі',
    })
  }

  return {
    supabase,
    user: authData.user,
  }
}
