import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SeniorCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const SeniorCard = forwardRef<HTMLDivElement, SeniorCardProps>(
  ({ children, variant = 'default', padding = 'large', className, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[var(--color-bg-card)] shadow-[var(--shadow-card)]',
      elevated: 'bg-[var(--color-bg-card)] shadow-[var(--shadow-card-hover)]',
      outlined: 'bg-[var(--color-bg-card)] border-2 border-[var(--color-border)]',
    };

    const paddingStyles = {
      none: '',
      small: 'p-3 md:p-4',
      medium: 'p-4 md:p-5',
      large: 'p-5 md:p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl md:rounded-2xl',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SeniorCard.displayName = 'SeniorCard';

export default SeniorCard;
