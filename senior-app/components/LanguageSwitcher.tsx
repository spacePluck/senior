'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

const languageNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語'
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    // 현재 경로에서 locale 부분을 새 locale로 교체
    const segments = pathname.split('/').filter(Boolean);
    const currentLocaleIndex = segments.findIndex(seg => locales.includes(seg as Locale));

    let newPathname: string;
    if (currentLocaleIndex >= 0) {
      // locale이 경로에 있는 경우 교체
      segments[currentLocaleIndex] = newLocale;
      newPathname = '/' + segments.join('/');
    } else {
      // locale이 없는 경우 (루트 경로) 새 locale 추가
      newPathname = `/${newLocale}${pathname === '/' ? '' : pathname}`;
    }

    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all touch-area ${
            locale === lang
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
          }`}
        >
          {languageNames[lang]}
        </button>
      ))}
    </div>
  );
}

