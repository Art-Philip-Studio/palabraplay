// sw.js — Service Worker de PalabraPlay
// Objetivo: habilitar "Instalar app" / "Agregar a pantalla de inicio" en
// Android/Chrome (que exige un Service Worker activo) y dar un mínimo
// de caché para que el sitio abra más rápido en visitas repetidas.

const CACHE_NAME = 'palabraplay-cache-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

// Estrategia: red primero, y si falla (sin conexión) se sirve de caché.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Solo cachear respuestas válidas del mismo origen
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, clone);
          }
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
