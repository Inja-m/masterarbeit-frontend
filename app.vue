<template>
  <VitePwaManifest />
  <UApp>
    <NuxtLayout>
      <!--<div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Push-Benachrichtigungen</h1>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="registerPush"
        >
          Benachrichtigungen aktivieren
        </button>
        <button @click="sendPush">Push senden</button>
      </div>-->
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { fetchNotifications } = useNotifications()
onMounted(async () => {
  if ('serviceWorker' in navigator) {
    console.log('[App] Service Worker registriert')

    // Warte, bis er "ready" und kontrollierend ist
    navigator.serviceWorker.ready.then(() => {
      console.log('[App] Service Worker ist ready')

      // Nur jetzt ergibt der Message-Listener Sinn
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[Client] Push-Nachricht empfangen:', event.data)
        fetchNotifications()
      })
    })
  }
})
//import { urlBase64ToUint8Array } from './utils/urlBase64ToUint8Array'
//const client = useStrapiClient()

//const registerPush = async () => {
//  if (!('serviceWorker' in navigator)) {
//    console.warn('Service Worker wird nicht unterstützt.')
//    return
//  }

//  const permission = await Notification.requestPermission()
//  if (permission !== 'granted') {
//    console.warn('Benachrichtigung nicht erlaubt')
//    return
//  }

//  const registration = await navigator.serviceWorker.ready

//  try {
//    const config = useRuntimeConfig()

//    const subscription = await registration.pushManager.subscribe({
//      userVisibleOnly: true,
//      applicationServerKey: urlBase64ToUint8Array(config.public.vapidPublicKey)
//    })

//    console.log('Push Subscription:', subscription)
//    const user = useStrapiUser()
//    console.log(user.value)

//    // Subscription an dein Backend senden
//    await client('/subscribe', { method: 'POST', body: subscription.toJSON() })

//    console.log('Subscription erfolgreich gesendet!')
//  } catch (err) {
//    console.error('Fehler bei Push-Registrierung:', err)
//  }
//}
//const sendPush = async () => {
//  const permission = await Notification.requestPermission()
//  console.log('Permission:', permission)
//  try {
//    await client('/send', { method: 'POST',body: {
//    title: 'Hello!',
//    body: 'Dies ist dynamisch',
//    url: '/profile'
//  } })
//    console.log('Push wurde ausgelöst')
//  } catch (err) {
//    console.error('Fehler beim Push senden:', err)
//  }
//}

</script>
