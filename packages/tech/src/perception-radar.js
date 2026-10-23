'use strict';

// 第 1 層：環境輸入 — 萬能感知雷達（README §3.2）
// 職責：全管道捕捉多模態文檔、代碼、日誌、外部事件，提供第 2 層即時上下文
// 組別：技術組 (07–12)

// interface EnvironmentEvent {
//   event_id, source, type: 'document' | 'code' | 'log' | 'event' | 'metric' | 'alert',
//   payload,
//   metadata: { timestamp, source_origin, priority: 'low'|'medium'|'high'|'critical', session_id? }
// }

const { rid, unifiedResult } = require('../../../schemas');

const ALLOWED_SOURCES = ['console', 'api', 'github', 'cloudflare', 'log', 'saas'];
const ALLOWED_TYPES = ['document', 'code', 'log', 'event', 'metric', 'alert'];

// 事件路徑穿越防護（Trustworthy，§3.2.5）
function safeIngest(event) {
  if (!ALLOWED_SOURCES.includes(event.source)) {
    throw new Error(`Source not allowed: ${event.source}`);
  }
  if (!event.type || !ALLOWED_TYPES.includes(event.type)) {
    throw new Error(`Invalid event type: ${event.type}`);
  }
  if (!event.payload || !event.metadata) {
    throw new Error('Invalid event structure');
  }
  return event;
}

class MultimodalIngestor {
  constructor() {
    this.queue = []; // TODO(技術組 07–12)：替換為 EventStream（Kafka / NATS / WebSocket）
  }

  _event(source, type, payload, priority = 'medium', sessionId) {
    return safeIngest({
      event_id: rid('evt'),
      source,
      type,
      payload,
      metadata: {
        timestamp: Date.now(),
        source_origin: `${source}/${type}`,
        priority,
        session_id: sessionId,
      },
    });
  }

  // TODO(技術組 07–12)：文檔解析（Buffer + mimeType）
  ingestDocument(doc, mimeType) {
    return this._event('api', 'document', { buffer_length: doc ? doc.length : 0, mime_type: mimeType });
  }

  // TODO(技術組 07–12)：代碼攝取
  ingestCode(repo, file, content) {
    return this._event('api', 'code', { repo, file, bytes: content ? content.length : 0 });
  }

  // TODO(技術組 07–12)：日誌攝取
  ingestLog(logLine, source = 'log') {
    return this._event(source, 'log', { line: String(logLine).slice(0, 2000) });
  }

  // TODO(技術組 07–12)：ExternalEventAdapter（GitHub webhook、Cloudflare log、SaaS webhook）
  ingestExternalEvent(source, payload, priority = 'high') {
    return this._event(source, 'event', payload, priority);
  }

  // ContextAssembler：目前環境狀態 + 歷史狀態
  assembleContext(sessionId) {
    return this.queue.filter((e) => e.metadata.session_id === sessionId);
  }

  // 5T 輸出：交給第 2 層
  emit(event) {
    this.queue.push(event);
    if (this.queue.length > 1000) this.queue.shift();
    return unifiedResult({ layer_id: 1, source_origin: event.metadata.source_origin, payload: event });
  }
}

module.exports = { MultimodalIngestor, safeIngest, ALLOWED_SOURCES };
