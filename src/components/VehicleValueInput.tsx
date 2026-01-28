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

        {/* Toggle pills - using inline styles for widget compatibility */}
        <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '9999px', padding: '4px' }}>
          <button
            type="button"
            onClick={() => handleToggle(true)}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              borderRadius: '9999px',
              transition: 'all 0.2s',
              backgroundColor: unknownValue ? '#ffffff' : 'transparent',
              color: unknownValue ? '#111827' : '#6b7280',
              boxShadow: unknownValue ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
            }}
          >
            I don&apos;t know
          </button>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              borderRadius: '9999px',
              transition: 'all 0.2s',
              backgroundColor: !unknownValue ? '#ffffff' : 'transparent',
              color: !unknownValue ? '#111827' : '#6b7280',
              boxShadow: !unknownValue ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
            }}
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
        <div
          className="flex items-center justify-between gap-4 rounded-lg p-3"
          style={{ backgroundColor: '#f9fafb' }}
        >
          <span className="text-sm text-gray-600">Get an exact value from Clutch</span>
          <a
            href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: '#FF464C' }}
          >
            Get my offer →
          </a>
        </div>
      )}
    </div>
  )
}
