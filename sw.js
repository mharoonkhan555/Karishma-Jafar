const CACHE_NAME = 'karishma-jafar-v1';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      return caches.open(CACHE_NAME).then(c => {
        if(e.request.method === 'GET' && res.status === 200) c.put(e.request, res.clone());
        return res;
      });
    })).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : null)
  );
});