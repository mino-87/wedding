const MAX_CHUNK_BYTES = 3.25 * 1024 * 1024;

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (req.body instanceof Uint8Array) return Buffer.from(req.body);
  if (typeof req.body === 'string') return Buffer.from(req.body);
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_CHUNK_BYTES) throw new Error('CHUNK_TOO_LARGE');
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ok:true,service:'Wedding Drive chunk bridge'});
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});

  try {
    const sessionValue = String(req.headers['x-upload-session'] || '');
    const sessionUrl = new URL(sessionValue);
    if (
      sessionUrl.protocol !== 'https:' ||
      sessionUrl.hostname !== 'www.googleapis.com' ||
      !sessionUrl.pathname.startsWith('/upload/drive/v3/files') ||
      sessionUrl.searchParams.get('uploadType') !== 'resumable' ||
      !sessionUrl.searchParams.get('upload_id')
    ) {
      return res.status(400).json({ok:false,error:'INVALID_UPLOAD_SESSION'});
    }

    const start = Number(req.headers['x-upload-start']);
    const endExclusive = Number(req.headers['x-upload-end']);
    const total = Number(req.headers['x-upload-total']);
    const mimeType = String(req.headers['x-upload-mime-type'] || 'application/octet-stream').slice(0, 150);
    if (![start,endExclusive,total].every(Number.isSafeInteger) || start < 0 || endExclusive <= start || total < endExclusive) {
      return res.status(400).json({ok:false,error:'INVALID_CHUNK_RANGE'});
    }

    const body = await readRawBody(req);
    if (!body.length || body.length !== endExclusive - start || body.length > MAX_CHUNK_BYTES) {
      return res.status(400).json({ok:false,error:'CHUNK_SIZE_MISMATCH'});
    }

    const upstream = await fetch(sessionUrl.toString(), {
      method: 'PUT',
      redirect: 'manual',
      headers: {
        'Content-Type': mimeType,
        'Content-Range': `bytes ${start}-${endExclusive - 1}/${total}`
      },
      body
    });

    const range = upstream.headers.get('range') || '';
    if (upstream.status === 308) {
      return res.status(200).json({ok:true,complete:false,receivedRange:range});
    }

    const raw = await upstream.text();
    let result = {};
    try { result = raw ? JSON.parse(raw) : {}; } catch (_) {}
    if (upstream.status >= 200 && upstream.status < 300) {
      return res.status(200).json({ok:true,complete:true,receivedRange:range,result});
    }

    console.error('Drive chunk rejected', {status:upstream.status,range:range,body:raw.slice(0,240)});
    return res.status(502).json({ok:false,error:`DRIVE_CHUNK_HTTP_${upstream.status}`});
  } catch (error) {
    console.error('Wedding chunk bridge failed', error);
    return res.status(500).json({ok:false,error:error?.message || 'CHUNK_BRIDGE_FAILED'});
  }
}

module.exports = handler;
module.exports.config = {api:{bodyParser:false}};
