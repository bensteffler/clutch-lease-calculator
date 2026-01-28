'use client'

import { useState, ChangeEvent, FocusEvent } from 'react'
import { parseCurrency } from '@/lib/calc'
import { Tooltip, InfoIcon } from './Tooltip'

interface VehicleValueInputProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  unknownValue: boolean
  onUnknownChange: (unknown: boolean) => void
}

export function VehicleValueInput({
  value,
  onChange,
  unknownValue,
  onUnknownChange,
}: VehicleValueInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleToggle = (unknown: boolean) => {
    onUnknownChange(unknown)
    if (unknown) {
      onChange(undefined)
    }
  }

  const displayValue = isFocused
    ? (value && value > 0 ? value.toString() : '')
    : (value && value > 0 ? `$ ${value.toLocaleString('en-CA')}` : '')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const parsed = parseCurrency(raw)
    onChange(parsed > 0 ? parsed : undefined)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setTimeout(() => e.target.select(), 0)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className="space-y-4">
      {/* Row with label and toggle */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-gray-900 flex items-center">
          Vehicle value
          <span className="text-gray-400 font-normal ml-2">Optional</span>
          <Tooltip content="The estimated market value of your vehicle. This helps calculate your potential equity.">
            <InfoIcon />
          </Tooltip>
        </span>

        {/* Toggle pills - rounded full */}
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              unknownValue
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            I don&apos;t know
          </button>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              !unknownValue
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            I have an estimate
          </button>
        </div>
      </div>

      {/* Value input when known */}
      {!unknownValue && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-600">Estimated value</span>
          <div className="flex-1 max-w-[200px]">
            <input
              type="text"
              id="vehicleValue"
              inputMode="decimal"
              value={displayValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="$ 0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-right
                focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Clutch CTA when unknown */}
      {unknownValue && (
        <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-600">Get an exact value from Clutch</span>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-[#FF464C] hover:text-[#e63e43] transition-colors"
          >
            Get my offer →
          </button>
        </div>
      )}
    </div>
  )
}
