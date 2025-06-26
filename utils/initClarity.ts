export const initClarity = () => {
  if (typeof window === 'undefined') return

  if ((window as any).__clarityInitialized) {
    console.log('[Clarity] Bereits initialisiert')
    return
  }

  const { proxy } = useScriptClarity({
    id: useRuntimeConfig().public.scripts.clarity.id
  })

  proxy.clarity('consent')
	const uid = localStorage.getItem('clarity_uid') ?? crypto.randomUUID()
          localStorage.setItem('clarity_uid', uid)
          proxy.clarity('identify', uid)
  ;(window as any).__clarityInitialized = true
  console.log('[Clarity] Init OK')
}