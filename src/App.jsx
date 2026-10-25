import { Suspense, lazy, useState } from 'react'
import Hero from './components/Hero'
import Header from './components/Header'
import LayerSearch from './components/LayerSearch'
import LayerDiagram from './components/LayerDiagram'
import LayerDetail from './components/LayerDetail'
import LoadingSection from './components/LoadingSection'

const GovernanceMatrix = lazy(() => import('./components/GovernanceMatrix'))
const CustomerJourney = lazy(() => import('./components/CustomerJourney'))
const Roadmap = lazy(() => import('./components/Roadmap'))
const SecurityOverview = lazy(() => import('./components/SecurityOverview'))
const Footer = lazy(() => import('./components/Footer'))

function App() {
  const [selectedLayer, setSelectedLayer] = useState(0)

  return (
    <main className="min-h-screen bg-cream" id="top">
      <a
        href="#layers"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-coral focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:font-bold"
      >
        跳至主要內容
      </a>
      <Header />
      <Hero />
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
    </main>
  )
}

export default App
