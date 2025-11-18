import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SeniorInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  unit?: string;
}

const SeniorInput = forwardRef<HTMLInputElement, SeniorInputProps>(
  ({ label, error, icon, unit, className, ...props }, ref) => {
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
          {icon && (
            <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white px-4 md:px-5 py-4 md:py-5 text-base md:text-lg font-medium touch-area transition-all',
              'focus:outline-none focus:ring-2 focus:ring-opacity-20',
              'border-2 rounded-xl',
              icon && 'pl-12 md:pl-14',
              unit && 'pr-16 md:pr-20',
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
          />
          {unit && (
            <div
              className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-base md:text-lg font-bold pointer-events-none"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {unit}
            </div>
          )}
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

SeniorInput.displayName = 'SeniorInput';

export default SeniorInput;
