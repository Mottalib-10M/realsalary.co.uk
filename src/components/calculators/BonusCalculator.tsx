import { useState, useEffect } from 'react';
import { calculateBonus, type Region } from '../../lib/uk-tax-engine';
import { type StudentLoanPlan, STUDENT_LOAN_PLANS } from '../../data/tax-rules-2026-27';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency } from '../../lib/format';
import InputField from '../ui/InputField';

const URL_CONFIG: UrlStateConfig = {
  salary: { type: 'number', default: 35000 },
  bonus: { type: 'number', default: 5000 },
  region: { type: 'string', default: 'england' },
};

export default function BonusCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      salary: p.salary as number,
      bonus: p.bonus as number,
      region: p.region as Region,
    };
  });

  useEffect(() => {
    writeUrlParams({
      salary: state.salary,
      bonus: state.bonus,
      region: state.region !== 'england' ? state.region : undefined,
    });
  }, [state]);

  const result = calculateBonus(state.salary, state.bonus, state.region);
  const bonusTaxRate = state.bonus > 0 ? ((state.bonus - result.bonusNet) / state.bonus) * 100 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <InputField
            label="Annual base salary"
            prefix="£"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={state.salary || ''}
            onChange={(v) => setState((s) => ({ ...s, salary: Math.max(0, parseFloat(v) || 0) }))}
            helpText="Your regular salary before the bonus"
          />
          <InputField
            label="Bonus amount"
            prefix="£"
            type="number"
            inputMode="numeric"
            min={0}
            step={500}
            value={state.bonus || ''}
            onChange={(v) => setState((s) => ({ ...s, bonus: Math.max(0, parseFloat(v) || 0) }))}
          />
        </div>

        {/* Bonus breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tax on your bonus</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Gross bonus</span>
              <span className="font-medium tabular-nums text-gray-900 dark:text-white">{formatCurrency(state.bonus)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Income tax on bonus</span>
              <span className="font-medium tabular-nums text-red-600 dark:text-red-400">−{formatCurrency(result.bonusIncomeTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">NI on bonus</span>
              <span className="font-medium tabular-nums text-orange-600 dark:text-orange-400">−{formatCurrency(result.bonusNI)}</span>
            </div>
            {result.bonusStudentLoan > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Student loan on bonus</span>
                <span className="font-medium tabular-nums text-blue-600 dark:text-blue-400">−{formatCurrency(result.bonusStudentLoan)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Net bonus</span>
                <span className="text-sm font-bold tabular-nums text-navy-700 dark:text-navy-300">{formatCurrency(result.bonusNet)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">You keep from your bonus</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-navy-700 dark:text-navy-300" aria-live="polite">
                {formatCurrency(result.bonusNet)}
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                out of {formatCurrency(state.bonus)} gross
              </p>
            </div>
            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Effective tax on bonus</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
                {bonusTaxRate.toFixed(1)}%
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Without bonus (net)</span>
                <span className="font-medium tabular-nums text-gray-900 dark:text-white">{formatCurrency(result.withoutBonus.netAnnual)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">With bonus (net)</span>
                <span className="font-medium tabular-nums text-navy-700 dark:text-navy-300">{formatCurrency(result.withBonus.netAnnual)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
