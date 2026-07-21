// Service Worker for 每日播客早报
const CACHE_NAME = 'podcast-daily-v1';
const ASSETS = ['./index.html', './daily_playlist.html', './manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // 只缓存同源 GET 请求，不拦截音频流
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // 跳过音频文件
  if (e.request.destination === 'audio' || url.pathname.endsWith('.mp3') || url.pathname.endsWith('.m4a')) return;
  
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
