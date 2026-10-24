# SSAS 互動式框架門戶 — 實作計畫

## 目標
將 README.md 中的 SSAS（System of Systems Architecture）萬能系統框架，轉化為一個可互動、可視覺化的單頁門戶網站。

## 技術棧
- Vite 7.3.1 + React 18.3.1
- Tailwind CSS 3.4.17
- Framer Motion（彈簧動效）
- Lucide React（圖示）

## 設計系統
採用專案提供的 Playful Consumer DESIGN.md：
- 奶油底 #FFF8F0、白色表面
- 珊瑚色 #FF6B6B 為主色
- Poppins 標題 + Nunito 內文
- 大圓角、膠囊按鈕、卡片陰影、彈簧動效

## 頁面結構
1. **Hero** — 標題、版本、設計哲學、5T 標籤
2. **10 層同心圖** — 可點擊的同心圓，選中後展開詳情
3. **層級詳情面板** — 職責、核心元件、Schema、5T 實現、關鍵程式碼
4. **5T 治理矩陣** — 10 層 × 5T 對照表
5. **客戶旅程** — 10 階段垂直流程
6. **實作路徑** — 優先級與五週計畫
7. **安全與治理總覽** — 10 道閘門與關鍵策略
8. **Footer** — 參考與延伸

## 檔案結構
- package.json / vite.config.js / index.html / tailwind.config.js / postcss.config.js
- src/main.jsx / src/App.jsx / src/index.css
- src/data/ssasData.js（所有框架內容）
- src/components/Hero.jsx
- src/components/LayerDiagram.jsx
- src/components/LayerDetail.jsx
- src/components/GovernanceMatrix.jsx
- src/components/CustomerJourney.jsx
- src/components/Roadmap.jsx
- src/components/SecurityOverview.jsx
- src/components/Footer.jsx

## 狀態
- [x] 計畫確認
- [x] 專案建置
- [x] 元件開發
- [x] 資料注入
- [x] 建置與預覽
