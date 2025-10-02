import React, { useState } from 'react'
import { PolicyData, KingClassificationType } from '../../../types/GameSaveData'
import styles from './DecreeList.module.scss'
import rawDecreeInfo from "../../../decree_info.json";
import { im } from '@renderer/utils/image';

interface DecreeListProps {
  decrees: PolicyData[]
  onChange: (decrees: PolicyData[]) => void
  onAddDecree: () => void
}

// Map decree names to their corresponding asset paths and tooltips
type DecreeInfo = Record<
  string,
  { icon: string; tooltip: string; type: KingClassificationType }
>;

const DECREE_INFO = rawDecreeInfo as DecreeInfo;

const DecreeList: React.FC<DecreeListProps> = ({ decrees, }) => { //onChange, onAddDecree }) => {
  const [hoveredDecree, setHoveredDecree] = useState<string | null>(null)

  // const handleStackChange = (decreeName: string, delta: number) => {
  //   const newDecrees = decrees.map(decree => {
  //     if (decree.Name === decreeName) {
  //       const newStacks = Math.max(0, decree.Stacks + delta)
  //       return { ...decree, Stacks: newStacks }
  //     }
  //     return decree
  //   }).filter(decree => decree.Stacks > 0) // Remove decrees with 0 stacks

  //   onChange(newDecrees)
  // }

  const getDecreeIcon = (decreeName: string): string => {
    return im(DECREE_INFO[decreeName]?.icon || './assets/Decree_Blood_00.png')
  }

  const getDecreeTooltip = (decreeName: string): string => {
    return DECREE_INFO[decreeName]?.tooltip || 'Unknown decree'
  }

  const getDecreeType = (decreeName: string): KingClassificationType => {
    return DECREE_INFO[decreeName]?.type || 'Blood'
  }

  return (
    <div className={styles.decreesList}>
      {decrees.map((decree, index) => (
        <div 
          key={`${decree.Name}-${index}`}
          className={`${styles.decree} ${styles[`decree--${getDecreeType(decree.Name).toLowerCase()}`]}`}
          onMouseEnter={() => setHoveredDecree(decree.Name)}
          onMouseLeave={() => setHoveredDecree(null)}
        >
          <img 
            src={getDecreeIcon(decree.Name)} 
            alt={decree.Name}
            className={styles.decreeIcon}
          />
          
          <div className={styles.decreeInfo}>
            <span className={styles.decreeName}>
              {decree.Name.replace('Decree_', '').replace('_', ' ')}
            </span>
            <span className={styles.decreeStacks}>
              x{decree.Stacks}
            </span>
          </div>

          {/* TODO implement updating policy vars based on decrees before uncommenting this
          <div className={styles.decreeControls}>
            <button 
              className={`${styles.controlButton} ${styles.controlButtonMinus}`}
              onClick={() => handleStackChange(decree.Name, -1)}
              title="Decrease stacks"
              disabled={decree.Stacks <= 0}
            >
              −
            </button>
            <button 
              className={`${styles.controlButton} ${styles.controlButtonPlus}`}
              onClick={() => handleStackChange(decree.Name, 1)}
              title="Increase stacks"
            >
              +
            </button>
          </div> */}

          {hoveredDecree === decree.Name && (
            <div className={styles.tooltip}>
              {getDecreeTooltip(decree.Name)}
            </div>
          )}
        </div>
      ))}

      {/* TODO implement updating policy vars based on decrees before uncommenting this
      <button 
        className={styles.addDecreeButton}
        onClick={onAddDecree}
        title="Add new decree"
      >
        <span className={styles.plusIcon}>+</span>
        <span className={styles.addDecreeText}>Add Decree</span>
      </button> */}
    </div>
  )
}

export default DecreeList