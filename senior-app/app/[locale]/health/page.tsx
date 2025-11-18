'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import SeniorButton from '@/components/ui/SeniorButton';
import SeniorCard from '@/components/ui/SeniorCard';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            로딩 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="spacing-responsive" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="responsive-container">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 touch-area"
              style={{
                background: 'var(--color-bg)',
                borderRadius: '50%',
              }}
            >
              <Icon name="arrowLeft" size={20} color="var(--color-text-primary)" />
            </button>
            <h1
              className="text-responsive-xl font-bold"
              style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
            >
              건강 기록
            </h1>
          </div>
        </div>
      </header>

      <main className="responsive-container space-y-4 md:space-y-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/health/blood-pressure')}
            className="spacing-responsive flex flex-col items-center gap-2 transition-all active:scale-95"
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
              style={{
                background: '#FFE8EF',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Icon name="heart" size={24} color="var(--color-accent-pink)" />
            </div>
            <span
              className="text-sm md:text-base font-bold text-center"
              style={{ color: 'var(--color-text-primary)' }}
            >
              혈압
            </span>
          </button>

          <button
            onClick={() => router.push('/health/blood-sugar')}
            className="spacing-responsive flex flex-col items-center gap-2 transition-all active:scale-95"
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
              style={{
                background: '#E8F0FF',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Icon name="droplet" size={24} color="var(--color-primary)" />
            </div>
            <span
              className="text-sm md:text-base font-bold text-center"
              style={{ color: 'var(--color-text-primary)' }}
            >
              혈당
            </span>
          </button>

          <button
            onClick={() => router.push('/health/weight')}
            className="spacing-responsive flex flex-col items-center gap-2 transition-all active:scale-95"
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
              style={{
                background: '#E8F9F3',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Icon name="activity" size={24} color="var(--color-success)" />
            </div>
            <span
              className="text-sm md:text-base font-bold text-center"
              style={{ color: 'var(--color-text-primary)' }}
            >
              체중
            </span>
          </button>
        </div>

        {/* Blood Pressure */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-responsive-lg font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              혈압
            </h2>
            <button
              onClick={() => router.push('/health/blood-pressure')}
              className="text-sm md:text-base font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              전체보기
            </button>
          </div>

          {recordsByType.blood_pressure.length === 0 ? (
            <SeniorCard>
              <div className="text-center py-6">
                <p
                  className="text-base md:text-lg mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  혈압 기록이 없습니다
                </p>
                <SeniorButton
                  size="medium"
                  onClick={() => router.push('/health/blood-pressure')}
                >
                  혈압 측정하기
                </SeniorButton>
              </div>
            </SeniorCard>
          ) : (
            recordsByType.blood_pressure.map((record) => (
              <SeniorCard key={record.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: '#FFE8EF',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Icon name="heart" size={20} color="var(--color-accent-pink)" />
                    </div>
                    <div>
                      <p
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {getBloodPressureDisplay(record.value)} <span className="text-base md:text-lg">{record.unit}</span>
                      </p>
                      <p
                        className="text-sm md:text-base"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {formatDate(record.recorded_at)} {formatTime(record.recorded_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </SeniorCard>
            ))
          )}
        </section>

        {/* Blood Sugar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-responsive-lg font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              혈당
            </h2>
            <button
              onClick={() => router.push('/health/blood-sugar')}
              className="text-sm md:text-base font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              전체보기
            </button>
          </div>

          {recordsByType.blood_sugar.length === 0 ? (
            <SeniorCard>
              <div className="text-center py-6">
                <p
                  className="text-base md:text-lg mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  혈당 기록이 없습니다
                </p>
                <SeniorButton
                  size="medium"
                  onClick={() => router.push('/health/blood-sugar')}
                >
                  혈당 측정하기
                </SeniorButton>
              </div>
            </SeniorCard>
          ) : (
            recordsByType.blood_sugar.map((record) => (
              <SeniorCard key={record.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: '#E8F0FF',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Icon name="droplet" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {record.value as number} <span className="text-base md:text-lg">{record.unit}</span>
                      </p>
                      <p
                        className="text-sm md:text-base"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {formatDate(record.recorded_at)} {formatTime(record.recorded_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </SeniorCard>
            ))
          )}
        </section>

        {/* Weight */}
        <section className="space-y-3 pb-4">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-responsive-lg font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              체중
            </h2>
            <button
              onClick={() => router.push('/health/weight')}
              className="text-sm md:text-base font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              전체보기
            </button>
          </div>

          {recordsByType.weight.length === 0 ? (
            <SeniorCard>
              <div className="text-center py-6">
                <p
                  className="text-base md:text-lg mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  체중 기록이 없습니다
                </p>
                <SeniorButton
                  size="medium"
                  onClick={() => router.push('/health/weight')}
                >
                  체중 기록하기
                </SeniorButton>
              </div>
            </SeniorCard>
          ) : (
            recordsByType.weight.map((record) => (
              <SeniorCard key={record.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: '#E8F9F3',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Icon name="activity" size={20} color="var(--color-success)" />
                    </div>
                    <div>
                      <p
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {record.value as number} <span className="text-base md:text-lg">{record.unit}</span>
                      </p>
                      <p
                        className="text-sm md:text-base"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {formatDate(record.recorded_at)} {formatTime(record.recorded_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </SeniorCard>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
