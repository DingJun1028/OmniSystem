import { Github, BookOpen, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-ink text-cream py-12">
      <div className="max-w-site mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-3">SSAS 萬能系統框架</h3>
            <p className="text-cream/70 leading-relaxed">
              以「用戶需求」為萬能心核，同心圓向外擴散；每一層都服務下一層，形成完整客戶旅程。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <BookOpen size={18} />
              參考與延伸
            </h4>
            <ul className="space-y-2 text-cream/70 text-sm">
              <li>soul.md — 萬能蜂群靈魂核心聖典</li>
              <li>JUNAIKEY.md — 萬能元鑰 / 萬能永憶</li>
              <li>packages/oa-framework — OA 框架</li>
              <li>packages/oa-meta-framework — OA 元框架</li>
              <li>esggo/README.md — 專案 README</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-cream/60">
          <span>版本 v1.0.0 · 2026-10-16 · 基於 junaikey 萬能元鑰 + 5T 協定</span>
          <span className="flex items-center gap-1">
            Made with <Heart size={14} className="text-coral" /> for SSAS
          </span>
        </div>
      </div>
    </footer>
  )
}
