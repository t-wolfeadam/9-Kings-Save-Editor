import React from 'react'
import { CardProvider } from './contexts/CardContext'
import { GameDataProvider } from './contexts/GameDataContext'
import AppHeader from './components/layout/AppHeader/AppHeader'
import LeftPanel from './components/layout/LeftPanel/LeftPanel'
import RightPanel from './components/layout/RightPanel/RightPanel'
import BottomPanel from './components/layout/BottomPanel/BottomPanel'
import CentralGrid from './components/layout/CentralGrid/CentralGrid'

// Inner component that has access to both contexts
const AppContent: React.FC = () => {
  return (
    <div className="app">
      {/* Top Panel - Calendar strip and file controls */}
      <div className="app__header">
        <AppHeader />
      </div>

      {/* Left Panel - Currency, King selector, Decrees */}
      <div className="app__left-panel">
        <LeftPanel />
      </div>

      {/* Central Area - 5x5 Grid & construction tools */}
      <div className="app__central-area">
        <CentralGrid />
      </div>

      {/* Right Panel - Various info for stats and policy variables */}
      <div className="app__right-panel">
        <RightPanel />
      </div>

      {/* Bottom Panel - Hand cards */}
      <div className="app__bottom-panel">
        <BottomPanel />
      </div>
    </div>
  )
}

function App() {
  return (
    <GameDataProvider>
      <CardProvider>
        <AppContent />
      </CardProvider>
    </GameDataProvider>
  )
}

export default App