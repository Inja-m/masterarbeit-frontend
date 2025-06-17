self.addEventListener('push', onPush);

function onPush(event) {
  console.log('[SW] push event empfangen');

  if (!event.data) return;

  const data = event.data.json();
  const { title, ...rest } = data;

  const promise = (async () => {
    const clientList = await self.clients.matchAll({ includeUncontrolled: true });
    clientList.forEach((client) => {
      client.postMessage(data);
    });

    await self.registration.showNotification(title, {
      ...rest,
    });
  })();

  event.waitUntil(promise);
}