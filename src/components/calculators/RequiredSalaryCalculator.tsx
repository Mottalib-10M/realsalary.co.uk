import { useState, useEffect } from 'react';
import { calculateRequiredGross, calculateTakeHome, type Region } from '../../lib/uk-tax-engine';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency } from '../../lib/format';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';

const URL_CONFIG: UrlStateConfig = {
  targetNet: { type: 'number', default: 2000 },
  period: { type: 'string', default: 'monthly' },
  region: { type: 'string', default: 'england' },
};

export default function RequiredSalaryCalculator() {
  const [state, setState] = useState(() => {
    const p = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      targetNet: p.targetNet as number,
      period: p.period as 'monthly' | 'yearly',
      region: p.region as Region,
    };
  });

  useEffect(() => {
    writeUrlParams({
      targetNet: state.targetNet,
      period: state.period !== 'monthly' ? state.period : undefined,
      region: state.region !== 'england' ? state.region : undefined,
    });
  }, [state]);

  const targetAnnual = state.period === 'monthly' ? state.targetNet * 12 : state.targetNet;
  const requiredGross = calculateRequiredGross(targetAnnual, state.region);
  const result = calculateTakeHome({ grossAnnual: requiredGross, region: state.region });

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <InputField
            label={`Target take-home pay (${state.period})`}
            prefix="£"
            type="number"
            inputMode="numeric"
            min={0}
            step={state.period === 'monthly' ? 100 : 1000}
            value={state.targetNet || ''}
            onChange={(v) => setState((s) => ({ ...s, targetNet: Math.max(0, parseFloat(v) || 0) }))}
            helpText="The net amount you want to receive"
          />

          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {(['monthly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setState((s) => ({ ...s, period: p }))}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${state.period === p ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500'}`}
              >
                {p === 'monthly' ? 'Per month' : 'Per year'}
              </button>
            ))}
          </div>
        </div>

        {/* Answer */}
        <div className="rounded-2xl border-2 border-navy-200 bg-navy-50 p-6 dark:border-navy-800 dark:bg-navy-950">
          <p className="text-sm text-navy-600 dark:text-navy-400">
            To take home {formatCurrency(targetAnnual)} per year
            {state.period === 'monthly' && ` (${formatCurrency(state.targetNet)}/month)`}, you need a gross salary of:
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-navy-700 dark:text-navy-300">
            {formatCurrency(requiredGross)}
          </p>
          <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">
            per year ({formatCurrency(requiredGross / 12)}/month)
          </p>
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
