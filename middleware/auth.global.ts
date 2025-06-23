export default defineNuxtRouteMiddleware(async (to) => {
	//console.log('[Middleware aktiv]', to.fullPath)
  // Seite /login überspringen
  if (to.path === '/login') return
	
    const { fetchUser } = useStrapiAuth()
  const user = useStrapiUser()

  if (!user.value) {
    try {
      await fetchUser()
    } catch (e) {
			console.error('Auth Kein User', e)
      // Bei SSR: Kein Cookie oder ungültiges Token → kein User
    }
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})