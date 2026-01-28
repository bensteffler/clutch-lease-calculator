'use client'

import { ReactNode, useState } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span
      className="relative inline-flex items-center cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span className="absolute z-50 w-64 p-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg bottom-full left-1/2 -translate-x-1/2 mb-2">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-800" />
        </span>
      )}
    </span>
  )
}

export function InfoIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400 hover:text-gray-600 ml-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" d="M12 16v-4M12 8h.01" />
    </svg>
  )
}
