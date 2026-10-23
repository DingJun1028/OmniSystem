'use strict';

// 第 8 層：價值交付 — 萬能體驗門戶（README §3.9）
// 職責：SSE 即時串流 · 儀表板 · 視覺化 · 客戶反饋收集 · 透明體驗
// 組別：創意組 (13–18)

// interface SSEEvent { event: 'progress'|'status'|'result'|'error', data, timestamp, session_id }
// interface DashboardMetric {
//   metric_id, name, value, unit,
//   category: 'execution'|'quality'|'experience'|'business',
//   trend: 'up'|'down'|'stable', updated_at
// }

const { rid, unifiedResult } = require('../../../schemas');

class SSEStreamingServer {
  constructor() {
    this.clients = new Map(); // session_id -> Set<寫入器>（starter console 的 server.js 已有 SSE 參考實作）
  }

  subscribe(sessionId, writer) {
    if (!this.clients.has(sessionId)) this.clients.set(sessionId, new Set());
    this.clients.get(sessionId).add(writer);
    return () => this.clients.get(sessionId).delete(writer);
  }

  // SSE 即時串流（§3.9.5）— 統一 payload 格式
  stream(sessionId, event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(Object.assign({ session_id: sessionId }, data))}\n\n`;
    for (const writer of this.clients.get(sessionId) || []) writer(payload);
    return payload;
  }
}

class DashboardRenderer {
  constructor() {
    this.metrics = new Map(); // TODO(創意組 13–18)：VisualizationEngine 視覺化引擎
  }

  // DashboardMetric 上報
  report(metric) {
    const record = Object.assign(
      { metric_id: rid('metric'), name: '', value: 0, unit: '', category: 'execution', trend: 'stable', updated_at: Date.now() },
      metric
    );
    this.metrics.set(record.metric_id, record);
    return record;
  }

  snapshot() {
    return Array.from(this.metrics.values());
  }

  // TODO(創意組 13–18)：ExperienceTracker 體驗追蹤 · FeedbackCollector 反饋收集
  emit(event) {
    return unifiedResult({ layer_id: 8, source_origin: 'layer-8', payload: event });
  }
}

module.exports = { SSEStreamingServer, DashboardRenderer };
