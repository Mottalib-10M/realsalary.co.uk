/**
 * Data generator for hourly rate landing pages.
 *
 * Generates pre-computed data for 20 pages covering the most searched
 * hourly rates in the UK: £10–£100.
 * All tax calculations run at build time so each static page ships
 * with accurate, ready-to-render figures.
 */

import { calculateTakeHome, hourlyToAnnual, annualToHourly, type CalculationResult, type TaxBandBreakdown } from '../lib/uk-tax-engine';
import { formatCurrency, formatPercent } from '../lib/format';
import { TAX_YEAR } from './tax-rules-2026-27';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface HourlyFormattedResult {
  grossAnnual: string;
  grossMonthly: string;
  netAnnual: string;
  netMonthly: string;
  netHourly: string;
  incomeTax: string;
  nationalInsurance: string;
  totalDeductions: string;
  effectiveTaxRate: string;
  marginalTaxRate: string;
  bands: TaxBandBreakdown[];
}

export interface HourlyPeriodBreakdown {
  label: string;
  gross: string;
  net: string;
}

export interface NearbyHourlyRate {
  hourlyRate: number;
  hourlyFormatted: string;
  slug: string;
  netAnnual: string;
  netHourly: string;
  difference: string;
}

export interface HourlyRatePageData {
  hourlyRate: number;
  slug: string;
  hourlyFormatted: string;
  annualEquivalent: number;
  annualFormatted: string;
  england: CalculationResult;
  englandFormatted: HourlyFormattedResult;
  scotland: CalculationResult;
  scotlandFormatted: HourlyFormattedResult;
  periods: HourlyPeriodBreakdown[];
  nearby: NearbyHourlyRate[];
  taxYear: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const HOURLY_RATES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 25, 30, 35, 40, 45, 50, 60, 75, 100];
const HOURS_PER_WEEK = 37.5;

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildSlug(hourlyRate: number): string {
  return `${hourlyRate}-per-hour`;
}

function formatResult(result: CalculationResult, hourlyRate: number): HourlyFormattedResult {
  return {
    grossAnnual: formatCurrency(result.grossAnnual),
    grossMonthly: formatCurrency(result.grossAnnual / 12),
    netAnnual: formatCurrency(result.netAnnual),
    netMonthly: formatCurrency(result.netAnnual / 12),
    netHourly: formatCurrency(annualToHourly(result.netAnnual, HOURS_PER_WEEK), true),
    incomeTax: formatCurrency(result.incomeTax),
    nationalInsurance: formatCurrency(result.nationalInsurance),
    totalDeductions: formatCurrency(result.totalDeductions),
    effectiveTaxRate: formatPercent(result.effectiveTaxRate),
    marginalTaxRate: formatPercent(result.marginalTaxRate),
    bands: result.incomeTaxBands,
  };
}

function buildPeriods(result: CalculationResult): HourlyPeriodBreakdown[] {
  const gross = result.grossAnnual;
  const net = result.netAnnual;
  return [
    { label: 'Annual', gross: formatCurrency(gross), net: formatCurrency(net) },
    { label: 'Monthly', gross: formatCurrency(gross / 12), net: formatCurrency(net / 12) },
    { label: 'Fortnightly', gross: formatCurrency(gross / 26), net: formatCurrency(net / 26) },
    { label: 'Weekly', gross: formatCurrency(gross / 52), net: formatCurrency(net / 52) },
    { label: 'Daily', gross: formatCurrency(gross / 260), net: formatCurrency(net / 260) },
    { label: 'Hourly', gross: formatCurrency(annualToHourly(gross, HOURS_PER_WEEK), true), net: formatCurrency(annualToHourly(net, HOURS_PER_WEEK), true) },
  ];
}

// ─── Generator ──────────────────────────────────────────────────────────────

export function generateHourlyRatePages(): HourlyRatePageData[] {
  const pages: HourlyRatePageData[] = [];

  // Pre-compute England results for all rates (used for nearby comparisons)
  const englandResults = new Map<number, CalculationResult>();
  for (const rate of HOURLY_RATES) {
    const annual = hourlyToAnnual(rate, HOURS_PER_WEEK);
    englandResults.set(rate, calculateTakeHome({ grossAnnual: annual, region: 'england' }));
  }

  for (const hourlyRate of HOURLY_RATES) {
    const annualEquivalent = hourlyToAnnual(hourlyRate, HOURS_PER_WEEK);
    const slug = buildSlug(hourlyRate);

    const england = englandResults.get(hourlyRate)!;
    const scotland = calculateTakeHome({ grossAnnual: annualEquivalent, region: 'scotland' });

    // Nearby: adjacent rates that exist in our set
    const idx = HOURLY_RATES.indexOf(hourlyRate);
    const nearbyRates: number[] = [];
    if (idx > 1) nearbyRates.push(HOURLY_RATES[idx - 2]);
    if (idx > 0) nearbyRates.push(HOURLY_RATES[idx - 1]);
    if (idx < HOURLY_RATES.length - 1) nearbyRates.push(HOURLY_RATES[idx + 1]);
    if (idx < HOURLY_RATES.length - 2) nearbyRates.push(HOURLY_RATES[idx + 2]);

    const nearby: NearbyHourlyRate[] = nearbyRates.map((n) => {
      const nResult = englandResults.get(n)!;
      const diff = nResult.netAnnual - england.netAnnual;
      return {
        hourlyRate: n,
        hourlyFormatted: `\u00A3${n}`,
        slug: buildSlug(n),
        netAnnual: formatCurrency(nResult.netAnnual),
        netHourly: formatCurrency(annualToHourly(nResult.netAnnual, HOURS_PER_WEEK), true),
        difference: (diff >= 0 ? '+' : '') + formatCurrency(diff),
      };
    });

    pages.push({
      hourlyRate,
      slug,
      hourlyFormatted: `\u00A3${hourlyRate}`,
      annualEquivalent,
      annualFormatted: formatCurrency(annualEquivalent),
      england,
      englandFormatted: formatResult(england, hourlyRate),
      scotland,
      scotlandFormatted: formatResult(scotland, hourlyRate),
      periods: buildPeriods(england),
      nearby,
      taxYear: TAX_YEAR,
    });
  }

  return pages;
}
