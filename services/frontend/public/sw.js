// SyncSpace service worker: makes the app installable and usable offline.
// It sits between the page and the network, and keeps a copy of the app in a cache.
//
// - Pages (HTML): network first, so you always get the latest version.
//   Offline → the cached app shell (index.html), and React Router shows the right page.
// - Built files (/assets/…: JS, CSS, images): cache first. Their names contain a hash that
//   changes on every build, so a cached copy is never outdated.
// - Everything else from our site: network first, cache as a fallback.
// Change VERSION to throw away old caches after a big update.

const VERSION = "syncspace-v1";
const APP_SHELL = ["/", "/index.html", "/syncspace-logo.svg", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

// 1. Install: save the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting(); // use this new version right away
});

// 2. Activate: delete caches from older versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
  );
  self.clients.claim(); // control the pages that are already open
});

// Save a copy of a good response in the cache
async function save(request, response) {
  if (response.ok) {
    const cache = await caches.open(VERSION);
    await cache.put(request, response.clone());
  }
  return response;
}

// 3. Fetch: decide where each request is answered from
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only our own GET requests (never the backend API, WebSockets or other sites)
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api")) return;

  if (request.mode === "navigate") {
    // Pages: network first, offline → the app shell
    event.respondWith(
      fetch(request)
        .then((response) => save("/index.html", response))
        .catch(() => caches.match("/index.html"))
    );
  } else if (url.pathname.startsWith("/assets/")) {
    // Built files: cache first
    event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request).then((r) => save(request, r))));
  } else {
    // Other files: network first, cache as a fallback
    event.respondWith(
      fetch(request)
        .then((response) => save(request, response))
        .catch(() => caches.match(request))
    );
  }
});
