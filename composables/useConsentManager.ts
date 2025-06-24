export const useConsentManager = () => {
  // Consent wird dauerhaft gespeichert
  const cookieConsent = useCookie<'idle' | 'essential' | 'clarity-consent' >('cookie-consent', {
    default: () => 'idle',
    maxAge: 60 * 60 * 24 * 365 // 1 Jahr
  })

  const trigger = useScriptTriggerConsent({
    consent: computed(() => cookieConsent.value === 'clarity-consent')
  })

  const acceptClarity = () => {
    cookieConsent.value = 'clarity-consent'
    trigger.accept()
		console.log('accept')
		const {proxy} = useScriptClarity({id: useRuntimeConfig().public.scripts.clarity.id})
		console.log(proxy)
  }

  return {
    status: cookieConsent,
    acceptClarity,
    isClarityAccepted: computed(() => cookieConsent.value === 'clarity-consent'),
    isIdle: computed(() => cookieConsent.value === 'idle'),
    trigger
  }
}