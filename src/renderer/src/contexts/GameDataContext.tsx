import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo, useRef, useEffect } from 'react';
import { GameSaveData, AreaData, PolicyVariables, PolicyData, WaveData, WaveInfo, PlayableKingType, BlessingData } from '../types/GameSaveData';

// State interface
interface GameDataState {
  gameData: GameSaveData | null;
  isLoading: boolean;
  hasChanges: boolean;
  fileHandle: FileSystemFileHandle | null;
  autoRefresh: boolean;
  isMonitoring: boolean;
}

// Action types
type GameDataAction =
  | { type: 'LOAD_GAME_DATA'; payload: GameSaveData }
  | { type: 'UPDATE_AREA'; payload: { index: number; area: AreaData } }
  | { type: 'UPDATE_POLICY_VARIABLES'; payload: PolicyVariables }
  | { type: 'UPDATE_POLICY'; payload: { index: number; policy: PolicyData } }
  | { type: 'ADD_POLICY'; payload: PolicyData }
  | { type: 'REMOVE_POLICY'; payload: number }
  | { type: 'UPDATE_AREAS'; payload: AreaData[] }
  | { type: 'UPDATE_WAVE_DATA'; payload: Partial<WaveData> }
  | { type: 'UPDATE_WAVES'; payload: WaveInfo[] }
  | { type: 'UPDATE_WAVE_NUMBER'; payload: number }
  | { type: 'UPDATE_SPECIAL_WAVE_NUMBER'; payload: number }
  | { type: 'UPDATE_KINGS'; payload: { PlayerKing?: PlayableKingType; EnemyKings?: PlayableKingType[] } }
  | { type: 'UPDATE_HAND_CARDS'; payload: string[] }
  | { type: 'UPDATE_BLESSING'; payload: BlessingData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'MARK_CHANGES'; payload: boolean }
  | { type: 'RESET_GAME_DATA' }
  | { type: 'LOAD_FROM_FILE'; payload: GameSaveData }
  | { type: 'SET_FILE_HANDLE'; payload: FileSystemFileHandle | null }
  | { type: 'SET_AUTO_REFRESH'; payload: boolean }
  | { type: 'SET_MONITORING'; payload: boolean };

// Initial state
const initialState: GameDataState = {
  gameData: null,
  isLoading: false,
  hasChanges: false,
  fileHandle: null,
  autoRefresh: true,
  isMonitoring: false
};

// Reducer function
function gameDataReducer(state: GameDataState, action: GameDataAction): GameDataState {
  switch (action.type) {
    case 'LOAD_GAME_DATA':
      return {
        ...state,
        gameData: action.payload,
        isLoading: false,
        hasChanges: false
      };

    case 'UPDATE_AREA':
      if (!state.gameData) return state;
      const updatedAreas = [...state.gameData.Areas];
      updatedAreas[action.payload.index] = action.payload.area;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          Areas: updatedAreas
        },
        hasChanges: true
      };

    case 'UPDATE_AREAS':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          Areas: action.payload
        },
        hasChanges: true
      };

    case 'UPDATE_POLICY_VARIABLES':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          PolicyVariables: action.payload
        },
        hasChanges: true
      };

    case 'UPDATE_POLICY':
      if (!state.gameData) return state;
      const updatedPolicies = [...state.gameData.Policies.Policies];
      updatedPolicies[action.payload.index] = action.payload.policy;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          Policies: {
            ...state.gameData.Policies,
            Policies: updatedPolicies
          }
        },
        hasChanges: true
      };

    case 'ADD_POLICY':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          Policies: {
            ...state.gameData.Policies,
            Policies: [...state.gameData.Policies.Policies, action.payload]
          }
        },
        hasChanges: true
      };

    case 'REMOVE_POLICY':
      if (!state.gameData) return state;
      const filteredPolicies = state.gameData.Policies.Policies.filter((_, index) => index !== action.payload);
      return {
        ...state,
        gameData: {
          ...state.gameData,
          Policies: {
            ...state.gameData.Policies,
            Policies: filteredPolicies
          }
        },
        hasChanges: true
      };

    case 'UPDATE_WAVE_DATA':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          WaveData: {
            ...state.gameData.WaveData,
            ...action.payload
          }
        },
        hasChanges: true
      };

    case 'UPDATE_WAVES':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          WaveData: {
            ...state.gameData.WaveData,
            Waves: action.payload
          }
        },
        hasChanges: true
      };

    case 'UPDATE_WAVE_NUMBER':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          WaveData: {
            ...state.gameData.WaveData,
            WaveNumber: action.payload
          }
        },
        hasChanges: true
      };

    case 'UPDATE_SPECIAL_WAVE_NUMBER':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          WaveData: {
            ...state.gameData.WaveData,
            SpecialWaveIndex: action.payload
          }
        },
        hasChanges: true
      };

    case 'UPDATE_KINGS':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          Kings: {
            ...state.gameData.Kings,
            ...action.payload
          }
        },
        hasChanges: true
      };

    case 'UPDATE_HAND_CARDS':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          HandCards: {
            Cards: action.payload
          }
        },
        hasChanges: true
      };

    case 'UPDATE_BLESSING':
      if (!state.gameData) return state;
      return {
        ...state,
        gameData: {
          ...state.gameData,
          Blessing: action.payload
        },
        hasChanges: true
      };

    case 'LOAD_FROM_FILE':
      return {
        ...state,
        gameData: action.payload,
        isLoading: false,
        hasChanges: false
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'MARK_CHANGES':
      return {
        ...state,
        hasChanges: action.payload
      };

    case 'SET_FILE_HANDLE':
      return {
        ...state,
        fileHandle: action.payload
      };

    case 'SET_AUTO_REFRESH':
      return {
        ...state,
        autoRefresh: action.payload
      };

    case 'SET_MONITORING':
      return {
        ...state,
        isMonitoring: action.payload
      };

    case 'RESET_GAME_DATA':
      return {
        ...initialState,
        autoRefresh: state.autoRefresh  // Keep auto-refresh setting
      };

    default:
      return state;
  }
}

// Context interface
interface GameDataContextType {
  state: GameDataState;
  dispatch: React.Dispatch<GameDataAction>;
  // Helper functions
  loadGameData: (data: GameSaveData) => void;
  loadFromFile: (file: File) => Promise<void>;
  loadFromFileHandle: (fileHandle: FileSystemFileHandle) => Promise<void>;
  updateArea: (index: number, area: AreaData) => void;
  updateAreas: (areas: AreaData[]) => void;
  updatePolicyVariables: (variables: PolicyVariables) => void;
  updatePolicy: (index: number, policy: PolicyData) => void;
  addPolicy: (policy: PolicyData) => void;
  removePolicy: (index: number) => void;
  updateWaveData: (data: Partial<WaveData>) => void;
  updateWaves: (waves: WaveInfo[]) => void;
  updateWaveNumber: (waveNumber: number) => void;
  updateSpecialWaveNumber: (waveNumber: number) => void;
  updateKings: (kings: { PlayerKing?: PlayableKingType; EnemyKings?: PlayableKingType[] }) => void;
  updateHandCards: (cards: string[]) => void;
  updateBlessing: (blessingData: BlessingData) => void;
  setLoading: (loading: boolean) => void;
  markChanges: (hasChanges: boolean) => void;
  resetGameData: () => void;
  setFileHandle: (handle: FileSystemFileHandle | null) => void;
  setAutoRefresh: (enabled: boolean) => void;
  setMonitoring: (monitoring: boolean) => void;
  saveToFile: () => Promise<void>;
  startFileMonitoring: () => void;
  stopFileMonitoring: () => void;
  // Computed values
  areaStatistics: {
    totalCards: number;
    totalTroops: number;
    averageLevel: number;
    powerRating: number;
    unlockedPlots: number;
    occupiedPlots: number;
    plotHoles: number;
  } | null;
  policyEffects: Record<string, number>;
}

// Create context
const GameDataContext = createContext<GameDataContextType | undefined>(undefined);

// Provider component
export const GameDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameDataReducer, initialState);
  const fileMonitorIntervalRef = useRef<number | null>(null);
  const lastFileModifiedRef = useRef<number>(0);
  const currentStateRef = useRef(state);
  
  // Check if File System Access API is supported
  const isFileSystemAccessSupported = typeof window !== 'undefined' && 'showOpenFilePicker' in window;
  
  // Keep current state ref updated
  useEffect(() => {
    currentStateRef.current = state;
  }, [state]);

  // Helper functions - memoized to prevent infinite re-renders
  const loadGameData = useCallback((data: GameSaveData) => {
    dispatch({ type: 'LOAD_GAME_DATA', payload: data });
  }, []);

  const loadFromFile = useCallback(async (file: File): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const text = await file.text();
      const data = JSON.parse(text) as GameSaveData;
      
      // Sort areas for consistent ordering
      if (data.Areas) {
        data.Areas.sort((a1, a2) =>
          ((a1.YCoordinate + 2) * 5 + (a1.XCoordinate + 2)) -
          ((a2.YCoordinate + 2) * 5 + (a2.XCoordinate + 2))
        );
      }
      
      dispatch({ type: 'LOAD_FROM_FILE', payload: data });
    } catch (error) {
      console.error('Error loading file:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error('Failed to parse save file. Please ensure it is a valid JSON file.');
    }
  }, []);

  const loadFromFileHandle = useCallback(async (fileHandle: FileSystemFileHandle): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const file = await fileHandle.getFile();
      const text = await file.text();
      const data = JSON.parse(text) as GameSaveData;
      
      // Sort areas for consistent ordering
      if (data.Areas) {
        data.Areas.sort((a1, a2) =>
          ((a1.YCoordinate + 2) * 5 + (a1.XCoordinate + 2)) -
          ((a2.YCoordinate + 2) * 5 + (a2.XCoordinate + 2))
        );
      }
      
      dispatch({ type: 'LOAD_FROM_FILE', payload: data });
      dispatch({ type: 'SET_FILE_HANDLE', payload: fileHandle });
      lastFileModifiedRef.current = file.lastModified;
    } catch (error) {
      console.error('Error loading file from handle:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error('Failed to parse save file. Please ensure it is a valid JSON file.');
    }
  }, []);

  const updateArea = useCallback((index: number, area: AreaData) => {
    dispatch({ type: 'UPDATE_AREA', payload: { index, area } });
  }, []);

  const updateAreas = useCallback((areas: AreaData[]) => {
    dispatch({ type: 'UPDATE_AREAS', payload: areas });
  }, []);

  const updatePolicyVariables = useCallback((variables: PolicyVariables) => {
    dispatch({ type: 'UPDATE_POLICY_VARIABLES', payload: variables });
  }, []);

  const updatePolicy = useCallback((index: number, policy: PolicyData) => {
    dispatch({ type: 'UPDATE_POLICY', payload: { index, policy } });
  }, []);

  const addPolicy = useCallback((policy: PolicyData) => {
    dispatch({ type: 'ADD_POLICY', payload: policy });
  }, []);

  const removePolicy = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_POLICY', payload: index });
  }, []);

  const updateWaveData = useCallback((data: Partial<WaveData>) => {
    dispatch({ type: 'UPDATE_WAVE_DATA', payload: data });
  }, []);

  const updateWaves = useCallback((waves: WaveInfo[]) => {
    dispatch({ type: 'UPDATE_WAVES', payload: waves });
  }, []);

  const updateWaveNumber = useCallback((waveNumber: number) => {
    dispatch({ type: 'UPDATE_WAVE_NUMBER', payload: waveNumber });
  }, []);

  const updateSpecialWaveNumber = useCallback((waveNumber: number) => {
    dispatch({ type: 'UPDATE_SPECIAL_WAVE_NUMBER', payload: waveNumber });
  }, []);

  const updateKings = useCallback((kings: { PlayerKing?: PlayableKingType; EnemyKings?: PlayableKingType[] }) => {
    dispatch({ type: 'UPDATE_KINGS', payload: kings });
  }, []);

  const updateHandCards = useCallback((cards: string[]) => {
    dispatch({ type: 'UPDATE_HAND_CARDS', payload: cards });
  }, []);

  const updateBlessing = useCallback((blessingData: BlessingData) => {
    dispatch({ type: 'UPDATE_BLESSING', payload: blessingData });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const markChanges = useCallback((hasChanges: boolean) => {
    dispatch({ type: 'MARK_CHANGES', payload: hasChanges });
  }, []);

  const resetGameData = useCallback(() => {
    dispatch({ type: 'RESET_GAME_DATA' });
  }, []);

  const setFileHandle = useCallback((handle: FileSystemFileHandle | null) => {
    dispatch({ type: 'SET_FILE_HANDLE', payload: handle });
  }, []);

  const setAutoRefresh = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_REFRESH', payload: enabled });
  }, []);

  const setMonitoring = useCallback((monitoring: boolean) => {
    dispatch({ type: 'SET_MONITORING', payload: monitoring });
  }, []);

  const saveToFile = useCallback(async (): Promise<void> => {
    console.log('saveToFile called:', {
      hasGameData: !!state.gameData,
      hasFileHandle: !!state.fileHandle
    });
    
    if (!state.gameData || !state.fileHandle) {
      throw new Error('No data or file handle available');
    }

    try {
      console.log('Writing to file...');
      const dataStr = JSON.stringify(state.gameData, null, 2);
      const writable = await state.fileHandle.createWritable();
      await writable.write(dataStr);
      await writable.close();
      console.log('File written successfully');
      dispatch({ type: 'MARK_CHANGES', payload: false });
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file');
    }
  }, [state.gameData, state.fileHandle]);

  // Remove checkFileChanges - it's now inline in startFileMonitoring to avoid dependency cycles

  const startFileMonitoring = useCallback(() => {
    console.log('startFileMonitoring called');
    
    if (fileMonitorIntervalRef.current || currentStateRef.current.isMonitoring) {
      console.log('startFileMonitoring: already monitoring');
      return;
    }

    console.log('startFileMonitoring: starting interval...');
    dispatch({ type: 'SET_MONITORING', payload: true });
    fileMonitorIntervalRef.current = window.setInterval(() => {
      const currentState = currentStateRef.current;
      
      // Use current state via ref
      if (!currentState.fileHandle || !currentState.autoRefresh) {
        console.log('checkFileChanges: skipping', {
          hasFileHandle: !!currentState.fileHandle,
          autoRefresh: currentState.autoRefresh
        });
        return;
      }

      console.log('checkFileChanges: checking file...');
      currentState.fileHandle.getFile().then(file => {
        console.log('checkFileChanges: file lastModified', file.lastModified, 'vs stored', lastFileModifiedRef.current);
        
        if (file.lastModified > lastFileModifiedRef.current) {
          console.log('checkFileChanges: file changed detected');
          lastFileModifiedRef.current = file.lastModified;
          
          // Only reload if we don't have pending changes
          if (!currentState.hasChanges) {
            console.log('checkFileChanges: loading updated file data...');
            file.text().then(text => {
              const data = JSON.parse(text) as GameSaveData;
              
              // Sort areas for consistent ordering
              if (data.Areas) {
                data.Areas.sort((a1, a2) =>
                  ((a1.YCoordinate + 2) * 5 + (a1.XCoordinate + 2)) -
                  ((a2.YCoordinate + 2) * 5 + (a2.XCoordinate + 2))
                );
              }
              
              console.log('checkFileChanges: dispatching updated data');
              dispatch({ type: 'LOAD_FROM_FILE', payload: data });
            });
          } else {
            console.log('checkFileChanges: skipping reload due to pending changes');
          }
        }
      }).catch(error => {
        console.error('Error checking file changes:', error);
      });
    }, 1000);
  }, []); // No dependencies - we use refs for current values

  const stopFileMonitoring = useCallback(() => {
    console.log('stopFileMonitoring called');
    if (fileMonitorIntervalRef.current) {
      clearInterval(fileMonitorIntervalRef.current);
      fileMonitorIntervalRef.current = null;
    }
    dispatch({ type: 'SET_MONITORING', payload: false });
  }, []);

  // Auto-save when data changes and auto-refresh is enabled (only if File System Access API is supported)
  useEffect(() => {
    if (!isFileSystemAccessSupported) {
      console.log('AutoSave: File System Access API not supported, skipping auto-save');
      return;
    }
    
    // console.log('AutoSave effect:', {
    //   hasChanges: state.hasChanges,
    //   autoRefresh: state.autoRefresh,
    //   hasFileHandle: !!state.fileHandle,
    //   hasGameData: !!state.gameData
    // });
    
    if (state.hasChanges && state.autoRefresh && state.fileHandle && state.gameData) {
      // console.log('Scheduling auto-save...');
      const autoSave = async () => {
        try {
          // console.log('Executing auto-save...');
          await saveToFile();
          // console.log('Auto-save completed');
        } catch (error) {
          // console.error('Auto-save failed:', error);
        }
      };
      
      const timeoutId = setTimeout(autoSave, 500); // Debounce auto-save
      return () => clearTimeout(timeoutId);
    }
    return;
  }, [state.hasChanges, state.autoRefresh, state.fileHandle, state.gameData, saveToFile, isFileSystemAccessSupported]);

  // Start/stop monitoring based on auto-refresh and file handle (only if File System Access API is supported)
  useEffect(() => {
    if (!isFileSystemAccessSupported) {
      console.log('FileMonitoring: File System Access API not supported, skipping file monitoring');
      return;
    }
    
    console.log('FileMonitoring effect:', {
      autoRefresh: state.autoRefresh,
      hasFileHandle: !!state.fileHandle,
      isMonitoring: state.isMonitoring
    });
    
    if (state.autoRefresh && state.fileHandle && !state.isMonitoring) {
      console.log('Starting file monitoring...');
      startFileMonitoring();
    } else if ((!state.autoRefresh || !state.fileHandle) && state.isMonitoring) {
      console.log('Stopping file monitoring...', {
        autoRefresh: state.autoRefresh,
        hasFileHandle: !!state.fileHandle
      });
      stopFileMonitoring();
    }

    return () => {
      if (state.isMonitoring) {
        stopFileMonitoring();
      }
    };
  }, [state.autoRefresh, state.fileHandle, state.isMonitoring, startFileMonitoring, stopFileMonitoring, isFileSystemAccessSupported]);

  // Computed area statistics
  const areaStatistics = useMemo(() => {
    if (!state.gameData) return null;

    const areas = state.gameData.Areas;
    const unlockedAreas = areas.filter(area => area.IsUnlocked);
    const occupiedAreas = areas.filter(area => area.IsUnlocked && area.PlacedCardName);
    const plotHoles = areas.filter(area => area.PlotHoleEnabled).length;

    const totalTroops = occupiedAreas.reduce((sum, area) => sum + area.TroopQuantity, 0);
    const totalLevel = occupiedAreas.reduce((sum, area) => sum + area.CardLevel, 0);
    const averageLevel = occupiedAreas.length > 0 ? totalLevel / occupiedAreas.length : 0;

    // Simple power rating calculation based on stats
    const powerRating = occupiedAreas.reduce((sum, area) => {
      const stats = area.Stats;
      return sum + (stats.MaxHP * stats.Strength * (1 + stats.CritChance * stats.CritMultiplier));
    }, 0);

    return {
      totalCards: occupiedAreas.length,
      totalTroops,
      averageLevel,
      powerRating: Math.round(powerRating),
      unlockedPlots: unlockedAreas.length,
      occupiedPlots: occupiedAreas.length,
      plotHoles
    };
  }, [state.gameData]);

  // Computed policy effects
  const policyEffects = useMemo(() => {
    if (!state.gameData) return {};

    const effects: Record<string, number> = {};
    state.gameData.Policies.Policies.forEach(policy => {
      effects[policy.Name] = policy.Stacks;
    });

    return effects;
  }, [state.gameData]);

  // Memoize the context value to prevent unnecessary re-renders
  const value: GameDataContextType = useMemo(() => ({
    state,
    dispatch,
    loadGameData,
    loadFromFile,
    loadFromFileHandle,
    updateArea,
    updateAreas,
    updatePolicyVariables,
    updatePolicy,
    addPolicy,
    removePolicy,
    updateWaveData,
    updateWaves,
    updateWaveNumber,
    updateSpecialWaveNumber,
    updateKings,
    updateHandCards,
    updateBlessing,
    setLoading,
    markChanges,
    resetGameData,
    setFileHandle,
    setAutoRefresh,
    setMonitoring,
    saveToFile,
    startFileMonitoring,
    stopFileMonitoring,
    areaStatistics,
    policyEffects
  }), [
    state,
    loadGameData,
    loadFromFile,
    loadFromFileHandle,
    updateArea,
    updateAreas,
    updatePolicyVariables,
    updatePolicy,
    addPolicy,
    removePolicy,
    updateWaveData,
    updateWaves,
    updateWaveNumber,
    updateSpecialWaveNumber,
    updateKings,
    updateHandCards,
    updateBlessing,
    setLoading,
    markChanges,
    resetGameData,
    setFileHandle,
    setAutoRefresh,
    setMonitoring,
    saveToFile,
    startFileMonitoring,
    stopFileMonitoring,
    areaStatistics,
    policyEffects
  ]);

  return (
    <GameDataContext.Provider value={value}>
      {children}
    </GameDataContext.Provider>
  );
};

// Custom hook to use the game data context
export const useGameDataContext = (): GameDataContextType => {
  const context = useContext(GameDataContext);
  if (context === undefined) {
    throw new Error('useGameDataContext must be used within a GameDataProvider');
  }
  return context;
};

export default GameDataContext;