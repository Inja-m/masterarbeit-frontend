export const useConsentManager = () => {
  // Consent wird dauerhaft gespeichert
  const cookieConsent = useCookie<'idle' | 'essential' | 'consent' >('cookie-consent', {
    default: () => 'idle',
    maxAge: 60 * 60 * 24 * 365 // 1 Jahr
  })

  const trigger = useScriptTriggerConsent({
    consent: computed(() => cookieConsent.value === 'consent')
  })

  const acceptClarity = () => {
    cookieConsent.value = 'consent'
    trigger.accept()
		console.log('accept')
		//const uid = localStorage.getItem('clarity_uid') ?? crypto.randomUUID()
    //  localStorage.setItem('clarity_uid', uid)

    //  const { proxy } = useScriptClarity({
    //    id: useRuntimeConfig().public.scripts.clarity.id
    //  })

    //  proxy.clarity('consent')
    //  console.log('[Clarity] Initialisiert mit UID:', uid)
		//console.log(proxy)
  }

  return {
    status: cookieConsent,
    acceptClarity,
    isClarityAccepted: computed(() => cookieConsent.value === 'consent'),
    isIdle: computed(() => cookieConsent.value === 'idle'),
    trigger
  }
}