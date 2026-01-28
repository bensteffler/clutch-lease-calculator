/**
 * Canadian Provincial/Territorial Sales Tax Rates
 *
 * These are combined rates (GST + PST or HST) as of 2024.
 * Update these values as tax rates change.
 *
 * HST Provinces: ON, NB, NS, NL, PE
 * GST + PST: BC, MB, SK, QC
 * GST Only: AB, NT, NU, YT
 */

export interface ProvinceInfo {
  code: string
  name: string
  taxRate: number // Combined sales tax rate as decimal (e.g., 0.13 for 13%)
  taxType: 'HST' | 'GST+PST' | 'GST' | 'GST+QST'
}

export const provinces: ProvinceInfo[] = [
  // HST Provinces
  { code: 'ON', name: 'Ontario', taxRate: 0.13, taxType: 'HST' },
  { code: 'NB', name: 'New Brunswick', taxRate: 0.15, taxType: 'HST' },
  { code: 'NS', name: 'Nova Scotia', taxRate: 0.15, taxType: 'HST' },
  { code: 'NL', name: 'Newfoundland and Labrador', taxRate: 0.15, taxType: 'HST' },
  { code: 'PE', name: 'Prince Edward Island', taxRate: 0.15, taxType: 'HST' },

  // GST + PST Provinces
  { code: 'BC', name: 'British Columbia', taxRate: 0.12, taxType: 'GST+PST' }, // 5% GST + 7% PST
  { code: 'MB', name: 'Manitoba', taxRate: 0.12, taxType: 'GST+PST' }, // 5% GST + 7% PST
  { code: 'SK', name: 'Saskatchewan', taxRate: 0.11, taxType: 'GST+PST' }, // 5% GST + 6% PST
  { code: 'QC', name: 'Quebec', taxRate: 0.14975, taxType: 'GST+QST' }, // 5% GST + 9.975% QST

  // GST Only Provinces/Territories
  { code: 'AB', name: 'Alberta', taxRate: 0.05, taxType: 'GST' },
  { code: 'NT', name: 'Northwest Territories', taxRate: 0.05, taxType: 'GST' },
  { code: 'NU', name: 'Nunavut', taxRate: 0.05, taxType: 'GST' },
  { code: 'YT', name: 'Yukon', taxRate: 0.05, taxType: 'GST' },
]

export const provinceMap = new Map(provinces.map(p => [p.code, p]))

export function getProvinceByCode(code: string): ProvinceInfo | undefined {
  return provinceMap.get(code)
}

export function getTaxRate(provinceCode: string): number {
  return provinceMap.get(provinceCode)?.taxRate ?? 0.13 // Default to Ontario
}

export function formatTaxRate(rate: number): string {
  return `${(rate * 100).toFixed(rate === 0.14975 ? 3 : 0)}%`
}
