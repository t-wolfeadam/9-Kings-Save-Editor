import React, { useState } from 'react'
import { PlayableKingType, PolicyData } from '../../../types/GameSaveData'
import { useGameDataContext } from '../../../contexts/GameDataContext'
import CurrencyDisplay from './CurrencyDisplay'
import DecreeList from './DecreeList'
import KingSelector from './KingSelector'
import AddDecreeModal from './AddDecreeModal'
import styles from './LeftPanel.module.scss'

const LeftPanel: React.FC = () => {
  const { state, updateWaveData, addPolicy, updatePolicy, removePolicy, updateKings } = useGameDataContext()
  const [isAddDecreeModalOpen, setIsAddDecreeModalOpen] = useState(false)
  
  const gameData = state.gameData

  // Currency handlers
  const handleCurrencyChange = (newCurrency: number) => {
    updateWaveData({ Currency: newCurrency })
  }

  // Decree handlers
  const handleDecreesChange = (newDecrees: PolicyData[]) => {
    // Replace all policies with the new decree list
    // First, remove all existing policies
    const currentPolicies = gameData?.Policies?.Policies || []
    for (let i = currentPolicies.length - 1; i >= 0; i--) {
      removePolicy(i)
    }
    
    // Then add all new policies
    newDecrees.forEach(decree => {
      addPolicy(decree)
    })
  }

  const handleAddDecree = (decreeName: string) => {
    const existingDecreeIndex = gameData?.Policies?.Policies.findIndex(d => d.Name === decreeName)
    
    if (existingDecreeIndex !== undefined && existingDecreeIndex >= 0) {
      // Increase stacks if decree already exists
      const existingDecree = gameData!.Policies!.Policies[existingDecreeIndex]
      updatePolicy(existingDecreeIndex, {
        ...existingDecree,
        Stacks: existingDecree.Stacks + 1
      })
    } else {
      // Add new decree with 1 stack
      addPolicy({ Name: decreeName, Stacks: 1 })
    }
  }

  const handleShowAddDecreeModal = () => {
    setIsAddDecreeModalOpen(true)
  }

  const handleCloseAddDecreeModal = () => {
    setIsAddDecreeModalOpen(false)
  }

  // King selection handlers
  const handleSelectedKingChange = (newKing: PlayableKingType) => {
    updateKings({ PlayerKing: newKing })
  }

  const handleActiveKingsChange = (activeKings: PlayableKingType[]) => {
    updateKings({ EnemyKings: activeKings })
  }

  return (
    <div className={styles.leftPanel}>
      {/* Currency Section */}
      <div className="panel__section">
        <h3 className="panel__title">Currency</h3>
        <CurrencyDisplay
          currency={gameData?.WaveData?.Currency || 0}
          onChange={handleCurrencyChange}
        />
      </div>

      {/* King Selection Section */}
      <div className="panel__section">
        <h3 className="panel__title">King Selection</h3>
        <KingSelector
          selectedKing={gameData?.Kings?.PlayerKing || 'Blood'}
          activeKings={gameData?.Kings?.EnemyKings || []}
          onSelectedKingChange={handleSelectedKingChange}
          onActiveKingsChange={handleActiveKingsChange}
        />
      </div>

      {/* Active Decrees Section */}
      <div className="panel__section">
        <h3 className="panel__title">Active Decrees</h3>
        <DecreeList
          decrees={gameData?.Policies?.Policies || []}
          onChange={handleDecreesChange}
          onAddDecree={handleShowAddDecreeModal}
        />
      </div>

      {/* Add Decree Modal */}
      <AddDecreeModal
        isOpen={isAddDecreeModalOpen}
        onClose={handleCloseAddDecreeModal}
        onAddDecree={handleAddDecree}
      />
    </div>
  )
}

export default LeftPanel