/* Voltek Energy Vendor — self-retiring service worker.
 * Earlier builds cached the app shell and caused stale deploys on GitHub Pages.
 * This version unregisters itself and clears all caches, then reloads open tabs,
 * so any browser that still has the old worker heals to the latest build. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    try { const ks = await caches.keys(); await Promise.all(ks.map((k) => caches.delete(k))); } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
    try { const cs = await self.clients.matchAll(); cs.forEach((c) => c.navigate(c.url)); } catch (_) {}
  })());
});
