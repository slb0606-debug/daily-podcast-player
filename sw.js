// Service Worker for 每日播客早报 v2
const CACHE_NAME = 'podcast-daily-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.destination === 'audio' || url.pathname.endsWith('.mp3') || url.pathname.endsWith('.m4a')) return;

  // 纯网络优先：绝不缓存 HTML，只用缓存做离线兜底
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(() =>
      caches.match(e.request).then(r => r || caches.match('./index.html'))
    )
  );
});
