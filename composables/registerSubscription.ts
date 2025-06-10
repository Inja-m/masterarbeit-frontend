import { urlBase64ToUint8Array } from '~/utils/urlBase64ToUint8Array'

export const useRegisterSubscription = async () => {
  const client = useStrapiClient()
  const config = useRuntimeConfig()
	const toast = useToast()

  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker nicht unterstützt.')
		toast.add({ title: 'Service Worker nicht unterstützt', color: 'error' })
    return
  }
	if(Notification.permission === 'default'){
		const permission = await Notification.requestPermission()
		if (permission !== 'granted') {
			console.warn('Benachrichtigungen nicht erlaubt.')
			toast.add({
				title: 'Benachrichtigungen deaktiviert',
				description: 'Bitte erlaube Benachrichtigungen in deinen Browser-Einstellungen.',
				color: 'warning',
				icon: 'i-lucide-bell-off',
			})
			return
		}

		const registration = await navigator.serviceWorker.ready
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(config.public.vapidPublicKey),
		})

		await client('/subscribe', {
			method: 'POST',
			body: subscription.toJSON(),
		})

		console.log('Push-Subscription erfolgreich registriert.', permission)
	}
 
}