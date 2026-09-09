import type { AdminSessionResponse, AdminUser } from '~/types/admin'

export function useAdminAuth() {
  const user = useState<AdminUser | null>('admin-user', () => null)
  const isChecking = useState('admin-auth-checking', () => false)

  async function getAccessToken() {
    if (import.meta.server) {
      return null
    }

    const { data, error } = await useSupabase().auth.getSession()

    if (error || !data.session?.access_token) {
      user.value = null
      return null
    }

    return data.session.access_token
  }

  async function verifySession() {
    if (import.meta.server) {
      return false
    }

    isChecking.value = true

    try {
      const accessToken = await getAccessToken()

      if (!accessToken) {
        return false
      }

      const response = await $fetch<AdminSessionResponse>('/api/admin/session', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      user.value = response.user
      return true
    }
    catch {
      user.value = null
      return false
    }
    finally {
      isChecking.value = false
    }
  }

  async function signIn(email: string, password: string) {
    const supabase = useSupabase()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error('Невірна електронна пошта або пароль')
    }

    const isAdmin = await verifySession()

    if (!isAdmin) {
      await supabase.auth.signOut()
      throw new Error('Цей обліковий запис не має доступу до адмін-панелі')
    }
  }

  async function signOut() {
    await useSupabase().auth.signOut()
    user.value = null
    await navigateTo('/admin/login')
  }

  return {
    user: readonly(user),
    isChecking: readonly(isChecking),
    getAccessToken,
    verifySession,
    signIn,
    signOut,
  }
}
