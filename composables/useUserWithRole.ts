export const useUserWithRole = async () => {
  const { findOne } = useStrapi()
  const user = useStrapiUser()
  if (!user.value?.id) return null
	
  return await findOne('users', user.value.id, {
    populate: ['role']
  })
}