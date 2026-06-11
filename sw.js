/* Voltek Energy Vendor — Service Worker (PWA)
 * Path-relative: works at domain root AND under subpaths (e.g. GitHub Pages project sites).
 *  - App shell: stale-while-revalidate
 *  - Data APIs (Supabase, Jodoo, geocoders): network-only — never cache live data
 *  - Offline: falls back to cached index.html
 */
const CACHE = "vev-shell-v2";
// Resolve shell URLs relative to the SW's own location (handles subpath hosting)
const BASE = new URL("./", self.location).href;
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"]
  .map((p) => new URL(p, BASE).href);
const INDEX_URL = new URL("./index.html", BASE).href;

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
  if (e.request.method !== "GET" || NEVER_CACHE.some((h) => url.hostname.includes(h))) return;

  // Navigations: network first, cached index.html when offline
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(INDEX_URL, copy));
          return res;
        })
        .catch(() => caches.match(INDEX_URL))
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
