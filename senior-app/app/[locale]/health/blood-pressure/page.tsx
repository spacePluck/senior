'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import SeniorButton from '@/components/ui/SeniorButton';
import SeniorInput from '@/components/ui/SeniorInput';
import SeniorCard from '@/components/ui/SeniorCard';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { HealthService } from '@/lib/services/health.service';
import { formatDate, formatTime } from '@/lib/utils';

export default function BloodPressurePage() {
  const t = useTranslations();
  const router = useRouter();
  const { records, loading, createBloodPressure } = useHealthRecords('blood_pressure');

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ systolic?: string; diastolic?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { systolic?: string; diastolic?: string } = {};

    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);

    if (!systolic || systolicNum <= 0 || systolicNum > 300) {
      newErrors.systolic = '올바른 수축기 혈압을 입력해주세요 (1-300)';
    }

    if (!diastolic || diastolicNum <= 0 || diastolicNum > 200) {
      newErrors.diastolic = '올바른 이완기 혈압을 입력해주세요 (1-200)';
    }

    if (systolicNum && diastolicNum && systolicNum <= diastolicNum) {
      newErrors.systolic = '수축기 혈압은 이완기 혈압보다 높아야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await createBloodPressure(parseInt(systolic), parseInt(diastolic), notes || undefined);

      const status = HealthService.isBloodPressureNormal(parseInt(systolic), parseInt(diastolic));
      alert(`혈압이 기록되었습니다.\n\n${status.message}`);

      setSystolic('');
      setDiastolic('');
      setNotes('');
    } catch (error) {
      console.error('Error creating blood pressure record:', error);
      alert('혈압 기록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const getBloodPressureDisplay = (value: any) => {
    return `${value.systolic}/${value.diastolic}`;
  };

  const getBloodPressureStatus = (value: any) => {
    return HealthService.isBloodPressureNormal(value.systolic, value.diastolic);
  };

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
              혈압 관리
            </h1>
          </div>
        </div>
      </header>

      <main className="responsive-container space-y-4 md:space-y-5">
        {/* Input Form */}
        <SeniorCard>
          <h2
            className="text-lg md:text-xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            혈압 측정하기
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SeniorInput
                label="수축기"
                type="number"
                placeholder="120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                error={errors.systolic}
                unit="mmHg"
              />

              <SeniorInput
                label="이완기"
                type="number"
                placeholder="80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                error={errors.diastolic}
                unit="mmHg"
              />
            </div>

            <div>
              <label
                className="block text-base md:text-lg font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                메모 (선택사항)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="측정 시 특이사항을 기록하세요"
                rows={3}
                className="w-full bg-white px-4 md:px-5 py-4 md:py-5 text-base md:text-lg font-medium touch-area transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 border-2 rounded-xl"
                style={{
                  color: 'var(--color-text-primary)',
                  borderColor: 'rgba(102, 126, 234, 0.15)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              />
            </div>

            <SeniorButton
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={submitting}
            >
              {submitting ? '기록 중...' : '기록하기'}
            </SeniorButton>
          </form>
        </SeniorCard>

        {/* History */}
        <section className="space-y-3 pb-4">
          <h2
            className="text-responsive-lg font-bold px-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            기록 내역
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : records.length === 0 ? (
            <SeniorCard>
              <div className="text-center py-8">
                <p
                  className="text-base md:text-lg"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  아직 기록이 없습니다
                </p>
              </div>
            </SeniorCard>
          ) : (
            records.map((record) => {
              const status = getBloodPressureStatus(record.value);
              return (
                <SeniorCard key={record.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0"
                        style={{
                          background: '#FFE8EF',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <Icon name="heart" size={24} color="var(--color-accent-pink)" />
                      </div>
                      <div>
                        <p
                          className="text-2xl md:text-3xl font-bold"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {getBloodPressureDisplay(record.value)}
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

                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background:
                        status.status === 'normal'
                          ? '#E8F9F3'
                          : status.status === 'elevated'
                          ? '#FFF4E8'
                          : '#FEE2E2',
                    }}
                  >
                    <p
                      className="text-sm md:text-base font-medium"
                      style={{
                        color:
                          status.status === 'normal'
                            ? 'var(--color-success)'
                            : status.status === 'elevated'
                            ? 'var(--color-warning)'
                            : 'var(--color-error)',
                      }}
                    >
                      {status.message}
                    </p>
                  </div>

                  {record.notes && (
                    <p
                      className="mt-3 text-sm md:text-base"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {record.notes}
                    </p>
                  )}
                </SeniorCard>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
