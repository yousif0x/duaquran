export const onRequestGet = ({ env }) => new Response(env.VAPID_PUBLIC_KEY || '', { headers: { 'Content-Type': 'text/plain' } });
