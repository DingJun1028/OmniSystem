# SSAS 萬能系統工作台 — 實作計畫

## 目標
將現有的靜態介紹網站升級為可實際運作的 **SSAS 萬能系統工作台**。用戶能輸入真實意圖，系統依序跑完 10 層流程，產出結構化結果、執行計畫、儀表板與反饋循環。

## 設計原則
- **預設可離線運作**：本地規則引擎 + localStorage，無需 API key 或後端。
- **預留擴充點**：設定頁可選擇啟用外部 AI API（Groq/Qwen）與 Supabase 同步。
- **單一工作流程**：輸入意圖 → 執行 10 層 → 查看結果 → 儲存/匯出。
- **保留介紹頁**：現有 Landing 內容作為 `/` 首頁，新增 `/workspace` 與 `/settings`。

## 技術棧
- Vite + React + Tailwind（沿用）
- `react-router-dom` 路由
- React Context 做全局狀態（SSASContext）
- localStorage 做資料持久化
- 單一 `ssasEngine.js` 封裝 10 層本地模擬邏輯

## 頁面結構
- `/`：Landing 介紹頁（現有內容）
- `/workspace`：SSAS 工作台
- `/settings`：設定與資料管理

## 資料模型
- `IntentSpec`：用戶輸入的目標、痛點、KPI、優先級
- `SSASSession`：一次完整運行，包含 10 層輸入/輸出/狀態
- `LayerResult`：每層的輸出、耗時、狀態
- `DAGWorkflow`：第 5 層產生的任務圖
- `ExecutionResult`：第 6 層執行結果
- `Feedback`：第 9 層反饋

## 10 層運作流程
1. **L0 意圖核心**：解析輸入為結構化 IntentSpec
2. **L1 感知雷達**：模擬環境事件輸入
3. **L2 記憶樞紐**：從本地記憶庫檢索相關案例
4. **L3 推理大腦**：產生策略與步驟
5. **L4 治理閘門**：權限/合規/隱私/邊界檢查
6. **L5 編排中樞**：建立 DAG 工作流
7. **L6 執行工坊**：模擬執行並產出成果
8. **L7 整合網絡**：模擬外部 API 呼叫
9. **L8 體驗門戶**：即時進度與儀表板
10. **L9 演化生長環**：收集反饋與改進建議

## 缺口補齊
- [x] 深色模式 ThemeProvider
- [ ] react-router-dom 路由
- [ ] SSASContext 全局狀態
- [ ] ssasEngine 本地引擎
- [ ] Workspace 工作台 UI
- [ ] Settings 設定頁
- [ ] Header 導航更新
- [ ] localStorage 持久化
- [ ] 資料匯出/匯入
- [ ] Build 驗證
