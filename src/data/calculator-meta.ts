/**
 * Metadata for all calculator pages: titles, descriptions, FAQs, and related links.
 *
 * SEO rules:
 * - metaTitle: 50–60 characters, keyword-rich, no site name
 * - metaDescription: 150–160 characters, keyword-rich, no site name
 */

import { TAX_YEAR } from './tax-rules-2026-27';

export interface CalculatorPageMeta {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

export const CALCULATOR_META: Record<string, CalculatorPageMeta> = {
  // ── Home ────────────────────────────────────────────────────────────
  home: {
    slug: '/',
    title: 'UK Salary Calculator',
    // 54 chars
    metaTitle: `UK Salary Calculator ${TAX_YEAR} - Take Home Pay After Tax`,
    // 155 chars
    metaDescription: `Free UK salary calculator updated for ${TAX_YEAR}. See your take home pay after income tax, National Insurance, student loans and pension deductions instantly.`,
    h1: `UK Salary Calculator ${TAX_YEAR}`,
    intro: 'Enter your gross salary to see exactly what you take home after tax, National Insurance, student loans, and pension contributions.',
    faqs: [
      {
        question: 'How is my take-home pay calculated?',
        answer: 'Your take-home pay is your gross salary minus income tax, National Insurance contributions, student loan repayments, and pension contributions. Each deduction has its own thresholds and rates set by HMRC.',
      },
      {
        question: 'What tax year does this calculator use?',
        answer: `This calculator uses the ${TAX_YEAR} tax year rates (6 April 2026 to 5 April 2027), as published by HMRC.`,
      },
      {
        question: 'Does the personal allowance change if I earn over £100,000?',
        answer: 'Yes. The £12,570 personal allowance is reduced by £1 for every £2 you earn above £100,000. It is completely lost once your income reaches £125,140.',
      },
      {
        question: 'Are Scottish tax rates different?',
        answer: `Yes. Scotland has its own income tax bands with six rates (19%, 20%, 21%, 42%, 45%, and 48%) compared to three rates in England, Wales, and Northern Ireland.`,
      },
      {
        question: 'Is this calculator accurate?',
        answer: `All rates and thresholds are sourced directly from gov.uk for the ${TAX_YEAR} tax year. The calculator provides an estimate based on standard PAYE assumptions. Your actual pay may differ due to benefits in kind, overtime, or other adjustments.`,
      },
    ],
  },

  // ── Take-Home Pay ──────────────────────────────────────────────────
  'take-home-pay': {
    slug: '/take-home-pay',
    title: 'Take-Home Pay Calculator',
    // 58 chars
    metaTitle: `UK Take Home Pay Calculator ${TAX_YEAR} - Net Salary After Tax`,
    // 153 chars
    metaDescription: `Calculate your UK take home pay for ${TAX_YEAR}. Full breakdown of income tax, National Insurance, student loan repayments and pension. Free HMRC rates.`,
    h1: `Take-Home Pay Calculator ${TAX_YEAR}`,
    intro: 'See exactly how much of your salary you keep after all deductions. Full breakdown included.',
    faqs: [
      {
        question: 'What is take-home pay?',
        answer: 'Take-home pay (or net pay) is the amount you receive in your bank account after all deductions: income tax, National Insurance, student loan repayments, and pension contributions.',
      },
      {
        question: 'How can I increase my take-home pay?',
        answer: 'Common ways include: salary sacrifice pension contributions (which reduce NI as well as tax), claiming tax relief on work expenses, and checking your tax code is correct.',
      },
      {
        question: 'Why is my take-home pay different from what this shows?',
        answer: 'Your employer may deduct additional items like workplace pension contributions above the minimum, company car tax (benefit in kind), union fees, or repayment of salary advances.',
      },
    ],
  },

  // ── Hourly Rate ────────────────────────────────────────────────────
  'hourly-rate': {
    slug: '/hourly-rate',
    title: 'Hourly Rate Calculator',
    // 56 chars
    metaTitle: `Annual Salary to Hourly Rate Calculator UK ${TAX_YEAR}`,
    // 155 chars
    metaDescription: `Convert your annual salary to an hourly rate or hourly wage to yearly earnings. Includes full UK tax breakdown and take home pay for ${TAX_YEAR} tax year.`,
    h1: 'Hourly Rate Calculator',
    intro: 'Convert between annual salary and hourly rate. Adjust hours per week to see your true hourly earnings after tax.',
    faqs: [
      {
        question: 'How do I convert annual salary to hourly rate?',
        answer: 'Divide your annual salary by 52 weeks, then by your hours per week. For a standard 37.5-hour week: £30,000 ÷ 52 ÷ 37.5 = £15.38 per hour.',
      },
      {
        question: 'What hours per week should I use?',
        answer: 'A standard UK full-time work week is 37.5 hours. Some contracts use 35, 37, 38, or 40 hours. Check your employment contract.',
      },
      {
        question: 'Does this account for holidays?',
        answer: 'This calculator uses 52 weeks. Statutory UK holiday entitlement (28 days including bank holidays) is already part of your salaried annual figure.',
      },
    ],
  },

  // ── Pro-Rata ───────────────────────────────────────────────────────
  'pro-rata': {
    slug: '/pro-rata',
    title: 'Pro-Rata Salary Calculator',
    // 55 chars
    metaTitle: `Pro Rata Salary Calculator UK - Part Time Pay ${TAX_YEAR}`,
    // 156 chars
    metaDescription: `Calculate your pro rata salary for part time work in the UK. Enter the full time salary and working days to see your adjusted pay and tax for ${TAX_YEAR}.`,
    h1: 'Pro-Rata Salary Calculator',
    intro: 'Working part-time? Calculate your pro-rata salary based on the number of days you work compared to full-time.',
    faqs: [
      {
        question: 'What does pro-rata mean?',
        answer: 'Pro-rata means "in proportion". If a full-time salary is £30,000 for 5 days a week and you work 3 days, your pro-rata salary is £18,000 (3/5 of £30,000).',
      },
      {
        question: 'How do I calculate pro-rata salary?',
        answer: 'Multiply the full-time salary by (your days ÷ full-time days). For example: £40,000 × (3 ÷ 5) = £24,000.',
      },
      {
        question: 'Does pro-rata affect my tax?',
        answer: 'Your pro-rata salary is taxed the same way as any other salary. You still get the full personal allowance. Your overall tax bill will be lower because you earn less.',
      },
    ],
  },

  // ── Income Tax ─────────────────────────────────────────────────────
  'income-tax': {
    slug: '/income-tax',
    title: 'Income Tax Calculator',
    // 57 chars
    metaTitle: `UK Income Tax Calculator ${TAX_YEAR} - Tax Bands and Rates`,
    // 158 chars
    metaDescription: `Calculate your UK income tax for ${TAX_YEAR} with a full band by band breakdown. See England, Wales, Northern Ireland and Scotland rates. Free HMRC figures.`,
    h1: `UK Income Tax Calculator ${TAX_YEAR}`,
    intro: 'See exactly how much income tax you pay on your salary, with a full breakdown by tax band.',
    faqs: [
      {
        question: `What are the UK income tax rates for ${TAX_YEAR}?`,
        answer: `In England, Wales and Northern Ireland: 0% on the first £12,570 (personal allowance), 20% on £12,571–£50,270 (basic rate), 40% on £50,271–£125,140 (higher rate), and 45% above £125,140 (additional rate).`,
      },
      {
        question: 'What is the personal allowance?',
        answer: 'The personal allowance is the amount you can earn before paying income tax. For the current tax year it is £12,570. It reduces if you earn over £100,000.',
      },
      {
        question: 'How does Scottish income tax differ?',
        answer: 'Scotland has six income tax bands instead of three, with rates of 19%, 20%, 21%, 42%, 45%, and 48%. The personal allowance is the same (£12,570).',
      },
    ],
  },

  // ── National Insurance ─────────────────────────────────────────────
  'national-insurance': {
    slug: '/national-insurance',
    title: 'National Insurance Calculator',
    // 56 chars
    metaTitle: `National Insurance Calculator UK ${TAX_YEAR} - NI Rates`,
    // 155 chars
    metaDescription: `Calculate your National Insurance contributions for ${TAX_YEAR}. See employee NI rates, thresholds and how much you pay. Updated with current HMRC figures.`,
    h1: `National Insurance Calculator ${TAX_YEAR}`,
    intro: 'Calculate your employee National Insurance contributions. NI is charged on earnings above the primary threshold.',
    faqs: [
      {
        question: 'How much National Insurance do I pay?',
        answer: `Employees pay 8% on earnings between £12,570 and £50,270 per year, and 2% on earnings above £50,270.`,
      },
      {
        question: 'Is NI the same as income tax?',
        answer: 'No. National Insurance is a separate deduction from your salary. It contributes to your state pension and other benefits. It has different thresholds and rates to income tax.',
      },
      {
        question: 'Do I pay NI if I earn below the threshold?',
        answer: 'You do not pay NI if you earn below the primary threshold (£12,570/year). You still get NI credits if you earn above the lower earnings limit (£6,708/year).',
      },
    ],
  },

  // ── Student Loan ───────────────────────────────────────────────────
  'student-loan': {
    slug: '/student-loan',
    title: 'Student Loan Calculator',
    // 58 chars
    metaTitle: `Student Loan Repayment Calculator UK ${TAX_YEAR} - All Plans`,
    // 156 chars
    metaDescription: `Calculate student loan repayments for ${TAX_YEAR}. Plan 1, 2, 4, 5 and Postgraduate loan thresholds and rates. See monthly deductions from your salary.`,
    h1: `Student Loan Repayment Calculator ${TAX_YEAR}`,
    intro: 'See how much you repay each month on your student loan based on your salary and loan plan.',
    faqs: [
      {
        question: 'How much of my salary goes to student loan repayment?',
        answer: 'You repay 9% of earnings above your plan threshold (6% for postgraduate loans). If you earn below the threshold, you repay nothing.',
      },
      {
        question: 'Which student loan plan am I on?',
        answer: 'Plan 1: started before Sept 2012 (England/Wales) or NI. Plan 2: started after Sept 2012 (England/Wales). Plan 4: Scotland. Plan 5: started after Aug 2023. Check your Student Loans Company account.',
      },
      {
        question: 'Can I have more than one student loan?',
        answer: 'Yes. If you have both an undergraduate and postgraduate loan, both will be deducted from your pay. This calculator supports multiple plans.',
      },
    ],
  },

  // ── Pension Contribution ───────────────────────────────────────────
  'pension-contribution': {
    slug: '/pension-contribution',
    title: 'Pension Contribution Calculator',
    // 58 chars
    metaTitle: `Pension Contribution Calculator UK ${TAX_YEAR} - Tax Savings`,
    // 155 chars
    metaDescription: `See how pension contributions affect your take home pay for ${TAX_YEAR}. Compare salary sacrifice vs relief at source. Calculate tax and NI savings instantly.`,
    h1: `Pension Contribution Calculator ${TAX_YEAR}`,
    intro: 'See how increasing your pension contribution changes your take-home pay. Compare salary sacrifice with relief at source.',
    faqs: [
      {
        question: 'What is salary sacrifice for pensions?',
        answer: 'Salary sacrifice reduces your gross pay before tax and NI are calculated. This means you save both income tax and National Insurance on pension contributions.',
      },
      {
        question: 'What is relief at source?',
        answer: 'With relief at source, pension contributions come from your net pay. Your pension provider then claims basic rate tax relief (20%) and adds it to your pot. Higher-rate taxpayers claim additional relief via self-assessment.',
      },
      {
        question: 'Which pension method saves more money?',
        answer: 'Salary sacrifice typically saves you more because you also save on National Insurance (8% or 2%). Relief at source only saves income tax.',
      },
    ],
  },

  // ── Bonus ──────────────────────────────────────────────────────────
  bonus: {
    slug: '/bonus',
    title: 'Bonus Tax Calculator',
    // 55 chars
    metaTitle: `Bonus Tax Calculator UK ${TAX_YEAR} - How Much Do I Keep?`,
    // 157 chars
    metaDescription: `Calculate tax on your bonus in the UK for ${TAX_YEAR}. See exactly how much you keep after income tax, National Insurance and student loan deductions on a bonus.`,
    h1: `Bonus Tax Calculator ${TAX_YEAR}`,
    intro: 'Find out how much of your bonus you actually take home after tax, NI, and student loan deductions.',
    faqs: [
      {
        question: 'How is a bonus taxed in the UK?',
        answer: 'A bonus is added to your regular salary and taxed together. The tax on your bonus depends on your total annual income and which tax bands the bonus falls into.',
      },
      {
        question: 'Why does my bonus seem heavily taxed?',
        answer: 'Your regular salary may already use up your personal allowance and basic rate band. A bonus then falls entirely in the higher rate (40%) or additional rate (45%) band, making it appear heavily taxed.',
      },
      {
        question: 'Can I reduce tax on my bonus?',
        answer: 'You can pay your bonus into a pension via salary sacrifice to reduce the tax and NI owed. Other than pensions, there is no legal way to avoid tax on a cash bonus.',
      },
    ],
  },

  // ── Required Salary ────────────────────────────────────────────────
  'required-salary': {
    slug: '/required-salary',
    title: 'Required Salary Calculator',
    // 57 chars
    metaTitle: `Gross to Net Salary Calculator UK ${TAX_YEAR} - Reverse Tax`,
    // 157 chars
    metaDescription: `Reverse salary calculator: find the gross salary you need to take home a specific net amount in the UK. Updated for ${TAX_YEAR} tax year with HMRC rates.`,
    h1: 'Required Salary Calculator',
    intro: 'Know what you need to take home? Work backwards to find the gross salary required.',
    faqs: [
      {
        question: 'How does this reverse calculator work?',
        answer: 'Enter the net (take-home) amount you want per year or month. The calculator works out what gross salary would produce that net amount after all deductions.',
      },
      {
        question: 'Why would I use a reverse salary calculator?',
        answer: 'Useful when negotiating a job offer, budgeting for a target lifestyle, or working out what raise you need for a specific increase in take-home pay.',
      },
      {
        question: 'Is the result exact?',
        answer: 'The result is accurate to within £1. Small differences can occur due to rounding in PAYE calculations.',
      },
    ],
  },

  // ── Two Jobs ───────────────────────────────────────────────────────
  'two-jobs': {
    slug: '/two-jobs',
    title: 'Two Jobs Tax Calculator',
    // 56 chars
    metaTitle: `Two Jobs Tax Calculator UK ${TAX_YEAR} - Combined Tax Bill`,
    // 156 chars
    metaDescription: `Calculate your combined tax across two jobs in the UK for ${TAX_YEAR}. See if you are underpaying or overpaying tax and what you owe HMRC at year end.`,
    h1: `Two Jobs Tax Calculator ${TAX_YEAR}`,
    intro: 'Working two jobs? See your combined tax position and whether you could have an underpayment at the end of the year.',
    faqs: [
      {
        question: 'How is tax calculated with two jobs?',
        answer: 'Your first job typically receives your personal allowance (tax code 1257L). Your second job is usually taxed at basic rate on all income (tax code BR). HMRC combines your income for your total tax liability.',
      },
      {
        question: 'Will I underpay tax with two jobs?',
        answer: 'If your combined income pushes you into a higher tax band, you may underpay tax during the year. HMRC will usually adjust your tax code or send you a bill after the tax year.',
      },
      {
        question: 'Can I split my personal allowance between two jobs?',
        answer: 'Yes. You can ask HMRC to split your personal allowance across jobs by contacting them. This can help avoid a large tax bill at the end of the year.',
      },
    ],
  },
};
