import React, { useState } from 'react'
import { PlayableKingType } from '../../../types/GameSaveData'
import styles from './KingSelector.module.scss'
import { im } from '@renderer/utils/image'

interface KingSelectorProps {
  selectedKing: PlayableKingType
  activeKings: PlayableKingType[]
  onSelectedKingChange: (king: PlayableKingType) => void
  onActiveKingsChange: (activeKings: PlayableKingType[]) => void
}

const KING_INFO: Record<PlayableKingType, { icon: string; displayName: string }> = {
  'Blood': {
    icon: im('./assets/KingFace_Blood.png'),
    displayName: 'Blood'
  },
  'Greed': {
    icon: im('./assets/KingFace_Greed.png'),
    displayName: 'Greed'
  },
  'Nature': {
    icon: im('./assets/KingFace_Nature.png'),
    displayName: 'Nature'
  },
  'Nomads': {
    icon: im('./assets/KingFace_Nomads.png'),
    displayName: 'Nomads'
  },
  'Nothing': {
    icon: im('./assets/KingFace_Nothing.png'),
    displayName: 'Nothing'
  },
  'Progress': {
    icon: im('./assets/KingFace_Progress.png'),
    displayName: 'Progress'
  },
  'Spells': {
    icon: im('./assets/KingFace_Spells.png'),
    displayName: 'Spells'
  },
  'Stone': {
    icon: im('./assets/KingFace_Stone.png'),
    displayName: 'Stone'
  },
  'Time': {
    icon: im('./assets/KingFace_Time.png'),
    displayName: 'Time'
  }

}

const ALL_KINGS: PlayableKingType[] = ['Blood', 'Greed', 'Nature', 'Nomads', 'Nothing', 'Progress', 'Spells', 'Stone']

const KingSelector: React.FC<KingSelectorProps> = ({ 
  selectedKing, 
  activeKings, 
  onSelectedKingChange, 
  onActiveKingsChange 
}) => {
  const [clickTimeout, setClickTimeout] = useState<number | null>(null)

  const isKingActive = (king: PlayableKingType): boolean => {
    return activeKings.includes(king)
  }

  const handleKingClick = (king: PlayableKingType) => {
    // Clear any existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
      // This is a double-click
      handleDoubleClick(king)
      return
    }

    // Set timeout for single click
    const timeout = setTimeout(() => {
      handleSingleClick(king)
      setClickTimeout(null)
    }, 300)

    setClickTimeout(timeout as unknown as number)
  }

  const handleSingleClick = (king: PlayableKingType) => {
    if (king === selectedKing) {
      // Can't deactivate the selected king
      return
    }

    // Toggle active state for non-selected kings
    const newActiveKings = isKingActive(king)
      ? activeKings.filter(k => k !== king)
      : [...activeKings, king]
    
    onActiveKingsChange(newActiveKings)
  }

  const handleDoubleClick = (king: PlayableKingType) => {
    // Change selected king
    onSelectedKingChange(king)
    
    // Ensure the new selected king is active
    if (!isKingActive(king)) {
      onActiveKingsChange([...activeKings, king])
    }
  }

  const getKingClassName = (king: PlayableKingType): string => {
    const classes = [styles.kingFace]
    
    if (king === selectedKing) {
      classes.push(styles.selected)
      classes.push(styles[`selected--${king.toLowerCase()}`])
    }
    
    if (!isKingActive(king)) {
      classes.push(styles.inactive)
    }
    
    return classes.join(' ')
  }

  return (
    <div className={styles.kingSelector}>
      {ALL_KINGS.map(king => (
        <div
          key={king}
          className={getKingClassName(king)}
          onClick={() => handleKingClick(king)}
          title={`${KING_INFO[king].displayName} King${king === selectedKing ? ' (Selected)' : ''}${!isKingActive(king) ? ' (Inactive)' : ''}`}
        >
          <img 
            src={KING_INFO[king].icon} 
            alt={`${KING_INFO[king].displayName} King`}
            className={styles.kingIcon}
          />
          <span className={styles.kingName}>
            {KING_INFO[king].displayName}
          </span>
          
          {king === selectedKing && (
            <div className={styles.selectionIndicator} />
          )}
        </div>
      ))}
      
      <div className={styles.instructions}>
        <p className={styles.instructionText}>
          Double-click to select • Single-click to toggle active
        </p>
      </div>
    </div>
  )
}

export default KingSelector