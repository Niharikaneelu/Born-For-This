import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, 'dist');
const port = process.env.PORT ? Number(process.env.PORT) : 5173;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

    // Simple JSON body parser helper
    const parseJsonBody = async () => {
      return await new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve(null); }
        });
      });
    };

    // Simple encrypted file storage for gifts
    const storageDir = path.join(__dirname, 'data', 'gifts');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const SECRET = process.env.GIFT_SECRET || null;
    const encrypt = (plaintext) => {
      if (!SECRET) return JSON.stringify(plaintext);
      const key = crypto.createHash('sha256').update(String(SECRET)).digest();
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const encrypted = Buffer.concat([cipher.update(JSON.stringify(plaintext), 'utf8'), cipher.final()]);
      const tag = cipher.getAuthTag();
      return JSON.stringify({ iv: iv.toString('hex'), tag: tag.toString('hex'), data: encrypted.toString('hex') });
    };

    const decrypt = (payload) => {
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
    // Liveness probe
    if (urlPath === '/health' || urlPath === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    // API: store gift -> POST /api/gifts
    if (req.method === 'POST' && urlPath === '/api/gifts') {
      (async () => {
        const body = await parseJsonBody();
        if (!body) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }

        const id = crypto.randomBytes(8).toString('hex');
        const filePath = path.join(storageDir, `${id}.json`);
        const payload = encrypt(body);
        fs.writeFileSync(filePath, payload, { encoding: 'utf8' });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id }));
      })();
      return;
    }

    // API: get gift -> GET /api/gifts/:id
    if (req.method === 'GET' && urlPath.startsWith('/api/gifts/')) {
      (async () => {
        const id = path.basename(urlPath);
        const filePath = path.join(storageDir, `${id}.json`);
        if (!fs.existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
        }
        try {
          const raw = fs.readFileSync(filePath, 'utf8');
          const data = decrypt(raw);
          if (!data) throw new Error('decrypt failed');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Server error' }));
        }
      })();
      return;
    }
    let filePath = path.join(root, urlPath === '/' ? '/index.html' : urlPath);

    // Prevent path traversal
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        // SPA fallback to index.html
        const index = path.join(root, 'index.html');
        fs.readFile(index, (err2, data) => {
          if (err2) {
            res.writeHead(500);
            res.end('Server error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
      }
    });
  } catch (e) {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Production server listening on http://0.0.0.0:${port}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection', err);
  process.exit(1);
});
