'use strict';

// 第 0 層：需求輸入 — 萬能意圖心核（README §3.1）
// 職責：感應核心目標、業務意圖、痛點 → 轉換為可構造的需求規格（RequirementSpec）
// 組別：策略組 (01–06)

// interface IntentSpec {
//   intent_id, source_origin,
//   user_type: 'enterprise' | 'individual' | 'system',
//   core_goal, business_intent, pain_points: string[],
//   kpi: { metric, target, owner },
//   priority: 'P0' | 'P1' | 'P2' | 'P3',
//   status: 'draft' | 'active' | 'closed' | 'superseded',
//   created_at, updated_at
// }
// interface RequirementSpec {
//   intent_ref, spec_id,
//   requirements: { functional, non_functional, constraints, acceptance_criteria },
//   version, tracked_at
// }

const { rid, unifiedResult, hashLock } = require('../../../schemas');

class IntentCore {
  constructor() {
    this.intents = new Map(); // intent_id -> IntentSpec
    this.history = new Map(); // intent_id -> IntentChange[]
  }

  register(intent) {
    const record = Object.assign(
      {
        intent_id: rid('intent'),
        source_origin: 'user-input',
        user_type: 'individual',
        core_goal: '',
        business_intent: '',
        pain_points: [],
        kpi: { metric: '', target: 0, owner: 'requester' },
        priority: 'P1',
        status: 'draft',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      intent
    );
    record.hash_lock = hashLock({ core_goal: record.core_goal, kpi: record.kpi, priority: record.priority });
    this.intents.set(record.intent_id, record);
    return Object.freeze(record);
  }

  // TODO(策略組 01–06)：接入 LLM（Groq Qwen）從自由文字提取 IntentSpec
  extract(text, source = 'user-input') {
    return this.register({
      source_origin: source,
      core_goal: text,
      business_intent: `交付：${text}`,
      status: 'active',
    });
  }

  // 需求生命週期：draft → active → closed / superseded（Trackable）
  transition(intent_id, next_status) {
    const intent = this.intents.get(intent_id);
    if (!intent) throw new Error(`unknown intent: ${intent_id}`);
    const changes = this.history.get(intent_id) || [];
    changes.push({ from: intent.status, to: next_status, timestamp: Date.now() });
    this.history.set(intent_id, changes);
    intent.status = next_status;
    intent.updated_at = Date.now();
    return intent;
  }

  // TODO(策略組 01–06)：從 IntentSpec 展開 RequirementSpec（功能/非功能/約束/驗收標準）
  toRequirementSpec(intent_id) {
    const intent = this.intents.get(intent_id);
    if (!intent) throw new Error(`unknown intent: ${intent_id}`);
    return {
      intent_ref: intent_id,
      spec_id: rid('spec'),
      requirements: { functional: [], non_functional: [], constraints: [], acceptance_criteria: [] },
      version: '0.1.0',
      tracked_at: Date.now(),
    };
  }

  // 5T 輸出：交給第 1 層時打包成 UnifiedResult
  emit(intent_id) {
    const intent = this.intents.get(intent_id);
    return unifiedResult({ layer_id: 0, source_origin: 'layer-0', payload: intent });
  }
}

module.exports = { IntentCore };
