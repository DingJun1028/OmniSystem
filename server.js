'use strict';
const http = require('http');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const MemoryVault = require('./lib/memory');
const { runPipeline } = require('./lib/pipeline');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');

const vault = new MemoryVault(process.env.SSAS_DATA_DIR || path.join(__dirname, 'data'));
const sessions = new Map();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function json(res, code, body) {
  const data = JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
  });
  res.end(data);
}

async function serveStatic(res, urlPath) {
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 20000) {
        reject(new Error('payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sseWrite(res, ev) {
  res.write(`event: ${ev.event}\ndata: ${JSON.stringify(ev.data)}\n\n`);
}

function startSession(intent) {
  const id = 'sess_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  const session = { events: [], subs: new Set(), done: false };
  sessions.set(id, session);
  if (sessions.size > 200) {
    sessions.delete(sessions.keys().next().value);
  }
  (async () => {
    try {
      for await (const ev of runPipeline(intent, vault)) {
        session.events.push(ev);
        for (const sub of session.subs) sseWrite(sub, ev);
        if (ev.event === 'done') break;
      }
    } catch (err) {
      const ev = { event: 'done', data: { final_status: 'failed', error: String((err && err.message) || err) } };
      session.events.push(ev);
      for (const sub of session.subs) sseWrite(sub, ev);
    }
    session.done = true;
    for (const sub of session.subs) sub.end();
    session.subs.clear();
  })();
  return id;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  try {
    if (req.method === 'GET' && p === '/healthz') {
      return json(res, 200, { ok: true });
    }

    if (req.method === 'POST' && p === '/api/run') {
      const body = JSON.parse((await readBody(req)) || '{}');
      const intent = typeof body.intent === 'string' ? body.intent.trim() : '';
      if (intent.length < 2) {
        return json(res, 400, { error: '請輸入需求（至少 2 個字元）' });
      }
      return json(res, 200, { session_id: startSession(intent) });
    }

    if (req.method === 'GET' && p.startsWith('/api/stream/')) {
      const id = p.slice('/api/stream/'.length);
      const session = sessions.get(id);
      if (!session) return json(res, 404, { error: 'unknown session' });
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write('retry: 1000\n\n');
      for (const ev of session.events) sseWrite(res, ev);
      if (session.done) return res.end();
      session.subs.add(res);
      res.on('close', () => session.subs.delete(res));
      return;
    }

    if (req.method === 'GET' && p === '/api/memory') {
      return json(res, 200, { memories: vault.recent(12) });
    }

    if (req.method === 'GET') {
      return serveStatic(res, p);
    }

    res.writeHead(405);
    res.end();
  } catch (err) {
    json(res, 500, { error: String((err && err.message) || err) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`SSAS console listening on http://${HOST}:${PORT}`);
});
