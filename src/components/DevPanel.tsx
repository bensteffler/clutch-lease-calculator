'use client'

import { useState, useEffect } from 'react'
import { getEvents, formatTimestamp, AnalyticsEvent } from '@/lib/analytics'

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [events, setEvents] = useState<AnalyticsEvent[]>([])

  // Poll for new events
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(getEvents())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="dev-panel">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <span className="text-xs font-medium">
          Analytics Events ({events.length})
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {isOpen && (
        <div className="max-h-64 overflow-y-auto">
          {events.length === 0 ? (
            <div className="px-3 py-4 text-gray-400 text-center">
              No events yet
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {events.slice().reverse().map((event) => (
                <div key={event.id} className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400">{event.type}</span>
                    <span className="text-gray-500">{formatTimestamp(event.timestamp)}</span>
                  </div>
                  {event.metadata && (
                    <div className="text-gray-400 mt-1 text-[10px] truncate">
                      {JSON.stringify(event.metadata)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
