export default defineNuxtRouteMiddleware(async (to) => {
	console.log('[Middleware aktiv]', to.fullPath)
  // Seite /login überspringen
  if (to.path === '/login') return
	
  const token = useStrapiToken()
  if (!token.value) {
		console.log('kein Token')
    return navigateTo('/login')
  }
})