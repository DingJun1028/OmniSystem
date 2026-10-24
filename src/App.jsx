import { useState } from 'react'
import Hero from './components/Hero'
import LayerDiagram from './components/LayerDiagram'
import LayerDetail from './components/LayerDetail'
import GovernanceMatrix from './components/GovernanceMatrix'
import CustomerJourney from './components/CustomerJourney'
import Roadmap from './components/Roadmap'
import SecurityOverview from './components/SecurityOverview'
import Footer from './components/Footer'

function App() {
  const [selectedLayer, setSelectedLayer] = useState(0)

  return (
    <main className="min-h-screen bg-cream">
      <Hero />
      <LayerDiagram selected={selectedLayer} onSelect={setSelectedLayer} />
      <LayerDetail selected={selectedLayer} />
      <GovernanceMatrix />
      <CustomerJourney />
      <Roadmap />
      <SecurityOverview />
      <Footer />
    </main>
  )
}

export default App
