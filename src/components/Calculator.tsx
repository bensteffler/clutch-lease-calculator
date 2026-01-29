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

  // Calculations
  const taxRate = 0.13
  const taxSavings = buyoutAmount * taxRate
  const hasVehicleValue = !unknownVehicleValue && vehicleValue && vehicleValue > 0
  const equity = hasVehicleValue ? vehicleValue - buyoutAmount : 0
  const totalBenefit = hasVehicleValue ? equity + taxSavings : taxSavings

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

  const hasResults = buyoutAmount > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ overflow: 'visible' }}>
        <div className="space-y-6">
          <CurrencyInput
            id="buyoutAmount"
            label="Buyout amount (pre-tax)"
            value={buyoutAmount}
            onChange={handleBuyoutChange}
            placeholder="$ 0"
            required
            tooltip="The total amount to buy out your lease before tax. Contact your leasing company for a buyout quote."
          />

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
        {/* Header */}
        <p className="text-gray-900 font-medium text-center">
          {hasVehicleValue
            ? 'Your estimated benefit selling to Clutch'
            : 'Your estimated tax savings with Clutch'
          }
        </p>

        {/* Hero number */}
        <div className="flex items-center justify-center my-4">
          <p
            className="font-bold text-center"
            style={{
              fontSize: hasResults ? '3.5rem' : '3rem',
              color: hasResults ? (totalBenefit >= 0 ? '#111827' : '#dc2626') : '#d1d5db'
            }}
          >
            {formatCurrency(totalBenefit)}
          </p>
        </div>

        {/* Breakdown */}
        {hasResults ? (
          <div className="space-y-2 mb-4">
            {hasVehicleValue && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Potential equity</span>
                <span className={equity >= 0 ? 'text-gray-900' : 'text-red-600'}>
                  {formatCurrency(equity)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax savings (13% HST)</span>
              <span className="text-gray-900">{formatCurrency(taxSavings)}</span>
            </div>
            {hasVehicleValue && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">Total benefit</span>
                  <span className={totalBenefit >= 0 ? 'text-gray-900' : 'text-red-600'}>
                    {formatCurrency(totalBenefit)}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center mb-4">
            Enter your buyout amount to see results
          </p>
        )}

        {/* CTA */}
        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={handleCtaClick}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block mt-auto"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          Get my offer
        </a>
      </div>
    </div>
  )
}
