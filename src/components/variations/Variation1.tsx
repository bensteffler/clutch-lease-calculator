'use client'

import { useState, useCallback } from 'react'
import { CurrencyInput } from '../CurrencyInput'
import { VehicleValueInput } from '../VehicleValueInput'
import { Tooltip, InfoIcon } from '../Tooltip'
import { formatCurrency } from '@/lib/calc'
import { trackEvent } from '@/lib/analytics'

/**
 * Variation 1: Guided Input Toggle
 *
 * Asks "What number do you have from your lease?" before showing the calculator.
 * - "My buyout quote" -> shows the calculator
 * - "My residual value" -> shows help/explanation + SDR contact
 *
 * This catches confused users before they ever type a wrong number.
 */
export function Variation1() {
  const [inputType, setInputType] = useState<'none' | 'buyout' | 'residual'>('none')
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

  const hasResults = buyoutAmount > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ overflow: 'visible' }}>
        {/* Step 1: What number do you have? */}
        {inputType === 'none' && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-900">What number do you have from your lease?</p>
            <p className="text-sm text-gray-500">
              We ask because many customers confuse these two numbers, which leads to inaccurate results.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setInputType('buyout')}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 transition-colors"
              >
                <p className="font-medium text-gray-900">I have my buyout quote</p>
                <p className="text-sm text-gray-500 mt-1">
                  The total amount your leasing company quoted to end your lease early or at end-of-term. This is the number you need.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setInputType('residual')}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 transition-colors"
              >
                <p className="font-medium text-gray-900">I have my residual value</p>
                <p className="text-sm text-gray-500 mt-1">
                  The number listed on your original lease agreement as the vehicle's value at lease end.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Residual value help */}
        {inputType === 'residual' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setInputType('none')}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74' }}>
              <p className="font-medium text-gray-900 mb-2">Your residual value isn&apos;t your buyout amount</p>
              <p className="text-sm text-gray-700 mb-3">
                The <strong>residual value</strong> is the predicted value of your vehicle at lease end &mdash; it&apos;s set when you sign the lease and doesn&apos;t change.
              </p>
              <p className="text-sm text-gray-700 mb-3">
                The <strong>buyout amount</strong> (also called &quot;payout amount&quot; or &quot;purchase price&quot;) is what your leasing company will actually charge you to end the lease. It can include:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc mb-3">
                <li>The residual value</li>
                <li>Remaining lease payments (if ending early)</li>
                <li>Administrative and purchase option fees</li>
                <li>Any penalties or charges</li>
              </ul>
              <p className="text-sm text-gray-700">
                The buyout amount is almost always <strong>higher</strong> than the residual value. Using the wrong number will make your equity look much worse than it actually is.
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
              <p className="text-sm font-medium text-gray-900 mb-2">How to get your buyout amount:</p>
              <ol className="text-sm text-gray-600 space-y-2 ml-4 list-decimal">
                <li>Call the number on your monthly lease statement</li>
                <li>Ask for a &quot;lease buyout quote&quot; or &quot;payout amount&quot;</li>
                <li>They&apos;ll give you the total pre-tax amount to end your lease</li>
              </ol>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
              <div>
                <p className="text-sm font-medium text-gray-900">Need help?</p>
                <p className="text-sm text-gray-500">Our team can walk you through it</p>
              </div>
              <a
                href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
                className="px-4 py-2 text-sm font-medium rounded-full"
                style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
              >
                Contact us
              </a>
            </div>

            <button
              type="button"
              onClick={() => setInputType('buyout')}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-900 py-2"
            >
              I have my buyout amount now &rarr;
            </button>
          </div>
        )}

        {/* Calculator (buyout path) */}
        {inputType === 'buyout' && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setInputType('none')}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <CurrencyInput
              id="v1-buyoutAmount"
              label="Buyout amount (pre-tax)"
              value={buyoutAmount}
              onChange={handleBuyoutChange}
              placeholder="$ 0"
              required
              tooltip="The total amount your leasing company quoted to end your lease. This is NOT the residual value from your lease agreement &mdash; it's the actual payout amount, which is usually higher."
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
                  <Tooltip content="The difference between your vehicle's market value and the buyout amount. Positive equity means your car is worth more than it costs to buy out.">
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
                <Tooltip content="When you sell to Clutch instead of buying out your lease yourself, you avoid paying sales tax on the buyout amount. This is an automatic saving.">
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
                    <Tooltip content="Your total estimated benefit combines equity (vehicle value minus buyout cost) and tax savings. This is how much better off you are selling to Clutch vs. buying the vehicle yourself.">
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
            {inputType === 'none'
              ? 'Select what number you have to get started'
              : inputType === 'residual'
                ? 'Get your buyout quote to see accurate results'
                : 'Enter your buyout amount to see results'
            }
          </p>
        )}

        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={() => trackEvent('cta_clicked', { ctaType: 'primary', variation: 1 })}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block mt-auto"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          Get my offer
        </a>
      </div>
    </div>
  )
}
