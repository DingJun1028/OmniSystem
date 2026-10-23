'use strict';

// 第 7 層：外部連結 — 萬能整合網絡（README §3.8）
// 職責：GitHub · Cloudflare · 第三方 API · SaaS · 內部微服務；離線優先、優雅回落
// 組別：營銷組 (19–24)

const { unifiedResult } = require('../../../schemas');

// 外部調用基類：Traceable（source_origin）/ Trackable（調用日誌）/ Trustworthy（HMAC 驗證）
class ExternalAdapter {
  constructor(name, baseURL) {
    this.name = name;
    this.baseURL = baseURL;
    this.callLog = []; // 調用日誌：端點、狀態、耗時
  }

  async request(path, options = {}) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${this.baseURL}${path}`, options);
      this._log(path, res.status, Date.now() - t0);
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
    } catch (err) {
      // 雲端優雅回落（§2）：外部整合失敗不中斷流程
      this._log(path, 0, Date.now() - t0, String(err.message || err));
      return { ok: false, status: 0, data: null, fallback: true };
    }
  }

  _log(endpoint, status, duration_ms, error) {
    this.callLog.push({ adapter: this.name, endpoint, status, duration_ms, error: error || null, timestamp: Date.now() });
  }
}

class GitHubAdapter extends ExternalAdapter {
  constructor() {
    super('github', 'https://api.github.com');
    // TODO(營銷組 19–24)：GITHUB_TOKEN 經加密注入，請求帶 X-Source-Origin: aistation-omni
  }

  async createIssue(owner, repo, title, body) {
    return this.request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Source-Origin': 'aistation-omni' },
      body: JSON.stringify({ title, body }),
    });
  }
}

class CloudflareAdapter extends ExternalAdapter {
  constructor() {
    super('cloudflare', 'https://api.cloudflare.com/client/v4');
    // TODO(營銷組 19–24)：CLOUDFLARE_API_TOKEN · DNS / 安全 / 分析端點
  }
}

// TODO(營銷組 19–24)：ThirdPartyAPIAdapter · SaaSConnector · IntegrationOrchestrator 整合調度
module.exports = { ExternalAdapter, GitHubAdapter, CloudflareAdapter };
