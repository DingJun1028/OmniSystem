export const roadmap = {
  priorities: [
    { priority: 'P0', item: '核心層 0–3 建置', desc: '需求、感知、記憶、推理', resources: '如無：本地測試', owner: '所有組別' },
    { priority: 'P0', item: '核心層 4–6 建置', desc: '治理閘門、編排、執行', resources: '無', owner: '07, 11, 30' },
    { priority: 'P1', item: '外部連結（第 7 層）', desc: 'GitHub、Cloudflare、SaaS', resources: '至少 1 個', owner: '23, 22' },
    { priority: 'P1', item: '體驗門戶（第 8 層）', desc: 'SSE、儀表板', resources: '如無：本地', owner: '12, 08' },
    { priority: 'P2', item: '演化環（第 9 層）', desc: '模型優化、進化循環', resources: '如無：本地', owner: '10, 19' },
  ],
  phases: [
    { week: '週 1', goal: '核心層 0–3 快速原型', kpi: '意圖提取、事件收集、記憶存證、推理策略生成可用' },
    { week: '週 2', goal: '核心層 4–6 驗證', kpi: '5T 通過率 100%，任務流工作流運行' },
    { week: '週 3', goal: '外部連結（7 層）整合', kpi: 'GitHub、Cloudflare 連線成功，事件流測通' },
    { week: '週 4', goal: '體驗門戶（8 層）上線', kpi: 'SSE 串流穩定，儀表板呈現' },
    { week: '週 5', goal: '演化環（9 層）上線', kpi: '反饋收集、指標追踪、模型優化' },
  ],
  componentMapping: [
    { component: '意圖核心', team: '策略組 (01–06)', path: 'packages/strategy/' },
    { component: '感知雷達', team: '技術組 (07–12)', path: 'packages/tech/' },
    { component: '記憶樞紐', team: '技術組 (07–12)', path: 'packages/tech/' },
    { component: '推理大腦', team: '技術組 (07–12)', path: 'packages/tech/' },
    { component: '治理閘門', team: '守衛組 (25–30)', path: 'packages/guard/' },
    { component: '編排中樞', team: '營銷組 (19–24)', path: 'packages/marketing/' },
    { component: '執行工坊', team: '技術組 (07–12)', path: 'packages/tech/' },
    { component: '外部整合', team: '營銷組 (19–24)', path: 'packages/marketing/' },
    { component: '體驗門戶', team: '創意組 (13–18)', path: 'packages/creative/' },
    { component: '演化生長環', team: '營銷組 (19–24)', path: 'packages/marketing/' },
  ],
}
