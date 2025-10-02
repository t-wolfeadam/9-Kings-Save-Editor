import React, { useState, useEffect } from 'react'
import styles from './CurrencyDisplay.module.scss'
import { useGameDataContext } from '../../../contexts/GameDataContext'
import { im } from '@renderer/utils/image'

interface CurrencyDisplayProps {
  currency: number
  onChange: (value: number) => void
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ currency, onChange }) => {
  const [value, setValue] = useState<string>(currency.toString())
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const ctx = useGameDataContext();

  useEffect(() => {
    setValue(currency.toString())
  }, [currency])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Allow empty string for editing, or valid numbers
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setValue(newValue)
    }
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    const adjustedValue = Math.max(0, parseInt(value) || 0)
    setValue(adjustedValue.toString())
    onChange(adjustedValue)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    } else if (e.key === 'Escape') {
      setValue(currency.toString())
      setIsEditing(false)
    }
  }

  const handleClick = () => {
    setIsEditing(true)
  }

  return (
    <div className={styles.currencyDisplay}>
      <img src={im("./assets/Coin.png")} alt="Coin" className={styles.coinIcon} />
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className={styles.coinInput}
          autoFocus
          placeholder="0"
        />
      ) : (
        <span 
          className={styles.coinAmount} 
          onClick={ctx.state.gameData ? handleClick : undefined}
          title="Click to edit currency"
        >
          {currency}
        </span>
      )}
    </div>
  )
}

export default CurrencyDisplay