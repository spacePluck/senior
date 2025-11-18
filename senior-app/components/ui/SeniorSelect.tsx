import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/icons/Icon';

export interface SeniorSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const SeniorSelect = forwardRef<HTMLSelectElement, SeniorSelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-base md:text-lg font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full bg-white px-4 md:px-5 py-4 md:py-5 pr-12 md:pr-14 text-base md:text-lg font-medium touch-area transition-all appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-opacity-20',
              'border-2 rounded-xl cursor-pointer',
              error
                ? 'border-[var(--color-error)]'
                : 'border-[rgba(102,126,234,0.15)] focus:border-[var(--color-primary)]',
              className
            )}
            style={{
              color: 'var(--color-text-primary)',
              boxShadow: error ? '0 2px 8px rgba(239, 68, 68, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="chevronDown" size={20} color="var(--color-text-tertiary)" />
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm md:text-base font-medium" style={{ color: 'var(--color-error)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

SeniorSelect.displayName = 'SeniorSelect';

export default SeniorSelect;
