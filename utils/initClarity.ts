
export const initClarity = async () => {
	if (import.meta.env.MODE !== 'production') return
	const user = useStrapiUser()
 	const consent = useCookie('cookie-consent')
  const { proxy } = useScriptClarity({
    id: useRuntimeConfig().public.scripts.clarity.id
  })
console.log(user)
	watch(() => consent.value,
				(newVal) => {
					proxy.clarity('consent', computed(() => newVal === 'consent' ))
				},
				{ immediate: true }
			)
	watch(user, (newVal) => {
		if (newVal) {
			proxy.clarity('identify', newVal.documentId)
			console.log('proxy', proxy)
		}
	}, { immediate: true })
					
}
