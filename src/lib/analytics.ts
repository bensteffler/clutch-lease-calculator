/**
 * Local Analytics Event Tracking
 *
 * Tracks user interactions in console and in-memory storage.
 * No external services - all local.
 */

export type EventType =
  | 'input_started'      // First time user changes any field
  | 'buyout_entered'     // User entered buyout amount
  | 'province_selected'  // User changed province
  | 'advanced_opened'    // User opened advanced options
  | 'advanced_closed'    // User closed advanced options
  | 'result_viewed'      // Results became valid and visible
  | 'cta_clicked'        // User clicked a CTA
  | 'value_toggle_changed' // User toggled "I don't know value"
  | 'vehicle_value_entered' // User entered vehicle value
  | 'summary_copied'     // User copied summary

export interface AnalyticsEvent {
  id: string
  type: EventType
  timestamp: Date
  metadata?: Record<string, unknown>
}

// In-memory event store
let events: AnalyticsEvent[] = []
let hasStartedInput = false

/**
 * Generate a simple unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Track an analytics event
 */
export function trackEvent(type: EventType, metadata?: Record<string, unknown>): void {
  // Skip duplicate input_started events
  if (type === 'input_started') {
    if (hasStartedInput) return
    hasStartedInput = true
  }

  const event: AnalyticsEvent = {
    id: generateId(),
    type,
    timestamp: new Date(),
    metadata,
  }

  events.push(event)

  // Log to console in dev
  console.log(`[Analytics] ${type}`, metadata || '')
}

/**
 * Get all tracked events
 */
export function getEvents(): AnalyticsEvent[] {
  return [...events]
}

/**
 * Clear all events (for testing)
 */
export function clearEvents(): void {
  events = []
  hasStartedInput = false
}

/**
 * Get event count by type
 */
export function getEventCounts(): Record<EventType, number> {
  const counts: Record<string, number> = {}

  for (const event of events) {
    counts[event.type] = (counts[event.type] || 0) + 1
  }

  return counts as Record<EventType, number>
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
