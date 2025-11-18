'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Icon from '@/components/icons/Icon';

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();

  const navItems = [
    { icon: 'home', labelKey: 'common.home', path: `/${locale}` },
    { icon: 'search', labelKey: 'common.search', path: `/${locale}/search` },
    { icon: 'calendarCheck', labelKey: 'common.bookings', path: `/${locale}/bookings` },
    { icon: 'user', labelKey: 'common.profile', path: `/${locale}/profile` },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white z-50"
      style={{
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="responsive-container flex justify-around items-center h-20 md:h-24">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full touch-feedback transition-all touch-area"
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)'
              }}
            >
              <Icon
                name={item.icon}
                size={24}
                color={isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
              />
              <span
                className="text-xs md:text-sm font-medium"
                style={{
                  fontWeight: isActive ? 600 : 500
                }}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
