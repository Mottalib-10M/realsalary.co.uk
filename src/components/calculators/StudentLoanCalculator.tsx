import { useState, useEffect } from 'react';
import { calculateStudentLoan } from '../../lib/uk-tax-engine';
import { STUDENT_LOAN_PLANS, type StudentLoanPlan } from '../../data/tax-rules-2026-27';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency } from '../../lib/format';
import InputField from '../ui/InputField';

const URL_CONFIG: UrlStateConfig = {
  income: { type: 'number', default: 30000 },
  plans: { type: 'string[]', default: ['plan2'] },
};

export default function StudentLoanCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      income: p.income as number,
      plans: (p.plans as string[]).filter((pl): pl is StudentLoanPlan =>
        Object.keys(STUDENT_LOAN_PLANS).includes(pl),
      ),
    };
  });

  useEffect(() => {
    writeUrlParams({
      income: state.income,
      plans: state.plans.length > 0 ? state.plans : undefined,
    });
  }, [state]);

  const result = calculateStudentLoan(state.income, state.plans);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <InputField
            label="Annual gross salary"
            prefix="£"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={state.income || ''}
            onChange={(v) => setState((s) => ({ ...s, income: Math.max(0, parseFloat(v) || 0) }))}
          />

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select your loan plan(s)
            </legend>
            <div className="mt-3 space-y-2">
              {(Object.entries(STUDENT_LOAN_PLANS) as [StudentLoanPlan, typeof STUDENT_LOAN_PLANS[StudentLoanPlan]][]).map(
                ([key, config]) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.plans.includes(key)}
                      onChange={(e) => {
                        setState((s) => ({
                          ...s,
                          plans: e.target.checked
                            ? [...s.plans, key]
                            : s.plans.filter((p) => p !== key),
                        }));
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500 dark:border-gray-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{config.name}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        Threshold: {formatCurrency(config.threshold)} | Rate: {(config.rate * 100).toFixed(0)}%
                      </span>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{config.description}</p>
                    </div>
                  </label>
                ),
              )}
            </div>
          </fieldset>
        </div>

        {/* Breakdown per plan */}
        {result.details.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Repayment breakdown</h3>
            <div className="mt-4 space-y-4">
              {result.details.map((d) => {
                const config = STUDENT_LOAN_PLANS[d.plan];
                const aboveThreshold = Math.max(0, state.income - config.threshold);
                return (
                  <div key={d.plan} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{config.name}</span>
                      <span className="text-sm font-bold tabular-nums text-blue-600 dark:text-blue-400">{formatCurrency(d.amount)}/yr</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {(config.rate * 100).toFixed(0)}% of earnings above {formatCurrency(config.threshold)}
                      {aboveThreshold > 0 ? ` = ${(config.rate * 100).toFixed(0)}% of ${formatCurrency(aboveThreshold)}` : ' (below threshold)'}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Monthly: {formatCurrency(d.amount / 12)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reference table */}
        <details className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <summary className="cursor-pointer px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            All student loan plan thresholds
          </summary>
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium text-right">Threshold</th>
                  <th className="pb-2 font-medium text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {(Object.entries(STUDENT_LOAN_PLANS) as [string, typeof STUDENT_LOAN_PLANS[StudentLoanPlan]][]).map(([, config]) => (
                  <tr key={config.name}>
                    <td className="py-2 text-gray-700 dark:text-gray-300">{config.name}</td>
                    <td className="py-2 text-right tabular-nums text-gray-600 dark:text-gray-400">{formatCurrency(config.threshold)}</td>
                    <td className="py-2 text-right tabular-nums text-gray-600 dark:text-gray-400">{(config.rate * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total student loan repayment</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-blue-600 dark:text-blue-400" aria-live="polite">
                {formatCurrency(result.total)}
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">per year</p>
            </div>
            <div className="mt-4 flex gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
                  {formatCurrency(result.total / 12)}
                </p>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Weekly</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
                  {formatCurrency(result.total / 52)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
