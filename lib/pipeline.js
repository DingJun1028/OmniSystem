'use strict';
const crypto = require('crypto');

// 10 層同心圓架構（第 0 層需求心核 → 第 9 層演化生長環）
const LAYERS = [
  { layer_id: 0, zh: '意圖心核', en: 'Intent Core' },
  { layer_id: 1, zh: '感知雷達', en: 'Perception Radar' },
  { layer_id: 2, zh: '記憶樞紐', en: 'Memory Vault' },
  { layer_id: 3, zh: '推理大腦', en: 'Reasoning Brain' },
  { layer_id: 4, zh: '治理閘門', en: 'Governance Gate' },
  { layer_id: 5, zh: '編排中樞', en: 'Orchestration Hub' },
  { layer_id: 6, zh: '執行工坊', en: 'Execution Workshop' },
  { layer_id: 7, zh: '整合網絡', en: 'Integration Network' },
  { layer_id: 8, zh: '體驗門戶', en: 'Experience Portal' },
  { layer_id: 9, zh: '演化生長環', en: 'Evolution Loop' },
];

// 第 4 層治理閘門：規格中列出的品牌／安全禁用模式
const BLOCKED_PATTERNS = [
  { re: /藍紫霓虹|霓虹機器人|機器人大腦/, reason: '品牌禁用模式：藍紫霓虹／機器人擬人化' },
  { re: /漂浮數據|競品包羅萬象/, reason: '安全禁用模式：漂浮數據／競品包羅萬象' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hashLock = (obj) => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16);
const stableScore = (text, salt) => 60 + crypto.createHash('sha256').update(salt + text).digest()[0] % 41;

async function runPipeline(intent, { vault, emit, delayMs = 300, reasoningMode = 'local' }) {
  const started = Date.now();

  const step = async (layerId, status, detail, data) => {
    const l = LAYERS[layerId];
    emit({
      ts: new Date().toISOString(),
      layer: layerId,
      name_zh: l.zh,
      name_en: l.en,
      status,
      detail,
      data: data || null,
    });
    await sleep(delayMs);
  };

  const final = (data) =>
    emit({
      ts: new Date().toISOString(),
      layer: 9,
      name_zh: '演化生長環',
      name_en: 'Evolution Loop',
      status: 'final',
      detail: 'pipeline 結束',
      data,
    });

  // ── 第 0 層：意圖心核 ──
  const intentSpec = {
    intent_id: 'int_' + hashLock({ intent, at: started }).slice(0, 12),
    goal: intent,
    constraints: ['5T 治理貫穿', '離線優先', '可審計存證'],
    created_at: new Date(started).toISOString(),
  };
  await step(0, 'ok', '解析需求 → IntentSpec', intentSpec);

  // ── 第 1 層：感知雷達 ──
  await step(1, 'ok', '接收環境輸入（離線環境事件流）', {
    sources: ['環境事件流', '記憶召回', '上下文'],
    ingested: 1,
    offline: true,
  });

  // ── 第 2 層：記憶樞紐 ──
  const recalled = vault.recall(intent);
  const memEntry = vault.store({ content: intent, tags: ['intent'], source_origin: 'layer-0' });
  await step(2, 'ok', `記憶存證 · Hash Lock ${memEntry.hash_lock.slice(0, 10)}…（召回 ${recalled.length} 筆）`, {
    memory_id: memEntry.memory_id,
    hash_lock: memEntry.hash_lock,
    recalled: recalled.map((r) => r.memory_id),
  });

  // ── 第 3 層：推理大腦 ──
  if (reasoningMode !== 'local') {
    await step(3, 'warn', `推理模式「${reasoningMode}」未配置金鑰，回退本地策略`, null);
  }
  const strategy = {
    approach: '將需求拆解為三階段執行計畫',
    tasks: [
      { id: 't1', name: '分析需求範疇', produces: '範疇定義' },
      { id: 't2', name: '產出交付物', produces: '交付物草稿' },
      { id: 't3', name: '驗證與沉澱', produces: '驗證記錄' },
    ],
  };
  await step(3, 'ok', '本地推理大腦產出策略', strategy);

  // ── 第 4 層：治理閘門 ──
  const hit = BLOCKED_PATTERNS.find((p) => p.re.test(intent));
  if (hit) {
    const decision = { decision: 'BLOCKED', reason: hit.reason, hash_lock: hashLock({ intent, reason: hit.reason }) };
    vault.store({ content: `治理閘門攔截：${hit.reason}`, tags: ['governance', 'blocked'], source_origin: 'layer-4' });
    await step(4, 'blocked', `治理閘門拒絕 — ${hit.reason}`, decision);
    final({ blocked: true, reason: hit.reason, decision });
    return { status: 'blocked', reason: hit.reason, decision, duration_ms: Date.now() - started };
  }
  await step(4, 'ok', '治理閘門放行（無禁用模式命中）', { decision: 'PASS', hash_lock: hashLock(intent) });

  // ── 第 5 層：編排中樞 ──
  await step(5, 'ok', '編排為線性 DAG（t1 → t2 → t3）', {
    nodes: strategy.tasks.map((t) => t.id),
    edges: [['t1', 't2'], ['t2', 't3']],
  });

  // ── 第 6 層：執行工坊 ──
  const esg = {
    environmental: stableScore(intent, 'E'),
    social: stableScore(intent, 'S'),
    governance: stableScore(intent, 'G'),
  };
  await step(6, 'ok', `三項任務執行完成 · ESG 評分 E${esg.environmental}/S${esg.social}/G${esg.governance}`, {
    tasks_done: 3,
    esg,
    decision_record: { hash_lock: hashLock({ intent, esg }), decided_by: 'layer-6' },
  });

  // ── 第 7 層：整合網絡 ──
  await step(7, 'warn', '外部整合離線 — 依規格優雅降級', { mode: 'offline', fallback: true });

  // ── 第 8 層：體驗門戶 ──
  const result = {
    intent_id: intentSpec.intent_id,
    summary: `「${intent}」已完成三階段交付`,
    esg,
  };
  await step(8, 'ok', '體驗門戶輸出結果包', result);
  vault.store({ content: result.summary, tags: ['result'], source_origin: 'layer-8' });

  // ── 第 9 層：演化生長環 ──
  const evolution = {
    recommendations: ['擴充第 3 層外部推理（配置 GROQ_API_KEY）', '為第 7 層接上真實整合來源', '迭代第 4 層禁用模式清單'],
  };
  await step(9, 'ok', '演化建議已沉澱至記憶樞紐', evolution);

  const duration_ms = Date.now() - started;
  final({ blocked: false, result });
  return { status: 'ok', result, duration_ms };
}

module.exports = { runPipeline, LAYERS, BLOCKED_PATTERNS };
