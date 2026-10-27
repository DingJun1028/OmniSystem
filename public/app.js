'use strict';

const LAYERS = [
  ['0', '意圖心核', 'Intent Core'],
  ['1', '感知雷達', 'Perception Radar'],
  ['2', '記憶樞紐', 'Memory Vault'],
  ['3', '推理大腦', 'Reasoning Brain'],
  ['4', '治理閘門', 'Governance Gate'],
  ['5', '編排中樞', 'Orchestration Hub'],
  ['6', '執行工坊', 'Execution Workshop'],
  ['7', '整合網絡', 'Integration Network'],
  ['8', '體驗門戶', 'Experience Portal'],
  ['9', '演化生長環', 'Evolution Loop'],
];

const NS = 'http://www.w3.org/2000/svg';
const $ = (id) => document.getElementById(id);

function buildRings() {
  const svg = $('rings');
  const cx = 260;
  const cy = 260;
  LAYERS.forEach((l, i) => {
    const r = 45 + i * 23;
    const group = document.createElementNS(NS, 'g');
    group.dataset.layer = String(i);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    c.setAttribute('class', i === 0 ? 'ring core' : 'ring');
    group.appendChild(c);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', cx + 8);
    t.setAttribute('y', cy - r + 15);
    t.setAttribute('class', 'ring-label');
    t.textContent = l[0] + ' ' + l[1];
    group.appendChild(t);
    svg.appendChild(group);
  });
}

function resetRings() {
  document.querySelectorAll('#rings g').forEach((g) => {
    g.querySelector('circle').setAttribute('class', g.dataset.layer === '0' ? 'ring core' : 'ring');
  });
}

function highlight(layer, status) {
  const g = document.querySelector(`#rings g[data-layer="${layer}"]`);
  if (!g) return;
  const c = g.querySelector('circle');
  c.setAttribute('class', status === 'blocked' ? 'ring blocked' : 'ring active');
}

function setStatus(text, bad) {
  $('status').textContent = text;
  $('status').className = 'status' + (bad ? ' bad' : '');
}

function logLine(e) {
  const line = document.createElement('div');
  line.className = 'log-line ' + (e.status || '');

  const t = document.createElement('span');
  t.className = 't';
  t.textContent = new Date(e.ts).toLocaleTimeString();

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = (e.layer != null ? e.layer + ' ' : '') + (e.name_zh || '');

  const d = document.createElement('span');
  d.className = 'd';
  d.textContent = e.detail || '';

  line.append(t, badge, d);
  $('log').prepend(line);
}

function render(e) {
  if (!e.data) return;
  if (e.layer === 0) $('spec').textContent = JSON.stringify(e.data, null, 2);
  if (e.layer === 3) $('strategy').textContent = JSON.stringify(e.data, null, 2);
  if (e.layer === 6) renderEsg(e.data.esg);
  if (e.layer === 9) $('evo').textContent = JSON.stringify(e.data, null, 2);
}

function renderEsg(esg) {
  if (!esg) return;
  const box = $('esg');
  box.textContent = '';
  [
    ['環境 E', esg.environmental],
    ['社會 S', esg.social],
    ['治理 G', esg.governance],
  ].forEach(([label, v]) => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    const name = document.createElement('span');
    name.className = 'bar-name';
    name.textContent = label;
    const track = document.createElement('div');
    track.className = 'bar-track';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = v + '%';
    track.appendChild(fill);
    const num = document.createElement('span');
    num.className = 'bar-num';
    num.textContent = v;
    row.append(name, track, num);
    box.appendChild(row);
  });
}

async function loadMemory() {
  const res = await fetch('/api/memory');
  const { entries } = await res.json();
  const tbody = $('memtable').querySelector('tbody');
  tbody.textContent = '';
  $('memempty').hidden = entries.length > 0;
  for (const e of entries) {
    const tr = document.createElement('tr');
    const hash = document.createElement('td');
    hash.className = 'mono';
    hash.textContent = e.hash_lock.slice(0, 10) + '…';
    const src = document.createElement('td');
    src.textContent = e.source_origin;
    const content = document.createElement('td');
    content.textContent = e.content.length > 36 ? e.content.slice(0, 36) + '…' : e.content;
    const time = document.createElement('td');
    time.textContent = new Date(e.stored_at).toLocaleTimeString();
    tr.append(hash, src, content, time);
    tbody.appendChild(tr);
  }
}

function resetView() {
  $('log').textContent = '';
  $('spec').textContent = '—';
  $('strategy').textContent = '—';
  $('esg').textContent = '—';
  $('evo').textContent = '—';
  resetRings();
}

let running = false;

async function run() {
  const intent = $('intent').value.trim();
  if (!intent) {
    setStatus('請先輸入需求', true);
    return;
  }
  if (running) return;
  running = true;
  $('run').disabled = true;
  setStatus('執行中…');
  resetView();
  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const { session_id } = await res.json();
    const es = new EventSource('/api/stream/' + session_id);
    es.onmessage = (m) => {
      const e = JSON.parse(m.data);
      logLine(e);
      if (e.layer != null) highlight(e.layer, e.status);
      render(e);
      if (e.status === 'final') {
        es.close();
        running = false;
        $('run').disabled = false;
        if (e.data && e.data.blocked) {
          setStatus('已攔截 — ' + e.data.reason, true);
        } else {
          setStatus('完成 ✓');
        }
        loadMemory();
      }
    };
    es.onerror = () => {
      es.close();
      running = false;
      $('run').disabled = false;
      setStatus('連線中斷', true);
    };
  } catch (err) {
    running = false;
    $('run').disabled = false;
    setStatus('錯誤：' + err.message, true);
  }
}

buildRings();
$('run').addEventListener('click', run);
$('refresh').addEventListener('click', loadMemory);
loadMemory();
