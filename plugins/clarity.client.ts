

//export default defineNuxtPlugin(async () => {
//	const { fetchUser } = useStrapiAuth()
//  const consent = useCookie('cookie-consent')
//  const hasConsent = computed(() => consent.value === 'clarity-consent')

//  if (import.meta.env.MODE === 'production' && hasConsent.value) {	
//		console.log('window',window.clarityInitialized)
//		if (!window.clarityInitialized) {
//    const { proxy } = useScriptClarity({id: useRuntimeConfig().public.scripts.clarity.id})
//		const user = await fetchUser()
//		if(user?.value) proxy.clarity('identify', user?.value?.documentId)
//			console.log('user',  user?.value?.documentId)
//		window.clarityInitialized = true
//    }
//  } else {
//    console.log('[Clarity Plugin] Clarity wird **nicht** geladen. ENV:', import.meta.env, 'Consent:', consent.value)
//  }
	
//})

export default () => {
  const consent = useCookie('cookie-consent')
	const hasConsent = computed(() => consent.value === 'clarity-consent')
	const { fetchUser } = useStrapiAuth()

  watch(consent, async (val) => {
		console.log(val)
     if (import.meta.env.MODE === 'production' && hasConsent.value) {	

    const { proxy } = useScriptClarity({id: useRuntimeConfig().public.scripts.clarity.id})
		const user = await fetchUser()
		if(user?.value) proxy.clarity('identify', user?.value?.documentId)
			console.log('user',  user?.value?.documentId)
    
  } else {
    console.log('[Clarity Plugin] Clarity wird **nicht** geladen. ENV:', import.meta.env, 'Consent:', consent.value)
  }
  }, { immediate: true })
}