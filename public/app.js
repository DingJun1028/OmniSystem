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
    const r = 78 + i * 18;
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    c.setAttribute('class', 'ring');
    c.dataset.layer = i;
    svg.appendChild(c);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', cx);
    t.setAttribute('y', cy - r + 12);
    t.setAttribute('class', 'ring-label');
    t.textContent = l[0];
    svg.appendChild(t);
  });
  const core = document.createElementNS(NS, 'circle');
  core.setAttribute('cx', cx);
  core.setAttribute('cy', cy);
  core.setAttribute('r', 64);
  core.setAttribute('class', 'core');
  svg.appendChild(core);
  const label = document.createElementNS(NS, 'text');
  label.setAttribute('x', cx);
  label.setAttribute('y', cy + 4);
  label.setAttribute('class', 'core-label');
  label.textContent = '用戶需求';
  svg.appendChild(label);

  const legend = $('legend');
  LAYERS.forEach((l, i) => {
    const li = document.createElement('li');
    li.dataset.layer = i;
    li.innerHTML = `<span class="dot"></span>${l[0]} ${l[1]} <em>${l[2]}</em>`;
    legend.appendChild(li);
  });
}

function setLayerState(i, state) {
  const ring = document.querySelector(`.ring[data-layer="${i}"]`);
  if (ring) {
    ring.classList.remove('active', 'done');
    if (state) ring.classList.add(state);
  }
  const li = document.querySelector(`#legend li[data-layer="${i}"]`);
  if (li) {
    li.classList.remove('active', 'done');
    if (state) li.classList.add(state);
  }
}

function logLine(text, cls, hash) {
  const li = document.createElement('li');
  if (cls) li.className = cls;
  li.innerHTML = `${text}${hash ? `<br /><span class="hash">hash_lock: ${hash}</span>` : ''}`;
  const log = $('log');
  log.appendChild(li);
  log.scrollTop = log.scrollHeight;
}

function showOutput(id, data) {
  $(id).textContent = JSON.stringify(data, null, 2);
}

function setStatus(text, cls) {
  const el = $('status');
  el.textContent = text;
  el.className = 'status ' + (cls || '');
}

function resetRun() {
  LAYERS.forEach((_, i) => setLayerState(i, null));
  ['out-intent', 'out-strategy', 'out-exec', 'out-evo'].forEach((id) => ($(id).textContent = '—'));
  $('log').innerHTML = '';
}

function loadMemory() {
  fetch('/api/memory')
    .then((r) => r.json())
    .then((d) => {
      $('memory').innerHTML = d.memories
        .map(
          (m) =>
            `<li><strong>${m.memory_id}</strong> · ${m.memory_type}<br />` +
            `<span class="hash">${m.hash_lock}</span><br />` +
            `<span class="preview">${JSON.stringify(m.content).slice(0, 160)}</span></li>`
        )
        .join('') || '<li class="empty">尚無記憶 — 執行一次 pipeline 即可存證</li>';
    })
    .catch(() => {});
}

function onLayerStart(d) {
  setLayerState(d.layer.layer_id, 'active');
  logLine(`▶ 第 ${d.layer.layer_id} 層 ${d.layer.zh}（${d.layer.en}）`);
}

function onLayerResult(d) {
  setLayerState(d.layer_id, d.status === 'blocked' ? 'blocked' : 'done');
  const cls = d.status === 'blocked' ? 'blocked' : 'done';
  logLine(
    `✓ 第 ${d.layer_id} 層 ${d.name.zh} — ${d.summary}（${d.duration_ms}ms）`,
    cls,
    d.hash_lock
  );
  if (d.layer_id === 0) showOutput('out-intent', d.output);
  if (d.layer_id === 3) showOutput('out-strategy', d.output);
  if (d.layer_id === 6) showOutput('out-exec', d.output);
  if (d.layer_id === 9) showOutput('out-evo', d.output);
}

function onLog(d) {
  logLine(`· ${d.message}`, 'info');
}

function onDone(d, es) {
  es.close();
  if (d.final_status === 'success') {
    setStatus(`完成 · 總耗時 ${d.total_duration_ms}ms`, 'ok');
    logLine(`✔ Pipeline 完成（${d.final_status}）`, 'done');
  } else if (d.final_status === 'blocked') {
    setStatus('治理閘門拒絕（第 4 層）', 'warn');
    logLine(`✖ Pipeline 被閘門攔截`, 'blocked');
  } else {
    setStatus('執行失敗', 'warn');
    logLine(`✖ 錯誤：${d.error || d.final_status}`, 'blocked');
  }
  loadMemory();
}

async function run() {
  const intent = $('intent').value.trim();
  if (intent.length < 2) {
    setStatus('請先輸入需求', 'warn');
    return;
  }
  $('run').disabled = true;
  resetRun();
  setStatus('執行中…');
  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const { session_id } = await res.json();
    const es = new EventSource('/api/stream/' + session_id);
    es.addEventListener('layer_start', (e) => onLayerStart(JSON.parse(e.data)));
    es.addEventListener('layer_result', (e) => onLayerResult(JSON.parse(e.data)));
    es.addEventListener('log', (e) => onLog(JSON.parse(e.data)));
    es.addEventListener('done', (e) => onDone(JSON.parse(e.data), es));
  } catch (err) {
    setStatus(err.message, 'warn');
    logLine(`✖ ${err.message}`, 'blocked');
  } finally {
    $('run').disabled = false;
  }
}

buildRings();
loadMemory();
$('run').addEventListener('click', run);
