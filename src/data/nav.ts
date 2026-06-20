/**
 * Centralised navigation data for Header and Footer components.
 * All internal links use trailing slashes to match trailingSlash: 'always'.
 */

export interface NavLink {
  href: string;
  label: string;
}

export const calcPayLinks: NavLink[] = [
  { href: '/take-home-pay/', label: 'Take-Home Pay' },
  { href: '/hourly-rate/', label: 'Hourly Rate' },
  { href: '/pro-rata/', label: 'Pro-Rata Salary' },
  { href: '/required-salary/', label: 'Required Salary' },
  { href: '/pension-contribution/', label: 'Pension Contribution' },
];

export const calcTaxLinks: NavLink[] = [
  { href: '/income-tax/', label: 'Income Tax' },
  { href: '/national-insurance/', label: 'National Insurance' },
  { href: '/student-loan/', label: 'Student Loan' },
  { href: '/bonus/', label: 'Bonus Tax' },
  { href: '/two-jobs/', label: 'Two Jobs Tax' },
];

export const guideLinks: NavLink[] = [
  { href: '/guides/uk-tax-year-2026-27/', label: 'UK Tax Year 2026/27 Guide' },
  { href: '/guides/how-paye-works/', label: 'How PAYE Works' },
  { href: '/guides/income-tax-bands-explained/', label: 'Income Tax Bands Explained' },
  { href: '/guides/national-insurance-explained/', label: 'National Insurance Explained' },
  { href: '/guides/student-loan-repayment-guide/', label: 'Student Loan Repayment Guide' },
  { href: '/guides/pension-salary-sacrifice-explained/', label: 'Pension & Salary Sacrifice' },
];

export const moreLinks: NavLink[] = [
  { href: '/salary/', label: 'Monthly Salaries' },
  { href: '/news/', label: 'Tax News' },
  { href: '/glossary/', label: 'Glossary' },
];

export const footerCalculatorLinks: NavLink[] = [
  { href: '/', label: 'Salary Calculator' },
  { href: '/take-home-pay/', label: 'Take-Home Pay' },
  { href: '/income-tax/', label: 'Income Tax' },
  { href: '/national-insurance/', label: 'National Insurance' },
  { href: '/student-loan/', label: 'Student Loan' },
  { href: '/pension-contribution/', label: 'Pension' },
  { href: '/bonus/', label: 'Bonus Calculator' },
  { href: '/hourly-rate/', label: 'Hourly Rate' },
  { href: '/pro-rata/', label: 'Pro-Rata' },
  { href: '/required-salary/', label: 'Required Salary' },
  { href: '/two-jobs/', label: 'Two Jobs' },
  { href: '/calculators/', label: 'All Calculators' },
];

export const footerSalaryLinks: NavLink[] = [
  { href: '/salary/', label: 'All Monthly Salaries' },
  { href: '/salary/1000-per-month/', label: '£1,000 Per Month' },
  { href: '/salary/1500-per-month/', label: '£1,500 Per Month' },
  { href: '/salary/2000-per-month/', label: '£2,000 Per Month' },
  { href: '/salary/2500-per-month/', label: '£2,500 Per Month' },
  { href: '/salary/3000-per-month/', label: '£3,000 Per Month' },
];

export const footerInfoLinks: NavLink[] = [
  { href: '/guides/', label: 'Guides' },
  { href: '/news/', label: 'Tax News' },
  { href: '/glossary/', label: 'Glossary' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
  { href: '/privacy/', label: 'Privacy Policy' },
  { href: '/terms/', label: 'Terms of Use' },
  { href: '/legal/', label: 'Legal Notice' },
];
