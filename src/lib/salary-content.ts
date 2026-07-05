/**
 * Salary Content Generator — produces unique text for each salary amount.
 *
 * Each function uses variationIndex = Math.floor(amount / 1000) % N to select
 * different sentence structures, and embeds mathematically unique calculated
 * values (daily rate, hourly rate, percentage comparisons) so that every page
 * is textually distinct.
 */

import { type CalculationResult } from './uk-tax-engine';
import { formatCurrency, formatPercent } from './format';
import {
  PERSONAL_ALLOWANCE,
  NI_PRIMARY_THRESHOLD,
  NI_MAIN_RATE,
  TAX_YEAR,
} from '../data/tax-rules-2026-27';

// ─── Constants ────────────────────────────────────────────────────────────────

const UK_MEDIAN_SALARY = 35_000;
const WORKING_DAYS_PER_YEAR = 252;
const WORKING_HOURS_PER_YEAR = 52 * 37.5; // 1,950

// ─── Helper: variation selector ──────────────────────────────────────────────

function variationIndex(amount: number, variations: number): number {
  return Math.floor(amount / 1000) % variations;
}

// ─── getBandContext ──────────────────────────────────────────────────────────

export interface BandContext {
  heading: string;
  paragraphs: string[];
}

/**
 * Returns salary band context text unique to the amount. Uses calculated
 * percentages and values that differ for every salary level.
 */
export function getBandContext(amount: number, result: CalculationResult): BandContext {
  const annual = amount * 12;
  const pctOfMedian = ((annual / UK_MEDIAN_SALARY) * 100).toFixed(1);
  const dailyGross = (annual / WORKING_DAYS_PER_YEAR).toFixed(2);
  const hourlyGross = (annual / WORKING_HOURS_PER_YEAR).toFixed(2);
  const dailyNet = (result.netAnnual / WORKING_DAYS_PER_YEAR).toFixed(2);
  const hourlyNet = (result.netAnnual / WORKING_HOURS_PER_YEAR).toFixed(2);
  const taxPerDay = ((result.incomeTax + result.nationalInsurance) / WORKING_DAYS_PER_YEAR).toFixed(2);
  const netRetention = ((result.netAnnual / annual) * 100).toFixed(1);
  const deductionPence = (((result.incomeTax + result.nationalInsurance) / annual) * 100).toFixed(1);

  const idx = variationIndex(amount, 5);

  const headings = [
    `Contextualising Your ${formatCurrency(amount)} Monthly Earnings`,
    `Putting ${formatCurrency(amount)} Per Month Into Perspective`,
    `How ${formatCurrency(amount)} Monthly Compares to UK Benchmarks`,
    `${formatCurrency(amount)} Per Month: Where You Stand in the UK`,
    `Understanding Your ${formatCurrency(amount)} Salary in National Context`,
  ];

  const paragraphs: string[][] = [
    [
      `At ${formatCurrency(amount)} per month, your gross annual salary of ${formatCurrency(annual)} represents ${pctOfMedian}% of the UK median salary of ${formatCurrency(UK_MEDIAN_SALARY)}. Broken down to working days, you earn ${formatCurrency(Number(dailyGross))} gross per working day and ${formatCurrency(Number(dailyNet))} net per working day after deductions. Your hourly gross rate works out to ${formatCurrency(Number(hourlyGross))}, while your net hourly rate after all deductions is ${formatCurrency(Number(hourlyNet))}.`,
      `For every pound you earn, you retain ${netRetention}p after income tax and National Insurance. Put differently, ${deductionPence}p of every pound goes to HMRC. Each working day, ${formatCurrency(Number(taxPerDay))} leaves your pay in deductions before you see any of it.`,
    ],
    [
      `Your monthly salary of ${formatCurrency(amount)} translates to ${formatCurrency(Number(dailyGross))} for each of the ${WORKING_DAYS_PER_YEAR} working days in a typical year, or ${formatCurrency(Number(hourlyGross))} for every hour of a 37.5-hour working week. After the ${TAX_YEAR} income tax and National Insurance deductions, your effective daily rate falls to ${formatCurrency(Number(dailyNet))} and your hourly rate to ${formatCurrency(Number(hourlyNet))}.`,
      `Your annual income of ${formatCurrency(annual)} is ${pctOfMedian}% of the UK median. You keep ${netRetention}% of your gross pay, with the remaining ${deductionPence}% covering your total tax liability of ${formatCurrency(result.incomeTax + result.nationalInsurance)} per year.`,
    ],
    [
      `Earning ${formatCurrency(amount)} monthly means your ${formatCurrency(annual)} annual income sits at ${pctOfMedian}% relative to the national median of ${formatCurrency(UK_MEDIAN_SALARY)}. On a per-working-day basis, you earn ${formatCurrency(Number(dailyGross))} before tax and ${formatCurrency(Number(dailyNet))} after tax. Your HMRC deductions work out to ${formatCurrency(Number(taxPerDay))} per working day.`,
      `Your retention rate is ${netRetention}%, meaning for every ${formatCurrency(100)} you earn, ${formatCurrency(Number((100 - Number(netRetention)).toFixed(2)))} goes to income tax and National Insurance. Your effective hourly rate after deductions is ${formatCurrency(Number(hourlyNet))}, compared to the headline rate of ${formatCurrency(Number(hourlyGross))}.`,
    ],
    [
      `With a gross monthly salary of ${formatCurrency(amount)}, you earn ${formatCurrency(Number(hourlyGross))} per hour across a standard 37.5-hour week. Your annual income of ${formatCurrency(annual)} equates to ${pctOfMedian}% of the UK median full-time salary. After income tax of ${formatCurrency(result.incomeTax)} and National Insurance of ${formatCurrency(result.nationalInsurance)}, your net daily rate across ${WORKING_DAYS_PER_YEAR} working days is ${formatCurrency(Number(dailyNet))}.`,
      `The combined deduction rate of ${deductionPence}% means you take home ${formatCurrency(Number(hourlyNet))} per hour net. Over a full working year, your total deductions of ${formatCurrency(result.totalDeductions)} average ${formatCurrency(Number(taxPerDay))} per working day.`,
    ],
    [
      `A salary of ${formatCurrency(amount)} per month gives you ${formatCurrency(annual)} gross per annum, positioning you at ${pctOfMedian}% of the national median. Expressed as a daily working rate, that is ${formatCurrency(Number(dailyGross))} before tax or ${formatCurrency(Number(dailyNet))} after all deductions including income tax and NI.`,
      `Your combined deductions total ${formatCurrency(result.incomeTax + result.nationalInsurance)} annually, representing ${deductionPence}% of gross income. Each hour of your 37.5-hour week earns you ${formatCurrency(Number(hourlyNet))} net, and you retain ${netRetention}p of every pound earned.`,
    ],
  ];

  return {
    heading: headings[idx],
    paragraphs: paragraphs[idx],
  };
}

// ─── getCareerDescription ────────────────────────────────────────────────────

/**
 * Returns unique career-related text that embeds the exact salary amount
 * and related calculations.
 */
export function getCareerDescription(amount: number): string {
  const annual = amount * 12;
  const hourlyEquiv = (annual / WORKING_HOURS_PER_YEAR).toFixed(2);
  const weeklyEquiv = (annual / 52).toFixed(2);
  const pctMedian = ((annual / UK_MEDIAN_SALARY) * 100).toFixed(1);
  const nextMilestone = Math.ceil(annual / 5000) * 5000;
  const gapToNext = nextMilestone - annual;
  const monthlyGapToNext = (gapToNext / 12).toFixed(2);

  const idx = variationIndex(amount, 4);

  const descriptions = [
    `At ${formatCurrency(amount)} per month (${formatCurrency(annual)} annually, or ${formatCurrency(Number(hourlyEquiv))} per hour), you earn ${pctMedian}% of the UK median. The next common salary milestone is ${formatCurrency(nextMilestone)}, which is ${formatCurrency(gapToNext)} above your current annual salary. Reaching that milestone would require a monthly increase of ${formatCurrency(Number(monthlyGapToNext))}. Workers at this level typically hold roles requiring ${annual < 20000 ? 'entry-level skills and basic qualifications' : annual < 30000 ? 'demonstrated competence and a year or more of experience' : annual < 40000 ? 'specialist skills or supervisory responsibilities' : 'significant expertise or management experience'}.`,

    `Your salary of ${formatCurrency(amount)} per month equates to ${formatCurrency(Number(weeklyEquiv))} per week or ${formatCurrency(Number(hourlyEquiv))} per hour for a full-time worker. At ${pctMedian}% of the national median salary, you are ${annual >= UK_MEDIAN_SALARY ? `${formatCurrency(annual - UK_MEDIAN_SALARY)} above` : `${formatCurrency(UK_MEDIAN_SALARY - annual)} below`} the typical UK earner. The next significant salary threshold is ${formatCurrency(nextMilestone)}, requiring a rise of ${formatCurrency(gapToNext)} per year or ${formatCurrency(Number(monthlyGapToNext))} per month.`,

    `Professionals earning ${formatCurrency(amount)} per month take home ${formatCurrency(Number(weeklyEquiv))} weekly before tax. This ${formatCurrency(annual)} annual salary puts you at ${pctMedian}% of the UK median income. To reach the next round-number milestone of ${formatCurrency(nextMilestone)} per year, you would need an additional ${formatCurrency(gapToNext)} annually, equivalent to roughly ${formatCurrency(Number(monthlyGapToNext))} more per month. Your hourly equivalent of ${formatCurrency(Number(hourlyEquiv))} is ${Number(hourlyEquiv) > 12.21 ? `above the National Living Wage of £12.21` : `close to the National Living Wage`}.`,

    `Earning ${formatCurrency(annual)} per year (${formatCurrency(amount)} monthly, ${formatCurrency(Number(hourlyEquiv))} hourly), your income represents ${pctMedian}% of the UK median of ${formatCurrency(UK_MEDIAN_SALARY)}. The gap between your salary and the next milestone of ${formatCurrency(nextMilestone)} is ${formatCurrency(gapToNext)}, which divided across 12 months comes to ${formatCurrency(Number(monthlyGapToNext))} per month. Your weekly pre-tax earnings of ${formatCurrency(Number(weeklyEquiv))} must cover all living expenses after deductions.`,
  ];

  return descriptions[idx];
}

// ─── getTaxTips ──────────────────────────────────────────────────────────────

export interface TaxTip {
  title: string;
  detail: string;
}

/**
 * Returns personalised tax tips with calculated savings specific to this salary amount.
 */
export function getTaxTips(amount: number, result: CalculationResult): TaxTip[] {
  const annual = amount * 12;
  const marginalRate = result.marginalTaxRate;
  const tips: TaxTip[] = [];

  // Pension salary sacrifice calculation
  const pensionSacrifice5pct = annual * 0.05;
  const taxSavedOnPension = pensionSacrifice5pct * (marginalRate / 100);
  tips.push({
    title: 'Pension salary sacrifice savings',
    detail: `If you contribute 5% of your ${formatCurrency(annual)} salary (${formatCurrency(pensionSacrifice5pct)} per year) through salary sacrifice, you save approximately ${formatCurrency(taxSavedOnPension)} per year in combined income tax and NI. That is ${formatCurrency(taxSavedOnPension / 12)} more in your pension each month at no extra cost to your take-home pay. The effective cost to you is only ${formatCurrency(pensionSacrifice5pct - taxSavedOnPension)} per year.`,
  });

  // Cycle to work
  const cycleSchemeValue = 1000;
  const cycleSaving = cycleSchemeValue * (marginalRate / 100);
  tips.push({
    title: 'Cycle to Work scheme',
    detail: `Through the Cycle to Work scheme, a ${formatCurrency(cycleSchemeValue)} bicycle effectively costs you ${formatCurrency(cycleSchemeValue - cycleSaving)} because the salary sacrifice saves you ${formatCurrency(cycleSaving)} in tax and NI. On your marginal rate of ${formatPercent(marginalRate)}, every ${formatCurrency(100)} of salary sacrifice saves you ${formatCurrency(marginalRate)} in deductions.`,
  });

  // ISA interest
  const isaBalance = annual * 0.5;
  const isaReturn4pct = isaBalance * 0.04;
  tips.push({
    title: 'ISA tax-free savings potential',
    detail: `If you accumulated savings equal to half your annual salary (${formatCurrency(isaBalance)}) in a Stocks and Shares ISA earning 4% annually, your tax-free return would be ${formatCurrency(isaReturn4pct)} per year, or ${formatCurrency(isaReturn4pct / 12)} per month. Outside an ISA, a basic rate taxpayer would lose ${formatCurrency(isaReturn4pct * 0.20)} of that to tax.`,
  });

  // Marriage Allowance (if below PA)
  if (annual <= PERSONAL_ALLOWANCE) {
    const transferable = 1260;
    const partnerSaving = transferable * 0.20;
    tips.push({
      title: 'Marriage Allowance transfer',
      detail: `Since your ${formatCurrency(annual)} salary is below the Personal Allowance of ${formatCurrency(PERSONAL_ALLOWANCE)}, you have ${formatCurrency(PERSONAL_ALLOWANCE - annual)} of unused allowance. You can transfer up to ${formatCurrency(transferable)} to a basic-rate taxpayer spouse, saving them ${formatCurrency(partnerSaving)} per year (${formatCurrency(partnerSaving / 12)} per month). This is free money with no downside for you.`,
    });
  }

  // Work from home allowance
  const wfhRelief = 6 * 52 * 0.20;
  tips.push({
    title: 'Working from home tax relief',
    detail: `If you work from home regularly, you can claim tax relief of £6 per week without receipts. On your ${formatCurrency(annual)} salary, this produces a tax saving of ${formatCurrency(wfhRelief)} per year (${formatCurrency(wfhRelief / 12)} per month). Over five years that adds up to ${formatCurrency(wfhRelief * 5)}.`,
  });

  // Unique tip based on variation
  const idx = variationIndex(amount, 3);
  const uniqueTips: TaxTip[] = [
    {
      title: 'Charitable donations via Gift Aid',
      detail: `If you donate ${formatCurrency(amount * 0.01)} per month to charity (1% of your gross monthly pay), Gift Aid adds 25%, making your donation worth ${formatCurrency(amount * 0.01 * 1.25)} to the charity. Over a tax year, your total giving of ${formatCurrency(amount * 0.01 * 12)} becomes ${formatCurrency(amount * 0.01 * 12 * 1.25)} for the charity at no extra cost to you.`,
    },
    {
      title: 'Professional subscription tax relief',
      detail: `If you pay for professional body memberships (e.g., ${formatCurrency(200)} per year), you can claim tax relief at your marginal rate of ${formatPercent(marginalRate)}. That means a refund of ${formatCurrency(200 * marginalRate / 100)} per year from HMRC. On your salary of ${formatCurrency(annual)}, even small claims like uniform washing allowance (£60/year, saving ${formatCurrency(60 * 0.20)}) add up over time.`,
    },
    {
      title: 'Employer pension matching',
      detail: `If your employer matches pension contributions up to 5%, that is ${formatCurrency(annual * 0.05)} per year of free money added to your pension pot. Combined with your own 5% contribution of ${formatCurrency(annual * 0.05)}, your pension grows by ${formatCurrency(annual * 0.10)} per year, which is ${formatCurrency(annual * 0.10 / 12)} per month. After ${Math.round(20 * annual * 0.10)} in contributions over 20 years, compound growth significantly multiplies this amount.`,
    },
  ];
  tips.push(uniqueTips[idx]);

  return tips;
}

// ─── buildFaqs ───────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Builds additional FAQs unique to each salary amount using precise calculations.
 */
export function buildFaqs(amount: number, result: CalculationResult): FaqItem[] {
  const annual = amount * 12;
  const hourlyGross = (annual / WORKING_HOURS_PER_YEAR).toFixed(2);
  const hourlyNet = (result.netAnnual / WORKING_HOURS_PER_YEAR).toFixed(2);
  const dailyNet = (result.netAnnual / WORKING_DAYS_PER_YEAR).toFixed(2);
  const weeklyNet = (result.netAnnual / 52).toFixed(2);
  const pctRetention = ((result.netAnnual / annual) * 100).toFixed(1);
  const pctMedian = ((annual / UK_MEDIAN_SALARY) * 100).toFixed(1);
  const monthlyNet = result.netAnnual / 12;

  const faqs: FaqItem[] = [];

  faqs.push({
    question: `What is the daily take-home pay on ${formatCurrency(amount)} per month?`,
    answer: `On a salary of ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year), your daily take-home pay is ${formatCurrency(Number(dailyNet))} based on ${WORKING_DAYS_PER_YEAR} working days per year. This is after income tax of ${formatCurrency(result.incomeTax)} and National Insurance of ${formatCurrency(result.nationalInsurance)} have been deducted for the ${TAX_YEAR} tax year.`,
  });

  faqs.push({
    question: `What percentage of ${formatCurrency(amount)} per month do I keep after tax?`,
    answer: `You keep ${pctRetention}% of your ${formatCurrency(amount)} monthly salary after income tax and National Insurance. That means from your ${formatCurrency(annual)} annual gross, you receive ${formatCurrency(result.netAnnual)} net. For every £1 earned, ${(Number(pctRetention) / 100).toFixed(2)}p reaches your bank account.`,
  });

  faqs.push({
    question: `How does ${formatCurrency(amount)} per month compare to the UK average?`,
    answer: `A salary of ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year) is ${pctMedian}% of the UK median full-time salary of ${formatCurrency(UK_MEDIAN_SALARY)}. You are ${annual >= UK_MEDIAN_SALARY ? `${formatCurrency(annual - UK_MEDIAN_SALARY)} above` : `${formatCurrency(UK_MEDIAN_SALARY - annual)} below`} the median. Your weekly take-home of ${formatCurrency(Number(weeklyNet))} compares to the median take-home of approximately ${formatCurrency(UK_MEDIAN_SALARY * 0.76 / 52)}.`,
  });

  faqs.push({
    question: `What is the hourly rate for ${formatCurrency(amount)} per month after tax?`,
    answer: `Based on a 37.5-hour week, ${formatCurrency(amount)} per month equates to ${formatCurrency(Number(hourlyGross))} per hour before tax and ${formatCurrency(Number(hourlyNet))} per hour after income tax and NI for ${TAX_YEAR}. Your deductions reduce your hourly rate by ${formatCurrency(Number(hourlyGross) - Number(hourlyNet))} per hour.`,
  });

  // Unique FAQ based on amount variation
  const idx = variationIndex(amount, 3);
  const uniqueFaqs: FaqItem[] = [
    {
      question: `Can I afford a mortgage on ${formatCurrency(amount)} per month?`,
      answer: `On a salary of ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year), most lenders would offer you between ${formatCurrency(annual * 4)} and ${formatCurrency(annual * 4.5)} as a mortgage. Your monthly take-home of ${formatCurrency(monthlyNet)} means a comfortable mortgage payment would be up to ${formatCurrency(monthlyNet * 0.28)} (28% of net income). At current average rates, this supports a property price of approximately ${formatCurrency(annual * 4.25)} plus your deposit.`,
    },
    {
      question: `How much should I save each month on ${formatCurrency(amount)} per month?`,
      answer: `Financial advisors recommend saving at least 20% of your net income. On ${formatCurrency(amount)} per month with take-home pay of ${formatCurrency(monthlyNet)}, that means saving ${formatCurrency(monthlyNet * 0.20)} per month or ${formatCurrency(monthlyNet * 0.20 * 12)} per year. Even 10% (${formatCurrency(monthlyNet * 0.10)} per month) builds to ${formatCurrency(monthlyNet * 0.10 * 12)} per year, which accumulates to ${formatCurrency(monthlyNet * 0.10 * 60)} over five years before any interest.`,
    },
    {
      question: `What is the effective tax rate on ${formatCurrency(amount)} per month?`,
      answer: `On ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year), your effective tax rate is ${formatPercent(result.effectiveTaxRate)}, meaning ${formatCurrency(result.incomeTax + result.nationalInsurance)} goes to HMRC from your ${formatCurrency(annual)} gross salary. This is lower than your marginal rate of ${formatPercent(result.marginalTaxRate)} because the first ${formatCurrency(PERSONAL_ALLOWANCE)} is tax-free and NI only applies above ${formatCurrency(NI_PRIMARY_THRESHOLD)}.`,
    },
  ];
  faqs.push(uniqueFaqs[idx]);

  return faqs;
}

// ─── getRaiseSimulation ──────────────────────────────────────────────────────

export interface RaiseSimulation {
  heading: string;
  scenarios: { label: string; detail: string }[];
  summary: string;
}

/**
 * Simulates pay raise scenarios showing exact take-home impact for this salary.
 */
export function getRaiseSimulation(amount: number, result: CalculationResult): RaiseSimulation {
  const annual = amount * 12;
  const marginalRate = result.marginalTaxRate;
  const retentionRate = 1 - (marginalRate / 100);

  const raises = [
    { pct: 3, label: '3% raise (inflation match)' },
    { pct: 5, label: '5% raise' },
    { pct: 10, label: '10% raise (promotion)' },
    { pct: 20, label: '20% raise (career jump)' },
  ];

  const scenarios = raises.map(({ pct, label }) => {
    const raiseGross = annual * (pct / 100);
    const raiseNet = raiseGross * retentionRate;
    const raiseMonthlyNet = raiseNet / 12;
    const newGrossMonthly = amount + (raiseGross / 12);
    return {
      label,
      detail: `A ${pct}% raise adds ${formatCurrency(raiseGross)} gross per year (${formatCurrency(raiseGross / 12)}/month). After tax at your marginal rate of ${formatPercent(marginalRate)}, you keep ${formatCurrency(raiseNet)} per year extra, or ${formatCurrency(raiseMonthlyNet)} more per month. Your new gross monthly would be ${formatCurrency(newGrossMonthly)}.`,
    };
  });

  const idx = variationIndex(amount, 3);
  const headings = [
    `What a Pay Rise Means for Your ${formatCurrency(amount)}/Month Salary`,
    `Pay Rise Scenarios: Impact on Your ${formatCurrency(amount)} Monthly Take-Home`,
    `How Different Raises Affect Your ${formatCurrency(amount)}/Month Net Pay`,
  ];

  const summaries = [
    `At your current marginal rate of ${formatPercent(marginalRate)}, you keep ${formatCurrency(retentionRate * 100, true)} of every additional pound earned. A £1,000 pay rise adds ${formatCurrency(1000 * retentionRate)} to your annual take-home, or ${formatCurrency(1000 * retentionRate / 12)} per month.`,
    `Every additional pound you earn at ${formatCurrency(amount)} per month is taxed at ${formatPercent(marginalRate)} (your marginal rate), leaving you with ${formatCurrency(retentionRate * 100, true)}p. To increase your monthly take-home by ${formatCurrency(100)}, you would need a gross pay rise of ${formatCurrency(100 / retentionRate)} per month (${formatCurrency(1200 / retentionRate)} per year).`,
    `Your marginal deduction rate of ${formatPercent(marginalRate)} means that from every pay rise pound, HMRC takes ${formatCurrency(marginalRate)}p and you keep ${formatCurrency(retentionRate * 100, true)}p. Over the course of a year, even modest percentage increases compound: a 3% annual raise maintained over five years would lift your salary from ${formatCurrency(amount)} to approximately ${formatCurrency(amount * Math.pow(1.03, 5))} per month.`,
  ];

  return {
    heading: headings[idx],
    scenarios,
    summary: summaries[idx],
  };
}

// ─── getBudgetBreakdown ──────────────────────────────────────────────────────

export interface BudgetCategory {
  name: string;
  amount: number;
  formatted: string;
  weeklyFormatted: string;
  percentage: number;
  note: string;
}

/**
 * Generates a detailed budget breakdown unique to the net monthly amount.
 */
export function getBudgetBreakdown(netMonthly: number): BudgetCategory[] {
  const categories = [
    { name: 'Housing', pct: 0.30, noteTemplate: (amt: number) => `Covers rent or mortgage up to ${formatCurrency(amt)} in most UK regions outside London` },
    { name: 'Utilities and bills', pct: 0.12, noteTemplate: (amt: number) => `Council tax, energy (${formatCurrency(amt * 0.4)}), water (${formatCurrency(amt * 0.15)}), broadband (${formatCurrency(amt * 0.25)}), phone (${formatCurrency(amt * 0.2)})` },
    { name: 'Groceries', pct: 0.12, noteTemplate: (amt: number) => `Approximately ${formatCurrency(amt / 4.33)} per week for food shopping` },
    { name: 'Transport', pct: 0.10, noteTemplate: (amt: number) => `Covers a monthly travel pass or car fuel of ${formatCurrency(amt)} per month` },
    { name: 'Savings', pct: 0.10, noteTemplate: (amt: number) => `Builds to ${formatCurrency(amt * 12)} per year or ${formatCurrency(amt * 60)} over five years` },
    { name: 'Pension top-up', pct: 0.05, noteTemplate: (amt: number) => `Additional voluntary contribution of ${formatCurrency(amt)}, which costs only ${formatCurrency(amt * 0.72)} after tax relief` },
    { name: 'Leisure and entertainment', pct: 0.08, noteTemplate: (amt: number) => `About ${formatCurrency(amt / 4.33)} per week for socialising, hobbies, and subscriptions` },
    { name: 'Personal care', pct: 0.05, noteTemplate: (amt: number) => `Clothing, haircuts, toiletries totalling ${formatCurrency(amt)} monthly` },
    { name: 'Buffer for unexpected costs', pct: 0.08, noteTemplate: (amt: number) => `Emergency reserve of ${formatCurrency(amt)} per month, building to ${formatCurrency(amt * 6)} in six months` },
  ];

  return categories.map((cat) => {
    const amt = netMonthly * cat.pct;
    return {
      name: cat.name,
      amount: amt,
      formatted: formatCurrency(amt),
      weeklyFormatted: formatCurrency(amt / 4.33),
      percentage: cat.pct * 100,
      note: cat.noteTemplate(amt),
    };
  });
}

// ─── getUniqueComparisons ────────────────────────────────────────────────────

export interface SalaryComparison {
  heading: string;
  comparisons: string[];
}

/**
 * Generates comparisons to adjacent salaries with precise percentage differences.
 */
export function getUniqueComparisons(amount: number, result: CalculationResult): SalaryComparison {
  const annual = amount * 12;
  const netMonthly = result.netAnnual / 12;

  // Compare to specific reference points
  const comparisons: string[] = [];

  // Compare to £50 more
  const fiftyMore = amount + 50;
  const fiftyMoreAnnual = fiftyMore * 12;
  const fiftyMoreTaxable = Math.max(0, fiftyMoreAnnual - PERSONAL_ALLOWANCE);
  const currentTaxable = Math.max(0, annual - PERSONAL_ALLOWANCE);
  const additionalTaxOn600 = (fiftyMoreTaxable - currentTaxable) * 0.20;
  const additionalNIOn600 = fiftyMoreAnnual > NI_PRIMARY_THRESHOLD ? 600 * NI_MAIN_RATE : 0;
  const netGainFrom50More = 600 - additionalTaxOn600 - additionalNIOn600;

  comparisons.push(
    `Earning ${formatCurrency(fiftyMore)} per month instead of ${formatCurrency(amount)} adds ${formatCurrency(600)} gross per year. After approximately ${formatCurrency(additionalTaxOn600)} extra income tax and ${formatCurrency(additionalNIOn600)} extra NI, your net gain is roughly ${formatCurrency(netGainFrom50More)} per year, or ${formatCurrency(netGainFrom50More / 12)} per month.`
  );

  // Compare to £100 more
  const hundredMore = amount + 100;
  const netGainFrom100More = netGainFrom50More * 2;
  comparisons.push(
    `A jump from ${formatCurrency(amount)} to ${formatCurrency(hundredMore)} per month (${formatCurrency(1200)} more annually) yields approximately ${formatCurrency(netGainFrom100More)} additional take-home per year after deductions. That works out to ${formatCurrency(netGainFrom100More / 12)} more per month in your bank account.`
  );

  // Compare to median
  const medianMonthly = Math.round(UK_MEDIAN_SALARY / 12);
  const diffFromMedian = amount - medianMonthly;
  const pctDiff = ((diffFromMedian / medianMonthly) * 100).toFixed(1);
  comparisons.push(
    `Compared to the UK median monthly salary of approximately ${formatCurrency(medianMonthly)}, your ${formatCurrency(amount)} is ${diffFromMedian >= 0 ? `${formatCurrency(diffFromMedian)} higher` : `${formatCurrency(Math.abs(diffFromMedian))} lower`} (${diffFromMedian >= 0 ? '+' : ''}${pctDiff}%). ${diffFromMedian >= 0 ? `You earn ${formatCurrency(diffFromMedian * 12)} more per year than the typical UK worker.` : `The gap of ${formatCurrency(Math.abs(diffFromMedian) * 12)} per year may be bridged through experience, qualifications, or a sector change.`}`
  );

  // Tax efficiency comparison
  const taxEfficiency = ((result.netAnnual / annual) * 100).toFixed(2);
  const grossForSameNet = result.netAnnual / 0.72; // what a higher rate payer would need
  comparisons.push(
    `Your tax efficiency is ${taxEfficiency}% (net / gross). A higher-rate taxpayer would need to earn approximately ${formatCurrency(grossForSameNet)} gross per year to achieve the same take-home of ${formatCurrency(result.netAnnual)}, because their marginal deductions are higher.`
  );

  // Working time comparison
  const hoursForRent = (netMonthly * 0.30) / (result.netAnnual / WORKING_HOURS_PER_YEAR);
  comparisons.push(
    `On your net hourly rate of ${formatCurrency(result.netAnnual / WORKING_HOURS_PER_YEAR)}, paying 30% of income on housing (${formatCurrency(netMonthly * 0.30)}) requires ${hoursForRent.toFixed(1)} hours of work per month, or roughly ${(hoursForRent / 4.33).toFixed(1)} hours per week dedicated solely to housing costs.`
  );

  const idx = variationIndex(amount, 3);
  const headings = [
    `How ${formatCurrency(amount)} Per Month Compares to Other Salary Levels`,
    `Salary Comparisons: ${formatCurrency(amount)} Monthly in Context`,
    `${formatCurrency(amount)} Per Month vs Other Income Levels`,
  ];

  return {
    heading: headings[idx],
    comparisons,
  };
}
