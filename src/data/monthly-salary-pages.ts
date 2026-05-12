/**
 * Data generator for monthly salary landing pages.
 *
 * Generates pre-computed data for 59 pages (£100–£3,000 in £50 steps).
 * All tax calculations run at build time so each static page ships
 * with accurate, ready-to-render figures.
 */

import { calculateTakeHome, annualToHourly, type CalculationResult, type TaxBandBreakdown } from '../lib/uk-tax-engine';
import { formatCurrency, formatPercent } from '../lib/format';
import {
  PERSONAL_ALLOWANCE,
  NI_PRIMARY_THRESHOLD,
  NI_UPPER_EARNINGS_LIMIT,
  NI_MAIN_RATE,
  NI_ADDITIONAL_RATE,
  INCOME_TAX_BANDS_ENGLAND,
  INCOME_TAX_BANDS_SCOTLAND,
  TAX_YEAR,
} from './tax-rules-2026-27';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FormattedResult {
  grossAnnual: string;
  grossMonthly: string;
  incomeTax: string;
  nationalInsurance: string;
  totalDeductions: string;
  netAnnual: string;
  netMonthly: string;
  effectiveTaxRate: string;
  marginalTaxRate: string;
  bands: TaxBandBreakdown[];
}

export interface PeriodBreakdown {
  label: string;
  gross: string;
  net: string;
}

export interface NearbySalary {
  monthly: number;
  monthlyFormatted: string;
  slug: string;
  netMonthly: string;
  netAnnual: string;
  difference: string;
}

export type ContentTier = 'below-pa' | 'basic-rate';

export interface MonthlySalaryPageData {
  // Core identifiers
  monthly: number;
  annual: number;
  slug: string;

  // Formatted display values
  monthlyFormatted: string;
  annualFormatted: string;

  // Content tier
  tier: ContentTier;

  // England results (raw + formatted)
  england: CalculationResult;
  englandFormatted: FormattedResult;

  // Scotland results (raw + formatted)
  scotland: CalculationResult;
  scotlandFormatted: FormattedResult;

  // Period breakdowns (England)
  periods: PeriodBreakdown[];

  // Hourly / daily / weekly equivalents (gross)
  hourlyGross: string;
  dailyGross: string;
  weeklyGross: string;
  fortnightlyGross: string;

  // Nearby salary comparisons
  nearby: NearbySalary[];

  // SEO
  taxYear: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatResult(result: CalculationResult, monthly: number): FormattedResult {
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

function buildSlug(monthly: number): string {
  return `${monthly}-per-month`;
}

// ─── Generator ──────────────────────────────────────────────────────────────

export function generateMonthlySalaryPages(): MonthlySalaryPageData[] {
  const pages: MonthlySalaryPageData[] = [];

  // All monthly amounts: £100 to £3,000 in £50 steps
  const amounts: number[] = [];
  for (let m = 100; m <= 3000; m += 50) {
    amounts.push(m);
  }

  // Pre-compute England results for nearby comparisons
  const englandResults = new Map<number, CalculationResult>();
  for (const m of amounts) {
    englandResults.set(m, calculateTakeHome({ grossAnnual: m * 12, region: 'england' }));
  }

  for (const monthly of amounts) {
    const annual = monthly * 12;
    const slug = buildSlug(monthly);

    const england = englandResults.get(monthly)!;
    const scotland = calculateTakeHome({ grossAnnual: annual, region: 'scotland' });

    // Content tier: below PA if annual income <= personal allowance
    const tier: ContentTier = annual <= PERSONAL_ALLOWANCE ? 'below-pa' : 'basic-rate';

    // Nearby salaries: ±£50 and ±£100 that exist in our set
    const nearbyAmounts = [monthly - 100, monthly - 50, monthly + 50, monthly + 100]
      .filter((n) => n >= 100 && n <= 3000);

    const nearby: NearbySalary[] = nearbyAmounts.map((n) => {
      const nResult = englandResults.get(n) ?? calculateTakeHome({ grossAnnual: n * 12, region: 'england' });
      const diff = (nResult.netAnnual / 12) - (england.netAnnual / 12);
      return {
        monthly: n,
        monthlyFormatted: formatCurrency(n),
        slug: buildSlug(n),
        netMonthly: formatCurrency(nResult.netAnnual / 12),
        netAnnual: formatCurrency(nResult.netAnnual),
        difference: (diff >= 0 ? '+' : '') + formatCurrency(diff),
      };
    });

    pages.push({
      monthly,
      annual,
      slug,
      monthlyFormatted: formatCurrency(monthly),
      annualFormatted: formatCurrency(annual),
      tier,
      england,
      englandFormatted: formatResult(england, monthly),
      scotland,
      scotlandFormatted: formatResult(scotland, monthly),
      periods: buildPeriods(england),
      hourlyGross: formatCurrency(annualToHourly(annual)),
      dailyGross: formatCurrency(annual / 365),
      weeklyGross: formatCurrency(annual / 52),
      fortnightlyGross: formatCurrency(annual / 26),
      nearby,
      taxYear: TAX_YEAR,
    });
  }

  return pages;
}
