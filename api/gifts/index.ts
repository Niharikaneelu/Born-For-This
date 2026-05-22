/// <reference types="node" />

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SECRET = process.env.GIFT_SECRET || null;

const storageDir = path.join(process.cwd(), 'data', 'gifts');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

let kv: any = null;
try { kv = await import('@vercel/kv'); kv = kv.default || kv; } catch (e) { kv = null; }

const encrypt = (plaintext: any) => {
  if (!SECRET) return JSON.stringify(plaintext);
  const key = crypto.createHash('sha256').update(String(SECRET)).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({ iv: iv.toString('hex'), tag: tag.toString('hex'), data: encrypted.toString('hex') });
};

const storeLocal = async (id: string, payload: string) => {
  const filePath = path.join(storageDir, `${id}.json`);
  fs.writeFileSync(filePath, payload, 'utf8');
};

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
  } catch (e) {
    body = null;
  }

  if (!body) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const id = crypto.randomBytes(8).toString('hex');
  const payload = encrypt(body);
  try {
    if (kv && typeof kv.set === 'function') {
      await kv.set(id, payload, { ex: 60 * 60 * 24 * 30 });
    } else {
      await storeLocal(id, payload);
    }
    res.status(201).json({ id });
  } catch (e) {
    console.error('store error', e);
    res.status(500).json({ error: 'Storage error' });
  }
}
