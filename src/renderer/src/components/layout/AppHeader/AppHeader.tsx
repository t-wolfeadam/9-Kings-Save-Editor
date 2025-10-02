import React, { useState, useCallback, useRef } from 'react'
import CalendarStrip from './CalendarStrip'
import WaveEditModal from './WaveEditModal'
import { useGameDataContext } from '../../../contexts/GameDataContext'
import { WaveInfo as WaveData } from '../../../types/GameSaveData'
import styles from './AppHeader.module.scss'

const AppHeader: React.FC = () => {
  const {
    state,
    loadFromFile,
    loadFromFileHandle,
    markChanges,
    updateWaves,
    updateWaveNumber,
    updateSpecialWaveNumber,
    setAutoRefresh,
    saveToFile
  } = useGameDataContext()
  const [editingWave, setEditingWave] = useState<{ wave: WaveData; index: number } | null>(null)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get wave values from game data
  const waves = state.gameData?.WaveData?.Waves || []
  const currentWaveIndex = (state.gameData?.WaveData?.WaveNumber || 1) - 1 // Convert to 0-indexed
  const specialWaveIndex = (state.gameData?.WaveData?.SpecialWaveIndex || 30) - 1 // Convert to 0-indexed

  const handleWaveClick = useCallback((waveIndex: number) => {
    setEditingWave({
      wave: waves[waveIndex],
      index: waveIndex
    })
  }, [waves])

  const handleWaveIndexChange = useCallback((newIndex: number) => {
    updateWaveNumber(newIndex + 1) // Convert from 0-indexed to 1-indexed
  }, [updateWaveNumber])

  const handleWaveUpdate = useCallback((waveIndex: number, newWave: WaveData) => {
    const updatedWaves = [...waves]
    updatedWaves[waveIndex] = newWave
    updateWaves(updatedWaves)
  }, [waves, updateWaves])

  const handleSpecialWaveIndexChange = useCallback((newIndex: number) => {
    updateSpecialWaveNumber(newIndex + 1) // Convert from 0-indexed to 1-indexed
  }, [updateSpecialWaveNumber])

  const handleCloseModal = useCallback(() => {
    setEditingWave(null)
  }, [])

  const handleOpenFileClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Check if File System Access API is supported
  const isFileSystemAccessSupported = 'showOpenFilePicker' in window

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoadingFile(true)
    try {
      await loadFromFile(file)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load file')
    } finally {
      setIsLoadingFile(false)
      // Reset the input so the same file can be selected again
      event.target.value = ''
    }
  }, [loadFromFile])

  const handleOpenFileWithPicker = useCallback(async () => {
    if (!isFileSystemAccessSupported) {
      console.log('File System Access API not supported, falling back to traditional input')
      handleOpenFileClick()
      return
    }

    setIsLoadingFile(true)
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON files',
          accept: {
            'application/json': ['.json']
          }
        }]
      })
      
      await loadFromFileHandle(fileHandle)
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error with File System Access API:', error)
        alert(error instanceof Error ? error.message : 'Failed to load file')
      }
    } finally {
      setIsLoadingFile(false)
    }
  }, [isFileSystemAccessSupported, handleOpenFileClick, loadFromFileHandle])

  const handleAutoRefreshChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setAutoRefresh(checked)
  }, [setAutoRefresh])

  const handleSaveChanges = useCallback(async () => {
    if (!state.gameData) {
      alert('No data to save')
      return
    }

    try {
      if (state.fileHandle) {
        // Save to the existing file handle
        await saveToFile()
      } else {
        // Fallback to download if no file handle available
        const dataStr = JSON.stringify(state.gameData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `GameSnapshot.json`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        URL.revokeObjectURL(url)

        markChanges(false);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save file')
    }
  }, [state.gameData, state.fileHandle, saveToFile])

  return (
    <header className={styles.header}>
      <div className={styles.calendarSection}>
        <CalendarStrip
          waves={waves}
          currentWaveIndex={currentWaveIndex}
          specialWaveIndex={specialWaveIndex}
          onWaveClick={handleWaveClick}
        />
      </div>
      
      <div className={styles.fileControls}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          className={styles.button}
          onClick={isFileSystemAccessSupported ? handleOpenFileWithPicker : handleOpenFileClick}
          disabled={isLoadingFile || state.isLoading}
        >
          {isLoadingFile ? 'Loading...' : 'Open Save File'}
        </button>
        <button
          className={styles.button}
          onClick={handleSaveChanges}
          disabled={!state.gameData || state.isLoading}
        >
          {state.fileHandle ? 'Save' : 'Download'}
          {isFileSystemAccessSupported && state.autoRefresh && state.fileHandle ? ' (Auto)' : ''}
        </button>
        {isFileSystemAccessSupported && (
          <div className={styles.autoRefresh}>
            <input
              type="checkbox"
              id="auto-refresh"
              checked={state.autoRefresh}
              onChange={handleAutoRefreshChange}
            />
            <label htmlFor="auto-refresh">Auto-refresh</label>
          </div>
        )}
      </div>

      <WaveEditModal
        isOpen={editingWave !== null}
        onClose={handleCloseModal}
        wave={editingWave?.wave || null}
        waveIndex={editingWave?.index || 0}
        currentWaveIndex={currentWaveIndex}
        specialWaveIndex={specialWaveIndex}
        onWaveUpdate={handleWaveUpdate}
        onWaveIndexChange={handleWaveIndexChange}
        onSpecialWaveIndexChange={handleSpecialWaveIndexChange}
      />
    </header>
  )
}

export default AppHeader