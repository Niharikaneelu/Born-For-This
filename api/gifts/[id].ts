/// <reference types="node" />

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const id = req.query?.id || req.url?.split('/').pop();
  if (!id || !/^[0-9a-f]{16}$/i.test(String(id))) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  if (!REDIS_URL || !REDIS_TOKEN) {
    res.status(500).json({ error: 'Redis not configured.' });
    return;
  }

  try {
    // Fetch using Upstash REST API — no npm package needed
    const getRes = await fetch(
      `${REDIS_URL}/get/${encodeURIComponent('gift:' + id)}`,
      {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      }
    );

    if (!getRes.ok) {
      res.status(500).json({ error: 'Storage error' });
      return;
    }

    const json = await getRes.json();
    if (json.result === null || json.result === undefined) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    // Upstash returns the value as stored; parse if it's a string
    const data = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
    res.status(200).json(data);
  } catch (e) {
    console.error('fetch error', e);
    res.status(500).json({ error: 'Server error' });
  }
}