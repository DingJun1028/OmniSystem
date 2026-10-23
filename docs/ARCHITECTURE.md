# OmniSystem 核心目錄結構（SSAS 萬能系統）

依據 README（SSAS 系統框架 v1.0.0）§6.3 組件對應表產生的目錄骨架。每一層的模組都是零依賴 CommonJS 骨架：數據形狀以 JSDoc 對齊規格、5T 存證（Hash Lock + Object.freeze）已就位、TODO 標註各組待實作範圍。

## 目錄結構

```
omnisystem/
├── package.json                # workspace 根（packages/*）
├── scripts/check-all.js        # 骨架自檢（10 層模組載入 + 治理閘門攔截 + DAG 驗證）
├── schemas/index.js            # §7 系列化數據形狀：UnifiedResult / LayerExecution / LAYERS / 5T
├── packages/
│   ├── strategy/               # 第 0 層 意圖心核（策略組 01–06）
│   │   └── src/intent-core.js      # IntentCore：register / extract / 生命週期 / RequirementSpec
│   ├── tech/                   # 第 1、2、3、6 層（技術組 07–12）
│   │   └── src/
│   │       ├── perception-radar.js    # MultimodalIngestor + safeIngest 來源防護
│   │       ├── memory-vault.js        # MemoryVault / DecisionLogger（Hash Lock 存證）
│   │       ├── reasoning-brain.js     # ReasoningEngine（Groq Qwen；離線優先回落）
│   │       └── execution-workshop.js  # ESGScorer / ExecutorFactory
│   ├── guard/                  # 第 4 層 治理閘門（守衛組 25–30）
│   │   └── src/governance-gate.js    # GovernanceGate：authz / privacy / compliance / 禁用模式
│   ├── marketing/              # 第 5、7、9 層（營銷組 19–24）
│   │   └── src/
│   │       ├── orchestration-hub.js   # DAGBuilder（拓撲排序、循環偵測）/ Orchestrator
│   │       ├── integration-network.js # GitHubAdapter / CloudflareAdapter（優雅回落）
│   │       └── evolution-loop.js      # EvolutionLoop：反饋 → 指標 → 演化報告
│   └── creative/               # 第 8 層 體驗門戶（創意組 13–18）
│       └── src/experience-portal.js  # SSEStreamingServer / DashboardRenderer
├── server.js + lib/ + public/  # starter console（已運行的參考實作，見下）
└── docs/ARCHITECTURE.md        # 本文件
```

## 與 starter console 的關係

`server.js` + `lib/`（pipeline、memory、groq）是已可運行的 10 層參考實作（SSE console）。`packages/` 是規格 §6.3 的目標結構：各組將 lib/ 的單體邏輯遷入對應層模組，遷移期間 starter console 持續運行不受影響。

- 第 3 層 Groq Qwen 已在 `lib/groq.js` 接通（`GROQ_API_KEY` 經 `/run/base44/app.env` 注入）；`packages/tech/src/reasoning-brain.js` 骨架沿用 `GROQ_MODEL` 環境變數。
- 第 2 層 `lib/memory.js` 為檔案版 MemoryVault；`packages/tech/src/memory-vault.js` 骨架標註了 SQLite / PostgreSQL / 向量索引 的升級點。

## 層 ↔ 套件 ↔ 數據形狀

| 層 | 套件 | 規格數據形狀 | 5T 關鍵實現 |
|---|---|---|---|
| 0 意圖心核 | @omnisystem/strategy | IntentSpec / RequirementSpec | 需求生命週期 + 變更歷史 |
| 1 感知雷達 | @omnisystem/tech | EnvironmentEvent | safeIngest 來源防護 |
| 2 記憶樞紐 | @omnisystem/tech | MemoryEntry / DecisionRecord | Hash Lock 存證、過期生命週期 |
| 3 推理大腦 | @omnisystem/tech | ReasoningContext / Strategy | 推理軌跡記錄、離線回落 |
| 4 治理閘門 | @omnisystem/guard | 閘門審計記錄 | 4 項檢查 + Object.freeze |
| 5 編排中樞 | @omnisystem/marketing | DAGWorkflow / DAGNode / DAGEdge | 循環依賴偵測、重試欄位 |
| 6 執行工坊 | @omnisystem/tech | ExecutionContext / ExecutionResult | ESG Hash Lock + Object.freeze |
| 7 整合網絡 | @omnisystem/marketing | 調用日誌 | source_origin 標頭、優雅回落 |
| 8 體驗門戶 | @omnisystem/creative | SSEEvent / DashboardMetric | 串流 payload 統一格式 |
| 9 演化生長環 | @omnisystem/marketing | Feedback / EvolutionResult | 演化歷史入記憶樞紐 |

所有層輸出統一經 `schemas/index.js` 的 `unifiedResult()` 打包（§7.2），即刻 Hash Lock + Object.freeze（§8.2）。

## 自檢

```sh
node scripts/check-all.js   # 或 npm run check
```

驗證：10 層模組全部可載入、治理閘門攔截「藍紫霓虹」禁用模式、DAG 循環依賴被偵測、SSE 串流與演化指標正常。

## 實作路徑對應（規格 §6）

- 週 1（層 0–3 原型）：strategy/ + tech/ 前三個模組 — 已有骨架，待接 Groq Qwen 與事件流
- 週 2（層 4–6）：guard/ + orchestration-hub.js + execution-workshop.js — 待補 AuthZ / 合規 / 執行器
- 週 3（層 7）：integration-network.js — 待 GITHUB_TOKEN / CLOUDFLARE_API_TOKEN
- 週 4（層 8）：experience-portal.js — 待儀表板渲染
- 週 5（層 9）：evolution-loop.js — 待績效分析與模型優化
