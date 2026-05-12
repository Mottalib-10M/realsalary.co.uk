import { useState, useEffect } from 'react';
import { annualToHourly, hourlyToAnnual, calculateTakeHome, type CalculationResult } from '../../lib/uk-tax-engine';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';

const URL_CONFIG: UrlStateConfig = {
  salary: { type: 'number', default: 30000 },
  hours: { type: 'number', default: 37.5 },
  mode: { type: 'string', default: 'annual' },
};

export default function HourlyRateCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      salary: p.salary as number,
      hoursPerWeek: p.hours as number,
      mode: p.mode as 'annual' | 'hourly',
    };
  });

  useEffect(() => {
    writeUrlParams({
      salary: state.salary,
      hours: state.hoursPerWeek !== 37.5 ? state.hoursPerWeek : undefined,
      mode: state.mode !== 'annual' ? state.mode : undefined,
    });
  }, [state]);

  const annualSalary = state.mode === 'hourly'
    ? hourlyToAnnual(state.salary, state.hoursPerWeek)
    : state.salary;

  const hourlyRate = state.mode === 'annual'
    ? annualToHourly(state.salary, state.hoursPerWeek)
    : state.salary;

  const result: CalculationResult = calculateTakeHome({
    grossAnnual: annualSalary,
    region: 'england',
  });

  const hourlyNet = annualToHourly(result.netAnnual, state.hoursPerWeek);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Mode toggle */}
          <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setState((s) => ({ ...s, mode: 'annual', salary: annualSalary }))}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${state.mode === 'annual' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500'}`}
            >
              Annual → Hourly
            </button>
            <button
              onClick={() => setState((s) => ({ ...s, mode: 'hourly', salary: hourlyRate }))}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${state.mode === 'hourly' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500'}`}
            >
              Hourly → Annual
            </button>
          </div>

          <InputField
            label={state.mode === 'annual' ? 'Annual salary' : 'Hourly rate'}
            prefix="£"
            type="number"
            inputMode="decimal"
            min={0}
            step={state.mode === 'annual' ? 1000 : 0.5}
            value={state.salary || ''}
            onChange={(v) => setState((s) => ({ ...s, salary: Math.max(0, parseFloat(v) || 0) }))}
          />

          <div className="mt-4">
            <InputField
              label="Hours per week"
              type="number"
              inputMode="decimal"
              min={1}
              max={168}
              step={0.5}
              value={state.hoursPerWeek || ''}
              onChange={(v) => setState((s) => ({ ...s, hoursPerWeek: Math.max(1, parseFloat(v) || 37.5) }))}
              helpText="Standard UK full-time is 37.5 hours"
            />
          </div>
        </div>

        {/* Conversion result */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Annual salary</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                £{annualSalary.toLocaleString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hourly rate (gross)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                £{hourlyRate.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net annual</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-navy-700 dark:text-navy-300">
                £{result.netAnnual.toLocaleString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net hourly rate</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-navy-700 dark:text-navy-300">
                £{hourlyNet.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <ResultPanel result={result} period="yearly" />
        </div>
      </div>
    </div>
  );
}
