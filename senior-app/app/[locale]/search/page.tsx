'use client';

import { useTranslations, useLocale } from 'next-intl';
import Card from '@/components/Card';
import BottomNav from '@/components/BottomNav';
import { useState } from 'react';

export default function SearchPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchText, setSearchText] = useState('');

  const categories = [
    { icon: '💈', labelKey: 'search.categories.haircut', path: `/${locale}/search/haircut` },
    { icon: '🍚', labelKey: 'search.categories.meal', path: `/${locale}/search/meal` },
    { icon: '🏥', labelKey: 'search.categories.hospital', path: `/${locale}/search/hospital` },
    { icon: '🧹', labelKey: 'search.categories.life', path: `/${locale}/search/life` },
    { icon: '🎉', labelKey: 'search.categories.leisure', path: `/${locale}/search/leisure` },
    { icon: '🚕', labelKey: 'search.categories.transport', path: `/${locale}/search/transport` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-6 shadow-sm">
        <div className="max-w-screen-sm mx-auto">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">{t('search.title')}</h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:outline-none transition-colors"
              style={{ borderColor: searchText ? '#FF8C42' : undefined }}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-600">{t('search.categories.title')}</h2>

          <div className="space-y-3">
            {categories.map((category) => (
              <Card
                key={category.path}
                onClick={() => alert(`${t(category.labelKey)} 페이지로 이동`)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl"
                      style={{
                        background: 'linear-gradient(135deg, #FFA566 0%, #FF8C42 100%)'
                      }}
                    >
                      {category.icon}
                    </div>
                    <span className="text-lg font-bold">{t(category.labelKey)}</span>
                  </div>
                  <span className="text-2xl text-gray-400">→</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 최근 검색 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-600">{t('search.recent.title')}</h2>

          <Card>
            <div className="flex items-center gap-3">
              <span className="text-xl">🕐</span>
              <span className="text-base text-gray-600">{t('search.recent.haircut')}</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="text-xl">🕐</span>
              <span className="text-base text-gray-600">{t('search.recent.cleaning')}</span>
            </div>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
