// Service Worker – شغلك
// غيّر رقم VERSION كل ما تحدّث data.js أو app.js عشان الكاش يتجدد عند المستخدمين.
const VERSION = 'v2026-10-07-shoghlak';
const SHELL = `shoghlak-shell-${VERSION}`;
const IMGS = 'shoghlak-images';
const SHELL_FILES = [
  './', './index.html', './app.js', './data.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('shoghlak-shell-') && k !== SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // صور الإعلانات: من الكاش أولًا ثم الشبكة (وتتخزن عند أول مرة)
  if (url.origin === location.origin && url.pathname.includes('/images/')) {
    e.respondWith(caches.open(IMGS).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }

  // الخطوط: من الكاش مع تحديث بالخلفية
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('shoghlak-fonts').then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  // باقي ملفات الموقع: الشبكة أولًا (عشان التحديثات تظهر) وإلا الكاش
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
  }
});
