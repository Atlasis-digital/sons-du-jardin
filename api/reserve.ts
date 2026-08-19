import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only' });
    return;
  }

  const {
    name,
    phone,
    guests,
    arrivalDate,
    arrivalTime,
    departureDate,
    departureTime,
    message,
    company,
  } = req.body || {};

  // Honeypot anti-spam
  if (company && String(company).trim() !== '') {
    res.status(200).json({ ok: true });
    return;
  }

  // Validation champs obligatoires
  if (!name || !phone || !arrivalDate || !departureDate) {
    res.status(400).json({ ok: false, error: 'Champs requis manquants' });
    return;
  }

  // Validation : date départ > date arrivée
  if (departureDate <= arrivalDate) {
    res.status(400).json({ ok: false, error: 'La date de départ doit être après la date d\'arrivée' });
    return;
  }

  if (String(name).length > 120 || String(phone).length > 40 || String(message || '').length > 2000) {
    res.status(400).json({ ok: false, error: 'Champ trop long' });
    return;
  }

  try {
    const formatDateTime = (date: string, time: string) => {
      if (!date) return null;
      return time ? `${date} à ${time}` : date;
    };

    const arrivalFormatted = formatDateTime(arrivalDate, arrivalTime);
    const departureFormatted = formatDateTime(departureDate, departureTime);

    const datesFormatted = [
      `arrivée: ${arrivalFormatted}`,
      `départ: ${departureFormatted}`,
    ].filter(Boolean).join(' | ');

    const body = {
      name,
      phone,
      guests: Number(guests) || 1,
      message: message || null,
      dates: datesFormatted,
      status: 'en_attente',
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(500).json({ ok: false, error: errorText });
      return;
    }

    res.status(200).json({ ok: true, message: 'Réservation enregistrée' });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
