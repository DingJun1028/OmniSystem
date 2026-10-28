# OmniSystem 安裝與設定指南（SETUP.md）

OmniSystem 是以 SSAS 系統框架規格實作的萬能系統 Console：10 層同心圓架構（第 0 層需求心核 → 第 9 層演化生長環）、5T 治理貫穿每一層、第 3 層可選 Groq LLM 推理。

## 技術棧

- **零依賴 Node.js**（>= 18，建議 22）：`server.js` + `lib/`（`memory.js`、`pipeline.js`、`reasoner.js`）
- **靜態前端**：`public/`（無建置步驟）
- **資料**：第 2 層記憶樞紐以 JSON 檔案存證（每筆帶 SHA-256 Hash Lock）

## 快速開始（本機直跑）

```bash
# 1. 建立環境變數檔
cp .env.example .env

# 2. 啟動（無需 npm install —— 零依賴）
npm start            # = node server.js
# 或開發模式（存檔即自動重啟）
npm run dev:server   # = node --watch server.js
```

開啟 http://localhost:3000

## Docker 啟動

```bash
cp .env.example .env
docker compose up
```

- 埠：`PORT`（預設 3000）→ 容器 3000
- 記憶樞紐資料寫入 named volume `omni_data`（容器內 `/data`），**不會**落在原始碼目錄
- 健康檢查：`GET /healthz`

## 環境變數一覽（.env）

| 變數 | 預設 | 說明 |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | 綁定位址 |
| `PORT` | `3000` | 服務埠 |
| `SSAS_DATA_DIR` | `./data` | 記憶樞紐資料目錄（docker compose 下覆寫為 `/data`） |
| `SSAS_PIPELINE_DELAY_MS` | `350` | 每層的展示延遲（毫秒），控制 SSE 視覺化節奏 |
| `SSAS_REASONING_MODE` | `groq` | 第 3 層推理模式：`local`（離線）或 `groq`（LLM） |
| `GROQ_API_KEY` | 空 | Groq API 金鑰；留空時 `groq` 模式自動回退本地策略 |
| `GROQ_MODEL` | `qwen/qwen3.8-27b` | 第 3 層使用的 Groq 模型 |

> `server.js` 內建零依賴 `.env` 載入器：只補上「尚未存在」的變數，正式環境變數優先。
> `.env` 已列入 `.gitignore`；`GROQ_API_KEY` 永不提交，透過平台金鑰管理或手動填入本機 `.env`。

## 第 3 層 LLM 推理（Groq）設定

1. 至 https://console.groq.com/keys 取得 API Key。
2. 在 `.env` 設定 `SSAS_REASONING_MODE=groq` 與 `GROQ_API_KEY=<你的金鑰>`。
3. `GROQ_MODEL` 需為你的帳號可用的模型（本專案以 `qwen/qwen3.8-27b` 驗證；可用下方指令查看可用清單）。

**永不失敗設計**：金鑰缺失、驗證失敗、模型不存在或 API 錯誤時，第 3 層只會發出 `warn` 事件並回退本地策略，pipeline 不會中斷。

## 驗證環境配置

```bash
# 1. 健康檢查
curl http://localhost:3000/healthz
# → {"ok":true,...}

# 2. 執行 pipeline（觸發 10 層流程，含第 3 層 LLM 推理）
SID=$(curl -s -X POST http://localhost:3000/api/run \
  -H 'Content-Type: application/json' \
  -d '{"intent":"為 ESG 報告建立自動評分流水線"}' | sed -n 's/.*"session_id":"\([^"]*\)".*/\1/p')

# 3. 查看 SSE 事件（第 3 層應出現 "LLM 推理完成 · groq:qwen/qwen3.8-27b"）
curl -N http://localhost:3000/api/stream/$SID

# 4. 治理閘門測試（第 4 層應攔截）
curl -s -X POST http://localhost:3000/api/run \
  -H 'Content-Type: application/json' -d '{"intent":"藍紫霓虹"}'
```

## API 端點

| 端點 | 說明 |
| --- | --- |
| `GET /` | Console UI |
| `GET /healthz` | 健康檢查 |
| `POST /api/run` `{intent}` | 啟動 pipeline，回傳 `{session_id}` |
| `GET /api/stream/:id` | SSE 進度事件（`final` 事件後關閉串流） |
| `GET /api/memory` | 第 2 層 5T 存證最近 20 筆 |
