

export default defineNuxtPlugin(async () => {
	const { fetchUser } = useStrapiAuth()
  const consent = useCookie('cookie-consent')
  const hasConsent = computed(() => consent.value === 'clarity-consent')

  if (import.meta.env.MODE === 'production' && hasConsent.value) {	
		if (!window.clarityInitialized) {
    const { proxy } = useScriptClarity({id: useRuntimeConfig().public.scripts.clarity.id})
		const user = await fetchUser()
		if(user.value) proxy.clarity('identify', user.value.documentId)
		window.clarityInitialized = true
    }
  } else {
    console.log('[Clarity Plugin] Clarity wird **nicht** geladen. ENV:', import.meta.env, 'Consent:', consent.value)
  }
	
})