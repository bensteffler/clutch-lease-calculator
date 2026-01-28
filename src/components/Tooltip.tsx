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
        <span
          style={{
            position: 'absolute',
            zIndex: 9999,
            width: '260px',
            padding: '10px 12px',
            fontSize: '13px',
            lineHeight: '1.4',
            color: '#ffffff',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            top: '100%',
            left: '0',
            marginTop: '8px',
          }}
        >
          {content}
          <span
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '12px',
              borderWidth: '6px',
              borderStyle: 'solid',
              borderColor: 'transparent transparent #1f2937 transparent',
            }}
          />
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
