'use client'

import { useState, useCallback } from 'react'
import { CurrencyInput } from '../CurrencyInput'
import { VehicleValueInput } from '../VehicleValueInput'
import { Tooltip, InfoIcon } from '../Tooltip'
import { formatCurrency } from '@/lib/calc'
import { trackEvent } from '@/lib/analytics'

/**
 * Variation 2: Dual-Field with Auto-Explain
 *
 * Shows a toggle: "I only have my residual value" / "I have my buyout quote"
 * - Buyout quote: shows single buyout field, proceeds normally
 * - Residual only: shows residual field + warning banner that results are estimates,
 *   with explanation of the difference and how to get buyout amount
 *
 * Lets users proceed either way but clearly flags inaccuracy.
 */
export function Variation2() {
  const [hasQuote, setHasQuote] = useState<boolean>(true)
  const [buyoutAmount, setBuyoutAmount] = useState(0)
  const [residualValue, setResidualValue] = useState(0)
  const [unknownVehicleValue, setUnknownVehicleValue] = useState(true)
  const [vehicleValue, setVehicleValue] = useState<number | undefined>()

  const taxRate = 0.13
  const activeAmount = hasQuote ? buyoutAmount : residualValue
  const taxSavings = activeAmount * taxRate
  const hasVehicleValue = !unknownVehicleValue && vehicleValue && vehicleValue > 0
  const equity = hasVehicleValue ? vehicleValue - activeAmount : 0
  const totalBenefit = hasVehicleValue ? equity + taxSavings : taxSavings

  const handleBuyoutChange = useCallback((value: number) => {
    trackEvent('input_started')
    if (value > 0) trackEvent('buyout_entered', { amount: value })
    setBuyoutAmount(value)
  }, [])

  const handleResidualChange = useCallback((value: number) => {
    trackEvent('input_started')
    setResidualValue(value)
  }, [])

  const handleVehicleValueChange = useCallback((value: number | undefined) => {
    setVehicleValue(value)
  }, [])

  const handleUnknownValueChange = useCallback((unknown: boolean) => {
    setUnknownVehicleValue(unknown)
  }, [])

  const hasResults = activeAmount > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ overflow: 'visible' }}>
        <div className="space-y-6">
          {/* Toggle: what do you have? */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              What number do you have?
              <Tooltip content="Your buyout quote is the total your leasing company charges to end your lease. Your residual value is the predicted value listed on your original lease contract. They are NOT the same number &mdash; the buyout is usually higher.">
                <InfoIcon />
              </Tooltip>
            </p>
            <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '9999px', padding: '4px' }}>
              <button
                type="button"
                onClick={() => setHasQuote(true)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '14px',
                  borderRadius: '9999px',
                  transition: 'all 0.2s',
                  backgroundColor: hasQuote ? '#ffffff' : 'transparent',
                  color: hasQuote ? '#111827' : '#6b7280',
                  boxShadow: hasQuote ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
                  fontWeight: hasQuote ? 500 : 400,
                }}
              >
                Buyout quote
              </button>
              <button
                type="button"
                onClick={() => setHasQuote(false)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '14px',
                  borderRadius: '9999px',
                  transition: 'all 0.2s',
                  backgroundColor: !hasQuote ? '#ffffff' : 'transparent',
                  color: !hasQuote ? '#111827' : '#6b7280',
                  boxShadow: !hasQuote ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
                  fontWeight: !hasQuote ? 500 : 400,
                }}
              >
                Residual value
              </button>
            </div>
          </div>

          {/* Buyout quote input */}
          {hasQuote && (
            <CurrencyInput
              id="v2-buyoutAmount"
              label="Buyout amount (pre-tax)"
              value={buyoutAmount}
              onChange={handleBuyoutChange}
              placeholder="$ 0"
              required
              tooltip="The total amount your leasing company will charge to end your lease, before tax. Call the number on your lease statement and ask for a 'buyout quote' or 'payout amount'. This is NOT the residual value."
            />
          )}

          {/* Residual value input + warning */}
          {!hasQuote && (
            <>
              <CurrencyInput
                id="v2-residualValue"
                label="Residual value"
                value={residualValue}
                onChange={handleResidualChange}
                placeholder="$ 0"
                required
                tooltip="The residual value is the vehicle's predicted worth at lease end, set when you signed the lease. It's listed on your original lease agreement. It does NOT include fees, penalties, or remaining payments."
              />

              {/* Explanation callout */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74' }}>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Heads up: Results will be approximate
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Your <strong>residual value</strong> is the predicted end-of-lease value from your contract. Your actual <strong>buyout amount</strong> is usually higher because it includes:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc mb-2">
                  <li>Administrative and purchase option fees</li>
                  <li>Remaining payments (if ending early)</li>
                  <li>Any penalties or disposition charges</li>
                </ul>
                <p className="text-sm text-gray-700">
                  For accurate results, call your leasing company and ask for a <strong>buyout quote</strong>.
                </p>
              </div>
            </>
          )}

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
        {/* Approximate warning banner */}
        {!hasQuote && hasResults && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-center"
            style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
          >
            <p className="text-xs font-medium" style={{ color: '#92400E' }}>
              Estimate based on residual value &mdash; actual benefit may differ
            </p>
          </div>
        )}

        <p className="text-gray-900 font-medium text-center">
          {hasVehicleValue
            ? 'Your estimated benefit selling to Clutch'
            : 'Your estimated tax savings with Clutch'
          }
        </p>

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

        {hasResults ? (
          <div className="space-y-2 mb-4">
            {hasVehicleValue && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  Potential equity
                  <Tooltip content="The difference between your vehicle's market value and the buyout cost. If positive, your car is worth more than it costs to buy out &mdash; that's money in your pocket when you sell to Clutch.">
                    <InfoIcon />
                  </Tooltip>
                </span>
                <span className={equity >= 0 ? 'text-gray-900' : 'text-red-600'}>
                  {formatCurrency(equity)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                Tax savings (13% HST)
                <Tooltip content="When Clutch buys out your lease directly, you skip the sales tax you'd pay if you bought the vehicle yourself first. This saves you 13% HST on the entire buyout amount.">
                  <InfoIcon />
                </Tooltip>
              </span>
              <span className="text-gray-900">{formatCurrency(taxSavings)}</span>
            </div>
            {hasVehicleValue && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900 flex items-center">
                    Total benefit
                    <Tooltip content="Equity plus tax savings. This is the total estimated advantage of selling your leased vehicle to Clutch vs. buying it out yourself at the dealership.">
                      <InfoIcon />
                    </Tooltip>
                  </span>
                  <span className={totalBenefit >= 0 ? 'text-gray-900' : 'text-red-600'}>
                    {formatCurrency(totalBenefit)}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center mb-4">
            Enter your {hasQuote ? 'buyout amount' : 'residual value'} to see results
          </p>
        )}

        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={() => trackEvent('cta_clicked', { ctaType: 'primary', variation: 2 })}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block mt-auto"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          Get my offer
        </a>
      </div>
    </div>
  )
}
