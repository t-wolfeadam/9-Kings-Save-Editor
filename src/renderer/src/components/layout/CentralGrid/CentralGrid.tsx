import React from 'react';
import IsometricGrid from '../../game/Grid/IsometricGrid';
import { useGameDataContext } from '../../../contexts/GameDataContext';
import { AreaData } from '../../../types/GameSaveData';
import styles from './CentralGrid.module.scss';

interface CentralGridProps {
  areaData?: AreaData[];
  onAreaDataChange?: (areaData: AreaData[]) => void;
}

const CentralGrid: React.FC<CentralGridProps> = ({
  areaData,
  onAreaDataChange
}) => {
  const { state: gameState, updateAreas } = useGameDataContext();
  
  // Use game context data if available, otherwise use passed props
  const currentAreaData = gameState.gameData?.Areas || areaData;
  
  const handleAreaDataChange = (newAreaData: AreaData[]) => {
    // Update the context if we have game data loaded
    if (gameState.gameData) {
      updateAreas(newAreaData);
    }
    
    // Also call the prop callback if provided
    if (onAreaDataChange) {
      onAreaDataChange(newAreaData);
    }
  };

  return (
    <div className={styles.centralGrid}>
      <IsometricGrid
        areaData={currentAreaData}
        onAreaDataChange={handleAreaDataChange}
      />
    </div>
  );
};

export default CentralGrid;