import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'completed';
  onClick?: () => void;
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  onClick,
  className = ''
}: CardProps) {
  const baseClasses = 'bg-white p-6 animate-fade-in';

  const variantClasses = {
    default: 'border',
    highlighted: 'border-2',
    completed: 'opacity-70'
  };

  const variantStyles = {
    default: {
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      borderColor: 'var(--color-border)'
    },
    highlighted: {
      borderRadius: 'var(--radius-card)',
      borderColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-card-hover)'
    },
    completed: {
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      backgroundColor: 'var(--color-bg-secondary)'
    }
  };

  const interactiveClass = onClick ? 'cursor-pointer hover:shadow-lg transition-all touch-feedback' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClass} ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </div>
  );
}
