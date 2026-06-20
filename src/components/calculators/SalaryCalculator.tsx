import { useState, useEffect, useCallback } from 'react';
import { calculateTakeHome, type Region, type PensionConfig, type CalculationResult } from '../../lib/uk-tax-engine';
import { STUDENT_LOAN_PLANS, PERIODS, type StudentLoanPlan, type Period, DEFAULT_TAX_CODE } from '../../data/tax-rules-2026-27';
import { readUrlParams, writeUrlParams, type UrlStateConfig } from '../../lib/url-state';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';

const URL_CONFIG: UrlStateConfig = {
  gross: { type: 'number', default: 30000 },
  region: { type: 'string', default: 'england' },
  taxCode: { type: 'string', default: DEFAULT_TAX_CODE },
  studentLoan: { type: 'string[]', default: [] },
  pensionType: { type: 'string', default: 'none' },
  pensionPct: { type: 'number', default: 5 },
  period: { type: 'string', default: 'yearly' },
};

interface State {
  gross: number;
  region: Region;
  taxCode: string;
  studentLoan: StudentLoanPlan[];
  pensionType: 'none' | 'salary-sacrifice' | 'relief-at-source';
  pensionPct: number;
  period: Period;
}

export default function SalaryCalculator() {
  const [state, setState] = useState<State>(() => {
    const params = readUrlParams<Record<string, unknown>>(URL_CONFIG);
    return {
      gross: params.gross as number,
      region: params.region as Region,
      taxCode: params.taxCode as string,
      studentLoan: (params.studentLoan as string[]).filter((p): p is StudentLoanPlan =>
        Object.keys(STUDENT_LOAN_PLANS).includes(p),
      ),
      pensionType: params.pensionType as State['pensionType'],
      pensionPct: params.pensionPct as number,
      period: params.period as Period,
    };
  });

  const [showAdvanced, setShowAdvanced] = useState(() => {
    return state.taxCode !== DEFAULT_TAX_CODE ||
      state.studentLoan.length > 0 ||
      state.pensionType !== 'none';
  });

  // Sync state to URL
  useEffect(() => {
    writeUrlParams({
      gross: state.gross,
      region: state.region !== 'england' ? state.region : undefined,
      taxCode: state.taxCode !== DEFAULT_TAX_CODE ? state.taxCode : undefined,
      studentLoan: state.studentLoan.length > 0 ? state.studentLoan : undefined,
      pensionType: state.pensionType !== 'none' ? state.pensionType : undefined,
      pensionPct: state.pensionType !== 'none' ? state.pensionPct : undefined,
      period: state.period !== 'yearly' ? state.period : undefined,
    });
  }, [state]);

  const update = useCallback(<K extends keyof State>(key: K, value: State[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Calculate result
  const pension: PensionConfig | undefined =
    state.pensionType !== 'none'
      ? { type: state.pensionType, percentage: state.pensionPct }
      : undefined;

  const result: CalculationResult = calculateTakeHome({
    grossAnnual: state.gross,
    region: state.region,
    taxCode: state.taxCode || undefined,
    studentLoans: state.studentLoan,
    pension,
  });

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

          {/* Period selector */}
          <div className="mt-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {(Object.keys(PERIODS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => update('period', p)}
                className={[
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  state.period === p
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                ].join(' ')}
              >
                {PERIODS[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tax region
            </legend>
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
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="region"
                    value={option.value}
                    checked={state.region === option.value}
                    onChange={(e) => update('region', e.target.value as Region)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Advanced options toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-4 text-left text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-expanded={showAdvanced}
        >
          <span>Tax code, student loan & pension</span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="space-y-6">
            {/* Tax code */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <InputField
                label="Tax code"
                value={state.taxCode}
                onChange={(v) => update('taxCode', v.toUpperCase())}
                placeholder="e.g. 1257L"
                helpText="Check your payslip or P45. Most people have 1257L."
              />
            </div>

            {/* Student loan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student loan plans
                </legend>
                <div className="mt-3 space-y-2">
                  {(Object.entries(STUDENT_LOAN_PLANS) as [StudentLoanPlan, typeof STUDENT_LOAN_PLANS[StudentLoanPlan]][]).map(
                    ([key, config]) => (
                      <label key={key} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.studentLoan.includes(key)}
                          onChange={(e) => {
                            update(
                              'studentLoan',
                              e.target.checked
                                ? [...state.studentLoan, key]
                                : state.studentLoan.filter((p) => p !== key),
                            );
                          }}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500 dark:border-gray-600"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {config.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                            {config.description}
                          </span>
                        </div>
                      </label>
                    ),
                  )}
                </div>
              </fieldset>
            </div>

            {/* Pension */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pension contribution
                </legend>
                <div className="mt-2 flex gap-2">
                  {([
                    { value: 'none', label: 'None' },
                    { value: 'salary-sacrifice', label: 'Salary sacrifice' },
                    { value: 'relief-at-source', label: 'Relief at source' },
                  ] as const).map((option) => (
                    <label
                      key={option.value}
                      className={[
                        'flex-1 cursor-pointer rounded-xl border-2 px-3 py-2.5 text-center text-xs font-medium transition-all',
                        state.pensionType === option.value
                          ? 'border-navy-500 bg-navy-50 text-navy-700 dark:border-navy-400 dark:bg-navy-950 dark:text-navy-300'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="pensionType"
                        value={option.value}
                        checked={state.pensionType === option.value}
                        onChange={(e) => update('pensionType', e.target.value as State['pensionType'])}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {state.pensionType !== 'none' && (
                <div className="mt-4">
                  <InputField
                    label="Employee contribution"
                    suffix="%"
                    type="text"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step={0.5}
                    value={state.pensionPct || ''}
                    onChange={(v) => update('pensionPct', Math.min(100, Math.max(0, parseFloat(v) || 0)))}
                    helpText="Auto-enrolment minimum is 5% employee, 3% employer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tax bands detail */}
        {result.incomeTaxBands.length > 0 && (
          <details className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <summary className="cursor-pointer px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              How this is calculated
            </summary>
            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Income tax bands applied
              </h3>
              <table className="mt-3 w-full text-sm">
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
                      <td className="py-2 text-gray-700 dark:text-gray-300">{band.name}</td>
                      <td className="py-2 text-right tabular-nums text-gray-600 dark:text-gray-400">
                        {(band.rate * 100).toFixed(0)}%
                      </td>
                      <td className="py-2 text-right tabular-nums text-gray-600 dark:text-gray-400">
                        £{band.taxableAmount.toLocaleString('en-GB')}
                      </td>
                      <td className="py-2 text-right tabular-nums font-medium text-gray-900 dark:text-white">
                        £{band.tax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200 font-semibold dark:border-gray-700">
                    <td className="pt-2 text-gray-900 dark:text-white">Total income tax</td>
                    <td />
                    <td />
                    <td className="pt-2 text-right tabular-nums text-gray-900 dark:text-white">
                      £{result.incomeTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </details>
        )}
      </div>

      {/* Results panel (sticky on desktop) */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <ResultPanel result={result} period={state.period} />
        </div>
      </div>
    </div>
  );
}
