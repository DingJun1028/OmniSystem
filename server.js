'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── .env 載入器（零依賴；讀取專案根目錄 .env，不覆蓋已存在的環境變數）──
function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let value = m[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = value;
    }
  } catch (_) {
    /* .env 為選配：不存在時使用內建預設值 */
  }
}
loadEnv();

const MemoryVault = require('./lib/memory');
const { runPipeline } = require('./lib/pipeline');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = process.env.SSAS_DATA_DIR
  ? path.resolve(__dirname, process.env.SSAS_DATA_DIR)
  : path.join(__dirname, 'data');

const vault = new MemoryVault(DATA_DIR);
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

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (c) => { buf += c; });
    req.on('end', () => {
      try { resolve(buf ? JSON.parse(buf) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

async function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.join(PUBLIC_DIR, path.normalize(urlPath));
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  try {
    const data = await fs.promises.readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch (_) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

function sseStream(req, res, id) {
  const session = sessions.get(id);
  if (!session) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('no such session');
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('retry: 1000\n\n');
  let i = 0;
  const pump = () => {
    while (i < session.events.length) {
      const e = session.events[i++];
      res.write(`data: ${JSON.stringify(e)}\n\n`);
      if (e.status === 'final') {
        res.end();
        return true;
      }
    }
    return false;
  };
  if (pump()) return;
  session.subscribers.add(res);
  req.on('close', () => session.subscribers.delete(res));
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/healthz') {
      return json(res, 200, { ok: true, service: 'omnisystem', uptime_s: Math.floor(process.uptime()) });
    }

    if (req.method === 'POST' && req.url === '/api/run') {
      const body = await readBody(req);
      const intent = body.intent && String(body.intent).trim();
      if (!intent) return json(res, 400, { error: 'intent required' });

      if (sessions.size > 200) {
        sessions.delete(sessions.keys().next().value);
      }
      const id = crypto.randomUUID();
      const session = { id, intent, events: [], result: null, subscribers: new Set() };
      sessions.set(id, session);

      const emit = (event) => {
        session.events.push(event);
        for (const sub of session.subscribers) {
          sub.write(`data: ${JSON.stringify(event)}\n\n`);
        }
        if (event.status === 'final') {
          for (const sub of session.subscribers) sub.end();
          session.subscribers.clear();
        }
      };

      runPipeline(intent, {
        vault,
        emit,
        delayMs: Number(process.env.SSAS_PIPELINE_DELAY_MS || 300),
        reasoningMode: process.env.SSAS_REASONING_MODE || 'local',
      })
        .then((result) => { session.result = result; })
        .catch((err) => {
          console.error('pipeline error:', err);
          emit({
            ts: new Date().toISOString(),
            layer: 9,
            name_zh: '演化生長環',
            name_en: 'Evolution Loop',
            status: 'final',
            detail: 'pipeline 異常結束',
            data: { error: err.message },
          });
        });

      return json(res, 200, { session_id: id });
    }

    const streamMatch = req.url.match(/^\/api\/stream\/([a-f0-9-]+)$/);
    if (req.method === 'GET' && streamMatch) {
      return sseStream(req, res, streamMatch[1]);
    }

    if (req.method === 'GET' && req.url === '/api/memory') {
      return json(res, 200, { entries: vault.recent(20) });
    }

    return serveStatic(req, res);
  } catch (err) {
    console.error('request error:', err);
    return json(res, 500, { error: err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`OmniSystem console → http://${HOST}:${PORT}（資料目錄：${DATA_DIR}）`);
});
