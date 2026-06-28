import { Header } from './components/Header'
import { AssetLibrary } from './components/AssetLibrary'
import { PortfolioTree } from './components/PortfolioTree'
import { ExposurePanel } from './components/ExposurePanel'

export default function App() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <AssetLibrary />
        <PortfolioTree />
        <ExposurePanel />
      </div>
    </div>
  )
}
