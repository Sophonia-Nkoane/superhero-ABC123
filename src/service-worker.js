const scope = '/';

// Register the Service Worker
navigator.serviceWorker.register('service-worker.js', { scope });

// Define the cache
const cache = await caches.open('my-cache');

// Cache resources
cache.add('/index.html');
cache.add('/alphabet.html');
cache.add('/numbers.html');
cache.add('/sentence-building.html');
cache.add('/word-families.html');
cache.add('/styles.css');
cache.add('/scripts.js');

// Handle network requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Install and activate the Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/index.html',
        '/styles.css',
        '/scripts.js',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== 'my-cache') {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
