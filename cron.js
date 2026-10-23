// /cron?t=CRON_TOKEN : يُستدعى كل دقيقة من cron-job.org ويرسل الإشعارات المستحقة
import { push, loadKey } from './lib/util.js';
export async function onRequestGet({ request, env }) {
  if (!env.CRON_TOKEN || new URL(request.url).searchParams.get('t') !== env.CRON_TOKEN) return new Response('forbidden', { status: 403 });
  if (!env.SUBS || !env.VAPID_PRIVATE_JWK) return new Response('not configured', { status: 503 });
  const all = JSON.parse((await env.SUBS.get('all')) || '{}'), due = [];
  for (const [id, r] of Object.entries(all)) {
    let now;
    try {
      now = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: r.tz }).format(new Date());
    } catch { continue; } const t = r.times || {};
    if ([t.morning, t.evening, t.ziyarat, t.sleep, ...(r.athan ? Object.values(t.prayers || {}) : [])].includes(now)) due.push(id);
  }
  const key = await loadKey(env);
  const res = await Promise.all(due.slice(0, 45).map(async id => ({ id, s: (await push(all[id].sub.endpoint, key, env)).status })));
  const dead = res.filter(x => x.s === 404 || x.s === 410).map(x => x.id);
  if (dead.length) {
    dead.forEach(i => delete all[i]);
    await env.SUBS.put('all', JSON.stringify(all));
  }
  return new Response(`due=${due.length} sent=${res.length} removed=${dead.length}`);
}
