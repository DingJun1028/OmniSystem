'use strict';

// SSAS 系列化數據形狀（README §7）— 所有層共用的 5T 治理基礎
// 每一層的輸出都必須打包成 UnifiedResult，寫入即刻 Hash Lock + Object.freeze()（§8.2）
const crypto = require('crypto');

// §7.2 統一結果格式
// interface UnifiedResult {
//   uuid, version, timestamp, source_origin, layer_id,
//   status: 'success' | 'failed' | 'partial',
//   payload, metrics {duration_ms, cpu, memory, io, network},
//   quality {traceable, trackable, tangible, transparent, trustworthy},
//   hash_lock
// }

const LAYERS = [
  { layer_id: 0, name: 'intent-core', zh: '意圖心核', en: 'Intent Core', package: '@omnisystem/strategy' },
  { layer_id: 1, name: 'perception-radar', zh: '感知雷達', en: 'Perception Radar', package: '@omnisystem/tech' },
  { layer_id: 2, name: 'memory-vault', zh: '記憶樞紐', en: 'Memory Vault', package: '@omnisystem/tech' },
  { layer_id: 3, name: 'reasoning-brain', zh: '推理大腦', en: 'Reasoning Brain', package: '@omnisystem/tech' },
  { layer_id: 4, name: 'governance-gate', zh: '治理閘門', en: 'Governance Gate', package: '@omnisystem/guard' },
  { layer_id: 5, name: 'orchestration-hub', zh: '編排中樞', en: 'Orchestration Hub', package: '@omnisystem/marketing' },
  { layer_id: 6, name: 'execution-workshop', zh: '執行工坊', en: 'Execution Workshop', package: '@omnisystem/tech' },
  { layer_id: 7, name: 'integration-network', zh: '整合網絡', en: 'Integration Network', package: '@omnisystem/marketing' },
  { layer_id: 8, name: 'experience-portal', zh: '體驗門戶', en: 'Experience Portal', package: '@omnisystem/creative' },
  { layer_id: 9, name: 'evolution-loop', zh: '演化生長環', en: 'Evolution Loop', package: '@omnisystem/marketing' },
];

const QUALITY_5T = { traceable: true, trackable: true, tangible: true, transparent: true, trustworthy: true };

const hashLock = (obj) =>
  crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16);

const rid = (prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;

// §7.2 — 每一層的輸出統一打包（不可變，帶 Hash Lock）
function unifiedResult({ layer_id, status = 'success', payload, duration_ms = 0, source_origin, quality }) {
  const result = {
    uuid: rid('res'),
    version: '1.0.0',
    timestamp: Date.now(),
    source_origin,
    layer_id,
    status,
    payload,
    metrics: { duration_ms, cpu: 0, memory: 0, io: 0, network: 0 },
    quality: Object.assign({}, QUALITY_5T, quality),
  };
  result.hash_lock = hashLock({ payload: result.payload, status: result.status, layer_id, source_origin });
  return Object.freeze(result);
}

// §7.1 — LayerExecution：pipeline 中一層的執行紀錄（mutable，隨執行推進）
function layerExecution({ layer_id, source_origin }) {
  const layer = LAYERS[layer_id];
  return {
    layer_id,
    layer_name: layer ? layer.name : String(layer_id),
    status: 'pending', // 'pending' | 'running' | 'completed' | 'blocked'
    input: null,
    output: null,
    duration_ms: 0,
    error: null,
    source_origin,
  };
}

module.exports = { LAYERS, QUALITY_5T, hashLock, rid, unifiedResult, layerExecution };
