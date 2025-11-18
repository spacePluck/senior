'use client';

import { useTranslations } from 'next-intl';
import BottomNav from '@/components/BottomNav';
import Icon from '@/components/icons/Icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations();
  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-bg)' }}>
      {/* Simple Header - 토스 스타일 */}
      <header className="spacing-responsive" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="responsive-container">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-responsive-xl font-bold"
              style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
            >
              홍길동님,<br className="md:hidden"/>
              <span className="hidden md:inline"> </span>
              {t('home.greeting')}
            </h1>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                className="relative w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 touch-area"
                style={{
                  background: 'var(--color-bg)',
                  borderRadius: '50%'
                }}
              >
                <Icon name="bell" size={20} color="var(--color-text-primary)" />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: 'var(--color-accent-pink)' }}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="responsive-container space-y-4 md:space-y-6">
        {/* AI 검색 - 모던한 디자인 */}
        <section>
          <div
            className="spacing-responsive"
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}
          >
            <div className="relative">
              <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <Icon name="sparkles" size={20} color="var(--color-primary)" />
              </div>
              <input
                type="text"
                placeholder={t('home.aiAssistant.placeholder')}
                className="w-full bg-white px-12 md:px-14 py-4 md:py-5 pr-14 md:pr-16 text-base md:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-opacity-20 touch-area transition-all"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--color-text-primary)',
                  border: '2px solid rgba(102, 126, 234, 0.15)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.borderColor = 'var(--color-primary)';
                  target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.borderColor = 'rgba(102, 126, 234, 0.15)';
                  target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }}
              />
              <button
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all active:scale-95 touch-area"
                style={{
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                }}
              >
                <Icon name="mic" size={18} color="white" />
              </button>
            </div>
          </div>
        </section>

        {/* 오늘 할 일 */}
        <section className="space-y-3 md:space-y-4">
          <h2
            className="text-responsive-lg font-bold px-1"
            style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
          >
            {t('home.todayTasks.title')} <span style={{ color: 'var(--color-accent-pink)' }}>2</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* 약 복용 카드 */}
            <div
              className="spacing-responsive"
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                <div
                  className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: '#FFE8EF',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Icon name="pill" size={22} color="var(--color-accent-pink)" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base md:text-lg font-bold mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {t('home.todayTasks.morningMedicine')}
                  </h3>
                  <p
                    className="text-sm md:text-base"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {t('home.todayTasks.medicineTime')}
                  </p>
                </div>
              </div>
              <button
                className="w-full py-3 md:py-4 text-sm md:text-base font-bold transition-all active:scale-95 touch-area"
                style={{
                  background: 'var(--color-success)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)'
                }}
                onClick={() => alert(t('home.alerts.medicineComplete'))}
              >
                {t('home.todayTasks.completeMedicine')}
              </button>
            </div>

            {/* 이발 예약 카드 */}
            <div
              className="spacing-responsive"
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                <div
                  className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: '#E8F0FF',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Icon name="scissors" size={22} color="var(--color-primary)" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base md:text-lg font-bold mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {t('home.todayTasks.haircutBooking')}
                  </h3>
                  <p
                    className="text-sm md:text-base"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {t('home.todayTasks.haircutTime')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="flex items-center justify-center gap-1 py-3 md:py-4 text-sm md:text-base font-bold transition-all active:scale-95 touch-area"
                  style={{
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}
                  onClick={() => alert(t('home.alerts.viewLocation'))}
                >
                  <Icon name="mapPin" size={16} color="var(--color-text-secondary)" />
                  {t('common.location')}
                </button>
                <button
                  className="flex items-center justify-center gap-1 py-3 md:py-4 text-sm md:text-base font-bold transition-all active:scale-95 touch-area"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)'
                  }}
                  onClick={() => alert(t('home.alerts.call'))}
                >
                  <Icon name="phone" size={16} color="white" />
                  {t('common.phone')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 */}
        <section className="space-y-3 md:space-y-4">
          <h2
            className="text-responsive-lg font-bold px-1"
            style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
          >
            {t('home.services.title')}
          </h2>

          <div className="responsive-grid responsive-grid-3">
            {[
              { icon: 'scissors', labelKey: 'home.services.haircut', bg: '#FFE8EF', color: 'var(--color-accent-pink)' },
              { icon: 'utensils', labelKey: 'home.services.meal', bg: '#FFF4E8', color: 'var(--color-accent-peach)' },
              { icon: 'hospital', labelKey: 'home.services.hospital', bg: '#E8F0FF', color: 'var(--color-primary)' },
              { icon: 'broom', labelKey: 'home.services.cleaning', bg: '#E8F9F3', color: 'var(--color-success)' },
              { icon: 'gift', labelKey: 'home.services.leisure', bg: '#F4EEFF', color: 'var(--color-accent-purple)' },
              { icon: 'car', labelKey: 'home.services.taxi', bg: '#FFF9E8', color: 'var(--color-accent-yellow)' }
            ].map((service, idx) => (
              <button
                key={idx}
                className="spacing-responsive flex flex-col items-center gap-2 md:gap-3 transition-all active:scale-95 touch-area"
                style={{
                  background: 'var(--color-bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)'
                }}
                onClick={() => alert(`${t(service.labelKey)} 서비스`)}
              >
                <div
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
                  style={{
                    background: service.bg,
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Icon name={service.icon} size={24} color={service.color} />
                </div>
                <span
                  className="text-sm md:text-base font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {t(service.labelKey)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 추천 */}
        <section className="space-y-3 md:space-y-4 pb-4">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-responsive-lg font-bold"
              style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
            >
              {t('home.recommendations.title')}
            </h2>
            <button
              className="text-sm md:text-base font-medium touch-area"
              style={{ color: 'var(--color-primary)' }}
            >
              {t('common.more')}
            </button>
          </div>

          <div
            className="spacing-responsive"
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div className="flex gap-3 md:gap-4 mb-4 md:mb-5">
              <div
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center flex-shrink-0"
                style={{
                  background: '#E8F0FF',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <Icon name="scissors" size={28} color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3
                    className="text-base md:text-lg font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    명성이발관
                  </h3>
                  <span
                    className="text-xs md:text-sm font-bold px-2 py-1"
                    style={{
                      background: '#FFE8EF',
                      color: 'var(--color-accent-pink)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {t('common.regular')}
                  </span>
                </div>
                <p
                  className="text-sm md:text-base mb-2"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {t('home.recommendations.favoriteShop')}
                </p>
                <div className="flex gap-2 text-xs md:text-sm items-center">
                  <div className="flex items-center gap-1">
                    <Icon name="star" size={14} color="var(--color-warning)" />
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>4.9</span>
                  </div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
                  <div className="flex items-center gap-1">
                    <Icon name="mapPin" size={14} color="var(--color-text-tertiary)" />
                    <span style={{ color: 'var(--color-text-secondary)' }}>200m</span>
                  </div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>15,000원</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-3 md:py-4 text-sm md:text-base font-bold transition-all active:scale-95 touch-area"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)'
              }}
              onClick={() => alert(t('home.alerts.bookNow'))}
            >
              {t('home.recommendations.bookNow')}
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
