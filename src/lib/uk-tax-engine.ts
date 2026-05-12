/**
 * UK Tax Engine — Pure calculation functions
 *
 * All functions are pure, side-effect-free, and operate on annual figures.
 * Convert to/from other periods using the PERIODS config.
 */

import {
  PERSONAL_ALLOWANCE,
  PERSONAL_ALLOWANCE_TAPER_THRESHOLD,
  PERSONAL_ALLOWANCE_ZERO_AT,
  INCOME_TAX_BANDS_ENGLAND,
  INCOME_TAX_BANDS_SCOTLAND,
  NI_PRIMARY_THRESHOLD,
  NI_UPPER_EARNINGS_LIMIT,
  NI_MAIN_RATE,
  NI_ADDITIONAL_RATE,
  STUDENT_LOAN_PLANS,
  type StudentLoanPlan,
  type TaxBand,
} from '../data/tax-rules-2026-27';

// ─── Types ──────────────────────────────────────────────────────────────────

export type Region = 'england' | 'scotland';

export interface PensionConfig {
  type: 'salary-sacrifice' | 'relief-at-source';
  /** Percentage of gross salary (0–100) */
  percentage: number;
}

export interface CalculatorInput {
  grossAnnual: number;
  region: Region;
  taxCode?: string;
  studentLoans?: StudentLoanPlan[];
  pension?: PensionConfig;
  /** Override personal allowance (derived from tax code if not set) */
  personalAllowance?: number;
  /** @internal Skip marginal rate calculation to prevent recursion */
  _skipMarginal?: boolean;
}

export interface TaxBandBreakdown {
  name: string;
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface CalculationResult {
  grossAnnual: number;
  pensionContribution: number;
  taxableIncome: number;
  personalAllowance: number;
  incomeTax: number;
  incomeTaxBands: TaxBandBreakdown[];
  nationalInsurance: number;
  studentLoanRepayments: number;
  studentLoanDetails: { plan: StudentLoanPlan; amount: number }[];
  totalDeductions: number;
  netAnnual: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

// ─── Personal Allowance ─────────────────────────────────────────────────────

export function calculatePersonalAllowance(grossAnnual: number, taxCode?: string): number {
  // If a specific tax code is provided, derive allowance from it
  if (taxCode) {
    const parsed = parseTaxCode(taxCode);
    if (parsed.allowance !== null) {
      return parsed.allowance;
    }
    // NT code = no tax
    if (parsed.noTax) return grossAnnual;
  }

  // Standard personal allowance with taper
  if (grossAnnual <= PERSONAL_ALLOWANCE_TAPER_THRESHOLD) {
    return PERSONAL_ALLOWANCE;
  }

  if (grossAnnual >= PERSONAL_ALLOWANCE_ZERO_AT) {
    return 0;
  }

  const excess = grossAnnual - PERSONAL_ALLOWANCE_TAPER_THRESHOLD;
  const reduction = Math.floor(excess / 2);
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}

// ─── Tax Code Parser ────────────────────────────────────────────────────────

interface ParsedTaxCode {
  allowance: number | null;
  isScottish: boolean;
  isWelsh: boolean;
  noTax: boolean;
  allBasicRate: boolean;
  allHigherRate: boolean;
  allAdditionalRate: boolean;
  isKCode: boolean;
  kCodeAmount: number;
}

export function parseTaxCode(code: string): ParsedTaxCode {
  const result: ParsedTaxCode = {
    allowance: null,
    isScottish: false,
    isWelsh: false,
    noTax: false,
    allBasicRate: false,
    allHigherRate: false,
    allAdditionalRate: false,
    isKCode: false,
    kCodeAmount: 0,
  };

  let normalized = code.toUpperCase().trim();

  // Check prefix
  if (normalized.startsWith('S')) {
    result.isScottish = true;
    normalized = normalized.slice(1);
  } else if (normalized.startsWith('C')) {
    result.isWelsh = true;
    normalized = normalized.slice(1);
  }

  // Special codes
  if (normalized === 'NT') {
    result.noTax = true;
    return result;
  }
  if (normalized === 'BR') {
    result.allBasicRate = true;
    result.allowance = 0;
    return result;
  }
  if (normalized === 'D0') {
    result.allHigherRate = true;
    result.allowance = 0;
    return result;
  }
  if (normalized === 'D1') {
    result.allAdditionalRate = true;
    result.allowance = 0;
    return result;
  }
  if (normalized === '0T') {
    result.allowance = 0;
    return result;
  }

  // K codes (negative allowance — adds to taxable income)
  if (normalized.startsWith('K')) {
    const numPart = normalized.slice(1).replace(/[^0-9]/g, '');
    const num = parseInt(numPart, 10);
    if (!isNaN(num)) {
      result.isKCode = true;
      result.kCodeAmount = num * 10;
      result.allowance = 0;
    }
    return result;
  }

  // Standard numeric codes (e.g., 1257L → £12,570)
  const numericMatch = normalized.match(/^(\d+)[A-Z]?$/);
  if (numericMatch) {
    result.allowance = parseInt(numericMatch[1], 10) * 10;
  }

  return result;
}

// ─── Income Tax ─────────────────────────────────────────────────────────────

/**
 * Calculate income tax on gross income with a given personal allowance.
 * Pass the GROSS income (before PA deduction) — the function handles PA internally.
 */
export function calculateIncomeTax(
  grossIncome: number,
  personalAllowance: number,
  region: Region,
  taxCode?: string,
): { total: number; bands: TaxBandBreakdown[] } {
  const parsed = taxCode ? parseTaxCode(taxCode) : null;

  // Special flat-rate codes (applied to full gross)
  if (parsed?.noTax) return { total: 0, bands: [] };
  if (parsed?.allBasicRate) {
    const tax = Math.round(grossIncome * 0.20 * 100) / 100;
    return { total: tax, bands: [{ name: 'Basic Rate (BR)', rate: 0.20, taxableAmount: grossIncome, tax }] };
  }
  if (parsed?.allHigherRate) {
    const tax = Math.round(grossIncome * 0.40 * 100) / 100;
    return { total: tax, bands: [{ name: 'Higher Rate (D0)', rate: 0.40, taxableAmount: grossIncome, tax }] };
  }
  if (parsed?.allAdditionalRate) {
    const tax = Math.round(grossIncome * 0.45 * 100) / 100;
    return { total: tax, bands: [{ name: 'Additional Rate (D1)', rate: 0.45, taxableAmount: grossIncome, tax }] };
  }

  // Build effective bands with the actual PA (handles taper)
  const baseBands = region === 'scotland' ? INCOME_TAX_BANDS_SCOTLAND : INCOME_TAX_BANDS_ENGLAND;
  return calculateTaxFromBands(grossIncome, personalAllowance, baseBands);
}

function calculateTaxFromBands(
  grossIncome: number,
  personalAllowance: number,
  bands: TaxBand[],
): { total: number; bands: TaxBandBreakdown[] } {
  let totalTax = 0;
  const breakdown: TaxBandBreakdown[] = [];

  // Apply bands to gross income, skipping the first `personalAllowance` at 0%.
  // Each band defines an absolute income range. We compute how much of the
  // gross income falls in each band, skipping the PA portion.
  let incomeProcessed = 0;

  for (const band of bands) {
    if (incomeProcessed >= grossIncome) break;

    const bandEnd = band.to === Infinity ? grossIncome : Math.min(band.to, grossIncome);
    const bandStart = band.from;
    const incomeInBand = Math.max(0, bandEnd - Math.max(bandStart, incomeProcessed));

    if (incomeInBand <= 0) {
      incomeProcessed = Math.max(incomeProcessed, bandEnd);
      continue;
    }

    // How much of this band is within the PA (tax-free)?
    const paRemainingInBand = Math.max(0, personalAllowance - incomeProcessed);
    const taxableInBand = Math.max(0, incomeInBand - paRemainingInBand);

    if (taxableInBand > 0 && band.rate > 0) {
      const taxForBand = taxableInBand * band.rate;
      breakdown.push({
        name: band.name,
        rate: band.rate,
        taxableAmount: taxableInBand,
        tax: Math.round(taxForBand * 100) / 100,
      });
      totalTax += taxForBand;
    }

    incomeProcessed += incomeInBand;
  }

  return { total: Math.round(totalTax * 100) / 100, bands: breakdown };
}

// ─── National Insurance ─────────────────────────────────────────────────────

export function calculateNationalInsurance(grossAnnual: number): number {
  if (grossAnnual <= NI_PRIMARY_THRESHOLD) return 0;

  let ni = 0;

  if (grossAnnual <= NI_UPPER_EARNINGS_LIMIT) {
    ni = (grossAnnual - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE;
  } else {
    ni = (NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE;
    ni += (grossAnnual - NI_UPPER_EARNINGS_LIMIT) * NI_ADDITIONAL_RATE;
  }

  return Math.round(ni * 100) / 100;
}

// ─── Student Loans ──────────────────────────────────────────────────────────

export function calculateStudentLoan(
  grossAnnual: number,
  plans: StudentLoanPlan[],
): { total: number; details: { plan: StudentLoanPlan; amount: number }[] } {
  const details: { plan: StudentLoanPlan; amount: number }[] = [];
  let total = 0;

  for (const plan of plans) {
    const config = STUDENT_LOAN_PLANS[plan];
    if (grossAnnual > config.threshold) {
      const amount = Math.round((grossAnnual - config.threshold) * config.rate * 100) / 100;
      details.push({ plan, amount });
      total += amount;
    } else {
      details.push({ plan, amount: 0 });
    }
  }

  return { total: Math.round(total * 100) / 100, details };
}

// ─── Pension ────────────────────────────────────────────────────────────────

export function calculatePensionContribution(
  grossAnnual: number,
  pension?: PensionConfig,
): number {
  if (!pension || pension.percentage <= 0) return 0;
  return Math.round(grossAnnual * (pension.percentage / 100) * 100) / 100;
}

// ─── Main Calculator ────────────────────────────────────────────────────────

export function calculateTakeHome(input: CalculatorInput): CalculationResult {
  const { grossAnnual, region, taxCode, studentLoans = [], pension } = input;

  // 1. Pension contribution
  const pensionContribution = calculatePensionContribution(grossAnnual, pension);

  // 2. Determine the income that's subject to tax/NI
  //    Salary sacrifice: reduces gross before all deductions
  //    Relief at source: paid from net, basic rate reclaimed by provider
  const isSalarySacrifice = pension?.type === 'salary-sacrifice';
  const incomeForTax = isSalarySacrifice ? grossAnnual - pensionContribution : grossAnnual;
  const incomeForNI = isSalarySacrifice ? grossAnnual - pensionContribution : grossAnnual;

  // 3. Personal allowance (based on full gross for taper, or income after sacrifice)
  const personalAllowance = input.personalAllowance ??
    calculatePersonalAllowance(incomeForTax, taxCode);

  // 4. Taxable income
  const parsed = taxCode ? parseTaxCode(taxCode) : null;
  let effectiveGrossForTax = incomeForTax;
  let effectivePA = personalAllowance;

  if (parsed?.isKCode) {
    // K code: adds to taxable income instead of deducting
    effectiveGrossForTax = incomeForTax + parsed.kCodeAmount;
    effectivePA = 0;
  }

  const taxableIncome = Math.max(0, effectiveGrossForTax - effectivePA);

  // 5. Income tax
  const incomeTaxResult = calculateIncomeTax(effectiveGrossForTax, effectivePA, region, taxCode);

  // 6. National Insurance (always on full gross or post-sacrifice gross, not affected by tax code)
  const nationalInsurance = calculateNationalInsurance(incomeForNI);

  // 7. Student loans (based on gross income, not reduced by pension sacrifice per HMRC rules)
  const studentLoanResult = calculateStudentLoan(grossAnnual, studentLoans);

  // 8. Total deductions
  const totalDeductions = incomeTaxResult.total + nationalInsurance +
    studentLoanResult.total + pensionContribution;

  // 9. Net annual
  const netAnnual = Math.round((grossAnnual - totalDeductions) * 100) / 100;

  // 10. Rates
  const effectiveTaxRate = grossAnnual > 0
    ? Math.round(((incomeTaxResult.total + nationalInsurance) / grossAnnual) * 10000) / 100
    : 0;

  const marginalTaxRate = input._skipMarginal ? 0 : calculateMarginalRate(grossAnnual, region, taxCode, pension);

  return {
    grossAnnual,
    pensionContribution,
    taxableIncome,
    personalAllowance,
    incomeTax: incomeTaxResult.total,
    incomeTaxBands: incomeTaxResult.bands,
    nationalInsurance,
    studentLoanRepayments: studentLoanResult.total,
    studentLoanDetails: studentLoanResult.details,
    totalDeductions,
    netAnnual,
    effectiveTaxRate,
    marginalTaxRate,
  };
}

// ─── Marginal Rate ──────────────────────────────────────────────────────────

function calculateMarginalRate(
  grossAnnual: number,
  region: Region,
  taxCode?: string,
  pension?: PensionConfig,
): number {
  // Calculate tax on £1 more to find marginal rate
  const increment = 1;
  const result1 = calculateTakeHome({
    grossAnnual,
    region,
    taxCode,
    pension,
    _skipMarginal: true,
  });
  const result2 = calculateTakeHome({
    grossAnnual: grossAnnual + increment,
    region,
    taxCode,
    pension,
    _skipMarginal: true,
  });

  // Avoid infinite recursion — marginalTaxRate in result is only used externally
  const additionalTax = (result2.incomeTax + result2.nationalInsurance) -
    (result1.incomeTax + result1.nationalInsurance);

  return Math.round(additionalTax * 10000) / 100;
}

// ─── Reverse Calculator ─────────────────────────────────────────────────────

export function calculateRequiredGross(
  targetNet: number,
  region: Region,
  taxCode?: string,
  studentLoans: StudentLoanPlan[] = [],
  pension?: PensionConfig,
): number {
  // Binary search for the gross that produces the target net
  let low = targetNet;
  let high = targetNet * 3; // Reasonable upper bound
  const tolerance = 0.50; // Within 50p

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const result = calculateTakeHome({
      grossAnnual: mid,
      region,
      taxCode,
      studentLoans,
      pension,
    });

    if (Math.abs(result.netAnnual - targetNet) < tolerance) {
      return Math.ceil(mid);
    }

    if (result.netAnnual < targetNet) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.ceil((low + high) / 2);
}

// ─── Bonus Calculator ───────────────────────────────────────────────────────

export interface BonusResult {
  bonusGross: number;
  bonusIncomeTax: number;
  bonusNI: number;
  bonusStudentLoan: number;
  bonusNet: number;
  withoutBonus: CalculationResult;
  withBonus: CalculationResult;
}

export function calculateBonus(
  salary: number,
  bonus: number,
  region: Region,
  taxCode?: string,
  studentLoans: StudentLoanPlan[] = [],
  pension?: PensionConfig,
): BonusResult {
  const withoutBonus = calculateTakeHome({ grossAnnual: salary, region, taxCode, studentLoans, pension });
  const withBonus = calculateTakeHome({ grossAnnual: salary + bonus, region, taxCode, studentLoans, pension });

  return {
    bonusGross: bonus,
    bonusIncomeTax: Math.round((withBonus.incomeTax - withoutBonus.incomeTax) * 100) / 100,
    bonusNI: Math.round((withBonus.nationalInsurance - withoutBonus.nationalInsurance) * 100) / 100,
    bonusStudentLoan: Math.round((withBonus.studentLoanRepayments - withoutBonus.studentLoanRepayments) * 100) / 100,
    bonusNet: Math.round((withBonus.netAnnual - withoutBonus.netAnnual) * 100) / 100,
    withoutBonus,
    withBonus,
  };
}

// ─── Hourly Rate ────────────────────────────────────────────────────────────

export function annualToHourly(annual: number, hoursPerWeek: number = 37.5): number {
  return Math.round((annual / (52 * hoursPerWeek)) * 100) / 100;
}

export function hourlyToAnnual(hourly: number, hoursPerWeek: number = 37.5): number {
  return Math.round(hourly * 52 * hoursPerWeek * 100) / 100;
}

// ─── Pro Rata ───────────────────────────────────────────────────────────────

export function calculateProRata(
  fullTimeSalary: number,
  fullTimeDays: number,
  partTimeDays: number,
): number {
  if (fullTimeDays <= 0) return 0;
  return Math.round((fullTimeSalary * (partTimeDays / fullTimeDays)) * 100) / 100;
}

// ─── Two Jobs ───────────────────────────────────────────────────────────────

export interface TwoJobsResult {
  job1: CalculationResult;
  job2: CalculationResult;
  combined: CalculationResult;
  /** Tax underpaid if jobs are taxed independently vs combined */
  underpayment: number;
}

export function calculateTwoJobs(
  salary1: number,
  salary2: number,
  region: Region,
  taxCode1?: string,
  taxCode2?: string,
  studentLoans: StudentLoanPlan[] = [],
): TwoJobsResult {
  // Job 1 typically gets the personal allowance (1257L)
  // Job 2 typically gets BR (basic rate on all income)
  const job1 = calculateTakeHome({
    grossAnnual: salary1,
    region,
    taxCode: taxCode1 ?? '1257L',
    studentLoans,
  });

  const job2 = calculateTakeHome({
    grossAnnual: salary2,
    region,
    taxCode: taxCode2 ?? 'BR',
  });

  // Combined as if single employment
  const combined = calculateTakeHome({
    grossAnnual: salary1 + salary2,
    region,
    studentLoans,
  });

  const separateTax = job1.incomeTax + job2.incomeTax + job1.nationalInsurance + job2.nationalInsurance;
  const combinedTax = combined.incomeTax + combined.nationalInsurance;
  const underpayment = Math.round((combinedTax - separateTax) * 100) / 100;

  return { job1, job2, combined, underpayment };
}
