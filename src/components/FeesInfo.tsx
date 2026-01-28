'use client'

import { useState } from 'react'

export function FeesInfo() {
  const [isOpen, setIsOpen] = useState(false)

  const fees = [
    {
      name: 'Dealer/Admin Fees',
      description: 'Some dealers charge administrative fees for processing the buyout.',
    },
    {
      name: 'Lease Purchase Option Fee',
      description: 'A fee charged by your leasing company to exercise the purchase option.',
    },
    {
      name: 'Safety/Inspection Costs',
      description: 'Required safety certification varies by province. Typically $100-$200.',
    },
    {
      name: 'Registration & Title Transfer',
      description: 'Provincial fees to register the vehicle in your name.',
    },
  ]

  return (
    <div className="border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Fees people forget
      </button>

      {isOpen && (
        <div className="mt-3 pl-6">
          <ul className="space-y-2">
            {fees.map((fee) => (
              <li key={fee.name} className="text-sm">
                <span className="font-medium text-gray-900">{fee.name}:</span>{' '}
                <span className="text-gray-600">{fee.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
