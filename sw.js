// Cambia el número de versión cada vez que hagas un cambio importante (v1, v2, v3...)
const CACHE_NAME = 'zen-sudoku-v2'; 
const urlsToCache = [
  './',
  './index.html',
  './sudoku-experto.html',
  './sudokus-para-imprimir.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap'
];

// Instalación: Guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Fuerza al nuevo SW a tomar el control de inmediato
  );
});

// Activación: Borra las versiones viejas de la caché automáticamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de las pestañas abiertas
  );
});

// Estrategia: Primero red, si falla, caché (Ideal para actualizaciones frecuentes)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
