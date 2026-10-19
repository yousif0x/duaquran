// /push/subscribe : حفظ اشتراك الجهاز (يحتاج KV باسم SUBS)
import { json, sha } from '../lib/util.js';
export async function onRequestPost({ request, env }) {
  if (!env.SUBS) return json({ error: 'not configured' }, 503);
  let b; try { b = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
  if (!b.sub || !b.sub.endpoint) return json({ error: 'bad sub' }, 400);
  const all = JSON.parse((await env.SUBS.get('all')) || '{}'), id = await sha(b.sub.endpoint);
  const rec = { sub: b.sub, tz: b.tz || 'UTC', times: b.times || {}, athan: b.athan !== false };
  if (JSON.stringify(all[id]) !== JSON.stringify(rec)) { all[id] = rec; await env.SUBS.put('all', JSON.stringify(all)); }
  return json({ ok: true });
}
