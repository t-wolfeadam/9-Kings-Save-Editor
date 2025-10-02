import React from 'react';
import { useCardContext } from '../../../contexts/CardContext';
import CardItem from './CardItem';
import styles from './CardHand.module.scss';

interface CardHandProps {
  className?: string;
  emptyMessage?: string;
}

/**
 * Represents the bottom area where the cards and add/clear buttons are shown
 */
const CardHand: React.FC<CardHandProps> = ({
  className = ''
}) => {
  const { state, removeCard } = useCardContext();
  const { handCards } = state;

  return (
    <div className={`${styles.cardHandContainer} ${className}`}>
      <div className={styles.cardHand}>
        {handCards.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyMessage}>No cards in hand</span>
          </div>
        ) : (
          handCards.map((card, index) => (
            <CardItem
              key={card.id}
              card={card}
              index={index}
              onRemove={removeCard}
            />
          ))
        )}
        
      </div>
    </div>
  );
};

export default CardHand;