// ====================================================================
// Cambium Service Worker (sw.js)
// Enterprise PWA Caching & Field Researcher Offline Strategy
// ====================================================================

const CACHE_NAME = "cambium-cache-v2";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/opportunities",
  "/graph",
  "/compliance",
  "/lab",
  "/os",
  "/manifest.json",
  "/favicon.svg",
  "/favicon-light.svg",
  "/favicon-dark.svg",
  "/logo.svg",
  "/public_logo/favicon.svg",
  "/public_logo/favicon-light.svg",
  "/public_logo/favicon-dark.svg",
  "/public_logo/cambium-logo-light.svg",
  "/public_logo/cambium-logo-dark.svg",
];

// 1. Install Event: Pre-cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching critical application shell");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[ServiceWorker] Pre-cache partial skip:", err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing obsolete cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Network-First for Navigation & APIs, Cache-First for Static Assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and WebSocket connections
  if (event.request.method !== "GET" || url.protocol.startsWith("ws")) {
    return;
  }

  // Bypass cache completely on localhost to guarantee real-time updates & no stale chunks
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    return;
  }

  // Static assets (images, fonts, scripts): Cache-First with Network fallback
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|svg|jpg|jpeg|gif|woff|woff2|ttf|css)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // HTML Pages & Navigation: Network-First with Cache fallback
  if (event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Return cached dashboard or home as fallback
            return caches.match("/dashboard").then((fallback) => {
              return (
                fallback ||
                new Response(
                  `<!DOCTYPE html><html><body style="font-family:serif;background:#FAF7F0;color:#202920;padding:40px;text-align:center;">
                  <h2>Cambium Field Offline Mode</h2>
                  <p>You are working offline. Cached research data is available via your local session.</p>
                  <a href="/dashboard" style="color:#3E6248;font-weight:bold;">Return to Workspace</a>
                  </body></html>`,
                  { headers: { "Content-Type": "text/html" } }
                )
              );
            });
          });
        })
    );
    return;
  }

  // API Requests: Network-First with offline cache match
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// 4. Background Sync: Replay queued actions when reconnected
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-outbox") {
    console.log("[ServiceWorker] Background sync triggered for pending outbox actions");
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "SYNC_OUTBOX_TRIGGERED" });
        });
      })
    );
  }
});
