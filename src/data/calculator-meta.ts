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
        answer: 'Your take-home pay is your gross salary minus income tax, National Insurance contributions, student loan repayments, and pension contributions. Each deduction has its own thresholds and rates set by HMRC. The order matters: pension contributions come off first where salary sacrifice applies, then income tax on what remains above the personal allowance, then National Insurance, then any student loan repayment.',
      },
      {
        question: 'What tax year does this calculator use?',
        answer: `This calculator uses the ${TAX_YEAR} tax year rates (6 April 2026 to 5 April 2027), as published by HMRC.`,
      },
      {
        question: 'Does the personal allowance change if I earn over £100,000?',
        answer: 'Yes. The £12,570 personal allowance is reduced by £1 for every £2 you earn above £100,000. It is completely lost once your income reaches £125,140. It is withdrawn at £1 for every £2 above £100,000, so it disappears entirely at £125,140 and creates an effective marginal rate of 60 per cent across that band.',
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
    slug: '/take-home-pay/',
    title: 'Take-Home Pay Calculator',
    // 58 chars
    metaTitle: `UK Take Home Pay Calculator ${TAX_YEAR} - Net Salary After Tax`,
    // 159 chars
    metaDescription: `Calculate your UK take home pay for ${TAX_YEAR}. Full breakdown of income tax, National Insurance, student loan repayments and pension deductions. Free HMRC rates.`,
    h1: `Take-Home Pay Calculator ${TAX_YEAR}`,
    intro: 'See exactly how much of your salary you keep after all deductions. Full breakdown included.',
    faqs: [
      {
        question: 'What is take-home pay?',
        answer: 'Take-home pay (or net pay) is the amount you receive in your bank account after all deductions: income tax, National Insurance, student loan repayments, and pension contributions. It is what reaches your bank account after everything your employer deducts, which is why two people on the same gross salary can be paid different amounts each month.',
      },
      {
        question: 'How can I increase my take-home pay?',
        answer: 'Common ways include: salary sacrifice pension contributions (which reduce NI as well as tax), claiming tax relief on work expenses, and checking your tax code is correct. Salary sacrifice into a pension is the largest lever, because it cuts both income tax and National Insurance, and checking your tax code is the fastest, because an emergency code overcharges you.',
      },
      {
        question: 'Why is my take-home pay different from what this shows?',
        answer: 'Your employer may deduct additional items like workplace pension contributions above the minimum, company car tax (benefit in kind), union fees, or repayment of salary advances. The commonest causes are a non-standard tax code, a student loan plan the calculator was not told about, benefits in kind such as a company car, and pension contributions taken from net pay.',
      },
      {
        question: 'What is a tax code and why does it matter?',
        answer: 'It tells your employer how much of your pay is tax-free. 1257L is the standard code for the 2026/27 year; an emergency or BR code taxes everything from the first pound, which is the commonest cause of a payslip that looks wrong.',
      },
      {
        question: 'How often should I check my payslip?',
        answer: 'Every month for the first three months of a new job, and again after any pay rise, bonus or change of benefits. Most PAYE errors are caught in the first quarter, and the longer one runs the more painful the correction becomes.',
      },
      {
        question: 'What is the difference between gross and net pay?',
        answer: 'Gross is what the contract says, net is what arrives. The gap is income tax, National Insurance, student loan repayments and any pension or benefit deductions, and on a middle income it runs to about a quarter to a third of the gross.',
      },
    ],
  },

  // ── Hourly Rate ────────────────────────────────────────────────────
  'hourly-rate': {
    slug: '/hourly-rate/',
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
        answer: 'Divide your annual salary by 52 weeks, then by your hours per week. For a standard 37.5-hour week: £30,000 ÷ 52 ÷ 37.5 = £15.38 per hour. Divide the annual figure by the hours you actually work in a year: 37.5 hours a week over 52 weeks gives 1,950 hours, while a 40-hour week gives 2,080 and a lower hourly rate on the same salary.',
      },
      {
        question: 'What hours per week should I use?',
        answer: 'A standard UK full-time work week is 37.5 hours. Some contracts use 35, 37, 38, or 40 hours. Check your employment contract. Use the hours in your contract rather than the hours you work. The UK average full-time contract is 37.5 hours, and using 40 understates the hourly rate by about six per cent on the same salary.',
      },
      {
        question: 'Does this account for holidays?',
        answer: 'This calculator uses 52 weeks. Statutory UK holiday entitlement (28 days including bank holidays) is already part of your salaried annual figure. It assumes paid leave, as a salaried contract provides: the annual figure already covers the 28 statutory days. For a day rate or zero-hours work, divide by the days actually paid instead.',
      },
      {
        question: 'Should I use 37.5 or 40 hours a week?',
        answer: 'Use the hours in your contract. The UK full-time norm is 37.5 hours, and the difference matters: the same £35,000 salary is £17.95 an hour over 37.5 hours and £16.83 over 40, a gap of more than a pound for identical pay.',
      },
      {
        question: 'How does overtime change my hourly rate?',
        answer: 'Paid overtime raises the average rate if it is paid at a premium, and lowers it if it is unpaid. Salaried staff working fifty hours on a 37.5-hour contract are effectively paid a quarter less per hour than their contract implies.',
      },
      {
        question: 'What hourly rate should a contractor charge?',
        answer: 'A contractor covers holiday, sick pay, pension and gaps between contracts from the same rate, so the usual rule of thumb is to take the employed hourly equivalent and add thirty to fifty per cent before quoting a day rate.',
      },
    ],
  },

  // ── Pro-Rata ───────────────────────────────────────────────────────
  'pro-rata': {
    slug: '/pro-rata/',
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
        answer: 'Pro-rata means "in proportion". If a full-time salary is £30,000 for 5 days a week and you work 3 days, your pro-rata salary is £18,000 (3/5 of £30,000). It means in proportion: a part-time salary expressed as the full-time equivalent scaled to the hours worked. A £40,000 full-time role at three days a week is £24,000 pro rata, and the tax follows the lower figure.',
      },
      {
        question: 'How do I calculate pro-rata salary?',
        answer: 'Multiply the full-time salary by (your days ÷ full-time days). For example: £40,000 × (3 ÷ 5) = £24,000. Divide the full-time salary by the full-time hours, then multiply by your own hours. For a £40,000 role at 37.5 hours, three days of 7.5 hours gives 22.5 hours and a pro-rata salary of £24,000.',
      },
      {
        question: 'Does pro-rata affect my tax?',
        answer: 'Your pro-rata salary is taxed the same way as any other salary. You still get the full personal allowance. Your overall tax bill will be lower because you earn less. Only through the lower gross figure. The personal allowance and the bands are the same for everyone, so a part-time salary below £12,570 pays no income tax at all, and one just above it pays 20 per cent on the excess.',
      },
      {
        question: 'Do part-time workers get the same personal allowance?',
        answer: 'Yes. The personal allowance is an annual figure per person, not per hour, so a part-time salary below £12,570 pays no income tax at all. That makes the effective tax rate on part-time work lower than on the full-time equivalent.',
      },
      {
        question: 'How is holiday calculated pro rata?',
        answer: 'Statutory leave is 5.6 weeks of your normal working week, so someone working three days a week is entitled to 16.8 days rather than 28. Bank holidays are included in that figure unless the contract says otherwise. Where hours vary week to week, the entitlement is now worked out as 12.07 per cent of hours actually worked rather than as a fixed number of days.',
      },
      {
        question: 'Does part-time work affect my pension and NI record?',
        answer: 'It can. Auto-enrolment applies above an earnings trigger, and National Insurance credits towards the state pension require earnings above the lower earnings limit, so a very small part-time salary may build neither unless you check. Two part-time jobs are assessed separately for both, so someone below the threshold in each can build neither entitlement despite a reasonable combined income.',
      },
    ],
  },

  // ── Income Tax ─────────────────────────────────────────────────────
  'income-tax': {
    slug: '/income-tax/',
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
        answer: `In England, Wales and Northern Ireland: 0% on the first £12,570 (personal allowance), 20% on £12,571–£50,270 (basic rate), 40% on £50,271–£125,140 (higher rate), and 45% above £125,140 (additional rate). Scotland applies its own six-band schedule to earned income, so these rates cover the rest of the UK only, and the Scottish calculator shows the difference at each salary level.`,
      },
      {
        question: 'What is the personal allowance?',
        answer: 'The personal allowance is the amount you can earn before paying income tax. For the current tax year it is £12,570. It reduces if you earn over £100,000. It is the slice of income taxed at nothing, £12,570 for the 2026/27 year, spread across the year by your tax code. It is withdrawn above £100,000 and can be higher if you claim the marriage allowance or blind person\'s allowance.',
      },
      {
        question: 'How does Scottish income tax differ?',
        answer: 'Scotland has six income tax bands instead of three, with rates of 19%, 20%, 21%, 42%, 45%, and 48%. The personal allowance is the same (£12,570). Scotland sets its own rates and bands on earned income: six bands from 19 to 48 per cent instead of three. The divergence starts above roughly £28,000, and the difference against England widens steadily from there.',
      },
      {
        question: 'What is taxable income?',
        answer: 'Gross pay minus the personal allowance and minus any pre-tax deductions such as salary sacrifice pension contributions. It is the figure the bands are applied to, which is why a £40,000 salary with a £4,000 sacrifice is taxed as though it were £36,000.',
      },
      {
        question: 'Do I pay income tax on savings and dividends?',
        answer: 'Yes, but on separate schedules. Savings interest has its own starting rate and personal savings allowance, dividends have a dividend allowance and their own rates, and both sit on top of earned income when deciding which band applies. Both allowances have been cut repeatedly in recent years, so amounts that were once tax-free now produce a bill.',
      },
      {
        question: 'How do I check I am on the right tax code?',
        answer: 'Compare the code on your payslip with the one in your personal tax account on GOV.UK, and check that any benefit in kind listed there is one you actually receive. A code ending in L with 1257 in front is the standard for a single job and no benefits.',
      },
    ],
  },

  // ── National Insurance ─────────────────────────────────────────────
  'national-insurance': {
    slug: '/national-insurance/',
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
        answer: `Employees pay 8% on earnings between £12,570 and £50,270 a year, then 2% above £50,270, so the marginal rate actually falls once your salary passes that ceiling. Contributions stop entirely at state pension age, they are charged on earnings rather than on total income, and the employer pays a separate 15% on top of your salary.`,
      },
      {
        question: 'Is NI the same as income tax?',
        answer: 'No. National Insurance is a separate deduction from your salary. It contributes to your state pension and other benefits. It has different thresholds and rates to income tax. No. National Insurance is charged on earnings rather than on total income, it has its own thresholds, it stops at state pension age, and it buys entitlement to the state pension and some benefits, which income tax does not.',
      },
      {
        question: 'Do I pay NI if I earn below the threshold?',
        answer: 'You do not pay NI if you earn below the primary threshold (£12,570/year). You still get NI credits if you earn above the lower earnings limit (£6,708/year). No contributions are due below the primary threshold, but earnings above the lower earnings limit still count towards your National Insurance record, which is what protects your state pension entitlement for that year.',
      },
      {
        question: 'What are the different classes of National Insurance?',
        answer: 'Class 1 for employees and their employers, Class 2 and Class 4 for the self-employed, and Class 3 for voluntary contributions used to fill gaps in a record. Only some classes count towards the state pension, which is what makes voluntary contributions worth checking.',
      },
      {
        question: 'Can I fill gaps in my National Insurance record?',
        answer: 'Often, yes, through voluntary Class 3 contributions, and the window for older years has been extended more than once. Whether it is worth paying depends on how many qualifying years you already have towards the 35 needed for the full state pension.',
      },
      {
        question: 'Do the self-employed pay National Insurance differently?',
        answer: 'Yes. Class 2 has largely been abolished for those above the small profits threshold while still counting for the state pension, and Class 4 is charged on profits at a lower rate than employee contributions, which is one of the structural advantages of self-employment.',
      },
    ],
  },

  // ── Student Loan ───────────────────────────────────────────────────
  'student-loan': {
    slug: '/student-loan/',
    title: 'Student Loan Calculator',
    // 58 chars
    metaTitle: `Student Loan Repayment Calculator UK ${TAX_YEAR} - All Plans`,
    // 156 chars (with TAX_YEAR)
    metaDescription: `Calculate UK student loan repayments for ${TAX_YEAR}. Plan 1, 2, 4, 5 and Postgraduate loan thresholds and rates. See your exact monthly deductions from salary.`,
    h1: `Student Loan Repayment Calculator ${TAX_YEAR}`,
    intro: 'See how much you repay each month on your student loan based on your salary and loan plan.',
    faqs: [
      {
        question: 'How much of my salary goes to student loan repayment?',
        answer: 'You repay 9% of earnings above your plan threshold (6% for postgraduate loans). If you earn below the threshold, you repay nothing. Nine per cent of everything above the plan threshold for Plans 1, 2, 4 and 5, and six per cent above the postgraduate loan threshold. The repayment is calculated on the pay period, not on the annual total.',
      },
      {
        question: 'Which student loan plan am I on?',
        answer: 'Plan 1: started before Sept 2012 (England/Wales) or NI. Plan 2: started after Sept 2012 (England/Wales). Plan 4: Scotland. Plan 5: started after Aug 2023. Check your Student Loans Company account. It depends on where and when you started studying, and the thresholds differ by thousands of pounds between plans, so the wrong assumption changes the monthly figure noticeably. Your online student loan account states the plan.',
      },
      {
        question: 'Can I have more than one student loan?',
        answer: 'Yes. If you have both an undergraduate and postgraduate loan, both will be deducted from your pay. This calculator supports multiple plans. Yes: an undergraduate plan and a postgraduate loan are repaid at the same time, at nine and six per cent of the income above their respective thresholds, so the combined deduction can reach fifteen per cent of the excess.',
      },
      {
        question: 'When does a student loan get written off?',
        answer: 'It depends on the plan: Plan 1 between 25 years and age 65 depending on when you started, Plan 2 after 30 years, Plan 4 after 30 years, Plan 5 after 40 years, and a postgraduate loan after 30. Anything unpaid at that point is cancelled.',
      },
      {
        question: 'Should I pay off my student loan early?',
        answer: 'Usually not. The repayment behaves like a nine per cent tax on income above a threshold rather than a conventional debt, and most borrowers never clear the balance before write-off, so an early lump sum often buys nothing at all.',
      },
      {
        question: 'Do I repay a student loan if I move abroad?',
        answer: 'Yes, and the thresholds are adjusted for the country you move to. You must tell the Student Loans Company, because unreported earnings abroad lead to fixed penalty repayments that are considerably higher than the income-based figure. The repayment is still nine per cent of income above the threshold, but the threshold is adjusted for the cost of living in your new country.',
      },
    ],
  },

  // ── Pension Contribution ───────────────────────────────────────────
  'pension-contribution': {
    slug: '/pension-contribution/',
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
        answer: 'Salary sacrifice reduces your gross pay before tax and NI are calculated. This means you save both income tax and National Insurance on pension contributions. You give up part of your gross salary in exchange for an employer pension contribution. Because the money never counts as pay, it escapes both income tax and National Insurance, which is why it beats every other pension route.',
      },
      {
        question: 'What is relief at source?',
        answer: 'With relief at source, pension contributions come from your net pay. Your pension provider then claims basic rate tax relief (20%) and adds it to your pot. Higher-rate taxpayers claim additional relief via self-assessment. Your contribution is taken from net pay and the pension provider reclaims twenty per cent from HMRC. A higher-rate taxpayer must claim the extra relief through a tax return, and many never do, which is why salary sacrifice is simpler.',
      },
      {
        question: 'Which pension method saves more money?',
        answer: 'Salary sacrifice typically saves you more because you also save on National Insurance (8% or 2%). Relief at source only saves income tax. Salary sacrifice, in almost every case, because it avoids National Insurance as well as income tax and requires no claim to HMRC. Net pay arrangements come second, and relief at source last for anyone above the basic rate.',
      },
      {
        question: 'How much should I contribute to a pension?',
        answer: 'Auto-enrolment sets a minimum of eight per cent of qualifying earnings including the employer\'s three, which most projections treat as too low. A common rule of thumb is to contribute half your age as a percentage when you start. Whatever the figure, capture the full employer match first: it is the only part of the calculation that pays an immediate hundred per cent return.',
      },
      {
        question: 'Is there a limit on pension contributions?',
        answer: 'Yes. The annual allowance caps tax-relieved contributions, tapering for high earners and dropping sharply once you have flexibly accessed a pension. Contributions above the allowance attract a tax charge, so a large one-off payment is worth checking first. The lifetime allowance was abolished in April 2024, so the annual allowance and the lump sum limits are now the constraints that matter.',
      },
      {
        question: 'Can I contribute more than I earn?',
        answer: 'Not with tax relief. Relief is limited to the higher of your relevant earnings and £3,600 gross a year, so a non-earner can still pay in £2,880 net and have it topped up to £3,600, but no more. Contributions above the relief limit are not rejected outright but attract a tax charge, which cancels the benefit, so the cap is worth checking before a large one-off payment.',
      },
    ],
  },

  // ── Bonus ──────────────────────────────────────────────────────────
  bonus: {
    slug: '/bonus/',
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
        answer: 'A bonus is added to your regular salary and taxed together. The tax on your bonus depends on your total annual income and which tax bands the bonus falls into. As ordinary income, added to the salary of the period in which it is paid. There is no special bonus rate; what makes the deduction look brutal is that the whole bonus sits above your personal allowance and is taxed at your marginal rate.',
      },
      {
        question: 'Why does my bonus seem heavily taxed?',
        answer: 'Your regular salary may already use up your personal allowance and basic rate band. A bonus then falls entirely in the higher rate (40%) or additional rate (45%) band, making it appear heavily taxed. Because PAYE assumes the pay period is typical: a month containing a bonus looks like a much higher annual salary, so the system withholds at the higher rate. The overpayment usually corrects itself over the following months.',
      },
      {
        question: 'Can I reduce tax on my bonus?',
        answer: 'You can pay your bonus into a pension via salary sacrifice to reduce the tax and NI owed. Other than pensions, there is no legal way to avoid tax on a cash bonus. Yes, but it has to be arranged before payment. Sacrificing the bonus into a pension avoids income tax and National Insurance entirely, and some employers allow the payment to be deferred into the next tax year.',
      },
      {
        question: 'When will my bonus be taxed back?',
        answer: 'If PAYE has over-withheld, the correction comes through in the following pay periods as the cumulative calculation catches up, usually within two or three months. If the tax year ends first, HMRC reconciles it after April and issues a refund or a new tax code.',
      },
      {
        question: 'Does a bonus affect my student loan repayment?',
        answer: 'Yes, and immediately. Student loan repayments are calculated on the pay period rather than the year, so a month containing a bonus triggers a repayment of nine per cent on everything above the monthly threshold, with no averaging afterwards, and no refund at the end of the year.',
      },
      {
        question: 'Can a bonus push me into the 60 per cent band?',
        answer: 'It can. Between £100,000 and £125,140 the personal allowance is withdrawn at £1 for every £2 earned, producing an effective marginal rate of 60 per cent. A bonus that crosses £100,000 is taxed at that rate, which is the strongest argument for sacrificing it into a pension.',
      },
    ],
  },

  // ── Required Salary ────────────────────────────────────────────────
  'required-salary': {
    slug: '/required-salary/',
    title: 'Required Salary Calculator',
    // 57 chars
    metaTitle: `Gross to Net Salary Calculator UK ${TAX_YEAR} - Reverse Tax`,
    // 153 chars
    metaDescription: `Reverse salary calculator: find the gross salary you need to take home a specific net amount in the UK. Updated for the ${TAX_YEAR} tax year with HMRC rates.`,
    h1: 'Required Salary Calculator',
    intro: 'Know what you need to take home? Work backwards to find the gross salary required.',
    faqs: [
      {
        question: 'How does this reverse calculator work?',
        answer: 'Enter the net (take-home) amount you want per year or month. The calculator works out what gross salary would produce that net amount after all deductions. It searches for the gross salary that produces the take-home figure you enter, applying the same tax and National Insurance rules in reverse. That is a search rather than a formula, because the bands make the relationship non-linear.',
      },
      {
        question: 'Why would I use a reverse salary calculator?',
        answer: 'Useful when negotiating a job offer, budgeting for a target lifestyle, or working out what raise you need for a specific increase in take-home pay. Because a budget is set in net pounds, not gross. If you know you need £2,500 a month to cover rent and bills, this tells you the salary to ask for, which is the figure a recruiter wants to hear.',
      },
      {
        question: 'Is the result exact?',
        answer: 'The result is accurate to within £1. Small differences can occur due to rounding in PAYE calculations. It is exact for the standard case and indicative for yours. A non-standard tax code, a student loan plan, a company car or pension contributions taken from net pay all move the answer, and only a payslip settles it.',
      },
      {
        question: 'How much salary do I need for a £1,500 monthly take-home?',
        answer: 'Around £23,000 to £24,000 a year in England for the 2026/27 year, depending on student loan and pension deductions. The calculator searches for the exact gross rather than estimating, because the tax bands make the relationship non-linear. Add a student loan repayment and the figure rises by roughly £1,500 a year; add a five per cent pension contribution and it rises again.',
      },
      {
        question: 'Why is the gross so much higher than the net I want?',
        answer: 'Because income tax, National Insurance and any student loan repayment all come off before the money reaches you. Above the personal allowance, each extra pound of take-home costs roughly £1.45 of gross at the basic rate and £1.72 at the higher rate.',
      },
      {
        question: 'Should I negotiate on gross or net pay?',
        answer: 'On gross, because that is what an employer controls and what appears in the contract. Work out the gross you need from the net you want first, then negotiate that figure, rather than discovering the shortfall on the first payslip.',
      },
    ],
  },

  // ── Two Jobs ───────────────────────────────────────────────────────
  'two-jobs': {
    slug: '/two-jobs/',
    title: 'Two Jobs Tax Calculator',
    // 56 chars
    metaTitle: `Two Jobs Tax Calculator UK ${TAX_YEAR} - Combined Tax Bill`,
    // 153 chars
    metaDescription: `Calculate your combined income tax across two jobs in the UK for ${TAX_YEAR}. See if you are underpaying or overpaying tax and what you owe HMRC at year end.`,
    h1: `Two Jobs Tax Calculator ${TAX_YEAR}`,
    intro: 'Working two jobs? See your combined tax position and whether you could have an underpayment at the end of the year.',
    faqs: [
      {
        question: 'How is tax calculated with two jobs?',
        answer: 'Your first job typically receives your personal allowance (tax code 1257L). Your second job is usually taxed at basic rate on all income (tax code BR). HMRC combines your income for your total tax liability. Each job is taxed separately through PAYE, but the personal allowance normally sits with one of them, so the second job is taxed from the first pound, usually on a BR code at twenty per cent.',
      },
      {
        question: 'Will I underpay tax with two jobs?',
        answer: 'If your combined income pushes you into a higher tax band, you may underpay tax during the year. HMRC will usually adjust your tax code or send you a bill after the tax year. It is possible if the combined income crosses a band that neither employer can see. HMRC reconciles this after the tax year, and the usual outcome is a bill or a code change, both avoidable by telling HMRC in advance.',
      },
      {
        question: 'Can I split my personal allowance between two jobs?',
        answer: 'Yes. You can ask HMRC to split your personal allowance across jobs by contacting them. This can help avoid a large tax bill at the end of the year. Yes, HMRC can divide it between employments, which suits two steady part-time jobs of similar size. It is worth asking when neither job alone uses the full allowance, otherwise one job wastes it and the other overpays.',
      },
      {
        question: 'Do I pay National Insurance twice with two jobs?',
        answer: 'Each job applies the thresholds separately, so two jobs can each fall below the primary threshold and pay nothing, or each pay full contributions without the upper earnings limit applying across both. The result can be more or less than a single job of the same total.',
      },
      {
        question: 'Should I tell HMRC about a second job?',
        answer: 'Yes, and early. HMRC can split the personal allowance or set the right code on each employment, which avoids both the shock of a BR code on the second job and an underpayment bill after the tax year closes. A change of code takes one payroll cycle to appear.',
      },
      {
        question: 'What tax code will my second job have?',
        answer: 'Usually BR, which taxes every pound at the basic rate because the allowance sits with the first job. D0 taxes at the higher rate and appears where the first job already uses the basic-rate band in full. NT means no tax and is rare outside specific circumstances.',
      },
    ],
  },

  // ── Scottish Tax ─────────────────────────────────────────────────
  'scottish-tax-calculator': {
    slug: '/scottish-tax-calculator/',
    title: 'Scottish Tax Calculator',
    metaTitle: `Scottish Tax Calculator ${TAX_YEAR} - Scotland Income Tax Rates`,
    metaDescription: `Calculate your Scottish income tax for ${TAX_YEAR}. Compare Scotland vs England take-home pay across all six tax bands. Updated HMRC rates, thresholds and examples.`,
    h1: `Scottish Tax Calculator ${TAX_YEAR}`,
    intro: 'Compare Scottish income tax rates with England, Wales, and Northern Ireland. See the difference in your take-home pay.',
    faqs: [
      {
        question: 'How many tax bands does Scotland have?',
        answer: 'Scotland has six income tax bands: starter (19%), basic (20%), intermediate (21%), higher (42%), advanced (45%), and top (48%). England has three: basic (20%), higher (40%), and additional (45%). Six on earned income: starter, basic, intermediate, higher, advanced and top, against three in the rest of the UK. The extra bands are what make the Scottish calculation different at almost every salary above the personal allowance.',
      },
      {
        question: 'Do I pay more tax in Scotland?',
        answer: 'It depends on your salary. Lower earners may pay slightly less due to the 19% starter rate, while higher earners typically pay more due to higher rates kicking in at lower thresholds. Below roughly £28,000 you pay slightly less, thanks to the 19 per cent starter rate. Above that you pay more, and the gap widens with income: at £100,000 it runs to several thousand pounds a year.',
      },
      {
        question: 'Is National Insurance different in Scotland?',
        answer: 'No. National Insurance rates and thresholds are the same across the entire UK. Only income tax differs in Scotland. No. National Insurance is reserved to the UK government, so the rates and thresholds are identical across the four nations. Only income tax is devolved, which is why a Scottish payslip differs on one line and not the other.',
      },
      {
        question: 'Who counts as a Scottish taxpayer?',
        answer: 'Residence decides it, not where you work. If your only or main home is in Scotland for most of the tax year, you pay Scottish rates even if your employer is in London, and HMRC applies an S prefix to your tax code to make it happen.',
      },
      {
        question: 'Which taxes are devolved to Scotland?',
        answer: 'Income tax on earnings, pensions and property income, plus Land and Buildings Transaction Tax in place of Stamp Duty. National Insurance, dividend tax, savings interest tax and capital gains tax remain reserved and identical across the UK.',
      },
      {
        question: 'At what salary does Scotland become more expensive?',
        answer: 'Around £28,000. Below that the 19 per cent starter rate leaves a Scottish taxpayer marginally better off; above it the intermediate, higher and advanced rates bite, and the gap grows to several thousand pounds a year at six figures.',
      },
      {
        question: 'How does Scottish tax affect pension relief?',
        answer: 'Relief follows the Scottish rates, so a Scottish intermediate-rate taxpayer claims 21 per cent rather than 20. Providers usually reclaim only the basic 20 per cent at source, and the extra point has to be claimed from HMRC, which many Scottish taxpayers never do.',
      },
      {
        question: 'Does Scotland tax savings and dividends differently?',
        answer: 'No. Only earned income, pensions and property income are devolved; savings interest and dividends follow the UK-wide rates and allowances. A Scottish taxpayer with a large dividend income therefore pays exactly what a taxpayer in England would.',
      },
    ],
  },

  // ── Employer Cost ────────────────────────────────────────────────
  'employer-cost': {
    slug: '/employer-cost/',
    title: 'Employer Cost Calculator',
    metaTitle: `Employer Cost Calculator UK ${TAX_YEAR} - Total Cost to Hire`,
    metaDescription: `Total cost of hiring someone in the UK for ${TAX_YEAR}. Includes employer National Insurance (15%), pension contributions and Employment Allowance. Free calculator.`,
    h1: `Employer Cost Calculator ${TAX_YEAR}`,
    intro: 'See the true cost of employing someone in the UK, including employer National Insurance and pension contributions.',
    faqs: [
      {
        question: 'How much does it cost to employ someone in the UK?',
        answer: `The total cost includes the gross salary plus employer NI (15% on earnings above £5,000) and minimum pension contributions (3% of qualifying earnings). For a £30,000 salary, employer costs add roughly £4,500–£5,000 on top.`,
      },
      {
        question: 'What is the Employment Allowance?',
        answer: 'The Employment Allowance reduces your employer NI bill by up to £10,500 per year. Most businesses with employer NI below £100,000 in the previous year are eligible. A reduction in the employer\'s National Insurance bill, claimed through payroll, available to most businesses and charities below a threshold of secondary contributions. It reduces what the employer pays and changes nothing on the employee\'s payslip.',
      },
      {
        question: `What is the employer NI rate for ${TAX_YEAR}?`,
        answer: 'Employers pay 15% NI on employee earnings above £5,000 a year, with no upper limit, unlike the employee contribution which falls to 2% above the upper earnings limit. The threshold was lowered and the rate raised in April 2025, which is why the cost of a low-paid employee rose sharply that year.',
      },
      {
        question: 'What does an employee really cost an employer?',
        answer: 'Salary plus employer National Insurance on earnings above the secondary threshold, plus the minimum pension contribution under auto-enrolment, plus the apprenticeship levy for large payrolls. The total typically runs fifteen to twenty per cent above the gross salary before any benefits.',
      },
      {
        question: 'What about pension contributions and the apprenticeship levy?',
        answer: 'Auto-enrolment obliges the employer to pay at least three per cent of qualifying earnings into a workplace pension, and payrolls above £3 million a year also pay the apprenticeship levy at 0.5 per cent. Both sit on top of salary and employer National Insurance in the true cost of a hire.',
      },
      {
        question: 'Does the Employment Allowance change the figure?',
        answer: 'For an eligible employer, yes: it reduces the employer National Insurance bill for the year, which matters most for a small payroll where it can cover the contributions of several employees. It does not change what the employee receives.',
      },
    ],
  },
};
