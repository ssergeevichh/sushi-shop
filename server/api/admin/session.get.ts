import type { AdminSessionResponse } from '../../../app/types/admin'

export default defineEventHandler(async (event): Promise<AdminSessionResponse> => {
  const { user } = await requireAdmin(event)

  return {
    user: {
      id: user.id,
      email: user.email ?? '',
    },
  }
})
