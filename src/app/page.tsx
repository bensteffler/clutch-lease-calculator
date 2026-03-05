'use client'

import { useState } from 'react'
import { Calculator } from '@/components/Calculator'
import { Variation1 } from '@/components/variations/Variation1'
import { Variation2 } from '@/components/variations/Variation2'
import { Variation3 } from '@/components/variations/Variation3'
import { Variation4 } from '@/components/variations/Variation4'
import { DevPanel } from '@/components/DevPanel'

const variations = [
  {
    id: 'current',
    label: 'Current',
    description: 'The existing calculator as-is.',
    component: Calculator,
  },
  {
    id: 'v1',
    label: 'V1: Guided Toggle',
    description: 'Asks "What number do you have?" before showing the calculator. Buyout quote proceeds normally; residual value shows help + SDR contact.',
    component: Variation1,
  },
  {
    id: 'v2',
    label: 'V2: Dual-Field',
    description: 'Toggle between "Buyout quote" and "Residual value" inputs. Residual path shows warning banner and flags results as approximate.',
    component: Variation2,
  },
  {
    id: 'v3',
    label: 'V3: Smart Warning',
    description: 'Lightest touch — keeps single input but adds persistent callout explaining the difference, plus inline warning when the value looks like a residual.',
    component: Variation3,
  },
  {
    id: 'v4',
    label: 'V4: Two-Step Flow',
    description: 'Asks "Have you contacted your leasing company?" first. Yes = calculator. No = step-by-step guide to get buyout quote, with fallback to use residual as estimate.',
    component: Variation4,
  },
]

export default function Home() {
  const [activeVariation, setActiveVariation] = useState('current')

  const active = variations.find(v => v.id === activeVariation) || variations[0]
  const ActiveComponent = active.component

  return (
    <main className="min-h-screen py-8 px-4 sm:py-12 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Lease buyout calculator
          </h1>
          <p className="text-gray-500 mt-2">
            Calculate your tax savings and see what your lease is really worth
          </p>
        </div>

        {/* Variation switcher */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-900 mb-3">Compare variations</p>
          <div className="flex flex-wrap gap-2">
            {variations.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVariation(v.id)}
                className="px-3 py-1.5 text-sm rounded-full transition-colors"
                style={{
                  backgroundColor: activeVariation === v.id ? '#111827' : '#f3f4f6',
                  color: activeVariation === v.id ? '#ffffff' : '#6b7280',
                  fontWeight: activeVariation === v.id ? 500 : 400,
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">{active.description}</p>
        </div>

        {/* Active calculator variation */}
        <ActiveComponent />

        {/* Footer note */}
        <p className="text-sm text-gray-400">
          This calculator provides estimates only. Actual values may vary based on your specific situation.
        </p>
      </div>

      {/* Dev panel for analytics */}
      <DevPanel />
    </main>
  )
}
