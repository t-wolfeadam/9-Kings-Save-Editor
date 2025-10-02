import React, { useState, useCallback } from 'react';
import { useGameDataContext } from '../../../contexts/GameDataContext';
import styles from './WaveDetails.module.scss';

interface EditableFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type: 'number';
  step?: number;
  min?: number;
  max?: number;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  step = 1,
  min,
  max
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setTempValue(value.toString());
  }, [value]);

  const handleSave = useCallback(() => {
    const numValue = parseFloat(tempValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min ?? -Infinity), max ?? Infinity);
      onChange(clampedValue);
    }
    setIsEditing(false);
  }, [tempValue, onChange, min, max]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setTempValue(value.toString());
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  return (
    <div className={styles.editRow}>
      <span className={styles.statLabel}>{label}:</span>
      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={styles.editInput}
            step={step}
            min={min}
            max={max}
            autoFocus
          />
        </div>
      ) : (
        <span
          className={`${styles.statValue} ${styles.editableValue}`}
          onClick={handleStartEdit}
          title="Click to edit"
        >
          {value}
        </span>
      )}
    </div>
  );
};

const WaveDetails: React.FC = () => {
  const { state, areaStatistics, updateWaveData } = useGameDataContext();

  const handleUpdateWaveValue = useCallback((key: 'PlayerLifes' | 'Seed' | 'ChaosLevel', value: number) => {
    const updatedData = {
      [key]: value
    };
    updateWaveData(updatedData);
  }, [updateWaveData]);

  if (!state.gameData || !areaStatistics) {
    return (
      <div className={styles.areaStatistics}>
        <div className={styles.placeholder}>
          <span className={styles.placeholderText}>No game data loaded</span>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
 
  const formatDecimal = (num: number): string => {
    return num.toFixed(1);
  };

  return (
    <div className={styles.areaStatistics}>
      <div className={styles.statsGrid}>

        <EditableField
          label="Lives"
          value={state.gameData.WaveData.PlayerLifes}
          onChange={(value) => handleUpdateWaveValue('PlayerLifes', value)}
          type="number"
          min={1}
          max={3}
        />

        <EditableField
          label="Seed"
          value={state.gameData.WaveData.Seed}
          onChange={(value) => handleUpdateWaveValue('Seed', value)}
          type="number"
        />

        <EditableField
          label="Chaos"
          value={state.gameData.WaveData.ChaosLevel}
          onChange={(value) => handleUpdateWaveValue('ChaosLevel', value)}
          type="number"
          min={1}
        />
      </div>
      
      {/* Aggregate statistics from occupied areas */}
      {state.gameData.Areas.some(area => area.IsUnlocked && area.PlacedCardName) && (
        <div className={styles.aggregateStats}>
          <h4 className={styles.sectionTitle}>Aggregate Stats</h4>
          <div className={styles.statsGrid}>
            {(() => {
              const occupiedAreas = state.gameData!.Areas.filter(area => area.IsUnlocked && area.PlacedCardName);
              
              if (occupiedAreas.length === 0) return null;
              
              const totalMaxHP = occupiedAreas.reduce((sum, area) => sum + area.Stats.MaxHP, 0);
              const totalStrength = occupiedAreas.reduce((sum, area) => sum + area.Stats.Strength, 0);
              const avgWalkSpeed = occupiedAreas.reduce((sum, area) => sum + area.Stats.WalkSpeed, 0) / occupiedAreas.length;
              const avgAttackSpeed = occupiedAreas.reduce((sum, area) => sum + area.Stats.AttackSpeed, 0) / occupiedAreas.length;
              const avgCritMultiplier = occupiedAreas.reduce((sum, area) => sum + area.Stats.CritMultiplier, 0) / occupiedAreas.length;
              const avgCritChance = occupiedAreas.reduce((sum, area) => sum + area.Stats.CritChance, 0) / occupiedAreas.length;
              
              return (
                <>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Total Max HP:</span>
                    <span className={styles.statValue}>{formatNumber(totalMaxHP)}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Total Strength:</span>
                    <span className={styles.statValue}>{formatNumber(totalStrength)}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Avg Walk Speed:</span>
                    <span className={styles.statValue}>{formatDecimal(avgWalkSpeed)}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Avg Attack Speed:</span>
                    <span className={styles.statValue}>{formatDecimal(avgAttackSpeed)}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Avg Crit Mult:</span>
                    <span className={styles.statValue}>{formatDecimal(avgCritMultiplier)}x</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Avg Crit Chance:</span>
                    <span className={styles.statValue}>{(avgCritChance * 100).toFixed(1)}%</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaveDetails;