self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/manifest.json',
                '/js/main.js',
                '/js/config.js',
                '/js/storage.js',
                '/js/ui.js',
                '/js/pages/setup.js',
                '/js/pages/transactions.js',
                '/js/pages/reports.js',
                '/js/pages/settings.js',
                '/js/components/header.js',
                '/js/components/datePicker.js',
                '/js/state/year.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
