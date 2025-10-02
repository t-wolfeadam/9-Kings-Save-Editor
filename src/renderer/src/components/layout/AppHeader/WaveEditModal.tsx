import React, { useState } from 'react'
import Modal from '../../../components/common/Modal/Modal'
import BlessingModal from './BlessingModal'
import { WaveInfo, waveTypeInfo, PlayableKingType, kingTypes, king2id } from '../../../types/GameSaveData'
import styles from './WaveEditModal.module.scss'
import { im } from '@renderer/utils/image'

interface WaveEditModalProps {
  isOpen: boolean
  onClose: () => void
  wave: WaveInfo | null
  waveIndex: number
  currentWaveIndex: number
  specialWaveIndex: number
  onWaveUpdate: (waveIndex: number, newWave: WaveInfo) => void
  onWaveIndexChange: (newIndex: number) => void
  onSpecialWaveIndexChange: (newIndex: number) => void
}

const WaveEditModal: React.FC<WaveEditModalProps> = ({
  isOpen,
  onClose,
  wave,
  waveIndex,
  currentWaveIndex,
  specialWaveIndex,
  onWaveUpdate,
  onWaveIndexChange,
  onSpecialWaveIndexChange
}) => {
  const [showBlessingModal, setShowBlessingModal] = useState(false)
  const [selectedType, setSelectedType] = useState<number | null>(null)

  if (!wave) return null

  const calendarTypes = [0, 1, 2, 3, 4, 5, 6, 7]

  // Allow selection on either prophecy event type (they both impact the same)
  const isBlessingType = (type: number) => type === 4 || type === 6

  const handleTypeSelect = (type: number) => {
    if (isBlessingType(type)) {
      setSelectedType(type)
      setShowBlessingModal(true)
    } else {
      // For non-blessing types, update immediately
      onWaveUpdate(waveIndex, { ...wave, Type: type })
      onClose()
    }
  }

  const handleBlessingSelect = () => {
    onWaveUpdate(waveIndex, { ...wave, Type: selectedType! })
    setShowBlessingModal(false)
    onClose()
  }

  const handleKingSelect = (king: PlayableKingType | null) => {
    onWaveUpdate(waveIndex, { ...wave, King: king2id(king) })
    onClose()
  }

  const handleSetCurrentWave = () => {
    onWaveIndexChange(waveIndex)
    onClose()
  }

  const handleSetSpecialWave = () => {
    onSpecialWaveIndexChange(waveIndex)
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen && !showBlessingModal}
        onClose={onClose}
        title={`Edit Wave ${waveIndex + 1}`}
        size="large"
      >
        <div className={styles.waveEditor}>
          <div className={styles.section}>
           <div className={styles.actionButtons}>
             <button
               className={`${styles.setCurrentButton} ${
                 currentWaveIndex === waveIndex ? styles.current : ''
               }`}
               onClick={handleSetCurrentWave}
               disabled={currentWaveIndex === waveIndex}
             >
               {currentWaveIndex === waveIndex ? 'Current Wave' : 'Set as Current Wave'}
             </button>

             <button
               className={`${styles.setCurrentButton} ${
                 specialWaveIndex === waveIndex ? styles.current : ''
               }`}
               onClick={handleSetSpecialWave}
               disabled={specialWaveIndex === waveIndex}
             >
               {specialWaveIndex === waveIndex ? 'Rainbow Wave' : 'Set as Rainbow Wave'}
             </button>
           </div>
         </div>
         
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Wave Type</h3>
            <div className={styles.calendarGrid}>
              {calendarTypes.map((type) => (
                <div
                  key={type}
                  className={`${styles.calendarOption} ${
                    wave.Type === type ? styles.selected : ''
                  }`}
                  onClick={() => handleTypeSelect(type)}
                >
                  <img
                    src={waveTypeInfo[type].imagePath}
                    alt={`Calendar ${type}`}
                    className={styles.calendarImage}
                  />
                  <span className={styles.typeLabel}>
                    {waveTypeInfo[type].name}
                  </span>
                  {isBlessingType(type) && (
                    <div className={styles.specialBadge}>Special</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>King Type</h3>
            <div className={styles.kingGrid}>
              {kingTypes.map((king) => (
                <div
                  key={king}
                  className={`${styles.kingOption} ${
                    wave.King === king2id(king) ? styles.selected : ''
                  }`}
                  onClick={() => handleKingSelect(king)}
                >
                  <img
                    src={im(`./assets/KingFace_${king}.png`)}
                    alt={`${king} King`}
                    className={styles.kingImage}
                  />
                  <span className={styles.kingLabel}>{king}</span>
                </div>
              ))}
              <div
                  key='random'
                  className={`${styles.kingOption} ${
                    wave.King === king2id(null) ? styles.selected : ''
                  }`}
                  style={{ gridColumn: 'span 3' }}
                  onClick={() => handleKingSelect(null)}
                >
                  <img
                    src={im(`./assets/KingFace_Random.png`)}
                    alt={`<random> King`}
                    className={styles.kingImage}
                  />
                  <span className={styles.kingLabel}>Random</span>
                </div>
           </div>
         </div>
       </div>
      </Modal>

      <BlessingModal
        isOpen={showBlessingModal}
        onClose={() => setShowBlessingModal(false)}
        onBlessingSelect={handleBlessingSelect}
      />
    </>
  )
}

export default WaveEditModal
