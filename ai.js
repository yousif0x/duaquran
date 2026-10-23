// /ai : مساعد ديني بالذكاء الاصطناعي (يحتاج فقط ANTHROPIC_API_KEY)
import { SYSTEM, json } from './lib/util.js';
export async function onRequestPost({ request, env }) {
  const o = request.headers.get('Origin');
  if (o && new URL(o).host !== new URL(request.url).host) return json({ error: 'forbidden' }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'not configured' }, 503);
  let body;
  try {
    body = await request.json();
  } catch { return json({ error: 'bad json' }, 400); } const ip = request.headers.get('CF-Connecting-IP') || 'x', c = caches.default;
  const rk = new Request(`https://rl.local/${ip}/${new Date().getUTCHours()}`), hit = await c.match(rk), n = hit ? +(await hit.text()) : 0;
  if (n >= 30) return json({ reply: 'وصلت للحد المسموح هذه الساعة، حاول لاحقاً 🌙' }, 429);
  await c.put(rk, new Response(String(n + 1), { headers: { 'Cache-Control': 'max-age=3600' } }));
  const messages = (Array.isArray(body.messages) ? body.messages : []).slice(-10) .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string') .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') return json({ error: 'no question' }, 400);
  const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: env.MODEL || 'claude-sonnet-5-5', max_tokens: 1400, system: SYSTEM, messages }) });
  if (!r.ok) return json({ error: 'ai unavailable' }, 502);
  const d = await r.json();
  return json({ reply: (d.content || []).filter(x => x.type === 'text').map(x => x.text).join('\n') });
}
