'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import SeniorButton from '@/components/ui/SeniorButton';
import SeniorCard from '@/components/ui/SeniorCard';
import { MedicationService } from '@/lib/services/medication.service';
import { useMedications } from '@/hooks/useMedications';
import type { Database } from '@/types/database';

type Medication = Database['public']['Tables']['medications']['Row'];

export default function MedicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const t = useTranslations();
  const router = useRouter();
  const { deleteMedication } = useMedications();
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedication();
  }, [resolvedParams.id]);

  const loadMedication = async () => {
    try {
      const data = await MedicationService.getMedicationById(resolvedParams.id);
      setMedication(data);
    } catch (error) {
      console.error('Error loading medication:', error);
      alert('약 정보를 불러올 수 없습니다.');
      router.push('/medications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 약을 삭제하시겠습니까?')) return;

    try {
      await deleteMedication(resolvedParams.id);
      alert('약이 삭제되었습니다.');
      router.push('/medications');
    } catch (error) {
      console.error('Error deleting medication:', error);
      alert('약 삭제에 실패했습니다.');
    }
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

  if (!medication) {
    return null;
  }

  const lowStock = medication.current_stock !== null && medication.current_stock <= 5;

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="spacing-responsive" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="responsive-container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
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
                약 상세정보
              </h1>
            </div>
            <button
              onClick={() => router.push(`/medications/${resolvedParams.id}/edit`)}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 touch-area"
              style={{
                background: 'var(--color-primary)',
                borderRadius: '50%',
              }}
            >
              <Icon name="edit" size={20} color="white" />
            </button>
          </div>
        </div>
      </header>

      <main className="responsive-container space-y-4 md:space-y-5">
        {/* Main Info */}
        <SeniorCard>
          <div className="flex gap-4 mb-5">
            <div
              className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center flex-shrink-0"
              style={{
                background: '#E8F0FF',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Icon name="pill" size={32} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <h2
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {medication.name}
              </h2>
              <p
                className="text-base md:text-lg mb-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {medication.dosage} {medication.unit}
              </p>
              <p
                className="text-sm md:text-base"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {medication.frequency}
              </p>
            </div>
          </div>

          {lowStock && (
            <div
              className="p-4 rounded-xl mb-4"
              style={{
                background: '#FEE2E2',
                border: '2px solid var(--color-error)',
              }}
            >
              <div className="flex items-center gap-2">
                <Icon name="alertTriangle" size={20} color="var(--color-error)" />
                <span
                  className="text-base md:text-lg font-bold"
                  style={{ color: 'var(--color-error)' }}
                >
                  재고가 부족합니다! ({medication.current_stock}개 남음)
                </span>
              </div>
            </div>
          )}
        </SeniorCard>

        {/* Schedule */}
        <SeniorCard>
          <h3
            className="text-lg md:text-xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            복용 시간
          </h3>

          <div className="space-y-2">
            {medication.times.map((time, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 md:p-4 rounded-lg"
                style={{ background: 'var(--color-bg)' }}
              >
                <Icon name="clock" size={20} color="var(--color-primary)" />
                <span
                  className="text-base md:text-lg font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {time}
                </span>
              </div>
            ))}
          </div>
        </SeniorCard>

        {/* Period */}
        <SeniorCard>
          <h3
            className="text-lg md:text-xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            복용 기간
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span
                className="text-base md:text-lg"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                시작일
              </span>
              <span
                className="text-base md:text-lg font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {new Date(medication.start_date).toLocaleDateString('ko-KR')}
              </span>
            </div>

            {medication.end_date && (
              <div className="flex items-center justify-between">
                <span
                  className="text-base md:text-lg"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  종료일
                </span>
                <span
                  className="text-base md:text-lg font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {new Date(medication.end_date).toLocaleDateString('ko-KR')}
                </span>
              </div>
            )}
          </div>
        </SeniorCard>

        {/* Stock */}
        {medication.current_stock !== null && (
          <SeniorCard>
            <h3
              className="text-lg md:text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              재고 관리
            </h3>

            <div className="flex items-center justify-between">
              <span
                className="text-base md:text-lg"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                현재 재고
              </span>
              <span
                className="text-2xl md:text-3xl font-bold"
                style={{
                  color: lowStock ? 'var(--color-error)' : 'var(--color-success)',
                }}
              >
                {medication.current_stock}개
              </span>
            </div>

            {medication.initial_stock && (
              <div className="mt-3 pt-3 border-t-2" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm md:text-base"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    초기 재고
                  </span>
                  <span
                    className="text-sm md:text-base font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {medication.initial_stock}개
                  </span>
                </div>
              </div>
            )}
          </SeniorCard>
        )}

        {/* Notes */}
        {medication.notes && (
          <SeniorCard>
            <h3
              className="text-lg md:text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              메모
            </h3>

            <p
              className="text-base md:text-lg leading-relaxed whitespace-pre-wrap"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {medication.notes}
            </p>
          </SeniorCard>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 pb-8">
          <SeniorButton
            variant="secondary"
            size="large"
            onClick={() => router.push(`/medications/${resolvedParams.id}/edit`)}
            icon={<Icon name="edit" size={20} color="var(--color-primary)" />}
          >
            수정
          </SeniorButton>
          <SeniorButton
            variant="danger"
            size="large"
            onClick={handleDelete}
            icon={<Icon name="trash" size={20} color="white" />}
          >
            삭제
          </SeniorButton>
        </div>
      </main>
    </div>
  );
}
