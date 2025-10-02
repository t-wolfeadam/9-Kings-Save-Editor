import React, { useState } from 'react'
import { useGameDataContext } from '../../../contexts/GameDataContext'
import WaveDetails from './WaveDetails'
import PolicyVariables from './PolicyVariables'
import styles from './RightPanel.module.scss'

const RightPanel: React.FC = () => {
  const { state } = useGameDataContext()
  const [activeTab, setActiveTab] = useState<'area' | 'policy' | 'decrees' | 'progress' | 'plots'>('area')

  const tabs = [
    { id: 'policy' as const, label: 'Policy Vars', component: PolicyVariables },
    { id: 'area' as const, label: 'Details', component: WaveDetails }
  ]

  return (
    <div className={styles.rightPanel}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        <div className="panel__section">
          
          <div className={styles.componentContainer}>
            {(() => {
              const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component
              return ActiveComponent ? <ActiveComponent /> : null
            })()}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {state.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <span className={styles.loadingText}>Loading game data...</span>
        </div>
      )}
      
      {/* Data status indicator */}
      {state.hasChanges && (
        <div className={styles.changeIndicator}>
          <span className={styles.changeText}>Unsaved changes</span>
        </div>
      )}
    </div>
  )
}

export default RightPanel