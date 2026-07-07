/**
 * Data generator for annual salary landing pages.
 *
 * Generates pre-computed data for 186 pages (£15,000–£200,000 in £1,000 steps).
 * All tax calculations run at build time so each static page ships
 * with accurate, ready-to-render figures.
 */

import { calculateTakeHome, annualToHourly, type CalculationResult, type TaxBandBreakdown } from '../lib/uk-tax-engine';
import { formatCurrency, formatPercent } from '../lib/format';
import {
  PERSONAL_ALLOWANCE,
  PERSONAL_ALLOWANCE_TAPER_THRESHOLD,
  PERSONAL_ALLOWANCE_ZERO_AT,
  TAX_YEAR,
} from './tax-rules-2026-27';
import type { FormattedResult, PeriodBreakdown } from './monthly-salary-pages';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AnnualContentTier = 'below-pa' | 'basic' | 'higher' | 'taper' | 'additional';

export interface NearbyAnnualSalary {
  annual: number;
  annualFormatted: string;
  slug: string;
  netAnnual: string;
  netMonthly: string;
  difference: string;
}

export interface AnnualSalaryPageData {
  // Core identifiers
  annual: number;
  slug: string;

  // Formatted display values
  annualFormatted: string;
  monthlyGross: string;
  weeklyGross: string;
  dailyGross: string;
  hourlyGross: string;

  // Content tier
  tier: AnnualContentTier;

  // England results (raw + formatted)
  england: CalculationResult;
  englandFormatted: FormattedResult;

  // Scotland results (raw + formatted)
  scotland: CalculationResult;
  scotlandFormatted: FormattedResult;

  // Period breakdowns (England)
  periods: PeriodBreakdown[];

  // Nearby salary comparisons
  nearby: NearbyAnnualSalary[];

  // SEO
  taxYear: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatResult(result: CalculationResult, annual: number): FormattedResult {
  const monthly = annual / 12;
  return {
    grossAnnual: formatCurrency(result.grossAnnual),
    grossMonthly: formatCurrency(monthly),
    incomeTax: formatCurrency(result.incomeTax),
    nationalInsurance: formatCurrency(result.nationalInsurance),
    totalDeductions: formatCurrency(result.totalDeductions),
    netAnnual: formatCurrency(result.netAnnual),
    netMonthly: formatCurrency(result.netAnnual / 12),
    effectiveTaxRate: formatPercent(result.effectiveTaxRate),
    marginalTaxRate: formatPercent(result.marginalTaxRate),
    bands: result.incomeTaxBands,
  };
}

function buildPeriods(result: CalculationResult): PeriodBreakdown[] {
  const gross = result.grossAnnual;
  const net = result.netAnnual;
  return [
    { label: 'Annual', gross: formatCurrency(gross), net: formatCurrency(net) },
    { label: 'Monthly', gross: formatCurrency(gross / 12), net: formatCurrency(net / 12) },
    { label: 'Fortnightly', gross: formatCurrency(gross / 26), net: formatCurrency(net / 26) },
    { label: 'Weekly', gross: formatCurrency(gross / 52), net: formatCurrency(net / 52) },
    { label: 'Daily', gross: formatCurrency(gross / 365), net: formatCurrency(net / 365) },
    { label: 'Hourly', gross: formatCurrency(annualToHourly(gross)), net: formatCurrency(annualToHourly(net)) },
  ];
}

function buildSlug(annual: number): string {
  return `${annual}-a-year`;
}

function getContentTier(annual: number): AnnualContentTier {
  if (annual <= PERSONAL_ALLOWANCE) return 'below-pa';
  if (annual <= 50_270) return 'basic';
  if (annual <= PERSONAL_ALLOWANCE_TAPER_THRESHOLD) return 'higher';
  if (annual <= PERSONAL_ALLOWANCE_ZERO_AT) return 'taper';
  return 'additional';
}

// ─── Generator ──────────────────────────────────────────────────────────────

export function generateAnnualSalaryPages(): AnnualSalaryPageData[] {
  const pages: AnnualSalaryPageData[] = [];

  // All annual amounts: £15,000 to £200,000 in £1,000 steps
  const amounts: number[] = [];
  for (let a = 15_000; a <= 200_000; a += 1_000) {
    amounts.push(a);
  }

  const amountSet = new Set(amounts);

  // Pre-compute England results for nearby comparisons
  const englandResults = new Map<number, CalculationResult>();
  for (const a of amounts) {
    englandResults.set(a, calculateTakeHome({ grossAnnual: a, region: 'england' }));
  }

  for (const annual of amounts) {
    const slug = buildSlug(annual);

    const england = englandResults.get(annual)!;
    const scotland = calculateTakeHome({ grossAnnual: annual, region: 'scotland' });

    const tier = getContentTier(annual);

    // Nearby salaries: +/-£1,000, +/-£5,000, +/-£10,000 that exist in our set
    const nearbyOffsets = [-10_000, -5_000, -1_000, 1_000, 5_000, 10_000];
    const nearbyAmounts = nearbyOffsets
      .map((offset) => annual + offset)
      .filter((n) => amountSet.has(n));

    const nearby: NearbyAnnualSalary[] = nearbyAmounts.map((n) => {
      const nResult = englandResults.get(n)!;
      const diff = nResult.netAnnual - england.netAnnual;
      return {
        annual: n,
        annualFormatted: formatCurrency(n),
        slug: buildSlug(n),
        netAnnual: formatCurrency(nResult.netAnnual),
        netMonthly: formatCurrency(nResult.netAnnual / 12),
        difference: (diff >= 0 ? '+' : '') + formatCurrency(diff),
      };
    });

    pages.push({
      annual,
      slug,
      annualFormatted: formatCurrency(annual),
      monthlyGross: formatCurrency(annual / 12),
      weeklyGross: formatCurrency(annual / 52),
      dailyGross: formatCurrency(annual / 365),
      hourlyGross: formatCurrency(annualToHourly(annual)),
      tier,
      england,
      englandFormatted: formatResult(england, annual),
      scotland,
      scotlandFormatted: formatResult(scotland, annual),
      periods: buildPeriods(england),
      nearby,
      taxYear: TAX_YEAR,
    });
  }

  return pages;
}
