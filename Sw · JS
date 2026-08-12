// MoneyBook 서비스워커 (PWA 설치 + 앱 껍데기 캐시)
const CACHE = 'moneybook-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  // 데이터(Apps Script) 요청은 항상 네트워크로
  if (url.indexOf('script.google.com') > -1 || url.indexOf('googleusercontent.com') > -1) return;
  // 앱 껍데기는 캐시 우선
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});