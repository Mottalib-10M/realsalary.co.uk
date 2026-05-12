import { useState, useEffect } from 'react';
import { calculateProRata, calculateTakeHome } from '../../lib/uk-tax-engine';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';

const URL_CONFIG: UrlStateConfig = {
  fullTime: { type: 'number', default: 30000 },
  fullDays: { type: 'number', default: 5 },
  partDays: { type: 'number', default: 3 },
};

export default function ProRataCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      fullTimeSalary: p.fullTime as number,
      fullTimeDays: p.fullDays as number,
      partTimeDays: p.partDays as number,
    };
  });

  useEffect(() => {
    writeUrlParams({
      fullTime: state.fullTimeSalary,
      fullDays: state.fullTimeDays !== 5 ? state.fullTimeDays : undefined,
      partDays: state.partTimeDays,
    });
  }, [state]);

  const proRataSalary = calculateProRata(state.fullTimeSalary, state.fullTimeDays, state.partTimeDays);
  const fullTimeResult = calculateTakeHome({ grossAnnual: state.fullTimeSalary, region: 'england' });
  const proRataResult = calculateTakeHome({ grossAnnual: proRataSalary, region: 'england' });

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <InputField
            label="Full-time equivalent salary"
            prefix="£"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={state.fullTimeSalary || ''}
            onChange={(v) => setState((s) => ({ ...s, fullTimeSalary: Math.max(0, parseFloat(v) || 0) }))}
            helpText="The salary for the role at full-time hours"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Full-time days per week"
              type="number"
              inputMode="numeric"
              min={1}
              max={7}
              step={0.5}
              value={state.fullTimeDays || ''}
              onChange={(v) => setState((s) => ({ ...s, fullTimeDays: Math.max(1, parseFloat(v) || 5) }))}
            />
            <InputField
              label="Your days per week"
              type="number"
              inputMode="numeric"
              min={0.5}
              max={7}
              step={0.5}
              value={state.partTimeDays || ''}
              onChange={(v) => setState((s) => ({ ...s, partTimeDays: Math.max(0, parseFloat(v) || 0) }))}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pro-rata result</h3>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Full-time gross</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900 dark:text-white">
                £{state.fullTimeSalary.toLocaleString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pro-rata gross</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-navy-700 dark:text-navy-300">
                £{proRataSalary.toLocaleString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Full-time net</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900 dark:text-white">
                £{fullTimeResult.netAnnual.toLocaleString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pro-rata net</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-navy-700 dark:text-navy-300">
                £{proRataResult.netAnnual.toLocaleString('en-GB')}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Working {state.partTimeDays} out of {state.fullTimeDays} days ({((state.partTimeDays / state.fullTimeDays) * 100).toFixed(0)}% FTE)
          </p>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <ResultPanel result={proRataResult} period="yearly" />
        </div>
      </div>
    </div>
  );
}
