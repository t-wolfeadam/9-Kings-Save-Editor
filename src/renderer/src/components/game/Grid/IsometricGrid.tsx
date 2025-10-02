import React, { useState, useCallback, useMemo } from 'react';
import { AreaData, AreaStats } from '../../../types/GameSaveData';
import { getAllGridCoordinates, coordinateToIndex, isInCenterNine } from '../../../utils/gridUtils';
import PlotCell, { ConstructionMode } from './PlotCell';
import ConstructionTools from './ConstructionTools';
import PlotStatsModal from './PlotStatsModal';
import styles from './IsometricGrid.module.scss';

interface IsometricGridProps {
  areaData?: AreaData[];
  onAreaDataChange?: (areaData: AreaData[]) => void;
}

const IsometricGrid: React.FC<IsometricGridProps> = ({
  areaData,
  onAreaDataChange
}) => {
  const [constructionMode, setConstructionMode] = useState<ConstructionMode>('none');
  const [statsModal, setStatsModal] = useState<{
    isOpen: boolean;
    plotCoords: { x: number; y: number } | null;
    plotData: AreaData | null;
  }>({
    isOpen: false,
    plotCoords: null,
    plotData: null
  });

  // Generate default area data if none provided
  const gridAreas = useMemo(() => {
    if (areaData && areaData.length === 25) {
      return areaData;
    }

    // Create default 5x5 grid with center 9 unlocked
    return getAllGridCoordinates().map(({ x, y }) => ({
      IsUnlocked: isInCenterNine(x, y),
      PlotHoleEnabled: false,
      XCoordinate: x,
      YCoordinate: y,
      PlacedCardName: '',
      CardLevel: 0,
      MaxCardLevel: undefined,
      TroopQuantity: 0,
      EntitySize: 1,
      Stats: {
        MaxHP: 0,
        Strength: 0,
        WalkSpeed: 0,
        AttackSpeed: 0,
        CritMultiplier: 0,
        CritChance: 0
      }
    }));
  }, [areaData]);

  // Update area data helper
  const updateAreaData = useCallback((updatedAreas: AreaData[]) => {
    if (onAreaDataChange) {
      onAreaDataChange(updatedAreas);
    }
  }, [onAreaDataChange]);


  // Handle construction actions
  const handleConstructionAction = useCallback((x: number, y: number, mode: ConstructionMode) => {
    const areaIndex = coordinateToIndex(x, y);
    const area = gridAreas[areaIndex];
    const updatedAreas = [...gridAreas];

    switch (mode) {
      case 'add':
        // Progressive addition: hole → inaccessible → accessible
        if (area.PlotHoleEnabled) {
          // From hole to inaccessible
          updatedAreas[areaIndex] = {
            ...area,
            PlotHoleEnabled: false,
            IsUnlocked: false
          };
        } else if (!area.IsUnlocked) {
          // From inaccessible to accessible
          updatedAreas[areaIndex] = {
            ...area,
            IsUnlocked: true
          };
        }
        // If already accessible, no further action
        break;
      
      case 'remove':
        // Progressive removal: occupied → accessible → inaccessible → hole
        if (area.PlacedCardName) {
          // From occupied to accessible (remove card)
          updatedAreas[areaIndex] = {
            ...area,
            PlacedCardName: '',
            CardLevel: 0,
            MaxCardLevel: undefined,
            TroopQuantity: 0,
            EntitySize: 1,
            Stats: {
              MaxHP: 0,
              Strength: 0,
              WalkSpeed: 0,
              AttackSpeed: 0,
              CritMultiplier: 0,
              CritChance: 0
            }
          };
        } else if (area.IsUnlocked && !area.PlotHoleEnabled) {
          // From accessible to inaccessible
          updatedAreas[areaIndex] = {
            ...area,
            IsUnlocked: false
          };
        } else if (!area.IsUnlocked && !area.PlotHoleEnabled) {
          // From inaccessible to hole
          updatedAreas[areaIndex] = {
            ...area,
            PlotHoleEnabled: true
          };
        }
        // If already a hole, no further action
        break;
    }

    updateAreaData(updatedAreas);
  }, [gridAreas, updateAreaData]);

  // Handle plot click for stats
  const handlePlotClick = useCallback((x: number, y: number, plotData: AreaData) => {
    if (plotData.PlacedCardName) {
      setStatsModal({
        isOpen: true,
        plotCoords: { x, y },
        plotData
      });
    }
  }, []);

  // Handle stats save
  const handleStatsSave = useCallback((plotData: { cardLevel: number; maxCardLevel?: number; troopQuantity: number; entitySize: number; stats: AreaStats }) => {
    if (!statsModal.plotCoords) return;

    const { x, y } = statsModal.plotCoords;
    const areaIndex = coordinateToIndex(x, y);
    const updatedAreas = [...gridAreas];
    
    updatedAreas[areaIndex] = {
      ...updatedAreas[areaIndex],
      CardLevel: plotData.cardLevel,
      MaxCardLevel: plotData.maxCardLevel,
      TroopQuantity: plotData.troopQuantity,
      EntitySize: plotData.entitySize,
      Stats: plotData.stats
    };

    updateAreaData(updatedAreas);
  }, [statsModal.plotCoords, gridAreas, updateAreaData]);

  // Close stats modal
  const handleStatsModalClose = useCallback(() => {
    setStatsModal({
      isOpen: false,
      plotCoords: null,
      plotData: null
    });
  }, []);

  return (
    <div className={styles.isometricGrid}>
      {/* Construction Tools */}
      <ConstructionTools
        currentMode={constructionMode}
        onModeChange={setConstructionMode}
      />

      {/* Grid Container */}
      <div className={styles.gridContainer}>
        <div className={styles.plotsContainer}>
          {gridAreas.map((area) => (
            <PlotCell
              key={`${area.XCoordinate},${area.YCoordinate}`}
              plotData={area}
              constructionMode={constructionMode}
              onPlotClick={handlePlotClick}
              onConstructionAction={handleConstructionAction}
            />
          ))}
        </div>

        {/* Grid Center Reference */}
        <div className={styles.gridCenter}>
          <div className={styles.centerDot} />
        </div>
      </div>

      {/* Grid Info */}
      <div className={styles.gridInfo}>
        <span>
          {constructionMode === 'none'
            ? 'Click occupied plots for stats'
            : `${constructionMode === 'add' ? 'Add' : 'Remove'} mode active`
          }
        </span>
      </div>

      {/* Stats Modal */}
      <PlotStatsModal
        isOpen={statsModal.isOpen}
        onClose={handleStatsModalClose}
        onSave={handleStatsSave}
        plotCoords={statsModal.plotCoords}
        cardName={statsModal.plotData?.PlacedCardName || ''}
        currentCardLevel={statsModal.plotData?.CardLevel || 1}
        currentMaxCardLevel={statsModal.plotData?.MaxCardLevel}
        currentTroopQuantity={statsModal.plotData?.TroopQuantity || 1}
        currentEntitySize={statsModal.plotData?.EntitySize || 1}
        currentStats={statsModal.plotData?.Stats || {
          MaxHP: 0,
          Strength: 0,
          WalkSpeed: 0,
          AttackSpeed: 0,
          CritMultiplier: 0,
          CritChance: 0
        }}
      />
    </div>
  );
};

export default IsometricGrid;