'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import SeniorButton from '@/components/ui/SeniorButton';
import SeniorCard from '@/components/ui/SeniorCard';
import { useMedications } from '@/hooks/useMedications';
import { useMedicationLogs } from '@/hooks/useMedicationLogs';
import { formatTime } from '@/lib/utils';

export default function MedicationsPage() {
  const t = useTranslations();
  const router = useRouter();
  const { medications, loading: medsLoading } = useMedications();
  const { todayLogs, loading: logsLoading, markLogAsTaken, markLogAsSkipped } = useMedicationLogs();

  const loading = medsLoading || logsLoading;

  const pendingLogs = todayLogs.filter((log) => log.status === 'pending');
  const completedLogs = todayLogs.filter((log) => log.status !== 'pending');

  const handleMarkAsTaken = async (logId: string) => {
    try {
      await markLogAsTaken(logId);
      alert('복용 완료 처리되었습니다!');
    } catch (error) {
      console.error('Error marking as taken:', error);
      alert('처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleMarkAsSkipped = async (logId: string) => {
    try {
      await markLogAsSkipped(logId);
    } catch (error) {
      console.error('Error marking as skipped:', error);
      alert('처리에 실패했습니다. 다시 시도해주세요.');
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
                복약 관리
              </h1>
            </div>
            <button
              onClick={() => router.push('/medications/new')}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 touch-area"
              style={{
                background: 'var(--color-primary)',
                borderRadius: '50%',
              }}
            >
              <Icon name="plus" size={20} color="white" />
            </button>
          </div>
        </div>
      </header>

      <main className="responsive-container space-y-4 md:space-y-6">
        {/* Today's Medications */}
        {pendingLogs.length > 0 && (
          <section className="space-y-3">
            <h2
              className="text-responsive-lg font-bold px-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              오늘 복용할 약 <span style={{ color: 'var(--color-accent-pink)' }}>{pendingLogs.length}</span>
            </h2>

            {pendingLogs.map((log: any) => (
              <SeniorCard key={log.id}>
                <div className="flex gap-3 md:gap-4 mb-4">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: '#FFE8EF',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <Icon name="pill" size={24} color="var(--color-accent-pink)" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base md:text-lg font-bold mb-1"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {log.medications?.name || '알 수 없음'}
                    </h3>
                    <p
                      className="text-sm md:text-base mb-1"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {log.medications?.dosage} {log.medications?.unit}
                    </p>
                    <p
                      className="text-sm md:text-base flex items-center gap-1"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      <Icon name="clock" size={14} color="var(--color-text-tertiary)" />
                      {formatTime(log.scheduled_time)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SeniorButton
                    variant="secondary"
                    size="medium"
                    onClick={() => handleMarkAsSkipped(log.id)}
                  >
                    건너뛰기
                  </SeniorButton>
                  <SeniorButton
                    variant="success"
                    size="medium"
                    onClick={() => handleMarkAsTaken(log.id)}
                  >
                    복용 완료
                  </SeniorButton>
                </div>
              </SeniorCard>
            ))}
          </section>
        )}

        {/* All Medications */}
        <section className="space-y-3">
          <h2
            className="text-responsive-lg font-bold px-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            내 약 목록
          </h2>

          {medications.length === 0 ? (
            <SeniorCard>
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: '#F3F4F6',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <Icon name="pill" size={32} color="var(--color-text-tertiary)" />
                </div>
                <p
                  className="text-base md:text-lg mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  등록된 약이 없습니다
                </p>
                <SeniorButton onClick={() => router.push('/medications/new')}>
                  약 등록하기
                </SeniorButton>
              </div>
            </SeniorCard>
          ) : (
            medications.map((medication) => (
              <SeniorCard
                key={medication.id}
                className="cursor-pointer active:scale-98 transition-transform"
                onClick={() => router.push(`/medications/${medication.id}`)}
              >
                <div className="flex gap-3 md:gap-4">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: '#E8F0FF',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <Icon name="pill" size={24} color="var(--color-primary)" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base md:text-lg font-bold mb-1"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {medication.name}
                    </h3>
                    <p
                      className="text-sm md:text-base mb-1"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {medication.dosage} {medication.unit} · {medication.frequency}
                    </p>
                    <div className="flex items-center gap-2 text-xs md:text-sm">
                      {medication.current_stock !== null && (
                        <span
                          className="px-2 py-1 rounded-md"
                          style={{
                            background: medication.current_stock <= 5 ? '#FEE2E2' : '#E8F9F3',
                            color: medication.current_stock <= 5 ? 'var(--color-error)' : 'var(--color-success)',
                          }}
                        >
                          재고: {medication.current_stock}개
                        </span>
                      )}
                      <span style={{ color: 'var(--color-text-tertiary)' }}>
                        {medication.times.join(', ')}
                      </span>
                    </div>
                  </div>
                  <Icon name="chevronRight" size={20} color="var(--color-text-tertiary)" />
                </div>
              </SeniorCard>
            ))
          )}
        </section>

        {/* Completed Today */}
        {completedLogs.length > 0 && (
          <section className="space-y-3 pb-4">
            <h2
              className="text-responsive-lg font-bold px-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              오늘 복용 완료
            </h2>

            {completedLogs.map((log: any) => (
              <SeniorCard key={log.id} variant="outlined">
                <div className="flex gap-3 md:gap-4 items-center opacity-60">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: log.status === 'taken' ? '#E8F9F3' : '#F3F4F6',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <Icon
                      name={log.status === 'taken' ? 'check' : 'x'}
                      size={20}
                      color={log.status === 'taken' ? 'var(--color-success)' : 'var(--color-text-tertiary)'}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base md:text-lg font-bold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {log.medications?.name || '알 수 없음'}
                    </h3>
                    <p
                      className="text-sm md:text-base"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      {log.status === 'taken' ? '복용 완료' : '건너뜀'} · {formatTime(log.scheduled_time)}
                    </p>
                  </div>
                </div>
              </SeniorCard>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
