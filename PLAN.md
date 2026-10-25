# SSAS 互動式框架門戶 — 優化計畫

## 目標
補齊所有缺口、提升效能、降低打包體積、強化無障礙與視覺對比。

## 優化項目
- [ ] 效能：React.lazy + Suspense 延遲載入下方區塊
- [ ] 效能：React.memo 減少同心圖與表格不必要重繪
- [ ] 效能：LayerDiagram 改用 CSS transition，減少 Framer Motion 開銷
- [ ] 效能：Vite manual chunks 拆分 vendor 與頁面區塊
- [ ] 體積：移除無用程式碼、確認 tree-shaking
- [ ] 無障礙：aria-label、table scope、skip link、focus-visible
- [ ] 視覺：修正淺色背景上的文字對比（sunshine / mint 使用 ink 文字）
- [ ] 修復：Tailwind v3 不支援的 `bg-opacity-*` 改為 `/opacity`
- [ ] 文件：新增 README.md 說明技術棧與本地開發
- [ ] 建置驗證：npm run build 成功、預覽正常
