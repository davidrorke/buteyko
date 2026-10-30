// Bump VERSION whenever you upload changed files, so phones pick up the update.
const VERSION = "bp-1.1.1";
const SHELL = ["./", "./index.html", "./config.js", "./manifest.webmanifest",
  "./icon-180.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./privacy.html"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
 
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== "bp-fonts").map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Fonts: cache first, so the app looks right offline.
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open("bp-fonts").then(c => c.match(req).then(hit => hit ||
      fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
    return;
  }
  // Never cache Google sign-in or Drive traffic.
  if (url.origin !== location.origin) return;
  // App files: network first so updates arrive, cache when offline.
  // cache: "no-cache" checks with GitHub every time, so updates show on a normal refresh.
  e.respondWith(fetch(req, { cache: "no-cache" }).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match("./index.html"))));
});
 
