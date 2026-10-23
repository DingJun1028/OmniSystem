'use strict';

// 第 4 層：安全防護 — 萬能治理閘門（README §3.5）
// 職責：權限管控 · 合規校驗 · 隱私保護 · 邊界防護 · 禁用模式攔截
// 組別：守衛組 (25–30)

const { hashLock, unifiedResult } = require('../../../schemas');

// 禁用模式（品牌/安全惡意模式，§3.5.4）
const BLOCKED_PATTERNS = [
  /藍紫霓虹|霓虹機器人|大的字體|機器人大腦/,
  /漂浮數據|大量聚合|競品包羅萬象/,
];

class GovernanceGate {
  constructor({ authZ, privacy, compliance } = {}) {
    // TODO(守衛組 25–30)：AuthZEngine / PrivacyProtector / ComplianceChecker / BoundaryProtector
    this.authZ = authZ || { check: async () => true };
    this.privacy = privacy || { check: async () => true };
    this.compliance = compliance || { check: async () => true };
    this.audit = []; // 閘門通過/失敗記錄（Trackable）
  }

  isBlocked(obj) {
    return BLOCKED_PATTERNS.some((re) => re.test(JSON.stringify(obj)));
  }

  // 5T 驗證閘門（§3.5.4）：通過則 Hash Lock + Object.freeze，不可變
  async verify(obj, requirement = '') {
    const checks = {
      authz: (await this.authZ.check(obj)) ? 'pass' : 'fail',
      privacy: (await this.privacy.check(obj)) ? 'pass' : 'fail',
      compliance: (await this.compliance.check(obj, requirement)) ? 'pass' : 'fail',
      blocked_patterns: this.isBlocked(obj) ? 'fail' : 'pass',
    };
    const passed = Object.values(checks).every((v) => v === 'pass');
    const record = { checks, passed, requirement, timestamp: Date.now() };
    this.audit.push(record);
    if (!passed) return record;
    return Object.assign(record, { payload: Object.freeze(this._applyHashLock(obj)) });
  }

  _applyHashLock(obj) {
    const frozen = { obj, hash_lock: hashLock(obj) };
    Object.freeze(frozen.obj);
    return frozen;
  }

  emit(record) {
    return unifiedResult({
      layer_id: 4,
      status: record.passed ? 'success' : 'failed',
      source_origin: 'layer-4',
      payload: record,
      quality: { trustworthy: record.passed },
    });
  }
}

module.exports = { GovernanceGate, BLOCKED_PATTERNS };
