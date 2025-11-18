import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'disabled';
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'touch-feedback font-bold py-4 px-6 transition-all duration-200';

  const variantClasses = {
    primary: 'text-white hover:opacity-90',
    secondary: 'bg-white border-2 hover:bg-gray-50',
    disabled: 'text-gray-400 cursor-not-allowed'
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-button)',
      borderRadius: 'var(--radius-button)',
      fontSize: '18px',
      minHeight: '56px',
      letterSpacing: '-0.01em'
    },
    secondary: {
      borderColor: 'var(--color-primary)',
      color: 'var(--color-primary)',
      borderRadius: 'var(--radius-button)',
      fontSize: '18px',
      minHeight: '56px',
      letterSpacing: '-0.01em'
    },
    disabled: {
      backgroundColor: 'var(--color-border)',
      borderRadius: 'var(--radius-button)',
      fontSize: '18px',
      minHeight: '56px'
    }
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={variant !== 'disabled' ? onClick : undefined}
      disabled={variant === 'disabled'}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className} touch-area`}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  );
}
