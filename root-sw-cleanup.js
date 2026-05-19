const LEGACY_CACHE_PREFIXES = [
  "minesweeper-pwa-",
  "linuxdo-mall-",
  "mall-"
];

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(cleanupAndUnregister());
});

self.addEventListener("fetch", () => {
  // Intentionally no respondWith: the mall must always use live network/API responses.
});

async function cleanupAndUnregister() {
  await self.clients.claim();
  if (self.caches) {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => LEGACY_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)))
        .map((key) => caches.delete(key))
    );
  }

  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of clients) {
    const url = new URL(client.url);
    if (url.origin === self.location.origin && !url.pathname.startsWith("/games/minesweeper/")) {
      client.postMessage({ type: "MALL_ROOT_SW_CLEANED" });
    }
  }

  await self.registration.unregister();
  await Promise.all(
    clients.map((client) => {
      const url = new URL(client.url);
      if (url.origin !== self.location.origin || url.pathname.startsWith("/games/minesweeper/")) {
        return null;
      }
      return client.navigate(client.url).catch(() => null);
    })
  );
}
