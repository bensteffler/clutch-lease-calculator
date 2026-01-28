import { describe, it, expect } from 'vitest'
import {
  calculateTaxSavings,
  calculateTotalBuyoutCost,
  calculateBreakEvenOffer,
  calculateEquity,
  calculateNetProceedsRange,
  calculate,
  formatCurrency,
  parseCurrency,
} from '../lib/calc'

describe('calculateTaxSavings', () => {
  it('calculates tax correctly for Ontario (13%)', () => {
    expect(calculateTaxSavings(20000, 0.13)).toBe(2600)
  })

  it('calculates tax correctly for Alberta (5%)', () => {
    expect(calculateTaxSavings(20000, 0.05)).toBe(1000)
  })

  it('handles zero buyout', () => {
    expect(calculateTaxSavings(0, 0.13)).toBe(0)
  })

  it('calculates tax correctly for Quebec (14.975%)', () => {
    expect(calculateTaxSavings(20000, 0.14975)).toBe(2995)
  })
})

describe('calculateTotalBuyoutCost', () => {
  it('calculates total cost including all fees', () => {
    // buyout + tax + purchase option fee + other fees
    // 20000 + 2600 + 300 + 150 = 23050
    expect(calculateTotalBuyoutCost(20000, 0.13, 300, 150)).toBe(23050)
  })

  it('handles zero fees', () => {
    // 20000 + 2600 = 22600
    expect(calculateTotalBuyoutCost(20000, 0.13, 0, 0)).toBe(22600)
  })

  it('handles only purchase option fee', () => {
    // 20000 + 2600 + 300 = 22900
    expect(calculateTotalBuyoutCost(20000, 0.13, 300, 0)).toBe(22900)
  })
})

describe('calculateBreakEvenOffer', () => {
  it('calculates break-even as buyout plus fees (no tax)', () => {
    // 20000 + 300 + 150 = 20450
    expect(calculateBreakEvenOffer(20000, 300, 150)).toBe(20450)
  })

  it('handles zero fees', () => {
    expect(calculateBreakEvenOffer(20000, 0, 0)).toBe(20000)
  })

  it('break-even is always less than total keeping cost', () => {
    const buyout = 20000
    const purchaseFee = 300
    const otherFees = 150
    const taxRate = 0.13

    const breakEven = calculateBreakEvenOffer(buyout, purchaseFee, otherFees)
    const keepingCost = calculateTotalBuyoutCost(buyout, taxRate, purchaseFee, otherFees)

    expect(breakEven).toBeLessThan(keepingCost)
  })
})

describe('calculateEquity', () => {
  it('calculates positive equity when vehicle value exceeds costs', () => {
    // 25000 - (20000 + 300 + 150) = 4550
    expect(calculateEquity(25000, 20000, 300, 150)).toBe(4550)
  })

  it('calculates negative equity when costs exceed vehicle value', () => {
    // 18000 - (20000 + 300 + 150) = -2450
    expect(calculateEquity(18000, 20000, 300, 150)).toBe(-2450)
  })

  it('calculates zero equity when values are equal', () => {
    // 20450 - (20000 + 300 + 150) = 0
    expect(calculateEquity(20450, 20000, 300, 150)).toBe(0)
  })
})

describe('calculateNetProceedsRange', () => {
  it('returns correct range with 5% uncertainty', () => {
    const result = calculateNetProceedsRange(25000, 20000, 300, 150)

    // Vehicle value ± 5%: 23750 to 26250
    expect(result.valueLow).toBe(23750)
    expect(result.valueHigh).toBe(26250)

    // Net proceeds: valueLow - costs to valueHigh - costs
    // costs = 20000 + 300 + 150 = 20450
    expect(result.low).toBe(3300) // 23750 - 20450
    expect(result.high).toBe(5800) // 26250 - 20450
  })

  it('can return negative proceeds when underwater', () => {
    const result = calculateNetProceedsRange(18000, 20000, 300, 150)

    // Vehicle value ± 5%: 17100 to 18900
    // costs = 20450
    expect(result.low).toBe(-3350) // 17100 - 20450
    expect(result.high).toBe(-1550) // 18900 - 20450
  })

  it('range spans positive and negative when near break-even', () => {
    const result = calculateNetProceedsRange(20450, 20000, 300, 150)

    // Vehicle value = costs exactly
    // Low: 19427.5 - 20450 = -1022.5
    // High: 21472.5 - 20450 = 1022.5
    expect(result.low).toBeLessThan(0)
    expect(result.high).toBeGreaterThan(0)
  })
})

describe('calculate (main function)', () => {
  it('returns all base results without vehicle value', () => {
    const results = calculate({
      buyoutAmount: 20000,
      taxRate: 0.13,
      purchaseOptionFee: 300,
      otherFees: 150,
    })

    expect(results.taxSavings).toBe(2600)
    expect(results.totalBuyoutCost).toBe(23050)
    expect(results.breakEvenOffer).toBe(20450)
    expect(results.keepingCostWithTax).toBe(23050)

    // No vehicle value calcs
    expect(results.equity).toBeUndefined()
    expect(results.netProceedsLow).toBeUndefined()
    expect(results.netProceedsHigh).toBeUndefined()
  })

  it('includes vehicle value calculations when provided', () => {
    const results = calculate({
      buyoutAmount: 20000,
      taxRate: 0.13,
      purchaseOptionFee: 300,
      otherFees: 150,
      vehicleValue: 25000,
    })

    expect(results.equity).toBe(4550)
    expect(results.netProceedsLow).toBe(3300)
    expect(results.netProceedsHigh).toBe(5800)
    expect(results.vehicleValueLow).toBe(23750)
    expect(results.vehicleValueHigh).toBe(26250)
  })

  it('ignores vehicle value of 0', () => {
    const results = calculate({
      buyoutAmount: 20000,
      taxRate: 0.13,
      purchaseOptionFee: 0,
      otherFees: 0,
      vehicleValue: 0,
    })

    expect(results.equity).toBeUndefined()
  })
})

describe('formatCurrency', () => {
  it('formats positive numbers with dollar sign and commas', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567')
  })

  it('formats negative numbers with minus sign', () => {
    expect(formatCurrency(-1234)).toBe('-$1,234')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('shows cents when requested', () => {
    expect(formatCurrency(1234.56, true)).toBe('$1,234.56')
  })

  it('rounds to whole numbers by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,235')
  })
})

describe('parseCurrency', () => {
  it('parses currency string with dollar sign', () => {
    expect(parseCurrency('$1,234')).toBe(1234)
  })

  it('parses plain numbers', () => {
    expect(parseCurrency('1234')).toBe(1234)
  })

  it('handles decimals', () => {
    expect(parseCurrency('$1,234.56')).toBe(1234.56)
  })

  it('returns 0 for invalid input', () => {
    expect(parseCurrency('abc')).toBe(0)
    expect(parseCurrency('')).toBe(0)
  })

  it('handles whitespace', () => {
    expect(parseCurrency('  $1,234  ')).toBe(1234)
  })
})
