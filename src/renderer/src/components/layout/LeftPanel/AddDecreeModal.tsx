import React from 'react'
import Modal from '../../common/Modal/Modal'
import { KingClassificationType } from '../../../types/GameSaveData'
import styles from './AddDecreeModal.module.scss'
import rawDecreeInfo from "../../../decree_info.json";

interface AddDecreeModalProps {
  isOpen: boolean
  onClose: () => void
  onAddDecree: (decreeName: string) => void
}

const AVAILABLE_DECREES = Object.entries(rawDecreeInfo).map(([key, value]) => ({
  name: key,
  displayName: key,
  type: value.type as KingClassificationType,
  icon: value.icon,
  description: value.tooltip,
}));

const AddDecreeModal: React.FC<AddDecreeModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddDecree 
}) => {
  const handleDecreeSelect = (decreeName: string) => {
    onAddDecree(decreeName)
    onClose()
  }

  const getDecreeTypeColor = (type: KingClassificationType): string => {
    switch (type) {
      case 'Blood': return styles.typeBlood
      case 'Greed': return styles.typeGreed
      case 'Nature': return styles.typeNature
      case 'Nomads': return styles.typeNomads
      case 'Nothing': return styles.typeNothing
      case 'Progress': return styles.typeProgress
      case 'Spells': return styles.typeSpells
      case 'Stone': return styles.typeStone
      case 'Special': return styles.typeSpecial
      case 'Common': return styles.typeCommon
      default: return ''
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Select Decree to Add"
      size="medium"
    >
      <div className={styles.decreesGrid}>
        {AVAILABLE_DECREES.map((decree) => (
          <div
            key={decree.name}
            className={`${styles.decreeOption} ${getDecreeTypeColor(decree.type)}`}
            onClick={() => handleDecreeSelect(decree.name)}
          >
            <div className={styles.decreeHeader}>
              <img 
                src={decree.icon} 
                alt={decree.displayName}
                className={styles.decreeIcon}
              />
              <div className={styles.decreeTitle}>
                <h3 className={styles.decreeName}>{decree.displayName}</h3>
                <span className={`${styles.decreeType} ${getDecreeTypeColor(decree.type)}`}>
                  {decree.type}
                </span>
              </div>
            </div>
            
            <p className={styles.decreeDescription}>
              {decree.description}
            </p>
            
            {/* TODO implement updating policy vars based on decrees before uncommenting this
            <div className={styles.addButton}>
              <span>Add Decree</span>
            </div> */} 
          </div>
        ))}
      </div>
      
      <div className={styles.modalFooter}>
        <p className={styles.footerNote}>
          Click on any decree to add it to your active decrees list.
        </p>
      </div>
    </Modal>
  )
}

export default AddDecreeModal