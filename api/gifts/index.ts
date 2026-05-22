/// <reference types="node" />

import crypto from 'crypto';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body: any = null;
  try {
    body = req.body;
    if (!body || Object.keys(body).length === 0) {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk: any) => (data += chunk));
        req.on('end', () => {
          try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve(null); }
        });
      });
    }
  } catch (e) { body = null; }

  if (!body) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  if (!REDIS_URL || !REDIS_TOKEN) {
    res.status(500).json({ error: 'Redis not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to Vercel env vars.' });
    return;
  }

  const id = crypto.randomBytes(8).toString('hex'); // short 16-char hex ID
  const TTL = 60 * 60 * 24 * 30; // 30 days

  try {
    // Store using Upstash REST API — no npm package needed
    const storeRes = await fetch(
      `${REDIS_URL}/set/${encodeURIComponent('gift:' + id)}?EX=${TTL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!storeRes.ok) {
      const err = await storeRes.text();
      console.error('Upstash error:', err);
      res.status(500).json({ error: 'Storage error' });
      return;
    }

    res.status(201).json({ id });
  } catch (e) {
    console.error('store error', e);
    res.status(500).json({ error: 'Storage error' });
  }
}