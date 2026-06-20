import { useState, useEffect } from 'react';
import { calculateTwoJobs, type Region } from '../../lib/uk-tax-engine';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency } from '../../lib/format';
import InputField from '../ui/InputField';
import BreakdownBar from '../ui/BreakdownBar';

const URL_CONFIG: UrlStateConfig = {
  salary1: { type: 'number', default: 25000 },
  salary2: { type: 'number', default: 10000 },
  region: { type: 'string', default: 'england' },
};

export default function TwoJobsCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      salary1: p.salary1 as number,
      salary2: p.salary2 as number,
      region: p.region as Region,
    };
  });

  useEffect(() => {
    writeUrlParams({
      salary1: state.salary1,
      salary2: state.salary2,
      region: state.region !== 'england' ? state.region : undefined,
    });
  }, [state]);

  const result = calculateTwoJobs(state.salary1, state.salary2, state.region);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <InputField
            label="Job 1 salary (main job)"
            prefix="£"
            type="text"
            inputMode="decimal"
            min={0}
            step={1000}
            value={state.salary1 || ''}
            onChange={(v) => setState((s) => ({ ...s, salary1: Math.max(0, parseFloat(v) || 0) }))}
            helpText="Gets your personal allowance (tax code 1257L)"
          />
          <InputField
            label="Job 2 salary (second job)"
            prefix="£"
            type="text"
            inputMode="decimal"
            min={0}
            step={1000}
            value={state.salary2 || ''}
            onChange={(v) => setState((s) => ({ ...s, salary2: Math.max(0, parseFloat(v) || 0) }))}
            helpText="Typically taxed at basic rate (tax code BR)"
          />
        </div>

        {/* Combined summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Combined position</h3>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total gross</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                {formatCurrency(state.salary1 + state.salary2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total deductions</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-red-600 dark:text-red-400">
                {formatCurrency(result.combined.totalDeductions)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total net</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-navy-700 dark:text-navy-300">
                {formatCurrency(result.combined.netAnnual)}
              </p>
            </div>
          </div>
        </div>

        {/* Per-job breakdown */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Job 1', data: result.job1, salary: state.salary1 },
            { label: 'Job 2', data: result.job2, salary: state.salary2 },
          ].map(({ label, data, salary }) => (
            <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Gross</span>
                  <span className="tabular-nums text-gray-900 dark:text-white">{formatCurrency(salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Income tax</span>
                  <span className="tabular-nums text-red-600 dark:text-red-400">−{formatCurrency(data.incomeTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NI</span>
                  <span className="tabular-nums text-orange-600 dark:text-orange-400">−{formatCurrency(data.nationalInsurance)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">Net</span>
                  <span className="font-bold tabular-nums text-navy-700 dark:text-navy-300">{formatCurrency(data.netAnnual)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Underpayment warning */}
        {result.underpayment > 0 && (
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">Potential tax underpayment</h3>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              When your two jobs are taxed independently (as PAYE does), you may underpay by approximately <strong>{formatCurrency(result.underpayment)}</strong> per year.
              HMRC will typically adjust your tax code or collect this after the tax year ends.
            </p>
          </div>
        )}
        {result.underpayment < 0 && (
          <div className="rounded-2xl border-2 border-accent-200 bg-accent-50 p-5 dark:border-accent-800 dark:bg-accent-950">
            <h3 className="text-sm font-semibold text-accent-800 dark:text-accent-200">You may overpay slightly</h3>
            <p className="mt-1 text-sm text-accent-700 dark:text-accent-300">
              The way your tax codes are applied, you could overpay by approximately <strong>{formatCurrency(Math.abs(result.underpayment))}</strong>.
              HMRC should refund this after the tax year.
            </p>
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Combined take-home pay</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-navy-700 dark:text-navy-300" aria-live="polite">
                {formatCurrency(result.combined.netAnnual)}
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">per year ({formatCurrency(result.combined.netAnnual / 12)}/month)</p>
            </div>
            <div className="mt-6">
              <BreakdownBar result={result.combined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
