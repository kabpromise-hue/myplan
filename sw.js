// sw.js — must be served from the root of your site (same folder as index.html)
// This runs in the background, separate from your page, which is what lets
// notifications arrive even when the site isn't open in a tab.

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = {}; }

  const title = data.title || 'Weekly';
  const options = {
    body: data.body || 'You have something coming up.',
    icon: data.icon || '/favicon.jpg',
    badge: '/favicon.jpg',
    tag: data.tag || undefined,      // same tag replaces older notification instead of stacking
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Clicking the notification focuses/opens the site
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});