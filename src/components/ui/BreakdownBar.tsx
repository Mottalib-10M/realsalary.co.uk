import { formatCurrency, formatPercent } from '../../lib/format';
import type { CalculationResult } from '../../lib/uk-tax-engine';
import { useState } from 'react';

interface BreakdownBarProps {
  result: CalculationResult;
}

interface Segment {
  label: string;
  value: number;
  color: string;
  hoverColor: string;
}

export default function BreakdownBar({ result }: BreakdownBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (result.grossAnnual <= 0) return null;

  const segments: Segment[] = [];

  if (result.incomeTax > 0) {
    segments.push({
      label: 'Income Tax',
      value: result.incomeTax,
      color: 'bg-red-400 dark:bg-red-500',
      hoverColor: 'bg-red-500 dark:bg-red-400',
    });
  }

  if (result.nationalInsurance > 0) {
    segments.push({
      label: 'National Insurance',
      value: result.nationalInsurance,
      color: 'bg-orange-400 dark:bg-orange-500',
      hoverColor: 'bg-orange-500 dark:bg-orange-400',
    });
  }

  if (result.studentLoanRepayments > 0) {
    segments.push({
      label: 'Student Loan',
      value: result.studentLoanRepayments,
      color: 'bg-blue-400 dark:bg-blue-500',
      hoverColor: 'bg-blue-500 dark:bg-blue-400',
    });
  }

  if (result.pensionContribution > 0) {
    segments.push({
      label: 'Pension',
      value: result.pensionContribution,
      color: 'bg-purple-400 dark:bg-purple-500',
      hoverColor: 'bg-purple-500 dark:bg-purple-400',
    });
  }

  segments.push({
    label: 'Take-Home',
    value: result.netAnnual,
    color: 'bg-accent-500',
    hoverColor: 'bg-accent-600',
  });

  return (
    <div>
      {/* Bar */}
      <div className="flex h-8 overflow-hidden rounded-full" role="img" aria-label="Salary breakdown bar">
        {segments.map((segment, i) => {
          const pct = (segment.value / result.grossAnnual) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={segment.label}
              className={`transition-all duration-200 ${hoveredIndex === i ? segment.hoverColor : segment.color} ${i === 0 ? '' : ''}`}
              style={{ width: `${pct}%` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              role="presentation"
              aria-label={`${segment.label}: ${formatCurrency(segment.value)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment, i) => {
          const pct = (segment.value / result.grossAnnual) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={segment.label}
              className={`flex items-center gap-1.5 text-xs transition-opacity ${hoveredIndex !== null && hoveredIndex !== i ? 'opacity-50' : ''}`}
            >
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${segment.color}`} />
              <span className="text-gray-600 dark:text-gray-400">
                {segment.label}
              </span>
              <span className="tabular-nums font-medium text-gray-900 dark:text-white">
                {formatCurrency(segment.value)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip on hover */}
      {hoveredIndex !== null && (
        <div className="mt-2 rounded-lg bg-gray-900 px-3 py-2 text-center text-sm text-white dark:bg-gray-700" role="status" aria-live="polite">
          <span className="font-medium">{segments[hoveredIndex].label}:</span>{' '}
          {formatCurrency(segments[hoveredIndex].value)} ({((segments[hoveredIndex].value / result.grossAnnual) * 100).toFixed(1)}% of gross)
        </div>
      )}
    </div>
  );
}
