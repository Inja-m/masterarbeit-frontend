import { initClarity } from '~/utils/initClarity'

export default defineNuxtPlugin(async () => {
  const consent = useCookie('cookie-consent')
	 if (import.meta.env.MODE === 'production') {
       watch(
      () => consent.value,
      (newVal, oldVal) => {
				console.log(newVal, oldVal)
        if (newVal === 'consent' && oldVal !== 'consent') {
          initClarity()
        }
      },
      { immediate: true }
    )
	}
  })
