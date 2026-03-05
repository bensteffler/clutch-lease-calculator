'use client'

import { useState, useCallback } from 'react'
import { CurrencyInput } from '../CurrencyInput'
import { VehicleValueInput } from '../VehicleValueInput'
import { Tooltip, InfoIcon } from '../Tooltip'
import { formatCurrency } from '@/lib/calc'
import { trackEvent } from '@/lib/analytics'

/**
 * Variation 3: Smart Warning + Info Callout
 *
 * Lightest-touch approach. Keeps the single buyout field but adds:
 * - A persistent callout box below the input (not just a tooltip)
 * - Inline warning when the entered value looks like a residual (round number)
 *
 * Minimal friction, maximum information at point of entry.
 */
export function Variation3() {
  const [buyoutAmount, setBuyoutAmount] = useState(0)
  const [unknownVehicleValue, setUnknownVehicleValue] = useState(true)
  const [vehicleValue, setVehicleValue] = useState<number | undefined>()

  const taxRate = 0.13
  const taxSavings = buyoutAmount * taxRate
  const hasVehicleValue = !unknownVehicleValue && vehicleValue && vehicleValue > 0
  const equity = hasVehicleValue ? vehicleValue - buyoutAmount : 0
  const totalBenefit = hasVehicleValue ? equity + taxSavings : taxSavings

  // Heuristic: values ending in 000 and >= 5000 might be residual values
  const looksLikeResidual = buyoutAmount >= 5000 && buyoutAmount % 1000 === 0

  const handleBuyoutChange = useCallback((value: number) => {
    trackEvent('input_started')
    if (value > 0) trackEvent('buyout_entered', { amount: value })
    setBuyoutAmount(value)
  }, [])

  const handleVehicleValueChange = useCallback((value: number | undefined) => {
    setVehicleValue(value)
  }, [])

  const handleUnknownValueChange = useCallback((unknown: boolean) => {
    setUnknownVehicleValue(unknown)
  }, [])

  const hasResults = buyoutAmount > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ overflow: 'visible' }}>
        <div className="space-y-5">
          <CurrencyInput
            id="v3-buyoutAmount"
            label="Buyout amount (pre-tax)"
            value={buyoutAmount}
            onChange={handleBuyoutChange}
            placeholder="$ 0"
            required
            tooltip="The total pre-tax amount your leasing company will charge to end your lease. This is NOT the residual value &mdash; it's the full payout quote, which typically includes the residual plus fees. Call your leasing company to get this number."
          />

          {/* Smart warning for suspicious values */}
          {looksLikeResidual && (
            <div
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
            >
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium" style={{ color: '#92400E' }}>
                  Does this look right?
                </p>
                <p className="text-sm mt-1" style={{ color: '#92400E' }}>
                  This looks like it could be a residual value, not a buyout amount. Your buyout amount is usually a less round number and higher than the residual. Make sure you&apos;re entering the full buyout quote from your leasing company.
                </p>
              </div>
            </div>
          )}

          {/* Persistent callout - always visible */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
            <p className="text-sm font-medium text-gray-900 mb-1 flex items-center">
              Not sure what to enter?
              <Tooltip content="Over 80% of customers confuse these two numbers. Getting the right one makes a big difference in your results.">
                <InfoIcon />
              </Tooltip>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Your <strong>buyout amount</strong> is different from the <strong>residual value</strong> on your lease. The buyout amount is the total your leasing company charges to end your lease &mdash; it includes the residual plus fees and is almost always higher.
            </p>
            <p className="text-sm text-gray-600 mb-3">
              To get your buyout amount, call the number on your lease statement and ask for a &quot;buyout quote&quot; or &quot;payout amount.&quot;
            </p>
            <a
              href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
              className="text-sm font-medium"
              style={{ color: '#FF464C' }}
            >
              Or talk to our team for help &rarr;
            </a>
          </div>

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
                  <Tooltip content="Vehicle market value minus the buyout amount. Positive means your car is worth more than the buyout &mdash; you'd pocket the difference when selling to Clutch. Negative means the buyout costs more than the car is currently worth.">
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
                <Tooltip content="If you buy out your lease yourself, you pay 13% HST on the full buyout amount. When Clutch buys it directly from the leasing company, you skip this tax entirely. That's an instant saving of {formatCurrency(taxSavings)}.">
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
                    <Tooltip content="Your combined advantage: equity (what your car is worth above the buyout) plus tax savings (the HST you avoid). This is how much better off you are selling to Clutch instead of buying the vehicle out yourself.">
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
            Enter your buyout amount to see results
          </p>
        )}

        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={() => trackEvent('cta_clicked', { ctaType: 'primary', variation: 3 })}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block mt-auto"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          Get my offer
        </a>
      </div>
    </div>
  )
}
