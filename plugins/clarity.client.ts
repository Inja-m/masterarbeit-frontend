//export const useClarityWithConsent = () => {
//	const clarityConsent = useCookie('clarity-consent')
//	const hasConsent = clarityConsent.value === 'true'
//	const id = ref('')
//console.log('hier')
//	if (import.meta.client && hasConsent && import.meta.env.PROD) {
//		if(hasConsent){
//			id.value = useRuntimeConfig().public.scripts.clarity.id
//		}
//		const { proxy } = useScriptClarity({
//			id: id.value
//		})

//		return { clarity: proxy.clarity }
//	}

//	return { clarity: (..._args: any[]) => {} } // Fallback für SSR/dev/kein Consent
//}
export default defineNuxtPlugin(() => {
  console.log('[Clarity Plugin] clarity.client.ts wurde geladen.')

  if (import.meta.env.SSR) {
    console.warn('[Clarity Plugin] ⚠️ Wird auf dem Server ausgeführt (sollte nicht passieren!)')
  } else {
    console.log('[Clarity Plugin] ✅ Läuft auf dem Client.')
  }

  const consent = useCookie('clarity-consent')
  const hasConsent = computed(() => consent.value === 'true')

  if (import.meta.env.PROD && hasConsent.value) {
    console.log('[Clarity Plugin] Consent vorhanden. Lade Clarity…')

    const { proxy } = useScriptClarity({id: useRuntimeConfig().public.scripts.clarity.id})
		console.log(proxy)
  } else {
    console.log('[Clarity Plugin] Clarity wird **nicht** geladen. ENV:', import.meta.env.MODE, 'Consent:', consent.value)
  }
})