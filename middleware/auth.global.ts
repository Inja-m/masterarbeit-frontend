export default defineNuxtRouteMiddleware(async (to) => {
  // Seite /login überspringen    
const { logout, fetchUser } = useStrapiAuth()
  const user = useStrapiUser()

  if (!user.value) {
    try {
      await fetchUser()
    } catch (e) {
			console.error('Auth Kein User', e)
      // Bei SSR: Kein Cookie oder ungültiges Token → kein User
    }
  }
  if (to.path === '/login') {
		if(user.value) await logout()
		return
	}else if(to.path === '/datenschutz' || to.path === '/impressum' )	return

  if (!user.value) {
    return navigateTo('/login')
  }
})