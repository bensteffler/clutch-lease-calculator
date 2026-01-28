'use client'

import { Calculator } from '@/components/Calculator'
import { DevPanel } from '@/components/DevPanel'

export default function Home() {
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

        {/* Calculator */}
        <Calculator />

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
