import React, { useState } from 'react';
import { AreaData } from '../../../types/GameSaveData';
import styles from './PlotCell.module.scss';
import { getCardInfo } from '../../../types/CardTypes';
import { im } from '@renderer/utils/image';

export type ConstructionMode = 'none' | 'add' | 'remove';

interface PlotCellProps {
  plotData: AreaData;
  constructionMode: ConstructionMode;
  onPlotClick: (x: number, y: number, plotData: AreaData) => void;
  onConstructionAction: (x: number, y: number, mode: ConstructionMode) => void;
}

const PlotCell: React.FC<PlotCellProps> = ({
  plotData,
  constructionMode,
  onPlotClick,
  onConstructionAction
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { XCoordinate: x, YCoordinate: y } = plotData;

  const getPlotState = (): 'accessible' | 'inaccessible' | 'hole' | 'occupied' => {
    if (plotData.PlotHoleEnabled) return 'hole';
    if (plotData.PlacedCardName) return 'occupied';
    if (plotData.IsUnlocked) return 'accessible';
    return 'inaccessible';
  };

  const plotState = getPlotState();

  const getPlotImage = (): string => {
    switch (plotState) {
      case 'accessible':
        return im('./assets/PlotOutline.png');
      case 'inaccessible':
        return im('./assets/PlotFill.png');
      case 'hole':
        return im('./assets/PlotHole.png');
      case 'occupied':
        // Show the placed card's image
        return im(getCardInfo(plotData.PlacedCardName)?.imagePath || './assets/PlotUnknown.png');
      default:
        return im('./assets/PlotUnknown.png');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (constructionMode !== 'none') {
      // Handle construction actions
      onConstructionAction(x, y, constructionMode);
    } else if (plotState === 'occupied') {
      // Show stats for occupied plots
      onPlotClick(x, y, plotData);
    }
  };

  const getConstructionCursor = (): string => {
    if (constructionMode === 'add' || constructionMode === 'remove') return 'crosshair';
    if (plotState === 'occupied') return 'pointer';
    return 'default';
  };

  return (
    <div
      className={`${styles.plotCell} ${styles[plotState]}`}
      style={{
        transform: `translate(${(x + y) * 32}px, ${(x - y) * 16}px)`,
        cursor: getConstructionCursor()
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-construction-mode={constructionMode}
      data-plot-state={plotState}
    >
      {/* Plot Background/Image */}
      <div className={styles.plotBackground}>
        <img 
          src={getPlotImage()} 
          alt={`Plot ${x},${y}`} 
          className={styles.plotImage}
          onError={(e) => {
            // Fallback to the debug icon if image fails to load
            (e.target as HTMLImageElement).src = im('./assets/PlotUnknown.png');
          }}
        />
      </div>

      {/* Coordinate Display (for development) */}
      <div className={styles.coordinates}>
        {x},{y}
      </div>


      {/* Card Level Display for Occupied Plots */}
      {plotState === 'occupied' && plotData.CardLevel > 0 && (
        <div className={styles.cardLevel}>
          Lv.{plotData.CardLevel}
        </div>
      )}

      {/* Troop Count Display */}
      {plotData.TroopQuantity > 0 && (
        <div className={styles.troopCount}>
          {plotData.TroopQuantity}
        </div>
      )}

      {/* Construction Mode Indicators */}
      {constructionMode !== 'none' && isHovered && (
        <div className={`${styles.constructionIndicator} ${styles[constructionMode]}`}>
          {constructionMode === 'add' && '+'}
          {constructionMode === 'remove' && '×'}
        </div>
      )}
    </div>
  );
};

export default PlotCell;