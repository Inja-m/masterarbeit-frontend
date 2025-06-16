export const useUserWithRole = async () => {
  const { findOne } = useStrapi()
  const userWithoutRole = useStrapiUser()
	const user = ref(null)

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


  //if (!userWithoutRole.value?.id) return null
	//const user = await findOne('users', userWithoutRole.value.id, {
  //  populate: ['role']
  //})
  return user
}