#!/usr/bin/env node
'use strict';

// OmniSystem 骨架自檢：所有層模組可載入、5T 骨架可用、治理閘門真的攔得住
const failures = [];
const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(`✓ ${name}`);
  } catch (err) {
    failures.push(name);
    results.push(`✗ ${name}: ${err.message}`);
  }
}

async function main() {
  await check('schemas 載入', () => {
    const s = require('../schemas');
    if (s.LAYERS.length !== 10) throw new Error('LAYERS 應為 10 層');
    const r = s.unifiedResult({ layer_id: 0, source_origin: 'check', payload: { ok: 1 } });
    if (!r.hash_lock || r.quality.traceable !== true) throw new Error('UnifiedResult 不完整');
  });

  await check('第 0 層 意圖心核', () => {
    const { IntentCore } = require('../packages/strategy');
    const core = new IntentCore();
    const intent = core.extract('骨架自檢');
    if (intent.status !== 'active' || !intent.hash_lock) throw new Error('IntentSpec 不完整');
  });

  await check('第 1 層 感知雷達', () => {
    const { MultimodalIngestor } = require('../packages/tech');
    const radar = new MultimodalIngestor();
    const evt = radar.ingestLog('test line');
    if (!evt.metadata.source_origin) throw new Error('事件缺 source_origin');
    let blocked = false;
    try {
      radar._event('evil-source', 'log', {});
    } catch {
      blocked = true; // safeIngest 攔截未知來源 = Trustworthy 通過
    }
    if (!blocked) throw new Error('safeIngest 未攔截未知來源');
  });

  await check('第 2 層 記憶樞紐', () => {
    const { MemoryVault } = require('../packages/tech');
    const vault = new MemoryVault();
    const e = vault.store({ content: { a: 1 }, tags: ['x'] });
    if (!e.hash_lock || vault.search('a').length !== 1) throw new Error('記憶存證/檢索異常');
  });

  await check('第 3 層 推理大腦（離線骨架）', async () => {
    const { ReasoningEngine } = require('../packages/tech');
    const strategy = await new ReasoningEngine().reason({ intent: { core_goal: '自檢' }, session_id: 'check' });
    if (strategy.steps.length < 1) throw new Error('策略步驟為空');
  });

  await check('第 4 層 治理閘門', async () => {
    const { GovernanceGate } = require('../packages/guard');
    const gate = new GovernanceGate();
    const bad = await gate.verify({ text: '藍紫霓虹 機器人大腦' });
    if (bad.passed) throw new Error('禁用模式未被攔截');
    const ok = await gate.verify({ text: '正常交付內容' });
    if (!ok.passed) throw new Error('正常內容被誤攔');
  });

  await check('第 5 層 編排中樞 DAG', () => {
    const { DAGBuilder } = require('../packages/marketing');
    const dag = new DAGBuilder('check');
    const a = dag.addNode({ task: 'a' });
    const b = dag.addNode({ task: 'b', dependencies: [a.node_id] });
    const order = dag.topologicalOrder();
    if (order.indexOf(a.node_id) > order.indexOf(b.node_id)) throw new Error('拓撲排序錯誤');
    const cyclic = new DAGBuilder('cyclic');
    const n1 = cyclic.addNode({ task: 'n1' });
    const n2 = cyclic.addNode({ task: 'n2' });
    cyclic.addEdge(n1.node_id, n2.node_id);
    cyclic.addEdge(n2.node_id, n1.node_id);
    try {
      cyclic.topologicalOrder();
      throw new Error('fail-never');
    } catch (err) {
      if (/循環依賴/.test(err.message)) return; // 預期：循環依賴被偵測
      throw err;
    }
  });

  await check('第 6 層 執行工坊', async () => {
    const { ESGScorer, ExecutorFactory } = require('../packages/tech');
    const score = await new ESGScorer().compute('entity-1');
    if (!score.hash_lock || !Object.isFrozen(score)) throw new Error('ESG 評分缺 Hash Lock / freeze');
    const factory = new ExecutorFactory().register('noop', async () => 'done');
    const result = await factory.execute({ node_id: 'n1', task: 'noop' });
    if (result.output !== 'done') throw new Error('執行器輸出異常');
    const missing = await factory.execute({ node_id: 'n2', task: 'unknown' });
    if (missing.status !== 'failed') throw new Error('未註冊執行器應回報 failed');
  });

  await check('第 8 層 體驗門戶', () => {
    const { SSEStreamingServer, DashboardRenderer } = require('../packages/creative');
    const sse = new SSEStreamingServer();
    const frames = [];
    const unsubscribe = sse.subscribe('sess', (frame) => frames.push(frame));
    sse.stream('sess', 'progress', { layer: 4 });
    unsubscribe();
    if (frames.length !== 1 || !frames[0].includes('event: progress')) throw new Error('SSE 串流異常');
    const dash = new DashboardRenderer();
    dash.report({ name: 'esg', value: 82, unit: '分' });
    if (dash.snapshot().length !== 1) throw new Error('儀表板指標異常');
  });

  await check('第 9 層 演化生長環', async () => {
    const { EvolutionLoop } = require('../packages/marketing');
    const loop = new EvolutionLoop(null);
    loop.collectFeedback({ rating: 5 });
    const result = await loop.evolve();
    if (result.metrics.satisfaction !== 5) throw new Error('演化指標異常');
  });

  console.log(results.join('\n'));
  if (failures.length) {
    console.error(`\n${failures.length} 項失敗`);
    process.exit(1);
  }
  console.log('\nOmniSystem 骨架自檢全部通過（5T ✓）');
}

main();
