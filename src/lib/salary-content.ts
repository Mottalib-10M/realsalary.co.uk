/**
 * Salary Content Generator — produces unique text for each salary amount.
 *
 * Each function uses a prime-hash based variationIndex to select different
 * sentence structures, ensuring every page receives a distinct variant.
 * Calculated values (daily rate, hourly rate, percentage comparisons) are
 * also embedded so that every page is textually distinct.
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

/**
 * Uses prime multiplication to scatter variation indices so that adjacent
 * salary amounts (e.g. £1,000 and £1,050) always land on different variants.
 * The old formula (Math.floor(amount/1000) % N) grouped every amount in the
 * same £1,000 band to the identical variant, causing ~72% content duplication.
 */
function variationIndex(amount: number, variations: number): number {
  const hash = ((amount * 3 + 3) * 7) % 997;
  return hash % variations;
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

  const weeklyGross = (annual / 52).toFixed(2);
  const weeklyNet = (result.netAnnual / 52).toFixed(2);
  const fortnightlyNet = (result.netAnnual / 26).toFixed(2);
  const totalDeductionsMonthly = ((result.incomeTax + result.nationalInsurance) / 12).toFixed(2);

  const idx = variationIndex(amount, 10);

  const headings = [
    `Contextualising Your ${formatCurrency(amount)} Monthly Earnings`,
    `Putting ${formatCurrency(amount)} Per Month Into Perspective`,
    `How ${formatCurrency(amount)} Monthly Compares to UK Benchmarks`,
    `${formatCurrency(amount)} Per Month: Where You Stand in the UK`,
    `Understanding Your ${formatCurrency(amount)} Salary in National Context`,
    `A Closer Look at ${formatCurrency(amount)} Monthly in the UK Economy`,
    `${formatCurrency(amount)} Per Month: Breaking Down the Numbers`,
    `What ${formatCurrency(amount)} Monthly Really Means After Deductions`,
    `The True Value of ${formatCurrency(amount)} Per Month in ${TAX_YEAR}`,
    `${formatCurrency(amount)} Monthly: From Gross Pay to Real Spending Power`,
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
    [
      `On ${formatCurrency(amount)} per month, your weekly gross earnings come to ${formatCurrency(Number(weeklyGross))} and your weekly take-home is ${formatCurrency(Number(weeklyNet))} after all deductions. Across a full year, HMRC collects ${formatCurrency(result.incomeTax + result.nationalInsurance)} from your ${formatCurrency(annual)} gross salary, which works out to ${formatCurrency(Number(totalDeductionsMonthly))} leaving your pay every month.`,
      `At ${pctOfMedian}% of the UK median salary, your retention rate of ${netRetention}% means you keep ${formatCurrency(Number(dailyNet))} of every working day's earnings. The gap between your gross hourly rate of ${formatCurrency(Number(hourlyGross))} and your net hourly rate of ${formatCurrency(Number(hourlyNet))} represents what the tax system takes from each hour you work.`,
    ],
    [
      `Your ${formatCurrency(amount)} monthly salary breaks down to ${formatCurrency(Number(fortnightlyNet))} every fortnight after deductions, or ${formatCurrency(Number(weeklyNet))} per week in real spending power. The ${formatCurrency(annual)} annual gross sits at ${pctOfMedian}% of the national median, and your total deductions of ${formatCurrency(result.totalDeductions)} represent ${deductionPence}% of everything you earn.`,
      `Every working day, you generate ${formatCurrency(Number(dailyGross))} of gross income but take home ${formatCurrency(Number(dailyNet))}, with the remaining ${formatCurrency(Number(taxPerDay))} going to income tax and National Insurance. Your net hourly rate of ${formatCurrency(Number(hourlyNet))} is the truest measure of what your time is worth after the government takes its share.`,
    ],
    [
      `Looking at ${formatCurrency(amount)} per month through the lens of daily earnings, you gross ${formatCurrency(Number(dailyGross))} per working day but keep ${formatCurrency(Number(dailyNet))} after deductions. That daily deduction of ${formatCurrency(Number(taxPerDay))} funds public services through your ${formatCurrency(result.incomeTax)} annual income tax and ${formatCurrency(result.nationalInsurance)} National Insurance contributions.`,
      `Your ${formatCurrency(annual)} annual income reaches ${pctOfMedian}% of the UK median. On a weekly basis, your gross of ${formatCurrency(Number(weeklyGross))} becomes ${formatCurrency(Number(weeklyNet))} after tax, and your net retention rate of ${netRetention}% determines exactly how much spending power each payday delivers to your bank account.`,
    ],
    [
      `Measured against the UK median of ${formatCurrency(UK_MEDIAN_SALARY)}, your ${formatCurrency(amount)} monthly salary (${formatCurrency(annual)} per year) places you at ${pctOfMedian}%. Your fortnightly take-home of ${formatCurrency(Number(fortnightlyNet))} reflects the ${deductionPence}% combined deduction rate applied to your gross earnings, leaving you with ${netRetention}p of every pound earned.`,
      `On an hourly basis, the difference between your gross rate of ${formatCurrency(Number(hourlyGross))} and net rate of ${formatCurrency(Number(hourlyNet))} shows exactly what HMRC collects from each working hour. Over ${WORKING_DAYS_PER_YEAR} working days, your total deductions of ${formatCurrency(result.totalDeductions)} average ${formatCurrency(Number(taxPerDay))} per day.`,
    ],
    [
      `Your ${formatCurrency(amount)} monthly pay packet translates to ${formatCurrency(Number(weeklyNet))} per week and ${formatCurrency(Number(dailyNet))} per working day after income tax and National Insurance. The ${formatCurrency(annual)} annual gross places you at ${pctOfMedian}% of the UK median, and your total yearly deductions of ${formatCurrency(result.totalDeductions)} consume ${deductionPence}% of your gross income.`,
      `In practical terms, you retain ${netRetention}p from every pound and your effective hourly rate after all deductions is ${formatCurrency(Number(hourlyNet))}, compared to the headline figure of ${formatCurrency(Number(hourlyGross))}. Each month, ${formatCurrency(Number(totalDeductionsMonthly))} leaves your pay before it reaches your bank account, covering both income tax and National Insurance.`,
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

  const dailyEquiv = (annual / WORKING_DAYS_PER_YEAR).toFixed(2);
  const diffFromMedian = annual - UK_MEDIAN_SALARY;
  const diffDirection = diffFromMedian >= 0 ? `${formatCurrency(diffFromMedian)} above` : `${formatCurrency(Math.abs(diffFromMedian))} below`;
  const roleLevel = annual < 20000 ? 'entry-level skills and basic qualifications' : annual < 30000 ? 'demonstrated competence and a year or more of experience' : annual < 40000 ? 'specialist skills or supervisory responsibilities' : 'significant expertise or management experience';
  const nlwComparison = Number(hourlyEquiv) > 12.21 ? `above the National Living Wage of £12.21` : `close to the National Living Wage`;

  const idx = variationIndex(amount, 10);

  const descriptions = [
    `At ${formatCurrency(amount)} per month (${formatCurrency(annual)} annually, or ${formatCurrency(Number(hourlyEquiv))} per hour), you earn ${pctMedian}% of the UK median. The next common salary milestone is ${formatCurrency(nextMilestone)}, which is ${formatCurrency(gapToNext)} above your current annual salary. Reaching that milestone would require a monthly increase of ${formatCurrency(Number(monthlyGapToNext))}. Workers at this level typically hold roles requiring ${roleLevel}.`,

    `Your salary of ${formatCurrency(amount)} per month equates to ${formatCurrency(Number(weeklyEquiv))} per week or ${formatCurrency(Number(hourlyEquiv))} per hour for a full-time worker. At ${pctMedian}% of the national median salary, you are ${diffDirection} the typical UK earner. The next significant salary threshold is ${formatCurrency(nextMilestone)}, requiring a rise of ${formatCurrency(gapToNext)} per year or ${formatCurrency(Number(monthlyGapToNext))} per month.`,

    `Professionals earning ${formatCurrency(amount)} per month take home ${formatCurrency(Number(weeklyEquiv))} weekly before tax. This ${formatCurrency(annual)} annual salary puts you at ${pctMedian}% of the UK median income. To reach the next round-number milestone of ${formatCurrency(nextMilestone)} per year, you would need an additional ${formatCurrency(gapToNext)} annually, equivalent to roughly ${formatCurrency(Number(monthlyGapToNext))} more per month. Your hourly equivalent of ${formatCurrency(Number(hourlyEquiv))} is ${nlwComparison}.`,

    `Earning ${formatCurrency(annual)} per year (${formatCurrency(amount)} monthly, ${formatCurrency(Number(hourlyEquiv))} hourly), your income represents ${pctMedian}% of the UK median of ${formatCurrency(UK_MEDIAN_SALARY)}. The gap between your salary and the next milestone of ${formatCurrency(nextMilestone)} is ${formatCurrency(gapToNext)}, which divided across 12 months comes to ${formatCurrency(Number(monthlyGapToNext))} per month. Your weekly pre-tax earnings of ${formatCurrency(Number(weeklyEquiv))} must cover all living expenses after deductions.`,

    `With ${formatCurrency(amount)} landing in your account each month, your annual earnings of ${formatCurrency(annual)} break down to ${formatCurrency(Number(dailyEquiv))} per working day and ${formatCurrency(Number(hourlyEquiv))} per hour. You sit at ${pctMedian}% of the UK median and are ${diffDirection} the national average. Bridging the ${formatCurrency(gapToNext)} gap to the next milestone of ${formatCurrency(nextMilestone)} would require an additional ${formatCurrency(Number(monthlyGapToNext))} per month. Roles at this level typically demand ${roleLevel}.`,

    `The ${formatCurrency(amount)} you receive monthly works out to ${formatCurrency(Number(hourlyEquiv))} for every hour of a standard 37.5-hour week. Over a full year, this ${formatCurrency(annual)} salary represents ${pctMedian}% of the UK median income. At ${formatCurrency(Number(weeklyEquiv))} per week before deductions, you are ${diffDirection} the typical full-time earner. The next salary milestone of ${formatCurrency(nextMilestone)} sits ${formatCurrency(gapToNext)} above your current level, or ${formatCurrency(Number(monthlyGapToNext))} more per month.`,

    `Your ${formatCurrency(amount)} monthly salary translates to a daily working rate of ${formatCurrency(Number(dailyEquiv))} across ${WORKING_DAYS_PER_YEAR} working days. At ${pctMedian}% of the national median, your ${formatCurrency(annual)} annual income places you ${diffDirection} the average UK worker. Your hourly equivalent of ${formatCurrency(Number(hourlyEquiv))} is ${nlwComparison}. To reach ${formatCurrency(nextMilestone)} per year, you would need ${formatCurrency(Number(monthlyGapToNext))} more each month.`,

    `On a per-hour basis, your ${formatCurrency(amount)} monthly salary equates to ${formatCurrency(Number(hourlyEquiv))}, and on a weekly basis to ${formatCurrency(Number(weeklyEquiv))} before any deductions. This ${formatCurrency(annual)} annual gross puts you at ${pctMedian}% relative to the UK median of ${formatCurrency(UK_MEDIAN_SALARY)}, making you ${diffDirection} the midpoint. The distance to your next milestone of ${formatCurrency(nextMilestone)} is ${formatCurrency(gapToNext)} annually, or roughly ${formatCurrency(Number(monthlyGapToNext))} per month.`,

    `Workers at ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year) earn ${formatCurrency(Number(dailyEquiv))} per working day. This places your income at ${pctMedian}% of the UK median, which means you are currently ${diffDirection} the national benchmark. The next commonly cited salary threshold is ${formatCurrency(nextMilestone)}, and closing that ${formatCurrency(gapToNext)} gap would require a monthly increase of ${formatCurrency(Number(monthlyGapToNext))}. Positions at this salary level generally require ${roleLevel}.`,

    `At ${formatCurrency(Number(hourlyEquiv))} per hour, your ${formatCurrency(amount)} monthly income adds up to ${formatCurrency(annual)} over a full year. You earn ${formatCurrency(Number(weeklyEquiv))} per week before tax, positioning you at ${pctMedian}% of the UK median salary. The next round-number milestone of ${formatCurrency(nextMilestone)} is ${formatCurrency(gapToNext)} away, and reaching it would add ${formatCurrency(Number(monthlyGapToNext))} to your monthly gross. Your daily working rate stands at ${formatCurrency(Number(dailyEquiv))} across ${WORKING_DAYS_PER_YEAR} working days per year.`,
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
  const idx = variationIndex(amount, 10);
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
      detail: `If your employer matches pension contributions up to 5%, that is ${formatCurrency(annual * 0.05)} per year of free money added to your pension pot. Combined with your own 5% contribution of ${formatCurrency(annual * 0.05)}, your pension grows by ${formatCurrency(annual * 0.10)} per year, which is ${formatCurrency(annual * 0.10 / 12)} per month. After ${formatCurrency(Math.round(20 * annual * 0.10))} in contributions over 20 years, compound growth significantly multiplies this amount.`,
    },
    {
      title: 'Electric vehicle salary sacrifice',
      detail: `Through an electric vehicle salary sacrifice scheme, you can lease a new electric car before tax and NI are calculated. On your ${formatCurrency(annual)} salary with a marginal rate of ${formatPercent(marginalRate)}, a car with a monthly lease of ${formatCurrency(300)} effectively costs you ${formatCurrency(300 * (1 - marginalRate / 100))} per month after the tax saving. The Benefit in Kind rate on electric cars is just 2%, making this one of the most tax-efficient employee benefits available.`,
    },
    {
      title: 'Transferring savings into a Lifetime ISA',
      detail: `If you are under 40 and saving for your first home, a Lifetime ISA provides a 25% government bonus on contributions up to ${formatCurrency(4000)} per year. On your salary of ${formatCurrency(annual)}, contributing ${formatCurrency(annual * 0.03)} per year (roughly ${formatCurrency(annual * 0.03 / 12)} per month) earns a bonus of ${formatCurrency(annual * 0.03 * 0.25)}, growing your deposit faster than any other savings product.`,
    },
    {
      title: 'Claiming flat-rate expenses for your job',
      detail: `HMRC allows flat-rate expense claims for certain occupations without the need for receipts. For example, healthcare workers can claim ${formatCurrency(185)} per year, and construction workers up to ${formatCurrency(140)} per year. At your marginal rate of ${formatPercent(marginalRate)}, a ${formatCurrency(185)} claim saves you ${formatCurrency(185 * marginalRate / 100)} per year. On a salary of ${formatCurrency(annual)}, these small reliefs add up meaningfully over time.`,
    },
    {
      title: 'Using childcare vouchers or tax-free childcare',
      detail: `Tax-Free Childcare provides a government top-up of 20% on childcare costs, up to ${formatCurrency(2000)} per child per year. On your ${formatCurrency(annual)} salary, paying ${formatCurrency(500)} per month in childcare through the scheme means the government adds ${formatCurrency(100)} each month, reducing your effective cost to ${formatCurrency(400)}. Over a full year, that saves you ${formatCurrency(1200)} on a total spend of ${formatCurrency(6000)}.`,
    },
    {
      title: 'Maximising your personal savings allowance',
      detail: `As a basic-rate taxpayer on ${formatCurrency(annual)} per year, you have a Personal Savings Allowance of ${formatCurrency(1000)}, meaning the first ${formatCurrency(1000)} of savings interest each year is completely tax-free. At current easy access rates of around 4.5%, you could hold up to approximately ${formatCurrency(Math.round(1000 / 0.045))} in savings accounts before any interest becomes taxable. This is separate from your ${formatCurrency(20000)} annual ISA allowance.`,
    },
    {
      title: 'Trading allowance for side income',
      detail: `If you earn extra income from occasional freelance work alongside your ${formatCurrency(annual)} salary, the first ${formatCurrency(1000)} per year is covered by the trading allowance and does not need to be reported to HMRC. This means side earnings of up to ${formatCurrency(83)} per month are completely tax-free and require no self-assessment filing. Anything above ${formatCurrency(1000)} per year must be declared.`,
    },
    {
      title: 'Council tax reduction and single person discount',
      detail: `If you live alone on your ${formatCurrency(annual)} salary, you are entitled to a 25% single person discount on your council tax bill. The average Band D council tax is approximately ${formatCurrency(2171)} per year, so a 25% discount saves you ${formatCurrency(Math.round(2171 * 0.25))} per year, or ${formatCurrency(Math.round(2171 * 0.25 / 12))} per month. On a take-home salary at this level, this is a worthwhile reduction in your fixed costs.`,
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
  const idx = variationIndex(amount, 10);
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
    {
      question: `How much council tax do I pay on ${formatCurrency(amount)} per month?`,
      answer: `Council tax is not linked to your salary but to the value band of your property. However, on a salary of ${formatCurrency(amount)} per month (take-home ${formatCurrency(monthlyNet)}), the average Band D council tax of approximately £181 per month represents ${((181 / monthlyNet) * 100).toFixed(1)}% of your net income. If you live alone, you receive a 25% single person discount, reducing this to about £136 per month or ${((136 / monthlyNet) * 100).toFixed(1)}% of your take-home.`,
    },
    {
      question: `What pension contributions should I make on ${formatCurrency(amount)} per month?`,
      answer: `At ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year), the minimum auto-enrolment pension contribution is 5% of qualifying earnings, which is approximately ${formatCurrency(annual * 0.05)} per year or ${formatCurrency(annual * 0.05 / 12)} per month. Your employer adds at least 3% (${formatCurrency(annual * 0.03)} per year). Financial planners often suggest contributing at least 12% total, which would mean ${formatCurrency(annual * 0.12)} per year, with the combined tax relief saving you ${formatCurrency(annual * 0.12 * result.marginalTaxRate / 100)} annually.`,
    },
    {
      question: `How long would it take to save a house deposit on ${formatCurrency(amount)} per month?`,
      answer: `A typical 10% deposit on a UK property averaging £285,000 is ${formatCurrency(28500)}. Saving ${formatCurrency(monthlyNet * 0.15)} per month (15% of your ${formatCurrency(monthlyNet)} take-home), it would take approximately ${Math.ceil(28500 / (monthlyNet * 0.15))} months, or ${(28500 / (monthlyNet * 0.15) / 12).toFixed(1)} years to reach that target. Government schemes such as the Lifetime ISA can speed this up by adding a 25% bonus to your savings.`,
    },
    {
      question: `Is ${formatCurrency(amount)} per month enough to live in London?`,
      answer: `Living in London on ${formatCurrency(amount)} per month (take-home of ${formatCurrency(monthlyNet)}) is challenging. Average rent for a room in a shared house is £800 to £1,000 per month, which would consume ${((900 / monthlyNet) * 100).toFixed(0)}% of your take-home. After housing, you would have approximately ${formatCurrency(monthlyNet - 900)} for all other expenses including travel (a Zone 1-3 Travelcard costs around £170 per month), food, and personal costs. Most people at this salary level share accommodation or live in outer zones.`,
    },
    {
      question: `What is the National Insurance breakdown on ${formatCurrency(amount)} per month?`,
      answer: `On ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year), your Class 1 National Insurance contribution is ${formatCurrency(result.nationalInsurance)} per year, or ${formatCurrency(result.nationalInsurance / 12)} per month. NI is charged at ${(NI_MAIN_RATE * 100).toFixed(0)}% on earnings between ${formatCurrency(NI_PRIMARY_THRESHOLD)} and £50,270, and 2% above that. Your NI contributions fund the State Pension, NHS, and other social security benefits.`,
    },
    {
      question: `How does a student loan affect my take-home on ${formatCurrency(amount)} per month?`,
      answer: `If you have a Plan 2 student loan (post-2012), repayments are 9% of earnings above £29,385 per year. On your salary of ${formatCurrency(annual)}, ${annual > 29385 ? `your annual repayment would be ${formatCurrency((annual - 29385) * 0.09)}, or ${formatCurrency((annual - 29385) * 0.09 / 12)} per month, reducing your take-home from ${formatCurrency(monthlyNet)} to ${formatCurrency(monthlyNet - (annual - 29385) * 0.09 / 12)}` : `no repayments are due as your salary is below the £29,385 threshold`}. Plan 5 loans (from 2023) have a threshold of £25,000.`,
    },
    {
      question: `What benefits am I entitled to on ${formatCurrency(amount)} per month?`,
      answer: `On a salary of ${formatCurrency(amount)} per month (${formatCurrency(annual)} per year), you ${annual < 25000 ? 'may be eligible for Universal Credit depending on your household circumstances, housing costs, and whether you have children' : 'are unlikely to qualify for income-related benefits unless you have significant childcare costs or high housing expenses'}. Regardless of salary, all UK residents can access free NHS healthcare, free prescriptions (in Scotland, Wales, and Northern Ireland), and the State Pension once you reach State Pension age. Use the gov.uk benefits calculator to check your specific entitlements.`,
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

  const idx = variationIndex(amount, 10);
  const headings = [
    `What a Pay Rise Means for Your ${formatCurrency(amount)}/Month Salary`,
    `Pay Rise Scenarios: Impact on Your ${formatCurrency(amount)} Monthly Take-Home`,
    `How Different Raises Affect Your ${formatCurrency(amount)}/Month Net Pay`,
    `Negotiating a Raise on ${formatCurrency(amount)}/Month: What You Would Actually Keep`,
    `From ${formatCurrency(amount)} Per Month Upwards: Raise Impact Analysis`,
    `Your ${formatCurrency(amount)}/Month Salary: What Extra Income Really Delivers`,
    `Pay Rise Calculator for ${formatCurrency(amount)} Monthly Earners`,
    `Understanding Raise Value at ${formatCurrency(amount)} Per Month`,
    `${formatCurrency(amount)}/Month: How Much More Would You Keep After a Raise?`,
    `The Real Return on a Pay Rise at ${formatCurrency(amount)} Per Month`,
  ];

  const summaries = [
    `At your current marginal rate of ${formatPercent(marginalRate)}, you keep ${formatCurrency(retentionRate * 100, true)} of every additional pound earned. A £1,000 pay rise adds ${formatCurrency(1000 * retentionRate)} to your annual take-home, or ${formatCurrency(1000 * retentionRate / 12)} per month.`,
    `Every additional pound you earn at ${formatCurrency(amount)} per month is taxed at ${formatPercent(marginalRate)} (your marginal rate), leaving you with ${formatCurrency(retentionRate * 100, true)}p. To increase your monthly take-home by ${formatCurrency(100)}, you would need a gross pay rise of ${formatCurrency(100 / retentionRate)} per month (${formatCurrency(1200 / retentionRate)} per year).`,
    `Your marginal deduction rate of ${formatPercent(marginalRate)} means that from every pay rise pound, HMRC takes ${formatCurrency(marginalRate)}p and you keep ${formatCurrency(retentionRate * 100, true)}p. Over the course of a year, even modest percentage increases compound: a 3% annual raise maintained over five years would lift your salary from ${formatCurrency(amount)} to approximately ${formatCurrency(amount * Math.pow(1.03, 5))} per month.`,
    `The key takeaway at ${formatCurrency(amount)} per month is that your marginal rate of ${formatPercent(marginalRate)} applies to every pound of any raise. A £500 annual rise gives you ${formatCurrency(500 * retentionRate)} extra after deductions, while a £2,000 rise delivers ${formatCurrency(2000 * retentionRate)} more per year, or ${formatCurrency(2000 * retentionRate / 12)} each month.`,
    `When evaluating a new job offer above your current ${formatCurrency(amount)} per month, remember that only ${formatCurrency(retentionRate * 100, true)}p of each additional pound actually reaches your bank account. A salary increase of ${formatCurrency(200)} per month gross translates to approximately ${formatCurrency(200 * retentionRate)} per month net, totalling ${formatCurrency(200 * retentionRate * 12)} extra per year.`,
    `At a marginal rate of ${formatPercent(marginalRate)}, your take-home grows by ${formatCurrency(retentionRate * 100, true)}p for every additional pound earned above ${formatCurrency(amount)} per month. Over a decade, a consistent 3% annual raise would grow your monthly salary from ${formatCurrency(amount)} to approximately ${formatCurrency(amount * Math.pow(1.03, 10))}, adding ${formatCurrency((amount * Math.pow(1.03, 10) - amount) * retentionRate)} per month in net terms.`,
    `Bonus payments at your salary level are taxed at the same marginal rate of ${formatPercent(marginalRate)}. A one-off bonus of ${formatCurrency(1000)} would net you ${formatCurrency(1000 * retentionRate)} after deductions. This is identical to a £1,000 pay rise spread across the year, though the psychological impact of a lump sum often differs.`,
    `If your employer offers a choice between a ${formatPercent(3)} pay rise and enhanced benefits worth the same amount, the benefits route often delivers more value. A ${formatCurrency(annual * 0.03)} salary increase nets you ${formatCurrency(annual * 0.03 * retentionRate)} after tax, but the same amount in pension contributions or other salary sacrifice benefits could be worth the full ${formatCurrency(annual * 0.03)}.`,
    `Looking at your ${formatCurrency(amount)} monthly salary, each 1% pay rise adds ${formatCurrency(annual * 0.01)} gross per year. After your marginal deductions of ${formatPercent(marginalRate)}, that 1% delivers ${formatCurrency(annual * 0.01 * retentionRate)} net per year or ${formatCurrency(annual * 0.01 * retentionRate / 12)} per month. Five consecutive 1% rises would accumulate to roughly ${formatCurrency(amount * (Math.pow(1.01, 5) - 1) * retentionRate)} more per month in take-home pay.`,
    `The difference between your effective tax rate of ${formatPercent(result.effectiveTaxRate)} and your marginal rate of ${formatPercent(marginalRate)} explains why raises feel smaller than expected. Your overall rate is lower because the first ${formatCurrency(PERSONAL_ALLOWANCE)} is tax-free, but every new pound is taxed at the higher marginal rate. From your current ${formatCurrency(amount)} per month, a £50/month raise yields only ${formatCurrency(50 * retentionRate)} extra after deductions.`,
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

  const idx = variationIndex(amount, 10);
  const headings = [
    `How ${formatCurrency(amount)} Per Month Compares to Other Salary Levels`,
    `Salary Comparisons: ${formatCurrency(amount)} Monthly in Context`,
    `${formatCurrency(amount)} Per Month vs Other Income Levels`,
    `Benchmarking Your ${formatCurrency(amount)} Monthly Salary`,
    `${formatCurrency(amount)} Per Month: Comparative Income Analysis`,
    `Where ${formatCurrency(amount)} Monthly Ranks Among UK Salaries`,
    `Comparing ${formatCurrency(amount)}/Month to Key Income Benchmarks`,
    `Income Comparisons for ${formatCurrency(amount)} Per Month Earners`,
    `How Your ${formatCurrency(amount)} Monthly Salary Measures Up`,
    `${formatCurrency(amount)} Per Month in the Wider UK Salary Landscape`,
  ];

  return {
    heading: headings[idx],
    comparisons,
  };
}
