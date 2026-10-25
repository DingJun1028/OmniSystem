export const governanceMatrix = [
  { layer: 0, Traceable: '用戶輸入源', Trackable: '需求生命週期', Tangible: '需求規格 & KPI', Transparent: '需求相關性', Trustworthy: '需求驗證' },
  { layer: 1, Traceable: '事件來源', Trackable: '事件流 & 會話', Tangible: '結構化事件', Transparent: '事件數據', Trustworthy: '事件驗證' },
  { layer: 2, Traceable: '記憶來源', Trackable: '記憶生命週期', Tangible: '記憶物件', Transparent: '決策因果', Trustworthy: '記憶驗證' },
  { layer: 3, Traceable: '推理輸入', Trackable: '推理軌跡', Tangible: '策略物件', Transparent: '推理背書', Trustworthy: '推理複核' },
  { layer: 4, Traceable: '閘門通過記錄', Trackable: '閘門通過狀態', Tangible: '閘門結果（Pass/Fail/Warn）', Transparent: '檢查規則與結果', Trustworthy: '權限與合規' },
  { layer: 5, Traceable: '任務依據', Trackable: '任務狀態', Tangible: '任務執行與成果', Transparent: '工作流依賴', Trustworthy: '任務可靠性' },
  { layer: 6, Traceable: '執行日誌', Trackable: '執行日誌', Tangible: '執行成果（程式碼/評分）', Transparent: '執行指標', Trustworthy: '執行結果' },
  { layer: 7, Traceable: '外部調用日誌', Trackable: '調用日誌', Tangible: '儀表板 & 視覺化', Transparent: '外部 API 規格', Trustworthy: '調用驗證' },
  { layer: 8, Traceable: '串流事件', Trackable: '串流記錄', Tangible: '反饋 & 體驗指標', Transparent: '進度 & 風險', Trustworthy: '串流加密' },
  { layer: 9, Traceable: '反饋 & 指標', Trackable: '模型版本與指標', Tangible: '演化報告', Transparent: '演化原因與結果', Trustworthy: '演化結果驗證' },
]

export const securityGates = [
  { layer: 0, gate: 'Intent Gate', check: '需求完整性', standard: '所有字段完整，KPI 可量化' },
  { layer: 1, gate: 'Ingest Gate', check: '事件安全', standard: '來源可信，結構合法' },
  { layer: 2, gate: 'Memory Gate', check: '記憶權限', standard: '敏感資料已屏蔽' },
  { layer: 3, gate: 'Reasoning Gate', check: '推理回溯', standard: '風險低，合規' },
  { layer: 4, gate: 'Governance Gate', check: '權限、合規、隱私、邊界', standard: '通過 4 項檢查' },
  { layer: 5, gate: 'Orchestration Gate', check: '任務依賴、優先順序', standard: 'DAG 合理，資源充足' },
  { layer: 6, gate: 'Execution Gate', check: '執行結果', standard: '輸出有效，指標正常' },
  { layer: 7, gate: 'Integration Gate', check: '外部調用', standard: '認證通過，響應合法' },
  { layer: 8, gate: 'Experience Gate', check: '串流與儀表板', standard: '串流穩定，數據完整' },
  { layer: 9, gate: 'Evolution Gate', check: '模型更新', standard: '經過驗證，改進明確' },
]

export const securityStrategies = [
  { name: '權限最小化', desc: '每個層只擁有必要權限' },
  { name: '隱私保護', desc: '敏感資料處理在第 4 層進行' },
  { name: '邊界防護', desc: '防止路徑穿越、注入、越權' },
  { name: '雲端優雅回落', desc: '雲端異常時回到離線模式' },
  { name: '5T 全鏈路審計', desc: '每筆資料寫入即刻執行 Hash Lock + Object.freeze()' },
]
