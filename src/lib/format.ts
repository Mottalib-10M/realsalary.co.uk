/**
 * Formatting utilities for currency, percentages, and numbers.
 */

const GBP = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const GBP_PRECISE = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PERCENT = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number, precise: boolean = false): string {
  return precise ? GBP_PRECISE.format(value) : GBP.format(value);
}

export function formatPercent(value: number): string {
  return PERCENT.format(value / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-GB').format(value);
}

/** Format currency for a specific period */
export function formatForPeriod(annual: number, divisor: number, precise: boolean = false): string {
  return formatCurrency(annual / divisor, precise || divisor > 1);
}
