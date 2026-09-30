// sw.js — Service Worker de PalabraPlay (v2)
// - Hace la página instalable como app (PWA)
// - Cachea archivos propios para abrir rápido y funcionar sin internet
// - NO toca anuncios, chat de soporte ni otros dominios

const CACHE_NAME = 'palabraplay-cache-v2';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/pwa.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(CORE_ASSETS.map((u) => cache.add(u).catch(() => {}))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Solo manejamos archivos de nuestro propio dominio (deja pasar anuncios, chat, fuentes, etc.)
  if (url.origin !== self.location.origin) return;

  // Páginas HTML: red primero (siempre lo más nuevo); sin internet -> caché -> página offline
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/offline.html')))
    );
    return;
  }

  // Resto (css, js, imágenes): caché primero y se actualiza en segundo plano
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
