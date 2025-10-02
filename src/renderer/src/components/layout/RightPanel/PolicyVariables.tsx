import React, { useState, useCallback } from 'react';
import { useGameDataContext } from '../../../contexts/GameDataContext';
import { PolicyVariables as PolicyVariablesType } from '../../../types/GameSaveData';
import styles from './PolicyVariables.module.scss';

interface EditableFieldProps {
  label: string;
  value: number | boolean;
  onChange: (value: number | boolean) => void;
  type: 'number' | 'boolean';
  step?: number;
  min?: number;
  max?: number;
  isDeviated?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  type,
  step = 0.1,
  min,
  max,
  isDeviated = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setTempValue(value.toString());
  }, [value]);

  const handleSave = useCallback(() => {
    if (type === 'boolean') {
      onChange(tempValue === 'true');
    } else {
      const numValue = parseFloat(tempValue);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(numValue, min ?? -Infinity), max ?? Infinity);
        onChange(clampedValue);
      }
    }
    setIsEditing(false);
  }, [tempValue, type, onChange, min, max]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setTempValue(value.toString());
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  return (
    <div className={`${styles.policyVar} ${isDeviated ? styles.deviated : ''}`}>
      <span className={styles.policyLabel}>{label}:</span>
      {isEditing ? (
        <div className={styles.editContainer}>
          {type === 'boolean' ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={styles.editSelect}
              autoFocus
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={styles.editInput}
              step={step}
              min={min}
              max={max}
              autoFocus
            />
          )}
        </div>
      ) : (
        <span 
          className={styles.policyValue}
          onClick={handleStartEdit}
          title="Click to edit"
        >
          {type === 'boolean' ? value.toString() : typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}
        </span>
      )}
    </div>
  );
};

const PolicyVariables: React.FC = () => {
  const { state, updatePolicyVariables } = useGameDataContext();

  if (!state.gameData) {
    return (
      <div className={styles.policyVariables}>
        <div className={styles.placeholder}>
          <span className={styles.placeholderText}>No game data loaded</span>
        </div>
      </div>
    );
  }

  const policyVariables = state.gameData.PolicyVariables;

  const handleUpdateVariable = useCallback((key: keyof PolicyVariablesType, value: number | boolean) => {
    const updatedVariables = {
      ...policyVariables,
      [key]: value
    };
    updatePolicyVariables(updatedVariables);
  }, [policyVariables, updatePolicyVariables]);

  const variableConfigs = [
    {
      key: 'PIT_COINS_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Pit Coins Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'GOLD_PER_AREA_LEVEL_UP' as keyof PolicyVariablesType,
      label: 'Gold Per Area Level Up',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'DEMOLITION_CREW_ENABLED' as keyof PolicyVariablesType,
      label: 'Demolition Crew Enabled',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'BUILDINGS_EFFECT_INCREMENTER' as keyof PolicyVariablesType,
      label: 'Buildings Effect Incrementer',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'TOWERS_STRENGTH_BOOST' as keyof PolicyVariablesType,
      label: 'Towers Strength Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TOWERS_ATTACK_SPEED_BOOST' as keyof PolicyVariablesType,
      label: 'Towers Attack Speed Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TOWERS_MOVE_SPEED_BOOST' as keyof PolicyVariablesType,
      label: 'Towers Move Speed Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TOWERS_CRITICAL_MULTIPLIER_BOOST' as keyof PolicyVariablesType,
      label: 'Towers Critical Multiplier Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TOWERS_CRITICAL_CHANCE_BOOST' as keyof PolicyVariablesType,
      label: 'Towers Critical Chance Boost',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'NEW_BUILDINGS_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Buildings Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_BUILDINGS_ATTACK_DELAY_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Buildings Attack Delay Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_BUILDINGS_MOVE_SPEED_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Buildings Move Speed Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_BUILDINGS_CRITICAL_MULTIPLIER_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Buildings Critical Multiplier Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_BUILDINGS_CRITICAL_CHANCE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Buildings Critical Chance Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'LIBRARY_EFFECT_CHANCE_BOOST' as keyof PolicyVariablesType,
      label: 'Library Effect Chance Boost',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'SPIRE_ADDITIONAL_RAYS' as keyof PolicyVariablesType,
      label: 'Spire Additional Rays',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'SCOUT_TOWER_ADDITIONAL_ARROWS' as keyof PolicyVariablesType,
      label: 'Scout Tower Additional Arrows',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'SPIRE_RAY_COUNT_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Spire Ray Count Multiplier',
      type: 'number' as const,
      baseline: 1
    },
    {
      key: 'MANGLER_ATTACK_AREA_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Mangler Attack Area Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CEMETERY_SUMMONS_HP_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Cemetery Summons Hp Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'DISPENSER_ATTACK_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Dispenser Attack Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'ORCHARD_ADDITIONAL_ROOTS' as keyof PolicyVariablesType,
      label: 'Orchard Additional Roots',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'CONVERTER_ATTACK_SPEED_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Converter Attack Speed Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'WALLS_HP_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Walls Hp Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TREBUCHET_ADDITIONAL_ROCKS' as keyof PolicyVariablesType,
      label: 'Trebuchet Additional Rocks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'FLAMETOWER_ATTACK_AREA_SIZE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Flametower Attack Area Size Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CAULDRON_POISON_ADDITIONAL_STACKS' as keyof PolicyVariablesType,
      label: 'Cauldron Poison Additional Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'WALLS_REFLECT_DAMAGE_STACKS' as keyof PolicyVariablesType,
      label: 'Walls Reflect Damage Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'LIBRARY_ADDITIONAL_START_LEVEL' as keyof PolicyVariablesType,
      label: 'Library Additional Start Level',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'GARRISON_ENABLED' as keyof PolicyVariablesType,
      label: 'Garrison Enabled',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'FRANKENSTEINIAN_ENABLED' as keyof PolicyVariablesType,
      label: 'Frankensteinian Enabled',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'CASTLE_START_MAX_HP_BOOST' as keyof PolicyVariablesType,
      label: 'Castle Start Max Hp Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CASTLE_START_STRENGTH_BOOST' as keyof PolicyVariablesType,
      label: 'Castle Start Strength Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CASTLE_START_MOVE_SPEED_BOOST' as keyof PolicyVariablesType,
      label: 'Castle Start Move Speed Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CASTLE_START_ATTACK_SPEED_BOOST' as keyof PolicyVariablesType,
      label: 'Castle Start Attack Speed Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CASTLE_START_CRITICAL_MULTIPLIER_BOOST' as keyof PolicyVariablesType,
      label: 'Castle Start Critical Multiplier Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CASTLE_START_CRITICAL_CHANCE_BOOST' as keyof PolicyVariablesType,
      label: 'Castle Start Critical Chance Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CASTLE_INSTAKILL_CHANCE' as keyof PolicyVariablesType,
      label: 'Castle Instakill Chance',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'PAGODA_ADDITIONAL_IMPS' as keyof PolicyVariablesType,
      label: 'Pagoda Additional Imps',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'PAGODA_MAX_IMPS_MULTIPLY' as keyof PolicyVariablesType,
      label: 'Pagoda Max Imps Multiply',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'STRONGHOLD_ADDITIONAL_START_LEVEL' as keyof PolicyVariablesType,
      label: 'Stronghold Additional Start Level',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'NOTHING_CASTLE_STONE_ATTACK_RANGE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Nothing Castle Stone Attack Range Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'INGENIOUS_STACKS' as keyof PolicyVariablesType,
      label: 'Ingenious Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'FIREBALL_STACKS' as keyof PolicyVariablesType,
      label: 'Fireball Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'ENT_CAUSES_DAMAGE' as keyof PolicyVariablesType,
      label: 'Ent Causes Damage',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'CRITICAL_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Critical Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'CRITICAL_CHANCE_BOOST' as keyof PolicyVariablesType,
      label: 'Critical Chance Boost',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'SOLITUDE_STACKS' as keyof PolicyVariablesType,
      label: 'Solitude Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'GOLD_PER_9ALLIES' as keyof PolicyVariablesType,
      label: 'Gold Per 9Allies',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'REVITALIZE_STACKS' as keyof PolicyVariablesType,
      label: 'Revitalize Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'WEAKSPOT_STACKS' as keyof PolicyVariablesType,
      label: 'Weakspot Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'NOTHING_CARDS_ATTACK_SPEED_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Nothing Cards Attack Speed Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NATURE_ADDITIONAL_TROOPS' as keyof PolicyVariablesType,
      label: 'Nature Additional Troops',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'PROGRESS_TROOPS_MAX_ADDITIONAL_LEVEL' as keyof PolicyVariablesType,
      label: 'Progress Troops Max Additional Level',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'COINS_PER_LIFE' as keyof PolicyVariablesType,
      label: 'Coins Per Life',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'BLESSING_EFFECT_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Blessing Effect Multiplier',
      type: 'number' as const,
      baseline: 1
    },
    {
      key: 'IMMIGRANT_STACKS' as keyof PolicyVariablesType,
      label: 'Immigrant Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'LONGTERMISM_STACKS' as keyof PolicyVariablesType,
      label: 'Longtermism Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'WISHING_WELL_STACKS' as keyof PolicyVariablesType,
      label: 'Wishing Well Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'VISIONARY_ENABLED' as keyof PolicyVariablesType,
      label: 'Visionary Enabled',
      type: 'boolean' as const,
      baseline: false
    },
    // {
    //   key: 'ADDITIONAL_START_CARDS' as keyof PolicyVariablesType,
    //   label: 'Additional Start Cards',
    //   type: 'object' as const
    // },
    // {
    //   key: 'ADDITIONAL_CARDS_AFTER_LOSING_LIFE' as keyof PolicyVariablesType,
    //   label: 'Additional Cards After Losing Life',
    //   type: 'object' as const
    // },
    {
      key: 'MERCHANT_CARDS_BOUGHT' as keyof PolicyVariablesType,
      label: 'Merchant Cards Bought',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'SHOP_CARD_COST_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Shop Card Cost Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'DECREE_EXTRA_OPTIONS' as keyof PolicyVariablesType,
      label: 'Decree Extra Options',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'FREE_REROLLS' as keyof PolicyVariablesType,
      label: 'Free Rerolls',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'FREE_PERSISTENT_REROLLS' as keyof PolicyVariablesType,
      label: 'Free Persistent Rerolls',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'FREE_MERCHANT_CARDS' as keyof PolicyVariablesType,
      label: 'Free Merchant Cards',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'PAYROLL_STACKS' as keyof PolicyVariablesType,
      label: 'Payroll Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'TINKERING_ENABLED' as keyof PolicyVariablesType,
      label: 'Tinkering Enabled',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'MARKETPLACE_ENABLED' as keyof PolicyVariablesType,
      label: 'Marketplace Enabled',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'OVERHAUL_USES' as keyof PolicyVariablesType,
      label: 'Overhaul Uses',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'STATIC_ADDITIONAL_RAW_STRENGTH' as keyof PolicyVariablesType,
      label: 'Static Additional Raw Strength',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'VENOM_POLICY_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Venom Policy Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'AREA_DAMAGE_SIZE_BOOST' as keyof PolicyVariablesType,
      label: 'Area Damage Size Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TRAPPERS_TRAP_DAMAGE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Trappers Trap Damage Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'MOTHERSHIP_ATTACK_RANGE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Mothership Attack Range Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'RAINBOW_CHANCE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Rainbow Chance Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'DOUBLE_THUNDERS_STACKS' as keyof PolicyVariablesType,
      label: 'Double Thunders Stacks',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'CARNAGE_AREA_SIZE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Carnage Area Size Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'OVERINVEST_ADDITIONAL_BOOST_PERCENTAGE' as keyof PolicyVariablesType,
      label: 'Overinvest Additional Boost Percentage',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'MORTGAGE_ADDITIONAL_GOLD' as keyof PolicyVariablesType,
      label: 'Mortgage Additional Gold',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'POISON_ENEMY_DELAY_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Poison Enemy Delay Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'LIFE_STEAL_SPELLS_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Life Steal Spells Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'MIGRATION_BOOST_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Migration Boost Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'SWORDS_BOOST_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Swords Boost Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'SHIELDS_BOOST_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Shields Boost Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'FREEZE_DAMAGE_PER_STACK' as keyof PolicyVariablesType,
      label: 'Freeze Damage Per Stack',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'FREEZE_EFFECT_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Freeze Effect Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'POISON_SPIKES_STACKS' as keyof PolicyVariablesType,
      label: 'Poison Spikes Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'PILLAGE_STACKS' as keyof PolicyVariablesType,
      label: 'Pillage Stacks',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'AGRESSIVE_STACKS' as keyof PolicyVariablesType,
      label: 'Agressive Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'DEFENSIVE_STACKS' as keyof PolicyVariablesType,
      label: 'Defensive Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'TROOPS_MAX_HP_BOOST' as keyof PolicyVariablesType,
      label: 'Troops Max Hp Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TROOPS_STRENGTH_BOOST' as keyof PolicyVariablesType,
      label: 'Troops Strength Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TROOPS_ATTACK_SPEED_BOOST' as keyof PolicyVariablesType,
      label: 'Troops Attack Speed Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TROOPS_MOVE_SPEED_BOOST' as keyof PolicyVariablesType,
      label: 'Troops Move Speed Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TROOPS_CRITICAL_MULTIPLIER_BOOST' as keyof PolicyVariablesType,
      label: 'Troops Critical Multiplier Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'TROOPS_CRITICAL_CHANCE_BOOST' as keyof PolicyVariablesType,
      label: 'Troops Critical Chance Boost',
      type: 'number' as const,
      baseline: 0.0
    },
    {
      key: 'RANGED_TROOPS_RANGE_BOOST' as keyof PolicyVariablesType,
      label: 'Ranged Troops Range Boost',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'ADDITIONAL_TROOPS_PER_NEW_TROOP' as keyof PolicyVariablesType,
      label: 'Additional Troops Per New Troop',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'TROOPS_ADDITIONAL_STEEL_COATS' as keyof PolicyVariablesType,
      label: 'Troops Additional Steel Coats',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'NEW_TROOPS_MAX_HP_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Troops Max Hp Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_TROOPS_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Troops Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_TROOPS_ATTACK_DELAY_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Troops Attack Delay Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_TROOPS_MOVE_SPEED_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Troops Move Speed Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_TROOPS_CRITICAL_MULTIPLIER_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Troops Critical Multiplier Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'NEW_TROOPS_CRITICAL_CHANCE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'New Troops Critical Chance Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'ENEMY_SPIKE_DAMAGE_PERCENTAGE' as keyof PolicyVariablesType,
      label: 'Enemy Spike Damage Percentage',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'EXPLODER_EXPLODE_RANGE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Exploder Explode Range Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'EXPLODER_ATTACK_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Exploder Attack Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'WIZARD_ATTACK_SPEED_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Wizard Attack Speed Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'SHAMAN_ATTACK_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Shaman Attack Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'WARLOCK_ATTACK_AREA_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Warlock Attack Area Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'ADDITIONAL_START_PALADINS' as keyof PolicyVariablesType,
      label: 'Additional Start Paladins',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'ARCHER_ATTACK_RANGE_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Archer Attack Range Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'SOLDIER_OVERALL_STATS_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Soldier Overall Stats Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'COST_PER_MERCENARY_DISCOUNT' as keyof PolicyVariablesType,
      label: 'Cost Per Mercenary Discount',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'THIEF_CRITICAL_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Thief Critical Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'ELF_ATTACK_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Elf Attack Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'BOAR_HP_MUIPLIER' as keyof PolicyVariablesType,
      label: 'Boar Hp Muiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'LAB_RAT_ADDITIONAL_START_RATS' as keyof PolicyVariablesType,
      label: 'Lab Rat Additional Start Rats',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'DEFENDERS_HP_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Defenders Hp Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'EXECUTIONER_ATTACK_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Executioner Attack Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'BALISTA_ADDITIONAL_START_TROOPS' as keyof PolicyVariablesType,
      label: 'Balista Additional Start Troops',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'TRAPPERS_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Trappers Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'DRAGONBORN_STACKS' as keyof PolicyVariablesType,
      label: 'Dragonborn Stacks',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'DRAGON_ATTACK_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Dragon Attack Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'RAPTOR_ATTACK_STRENGTH_MULTIPLIER' as keyof PolicyVariablesType,
      label: 'Raptor Attack Strength Multiplier',
      type: 'number' as const,
      baseline: 1.0
    },
    {
      key: 'ADDITIONAL_START_MOBS' as keyof PolicyVariablesType,
      label: 'Additional Start Mobs',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'ADDITIONAL_ARCHER_ENEMIES' as keyof PolicyVariablesType,
      label: 'Additional Archer Enemies',
      type: 'number' as const,
      baseline: 0
    },
    {
      key: 'EMBALMING_CHANCE' as keyof PolicyVariablesType,
      label: 'Embalming Chance',
      type: 'number' as const,
      baseline: 1.0
    },
    // {
    //   key: 'WAR_HORNS_BOOST' as keyof PolicyVariablesType,
    //   label: 'War Horns Boost',
    //   type: 'object' as const
    // },
    {
      key: 'SCIMITAR_ENABLED' as keyof PolicyVariablesType,
      label: 'Scimitar Enabled',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'POWERFUL_WEAK_MAGES' as keyof PolicyVariablesType,
      label: 'Powerful Weak Mages',
      type: 'boolean' as const,
      baseline: false
    },
    {
      key: 'ABRAKADABRA_ENABLED' as keyof PolicyVariablesType,
      label: 'Abrakadabra Enabled',
      type: 'boolean' as const,
      baseline: false
    }
  ];

  return (
    <div className={styles.policyVariables}>
      <div className={styles.variablesGrid}>
        {variableConfigs.map(({ key, label, type, baseline }) => {
          const currentValue = policyVariables[key];
          const isDeviated = baseline !== undefined && currentValue !== baseline;
          
          return (
            <EditableField
              key={key}
              label={label}
              value={currentValue}
              onChange={(value) => handleUpdateVariable(key, value)}
              type={type}
              isDeviated={isDeviated}
            />
          );
        })}
      </div>
      
    </div>
  );
};

export default PolicyVariables;