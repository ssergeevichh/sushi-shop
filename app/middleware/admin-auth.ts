export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const { verifySession } = useAdminAuth()
  const isAdmin = await verifySession()

  if (!isAdmin) {
    return navigateTo({
      path: '/admin/login',
      query: { redirect: to.fullPath },
    })
  }
})
