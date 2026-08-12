/* ══════════════════════════════
   أذكاري v5 – Service Worker
   ══════════════════════════════ */
const CACHE = 'adhkar-v8';
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.alquran.cloud') || e.request.url.includes('mp3quran')) {
    // Network-first for Quran API and audio
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (!res || res.status!==200 || res.type==='opaque') return res;
      const clone=res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(list => {
    if (list.length) return list[0].focus();
    return clients.openWindow('./');
  }));
});

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {title:'أذكاري', body:'حان وقت الورد 📿'};
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, dir:'rtl', lang:'ar', vibrate:[200,100,200],
    tag: d.tag || 'adhkar', data:{url:'./'},
    badge: './icon-192.png', icon: './icon-192.png'
  }));
});
