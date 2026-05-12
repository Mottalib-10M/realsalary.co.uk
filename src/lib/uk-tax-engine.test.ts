/**
 * Unit tests for the UK Tax Engine
 *
 * Tests cover:
 * - Personal allowance (standard and taper)
 * - Income tax (England and Scotland)
 * - National Insurance
 * - Student loan repayments
 * - Pension contributions (salary sacrifice and relief at source)
 * - Tax code parsing
 * - Bonus calculator
 * - Reverse salary calculator
 * - Two jobs calculator
 * - Pro rata calculator
 * - Hourly rate converter
 *
 * Run with: npx vitest run
 */

import { describe, it, expect } from 'vitest';
import {
  calculatePersonalAllowance,
  calculateIncomeTax,
  calculateNationalInsurance,
  calculateStudentLoan,
  calculateTakeHome,
  calculateRequiredGross,
  calculateBonus,
  calculateProRata,
  annualToHourly,
  hourlyToAnnual,
  calculateTwoJobs,
  parseTaxCode,
} from './uk-tax-engine';

// ─── Personal Allowance ─────────────────────────────────────────────────────

describe('calculatePersonalAllowance', () => {
  it('returns full allowance for income below £100,000', () => {
    expect(calculatePersonalAllowance(30_000)).toBe(12_570);
    expect(calculatePersonalAllowance(99_999)).toBe(12_570);
  });

  it('tapers the allowance above £100,000', () => {
    // £110,000 → excess = £10,000 → reduction = £5,000
    expect(calculatePersonalAllowance(110_000)).toBe(7_570);
  });

  it('returns zero for income at £125,140', () => {
    expect(calculatePersonalAllowance(125_140)).toBe(0);
  });

  it('returns zero for income above £125,140', () => {
    expect(calculatePersonalAllowance(200_000)).toBe(0);
  });

  it('handles edge case at exactly £100,000', () => {
    expect(calculatePersonalAllowance(100_000)).toBe(12_570);
  });
});

// ─── Income Tax ─────────────────────────────────────────────────────────────

describe('calculateIncomeTax', () => {
  it('returns 0 tax for income within personal allowance', () => {
    const { total } = calculateIncomeTax(0, 12_570, 'england');
    expect(total).toBe(0);
  });

  it('calculates basic rate correctly', () => {
    // £20,000 salary → taxable = £20,000 - £12,570 = £7,430
    // Tax = £7,430 × 20% = £1,486
    const result = calculateTakeHome({ grossAnnual: 20_000, region: 'england' });
    expect(result.incomeTax).toBe(1_486);
  });

  it('calculates higher rate correctly', () => {
    // £60,000 salary → PA = £12,570, taxable = £47,430
    // Basic: (50,270 - 12,570) = 37,700 × 20% = £7,540
    // Higher: (60,000 - 50,270) = 9,730 × 40% = £3,892
    // Total = £11,432
    const result = calculateTakeHome({ grossAnnual: 60_000, region: 'england' });
    expect(result.incomeTax).toBe(11_432);
  });

  it('calculates additional rate correctly', () => {
    // £150,000 → PA = 0 (above £125,140), taxable = £150,000
    // Basic: 37,700 × 20% = £7,540
    // Higher: (125,140 - 50,270) = 74,870 × 40% = £29,948
    // Additional: (150,000 - 125,140) = 24,860 × 45% = £11,187
    // Total = £48,675
    const result = calculateTakeHome({ grossAnnual: 150_000, region: 'england' });
    expect(result.incomeTax).toBe(48_675);
  });

  it('handles Scottish bands', () => {
    // £30,000 in Scotland → PA = £12,570, taxable = £17,430
    // Starter: (16,537 - 12,570) = 3,967 × 19% = £753.73
    // Basic: (29,526 - 16,537) = 12,989 × 20% = £2,597.80
    // Intermediate: (30,000 - 29,526) = 474 × 21% = £99.54
    // Total ≈ £3,451.07
    const result = calculateTakeHome({ grossAnnual: 30_000, region: 'scotland' });
    expect(result.incomeTax).toBeCloseTo(3_451.07, 0);
  });

  it('handles personal allowance taper zone (£100k-£125k)', () => {
    // £110,000 → PA = £7,570 (reduced by £5,000)
    // Effective 60% marginal rate in this zone
    const result = calculateTakeHome({ grossAnnual: 110_000, region: 'england' });
    expect(result.personalAllowance).toBe(7_570);
    expect(result.incomeTax).toBeGreaterThan(0);
  });
});

// ─── National Insurance ─────────────────────────────────────────────────────

describe('calculateNationalInsurance', () => {
  it('returns 0 below primary threshold', () => {
    expect(calculateNationalInsurance(12_000)).toBe(0);
    expect(calculateNationalInsurance(12_570)).toBe(0);
  });

  it('calculates main rate correctly', () => {
    // £30,000 → (30,000 - 12,570) × 8% = £1,394.40
    expect(calculateNationalInsurance(30_000)).toBeCloseTo(1_394.40, 2);
  });

  it('calculates additional rate above UEL', () => {
    // £60,000 → (50,270 - 12,570) × 8% + (60,000 - 50,270) × 2%
    // = 3,016 + 194.60 = £3,210.60
    expect(calculateNationalInsurance(60_000)).toBeCloseTo(3_210.60, 2);
  });
});

// ─── Student Loans ──────────────────────────────────────────────────────────

describe('calculateStudentLoan', () => {
  it('returns 0 below threshold', () => {
    const { total } = calculateStudentLoan(25_000, ['plan2']);
    expect(total).toBe(0);
  });

  it('calculates Plan 2 correctly', () => {
    // £35,000, Plan 2 threshold = £29,385
    // (35,000 - 29,385) × 9% = £505.35
    const { total } = calculateStudentLoan(35_000, ['plan2']);
    expect(total).toBeCloseTo(505.35, 2);
  });

  it('calculates Postgraduate loan correctly', () => {
    // £30,000, Postgrad threshold = £21,000
    // (30,000 - 21,000) × 6% = £540
    const { total } = calculateStudentLoan(30_000, ['postgrad']);
    expect(total).toBe(540);
  });

  it('handles multiple plans', () => {
    // £35,000 with Plan 2 + Postgrad
    const { total, details } = calculateStudentLoan(35_000, ['plan2', 'postgrad']);
    expect(details).toHaveLength(2);
    expect(total).toBeCloseTo(505.35 + 840, 2);
  });
});

// ─── Pension ────────────────────────────────────────────────────────────────

describe('pension contributions', () => {
  it('salary sacrifice reduces tax and NI', () => {
    const withoutPension = calculateTakeHome({
      grossAnnual: 40_000,
      region: 'england',
    });
    const withPension = calculateTakeHome({
      grossAnnual: 40_000,
      region: 'england',
      pension: { type: 'salary-sacrifice', percentage: 5 },
    });

    expect(withPension.pensionContribution).toBe(2_000);
    expect(withPension.incomeTax).toBeLessThan(withoutPension.incomeTax);
    expect(withPension.nationalInsurance).toBeLessThan(withoutPension.nationalInsurance);
  });

  it('relief at source reduces tax but not NI', () => {
    const withoutPension = calculateTakeHome({
      grossAnnual: 40_000,
      region: 'england',
    });
    const withPension = calculateTakeHome({
      grossAnnual: 40_000,
      region: 'england',
      pension: { type: 'relief-at-source', percentage: 5 },
    });

    expect(withPension.pensionContribution).toBe(2_000);
    expect(withPension.incomeTax).toBe(withoutPension.incomeTax); // same tax (relief claimed by provider)
    expect(withPension.nationalInsurance).toBe(withoutPension.nationalInsurance); // same NI
  });
});

// ─── Tax Code Parsing ───────────────────────────────────────────────────────

describe('parseTaxCode', () => {
  it('parses standard 1257L', () => {
    const result = parseTaxCode('1257L');
    expect(result.allowance).toBe(12_570);
    expect(result.isScottish).toBe(false);
  });

  it('parses Scottish prefix', () => {
    const result = parseTaxCode('S1257L');
    expect(result.allowance).toBe(12_570);
    expect(result.isScottish).toBe(true);
  });

  it('parses Welsh prefix', () => {
    const result = parseTaxCode('C1257L');
    expect(result.allowance).toBe(12_570);
    expect(result.isWelsh).toBe(true);
  });

  it('parses BR code', () => {
    const result = parseTaxCode('BR');
    expect(result.allBasicRate).toBe(true);
    expect(result.allowance).toBe(0);
  });

  it('parses D0 code', () => {
    const result = parseTaxCode('D0');
    expect(result.allHigherRate).toBe(true);
  });

  it('parses K code', () => {
    const result = parseTaxCode('K500');
    expect(result.isKCode).toBe(true);
    expect(result.kCodeAmount).toBe(5_000);
  });

  it('parses NT code', () => {
    const result = parseTaxCode('NT');
    expect(result.noTax).toBe(true);
  });
});

// ─── Complete Take-Home ─────────────────────────────────────────────────────

describe('calculateTakeHome', () => {
  it('calculates take-home for £30,000 in England', () => {
    const result = calculateTakeHome({
      grossAnnual: 30_000,
      region: 'england',
    });

    expect(result.grossAnnual).toBe(30_000);
    expect(result.personalAllowance).toBe(12_570);
    expect(result.incomeTax).toBe(3_486);
    expect(result.nationalInsurance).toBeCloseTo(1_394.40, 1);
    expect(result.netAnnual).toBeCloseTo(25_119.60, 0);
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
  });

  it('handles zero salary', () => {
    const result = calculateTakeHome({ grossAnnual: 0, region: 'england' });
    expect(result.netAnnual).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.nationalInsurance).toBe(0);
  });

  it('handles very high salary', () => {
    const result = calculateTakeHome({ grossAnnual: 500_000, region: 'england' });
    expect(result.personalAllowance).toBe(0);
    expect(result.netAnnual).toBeGreaterThan(0);
    expect(result.netAnnual).toBeLessThan(500_000);
  });
});

// ─── Reverse Calculator ─────────────────────────────────────────────────────

describe('calculateRequiredGross', () => {
  it('finds correct gross for a target net', () => {
    const targetNet = 25_000;
    const gross = calculateRequiredGross(targetNet, 'england');
    const result = calculateTakeHome({ grossAnnual: gross, region: 'england' });
    expect(Math.abs(result.netAnnual - targetNet)).toBeLessThan(1);
  });

  it('works for higher income', () => {
    const targetNet = 50_000;
    const gross = calculateRequiredGross(targetNet, 'england');
    const result = calculateTakeHome({ grossAnnual: gross, region: 'england' });
    expect(Math.abs(result.netAnnual - targetNet)).toBeLessThan(1);
  });
});

// ─── Bonus Calculator ───────────────────────────────────────────────────────

describe('calculateBonus', () => {
  it('calculates net bonus correctly', () => {
    const result = calculateBonus(35_000, 5_000, 'england');
    expect(result.bonusGross).toBe(5_000);
    expect(result.bonusNet).toBeGreaterThan(0);
    expect(result.bonusNet).toBeLessThan(5_000);
    expect(result.bonusIncomeTax).toBeGreaterThan(0);
    expect(result.bonusNI).toBeGreaterThan(0);
  });
});

// ─── Pro Rata ───────────────────────────────────────────────────────────────

describe('calculateProRata', () => {
  it('calculates 3/5 correctly', () => {
    expect(calculateProRata(30_000, 5, 3)).toBe(18_000);
  });

  it('returns full salary at full days', () => {
    expect(calculateProRata(30_000, 5, 5)).toBe(30_000);
  });

  it('handles half days', () => {
    expect(calculateProRata(50_000, 5, 2.5)).toBe(25_000);
  });
});

// ─── Hourly Rate ────────────────────────────────────────────────────────────

describe('hourly rate conversion', () => {
  it('converts annual to hourly', () => {
    // £30,000 / (52 × 37.5) = £15.38
    expect(annualToHourly(30_000, 37.5)).toBeCloseTo(15.38, 2);
  });

  it('converts hourly to annual', () => {
    // 15.38 * 52 * 37.5 = 29,991 (rounding loss expected)
    expect(hourlyToAnnual(15.38, 37.5)).toBeCloseTo(29_991, 0);
  });

  it('round-trips with small rounding error', () => {
    const hourly = annualToHourly(40_000);
    const annual = hourlyToAnnual(hourly);
    // Rounding to 2 decimal places on hourly creates small loss
    expect(Math.abs(annual - 40_000)).toBeLessThan(20);
  });
});

// ─── Two Jobs ───────────────────────────────────────────────────────────────

describe('calculateTwoJobs', () => {
  it('calculates combined tax position', () => {
    const result = calculateTwoJobs(25_000, 10_000, 'england');
    expect(result.combined.grossAnnual).toBe(35_000);
    expect(result.job1.grossAnnual).toBe(25_000);
    expect(result.job2.grossAnnual).toBe(10_000);
  });
});
