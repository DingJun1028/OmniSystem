export const ssasMeta = {
  title: 'SSAS 系統框架 — 萬能系統',
  subtitle: 'System of Systems Architecture (SSAS)',
  version: 'v1.0.0',
  date: '2026-10-16',
  foundation: 'junaikey 萬能元鑰 + 5T 協定',
  philosophy:
    '「需求是唯一的北極星，系統向外擴展；每一層都為下一層選擇更好的輸入；整體形成客戶旅程的最佳實踐體驗。」',
  principles: [
    { name: '同心圓中心化', desc: '第 0 層（需求）為一切的校準北極星，向外擴展時不失去核心對齊' },
    { name: '單向依賴', desc: '每一層只依賴下一層，形成清晰的下行依賴鏈，易於測試與驗證' },
    { name: '5T 貫穿', desc: 'Traceable / Trackable / Tangible / Transparent / Trustworthy 於每一層' },
    { name: '可演化', desc: '第 9 層回饋數據至第 0 層，形成閉環，實現自主迭代' },
    { name: '離線優先', desc: '前層（0–5）採用本地/離線處理，後層（7–9）可選擇性調用雲端，前提是「優雅回落」' },
    { name: '可回退', desc: '雲端整合失敗時回退到免費路徑，不中斷流程' },
    { name: '客戶旅程中心', desc: '所有設計都服務客戶旅程的最佳實踐體驗' },
  ],
  fiveT: [
    { key: 'Traceable', label: '可追溯', color: 'bg-coral', text: 'text-coral', textOnColor: 'text-white', tint: 'bg-red-100', darkTint: 'dark:bg-red-900/30' },
    { key: 'Trackable', label: '可追踪', color: 'bg-sunshine', text: 'text-amber-600', textOnColor: 'text-ink', tint: 'bg-amber-100', darkTint: 'dark:bg-amber-900/30' },
    { key: 'Tangible', label: '可具象', color: 'bg-mint', text: 'text-emerald-600', textOnColor: 'text-ink', tint: 'bg-emerald-100', darkTint: 'dark:bg-emerald-900/30' },
    { key: 'Transparent', label: '透明', color: 'bg-sky', text: 'text-sky-700', textOnColor: 'text-white', tint: 'bg-sky-100', darkTint: 'dark:bg-sky-900/30' },
    { key: 'Trustworthy', label: '可信', color: 'bg-lilac', text: 'text-purple-600', textOnColor: 'text-white', tint: 'bg-purple-100', darkTint: 'dark:bg-purple-900/30' },
  ],
}
