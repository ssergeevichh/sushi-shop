interface AdminFetchOptions {
  method?: 'GET' | 'PATCH'
  body?: Record<string, unknown>
  query?: Record<string, string | undefined>
}

export function useAdminFetch() {
  const { getAccessToken } = useAdminAuth()

  async function adminFetch<T>(request: string, options: AdminFetchOptions = {}) {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      await navigateTo('/admin/login')
      throw new Error('Потрібно увійти до адмін-панелі')
    }

    try {
      return await $fetch<T>(request, {
        method: options.method,
        body: options.body,
        query: options.query,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    }
    catch (error) {
      if (
        typeof error === 'object'
        && error !== null
        && 'statusCode' in error
        && (error.statusCode === 401 || error.statusCode === 403)
      ) {
        await navigateTo('/admin/login')
      }

      throw error
    }
  }

  return { adminFetch }
}
