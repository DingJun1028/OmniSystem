import { layers } from '../data/ssasData'

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function hashLock(obj) {
  const str = JSON.stringify(obj)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseIntent(text) {
  const lower = text.toLowerCase()
  const priority = lower.includes('緊急') || lower.includes('p0') || lower.includes('立即') ? 'P0' : lower.includes('重要') || lower.includes('p1') ? 'P1' : 'P2'
  const kpiMatch = text.match(/KPI[：:]?\s*([^，。\n]+)/)
  const kpi = kpiMatch ? kpiMatch[1].trim() : '達成目標指標'
  const painMatch = text.match(/痛點[：:]?\s*([^。\n]+)/)
  const pain = painMatch ? painMatch[1].trim() : '未明確痛點'
  return {
    intent_id: generateId(),
    source_origin: 'workspace-input',
    user_type: 'individual',
    core_goal: text.slice(0, 80),
    business_intent: text,
    pain_points: [pain],
    kpi: { metric: kpi, target: 100, owner: 'user' },
    priority,
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  }
}

function buildEnvironmentEvents(intent) {
  return [
    {
      event_id: generateId(),
      source: 'workspace',
      type: 'event',
      payload: { message: '收到新的意圖輸入', priority: intent.priority },
      metadata: { timestamp: Date.now(), source_origin: 'L0', priority: intent.priority === 'P0' ? 'critical' : 'medium' },
    },
    {
      event_id: generateId(),
      source: 'memory',
      type: 'metric',
      payload: { metric: 'intent_complexity', value: intent.business_intent.length },
      metadata: { timestamp: Date.now(), source_origin: 'L0', priority: 'low' },
    },
  ]
}

function retrieveMemory(intent, memory) {
  const q = intent.business_intent.toLowerCase()
  const related = memory
    .filter((m) => m.tags.some((t) => q.includes(t.toLowerCase())))
    .slice(0, 3)
  return related.length
    ? related
    : [
        {
          memory_id: 'default-case-1',
          memory_type: 'case',
          content: '類似意圖曾透過分階段執行達成，建議先驗證需求再進入編排。',
          tags: ['intent', 'planning'],
          confidence: 0.82,
          created_at: Date.now() - 86400000,
          created_by: 'system',
          source_origin: 'default-memory',
          lifespan: 30,
          retrievable: true,
        },
      ]
}

function buildStrategy(intent, events, memories) {
  const steps = [
    { step_id: 's1', action: '驗證意圖完整性與合規性', target_layer: 4, parameters: { check: 'intent' }, estimated_time: 1, resources: ['governance'], dependencies: [] },
    { step_id: 's2', action: '建立任務 DAG 與優先順序', target_layer: 5, parameters: { mode: 'auto' }, estimated_time: 2, resources: ['orchestrator'], dependencies: ['s1'] },
    { step_id: 's3', action: '執行核心業務運算', target_layer: 6, parameters: { task: 'main' }, estimated_time: 5, resources: ['executor'], dependencies: ['s2'] },
    { step_id: 's4', action: '整合外部服務與資料', target_layer: 7, parameters: { platforms: ['github', 'cloudflare'] }, estimated_time: 3, resources: ['integration'], dependencies: ['s3'] },
    { step_id: 's5', action: '生成體驗門戶儀表板', target_layer: 8, parameters: { dashboard: true }, estimated_time: 2, resources: ['dashboard'], dependencies: ['s4'] },
  ]
  return {
    strategy_id: generateId(),
    name: `${intent.core_goal.slice(0, 20)} 執行策略`,
    description: `針對「${intent.core_goal}」的策略，包含 ${steps.length} 個步驟。`,
    steps,
    expected_outcome: intent.kpi.metric,
    estimated_cost: steps.reduce((sum, s) => sum + s.estimated_time, 0),
    priority: intent.priority === 'P0' ? 'high' : 'medium',
    dependencies: ['s1'],
  }
}

function runGovernance(strategy, intent) {
  const blocked = /藍紫霓虹|霓虹機器人|大的字體|機器人大腦|漂浮數據|大量聚合|競品包羅萬象/.test(JSON.stringify(strategy))
  const privacyOk = !intent.business_intent.includes('密碼') && !intent.business_intent.includes('身分證')
  const status = blocked || !privacyOk ? 'fail' : 'pass'
  return {
    gate_id: generateId(),
    status,
    checks: { authz: true, privacy: privacyOk, compliance: !blocked, boundary: !blocked },
    hash_lock: hashLock(strategy),
    timestamp: Date.now(),
  }
}

function buildDAG(strategy) {
  const nodes = strategy.steps.map((s) => ({
    node_id: s.step_id,
    task: s.action,
    module: `layer-${s.target_layer}`,
    inputs: s.dependencies,
    outputs: [`out-${s.step_id}`],
    priority: s.target_layer,
    dependencies: s.dependencies,
    retries: 2,
    timeout: s.estimated_time * 2,
    status: 'pending',
  }))
  return {
    workflow_id: generateId(),
    name: strategy.name,
    nodes,
    edges: nodes.flatMap((n) => n.dependencies.map((from) => ({ from, to: n.node_id }))),
    status: 'pending',
    created_at: Date.now(),
    updated_at: Date.now(),
  }
}

function simulateExecution(dag) {
  const results = dag.nodes.map((node) => {
    const failed = Math.random() < 0.05
    return {
      node_id: node.node_id,
      status: failed ? 'failed' : 'success',
      output: failed ? null : { result: `${node.task} 完成`, artifact: `artifact-${node.node_id}.json` },
      error: failed ? { code: 'EXEC_ERROR', message: '模擬執行失敗，已重試', traceback: 'at simulateExecution' } : undefined,
      timestamp: Date.now(),
      duration_ms: node.timeout * 100 + Math.floor(Math.random() * 500),
      metrics: { cpu_usage: 0.3 + Math.random() * 0.5, memory_usage: 128 + Math.floor(Math.random() * 512) },
    }
  })
  const successCount = results.filter((r) => r.status === 'success').length
  return {
    results,
    overall: successCount === results.length ? 'success' : successCount > 0 ? 'partial' : 'failed',
  }
}

function simulateIntegrations(execution) {
  const calls = ['github', 'cloudflare', 'internal'].map((platform) => ({
    call_id: generateId(),
    platform,
    endpoint: platform === 'github' ? '/repos/owner/repo/issues' : platform === 'cloudflare' ? '/zones' : '/internal/notify',
    method: 'POST',
    headers: { 'X-Source-Origin': 'ssas-workspace' },
    payload: { status: execution.overall, results: execution.results.length },
    response: { ok: true },
    status_code: 200,
    timestamp: Date.now(),
  }))
  return calls
}

function buildDashboard(execution, integrations) {
  const success = execution.results.filter((r) => r.status === 'success').length
  const total = execution.results.length
  return {
    metrics: [
      { metric_id: 'm1', name: '任務成功率', value: Math.round((success / total) * 100), unit: '%', category: 'execution', trend: success === total ? 'up' : 'stable', updated_at: Date.now() },
      { metric_id: 'm2', name: '外部整合數', value: integrations.length, unit: 'calls', category: 'execution', trend: 'up', updated_at: Date.now() },
      { metric_id: 'm3', name: '平均耗時', value: Math.round(execution.results.reduce((sum, r) => sum + r.duration_ms, 0) / total), unit: 'ms', category: 'performance', trend: 'stable', updated_at: Date.now() },
      { metric_id: 'm4', name: '品質分數', value: Math.round(85 + Math.random() * 10), unit: '分', category: 'quality', trend: 'up', updated_at: Date.now() },
    ],
    events: execution.results.map((r) => ({
      event: r.status === 'success' ? 'progress' : 'error',
      data: { node_id: r.node_id, duration_ms: r.duration_ms },
      timestamp: r.timestamp,
      session_id: 'workspace',
    })),
  }
}

function buildEvolution(dashboard, intent) {
  return {
    evolution_id: generateId(),
    model_version: 'local-v1.1.0',
    strategy_updates: ['根據執行結果調整任務優先順序', '強化外部整合錯誤處理'],
    metrics: {
      satisfaction: dashboard.metrics.find((m) => m.category === 'quality')?.value || 90,
      performance: dashboard.metrics.find((m) => m.name === '平均耗時') ? Math.max(0, 100 - Math.round(dashboard.metrics.find((m) => m.name === '平均耗時').value / 10)) : 90,
      quality: dashboard.metrics.find((m) => m.category === 'quality')?.value || 90,
      compliance: 100,
    },
    next_actions: ['收集用戶反饋', '將本次結果寫入記憶庫', '優化下一輪策略'],
    timestamp: Date.now(),
  }
}

export async function runSSASPipeline({ intentText, memory = [] }, onLayerUpdate) {
  const sessionId = generateId()
  const startedAt = Date.now()
  const layerResults = []

  const report = (layerId, update) => {
    const result = { layerId, ...update }
    layerResults.push(result)
    if (onLayerUpdate) onLayerUpdate(result)
  }

  // L0
  const intent = parseIntent(intentText)
  report(0, { status: 'completed', output: intent, duration: 120 })
  await sleep(300)

  // L1
  const events = buildEnvironmentEvents(intent)
  report(1, { status: 'completed', output: events, duration: 200 })
  await sleep(300)

  // L2
  const memories = retrieveMemory(intent, memory)
  report(2, { status: 'completed', output: memories, duration: 250 })
  await sleep(300)

  // L3
  const strategy = buildStrategy(intent, events, memories)
  report(3, { status: 'completed', output: strategy, duration: 600 })
  await sleep(400)

  // L4
  const governance = runGovernance(strategy, intent)
  report(4, { status: governance.status === 'pass' ? 'completed' : 'blocked', output: governance, duration: 180 })
  await sleep(300)

  if (governance.status !== 'pass') {
    return {
      id: sessionId,
      createdAt: startedAt,
      intent,
      layers: layerResults,
      finalStatus: 'failed',
      error: '治理閘門未通過，流程已中止。',
    }
  }

  // L5
  const dag = buildDAG(strategy)
  report(5, { status: 'completed', output: dag, duration: 300 })
  await sleep(300)

  // L6
  const execution = simulateExecution(dag)
  report(6, { status: execution.overall === 'success' ? 'completed' : 'partial', output: execution, duration: 1500 })
  await sleep(500)

  // L7
  const integrations = simulateIntegrations(execution)
  report(7, { status: 'completed', output: integrations, duration: 800 })
  await sleep(300)

  // L8
  const dashboard = buildDashboard(execution, integrations)
  report(8, { status: 'completed', output: dashboard, duration: 400 })
  await sleep(300)

  // L9
  const evolution = buildEvolution(dashboard, intent)
  report(9, { status: 'completed', output: evolution, duration: 350 })

  return {
    id: sessionId,
    createdAt: startedAt,
    intent,
    layers: layerResults,
    finalStatus: execution.overall,
    dag,
    execution,
    dashboard,
    evolution,
  }
}

export function getLayerName(layerId) {
  return layers[layerId]?.name || `第 ${layerId} 層`
}

export function getLayerColor(layerId) {
  return layers[layerId]?.color || 'bg-coral'
}

export function getLayerText(layerId) {
  return layers[layerId]?.text || 'text-coral'
}
