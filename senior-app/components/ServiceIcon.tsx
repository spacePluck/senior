import React from 'react';

interface ServiceIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export default function ServiceIcon({ icon, label, onClick }: ServiceIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl hover:scale-105 touch-feedback transition-all"
      style={{
        background: 'white',
        borderRadius: 'var(--radius-card)'
      }}
    >
      <div
        className="w-16 h-16 flex items-center justify-center text-3xl"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(232, 149, 111, 0.25)'
        }}
      >
        {icon}
      </div>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)', letterSpacing: '-0.01em' }}>
        {label}
      </span>
    </button>
  );
}
