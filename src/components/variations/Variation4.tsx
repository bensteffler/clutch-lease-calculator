'use client'

import { useState, useCallback } from 'react'
import { CurrencyInput } from '../CurrencyInput'
import { VehicleValueInput } from '../VehicleValueInput'
import { Tooltip, InfoIcon } from '../Tooltip'
import { formatCurrency } from '@/lib/calc'
import { trackEvent } from '@/lib/analytics'

/**
 * Variation 4: Two-Step Flow
 *
 * Step 1: "Have you contacted your leasing company for a buyout quote?"
 * - Yes -> shows buyout field, proceeds normally
 * - No -> shows explanation of how to get it, with SDR contact
 *         + a "Use my residual value as estimate" fallback that shows the
 *         input with a yellow "estimate only" banner on results
 *
 * Most opinionated - ensures users understand what they need before entering data.
 */
export function Variation4() {
  const [step, setStep] = useState<'ask' | 'calculator' | 'help'>('ask')
  const [usingResidual, setUsingResidual] = useState(false)
  const [buyoutAmount, setBuyoutAmount] = useState(0)
  const [unknownVehicleValue, setUnknownVehicleValue] = useState(true)
  const [vehicleValue, setVehicleValue] = useState<number | undefined>()

  const taxRate = 0.13
  const taxSavings = buyoutAmount * taxRate
  const hasVehicleValue = !unknownVehicleValue && vehicleValue && vehicleValue > 0
  const equity = hasVehicleValue ? vehicleValue - buyoutAmount : 0
  const totalBenefit = hasVehicleValue ? equity + taxSavings : taxSavings

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

  const handleUseFallback = () => {
    setUsingResidual(true)
    setStep('calculator')
  }

  const hasResults = buyoutAmount > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ overflow: 'visible' }}>
        {/* Step 1: Have you contacted your leasing company? */}
        {step === 'ask' && (
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-900">
              Have you contacted your leasing company for a buyout quote?
            </p>
            <p className="text-sm text-gray-500">
              A buyout quote is the total pre-tax amount to purchase your vehicle at lease end (or to end your lease early). It&apos;s different from the residual value on your original lease contract.
            </p>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => { setUsingResidual(false); setStep('calculator') }}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 transition-colors"
              >
                <p className="font-medium text-gray-900">Yes, I have my buyout quote</p>
                <p className="text-sm text-gray-500 mt-1">
                  Great &mdash; you&apos;re all set to get accurate results.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setStep('help')}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 transition-colors"
              >
                <p className="font-medium text-gray-900">No, I haven&apos;t called yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ll show you how to get it &mdash; it only takes a 2-minute call.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Help: How to get your buyout quote */}
        {step === 'help' && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setStep('ask')}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">How to get your buyout quote</p>
              <p className="text-sm text-gray-600 mb-4">
                It&apos;s a quick call. Here&apos;s exactly what to do:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>1</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Find your leasing company&apos;s number</p>
                  <p className="text-sm text-gray-500">It&apos;s on your monthly statement or the original lease agreement.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>2</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Ask for a &quot;lease buyout quote&quot;</p>
                  <p className="text-sm text-gray-500">Also called a &quot;payout amount&quot; or &quot;purchase price.&quot; They&apos;ll give you the total pre-tax cost to end your lease.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>3</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Enter that number here</p>
                  <p className="text-sm text-gray-500">Don&apos;t use the residual value from your lease contract &mdash; it&apos;s a different (usually lower) number.</p>
                </div>
              </div>
            </div>

            {/* Why it matters */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74' }}>
              <p className="text-sm font-medium text-gray-900 mb-1">Why does this matter?</p>
              <p className="text-sm text-gray-700">
                The residual value is typically lower than the buyout amount. If you use the residual value instead, the calculator will overestimate your negative equity &mdash; sometimes by thousands of dollars. We&apos;ve seen cases where customers thought they had -$9,800 in equity when the real number was only -$1,500.
              </p>
            </div>

            {/* SDR contact */}
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
              <div>
                <p className="text-sm font-medium text-gray-900">Want Clutch to handle this?</p>
                <p className="text-sm text-gray-500">We can get the number for you</p>
              </div>
              <a
                href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
                className="px-4 py-2 text-sm font-medium rounded-full"
                style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
              >
                Contact us
              </a>
            </div>

            {/* Fallback option */}
            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={handleUseFallback}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-900 py-2"
              >
                Use my residual value as an estimate instead &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Calculator */}
        {step === 'calculator' && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => { setStep('ask'); setBuyoutAmount(0) }}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Start over
            </button>

            {usingResidual && (
              <div
                className="p-3 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm" style={{ color: '#92400E' }}>
                  You&apos;re entering a residual value. Results will be approximate &mdash; your actual buyout amount is likely higher, which means your equity is probably better than shown.
                </p>
              </div>
            )}

            <CurrencyInput
              id="v4-buyoutAmount"
              label={usingResidual ? 'Residual value' : 'Buyout amount (pre-tax)'}
              value={buyoutAmount}
              onChange={handleBuyoutChange}
              placeholder="$ 0"
              required
              tooltip={usingResidual
                ? "The residual value from your lease agreement. Note: your actual buyout amount will be higher, so these results are estimates. For accurate results, call your leasing company for a buyout quote."
                : "The total pre-tax amount your leasing company quoted to end your lease. This includes the residual value plus any fees. It's the number you'd pay to purchase the vehicle, before sales tax."
              }
            />

            <VehicleValueInput
              value={vehicleValue}
              onChange={handleVehicleValueChange}
              unknownValue={unknownVehicleValue}
              onUnknownChange={handleUnknownValueChange}
            />

            <p className="text-xs text-gray-400 mt-6">
              This calculator provides estimates only. Actual savings may vary.
            </p>
          </div>
        )}
      </div>

      {/* Right side - Results */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
        {/* Approximate warning for residual-based results */}
        {usingResidual && hasResults && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-center"
            style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
          >
            <p className="text-xs font-medium" style={{ color: '#92400E' }}>
              Based on residual value &mdash; your actual equity is likely better than shown
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
                  <Tooltip content={usingResidual
                    ? "Market value minus residual value. Since the actual buyout is usually higher than the residual, your real equity is likely better (less negative or more positive) than what's shown here."
                    : "The difference between what your vehicle is worth on the market and what you'd pay to buy it out. Positive equity = your car is worth more than the buyout."
                  }>
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
                <Tooltip content="Selling to Clutch means you don't pay the 13% HST you'd owe if you bought out the lease yourself. Clutch buys the vehicle directly from the leasing company, so the tax is never charged to you.">
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
                    <Tooltip content="The full estimated advantage of selling to Clutch: your equity (vehicle value minus buyout) plus the tax you avoid. A higher total benefit means more money in your pocket.">
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
            {step === 'ask'
              ? 'Answer the question to get started'
              : step === 'help'
                ? 'Get your buyout quote for accurate results'
                : `Enter your ${usingResidual ? 'residual value' : 'buyout amount'} to see results`
            }
          </p>
        )}

        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={() => trackEvent('cta_clicked', { ctaType: 'primary', variation: 4 })}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block mt-auto"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          Get my offer
        </a>
      </div>
    </div>
  )
}
