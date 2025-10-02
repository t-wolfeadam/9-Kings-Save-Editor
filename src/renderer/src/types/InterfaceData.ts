/**
 * All interfaces here are derived/computed types related to the UI
 */

export interface GridCoordinate {
  x: number;
  y: number;
}

// export interface CalendarDay {
//   dayNumber: number;
//   waveType: number;
//   kingType: PlayableKingType;
//   isCompleted: boolean;
//   isCurrent: boolean;
// }

// export interface GridStatistics {
//   totalCards: number;
//   totalTroops: number;
//   averageLevel: number;
//   factionDistribution: Record<PlayableKingType, number>;
//   powerRating: number;
// }

// export interface CardData { // TODO used?
//   name: string;
//   type: CardType;
//   variant: CardVariant;
//   level: number;
//   troops: number;
//   stats: AreaStats;
// }

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  canRepair: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}