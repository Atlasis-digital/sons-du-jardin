import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'GET only' });
    return;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/reservations?select=dates,status`,
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    if (!response.ok) {
      res.status(500).json({ ok: false, error: 'Erreur lecture disponibilité' });
      return;
    }
    const rows = await response.json() as Array<{ dates: string; status: string }>;
    // Parser le champ "dates" texte (ex: "arrivée: 2026-09-05 à 14:00 | départ: 2026-09-10 à 11:00")
    const parse = (s: string): { a: string; d: string } | null => {
      const m = (s || '').match(/arrivée:\s*(\d{4}-\d{2}-\d{2})[\s\S]*?départ:\s*(\d{4}-\d{2}-\d{2})/);
      if (!m) return null;
      return { a: m[1], d: m[2] };
    };
    const booked = rows
      .filter((r) => r.status !== 'annule')
      .map((r) => parse(r.dates || ''))
      .filter((p): p is { a: string; d: string } => p !== null);
    res.status(200).json({ ok: true, booked });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
