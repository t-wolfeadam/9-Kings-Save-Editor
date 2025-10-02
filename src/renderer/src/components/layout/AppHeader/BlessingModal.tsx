import React, { useState, useEffect } from 'react'
import Modal from '../../../components/common/Modal/Modal'
import { useGameDataContext } from '../../../contexts/GameDataContext'
import styles from './BlessingModal.module.scss'
import { im } from '@renderer/utils/image'

interface BlessingModalProps {
  isOpen: boolean
  onClose: () => void
  onBlessingSelect?: (blessingType: number) => void
  selectedType?: number
}

interface GridSquare {
  x: number
  y: number
  selected: boolean
}

const BlessingModal: React.FC<BlessingModalProps> = ({
  isOpen,
  onClose,
  onBlessingSelect,
  selectedType
}) => {
  const { state, updateBlessing } = useGameDataContext()
  const [currentBlessingType, setCurrentBlessingType] = useState<number>(selectedType ?? 0)
  const [selectedAreas, setSelectedAreas] = useState<GridSquare[]>([])

  // Initialize grid squares (5x5 grid, center is 0,0)
  const initializeGrid = (): GridSquare[] => {
    const squares: GridSquare[] = []
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        squares.push({ x, y, selected: false })
      }
    }
    return squares
  }

  // Load existing blessing data when modal opens
  useEffect(() => {
    if (isOpen) {
      const existingData = (state.gameData as any)?.Blessing
      
      if (existingData) {
        // Load existing blessing type from game data
        const existingName = existingData.Name
        let blessingType = 0 // default to Baby Boom
        
        // Map blessing name back to type number
        const nameToType: { [key: string]: number } = {
          'Baby Boom': 0,
          'Illuminism': 1,
          'Zenith': 2,
          'Peacetime': 3,
          'Prosperity': 4
        }
        
        if (existingName && nameToType[existingName] !== undefined) {
          blessingType = nameToType[existingName]
        }
        setCurrentBlessingType(blessingType)
        
        // Load existing areas
        const existingAreas = existingData.Areas || []
        const grid = initializeGrid()
        
        // Mark existing areas as selected
        existingAreas.forEach((area: any) => {
          const square = grid.find(s => s.x === area.x && s.y === area.y)
          if (square) square.selected = true
        })
        
        setSelectedAreas(grid)
      } else {
        // No existing data - use defaults
        setCurrentBlessingType(selectedType ?? 0)
        setSelectedAreas(initializeGrid())
      }
    }
  }, [isOpen, state.gameData?.Blessing, (state.gameData as any)?.Blessing, selectedType])
  const blessingTypes = [0, 1, 2, 3, 4]

  const getBlessingIcon = (type: number) => {
    return im(`./assets/Blessing_0${type}.png`)
  }

  const getBlessingDescription = (type: number) => {
    const descriptions = {
      0: 'Baby Boom',
      1: 'Illuminism',
      2: 'Zenith',
      3: 'Peacetime',
      4: 'Prosperity'
    }
    return descriptions[type as keyof typeof descriptions] || `Blessing ${type}`
  }

  const handleBlessingSelect = (type: number) => {
    setCurrentBlessingType(type)
    // Don't call onBlessingSelect here to avoid it closing the modal; handled internally on save button
  }

  const toggleGridSquare = (targetX: number, targetY: number) => {
    setSelectedAreas(prev =>
      prev.map(square =>
        square.x === targetX && square.y === targetY
          ? { ...square, selected: !square.selected }
          : square
      )
    )
  }

  // Convert grid position to isometric display position
  const getIsometricPosition = (x: number, y: number) => {
    // Isometric transformation: rotate 45 degrees, scale, and add spacings
    const isoX = (x - y) * 30 
    const isoY = (x + y) * 15 
    return { x: isoX, y: isoY }
  }

  const handleSave = () => {
    if (!state.gameData) return
    
    const selectedSquares = selectedAreas.filter(square => square.selected)
    const areas = selectedSquares.map(square => ({ x: square.x, y: square.y }))
    
    const blessingData = {
      Name: getBlessingDescription(currentBlessingType),
      Areas: areas
    }
    
    console.log('Saving blessing data:', blessingData) // Debug log
    updateBlessing(blessingData)
    
    // Call the original onBlessingSelect if provided, to update external state
    if (onBlessingSelect) {
      onBlessingSelect(currentBlessingType)
    }
    
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Blessing Type"
      size="medium"
    >
      <div className={styles.blessingEditor}>
        <p className={styles.description}>
          Choose the specific type of blessing to enact:
        </p>
        
        <div className={styles.blessingGrid}>
          {blessingTypes.map((type) => (
            <div
              key={type}
              className={`${styles.blessingOption} ${
                currentBlessingType === type ? styles.selected : ''
              }`}
              onClick={() => handleBlessingSelect(type)}
            >
              <img
                src={getBlessingIcon(type)}
                alt={`Blessing ${type}`}
                className={styles.blessingImage}
              />
              <span className={styles.blessingLabel}>
                {getBlessingDescription(type)}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.gridSection}>
          <p className={styles.gridDescription}>
            Select areas to be affected by the blessing:
          </p>
          
          <div className={styles.isometricContainer}>
            <div className={styles.isometricGrid}>
              {selectedAreas.map((square, ) => {
                const isoPos = getIsometricPosition(square.x, square.y)
                return (
                  <div
                    key={`${square.x}-${square.y}`}
                    className={`${styles.gridSquare} ${
                      square.selected ? styles.selected : ''
                    }`}
                    style={{
                      left: `calc(50% + ${isoPos.x}px)`,
                      top: `calc(50% + ${isoPos.y}px)`,
                    }}
                    onClick={() => toggleGridSquare(square.x, square.y)}
                    title={`Position (${square.x}, ${square.y})`}
                  />
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!state.gameData}
          >
            Save Blessing
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BlessingModal