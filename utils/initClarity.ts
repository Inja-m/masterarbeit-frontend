
export const initClarity = () => {
	if (import.meta.env.MODE !== 'production') return
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
	const uid = localStorage.getItem('clarity_uid') ?? crypto.randomUUID()
          localStorage.setItem('clarity_uid', uid)
          proxy.clarity('identify', uid)

					console.log('proxy', proxy)
}
