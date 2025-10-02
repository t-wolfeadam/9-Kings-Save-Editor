import React from 'react'
import { id2king, WaveInfo, waveTypeInfo } from '../../../types/GameSaveData'
import styles from './CalendarStrip.module.scss'
import { im } from '@renderer/utils/image'

interface CalendarStripProps {
  waves: WaveInfo[]
  currentWaveIndex: number
  specialWaveIndex: number
  onWaveClick: (waveIndex: number) => void
}

const CalendarStrip: React.FC<CalendarStripProps> = ({
  waves,
  currentWaveIndex,
  specialWaveIndex,
  onWaveClick
}) => {
  const getWaveStatus = (index: number) => {
    if (index < currentWaveIndex) return 'completed'
    if (index === currentWaveIndex) return 'current'
    return 'upcoming'
  }

  const getKingFaceName = (king_id: number, index: number): string => {
    if (index === specialWaveIndex) return 'Special';
    return (id2king(king_id) || '').replaceAll(/<|>/g, "");
  };

  return (
    <div className={styles.calendarStrip}>
      <div className={styles.calendarItems}>
        {waves.map((wave, index) => (
          <div
            key={index}
            className={`${styles.calendarDay} ${styles[getWaveStatus(index)]} ${index === specialWaveIndex ? styles.rainbow : ''}`}
            onClick={() => onWaveClick(index)}
          >
            <img
              src={waveTypeInfo[wave.Type].imagePath}
              alt={`Wave ${index + 1}`}
              className={styles.calendarIcon}
            />
            <span className={styles.waveNumber}>{index + 1}</span>
            <img
              src={im(`./assets/KingFace_${getKingFaceName(wave.King, index)}.png`)}
              alt={`King of ${id2king(wave.King)}`}
              className={styles.kingFace}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarStrip