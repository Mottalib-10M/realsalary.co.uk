/**
 * Internal linking map for related calculators.
 * Each calculator links to 3–5 related tools.
 */

export interface RelatedCalculator {
  slug: string;
  title: string;
  description: string;
}

export const RELATED_CALCULATORS: Record<string, RelatedCalculator[]> = {
  home: [
    { slug: '/take-home-pay', title: 'Take-Home Pay Calculator', description: 'Detailed net pay breakdown with all deductions' },
    { slug: '/income-tax', title: 'Income Tax Calculator', description: 'See your tax band-by-band' },
    { slug: '/national-insurance', title: 'National Insurance Calculator', description: 'Calculate your NI contributions' },
    { slug: '/pension-contribution', title: 'Pension Calculator', description: 'How pension affects take-home' },
    { slug: '/salary', title: 'Monthly Salary Pages', description: 'Take-home pay for £100–£3,000/month' },
  ],
  'take-home-pay': [
    { slug: '/', title: 'Salary Calculator', description: 'Quick salary overview' },
    { slug: '/required-salary', title: 'Required Salary', description: 'Reverse: gross from net' },
    { slug: '/hourly-rate', title: 'Hourly Rate', description: 'Annual to hourly conversion' },
    { slug: '/pension-contribution', title: 'Pension Calculator', description: 'Pension impact on pay' },
    { slug: '/salary', title: 'Monthly Salary Pages', description: 'Take-home for £100–£3,000/month' },
  ],
  'hourly-rate': [
    { slug: '/', title: 'Salary Calculator', description: 'Full salary breakdown' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Net pay after deductions' },
    { slug: '/pro-rata', title: 'Pro-Rata Calculator', description: 'Part-time salary calculation' },
  ],
  'pro-rata': [
    { slug: '/', title: 'Salary Calculator', description: 'Full salary breakdown' },
    { slug: '/hourly-rate', title: 'Hourly Rate', description: 'Convert to hourly rate' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Net pay after deductions' },
  ],
  'income-tax': [
    { slug: '/', title: 'Salary Calculator', description: 'Full salary breakdown' },
    { slug: '/national-insurance', title: 'National Insurance', description: 'NI contributions' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Complete deductions' },
    { slug: '/pension-contribution', title: 'Pension Calculator', description: 'Tax-efficient pension' },
    { slug: '/salary', title: 'Monthly Salary Pages', description: 'Tax breakdown by monthly salary' },
  ],
  'national-insurance': [
    { slug: '/', title: 'Salary Calculator', description: 'Full salary breakdown' },
    { slug: '/income-tax', title: 'Income Tax', description: 'Tax band breakdown' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Complete deductions' },
    { slug: '/pension-contribution', title: 'Pension Calculator', description: 'NI savings via pension' },
  ],
  'student-loan': [
    { slug: '/', title: 'Salary Calculator', description: 'Full salary overview' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Net pay with loan' },
    { slug: '/required-salary', title: 'Required Salary', description: 'Gross needed for target net' },
    { slug: '/two-jobs', title: 'Two Jobs', description: 'Combined tax with two jobs' },
  ],
  'pension-contribution': [
    { slug: '/', title: 'Salary Calculator', description: 'Full salary breakdown' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Net pay after pension' },
    { slug: '/income-tax', title: 'Income Tax', description: 'Tax savings from pension' },
    { slug: '/national-insurance', title: 'National Insurance', description: 'NI savings from sacrifice' },
    { slug: '/bonus', title: 'Bonus Calculator', description: 'Put bonus into pension' },
  ],
  bonus: [
    { slug: '/', title: 'Salary Calculator', description: 'Regular salary breakdown' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Full net pay breakdown' },
    { slug: '/income-tax', title: 'Income Tax', description: 'Tax band breakdown' },
    { slug: '/pension-contribution', title: 'Pension Calculator', description: 'Pension from bonus' },
  ],
  'required-salary': [
    { slug: '/', title: 'Salary Calculator', description: 'Forward salary calculator' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Net pay breakdown' },
    { slug: '/hourly-rate', title: 'Hourly Rate', description: 'Convert to hourly' },
    { slug: '/two-jobs', title: 'Two Jobs', description: 'Combined tax position' },
  ],
  'two-jobs': [
    { slug: '/', title: 'Salary Calculator', description: 'Single job calculator' },
    { slug: '/take-home-pay', title: 'Take-Home Pay', description: 'Net pay breakdown' },
    { slug: '/income-tax', title: 'Income Tax', description: 'Tax band breakdown' },
    { slug: '/student-loan', title: 'Student Loan', description: 'Loan across two jobs' },
  ],
};
