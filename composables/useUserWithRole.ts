import type { User } from '../types/User'
export const useUserWithRole = async () => {
  const { findOne } = useStrapi()
  const userWithoutRole = useStrapiUser()
	const user = ref(null) as Ref<User | null>
	const { fetchUser } = useStrapiAuth()
	//const fetchedUser = await fetchUser()
	//console.log(fetchedUser)
	//console.log(userWithoutRole)
	if (!userWithoutRole.value) {
			try {
				await fetchUser()
			} catch (e) {
				console.warn('User konnte nicht geladen werden:', e)
			}
	}else{
		user.value = await findOne('users', userWithoutRole.value.id, {
			populate: ['role']
		})
	}
	watch(
		() => userWithoutRole.value?.id,
		async (newId, oldId) => {
			if (newId && newId !== oldId) {
				user.value = await findOne('users', newId, {
					populate: ['role']
				})
			}
		},
		{ immediate: true }
	)

  return user
}