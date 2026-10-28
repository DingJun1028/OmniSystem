import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Cpu, Shield, History } from 'lucide-react'
import { ssasMeta } from '../data/ssasData'
import Header from './Header'
import Hero from './Hero'
import LayerSearch from './LayerSearch'
import LayerDiagram from './LayerDiagram'
import LayerDetail from './LayerDetail'
import LoadingSection from './LoadingSection'
import { Suspense, lazy } from 'react'

const GovernanceMatrix = lazy(() => import('./GovernanceMatrix'))
const CustomerJourney = lazy(() => import('./CustomerJourney'))
const Roadmap = lazy(() => import('./Roadmap'))
const SecurityOverview = lazy(() => import('./SecurityOverview'))
const Footer = lazy(() => import('./Footer'))

function LandingPage() {
  const [selectedLayer, setSelectedLayer] = useState(0)

  return (
    <div className="min-h-screen bg-cream dark:bg-ink transition-colors">
      <a
        href="#layers"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:bg-coral focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:font-bold"
      >
        跳至主要內容
      </a>
      <Header />
      <Hero />

      <section className="section py-10 md:py-16 bg-white dark:bg-ink/40">
        <div className="max-w-site mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink dark:text-cream mb-4">不只是介紹，現在就能運作</h2>
          <p className="text-muted dark:text-cream/70 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            SSAS 工作台讓你輸入真實意圖，系統會依序跑過 10 層流程、通過治理閘門、產出執行計畫與儀表板。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/workspace" className="btn-primary">
              <Cpu size={20} aria-hidden="true" />
              進入工作台
            </Link>
            <Link
              to="/settings"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full font-bold border-2 border-coral text-coral hover:bg-red-100 dark:hover:bg-coral/20 transition-colors"
            >
              <Shield size={20} aria-hidden="true" />
              設定與資料
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-muted dark:text-cream/70">
            <span className="flex items-center gap-1"><History size={14} aria-hidden="true" /> 本地儲存執行紀錄</span>
            <span className="flex items-center gap-1"><Shield size={14} aria-hidden="true" /> 5T 治理閘門</span>
            <span className="flex items-center gap-1"><Sparkles size={14} aria-hidden="true" /> 可選 AI 擴充</span>
          </div>
        </div>
      </section>

      <section id="layers" className="section pt-8">
        <LayerSearch onSelect={setSelectedLayer} />
        <LayerDiagram selected={selectedLayer} onSelect={setSelectedLayer} />
      </section>
      <LayerDetail selected={selectedLayer} />
      <Suspense fallback={<LoadingSection />}>
        <GovernanceMatrix />
        <CustomerJourney />
        <Roadmap />
        <SecurityOverview />
        <Footer />
      </Suspense>
    </div>
  )
}

export default memo(LandingPage)
