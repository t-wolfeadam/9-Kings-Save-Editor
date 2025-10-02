import React from 'react';
import { HandCard } from '../../../types/CardTypes';
import { getCardInfo } from '../../../types/CardTypes';
import styles from './CardItem.module.scss';
import { im } from '@renderer/utils/image';

interface CardItemProps {
  card: HandCard;
  index: number;
  onRemove?: (cardId: string) => void;
  className?: string;
}

/**
 * Represents a single card in the player's hand
 */
const CardItem: React.FC<CardItemProps> = ({
  card,
  onRemove,
  className = ''
}) => {
  const cardInfo = getCardInfo(card.cardName);

  if (!cardInfo) {
    return (
      <div className={`${styles.cardItem} ${styles.errorCard} ${className}`}>
        <div className={styles.errorText}>Invalid Card</div>
        <span className={styles.cardName}>{card.cardName}</span>
      </div>
    );
  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onRemove) {
      onRemove(card.id);
    }
  };

  return (
    <div
      className={`
        ${styles.cardItem}
        ${className}
      `}
      onContextMenu={handleRightClick}
      tabIndex={0}
      role="button"
      aria-label={`Card ${cardInfo.displayName}. Click this or right-click to remove.`}
    >
      <div className={styles.cardImageContainer}>
        <img
          src={im(cardInfo.imagePath)}
          alt={cardInfo.displayName}
          className={styles.cardImage}
          draggable={false}
        />
        {card.count && card.count > 1 && (
          <div className={styles.countBadge}>
            {card.count}
          </div>
        )}
      </div>
      
      <span className={styles.cardName}>
        {cardInfo.displayName}
      </span>
      
      {onRemove && (
        <button
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(card.id);
          }}
          aria-label={`Remove ${cardInfo.displayName}`}
          title="Click this or right-click to remove"
        >
          ×
        </button>
      )}
      
    </div>
  );
};

export default CardItem;