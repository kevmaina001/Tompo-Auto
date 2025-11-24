const CACHE_NAME = 'tompos-auto-v1';
const ADMIN_CACHE_NAME = 'tompos-admin-v1';

// Assets to cache for the store
const STORE_ASSETS = [
  '/',
  '/logo.png',
  '/og-image.png',
];

// Assets to cache for admin
const ADMIN_ASSETS = [
  '/admin',
  '/logo.png',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STORE_ASSETS)),
      caches.open(ADMIN_CACHE_NAME).then((cache) => cache.addAll(ADMIN_ASSETS)),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== ADMIN_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests and Convex requests
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('convex.cloud') ||
      event.request.url.includes('clerk.')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          const cacheName = event.request.url.includes('/admin') ? ADMIN_CACHE_NAME : CACHE_NAME;
          caches.open(cacheName).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If no cache and it's a navigation request, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }

          return new Response('Offline', { status: 503 });
        });
      })
  );
});
