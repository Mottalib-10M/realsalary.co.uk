import { useState, useEffect } from 'react';
import { calculateTakeHome, type PensionConfig } from '../../lib/uk-tax-engine';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency } from '../../lib/format';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';

const URL_CONFIG: UrlStateConfig = {
  gross: { type: 'number', default: 30000 },
  pct: { type: 'number', default: 5 },
  type: { type: 'string', default: 'salary-sacrifice' },
};

export default function PensionCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      gross: p.gross as number,
      pensionPct: p.pct as number,
      pensionType: p.type as PensionConfig['type'],
    };
  });

  useEffect(() => {
    writeUrlParams({
      gross: state.gross,
      pct: state.pensionPct !== 5 ? state.pensionPct : undefined,
      type: state.pensionType !== 'salary-sacrifice' ? state.pensionType : undefined,
    });
  }, [state]);

  const withPension = calculateTakeHome({
    grossAnnual: state.gross,
    region: 'england',
    pension: { type: state.pensionType, percentage: state.pensionPct },
  });

  const withoutPension = calculateTakeHome({
    grossAnnual: state.gross,
    region: 'england',
  });

  const taxSaving = withoutPension.incomeTax - withPension.incomeTax;
  const niSaving = withoutPension.nationalInsurance - withPension.nationalInsurance;
  const totalSaving = taxSaving + niSaving;
  const actualCost = withPension.pensionContribution - totalSaving;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <InputField
            label="Annual gross salary"
            prefix="£"
            type="text"
            inputMode="decimal"
            min={0}
            step={1000}
            value={state.gross || ''}
            onChange={(v) => setState((s) => ({ ...s, gross: Math.max(0, parseFloat(v) || 0) }))}
          />

          <InputField
            label="Employee pension contribution"
            suffix="%"
            type="text"
            inputMode="decimal"
            min={0}
            max={100}
            step={0.5}
            value={state.pensionPct || ''}
            onChange={(v) => setState((s) => ({ ...s, pensionPct: Math.min(100, Math.max(0, parseFloat(v) || 0)) }))}
            helpText="Auto-enrolment minimum is 5% employee"
          />

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pension method</legend>
            <div className="mt-2 flex gap-3">
              {([
                { value: 'salary-sacrifice', label: 'Salary sacrifice', desc: 'Saves tax + NI' },
                { value: 'relief-at-source', label: 'Relief at source', desc: 'Saves tax only' },
              ] as const).map((option) => (
                <label
                  key={option.value}
                  className={[
                    'flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 text-center transition-all',
                    state.pensionType === option.value
                      ? 'border-navy-500 bg-navy-50 dark:border-navy-400 dark:bg-navy-950'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="pensionType"
                    value={option.value}
                    checked={state.pensionType === option.value}
                    onChange={(e) => setState((s) => ({ ...s, pensionType: e.target.value as PensionConfig['type'] }))}
                    className="sr-only"
                  />
                  <span className={`block text-sm font-medium ${state.pensionType === option.value ? 'text-navy-700 dark:text-navy-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {option.label}
                  </span>
                  <span className="block text-xs text-gray-400 dark:text-gray-500">{option.desc}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Comparison */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Impact of pension contribution</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pension contribution</span>
              <span className="font-medium tabular-nums text-purple-600 dark:text-purple-400">{formatCurrency(withPension.pensionContribution)}/yr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Income tax saving</span>
              <span className="font-medium tabular-nums text-accent-600">{formatCurrency(taxSaving)}/yr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">NI saving</span>
              <span className="font-medium tabular-nums text-accent-600">{formatCurrency(niSaving)}/yr</span>
            </div>
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">Actual cost to take-home</span>
                <span className="font-bold tabular-nums text-gray-900 dark:text-white">{formatCurrency(actualCost)}/yr</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                You get {formatCurrency(withPension.pensionContribution)} in your pension pot for only {formatCurrency(actualCost)} less take-home
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Without pension</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-900 dark:text-white">{formatCurrency(withoutPension.netAnnual)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">With pension</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-navy-700 dark:text-navy-300">{formatCurrency(withPension.netAnnual)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <ResultPanel result={withPension} period="yearly" />
        </div>
      </div>
    </div>
  );
}
