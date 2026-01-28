'use client'

import { useState, ChangeEvent, FocusEvent } from 'react'
import { formatCurrency, parseCurrency } from '@/lib/calc'
import { Tooltip, InfoIcon } from './Tooltip'

interface CurrencyInputProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  required?: boolean
  error?: string
  tooltip?: string
  optional?: boolean
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = '$ 0',
  required = false,
  error,
  tooltip,
  optional = false,
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  // Derive display value from props - single source of truth
  const displayValue = isFocused
    ? (value > 0 ? value.toString() : '')
    : (value > 0 ? `$ ${value.toLocaleString('en-CA')}` : '')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const parsed = parseCurrency(raw)
    onChange(parsed)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    // Select all text after state update
    setTimeout(() => e.target.select(), 0)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm font-medium text-gray-900 flex items-center whitespace-nowrap">
        {label}
        {optional && <span className="text-gray-400 font-normal ml-2">Optional</span>}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </label>
      <div className="relative flex-1 max-w-[200px]">
        <input
          type="text"
          id={id}
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 text-right
            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}
          `}
        />
        {error && (
          <p className="absolute -bottom-5 right-0 text-xs text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}
