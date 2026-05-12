import { useId, type InputHTMLAttributes } from 'react';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  prefix?: string;
  suffix?: string;
  helpText?: string;
  onChange: (value: string) => void;
}

export default function InputField({
  label,
  prefix,
  suffix,
  helpText,
  onChange,
  value,
  ...rest
}: InputFieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative mt-1.5">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
            {prefix}
          </span>
        )}
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            'block w-full rounded-xl border border-gray-300 bg-white py-3 text-base tabular-nums shadow-sm transition-colors',
            'placeholder:text-gray-400',
            'focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20',
            'dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-navy-400 dark:focus:ring-navy-400/20',
            prefix ? 'pl-8' : 'pl-4',
            suffix ? 'pr-16' : 'pr-4',
          ].join(' ')}
          {...rest}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm text-gray-400 dark:text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      {helpText && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
