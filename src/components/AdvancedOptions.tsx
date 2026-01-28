'use client'

import { useState, ChangeEvent, FocusEvent } from 'react'
import { parseCurrency } from '@/lib/calc'
import { Tooltip, InfoIcon } from './Tooltip'

interface AdvancedOptionsProps {
  isOpen: boolean
  onToggle: () => void
  remainingPayments: number
  monthlyPayment: number
  purchaseOptionFee: number
  otherFees: number
  onRemainingPaymentsChange: (value: number) => void
  onMonthlyPaymentChange: (value: number) => void
  onPurchaseOptionFeeChange: (value: number) => void
  onOtherFeesChange: (value: number) => void
}

export function AdvancedOptions({
  isOpen,
  onToggle,
  remainingPayments,
  monthlyPayment,
  purchaseOptionFee,
  otherFees,
  onRemainingPaymentsChange,
  onMonthlyPaymentChange,
  onPurchaseOptionFeeChange,
  onOtherFeesChange,
}: AdvancedOptionsProps) {
  return (
    <div className="border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Advanced options
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdvancedInput
              id="remainingPayments"
              label="Remaining payments"
              value={remainingPayments}
              onChange={onRemainingPaymentsChange}
              type="number"
              tooltip="Number of monthly payments left on your lease."
            />

            <AdvancedCurrencyInput
              id="monthlyPayment"
              label="Monthly payment"
              value={monthlyPayment}
              onChange={onMonthlyPaymentChange}
              tooltip="Your current monthly lease payment."
            />

            <AdvancedCurrencyInput
              id="purchaseOptionFee"
              label="Purchase option fee"
              value={purchaseOptionFee}
              onChange={onPurchaseOptionFeeChange}
              tooltip="Fee charged by your leasing company to exercise the buyout option."
            />

            <AdvancedCurrencyInput
              id="otherFees"
              label="Other fees"
              value={otherFees}
              onChange={onOtherFeesChange}
              tooltip="Any other fees like dealer admin, inspection, or documentation."
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface AdvancedInputProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  type?: 'number' | 'currency'
  tooltip?: string
}

function AdvancedInput({ id, label, value, onChange, tooltip }: AdvancedInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm text-gray-600 flex items-center">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </label>
      <input
        type="number"
        id={id}
        min="0"
        max="60"
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        placeholder="0"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    </div>
  )
}

interface AdvancedCurrencyInputProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  tooltip?: string
}

function AdvancedCurrencyInput({ id, label, value, onChange, tooltip }: AdvancedCurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const displayValue = isFocused
    ? (value > 0 ? value.toString() : '')
    : (value > 0 ? `$ ${value.toLocaleString('en-CA')}` : '')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseCurrency(e.target.value)
    onChange(parsed)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setTimeout(() => e.target.select(), 0)
  }

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm text-gray-600 flex items-center">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </label>
      <input
        type="text"
        id={id}
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        placeholder="$ 0"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    </div>
  )
}
