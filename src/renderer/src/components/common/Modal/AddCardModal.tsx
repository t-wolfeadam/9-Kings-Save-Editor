import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { AVAILABLE_CARDS, CardInfo, getCardsByType } from '../../../types/CardTypes';
import { useCardContext } from '../../../contexts/CardContext';
import styles from './AddCardModal.module.scss';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The modal that lets players choose one or more cards to add to their hand. Includes option for filtering.
 */
const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addCard } = useCardContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<'All' | 'Special' | 'Nothing' | 'Spells' | 'Blood' | 'Greed' | 'Nature' | 'Progress' | 'Stone' | 'Nomads' | 'Time' >('All');

  // Filter cards based on search and faction
  const filteredCards = useMemo(() => {
    let cards = AVAILABLE_CARDS;
    
    if (selectedFaction !== 'All') {
      cards = getCardsByType(selectedFaction);
    }
    
    if (searchTerm) {
      cards = cards.filter(card => 
        card.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return cards;
  }, [searchTerm, selectedFaction]);

  // Group cards by faction for display
  const cardsByFaction = useMemo(() => {
    const groups = {
      Nothing: getCardsByType('Nothing'),
      Spells: getCardsByType('Spells'),
      Blood: getCardsByType('Blood'),
      Greed: getCardsByType('Greed'),
      Nature: getCardsByType('Nature'),
      Progress: getCardsByType('Progress'),
      Stone: getCardsByType('Stone'),
      Nomads: getCardsByType('Nomads'),
      Time: getCardsByType('Time'),
      Special: getCardsByType('Special')
    };
    
    // Apply search filter to each group if needed
    if (searchTerm || selectedFaction !== 'All') {
      Object.keys(groups).forEach(faction => {
        groups[faction as keyof typeof groups] = groups[faction as keyof typeof groups].filter(card =>
          filteredCards.includes(card)
        );
      });
    }
    
    return groups;
  }, [filteredCards, searchTerm]);

  const handleAddCard = (cardName: string) => {
      addCard(cardName);
      //onClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedFaction('All');
    onClose();
  };

  const CardGrid: React.FC<{ cards: CardInfo[]; title: string }> = ({ cards, title }) => {
    if (cards === null) return null;
    if (cards.length === 0) return null;

    return (
      <div className={styles.factionSection}>
        <h3 className={styles.factionTitle} data-faction={title.toLowerCase()}>
          {title} Cards
          <span className={styles.cardCount}>({cards.length})</span>
        </h3>
        <div className={styles.cardGrid}>
          {cards.map((card) => (
            <button
              key={card.name}
              className={`${styles.cardOption}`}
              onClick={() => handleAddCard(card.name)}
              title={
                `Add ${card.displayName} to your hand`
              }
            >
              <div className={styles.cardImageContainer}>
                <img
                  src={card.imagePath}
                  alt={card.displayName}
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardName}>{card.displayName}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Card to Hand"
      size="extralarge"
    >
      <div className={styles.modalContent}>
        {/* Search and Filter Controls */}
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>🔍</div>
          </div>
          
          <div className={styles.factionFilters}>
            {['All', 'Nothing', 'Spells', 'Blood', 'Greed', 'Nature', 'Progress', 'Stone', 'Nomads', 'Time', 'Special'].map((faction) => (
              <button
                key={faction}
                className={`
                  ${styles.factionFilter}
                  ${selectedFaction === faction ? styles.active : ''}
                `}
                onClick={() => setSelectedFaction(faction as typeof selectedFaction)}
                data-faction={faction.toLowerCase()}
              >
                {faction}
              </button>
            ))}
          </div>
        </div>

        {/* Card Selection Grid */}
        <div className={styles.cardSelection}>
          {selectedFaction === 'All' ? (
            // Show all factions
            Object.entries(cardsByFaction).map(([faction, cards]) => (
              <CardGrid
                key={faction}
                cards={cards}
                title={faction}
              />
            ))
          ) : (
            // Show selected faction only
            <CardGrid
              cards={cardsByFaction[selectedFaction]}
              title={selectedFaction}
            />
          )}
          
          {filteredCards.length === 0 && (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <span className={styles.noResultsText}>
                No cards found matching "{searchTerm}"
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button
            className={styles.doneButton}
            onClick={handleClose}
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCardModal;