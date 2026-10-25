# SSAS 互動式框架門戶

基於 junaikey 萬能元鑰 + 5T 協定的 SSAS（System of Systems Architecture）可視化門戶網站。

## 技術棧

- **Vite 7.3.1** — 快速開發與建置
- **React 18.3.1** — UI 元件庫
- **Tailwind CSS 3.4.17** — 原子化樣式
- **Lucide React 0.468.0** — 圖示

## 設計系統

採用 Playful Consumer 風格：

- 奶油底 `#FFF8F0`、白色表面
- 珊瑚色 `#FF6B6B` 為主色
- Poppins 標題 + Nunito 內文
- 大圓角、膠囊按鈕、卡片陰影、彈簧動效

## 本地開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
npm run preview
```

## 專案結構

```
src/
  components/     # React 元件
  data/           # SSAS 框架資料
  App.jsx         # 應用程式入口
  main.jsx        # 渲染入口
  index.css       # 全域樣式與 Tailwind 設定
```

## 優化重點

- React.lazy + Suspense 延遲載入下方區塊
- React.memo 減少不必要重繪
- 移除 framer-motion，改用純 CSS 動畫，降低打包體積
- Vite manual chunks 拆分 vendor / icons
- 無障礙：skip link、aria-label、table scope、focus-visible
- 修正淺色背景上的文字對比（sunshine / mint 使用 ink 文字）
