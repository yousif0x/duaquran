/* ══════════════════════════════════════════════════════
   أذكاري v6 – Service Worker | إشعارات حقيقية خارج التطبيق
   ══════════════════════════════════════════════════════ */
'use strict';

const CACHE = 'adhkar-v17';
const ASSETS = ['./', './index.html', './style.css', './andalus.css', './config.js', './icon-192.png', './app.js', './manifest.json'];

/* ── إشعارات مجدولة (الأوقات) ── */
const NOTIF_MESSAGES = {
  morning: { title: 'أذكار الصباح 🌅', body: 'حان وقت أذكار الصباح، ابدأ يومك بذكر الله! ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾' },
  evening: { title: 'أذكار المساء 🌇', body: 'حان وقت أذكار المساء، حصّن نفسك بذكر الله!' },
  ziyarat: { title: 'زيارة عاشوراء 🏴', body: 'حان وقت زيارة عاشوراء والأدعية المباركة.' },
  sleep:   { title: 'أذكار النوم 🌙', body: 'حان وقت أذكار النوم وآية الكرسي، نوم هنيئاً بذكر الله.' },
  fajr:    { title: 'تنبيه الفجر 🕌', body: 'صلاة الفجر قريبة، استعد للصلاة 🤲' },
  dhuhr:   { title: 'تنبيه الظهر 🕌', body: 'صلاة الظهر قريبة، استعد للصلاة 🤲' },
  asr:     { title: 'تنبيه العصر 🕌', body: 'صلاة العصر قريبة، استعد للصلاة 🤲' },
  maghrib: { title: 'تنبيه المغرب 🕌', body: 'صلاة المغرب قريبة، استعد للصلاة 🤲' },
  isha:    { title: 'تنبيه العشاء 🕌', body: 'صلاة العشاء قريبة، استعد للصلاة 🤲' },
};

/* ── تثبيت الـ Cache ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── تنشيط + حذف القديم ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: Cache-first مع network fallback ── */
self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.alquran.cloud') ||
      e.request.url.includes('mp3quran') ||
      e.request.url.includes('api.aladhan.com')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  const same = new URL(e.request.url).origin === self.location.origin;
  if (e.request.method !== 'GET') return;
  if (same) {   // ملفات التطبيق: الشبكة أولاً (حتى يصلك كل تحديث فوراً) ثم الكاش عند انقطاع النت
    e.respondWith(fetch(e.request).then(res => {
      if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (!res || res.status !== 200) return res;
    const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return res;
  })));
});

/* ── Push من سيرفر خارجي ── */
self.addEventListener('push', e => {
  let d = null; try { d = e.data && e.data.json(); } catch (_) {}
  e.waitUntil(d && d.title ? showAdhkarNotif(d.title, d.body, d.tag || 'push') : pushNotif());
});

/* ── Periodic Background Sync (Android Chrome) ── */
self.addEventListener('periodicsync', e => {
  if (e.tag === 'adhkar-check') {
    e.waitUntil(checkAndSendScheduledNotifs());
  }
});

/* ── Message من الصفحة الرئيسية ── */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFS') {
    // حفظ الجدول في IndexedDB أو استخدم الـ cache كـ storage
    storeSchedule(e.data.schedule).then(() => {
      e.ports[0] && e.ports[0].postMessage({ ok: true });
    });
  }
  if (e.data && e.data.type === 'CHECK_NOW') {
    checkAndSendScheduledNotifs();
  }
});

/* ── فحص الأوقات وإرسال الإشعارات ── */
async function checkAndSendScheduledNotifs() {
  try {
    const schedule = await getSchedule();
    if (!schedule) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hh}:${mm}`;

    const checks = [
      { key: 'morning', time: schedule.morning },
      { key: 'evening', time: schedule.evening },
      { key: 'ziyarat', time: schedule.ziyarat },
      { key: 'sleep',   time: schedule.sleep },
    ];

    // أوقات الصلاة (قبل 5 دقائق)
    const prayers = ['fajr','dhuhr','asr','maghrib','isha'];
    prayers.forEach(p => {
      if (schedule.prayers && schedule.prayers[p] && schedule.athanAlert) {
        const pt = subtractMinutes(schedule.prayers[p], 5);
        checks.push({ key: p, time: pt });
      }
    });

    // الورد المخصص
    if (schedule.wird && schedule.wird.time && schedule.wird.text) {
      checks.push({
        key: 'custom_wird',
        time: schedule.wird.time,
        custom: { title: `📿 وردك اليومي`, body: schedule.wird.text }
      });
    }

    // فحص ما إذا كان الوقت مطابقاً (نطاق دقيقتين لتعويض التأخير)
    const sentKey = `sent_${timeStr.replace(':','_')}`;
    const alreadySent = schedule.sent && schedule.sent[sentKey];
    if (alreadySent) return;

    for (const check of checks) {
      if (check.time && isTimeMatch(timeStr, check.time)) {
        const msg = check.custom || NOTIF_MESSAGES[check.key] || { title: 'أذكاري', body: 'حان وقت ذكر الله' };
        await showAdhkarNotif(msg.title, msg.body, check.key);
        // تسجيل الإرسال لتفادي التكرار
        schedule.sent = schedule.sent || {};
        schedule.sent[sentKey] = true;
        // مسح السجلات القديمة (أكثر من 100)
        const sentKeys = Object.keys(schedule.sent);
        if (sentKeys.length > 100) {
          sentKeys.slice(0, 50).forEach(k => delete schedule.sent[k]);
        }
        await storeSchedule(schedule);
        break;
      }
    }
  } catch (err) {}
}

/* ── مطابقة الوقت (دقيقة واحدة) ── */
function isTimeMatch(current, target) {
  if (!target) return false;
  return current === target;
}

/* ── طرح 5 دقائق من الوقت ── */
function subtractMinutes(timeStr, mins) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  m -= mins;
  if (m < 0) { m += 60; h -= 1; }
  if (h < 0) h += 24;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

/* ── إظهار الإشعار ── */
async function showAdhkarNotif(title, body, tag) {
  return self.registration.showNotification(title, {
    body: body,
    dir: 'rtl',
    lang: 'ar',
    tag: tag || 'adhkar',
    icon: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' rx=\'20\' fill=\'%230d6e4f\'/><text y=\'72\' x=\'50\' text-anchor=\'middle\' font-size=\'60\' fill=\'%23fbbf24\'>☪</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' rx=\'20\' fill=\'%230d6e4f\'/><text y=\'72\' x=\'50\' text-anchor=\'middle\' font-size=\'60\' fill=\'%23fbbf24\'>☪</text></svg>',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: false,
    data: { url: './' }
  });
}

/* ── تخزين الجدول في Cache Storage (كـ key-value store بسيط) ── */
const SCHED_CACHE = 'adhkar-schedule-v1';
const SCHED_KEY   = 'adhkar-schedule-data';

async function storeSchedule(schedule) {
  try {
    const c = await caches.open(SCHED_CACHE);
    const response = new Response(JSON.stringify(schedule), {
      headers: { 'Content-Type': 'application/json' }
    });
    await c.put(SCHED_KEY, response);
  } catch (e) {}
}

async function getSchedule() {
  try {
    const c = await caches.open(SCHED_CACHE);
    const r = await c.match(SCHED_KEY);
    if (r) return await r.json();
  } catch (e) {}
  return null;
}

/* ── نقر على الإشعار ── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('index.html') || client.url.endsWith('/')) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

/* ── Push بدون حمولة: نحدد الرسالة من جدول المستخدم (آيفون يشترط إظهار إشعار دائماً) ── */
const PUSH_MSG = { morning:['أذكار الصباح 🌅','حان وقت أذكار الصباح، ابدأ يومك بذكر الله'], evening:['أذكار المساء 🌇','حان وقت أذكار المساء، حصّن نفسك بذكر الله'],
  ziyarat:['زيارة عاشوراء 🏴','حان وقت الزيارة والأدعية المباركة'], sleep:['أذكار النوم 🌙','آية الكرسي وأذكار النوم قبل أن تنام'] };
const PUSH_PRAYER = { fajr:'الفجر', dhuhr:'الظهر', asr:'العصر', maghrib:'المغرب', isha:'العشاء' };
async function pushNotif() {
  let t = ['أذكاري 🌿', 'اذكر الله، فبذكره تطمئن القلوب'];
  try {
    const s = await getSchedule(), n = new Date(), m = n.getHours() * 60 + n.getMinutes();
    const mins = h => { const [a, b] = String(h).split(':'); return +a * 60 + +b; };
    const near = h => h && Math.abs(mins(h) - m) <= 2;
    const k = s && Object.keys(PUSH_MSG).find(x => near(s[x]));
    if (k) t = PUSH_MSG[k];
    else if (s && s.prayers) { const p = Object.keys(PUSH_PRAYER).find(x => near(s.prayers[x])); if (p) t = ['🕌 حان وقت صلاة ' + PUSH_PRAYER[p], 'حيّ على الصلاة، أرح قلبك بالسجود']; }
  } catch (_) {}
  return showAdhkarNotif(t[0], t[1], 'push');
}
