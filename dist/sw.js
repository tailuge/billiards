self.addEventListener('install', (_event) => {
  // skipWaiting() forces the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // claim() allows an active service worker to set itself as the controller for all clients within its scope.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Transparent pass-through to the network.
  // No caching is performed as per the requirements.
  event.respondWith(fetch(event.request));
});
