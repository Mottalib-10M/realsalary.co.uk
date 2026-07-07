import { useState, useEffect, useCallback } from 'react';
import { calculateTakeHome, type CalculationResult } from '../../lib/uk-tax-engine';
import { PENSION_AUTO_ENROLMENT } from '../../data/tax-rules-2026-27';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import { formatCurrency } from '../../lib/format';
import InputField from '../ui/InputField';

// ─── Employer NI constants for 2026/27 ──────────────────────────────────────
// These are separate from employee NI and are not defined in tax-rules-2026-27.ts
const EMPLOYER_NI_RATE = 0.15; // 15% from April 2025 onwards
const EMPLOYER_NI_THRESHOLD = 5_000; // £5,000/year secondary threshold
const EMPLOYMENT_ALLOWANCE = 10_500; // £10,500 reduction for eligible employers

const URL_CONFIG: UrlStateConfig = {
  gross: { type: 'number', default: 30000 },
  pensionPct: { type: 'number', default: 3 },
  pensionBasis: { type: 'string', default: 'qualifying' },
  employmentAllowance: { type: 'string', default: 'no' },
};

interface State {
  gross: number;
  pensionPct: number;
  pensionBasis: 'qualifying' | 'full';
  employmentAllowance: boolean;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function calculateEmployerNI(grossAnnual: number): number {
  if (grossAnnual <= EMPLOYER_NI_THRESHOLD) return 0;
  return Math.round((grossAnnual - EMPLOYER_NI_THRESHOLD) * EMPLOYER_NI_RATE * 100) / 100;
}

function calculateEmployerPension(
  grossAnnual: number,
  pensionPct: number,
  pensionBasis: 'qualifying' | 'full',
): number {
  if (pensionPct <= 0) return 0;
  const rate = pensionPct / 100;

  if (pensionBasis === 'full') {
    return Math.round(grossAnnual * rate * 100) / 100;
  }

  // Qualifying earnings basis
  const lower = PENSION_AUTO_ENROLMENT.lowerQualifyingEarnings;
  const upper = PENSION_AUTO_ENROLMENT.upperQualifyingEarnings;
  const qualifyingEarnings = Math.max(0, Math.min(grossAnnual, upper) - lower);
  return Math.round(qualifyingEarnings * rate * 100) / 100;
}

export default function EmployerCostCalculator() {
  const [state, setState] = useState<State>(() => {
    const params = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      gross: params.gross as number,
      pensionPct: params.pensionPct as number,
      pensionBasis: params.pensionBasis as State['pensionBasis'],
      employmentAllowance: (params.employmentAllowance as string) === 'yes',
    };
  });

  // Sync state to URL
  useEffect(() => {
    writeUrlParams({
      gross: state.gross,
      pensionPct: state.pensionPct !== 3 ? state.pensionPct : undefined,
      pensionBasis: state.pensionBasis !== 'qualifying' ? state.pensionBasis : undefined,
      employmentAllowance: state.employmentAllowance ? 'yes' : undefined,
    });
  }, [state]);

  const update = useCallback(<K extends keyof State>(key: K, value: State[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ─── Employer-side calculations ──────────────────────────────────────
  const rawEmployerNI = calculateEmployerNI(state.gross);
  const employerNI = state.employmentAllowance
    ? Math.max(0, rawEmployerNI - EMPLOYMENT_ALLOWANCE)
    : rawEmployerNI;
  const niSaving = state.employmentAllowance
    ? Math.min(rawEmployerNI, EMPLOYMENT_ALLOWANCE)
    : 0;
  const employerPension = calculateEmployerPension(
    state.gross,
    state.pensionPct,
    state.pensionBasis,
  );

  const totalEmployerCost = state.gross + employerNI + employerPension;
  const costAboveGross = employerNI + employerPension;
  const costPerMonth = totalEmployerCost / 12;

  // ─── Employee-side calculations (for comparison) ─────────────────────
  const employeeResult: CalculationResult = calculateTakeHome({
    grossAnnual: state.gross,
    region: 'england',
  });

  const governmentGets =
    employeeResult.incomeTax + employeeResult.nationalInsurance + rawEmployerNI;
  const employeeGets = employeeResult.netAnnual;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Input panel */}
      <div className="lg:col-span-7 space-y-6">
        {/* Gross salary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <InputField
            label="Annual gross salary"
            prefix="£"
            type="text"
            inputMode="decimal"
            min={0}
            step={1000}
            value={state.gross || ''}
            onChange={(v) => update('gross', Math.max(0, parseFloat(v) || 0))}
            placeholder="e.g. 30000"
          />
        </div>

        {/* Pension settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <InputField
            label="Employer pension contribution"
            suffix="%"
            type="text"
            inputMode="decimal"
            min={0}
            max={50}
            step={0.5}
            value={state.pensionPct || ''}
            onChange={(v) =>
              update('pensionPct', Math.min(50, Math.max(0, parseFloat(v) || 0)))
            }
            helpText="Auto-enrolment minimum is 3% employer contribution"
          />

          {/* Pension basis toggle */}
          <fieldset className="mt-4">
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pension calculated on
            </legend>
            <div className="mt-2 flex gap-2">
              {([
                { value: 'qualifying', label: 'Qualifying earnings' },
                { value: 'full', label: 'Full salary' },
              ] as const).map((option) => (
                <label
                  key={option.value}
                  className={[
                    'flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 text-center text-sm font-medium transition-all',
                    state.pensionBasis === option.value
                      ? 'border-navy-500 bg-navy-50 text-navy-700 dark:border-navy-400 dark:bg-navy-950 dark:text-navy-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="pensionBasis"
                    value={option.value}
                    checked={state.pensionBasis === option.value}
                    onChange={(e) =>
                      update('pensionBasis', e.target.value as State['pensionBasis'])
                    }
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
              {state.pensionBasis === 'qualifying'
                ? `Qualifying earnings: ${formatCurrency(PENSION_AUTO_ENROLMENT.lowerQualifyingEarnings)} to ${formatCurrency(PENSION_AUTO_ENROLMENT.upperQualifyingEarnings)}`
                : 'Pension calculated on the full gross salary'}
            </p>
          </fieldset>
        </div>

        {/* Employment Allowance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.employmentAllowance}
              onChange={(e) => update('employmentAllowance', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500 dark:border-gray-600"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Claim Employment Allowance
              </span>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Reduces employer NI by up to {formatCurrency(EMPLOYMENT_ALLOWANCE)}. Not available
                to single-director companies or public-sector employers.
              </p>
            </div>
          </label>
          {state.employmentAllowance && niSaving > 0 && (
            <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Employment Allowance saves you {fmt(niSaving)} in employer NI
            </div>
          )}
        </div>

        {/* Cost breakdown detail */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Employer cost breakdown
          </h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                <th className="pb-2 font-medium">Component</th>
                <th className="pb-2 font-medium text-right">Annual</th>
                <th className="pb-2 font-medium text-right">Monthly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">Gross salary</td>
                <td className="py-2.5 text-right tabular-nums text-gray-900 dark:text-white">
                  {fmt(state.gross)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {fmt(state.gross / 12)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">
                  Employer NI (15%)
                  {state.employmentAllowance && niSaving > 0 && (
                    <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                      (after EA)
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-right tabular-nums text-orange-600 dark:text-orange-400">
                  {fmt(employerNI)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {fmt(employerNI / 12)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">
                  Employer pension ({state.pensionPct}%)
                </td>
                <td className="py-2.5 text-right tabular-nums text-purple-600 dark:text-purple-400">
                  {fmt(employerPension)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {fmt(employerPension / 12)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 font-semibold dark:border-gray-700">
                <td className="pt-3 text-gray-900 dark:text-white">Total employer cost</td>
                <td className="pt-3 text-right tabular-nums text-navy-700 dark:text-navy-300">
                  {fmt(totalEmployerCost)}
                </td>
                <td className="pt-3 text-right tabular-nums text-gray-900 dark:text-white">
                  {fmt(costPerMonth)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Comparison: Employee vs Employer vs Government */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Where the money goes
          </h3>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Based on an England/Wales employee with standard tax code 1257L, no student loans,
            no employee pension
          </p>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                <th className="pb-2 font-medium">Recipient</th>
                <th className="pb-2 font-medium text-right">Annual</th>
                <th className="pb-2 font-medium text-right">% of cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">
                  Employee take-home
                </td>
                <td className="py-2.5 text-right tabular-nums font-medium text-green-600 dark:text-green-400">
                  {fmt(employeeGets)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {totalEmployerCost > 0
                    ? ((employeeGets / totalEmployerCost) * 100).toFixed(1)
                    : '0.0'}
                  %
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">
                  <span>Government</span>
                  <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                    (tax + employee NI + employer NI)
                  </span>
                </td>
                <td className="py-2.5 text-right tabular-nums font-medium text-red-600 dark:text-red-400">
                  {fmt(governmentGets)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {totalEmployerCost > 0
                    ? ((governmentGets / totalEmployerCost) * 100).toFixed(1)
                    : '0.0'}
                  %
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700 dark:text-gray-300">
                  Employer pension pot
                </td>
                <td className="py-2.5 text-right tabular-nums font-medium text-purple-600 dark:text-purple-400">
                  {fmt(employerPension)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  {totalEmployerCost > 0
                    ? ((employerPension / totalEmployerCost) * 100).toFixed(1)
                    : '0.0'}
                  %
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 font-semibold dark:border-gray-700">
                <td className="pt-3 text-gray-900 dark:text-white">Total employer cost</td>
                <td className="pt-3 text-right tabular-nums text-navy-700 dark:text-navy-300">
                  {fmt(totalEmployerCost)}
                </td>
                <td className="pt-3 text-right tabular-nums text-gray-900 dark:text-white">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Results panel (sticky on desktop) */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20 space-y-4">
          {/* Total cost hero */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total employer cost
              </p>
              <p
                className="mt-1 text-4xl font-bold tabular-nums text-navy-700 dark:text-navy-300 result-value"
                aria-live="polite"
              >
                {fmt(totalEmployerCost)}
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">per year</p>
            </div>

            {/* Key figures */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gross salary</span>
                <span className="text-sm font-medium tabular-nums text-gray-900 dark:text-white">
                  {fmt(state.gross)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employer NI</span>
                <span className="text-sm font-medium tabular-nums text-orange-600 dark:text-orange-400">
                  +{fmt(employerNI)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employer pension</span>
                <span className="text-sm font-medium tabular-nums text-purple-600 dark:text-purple-400">
                  +{fmt(employerPension)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total cost
                  </span>
                  <span className="text-sm font-bold tabular-nums text-navy-700 dark:text-navy-300">
                    {fmt(totalEmployerCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost above gross + monthly */}
            <div className="mt-6 flex gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Above gross</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
                  +{fmt(costAboveGross)}
                </p>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Per month</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
                  {fmt(costPerMonth)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick context card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">At a glance</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Employer pays</span>
                <span className="font-medium tabular-nums text-gray-900 dark:text-white">
                  {fmt(totalEmployerCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Employee receives</span>
                <span className="font-medium tabular-nums text-green-600 dark:text-green-400">
                  {fmt(employeeGets)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Difference</span>
                <span className="font-medium tabular-nums text-red-600 dark:text-red-400">
                  {fmt(totalEmployerCost - employeeGets)}
                </span>
              </div>
              <p className="pt-2 text-xs text-gray-400 dark:text-gray-500">
                For every £1 the employee takes home, the employer spends{' '}
                {employeeGets > 0
                  ? `£${(totalEmployerCost / employeeGets).toFixed(2)}`
                  : '---'}
              </p>
            </div>
          </div>

          {/* AdSense placeholder */}
          <div data-ad-slot="below-results" aria-hidden="true">
            {/* AdSense activation pending traffic threshold; affiliate program registration pending. */}
          </div>
        </div>
      </div>
    </div>
  );
}
