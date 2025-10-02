import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react';
import { HandCard, generateCardId } from '../types/CardTypes';

// State interface
interface CardState {
  handCards: HandCard[];
}

// Action types
type CardAction =
  | { type: 'SET_HAND_CARDS'; payload: string[] }
  | { type: 'ADD_CARD'; payload: string }
  | { type: 'REMOVE_CARD'; payload: string }
  | { type: 'CLEAR_HAND' };

// Initial state
const initialState: CardState = {
  handCards: []
};

// Reducer function
function cardReducer(state: CardState, action: CardAction): CardState {
  switch (action.type) {
    case 'SET_HAND_CARDS':
      return {
        ...state,
        handCards: action.payload.map((cardName, index) => ({
          id: generateCardId(cardName, index),
          cardName
        }))
      };

    case 'ADD_CARD':
      const newCard: HandCard = {
        id: generateCardId(action.payload, state.handCards.length),
        cardName: action.payload
      };
      return {
        ...state,
        handCards: [...state.handCards, newCard]
      };

    case 'REMOVE_CARD':
      return {
        ...state,
        handCards: state.handCards.filter(card => card.id !== action.payload)
      };

    case 'CLEAR_HAND':
      return {
        ...state,
        handCards: []
      };

    default:
      return state;
  }
}

// Context interface
interface CardContextType {
  state: CardState;
  dispatch: React.Dispatch<CardAction>;
  // Helper functions
  setHandCards: (cards: string[]) => void;
  addCard: (cardName: string) => void;
  removeCard: (cardId: string) => void;
  clearHand: () => void;
}

// Create context
const CardContext = createContext<CardContextType | undefined>(undefined);

// Provider component
export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  // Helper functions - memoized to prevent infinite re-renders
  const setHandCards = useCallback((cards: string[]) => {
    dispatch({ type: 'SET_HAND_CARDS', payload: cards });
  }, []);

  const addCard = useCallback((cardName: string) => {
    dispatch({ type: 'ADD_CARD', payload: cardName });
  }, []);

  const removeCard = useCallback((cardId: string) => {
    dispatch({ type: 'REMOVE_CARD', payload: cardId });
  }, []);

  const clearHand = useCallback(() => {
    dispatch({ type: 'CLEAR_HAND' });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value: CardContextType = useMemo(() => ({
    state,
    dispatch,
    setHandCards,
    addCard,
    removeCard,
    clearHand,
  }), [state, setHandCards, addCard, removeCard, clearHand]);

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};

// Custom hook to use the card context
export const useCardContext = (): CardContextType => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};

export default CardContext;