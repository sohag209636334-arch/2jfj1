const CACHE_NAME = 'v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './config.js',
    './pwa.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
];

// تخزين الملفات في الكاش عند التثبيت
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// حذف الكاش القديم عند التحديث
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
});

// استراتيجية Cache First مع جلب وتخزين الملفات الجديدة
self.addEventListener('fetch', (event) => {
    // تجاهل طلبات قواعد البيانات (Firebase) من التخزين في الكاش العادي
    if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // إذا الملف موجود في الكاش، يرجع من الكاش
            if (response) {
                return response;
            }
            // إذا غير موجود، يجلبه من الإنترنت ويخزنه في الكاش
            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // إذا المستخدم Offline والملف غير موجود، يرجع index.html
                if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
