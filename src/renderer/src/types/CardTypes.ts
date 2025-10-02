import { im } from "@renderer/utils/image";
import rawCardInfo from "../card_info.json";
import { PlayableKingType } from './GameSaveData';

// Card-related types for the card management system

export interface CardInfo {
  name: string;
  displayName: string;
  king: PlayableKingType;
  type: string;
  imagePath: string;
  description: string;
}

export interface HandCard {
  id: string; // unique identifier for drag-and-drop (removed feature)
  cardName: string;
  count?: number; // number of copies (for stacking)
}

export interface DragData {
  type: 'CARD';
  cardName: string;
  sourceType: 'HAND' | 'GRID';
  sourceIndex?: number;
}

// export interface CardDragResult {
//   draggableId: string;
//   type: string;
//   source: {
//     droppableId: string;
//     index: number;
//   };
//   destination?: {
//     droppableId: string;
//     index: number;
//   } | null;
// }

// All available card types with their information
type AvailableCards = CardInfo[]
rawCardInfo.forEach(c => c.imagePath = im(c.imagePath)); // fix image paths
export const AVAILABLE_CARDS: AvailableCards = rawCardInfo as AvailableCards;

// Helper functions
export const getCardInfo = (cardName: string): CardInfo | undefined => {
  return AVAILABLE_CARDS.find(card => card.name === cardName || card.displayName == cardName);
};

export const getCardsByType = (king: PlayableKingType): CardInfo[] => {
  return AVAILABLE_CARDS.filter(card => card.king === king);
};

export const generateCardId = (cardName: string, index: number): string => {
  return `${cardName}-${index}-${Date.now()}`;
};