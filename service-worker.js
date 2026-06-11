/* Voltek Energy Vendor — Service Worker (PWA)
 * Strategy:
 *  - App shell (HTML/JS/CSS/icons): cache-first with background update (stale-while-revalidate)
 *  - Data APIs (Supabase, Jodoo, geocoders): network-only — never cache live job/photo data
 *  - Offline fallback: last cached app shell keeps the UI loading without network
 */
const CACHE = "vev-shell-v1";
const SHELL = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const NEVER_CACHE = [
  "supabase.co",
  "jodoo.com",
  "jiandaoyun.com",
  "nominatim.openstreetmap.org",
  "photon.komoot.io",
];

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Never intercept non-GET or live data APIs
  if (e.request.method !== "GET" || NEVER_CACHE.some((h) => url.hostname.includes(h))) return;

  // Navigations: network first, fall back to cached shell when offline
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Static assets (same-origin + font CDNs): stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200 && (url.origin === self.location.origin || url.hostname.includes("fonts."))) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
