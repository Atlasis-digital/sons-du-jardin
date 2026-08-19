import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const RESEND_KEY = process.env.RESEND_KEY!;
const TO_EMAIL = process.env.TO_EMAIL!;
const FROM_EMAIL = 'Les Sons du Jardin <contact@sons-du-jardin.vercel.app>';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only' });
    return;
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ ok: false, error: 'Champs requis manquants' });
    return;
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: `Nouveau message — ${name}`,
        text: `De : ${name} (${email})\n\n${message}`,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      res.status(500).json({ ok: false, error: t });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
