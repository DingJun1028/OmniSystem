'use strict';

// 第 6 層：實質落地 — 萬能執行工坊（README §3.7）
// 職責：程式碼修復 · ESG 評分計算 · 內部流水線 · 產出具體成果物
// 組別：技術組 (07–12)

// interface ExecutionResult {
//   node_id, status: 'success' | 'failed' | 'timeout' | 'aborted',
//   output, error?: { code, message, traceback }, timestamp, duration_ms,
//   metrics: { cpu_usage?, memory_usage?, io_streams?, network_io? }
// }

const { rid, hashLock, unifiedResult } = require('../../../schemas');

class ESGScorer {
  // ESG 評分計算（§3.7.5）— 5T 存證：Hash Lock + Object.freeze
  async compute(entity, metrics = []) {
    const score = {
      entity,
      environment: 0,
      social: 0,
      governance: 0,
      total: 0,
      computed_at: Date.now(),
    };
    // TODO(技術組 07–12)：_calculateEnvironment / _calculateSocial / _calculateGovernance / _calculateTotal
    score.total = Math.round((score.environment + score.social + score.governance) / 3);
    score.hash_lock = hashLock(score);
    return Object.freeze(score);
  }
}

class ExecutorFactory {
  constructor() {
    this.executors = new Map();
  }

  // 註冊執行器（CodeFixer、ESGScorer、PipelineRunner…）
  register(kind, executor) {
    this.executors.set(kind, executor);
    return this;
  }

  // TODO(技術組 07–12)：ExecutionContext（workflow_id、node_id、timeout、user 權限）驅動執行
  async execute(node, context = {}) {
    const executor = this.executors.get(node.task);
    const t0 = Date.now();
    const result = {
      node_id: node.node_id,
      status: 'success',
      output: null,
      timestamp: Date.now(),
      duration_ms: Date.now() - t0,
      metrics: {},
    };
    if (!executor) {
      result.status = 'failed';
      result.error = { code: 'no_executor', message: `未註冊執行器：${node.task}`, traceback: '' };
      return result;
    }
    result.output = await executor(node, context);
    return result;
  }

  // TODO(技術組 07–12)：ArtifactCollector 成果物收集器
  emit(result) {
    return unifiedResult({ layer_id: 6, source_origin: 'layer-6', payload: result });
  }
}

module.exports = { ESGScorer, ExecutorFactory };
