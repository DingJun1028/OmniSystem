import { memo, useState, useRef } from 'react'
import { Settings, Save, Upload, Download, Trash2, Key, Bot, Database } from 'lucide-react'
import { useSSAS } from '../contexts/SSASContext'

function SettingsPage() {
  const { settings, updateSettings, sessions, memory, exportData, importData, deleteSession, deleteMemory } = useSSAS()
  const [saved, setSaved] = useState(false)
  const fileRef = useRef(null)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        importData(ev.target.result)
        alert('匯入成功')
      } catch {
        alert('匯入失敗，請確認檔案格式')
      }
    }
    reader.readAsText(file)
  }

  const clearAll = () => {
    if (!confirm('確定要清除所有執行紀錄與記憶嗎？此動作無法復原。')) return
    sessions.forEach((s) => deleteSession(s.id))
    memory.forEach((m) => deleteMemory(m.memory_id))
  }

  return (
    <section className="section pt-8 pb-10">
      <div className="card border-2 border-coral/10 dark:border-coral/20">
        <h2 className="text-2xl sm:text-3xl text-ink dark:text-cream mb-6 flex items-center gap-2">
          <Settings size={28} className="text-coral" aria-hidden="true" />
          設定與資料管理
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg sm:text-xl text-ink dark:text-cream mb-4 flex items-center gap-2">
              <Bot size={20} className="text-coral" aria-hidden="true" />
              AI 推理引擎（選用）
            </h3>
            <p className="text-sm text-muted dark:text-cream/70 mb-4">
              目前使用本地規則引擎模擬推理。啟用後可串接外部 AI API，但需自行提供 API key。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-cream dark:bg-ink/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiEnabled}
                  onChange={(e) => updateSettings({ aiEnabled: e.target.checked })}
                  className="w-5 h-5 accent-coral"
                />
                <span className="font-bold text-ink dark:text-cream">啟用外部 AI</span>
              </label>
              <div className="p-4 rounded-2xl bg-cream dark:bg-ink/40">
                <label className="block text-xs font-bold text-muted dark:text-cream/70 mb-1">模型</label>
                <select
                  value={settings.aiModel}
                  onChange={(e) => updateSettings({ aiModel: e.target.value })}
                  disabled={!settings.aiEnabled}
                  className="w-full h-10 px-3 rounded-xl border-2 border-coral/30 bg-white dark:bg-ink text-ink dark:text-cream disabled:opacity-50"
                >
                  <option value="qwen-3-32b">Groq Qwen 3 32B</option>
                  <option value="llama-3.1-70b">Groq Llama 3.1 70B</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-cream dark:bg-ink/40">
              <label className="block text-xs font-bold text-muted dark:text-cream/70 mb-1 flex items-center gap-1">
                <Key size={14} aria-hidden="true" />
                API Key
              </label>
              <input
                type="password"
                value={settings.aiKey}
                onChange={(e) => updateSettings({ aiKey: e.target.value })}
                disabled={!settings.aiEnabled}
                placeholder="sk-..."
                className="w-full h-10 px-3 rounded-xl border-2 border-coral/30 bg-white dark:bg-ink text-ink dark:text-cream disabled:opacity-50"
              />
              <p className="text-xs text-muted dark:text-cream/60 mt-2">Key 只會儲存在瀏覽器 localStorage，不會上傳到伺服器。</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl text-ink dark:text-cream mb-4 flex items-center gap-2">
              <Database size={20} className="text-coral" aria-hidden="true" />
              資料管理
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([exportData()], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `ssas-backup-${Date.now()}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-cream dark:bg-ink/40 text-ink dark:text-cream font-bold hover:bg-red-100 dark:hover:bg-coral/20 transition-colors"
              >
                <Download size={18} aria-hidden="true" />
                匯出全部資料
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-cream dark:bg-ink/40 text-ink dark:text-cream font-bold hover:bg-red-100 dark:hover:bg-coral/20 transition-colors"
              >
                <Upload size={18} aria-hidden="true" />
                匯入資料
              </button>
              <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-coral text-white font-bold hover:bg-coral-dark transition-colors"
              >
                <Trash2 size={18} aria-hidden="true" />
                清除全部
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl p-3 bg-cream dark:bg-ink/40">
                <span className="text-muted dark:text-cream/70">執行紀錄</span>
                <div className="text-xl font-bold text-ink dark:text-cream">{sessions.length}</div>
              </div>
              <div className="rounded-2xl p-3 bg-cream dark:bg-ink/40">
                <span className="text-muted dark:text-cream/70">記憶條目</span>
                <div className="text-xl font-bold text-ink dark:text-cream">{memory.length}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-white font-bold hover:bg-coral-dark transition-colors"
            >
              <Save size={18} aria-hidden="true" />
              {saved ? '已儲存' : '儲存設定'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(SettingsPage)
