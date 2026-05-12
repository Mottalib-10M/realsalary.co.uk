import { useState, useEffect } from 'react';
import { calculateTakeHome, calculatePersonalAllowance, type Region } from '../../lib/uk-tax-engine';
import { INCOME_TAX_BANDS_ENGLAND, INCOME_TAX_BANDS_SCOTLAND, DEFAULT_TAX_CODE } from '../../data/tax-rules-2026-27';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency } from '../../lib/format';
import InputField from '../ui/InputField';
import BreakdownBar from '../ui/BreakdownBar';

const URL_CONFIG: UrlStateConfig = {
  income: { type: 'number', default: 30000 },
  region: { type: 'string', default: 'england' },
};

export default function IncomeTaxCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      income: p.income as number,
      region: p.region as Region,
    };
  });

  useEffect(() => {
    writeUrlParams({
      income: state.income,
      region: state.region !== 'england' ? state.region : undefined,
    });
  }, [state]);

  const result = calculateTakeHome({
    grossAnnual: state.income,
    region: state.region,
  });

  const pa = calculatePersonalAllowance(state.income);
  const bands = state.region === 'scotland' ? INCOME_TAX_BANDS_SCOTLAND : INCOME_TAX_BANDS_ENGLAND;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <InputField
            label="Annual income"
            prefix="£"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={state.income || ''}
            onChange={(v) => setState((s) => ({ ...s, income: Math.max(0, parseFloat(v) || 0) }))}
          />

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax region</legend>
            <div className="mt-2 flex gap-3">
              {([
                { value: 'england', label: 'England, Wales & NI' },
                { value: 'scotland', label: 'Scotland' },
              ] as const).map((option) => (
                <label
                  key={option.value}
                  className={[
                    'flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 text-center text-sm font-medium transition-all',
                    state.region === option.value
                      ? 'border-navy-500 bg-navy-50 text-navy-700 dark:border-navy-400 dark:bg-navy-950 dark:text-navy-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="region"
                    value={option.value}
                    checked={state.region === option.value}
                    onChange={(e) => setState((s) => ({ ...s, region: e.target.value as Region }))}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Result summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Personal Allowance</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900 dark:text-white">{formatCurrency(pa)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Income Tax</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-red-600 dark:text-red-400">{formatCurrency(result.incomeTax)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Effective Rate</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900 dark:text-white">
                {state.income > 0 ? ((result.incomeTax / state.income) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
          </div>
        </div>

        {/* Band breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tax band breakdown</h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                <th className="pb-2 font-medium">Band</th>
                <th className="pb-2 font-medium text-right">Rate</th>
                <th className="pb-2 font-medium text-right">Taxable</th>
                <th className="pb-2 font-medium text-right">Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {result.incomeTaxBands.map((band) => (
                <tr key={band.name}>
                  <td className="py-2.5 text-gray-700 dark:text-gray-300">{band.name}</td>
                  <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">{(band.rate * 100).toFixed(0)}%</td>
                  <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">{formatCurrency(band.taxableAmount)}</td>
                  <td className="py-2.5 text-right tabular-nums font-medium text-gray-900 dark:text-white">{formatCurrency(band.tax)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 font-semibold dark:border-gray-700">
                <td className="pt-3 text-gray-900 dark:text-white">Total</td>
                <td />
                <td />
                <td className="pt-3 text-right tabular-nums text-red-600 dark:text-red-400">{formatCurrency(result.incomeTax)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Reference bands */}
        <details className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <summary className="cursor-pointer px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {state.region === 'scotland' ? 'Scottish' : 'UK'} income tax bands used
          </summary>
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                  <th className="pb-2 font-medium">Band</th>
                  <th className="pb-2 font-medium text-right">From</th>
                  <th className="pb-2 font-medium text-right">To</th>
                  <th className="pb-2 font-medium text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {bands.map((band) => (
                  <tr key={band.name}>
                    <td className="py-2 text-gray-700 dark:text-gray-300">{band.name}</td>
                    <td className="py-2 text-right tabular-nums text-gray-600 dark:text-gray-400">{formatCurrency(band.from)}</td>
                    <td className="py-2 text-right tabular-nums text-gray-600 dark:text-gray-400">{band.to === Infinity ? '—' : formatCurrency(band.to)}</td>
                    <td className="py-2 text-right tabular-nums text-gray-600 dark:text-gray-400">{(band.rate * 100).toFixed(0)}%</td>
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total income tax</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-red-600 dark:text-red-400" aria-live="polite">
                {formatCurrency(result.incomeTax)}
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">per year</p>
            </div>
            <div className="mt-6">
              <BreakdownBar result={result} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
