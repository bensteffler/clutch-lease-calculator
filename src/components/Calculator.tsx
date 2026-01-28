'use client'

import { useState, useEffect, useCallback } from 'react'
import { CurrencyInput } from './CurrencyInput'
import { VehicleValueInput } from './VehicleValueInput'
import { AdvancedOptions } from './AdvancedOptions'
import { Results } from './Results'
import { FeesInfo } from './FeesInfo'
import { calculate, CalcResults } from '@/lib/calc'
import { getProvinceByCode, ProvinceInfo } from '@/lib/taxRates'
import { trackEvent } from '@/lib/analytics'

export function Calculator() {
  // Ontario only - Clutch can only buy leased vehicles in Ontario
  const province = 'ON'

  // Core inputs
  const [buyoutAmount, setBuyoutAmount] = useState(0)
  const [buyoutError, setBuyoutError] = useState<string | undefined>()

  // Vehicle value
  const [unknownVehicleValue, setUnknownVehicleValue] = useState(false)
  const [vehicleValue, setVehicleValue] = useState<number | undefined>()

  // Advanced options
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [remainingPayments, setRemainingPayments] = useState(0)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [purchaseOptionFee, setPurchaseOptionFee] = useState(0)
  const [otherFees, setOtherFees] = useState(0)

  // Results
  const [results, setResults] = useState<CalcResults | null>(null)
  const [hasTrackedResultView, setHasTrackedResultView] = useState(false)

  // Get province info
  const provinceInfo = getProvinceByCode(province) as ProvinceInfo

  // Calculate results when inputs change
  useEffect(() => {
    // Validate buyout
    if (buyoutAmount <= 0) {
      setBuyoutError(buyoutAmount === 0 ? undefined : 'Buyout amount must be greater than 0')
      setResults(null)
      setHasTrackedResultView(false)
      return
    }

    setBuyoutError(undefined)

    const calcResults = calculate({
      buyoutAmount,
      taxRate: provinceInfo.taxRate,
      purchaseOptionFee,
      otherFees,
      vehicleValue: unknownVehicleValue ? undefined : vehicleValue,
      remainingPayments,
      monthlyPayment,
    })

    setResults(calcResults)
  }, [buyoutAmount, provinceInfo.taxRate, purchaseOptionFee, otherFees, unknownVehicleValue, vehicleValue, remainingPayments, monthlyPayment])

  // Track result_viewed when results become valid
  useEffect(() => {
    if (results && !hasTrackedResultView) {
      trackEvent('result_viewed', { province, buyoutAmount })
      setHasTrackedResultView(true)
    }
  }, [results, hasTrackedResultView, buyoutAmount])

  // Event handlers with tracking
  const handleBuyoutChange = useCallback((value: number) => {
    trackEvent('input_started')
    if (value > 0) {
      trackEvent('buyout_entered', { amount: value })
    }
    setBuyoutAmount(value)
  }, [])

  const handleVehicleValueChange = useCallback((value: number | undefined) => {
    trackEvent('input_started')
    if (value !== undefined && value > 0) {
      trackEvent('vehicle_value_entered', { value })
    }
    setVehicleValue(value)
  }, [])

  const handleUnknownValueChange = useCallback((unknown: boolean) => {
    trackEvent('value_toggle_changed', { unknownValue: unknown })
    setUnknownVehicleValue(unknown)
  }, [])

  const handleAdvancedToggle = useCallback(() => {
    const newState = !advancedOpen
    trackEvent(newState ? 'advanced_opened' : 'advanced_closed')
    setAdvancedOpen(newState)
  }, [advancedOpen])

  const handleCtaClick = useCallback((ctaType: 'primary' | 'secondary') => {
    trackEvent('cta_clicked', { ctaType })
    if (ctaType === 'secondary') {
      trackEvent('summary_copied')
    }
  }, [])

  // Track advanced field changes
  const handleAdvancedChange = useCallback((field: string, value: number, setter: (v: number) => void) => {
    trackEvent('input_started')
    setter(value)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left side - Inputs */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6" style={{ overflow: 'visible' }}>
        <div className="space-y-6">
          {/* Residual Value */}
          <CurrencyInput
            id="buyoutAmount"
            label="Residual value"
            value={buyoutAmount}
            onChange={handleBuyoutChange}
            placeholder="$ 0"
            required
            error={buyoutError}
            tooltip="The residual value is the pre-determined price you can buy the vehicle for at the end of your lease. Find this on your lease agreement or contact your leasing company."
          />

          {/* Vehicle Value */}
          <VehicleValueInput
            value={vehicleValue}
            onChange={handleVehicleValueChange}
            unknownValue={unknownVehicleValue}
            onUnknownChange={handleUnknownValueChange}
          />

          {/* Advanced options */}
          <AdvancedOptions
            isOpen={advancedOpen}
            onToggle={handleAdvancedToggle}
            remainingPayments={remainingPayments}
            monthlyPayment={monthlyPayment}
            purchaseOptionFee={purchaseOptionFee}
            otherFees={otherFees}
            onRemainingPaymentsChange={(v) => handleAdvancedChange('remainingPayments', v, setRemainingPayments)}
            onMonthlyPaymentChange={(v) => handleAdvancedChange('monthlyPayment', v, setMonthlyPayment)}
            onPurchaseOptionFeeChange={(v) => handleAdvancedChange('purchaseOptionFee', v, setPurchaseOptionFee)}
            onOtherFeesChange={(v) => handleAdvancedChange('otherFees', v, setOtherFees)}
          />

          {/* Fees info */}
          <FeesInfo />

          {/* Fine print */}
          <p className="text-xs text-gray-400 pt-2">
            This calculator provides estimates only. Actual values may vary based on your specific situation.
          </p>
        </div>
      </div>

      {/* Right side - Results */}
      <div className="lg:col-span-2">
        <Results
          results={results}
          province={provinceInfo}
          hasVehicleValue={!unknownVehicleValue && vehicleValue !== undefined && vehicleValue > 0}
          onCtaClick={handleCtaClick}
        />
      </div>
    </div>
  )
}
