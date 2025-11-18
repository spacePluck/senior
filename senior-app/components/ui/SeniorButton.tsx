import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SeniorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'xl';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const SeniorButton = forwardRef<HTMLButtonElement, SeniorButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'large',
      fullWidth = false,
      icon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-bold transition-all active:scale-95 touch-area flex items-center justify-center gap-2';

    const variantStyles = {
      primary: 'bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg',
      secondary: 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] border-2 border-[var(--color-border)]',
      success: 'bg-[var(--color-success)] text-white shadow-md hover:shadow-lg',
      danger: 'bg-[var(--color-error)] text-white shadow-md hover:shadow-lg',
      ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-bg)]',
    };

    const sizeStyles = {
      small: 'min-h-[44px] px-4 py-2 text-sm rounded-lg',
      medium: 'min-h-[52px] px-6 py-3 text-base rounded-xl',
      large: 'min-h-[60px] px-8 py-4 text-lg md:text-xl rounded-xl',
      xl: 'min-h-[72px] px-10 py-5 text-xl md:text-2xl rounded-2xl',
    };

    const disabledStyles = disabled
      ? 'opacity-50 cursor-not-allowed active:scale-100'
      : '';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          disabledStyles,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

SeniorButton.displayName = 'SeniorButton';

export default SeniorButton;
