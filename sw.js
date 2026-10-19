/* Maths Worlds offline cache. VERSION changes with every update, so the tablet picks up new versions. */
const VERSION='mw-d0b8a90e93';
const FILES=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "fonts/fraunces-latin-500-italic.woff2", "fonts/fraunces-latin-600-normal.woff2", "fonts/lexend-latin-400-normal.woff2", "fonts/lexend-latin-600-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  /* the app page: try the network first (to get updates), fall back to the saved copy offline */
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r)))});
