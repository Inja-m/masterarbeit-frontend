self.addEventListener('push', onPush);

function onPush(event) {
  console.log('[SW] push event empfangen');

  if (!event.data) return;

  const data = event.data.json();
  const { title,url, ...rest } = data;

  const promise = (async () => {
    const clientList = await self.clients.matchAll({ includeUncontrolled: true });
    clientList.forEach((client) => {
      client.postMessage(data);
    });

    await self.registration.showNotification(title, {
      ...rest,
			data: { url }
    });
  })();

  event.waitUntil(promise);
}
self.addEventListener('notificationclick', event => {
	  console.log('[SW] click');
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});