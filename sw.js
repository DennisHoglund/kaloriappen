// Höj versionen vid varje deploy så att telefonen hämtar nya filer.
const CACHE = 'kalori-v11';

const SHELL = [
  './',
  './index.html',
  './styles.css',
  './config.js',
  './berakning.js',
  './livsmedel.js',
  './profil.js',
  './maltid.js',
  './foto.js',
  './redigera.js',
  './idag.js',
  './data/livsmedel.json',
  './app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

const CDN_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Bibliotek och typsnitt från CDN: cache först (låsta versioner ändras aldrig)
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }

  // Allt annat externt (Supabase, bildanalys) går direkt till nätet
  if (url.origin !== self.location.origin) return;

  // Testrapporten under /rapport/ ska aldrig cachas eller blandas ihop med appen
  if (url.pathname.includes('/rapport/')) return;

  // Sidladdning: nätet först, annars cachad sida
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Egna filer: nätet först så att nya versioner alltid används
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
