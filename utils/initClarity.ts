
export const initClarity = async () => {
	if (import.meta.env.MODE !== 'production') return
	const { fetchUser } = useStrapiAuth()
	const user = await fetchUser()
 	const consent = useCookie('cookie-consent')
  const { proxy } = useScriptClarity({
    id: useRuntimeConfig().public.scripts.clarity.id
  })

	watch(() => consent.value,
				(newVal) => {
					proxy.clarity('consent', computed(() => newVal === 'consent' ))
				},
				{ immediate: true }
			)
	watch(() => user.value,
				(newVal) => {
					if(newVal){
						proxy.clarity('identify', newVal.documentId)
						console.log('proxy', proxy)
					}
				},
				{ immediate: true }
			)		
					
}
