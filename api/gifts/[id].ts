/// <reference types="node" />

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SECRET = process.env.GIFT_SECRET || null;

const storageDir = path.join(process.cwd(), 'data', 'gifts');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

let kv: any = null;
try { kv = await import('@vercel/kv'); kv = kv.default || kv; } catch (e) { kv = null; }

const decrypt = (payload: string) => {
  if (!SECRET) return JSON.parse(payload);
  try {
    const obj = JSON.parse(payload);
    const key = crypto.createHash('sha256').update(String(SECRET)).digest();
    const iv = Buffer.from(obj.iv, 'hex');
    const tag = Buffer.from(obj.tag, 'hex');
    const data = Buffer.from(obj.data, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  } catch (e) {
    return null;
  }
};

const readLocal = async (id: string) => {
  const filePath = path.join(storageDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const id = req.query?.id || req.url?.split('/').pop();
  if (!id) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  try {
    const raw = kv && typeof kv.get === 'function' ? await kv.get(String(id)) : await readLocal(String(id));
    if (!raw) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const data = decrypt(String(raw));
    if (!data) {
      try { res.status(200).json(JSON.parse(String(raw))); return; } catch (e) {}
      res.status(500).json({ error: 'Decrypt failed' });
      return;
    }
    res.status(200).json(data);
  } catch (e) {
    console.error('fetch error', e);
    res.status(500).json({ error: 'Server error' });
  }
}
