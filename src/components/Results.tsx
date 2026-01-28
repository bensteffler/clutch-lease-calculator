'use client'

import { CalcResults } from '@/lib/calc'
import { formatCurrency } from '@/lib/calc'
import { formatTaxRate, ProvinceInfo } from '@/lib/taxRates'
import { Tooltip, InfoIcon } from './Tooltip'

interface ResultsProps {
  results: CalcResults | null
  province: ProvinceInfo
  hasVehicleValue: boolean
  onCtaClick: (ctaType: 'primary' | 'secondary') => void
}

export function Results({ results, province, hasVehicleValue, onCtaClick }: ResultsProps) {
  // Determine CTA text based on equity
  const getPrimaryCtaText = () => {
    if (!results) return 'Get your offer'
    if (!hasVehicleValue) {
      return 'Get my offer'
    }
    const equity = results.equity
    if (equity !== undefined && equity > 0) {
      return 'Get my offer'
    }
    return 'Get my offer'
  }

  const handleCopySummary = () => {
    if (!results) return

    const {
      taxSavings,
      totalBuyoutCost,
      breakEvenOffer,
      remainingLeaseCost,
      totalCostIfKeeping,
      equity,
      netProceedsLow,
      netProceedsHigh,
    } = results

    const lines = [
      'Lease Buyout Calculator Summary',
      '================================',
      `Province: ${province.name} (${formatTaxRate(province.taxRate)} ${province.taxType})`,
      '',
      'Key Numbers:',
      `- Tax Savings: ${formatCurrency(taxSavings)}`,
      `- Total Buyout Cost (if keeping): ${formatCurrency(totalBuyoutCost)}`,
      `- Break-even Offer: ${formatCurrency(breakEvenOffer)}`,
    ]

    if (remainingLeaseCost !== undefined && totalCostIfKeeping !== undefined) {
      lines.push(`- Remaining Lease Payments: ${formatCurrency(remainingLeaseCost)}`)
      lines.push(`- Total Cost to Keep Vehicle: ${formatCurrency(totalCostIfKeeping)}`)
    }

    if (hasVehicleValue && equity !== undefined) {
      lines.push(`- Estimated Equity: ${formatCurrency(equity)}`)
    }

    if (netProceedsLow !== undefined && netProceedsHigh !== undefined) {
      lines.push(`- Net Proceeds Range: ${formatCurrency(netProceedsLow)} to ${formatCurrency(netProceedsHigh)}`)
    }

    lines.push('', 'Calculated at: ' + new Date().toLocaleString())

    navigator.clipboard.writeText(lines.join('\n'))
    onCtaClick('secondary')
  }

  // Empty state
  if (!results) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-full flex flex-col min-h-[300px]">
        <p className="text-gray-900 font-medium text-center mb-4">Your estimated tax savings when you sell to Clutch</p>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-5xl font-bold text-gray-300">$0</p>
        </div>
        <p className="text-sm text-gray-400 text-center mt-4 mb-4">
          Enter your residual value to see results
        </p>
        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={() => onCtaClick('primary')}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          Get my offer
        </a>
      </div>
    )
  }

  const {
    taxSavings,
    totalBuyoutCost,
    breakEvenOffer,
    remainingLeaseCost,
    totalCostIfKeeping,
    equity,
    netProceedsLow,
    netProceedsHigh,
  } = results

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 h-full flex flex-col">
      {/* Hero number */}
      <p className="text-gray-900 font-medium text-center">Your estimated tax savings when you sell to Clutch</p>
      <p className="text-5xl sm:text-6xl font-bold text-gray-900 text-center my-4">
        {formatCurrency(taxSavings)}
      </p>

      {/* Breakdown */}
      <div className="space-y-3 mt-2 flex-1">
        <ResultRow
          label={`${province.taxType} (${formatTaxRate(province.taxRate)}):`}
          value={formatCurrency(taxSavings)}
        />
        <ResultRow
          label="Break-even offer:"
          value={formatCurrency(breakEvenOffer)}
          tooltip="The minimum offer where you'd break even vs. the cost of buying out the lease."
        />
        <ResultRow
          label="Total buyout cost:"
          value={formatCurrency(totalBuyoutCost)}
          tooltip="The full amount you'd pay to buy out your lease, including tax and fees."
        />

        {/* Show if remaining lease payments provided */}
        {remainingLeaseCost !== undefined && totalCostIfKeeping !== undefined && (
          <>
            <div className="border-t border-gray-200 my-3" />
            <ResultRow
              label="Remaining payments:"
              value={formatCurrency(remainingLeaseCost)}
            />
            <ResultRow
              label="Total cost to keep:"
              value={formatCurrency(totalCostIfKeeping)}
              tooltip="Remaining lease payments plus buyout cost."
            />
          </>
        )}

        {/* Show if vehicle value provided */}
        {hasVehicleValue && equity !== undefined && (
          <>
            <div className="border-t border-gray-200 my-3" />
            <ResultRow
              label="Estimated equity:"
              value={formatCurrency(equity)}
              valueClass={equity >= 0 ? 'text-green-600' : 'text-red-600'}
              tooltip="Your vehicle's value minus the buyout amount and fees."
            />
            {netProceedsLow !== undefined && netProceedsHigh !== undefined && (
              <ResultRow
                label="Net proceeds range:"
                value={`${formatCurrency(netProceedsLow)} to ${formatCurrency(netProceedsHigh)}`}
                tooltip="Estimated cash after selling, with ±5% value uncertainty."
              />
            )}
          </>
        )}
      </div>

      {/* Clutch segue */}
      <p className="text-sm text-gray-600 text-center mt-4 mb-4">
        Clutch can buy out your lease directly. If it&apos;s worth more than the residual, you pocket the difference.
      </p>

      {/* CTAs */}
      <div className="space-y-3">
        <a
          href="https://www.clutch.ca/blog/lease-takeover-alternative#offer"
          onClick={() => onCtaClick('primary')}
          className="w-full px-6 py-3.5 font-medium rounded-full transition-colors text-center block"
          style={{ backgroundColor: '#FF464C', color: '#ffffff' }}
        >
          {getPrimaryCtaText()}
        </a>
        <button
          type="button"
          onClick={handleCopySummary}
          className="w-full px-6 py-2.5 text-gray-600 text-sm hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy summary
        </button>
      </div>
    </div>
  )
}

interface ResultRowProps {
  label: string
  value: string
  tooltip?: string
  valueClass?: string
}

function ResultRow({ label, value, tooltip, valueClass }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 flex items-center">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </span>
      <span className={`text-sm font-medium ${valueClass || 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}
