import React, { useEffect } from 'react';
import { ConstructionMode } from './PlotCell';
import styles from './ConstructionTools.module.scss';
import { useGameDataContext } from '../../../contexts/GameDataContext'
import { im } from '@renderer/utils/image';

interface ConstructionToolsProps {
  currentMode: ConstructionMode;
  onModeChange: (mode: ConstructionMode) => void;
}

const ConstructionTools: React.FC<ConstructionToolsProps> = ({
  currentMode,
  onModeChange
}) => {
  const ctx = useGameDataContext();

  const handleToolClick = (mode: ConstructionMode) => {
    // Toggle off if clicking the same tool, otherwise switch to new tool
    const newMode = currentMode === mode ? 'none' : mode;
    onModeChange(newMode);
  };

  // Handle right-click and escape key to clear construction mode
  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      if (currentMode !== 'none') {
        e.preventDefault(); // Prevent default context menu
        onModeChange('none');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentMode !== 'none') {
        onModeChange('none');
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentMode, onModeChange]);

  return (
    <div className={styles.constructionTools}>
      <div className={styles.toolsHeader}>
        <span className={styles.toolsTitle}>Construction Tools</span>
      </div>
      
      <div className={styles.toolsGrid}>
        {/* Add Access Tool */}
        <button
          className={`${styles.tool} ${styles.addTool} ${
            currentMode === 'add' ? styles.active : ''
          }`}
          onClick={() => handleToolClick('add')}
          disabled={!ctx.state.gameData}
          title="Add Access - Click to unlock inaccessible plots"
          aria-label="Add access tool"
        >
          <img
            src={im("./assets/Construction_Add.png")}
            alt="Add Access"
            className={styles.toolIcon}
            onError={(e) => {
              // Fallback to text if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className={styles.toolLabel}>Add</span>
          {currentMode === 'add' && (
            <div className={styles.activeIndicator}>Active</div>
          )}
        </button>

        {/* Remove/Hole Tool */}
        <button
          className={`${styles.tool} ${styles.removeTool} ${
            currentMode === 'remove' ? styles.active : ''
          }`}
          onClick={() => handleToolClick('remove')}
          disabled={!ctx.state.gameData}
          title="Remove/Hole - Click to convert plots to holes"
          aria-label="Remove/hole tool"
        >
          <img
            src={im("./assets/Construction_Remove.png")}
            alt="Remove/Hole"
            className={styles.toolIcon}
            onError={(e) => {
              // Fallback to text if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className={styles.toolLabel}>Remove</span>
          {currentMode === 'remove' && (
            <div className={styles.activeIndicator}>Active</div>
          )}
        </button>
      </div>

      {/* Mode Instructions */}
      <div className={styles.instructions}>
        {currentMode === 'none' && (
          <span>Select a tool, then click on plots to modify them</span>
        )}
        {currentMode === 'add' && (
          <span>Convert a plot to its next accessible state (hole -&gt; locked -&gt; empty)</span>
        )}
        {currentMode === 'remove' && (
          <span>Convert a plot to its next inaccessible state (card -&gt; empty -&gt; locked -&gt; hole)</span>
        )}
      </div>

      {/* Clear Mode Button */}
      {currentMode !== 'none' && (
        <button
          className={styles.clearButton}
          onClick={() => onModeChange('none')}
          title="Clear construction mode"
        >
          Clear Mode
        </button>
      )}
    </div>
  );
};

export default ConstructionTools;