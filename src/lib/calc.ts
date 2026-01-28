/**
 * Lease Buyout Calculator - Core Calculation Functions
 *
 * All monetary values are in dollars (numbers).
 * Tax rates are decimals (e.g., 0.13 for 13%).
 */

export interface CalcInputs {
  buyoutAmount: number          // Residual value / buyout price
  taxRate: number               // Provincial tax rate as decimal
  purchaseOptionFee: number     // Fee to exercise purchase option
  otherFees: number             // Any other fees
  vehicleValue?: number         // Estimated vehicle value (optional)
  remainingPayments?: number    // Number of remaining lease payments
  monthlyPayment?: number       // Monthly lease payment amount
}

export interface CalcResults {
  // Always calculated
  taxSavings: number            // Tax you'd pay if keeping
  totalBuyoutCost: number       // Total cost to keep the vehicle
  breakEvenOffer: number        // Minimum offer where you're indifferent
  keepingCostWithTax: number    // Total cost including tax

  // Only if remaining payments provided
  remainingLeaseCost?: number   // Cost to continue lease (payments * months)
  totalCostIfKeeping?: number   // Remaining lease cost + buyout cost

  // Only if vehicle value provided
  equity?: number               // Vehicle value minus costs
  netProceedsLow?: number       // Conservative estimate
  netProceedsHigh?: number      // Optimistic estimate
  vehicleValueLow?: number      // Value - 5%
  vehicleValueHigh?: number     // Value + 5%
}

/**
 * Calculate tax savings (tax you avoid by not buying at the dealership)
 */
export function calculateTaxSavings(buyoutAmount: number, taxRate: number): number {
  return buyoutAmount * taxRate
}

/**
 * Calculate total buyout cost if keeping the vehicle
 * Includes: buyout + tax + purchase option fee + other fees
 */
export function calculateTotalBuyoutCost(
  buyoutAmount: number,
  taxRate: number,
  purchaseOptionFee: number,
  otherFees: number
): number {
  const tax = calculateTaxSavings(buyoutAmount, taxRate)
  return buyoutAmount + tax + purchaseOptionFee + otherFees
}

/**
 * Calculate break-even offer price
 * This is the minimum offer where you'd be indifferent between selling and keeping
 * Does NOT include tax since you'd be selling, not buying
 */
export function calculateBreakEvenOffer(
  buyoutAmount: number,
  purchaseOptionFee: number,
  otherFees: number
): number {
  return buyoutAmount + purchaseOptionFee + otherFees
}

/**
 * Calculate equity based on estimated vehicle value
 * Equity = Vehicle Value - (Buyout + Fees)
 */
export function calculateEquity(
  vehicleValue: number,
  buyoutAmount: number,
  purchaseOptionFee: number,
  otherFees: number
): number {
  return vehicleValue - (buyoutAmount + purchaseOptionFee + otherFees)
}

/**
 * Calculate net proceeds range with 5% uncertainty on vehicle value
 * Returns [low, high] tuple
 */
export function calculateNetProceedsRange(
  vehicleValue: number,
  buyoutAmount: number,
  purchaseOptionFee: number,
  otherFees: number
): { low: number; high: number; valueLow: number; valueHigh: number } {
  const uncertainty = 0.05 // 5%
  const valueLow = vehicleValue * (1 - uncertainty)
  const valueHigh = vehicleValue * (1 + uncertainty)

  const costs = buyoutAmount + purchaseOptionFee + otherFees

  return {
    low: valueLow - costs,
    high: valueHigh - costs,
    valueLow,
    valueHigh,
  }
}

/**
 * Main calculation function - runs all calculations based on inputs
 */
export function calculate(inputs: CalcInputs): CalcResults {
  const { buyoutAmount, taxRate, purchaseOptionFee, otherFees, vehicleValue, remainingPayments, monthlyPayment } = inputs

  const taxSavings = calculateTaxSavings(buyoutAmount, taxRate)
  const totalBuyoutCost = calculateTotalBuyoutCost(buyoutAmount, taxRate, purchaseOptionFee, otherFees)
  const breakEvenOffer = calculateBreakEvenOffer(buyoutAmount, purchaseOptionFee, otherFees)
  const keepingCostWithTax = totalBuyoutCost // Same as total buyout cost

  const results: CalcResults = {
    taxSavings,
    totalBuyoutCost,
    breakEvenOffer,
    keepingCostWithTax,
  }

  // Add remaining lease cost if payments info provided
  if (remainingPayments !== undefined && remainingPayments > 0 && monthlyPayment !== undefined && monthlyPayment > 0) {
    const remainingLeaseCost = remainingPayments * monthlyPayment
    results.remainingLeaseCost = remainingLeaseCost
    results.totalCostIfKeeping = remainingLeaseCost + totalBuyoutCost
  }

  // Add vehicle value calculations if provided
  if (vehicleValue !== undefined && vehicleValue > 0) {
    const equity = calculateEquity(vehicleValue, buyoutAmount, purchaseOptionFee, otherFees)
    const range = calculateNetProceedsRange(vehicleValue, buyoutAmount, purchaseOptionFee, otherFees)

    results.equity = equity
    results.netProceedsLow = range.low
    results.netProceedsHigh = range.high
    results.vehicleValueLow = range.valueLow
    results.vehicleValueHigh = range.valueHigh
  }

  return results
}

/**
 * Format a number as currency (CAD)
 */
export function formatCurrency(value: number, showCents: boolean = false): string {
  const absValue = Math.abs(value)
  const formatted = absValue.toLocaleString('en-CA', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  })
  const sign = value < 0 ? '-' : ''
  return `${sign}$${formatted}`
}

/**
 * Parse a currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove $ and commas, parse as float
  const cleaned = value.replace(/[$,]/g, '').trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
