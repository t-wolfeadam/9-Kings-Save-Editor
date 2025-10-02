import React, { useState, useEffect } from 'react';
import { useCardContext } from '../../../contexts/CardContext';
import { useGameDataContext } from '../../../contexts/GameDataContext';
import CardHand from '../../common/Cards/CardHand';
import AddCardModal from '../../common/Modal/AddCardModal';
import styles from './BottomPanel.module.scss';

const BottomPanel: React.FC = () => {
  const { state, setHandCards } = useCardContext();
  const { state: gameState, updateHandCards } = useGameDataContext();
  const { handCards } = state;
  
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // Sync hand cards with game data only when new game data is loaded
  useEffect(() => {
    const gameHandCards = gameState.gameData?.HandCards?.Cards;
    if (gameHandCards && gameHandCards.length > 0) {
      setHandCards(gameHandCards);
    } else if (gameState.gameData && (!gameHandCards || gameHandCards.length === 0)) {
      // If game data exists but has no cards, clear the hand
      setHandCards([]);
    }
  }, [gameState.gameData?.HandCards?.Cards, setHandCards]);

  // Manual sync function to update game data when hand changes
  const syncHandCardsToGameData = () => {
    if (gameState.gameData) {
      const cardNames = handCards.map(card => card.cardName);
      updateHandCards(cardNames);
    }
  };

  const handleOpenAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCloseAddCardModal = () => {
    setIsAddCardModalOpen(false);
    // Sync hand cards to game data after modal closes (user may have added cards)
    setTimeout(syncHandCardsToGameData, 0);
  };

  const handleClearHand = () => {
    if (window.confirm('Are you sure you want to clear all cards from your hand?')) {
      setHandCards([]);
      updateHandCards([]);
    }
  };

  return (
    <div className={styles.bottomPanel}>
      <div className={styles.handCards}>
        <div className={styles.cardArea}>
          <CardHand/>
        </div>
      </div>
      
      <div className={styles.handActions}>
        <button 
          className={styles.actionButton}
          onClick={handleOpenAddCardModal}
          disabled={!gameState.gameData}
        >
          Add Card
        </button>
        <button 
          className={`${styles.actionButton} ${styles.clearButton}`}
          onClick={handleClearHand}
          disabled={handCards.length === 0 || !gameState.gameData}
        >
          Clear Hand
        </button>
      </div>

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={handleCloseAddCardModal}
      />
    </div>
  );
};

export default BottomPanel;