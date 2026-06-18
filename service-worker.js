/*
 * Mage Sight — service worker (offline-first).
 * The entire app (HTML, CSS, JS, fonts) is self-contained in index.html, so the
 * precache below is the complete app — there are no external/cross-origin assets
 * to fetch. Once installed, the app runs fully offline indefinitely.
 * Bump CACHE_VERSION whenever index.html changes to push an update to installs.
 */
const CACHE_VERSION = 'mage-sight-v1.0.0';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  // Precache the whole app, then activate immediately.
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Drop old caches and take control of open clients right away.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Cache-first: serve from cache, fall back to network, then to the cached
  // app shell for navigations so the app always opens offline.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && req.url.indexOf(self.location.origin) === 0) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('./index.html');
          return cached;
        });
    })
  );
});
