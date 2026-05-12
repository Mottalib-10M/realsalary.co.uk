import { formatCurrency, formatPercent } from '../../lib/format';
import type { CalculationResult } from '../../lib/uk-tax-engine';
import { PERIODS, type Period } from '../../data/tax-rules-2026-27';
import BreakdownBar from './BreakdownBar';

interface ResultPanelProps {
  result: CalculationResult;
  period: Period;
}

export default function ResultPanel({ result, period }: ResultPanelProps) {
  const divisor = PERIODS[period].divisor;
  const periodLabel = PERIODS[period].label.toLowerCase();

  const rows = [
    { label: 'Gross salary', value: result.grossAnnual, color: 'text-gray-900 dark:text-white' },
    ...(result.pensionContribution > 0
      ? [{ label: 'Pension contribution', value: -result.pensionContribution, color: 'text-purple-600 dark:text-purple-400' }]
      : []),
    { label: 'Income tax', value: -result.incomeTax, color: 'text-red-600 dark:text-red-400' },
    { label: 'National Insurance', value: -result.nationalInsurance, color: 'text-orange-600 dark:text-orange-400' },
    ...(result.studentLoanRepayments > 0
      ? [{ label: 'Student loan', value: -result.studentLoanRepayments, color: 'text-blue-600 dark:text-blue-400' }]
      : []),
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Big net figure */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Your take-home pay
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-navy-700 dark:text-navy-300 result-value" aria-live="polite">
          {formatCurrency(result.netAnnual / divisor)}
        </p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          per {periodLabel}
        </p>
      </div>

      {/* Breakdown bar */}
      <div className="mt-6">
        <BreakdownBar result={result} />
      </div>

      {/* Line items */}
      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{row.label}</span>
            <span className={`text-sm font-medium tabular-nums ${row.color}`}>
              {row.value < 0 ? '−' : ''}{formatCurrency(Math.abs(row.value) / divisor)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Net take-home</span>
            <span className="text-sm font-bold tabular-nums text-navy-700 dark:text-navy-300">
              {formatCurrency(result.netAnnual / divisor)}
            </span>
          </div>
        </div>
      </div>

      {/* Rates */}
      <div className="mt-6 flex gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Effective rate</p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
            {formatPercent(result.effectiveTaxRate)}
          </p>
        </div>
        <div className="w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Marginal rate</p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
            {formatPercent(result.marginalTaxRate)}
          </p>
        </div>
      </div>

      {/* AdSense placeholder */}
      <div className="mt-6" data-ad-slot="below-results" aria-hidden="true">
        {/* AdSense activation pending traffic threshold; affiliate program registration pending. */}
      </div>
    </div>
  );
}
