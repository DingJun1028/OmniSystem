'use strict';

// 第 2 層：經驗沉澱 — 萬能記憶樞紐（README §3.3）
// 職責：5T 治理存證、歷史案例、決策因果、長期偏好；供第 3 層推理使用
// 組別：技術組 (07–12)
// 參考實作：根目錄 lib/memory.js（starter console 已運行的版本）

// interface MemoryEntry {
//   memory_id, memory_type: 'preference'|'decision'|'case'|'event'|'pattern',
//   content, tags: string[], confidence, created_at, created_by,
//   source_origin, lifespan（天）, retrievable
// }
// interface DecisionRecord {
//   decision_id, context, options: string[], chosen, rationale,
//   outcome, outcome_metric?, timestamp
// }

const { rid, hashLock, unifiedResult } = require('../../../schemas');

class MemoryVault {
  constructor() {
    this.entries = []; // TODO(技術組 07–12)：替換為 SQLite / PostgreSQL / TencentDB + MemoryIndex（向量 + 標籤）
  }

  // 5T 記憶存證：Hash Lock（§3.3.5）
  store(entry) {
    const record = Object.assign(
      {
        memory_id: rid('mem'),
        memory_type: 'event',
        content: null,
        tags: [],
        confidence: 1,
        created_at: Date.now(),
        created_by: 'omnisystem',
        source_origin: 'layer-2',
        lifespan: 365,
        retrievable: true,
      },
      entry
    );
    record.hash_lock = hashLock({
      content: record.content,
      tags: record.tags,
      created_at: record.created_at,
      source_origin: record.source_origin,
    });
    this.entries.push(record);
    return Object.freeze(record);
  }

  // TODO(技術組 07–12)：向量索引 + 標籤索引的語意檢索
  search(query) {
    const q = String(query || '').toLowerCase();
    return this.entries.filter((e) => e.retrievable && !this._expired(e)).filter((e) => {
      const text = JSON.stringify(e.content || {}).toLowerCase();
      return !q || text.includes(q) || (e.tags || []).some((t) => t.toLowerCase().includes(q));
    });
  }

  // 記憶生命週期：過期自動標記 expired（Trackable）
  _expired(entry) {
    return Date.now() - entry.created_at > entry.lifespan * 86400000;
  }

  // 決策日誌（DecisionLogger）— 決策、因果、結果
  logDecision(decision) {
    return this.store({
      memory_type: 'decision',
      content: Object.assign(
        { decision_id: rid('dec'), context: '', options: [], chosen: '', rationale: '', outcome: '', timestamp: Date.now() },
        decision
      ),
      tags: ['decision'],
      source_origin: 'decision-logger',
    });
  }

  // TODO(技術組 07–12)：PreferenceTracker 用戶偏好追蹤、CaseRepository 歷史案例庫
  emit(entry) {
    return unifiedResult({ layer_id: 2, source_origin: entry.source_origin, payload: entry });
  }
}

module.exports = { MemoryVault };
