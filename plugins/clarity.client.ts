export default defineNuxtPlugin(() => {

  const consent = useCookie('cookie-consent')
  const hasConsent = computed(() => consent.value === 'clarity-consent')

  if (import.meta.env.MODE === 'production' && hasConsent.value) {
    const { proxy } = useScriptClarity({id: useRuntimeConfig().public.scripts.clarity.id})
  } else {
    console.log('[Clarity Plugin] Clarity wird **nicht** geladen. ENV:', import.meta.env, 'Consent:', consent.value)
  }
})