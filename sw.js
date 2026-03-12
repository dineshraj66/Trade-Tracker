/* Trade Tracker – Service Worker v4 */
const CACHE = 'trade-tracker-v4';

const PRECACHE = [
  './index.html',
  './firebase-config.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png'
];

/* Install: precache app shell */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* Activate: delete ALL old caches, claim clients immediately */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Fetch: network-first for HTML (always get fresh index.html), cache-first for assets */
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Always network-first for Firebase
  if (url.includes('firebase') || url.includes('googleapis.com')) {
    return;
  }

  // Network-first for HTML pages — ensures latest index.html always loads
  if (e.request.mode === 'navigate' || url.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for everything else (icons, fonts, CDN scripts)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
