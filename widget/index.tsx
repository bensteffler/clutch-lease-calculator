import React from 'react'
import ReactDOM from 'react-dom/client'
import { Calculator } from '../src/components/Calculator'
import '../src/app/globals.css'

// Widget entry point
function ClutchLeaseCalculator() {
  return (
    <div className="clutch-lease-calculator">
      <Calculator />
    </div>
  )
}

// Auto-mount when script loads
function mount() {
  const container = document.getElementById('clutch-lease-calculator')
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<ClutchLeaseCalculator />)
  }
}

// Mount on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}

// Also export for manual mounting
;(window as any).ClutchLeaseCalculator = {
  mount: (elementId: string) => {
    const container = document.getElementById(elementId)
    if (container) {
      const root = ReactDOM.createRoot(container)
      root.render(<ClutchLeaseCalculator />)
    }
  }
}
