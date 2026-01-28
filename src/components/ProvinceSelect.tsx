'use client'

import { provinces } from '@/lib/taxRates'

interface ProvinceSelectProps {
  value: string
  onChange: (value: string) => void
}

export function ProvinceSelect({ value, onChange }: ProvinceSelectProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor="province" className="text-sm font-medium text-gray-900">
        Province
      </label>
      <div className="relative flex-1 max-w-[200px]">
        <select
          id="province"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white appearance-none
            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
        >
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
