const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwh-seQeKQoO96gIlnDrjogFjR3mdTB4XyXH3NK96CvyBnnnnSXJbBAHaHQzCdhNDkI8A/exec';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true, service: 'David & Diana RSVP proxy' });
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  try {
    let payload = req.body;
    if (typeof payload === 'string') payload = JSON.parse(payload || '{}');
    if (!payload || typeof payload !== 'object') payload = {};

    payload.action = 'rsvp';
    const name = String(payload.name || '').trim();
    const attending = payload.attending === 'yes' ? 'yes' : payload.attending === 'no' ? 'no' : '';
    if (!name || !attending) return res.status(400).json({ ok: false, error: 'INVALID_RSVP' });

    payload.name = name.slice(0, 100);
    payload.attending = attending;
    payload.companions = attending === 'yes' ? Math.max(0, Math.min(10, Number.parseInt(payload.companions || 0, 10) || 0)) : 0;
    payload.event = payload.event || 'David & Diana 24.09.2026';
    payload.submittedAt = payload.submittedAt || new Date().toISOString();

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let result;
    try { result = JSON.parse(text); } catch { result = { ok: response.ok, raw: text.slice(0, 500) }; }

    if (!response.ok || result?.ok === false) {
      return res.status(502).json({ ok: false, error: result?.error || `UPSTREAM_${response.status}` });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('RSVP proxy failed', error);
    return res.status(500).json({ ok: false, error: 'RSVP_PROXY_FAILED' });
  }
};
