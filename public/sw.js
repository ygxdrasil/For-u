/**
 * Grace's service worker.
 *
 * It exists for one reason: a push message has to be received by something
 * that is running when the page is not. It caches nothing and intercepts no
 * requests — an assistant serving a stale copy of herself would be worse than
 * one that is briefly offline.
 */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

/**
 * A fetch handler that handles nothing.
 *
 * Required, and only required: a browser will not offer to install a site
 * whose worker has no fetch listener, and it refuses silently — no prompt, no
 * warning, nothing to read. Returning without calling respondWith leaves every
 * request to the network exactly as if this were not here, which is the
 * behaviour that matters. She must never serve a cached copy of herself.
 */
self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  let title = 'Grace';
  let body = 'Something wants you.';

  try {
    const data = event.data ? event.data.json() : null;
    if (data && typeof data.body === 'string') {
      body = data.body;
      if (typeof data.title === 'string') title = data.title;
    }
  } catch {
    // A payload that won't parse still deserves to reach the person.
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      // Replaces rather than stacks: three taps of the same nudge is a
      // notification tray nobody reads.
      tag: 'grace',
      renotify: true,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({type: 'window', includeUncontrolled: true}).then((windows) => {
      // Focus the page if it is already open somewhere rather than opening a
      // second copy of her.
      for (const client of windows) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow('/');
    }),
  );
});
