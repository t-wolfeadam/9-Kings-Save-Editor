/**
 * All interfaces here follow the same structure as in the save file.
 * Undesired keys are omitted.
 */
import { im } from "@renderer/utils/image";

export interface GameSaveData {
  Version: string;
  Message: string | null;
  WaveData: WaveData;
  Kings: KingsData;
  Areas: AreaData[];
  Policies: PoliciesData;
  HandCards: HandCardsData;
  PolicyVariables: PolicyVariables;
  Blessing: BlessingData;
}

export interface WaveData {
  WaveNumber: number;
  Seed: number;
  Currency: number;
  ChaosLevel: number;
  PlayerLifes: number;
  SpecialWaveIndex: number;
  Difficulty: string;
  Waves: WaveInfo[];
}

export interface WaveInfo {
  Type: number;
  King: number;
}

// Map wave types to their corresponding descriptions and details
export const waveTypeInfo: Record<number, { name: string; description: string, imagePath: string }> = {
  0: {
    name: 'Battle',
    description: 'Commence battle with an at-war King',
    imagePath: im('./assets/Calendar_00.png')
  },
  1: {
    name: 'Royal Council',
    description: 'Pick unique decree(s)',
    imagePath: im('./assets/Calendar_01.png')
  },
  2: {
    name: 'Shop',
    description: 'Purchase cards with gold',
    imagePath: im('./assets/Calendar_02.png')
  },
  3: {
    name: 'Diplomat (Peace)',
    description: 'Declare peace with an at-war King',
    imagePath: im('./assets/Calendar_05.png')
  },
  4: {
    name: 'Prophet (granted)',
    description: 'Grant the prophecy',
    imagePath: im('./assets/Calendar_03.png')
  },
  5: {
    name: 'Boss',
    description: 'Final battle in the base run',
    imagePath: im('./assets/Calendar_04.png')
  },
  6: {
    name: 'Prophet (forsee)',
    description: 'Foresee a random blessing that will happen in 9 years',
    imagePath: im('./assets/Calendar_03.png')
  },
  7: {
    name: 'Diplomat (War)',
    description: 'Declare war on a new King',
    imagePath: im('./assets/Calendar_05.png')
  },
  8: {
    name: 'Tower',
    description: 'Kingdom-expanding event',
    imagePath: im('./assets/Calendar_06.png')
  }
}

export const kingTypes = [
  'Blood',
  'Greed',
  'Nature',
  'Stone',
  'Time',
  'Spells',
  'Progress',
  'Nomads',
  'Nothing',
] as const;
export type PlayableKingType = typeof kingTypes[number];
export type KingType = PlayableKingType | 'Special';
export type KingClassificationType = KingType | 'Common'; // e.g., for perks

/**
 * Convert the King type (or null for 'random') to its unique ID (primarily used in the wave data)
 * @param king 
 * @returns 
 */
export function king2id(king: PlayableKingType | null): number {
  switch (king) {
    case "Nothing": return 1
    case "Spells": return 2
    case "Blood": return 4
    case "Greed": return 8
    case "Progress": return 16
    case "Stone": return 32
    case "Nomads": return 64
    case "Nature": return 128
    case "Time": return 256
    default: return 512
  }
}

/**
 * Convert the ID used in the save file (primarily in the wave data) to the king
 * @param id
 * @returns 
 */
export function id2king(id: number | null): string {
  switch (id) {
    case 1: return "Nothing"
    case 2: return "Spells"
    case 4: return "Blood"
    case 8: return "Greed"
    case 16: return "Progress"
    case 32: return "Stone"
    case 64: return "Nomads"
    case 128: return "Nature"
    case 256: return "Time"
    default: return "<Random>" // includes 512
  }
}

export interface KingsData {
  PlayerKing: PlayableKingType;
  EnemyKings: PlayableKingType[];
}

export interface AreaData {
  IsUnlocked: boolean;
  PlotHoleEnabled: boolean;
  XCoordinate: number;
  YCoordinate: number;
  PlacedCardName: string;
  CardLevel: number;
  MaxCardLevel?: number;
  TroopQuantity: number;
  EntitySize: number;
  Stats: AreaStats;
}

export interface AreaStats {
  MaxHP: number;
  Strength: number;
  WalkSpeed: number;
  AttackSpeed: number;
  CritMultiplier: number;
  CritChance: number;
}

export interface PoliciesData {
  Policies: PolicyData[];
}

export interface PolicyData {
  Name: string;
  Stacks: number;
}

export interface HandCardsData {
  Cards: string[];
}

export interface PolicyVariables {
  PIT_COINS_MULTIPLIER: number;
  GOLD_PER_AREA_LEVEL_UP: number;
  DEMOLITION_CREW_ENABLED: boolean;
  BUILDINGS_EFFECT_INCREMENTER: number;
  TOWERS_STRENGTH_BOOST: number;
  TOWERS_ATTACK_SPEED_BOOST: number;
  TOWERS_MOVE_SPEED_BOOST: number;
  TOWERS_CRITICAL_MULTIPLIER_BOOST: number;
  TOWERS_CRITICAL_CHANCE_BOOST: number;
  NEW_BUILDINGS_STRENGTH_MULTIPLIER: number;
  NEW_BUILDINGS_ATTACK_DELAY_MULTIPLIER: number;
  NEW_BUILDINGS_MOVE_SPEED_MULTIPLIER: number;
  NEW_BUILDINGS_CRITICAL_MULTIPLIER_MULTIPLIER: number;
  NEW_BUILDINGS_CRITICAL_CHANCE_MULTIPLIER: number;
  LIBRARY_EFFECT_CHANCE_BOOST: number;
  SPIRE_ADDITIONAL_RAYS: number;
  SCOUT_TOWER_ADDITIONAL_ARROWS: number;
  SPIRE_RAY_COUNT_MULTIPLIER: number;
  MANGLER_ATTACK_AREA_MULTIPLIER: number;
  CEMETERY_SUMMONS_HP_MULTIPLIER: number;
  DISPENSER_ATTACK_STRENGTH_MULTIPLIER: number;
  ORCHARD_ADDITIONAL_ROOTS: number;
  CONVERTER_ATTACK_SPEED_MULTIPLIER: number;
  WALLS_HP_MULTIPLIER: number;
  TREBUCHET_ADDITIONAL_ROCKS: number;
  FLAMETOWER_ATTACK_AREA_SIZE_MULTIPLIER: number;
  CAULDRON_POISON_ADDITIONAL_STACKS: number;
  WALLS_REFLECT_DAMAGE_STACKS: number;
  LIBRARY_ADDITIONAL_START_LEVEL: number;
  GARRISON_ENABLED: boolean;
  FRANKENSTEINIAN_ENABLED: boolean;
  CASTLE_START_MAX_HP_BOOST: number;
  CASTLE_START_STRENGTH_BOOST: number;
  CASTLE_START_MOVE_SPEED_BOOST: number;
  CASTLE_START_ATTACK_SPEED_BOOST: number;
  CASTLE_START_CRITICAL_MULTIPLIER_BOOST: number;
  CASTLE_START_CRITICAL_CHANCE_BOOST: number;
  CASTLE_INSTAKILL_CHANCE: number;
  PAGODA_ADDITIONAL_IMPS: number;
  PAGODA_MAX_IMPS_MULTIPLY: number;
  STRONGHOLD_ADDITIONAL_START_LEVEL: number;
  NOTHING_CASTLE_STONE_ATTACK_RANGE_MULTIPLIER: number;
  INGENIOUS_STACKS: number;
  FIREBALL_STACKS: number;
  ENT_CAUSES_DAMAGE: boolean;
  CRITICAL_MULTIPLIER: number;
  CRITICAL_CHANCE_BOOST: number;
  SOLITUDE_STACKS: number;
  GOLD_PER_9ALLIES: number;
  REVITALIZE_STACKS: number;
  WEAKSPOT_STACKS: number;
  NOTHING_CARDS_ATTACK_SPEED_MULTIPLIER: number;
  NATURE_ADDITIONAL_TROOPS: number;
  PROGRESS_TROOPS_MAX_ADDITIONAL_LEVEL: number;
  COINS_PER_LIFE: number;
  BLESSING_EFFECT_MULTIPLIER: number;
  IMMIGRANT_STACKS: number;
  LONGTERMISM_STACKS: number;
  WISHING_WELL_STACKS: number;
  VISIONARY_ENABLED: boolean;
  //ADDITIONAL_START_CARDS: object;
  //ADDITIONAL_CARDS_AFTER_LOSING_LIFE: object;
  MERCHANT_CARDS_BOUGHT: number;
  SHOP_CARD_COST_MULTIPLIER: number;
  DECREE_EXTRA_OPTIONS: number;
  FREE_REROLLS: number;
  FREE_PERSISTENT_REROLLS: number;
  FREE_MERCHANT_CARDS: number;
  PAYROLL_STACKS: number;
  TINKERING_ENABLED: boolean;
  MARKETPLACE_ENABLED: boolean;
  OVERHAUL_USES: number;
  STATIC_ADDITIONAL_RAW_STRENGTH: number;
  VENOM_POLICY_MULTIPLIER: number;
  AREA_DAMAGE_SIZE_BOOST: number;
  TRAPPERS_TRAP_DAMAGE_MULTIPLIER: number;
  MOTHERSHIP_ATTACK_RANGE_MULTIPLIER: number;
  RAINBOW_CHANCE_MULTIPLIER: number;
  DOUBLE_THUNDERS_STACKS: number;
  CARNAGE_AREA_SIZE_MULTIPLIER: number;
  OVERINVEST_ADDITIONAL_BOOST_PERCENTAGE: number;
  MORTGAGE_ADDITIONAL_GOLD: number;
  POISON_ENEMY_DELAY_MULTIPLIER: number;
  LIFE_STEAL_SPELLS_MULTIPLIER: number;
  MIGRATION_BOOST_MULTIPLIER: number;
  SWORDS_BOOST_MULTIPLIER: number;
  SHIELDS_BOOST_MULTIPLIER: number;
  FREEZE_DAMAGE_PER_STACK: number;
  FREEZE_EFFECT_MULTIPLIER: number;
  POISON_SPIKES_STACKS: number;
  PILLAGE_STACKS: number;
  AGRESSIVE_STACKS: number;
  DEFENSIVE_STACKS: number;
  TROOPS_MAX_HP_BOOST: number;
  TROOPS_STRENGTH_BOOST: number;
  TROOPS_ATTACK_SPEED_BOOST: number;
  TROOPS_MOVE_SPEED_BOOST: number;
  TROOPS_CRITICAL_MULTIPLIER_BOOST: number;
  TROOPS_CRITICAL_CHANCE_BOOST: number;
  RANGED_TROOPS_RANGE_BOOST: number;
  ADDITIONAL_TROOPS_PER_NEW_TROOP: number;
  TROOPS_ADDITIONAL_STEEL_COATS: number;
  NEW_TROOPS_MAX_HP_MULTIPLIER: number;
  NEW_TROOPS_STRENGTH_MULTIPLIER: number;
  NEW_TROOPS_ATTACK_DELAY_MULTIPLIER: number;
  NEW_TROOPS_MOVE_SPEED_MULTIPLIER: number;
  NEW_TROOPS_CRITICAL_MULTIPLIER_MULTIPLIER: number;
  NEW_TROOPS_CRITICAL_CHANCE_MULTIPLIER: number;
  ENEMY_SPIKE_DAMAGE_PERCENTAGE: number;
  EXPLODER_EXPLODE_RANGE_MULTIPLIER: number;
  EXPLODER_ATTACK_STRENGTH_MULTIPLIER: number;
  WIZARD_ATTACK_SPEED_MULTIPLIER: number;
  SHAMAN_ATTACK_STRENGTH_MULTIPLIER: number;
  WARLOCK_ATTACK_AREA_MULTIPLIER: number;
  ADDITIONAL_START_PALADINS: number;
  ARCHER_ATTACK_RANGE_MULTIPLIER: number;
  SOLDIER_OVERALL_STATS_MULTIPLIER: number;
  COST_PER_MERCENARY_DISCOUNT: number;
  THIEF_CRITICAL_MULTIPLIER: number;
  ELF_ATTACK_STRENGTH_MULTIPLIER: number;
  BOAR_HP_MUIPLIER: number;
  LAB_RAT_ADDITIONAL_START_RATS: number;
  DEFENDERS_HP_MULTIPLIER: number;
  EXECUTIONER_ATTACK_STRENGTH_MULTIPLIER: number;
  BALISTA_ADDITIONAL_START_TROOPS: number;
  TRAPPERS_STRENGTH_MULTIPLIER: number;
  DRAGONBORN_STACKS: number;
  DRAGON_ATTACK_STRENGTH_MULTIPLIER: number;
  RAPTOR_ATTACK_STRENGTH_MULTIPLIER: number;
  ADDITIONAL_START_MOBS: number;
  ADDITIONAL_ARCHER_ENEMIES: number;
  EMBALMING_CHANCE: number;
  //WAR_HORNS_BOOST: object;
  SCIMITAR_ENABLED: boolean;
  POWERFUL_WEAK_MAGES: boolean;
  ABRAKADABRA_ENABLED: boolean;
}

export interface BlessingData {
  Name: string;
  Areas: any[];
}