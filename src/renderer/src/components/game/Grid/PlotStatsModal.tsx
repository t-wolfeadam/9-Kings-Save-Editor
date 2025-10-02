import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal/Modal';
import { AreaStats } from '../../../types/GameSaveData';
import styles from './PlotStatsModal.module.scss';

interface PlotAreaData {
  cardLevel: number;
  maxCardLevel?: number;
  troopQuantity: number;
  entitySize: number;
  stats: AreaStats;
}

interface PlotStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlotAreaData) => void;
  plotCoords: { x: number; y: number } | null;
  cardName: string;
  currentCardLevel: number;
  currentMaxCardLevel?: number;
  currentTroopQuantity: number;
  currentEntitySize: number;
  currentStats: AreaStats;
}

const PlotStatsModal: React.FC<PlotStatsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  plotCoords,
  cardName,
  currentCardLevel,
  currentMaxCardLevel,
  currentTroopQuantity,
  currentEntitySize,
  currentStats
}) => {
  const [data, setData] = useState<PlotAreaData>({
    cardLevel: currentCardLevel,
    maxCardLevel: currentMaxCardLevel,
    troopQuantity: currentTroopQuantity,
    entitySize: currentEntitySize,
    stats: currentStats
  });

  // Reset data when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setData({
        cardLevel: currentCardLevel,
        maxCardLevel: currentMaxCardLevel,
        troopQuantity: currentTroopQuantity,
        entitySize: currentEntitySize,
        stats: currentStats
      });
    }
  }, [isOpen, currentCardLevel, currentMaxCardLevel, currentTroopQuantity, currentStats]);

  const handleStatChange = (statName: keyof AreaStats, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: numericValue
      }
    }));
  };

  const handleDataChange = (fieldName: keyof Omit<PlotAreaData, 'stats'>, value: string) => {
    const numericValue = parseInt(value) || 0;
    setData(prev => ({
      ...prev,
      [fieldName]: numericValue
    }));
  };

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  const handleCancel = () => {
    setData({
      cardLevel: currentCardLevel,
      maxCardLevel: currentMaxCardLevel,
      troopQuantity: currentTroopQuantity,
      entitySize: currentEntitySize,
      stats: currentStats
    }); // Reset to original values
    onClose();
  };

  if (!plotCoords || !cardName) {
    return null;
  }

  const statLabels: Record<keyof AreaStats, string> = {
    MaxHP: 'Max HP',
    Strength: 'Strength',
    WalkSpeed: 'Walk Speed',
    AttackSpeed: 'Attack Speed',
    CritMultiplier: 'Crit Multiplier',
    CritChance: 'Crit Chance'
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={`Edit Plot Stats`}>
      <div className={styles.plotStatsModal}>
        {/* Plot Info Header */}
        <div className={styles.plotInfo}>
          <div className={styles.plotHeader}>
            <h3>Plot ({plotCoords.x}, {plotCoords.y})</h3>
            <div className={styles.cardName}>{cardName}</div>
          </div>
        </div>

        {/* Card Data Section */}
        <div className={styles.cardDataSection}>
          <div className={styles.cardDataGrid}>
            <div className={styles.statRow}>
              <label className={styles.statLabel}>Card Level</label>
              <input
                type="number"
                min="0"
                value={data.cardLevel}
                onChange={(e) => handleDataChange('cardLevel', e.target.value)}
                className={styles.statInput}
              />
            </div>
            {data.maxCardLevel !== undefined && (
              <div className={styles.statRow}>
                <label className={styles.statLabel}>Max Card Level</label>
                <input
                  type="number"
                  min="0"
                  value={data.maxCardLevel}
                  onChange={(e) => handleDataChange('maxCardLevel', e.target.value)}
                  className={styles.statInput}
                />
              </div>
            )}
            <div className={styles.statRow}>
              <label className={styles.statLabel}>Troop Quantity</label>
              <input
                type="number"
                min="0"
                value={data.troopQuantity}
                onChange={(e) => handleDataChange('troopQuantity', e.target.value)}
                className={styles.statInput}
              />
            </div>
            <div className={styles.statRow}>
              <label className={styles.statLabel}>Entity Size</label>
              <input
                type="number"
                min="0"
                value={data.entitySize}
                onChange={(e) => handleDataChange('entitySize', e.target.value)}
                className={styles.statInput}
              />
            </div>
          </div>
        </div>

        {/* Combat Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {Object.entries(statLabels).map(([key, label]) => {
              const statKey = key as keyof AreaStats;
              return (
                <div key={key} className={styles.statRow}>
                  <label className={styles.statLabel}>{label}</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={data.stats[statKey]}
                    onChange={(e) => handleStatChange(statKey, e.target.value)}
                    className={styles.statInput}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.saveButton}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PlotStatsModal;