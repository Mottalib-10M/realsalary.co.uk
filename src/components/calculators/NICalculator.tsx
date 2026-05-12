import { useState, useEffect } from 'react';
import { calculateNationalInsurance } from '../../lib/uk-tax-engine';
import { NI_PRIMARY_THRESHOLD, NI_UPPER_EARNINGS_LIMIT, NI_MAIN_RATE, NI_ADDITIONAL_RATE } from '../../data/tax-rules-2026-27';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency, formatPercent } from '../../lib/format';
import InputField from '../ui/InputField';

const URL_CONFIG: UrlStateConfig = {
  income: { type: 'number', default: 30000 },
};

export default function NICalculator() {
  const [income, setIncome] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return p.income as number;
  });

  useEffect(() => {
    writeUrlParams({ income });
  }, [income]);

  const ni = calculateNationalInsurance(income);
  const effectiveRate = income > 0 ? (ni / income) * 100 : 0;

  // Band breakdown
  const mainBandAmount = income <= NI_PRIMARY_THRESHOLD
    ? 0
    : Math.min(income, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD;
  const additionalBandAmount = income > NI_UPPER_EARNINGS_LIMIT
    ? income - NI_UPPER_EARNINGS_LIMIT
    : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <InputField
            label="Annual gross salary"
            prefix="£"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={income || ''}
            onChange={(v) => setIncome(Math.max(0, parseFloat(v) || 0))}
          />
        </div>

        {/* NI breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">NI contribution breakdown</h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                <th className="pb-2 font-medium">Earnings band</th>
                <th className="pb-2 font-medium text-right">Rate</th>
                <th className="pb-2 font-medium text-right">Amount</th>
                <th className="pb-2 font-medium text-right">NI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">Below threshold</td>
                <td className="py-2.5 text-right tabular-nums text-gray-400">0%</td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {formatCurrency(Math.min(income, NI_PRIMARY_THRESHOLD))}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">
                  {formatCurrency(NI_PRIMARY_THRESHOLD)} – {formatCurrency(NI_UPPER_EARNINGS_LIMIT)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-400">{(NI_MAIN_RATE * 100).toFixed(0)}%</td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {formatCurrency(mainBandAmount)}
                </td>
                <td className="py-2.5 text-right tabular-nums font-medium text-gray-900 dark:text-white">
                  {formatCurrency(mainBandAmount * NI_MAIN_RATE)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">Above {formatCurrency(NI_UPPER_EARNINGS_LIMIT)}</td>
                <td className="py-2.5 text-right tabular-nums text-gray-400">{(NI_ADDITIONAL_RATE * 100).toFixed(0)}%</td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {formatCurrency(additionalBandAmount)}
                </td>
                <td className="py-2.5 text-right tabular-nums font-medium text-gray-900 dark:text-white">
                  {formatCurrency(additionalBandAmount * NI_ADDITIONAL_RATE)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 font-semibold dark:border-gray-700">
                <td className="pt-3 text-gray-900 dark:text-white">Total NI</td>
                <td />
                <td />
                <td className="pt-3 text-right tabular-nums text-orange-600 dark:text-orange-400">{formatCurrency(ni)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">National Insurance</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-orange-600 dark:text-orange-400" aria-live="polite">
                {formatCurrency(ni)}
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">per year</p>
            </div>
            <div className="mt-4 flex gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{formatCurrency(ni / 12)}</p>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Effective rate</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{effectiveRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
