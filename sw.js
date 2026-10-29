// Nawee service worker: makes the installed app (and the site) work offline for pages a learner has already opened.
// Pages (HTML): network first – always fresh when online, the saved copy when offline, else offline.html.
// Files (CSS, JS, images, fonts): the saved copy at once, refreshed in the background (?v= tags give new files new URLs).
// Only this website's own files are saved, only in the visitor's browser – never Supabase, Stripe, Brevo or other sites.
// Change VERSION to throw away all saved copies (e.g. after a bug in this file).

const VERSION = "v1";
const PAGES = `nawee-pages-${VERSION}`;
const FILES = `nawee-files-${VERSION}`;
const MAX_FILES = 400; // keeps the saved files small on the phone
const START = ["offline.html", "assets/icon-192.png", "assets/logo_notext.png"];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(PAGES).then((c) => c.addAll(START)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k.startsWith("nawee-") && k !== PAGES && k !== FILES).map((k) => caches.delete(k))))
            .then(() => self.clients.claim()),
    );
});

const trim = async () => {
    const c = await caches.open(FILES);
    const keys = await c.keys();
    for (let i = 0; i < keys.length - MAX_FILES; i += 1) await c.delete(keys[i]); // oldest first
};

self.addEventListener("fetch", (event) => {
    const req = event.request;
    const url = new URL(req.url);
    // only plain GET requests for our own files; audio/video range requests go straight to the network
    if (req.method !== "GET" || url.origin !== self.location.origin || req.headers.has("range")) return;

    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    if (res.ok) { const copy = res.clone(); caches.open(PAGES).then((c) => c.put(req, copy)); }
                    return res;
                })
                .catch(async () => (await caches.match(req, { ignoreSearch: false }))
                    || (await caches.match(req, { ignoreSearch: true }))
                    || caches.match("offline.html")),
        );
        return;
    }

    event.respondWith(
        caches.open(FILES).then(async (c) => {
            const saved = await c.match(req);
            const fresh = fetch(req)
                .then((res) => {
                    if (res.ok && res.type === "basic") { c.put(req, res.clone()).then(trim); }
                    return res;
                })
                .catch(() => saved || Response.error());
            if (saved) { event.waitUntil(fresh.catch(() => {})); return saved; }
            return fresh;
        }),
    );
});
