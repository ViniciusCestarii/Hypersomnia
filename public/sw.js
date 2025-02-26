self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('hypersomnia-cache').then((cache) => {
      return cache.addAll(['/', '/index.html'])
    }),
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})
