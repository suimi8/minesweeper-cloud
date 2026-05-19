const CACHE_NAME = "minesweeper-pwa-v11";
const BASE_PATH = new URL("./", self.location.href).pathname;
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      ),
      self.clients.claim().then(() =>
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) =>
          Promise.all(
            clients.map((client) => {
              const url = new URL(client.url);
              if (url.origin !== self.location.origin || isApiPath(url.pathname)) {
                return null;
              }
              client.postMessage({ type: "SW_UPDATED" });
              return client.navigate(client.url).catch(() => null);
            })
          )
        )
      )
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (isApiPath(url.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  const isCoreAsset = CORE_ASSETS.some((asset) => new URL(asset, self.location.href).pathname === url.pathname);
  if (!isCoreAsset) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});

function isApiPath(pathname) {
  if (!pathname.startsWith(BASE_PATH)) {
    return false;
  }
  const appPath = `/${pathname.slice(BASE_PATH.length)}`;
  return appPath.startsWith("/api/") || appPath === "/login";
}
