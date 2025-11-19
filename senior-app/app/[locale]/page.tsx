'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BottomNav from '@/components/BottomNav';
import Icon from '@/components/icons/Icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const router = useRouter();
  const t = useTranslations('home');

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('appName')}
              </h1>
              <p className="text-sm md:text-base text-gray-500 mt-1">
                {t('appSubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button className="relative p-2 hover:bg-gray-50 rounded-lg transition">
                <Icon name="bell" size={24} color="#374151" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t('greetingName', { name: '홍길동' })}
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            {t('greetingMessage')}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/ai/chat')}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition"
            >
              <Icon name="sparkles" size={20} color="#2563EB" />
              {t('aiHealthConsult')}
            </button>
            <button
              onClick={() => router.push('/ai/report')}
              className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition"
            >
              <Icon name="fileText" size={20} color="white" />
              {t('weeklyReport')}
            </button>
          </div>
        </section>

        {/* Services */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 px-1">
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <button
              onClick={() => alert('이발 서비스 (Phase 2)')}
              className="bg-white rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Icon name="scissors" size={24} color="#EC4899" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900">{t('services.haircut')}</h3>
            </button>

            <button
              onClick={() => alert('식사 서비스 (Phase 2)')}
              className="bg-white rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Icon name="utensils" size={24} color="#F97316" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900">{t('services.meal')}</h3>
            </button>

            <button
              onClick={() => alert('병원 예약 서비스 (Phase 2)')}
              className="bg-white rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Icon name="hospital" size={24} color="#3B82F6" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900">{t('services.hospital')}</h3>
            </button>

            <button
              onClick={() => router.push('/medications')}
              className="bg-white rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Icon name="pill" size={24} color="#14B8A6" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900">{t('services.medication')}</h3>
            </button>

            <button
              onClick={() => alert('여가 서비스 (Phase 2)')}
              className="bg-white rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Icon name="gift" size={24} color="#A855F7" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900">{t('services.leisure')}</h3>
            </button>

            <button
              onClick={() => alert('택시 호출 서비스 (Phase 2)')}
              className="bg-white rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Icon name="car" size={24} color="#F59E0B" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900">{t('services.taxi')}</h3>
            </button>
          </div>
        </section>

        {/* Today's Tasks */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {t('todayTasks.title')} <span className="text-blue-600">{t('todayTasks.count', { count: 2 })}</span>
            </h2>
            <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">
              {t('todayTasks.viewAll')}
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-6 border-l-4 border-pink-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="pill" size={24} color="#EC4899" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {t('todayTasks.morningMedicine')}
                    </h3>
                    <p className="text-gray-600 mb-2">{t('todayTasks.medicineList')}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon name="clock" size={16} color="#6B7280" />
                      <span>{t('todayTasks.medicineTime')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/medications')}
                className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
              >
                {t('todayTasks.completeMedicine')}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="hospital" size={24} color="#3B82F6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {t('todayTasks.hospitalVisit')}
                    </h3>
                    <p className="text-gray-600 mb-2">{t('todayTasks.hospitalName')}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon name="clock" size={16} color="#6B7280" />
                      <span>{t('todayTasks.hospitalTime')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Icon name="mapPin" size={18} color="#374151" />
                  {t('todayTasks.location')}
                </button>
                <button className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Icon name="phone" size={18} color="white" />
                  {t('todayTasks.phone')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* This Week's Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {t('recommendations.title')}
            </h2>
            <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">
              {t('recommendations.viewMore')}
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="scissors" size={24} color="#EC4899" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {t('recommendations.haircutShop.name')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {t('recommendations.haircutShop.description')}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Icon name="star" size={16} color="#F59E0B" />
                          <span className="font-semibold text-gray-900">{t('recommendations.haircutShop.rating')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="mapPin" size={16} color="#6B7280" />
                          <span>{t('recommendations.haircutShop.distance')}</span>
                        </div>
                        <span className="font-semibold text-blue-600">{t('recommendations.haircutShop.price')}</span>
                      </div>
                    </div>
                    <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">
                      {t('recommendations.regular')}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mt-3">
                    {t('recommendations.bookNow')}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="utensils" size={24} color="#F97316" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {t('recommendations.healthyLunchbox.name')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {t('recommendations.healthyLunchbox.description')}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Icon name="star" size={16} color="#F59E0B" />
                          <span className="font-semibold text-gray-900">{t('recommendations.healthyLunchbox.rating')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="clock" size={16} color="#6B7280" />
                          <span>{t('recommendations.healthyLunchbox.delivery')}</span>
                        </div>
                        <span className="font-semibold text-blue-600">{t('recommendations.healthyLunchbox.price')}</span>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      {t('recommendations.new')}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mt-3">
                    {t('recommendations.orderNow')}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="gift" size={24} color="#A855F7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {t('recommendations.yogaClass.name')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {t('recommendations.yogaClass.description')}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Icon name="star" size={16} color="#F59E0B" />
                          <span className="font-semibold text-gray-900">{t('recommendations.yogaClass.rating')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="mapPin" size={16} color="#6B7280" />
                          <span>{t('recommendations.yogaClass.distance')}</span>
                        </div>
                        <span className="font-semibold text-blue-600">{t('recommendations.free')}</span>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      {t('recommendations.popular')}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mt-3">
                    {t('recommendations.applyNow')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Summary */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {t('healthSummary.title')}
            </h2>
            <button
              onClick={() => router.push('/health')}
              className="text-sm text-blue-600 font-semibold hover:text-blue-700"
            >
              {t('healthSummary.viewDetails')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Icon name="heart" size={20} color="#EF4444" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('healthSummary.bloodPressure')}</p>
                  <p className="text-xl font-bold text-gray-900">120/80</p>
                </div>
              </div>
              <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">
                {t('healthSummary.normal')}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon name="droplet" size={20} color="#3B82F6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('healthSummary.bloodSugar')}</p>
                  <p className="text-xl font-bold text-gray-900">95 mg/dL</p>
                </div>
              </div>
              <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">
                {t('healthSummary.normal')}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon name="activity" size={20} color="#8B5CF6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('healthSummary.medicationAdherence')}</p>
                  <p className="text-xl font-bold text-gray-900">92%</p>
                </div>
              </div>
              <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">
                {t('healthSummary.excellent')}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
