const CACHE_NAME = 'meal-log-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-512x512.png'
];

// Installationsfasen: Sparar filerna i enhetens cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
        .then(() => self.skipWaiting())
    );
});

// Aktiveringsfasen: Rensar gammal cache om du uppdaterar appen i framtiden
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Hämtningsfasen: Serverar appen från cache om du är offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // Returnera den cachade filen, annars hämta från nätverket
            return response || fetch(event.request);
        })
    );
});
