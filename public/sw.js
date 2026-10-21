// DitakNet PWA Service Worker for Windows & Modern Browsers
const CACHE_NAME = 'ditaknet-v2-cache';
const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Continue even if initial precache fails for some resources
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests, ignore chrome-extension / non-http
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Network-first strategy for API routes and dynamic pages, fallback to cache
  if (request.url.includes('/api/')) {
    return; // Pass through directly to server
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone and store valid GET responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })
  );
});
