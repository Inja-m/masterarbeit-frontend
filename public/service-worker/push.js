self.addEventListener('push', onPush);
console.log('[SW] push.js wurde geladen');

async function onPush(event) {
	console.log('Push-Event empfangen', event)
  if (event.data) {
    const data = event.data.json();
    const { title, ...rest } = data;

    // Send the push data to the application
    const clients = await self.clients.matchAll();
    clients.forEach((client) => client.postMessage(data));

    await event.waitUntil(
      self.registration.showNotification(title, {
        ...rest,
      }),
    );
  }
}