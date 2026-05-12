/**
 * UK Tax Rules for 2026/27 Tax Year (6 April 2026 – 5 April 2027)
 *
 * All figures verified from gov.uk official publications.
 * Sources:
 * - https://www.gov.uk/income-tax-rates
 * - https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
 * - https://www.gov.uk/scottish-income-tax
 * - https://www.gov.uk/national-insurance-rates-letters
 * - https://www.gov.uk/government/publications/sl3-student-loan-deduction-tables/2026-to-2027-student-and-postgraduate-loan-deduction-tables
 *
 * To update for the next tax year:
 * 1. Create a new file: tax-rules-YYYY-YY.ts
 * 2. Update all thresholds and rates from gov.uk
 * 3. Update the import in uk-tax-engine.ts
 */

export const TAX_YEAR = '2026/27' as const;
export const TAX_YEAR_START = '2026-04-06' as const;
export const TAX_YEAR_END = '2027-04-05' as const;

// ─── Income Tax: England, Wales & Northern Ireland ──────────────────────────

export interface TaxBand {
  name: string;
  from: number;
  to: number;
  rate: number;
}

export const PERSONAL_ALLOWANCE = 12_570;
export const PERSONAL_ALLOWANCE_TAPER_THRESHOLD = 100_000;
export const PERSONAL_ALLOWANCE_TAPER_RATE = 0.5; // £1 lost per £2 above threshold
export const PERSONAL_ALLOWANCE_ZERO_AT = 125_140;

export const INCOME_TAX_BANDS_ENGLAND: TaxBand[] = [
  { name: 'Personal Allowance', from: 0, to: 12_570, rate: 0 },
  { name: 'Basic Rate', from: 12_570, to: 50_270, rate: 0.20 },
  { name: 'Higher Rate', from: 50_270, to: 125_140, rate: 0.40 },
  { name: 'Additional Rate', from: 125_140, to: Infinity, rate: 0.45 },
];

// ─── Income Tax: Scotland ───────────────────────────────────────────────────

export const INCOME_TAX_BANDS_SCOTLAND: TaxBand[] = [
  { name: 'Personal Allowance', from: 0, to: 12_570, rate: 0 },
  { name: 'Starter Rate', from: 12_570, to: 16_537, rate: 0.19 },
  { name: 'Basic Rate', from: 16_537, to: 29_526, rate: 0.20 },
  { name: 'Intermediate Rate', from: 29_526, to: 43_662, rate: 0.21 },
  { name: 'Higher Rate', from: 43_662, to: 75_000, rate: 0.42 },
  { name: 'Advanced Rate', from: 75_000, to: 125_140, rate: 0.45 },
  { name: 'Top Rate', from: 125_140, to: Infinity, rate: 0.48 },
];

// ─── National Insurance: Class 1 Employee ───────────────────────────────────

export const NI_PRIMARY_THRESHOLD = 12_570; // Annual
export const NI_UPPER_EARNINGS_LIMIT = 50_270; // Annual
export const NI_LOWER_EARNINGS_LIMIT = 6_708; // Annual
export const NI_MAIN_RATE = 0.08; // Between PT and UEL
export const NI_ADDITIONAL_RATE = 0.02; // Above UEL

// ─── Student Loan Repayment ─────────────────────────────────────────────────

export type StudentLoanPlan = 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';

export interface StudentLoanConfig {
  name: string;
  description: string;
  threshold: number;
  rate: number;
}

export const STUDENT_LOAN_PLANS: Record<StudentLoanPlan, StudentLoanConfig> = {
  plan1: {
    name: 'Plan 1',
    description: 'Started before September 2012 (England/Wales) or NI',
    threshold: 26_900,
    rate: 0.09,
  },
  plan2: {
    name: 'Plan 2',
    description: 'Started on or after September 2012 (England/Wales)',
    threshold: 29_385,
    rate: 0.09,
  },
  plan4: {
    name: 'Plan 4',
    description: 'Scotland',
    threshold: 33_795,
    rate: 0.09,
  },
  plan5: {
    name: 'Plan 5',
    description: 'Started on or after August 2023 (England/Wales)',
    threshold: 25_000,
    rate: 0.09,
  },
  postgrad: {
    name: 'Postgraduate Loan',
    description: 'Postgraduate Master\'s or Doctoral loan',
    threshold: 21_000,
    rate: 0.06,
  },
};

// ─── Pension Auto-Enrolment ─────────────────────────────────────────────────

export const PENSION_AUTO_ENROLMENT = {
  earningsTrigger: 10_000,
  lowerQualifyingEarnings: 6_240,
  upperQualifyingEarnings: 50_270,
  defaultEmployeeRate: 0.05,
  defaultEmployerRate: 0.03,
} as const;

// ─── Tax Codes ──────────────────────────────────────────────────────────────

export const DEFAULT_TAX_CODE = '1257L';

export interface TaxCodeInfo {
  code: string;
  description: string;
  allowance: number | null; // null means use special logic
  region: 'england' | 'scotland' | 'wales' | 'any';
}

export const COMMON_TAX_CODES: TaxCodeInfo[] = [
  { code: '1257L', description: 'Standard personal allowance', allowance: 12_570, region: 'any' },
  { code: 'BR', description: 'All income taxed at basic rate (20%)', allowance: 0, region: 'england' },
  { code: 'D0', description: 'All income taxed at higher rate (40%)', allowance: 0, region: 'england' },
  { code: 'D1', description: 'All income taxed at additional rate (45%)', allowance: 0, region: 'england' },
  { code: '0T', description: 'No personal allowance', allowance: 0, region: 'any' },
  { code: 'NT', description: 'No tax deducted', allowance: null, region: 'any' },
];

// ─── Periods ────────────────────────────────────────────────────────────────

export const PERIODS = {
  yearly: { label: 'Year', divisor: 1 },
  monthly: { label: 'Month', divisor: 12 },
  weekly: { label: 'Week', divisor: 52 },
  daily: { label: 'Day', divisor: 365 },
  hourly: { label: 'Hour', divisor: 52 * 37.5 }, // Assumes 37.5 hrs/week
} as const;

export type Period = keyof typeof PERIODS;
