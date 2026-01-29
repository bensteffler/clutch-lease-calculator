'use client'

import { useState, useCallback } from 'react'
import { CurrencyInput } from './CurrencyInput'
import { VehicleValueInput } from './VehicleValueInput'
import { formatCurrency } from '@/lib/calc'
import { trackEvent } from '@/lib/analytics'

export function Calculator() {
  const [buyoutAmount, setBuyoutAmount] = useState(0)
  const [unknownVehicleValue, setUnknownVehicleValue] = useState(true)
  const [vehicleValue, setVehicleValue] = useState<number | undefined>()

  // Simple calculation: 13% HST on residual value
  const taxRate = 0.13
  const taxSavings = buyoutAmount * taxRate

  const handleBuyoutChange = useCallback((value: number) => {
    trackEvent('input_started')
    if (value > 0) {
      trackEvent('buyout_entered', { amount: value })
    }
    setBuyoutAmount(value)
  }, [])

  const handleVehicleValueChange = useCallback((value: number | undefined) => {
    setVehicleValue(value)
  }, [])

  const handleUnknownValueChange = useCallback((unknown: boolean) => {
    setUnknownVehicleValue(unknown)
  }, [])

  const handleCtaClick = useCallback(() => {
    trackEvent('cta_clicked', { ctaType: 'primary' })
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Input */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ overflow: 'visible' }}>
        <CurrencyInput
          id="buyoutAmount"
          label="Buyout amount (pre-tax)"
          value={buyoutAmount}
          onChange={handleBuyoutChange}
          placeholder="$ 0"
          required
          tooltip="The total amount to buy out your lease before tax. Contact your leasing company for a buyout quote."
        />

        <div className="mt-6">
          <VehicleValueInput
            value={vehicleValue}
            onChange={handleVehicleValueChange}
            unknownValue={unknownVehicleValue}
            onUnknownChange={handleUnknownValueChange}
          />
        </div>

        <p className="text-xs text-gray-400 mt-6">
          This calculator provides estimates only. Actual savings may vary.
        </p>
      </div>

      {/* Right side - Results */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
        <p className="text-gray-900 font-medium text-center">
          Your estimated tax savings when you sell to Clutch
        </p>

        <div className="flex-1 flex items-center justify-center my-6">
          <p
            className="font-bold text-center"
            style={{
              fontSize: buyoutAmount > 0 ? '3.5rem' : '3rem',
              color: buyoutAmount > 0 ? '#111827' : '#d1d5db'
            }}
          >
            {formatCurrency(taxSavings)}
          </p>
        </div>

        {buyoutAmount > 0 ? (
          <p className="text-sm text-gray-600 text-center mb-4">
            Based on {formatCurrency(buyoutAmount)} buyout × 13% HST
          </p>
        ) : (
          <p className="text-sm text-gray-400 text-center mb-4">
            Enter your buyout amount to see results
          </p>
        )}

        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={handleCtaClick}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          Get my offer
        </a>
      </div>
    </div>
  )
}
