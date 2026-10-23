'use strict';

// 第 3 層：認知推理 — 萬能推理大腦（README §3.4）
// 職責：Groq Qwen 引擎 · 情境理解 · 策略生成 · 推演
// 組別：技術組 (07–12)
// 參考實作：根目錄 lib/groq.js（starter console 已接通 Groq Qwen）

// interface ReasoningContext {
//   intent,            // 來自第 0 層 IntentSpec
//   environment: [],    // 來自第 1 層 EnvironmentEvent[]
//   memory: [],         // 來自第 2 層 MemoryEntry[]
//   session_id, timestamp
// }
// interface Strategy {
//   strategy_id, name, description, steps: StrategyStep[],
//   expected_outcome, estimated_cost, priority, dependencies: string[]
// }
// interface StrategyStep {
//   step_id, action, target_layer（0–9）, parameters, estimated_time（秒）, resources: string[]
// }

const { rid, unifiedResult } = require('../../../schemas');

class ReasoningEngine {
  constructor(options = {}) {
    // ReasoningEngine 代理 Groq Qwen（模型可經 GROQ_MODEL 覆寫）
    this.model = options.model || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
    this.traces = []; // 推理軌跡（Trackable）
  }

  // TODO(技術組 07–12)：接 lib/groq.js 同款 Groq chat completions，並組裝 ReasoningContext
  async reason(context) {
    const strategy = {
      strategy_id: rid('strat'),
      name: '離線本地策略',
      description: `圍繞「${context.intent && context.intent.core_goal}」的可執行交付策略（離線骨架）`,
      steps: [
        { step_id: 's1', action: '確認需求規格與 KPI', target_layer: 0, parameters: {}, estimated_time: 120, resources: [] },
        { step_id: 's2', action: '產出交付計畫與 ESG 評分', target_layer: 6, parameters: {}, estimated_time: 300, resources: [] },
        { step_id: 's3', action: '5T 治理覆核與存證', target_layer: 4, parameters: {}, estimated_time: 180, resources: [] },
      ],
      expected_outcome: '一份可審計、可追溯的交付結果',
      estimated_cost: 0,
      priority: 'high',
      dependencies: [],
    };
    this._logReasoningTrace(context, strategy);
    return strategy;
  }

  // TODO(技術組 07–12)：SituationAnalyzer 情境分析、ScenarioSimulator 場景模擬、DecisionEngine 決策引擎
  _logReasoningTrace(context, strategy) {
    this.traces.push({
      session_id: context.session_id,
      inputs: { intent: context.intent && context.intent.intent_id, memories: (context.memory || []).length },
      output: strategy.strategy_id,
      model: this.model,
      timestamp: Date.now(),
    });
  }

  emit(strategy, sourceOrigin = 'layer-3') {
    return unifiedResult({ layer_id: 3, source_origin: sourceOrigin, payload: strategy });
  }
}

module.exports = { ReasoningEngine };
