import type { User } from '../types/User'
export default defineNuxtRouteMiddleware(async (to) => {
  // Seite /login überspringen    
const { logout, fetchUser } = useStrapiAuth()
const { find } = useStrapi()
  const user = await  useUserWithRole() as Ref<User | null>

  if (!user.value) {
    try {
      await fetchUser()
    } catch (e) {
			console.error('Auth Kein User', e)
      // Bei SSR: Kein Cookie oder ungültiges Token → kein User
    }
  }
	if( user.value?.role?.name === 'Workshop' && to.path === '/'){
		try {
				const { data } = await find('participations', {
					filters: { user: { id: { $eq: user.value.id } } },
					populate: { workshop_group: { populate: ['workshop'] } }
				})
				return navigateTo(
					`/workshop/${data[0]?.workshop_group?.workshop?.documentId}`
				)
			} catch (e) {
				console.error('Login Workshop', e)
			}
	}
  if (to.path === '/login' ||to.path === '/passwordreset' ) {
		if(user.value) await logout()
		return
	}else if(to.path === '/datenschutz' || to.path === '/impressum' )	return

  if (!user.value) {
    return navigateTo('/login')
  }
})