'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { formatDate, formatTime } from '@/lib/utils';
import type { Database } from '@/types/database';

type HealthRecord = Database['public']['Tables']['health_records']['Row'];

export default function HealthPage() {
  const t = useTranslations();
  const router = useRouter();
  const { records, loading } = useHealthRecords();

  const recordsByType = {
    blood_pressure: records.filter((r) => r.type === 'blood_pressure').slice(0, 3),
    blood_sugar: records.filter((r) => r.type === 'blood_sugar').slice(0, 3),
    weight: records.filter((r) => r.type === 'weight').slice(0, 3),
  };

  const getBloodPressureDisplay = (value: any) => {
    return `${value.systolic}/${value.diastolic}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F9FA' }}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 hover:bg-gray-50 rounded-full"
            >
              <Icon name="arrowLeft" size={20} color="#374151" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                건강 기록
              </h1>
              <p className="text-sm md:text-base text-gray-500 mt-1">
                내 건강 상태 관리
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <button
            onClick={() => router.push('/health/blood-pressure')}
            className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <Icon name="heart" size={28} color="#EF4444" />
            </div>
            <span className="text-sm md:text-base font-bold text-gray-900 text-center">
              혈압
            </span>
          </button>

          <button
            onClick={() => router.push('/health/blood-sugar')}
            className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Icon name="droplet" size={28} color="#3B82F6" />
            </div>
            <span className="text-sm md:text-base font-bold text-gray-900 text-center">
              혈당
            </span>
          </button>

          <button
            onClick={() => router.push('/health/weight')}
            className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <Icon name="activity" size={28} color="#10B981" />
            </div>
            <span className="text-sm md:text-base font-bold text-gray-900 text-center">
              체중
            </span>
          </button>
        </div>

        {/* Blood Pressure */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              혈압
            </h2>
            <button
              onClick={() => router.push('/health/blood-pressure')}
              className="text-sm md:text-base font-semibold text-blue-600 hover:text-blue-700"
            >
              전체보기
            </button>
          </div>

          {recordsByType.blood_pressure.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                <Icon name="heart" size={32} color="#EF4444" />
              </div>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                혈압 기록이 없습니다
              </p>
              <button
                onClick={() => router.push('/health/blood-pressure')}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                혈압 측정하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recordsByType.blood_pressure.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="heart" size={24} color="#EF4444" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {getBloodPressureDisplay(record.value)} <span className="text-lg md:text-xl text-gray-500">{record.unit}</span>
                      </p>
                      <p className="text-sm md:text-base text-gray-500 mt-1">
                        {formatDate(record.recorded_at)} {formatTime(record.recorded_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Blood Sugar */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              혈당
            </h2>
            <button
              onClick={() => router.push('/health/blood-sugar')}
              className="text-sm md:text-base font-semibold text-blue-600 hover:text-blue-700"
            >
              전체보기
            </button>
          </div>

          {recordsByType.blood_sugar.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Icon name="droplet" size={32} color="#3B82F6" />
              </div>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                혈당 기록이 없습니다
              </p>
              <button
                onClick={() => router.push('/health/blood-sugar')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                혈당 측정하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recordsByType.blood_sugar.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="droplet" size={24} color="#3B82F6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {record.value as number} <span className="text-lg md:text-xl text-gray-500">{record.unit}</span>
                      </p>
                      <p className="text-sm md:text-base text-gray-500 mt-1">
                        {formatDate(record.recorded_at)} {formatTime(record.recorded_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Weight */}
        <section className="pb-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              체중
            </h2>
            <button
              onClick={() => router.push('/health/weight')}
              className="text-sm md:text-base font-semibold text-blue-600 hover:text-blue-700"
            >
              전체보기
            </button>
          </div>

          {recordsByType.weight.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                <Icon name="activity" size={32} color="#10B981" />
              </div>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                체중 기록이 없습니다
              </p>
              <button
                onClick={() => router.push('/health/weight')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                체중 기록하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recordsByType.weight.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="activity" size={24} color="#10B981" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {record.value as number} <span className="text-lg md:text-xl text-gray-500">{record.unit}</span>
                      </p>
                      <p className="text-sm md:text-base text-gray-500 mt-1">
                        {formatDate(record.recorded_at)} {formatTime(record.recorded_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
