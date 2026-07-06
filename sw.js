const urlsToCache = [
    './',
    './index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    console.log('[Service Worker] Installed + Cached');
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activated');
});

const CACHE_NAME = 'mcaquest-cache-v1';

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then((fetchResponse) => {
                    if (!fetchResponse || fetchResponse.status !== 200 ||
                        (fetchResponse.type !== 'basic' && fetchResponse.type !== 'cors')) {
                        return fetchResponse;
                    }
                    var responseToCache = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, responseToCache));
                    return fetchResponse;
                });
            })
    );
});
