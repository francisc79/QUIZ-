const CACHE_NAME = 'quiz-biblico-v2';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './questions.json',
  './manifest.json',
  './img/icon.png',
  './img/biblia.png',
  './img/justica.png',
  './sound/amazing-grace-instrumental-145357.mp3',
  './sound/correct-156911.mp3',
  './sound/error-08-206492.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});