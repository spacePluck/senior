'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import SeniorButton from '@/components/ui/SeniorButton';
import SeniorInput from '@/components/ui/SeniorInput';
import SeniorSelect from '@/components/ui/SeniorSelect';
import SeniorCard from '@/components/ui/SeniorCard';
import { useMedications } from '@/hooks/useMedications';
import { useUserStore } from '@/store/useUserStore';

export default function NewMedicationPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUserStore();
  const { createMedication, loading } = useMedications();

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: 'daily',
    times: ['09:00'],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    initial_stock: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddTime = () => {
    setFormData({ ...formData, times: [...formData.times, '12:00'] });
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({ ...formData, times: newTimes });
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '약 이름을 입력해주세요';
    }

    if (!formData.dosage || parseFloat(formData.dosage) <= 0) {
      newErrors.dosage = '올바른 용량을 입력해주세요';
    }

    if (formData.times.length === 0) {
      newErrors.times = '복용 시간을 1개 이상 추가해주세요';
    }

    if (!formData.start_date) {
      newErrors.start_date = '복용 시작일을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createMedication({
        name: formData.name.trim(),
        dosage: parseFloat(formData.dosage),
        unit: formData.unit,
        frequency: formData.frequency,
        times: formData.times,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        initial_stock: formData.initial_stock ? parseInt(formData.initial_stock) : null,
        current_stock: formData.initial_stock ? parseInt(formData.initial_stock) : null,
        notes: formData.notes || null,
      });

      alert('약 등록이 완료되었습니다!');
      router.push('/medications');
    } catch (error) {
      console.error('Error creating medication:', error);
      alert('약 등록에 실패했습니다. 다시 시도해주세요.');
    }
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
              약 등록하기
            </h1>
          </div>
        </div>
      </header>

      <main className="responsive-container">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Basic Info */}
          <SeniorCard>
            <h2
              className="text-lg md:text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              기본 정보
            </h2>

            <div className="space-y-4">
              <SeniorInput
                label="약 이름"
                placeholder="예: 혈압약, 당뇨약"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                icon={<Icon name="pill" size={20} color="var(--color-primary)" />}
              />

              <div className="grid grid-cols-2 gap-3">
                <SeniorInput
                  label="용량"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  error={errors.dosage}
                />

                <SeniorSelect
                  label="단위"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  options={[
                    { value: 'mg', label: 'mg (밀리그램)' },
                    { value: 'g', label: 'g (그램)' },
                    { value: 'ml', label: 'ml (밀리리터)' },
                    { value: '정', label: '정' },
                    { value: '캡슐', label: '캡슐' },
                  ]}
                />
              </div>

              <SeniorSelect
                label="복용 빈도"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                options={[
                  { value: 'daily', label: '매일' },
                  { value: 'twice_daily', label: '하루 2회' },
                  { value: 'three_times_daily', label: '하루 3회' },
                  { value: 'weekly', label: '주 1회' },
                  { value: 'as_needed', label: '필요시' },
                ]}
              />
            </div>
          </SeniorCard>

          {/* Times */}
          <SeniorCard>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg md:text-xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                복용 시간
              </h2>
              <SeniorButton
                type="button"
                variant="secondary"
                size="small"
                onClick={handleAddTime}
                icon={<Icon name="plus" size={16} color="var(--color-primary)" />}
              >
                추가
              </SeniorButton>
            </div>

            <div className="space-y-3">
              {formData.times.map((time, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="flex-1 bg-white px-4 md:px-5 py-4 md:py-5 text-base md:text-lg font-medium touch-area transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 border-2 rounded-xl"
                    style={{
                      color: 'var(--color-text-primary)',
                      borderColor: 'rgba(102, 126, 234, 0.15)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                  {formData.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(index)}
                      className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl transition-all active:scale-95"
                      style={{ background: '#FEE2E2' }}
                    >
                      <Icon name="trash" size={20} color="var(--color-error)" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.times && (
              <p className="mt-2 text-sm md:text-base font-medium" style={{ color: 'var(--color-error)' }}>
                {errors.times}
              </p>
            )}
          </SeniorCard>

          {/* Dates */}
          <SeniorCard>
            <h2
              className="text-lg md:text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              복용 기간
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-base md:text-lg font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  복용 시작일
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full bg-white px-4 md:px-5 py-4 md:py-5 text-base md:text-lg font-medium touch-area transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 border-2 rounded-xl"
                  style={{
                    color: 'var(--color-text-primary)',
                    borderColor: errors.start_date ? 'var(--color-error)' : 'rgba(102, 126, 234, 0.15)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                />
                {errors.start_date && (
                  <p className="mt-2 text-sm md:text-base font-medium" style={{ color: 'var(--color-error)' }}>
                    {errors.start_date}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-base md:text-lg font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  복용 종료일 (선택사항)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full bg-white px-4 md:px-5 py-4 md:py-5 text-base md:text-lg font-medium touch-area transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 border-2 rounded-xl"
                  style={{
                    color: 'var(--color-text-primary)',
                    borderColor: 'rgba(102, 126, 234, 0.15)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                  min={formData.start_date}
                />
              </div>
            </div>
          </SeniorCard>

          {/* Stock */}
          <SeniorCard>
            <h2
              className="text-lg md:text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              재고 관리
            </h2>

            <SeniorInput
              label="현재 재고 (선택사항)"
              type="number"
              placeholder="0"
              value={formData.initial_stock}
              onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
              unit="개"
            />
          </SeniorCard>

          {/* Notes */}
          <SeniorCard>
            <h2
              className="text-lg md:text-xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              메모 (선택사항)
            </h2>

            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="복용 시 주의사항, 부작용 등을 기록하세요"
              rows={4}
              className="w-full bg-white px-4 md:px-5 py-4 md:py-5 text-base md:text-lg font-medium touch-area transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 border-2 rounded-xl"
              style={{
                color: 'var(--color-text-primary)',
                borderColor: 'rgba(102, 126, 234, 0.15)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            />
          </SeniorCard>

          {/* Submit */}
          <div className="pt-4 pb-8">
            <SeniorButton
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? '등록 중...' : '약 등록하기'}
            </SeniorButton>
          </div>
        </form>
      </main>
    </div>
  );
}
