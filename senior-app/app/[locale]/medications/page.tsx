'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 hover:bg-gray-50 rounded-full"
              >
                <Icon name="arrowLeft" size={20} color="#374151" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  복약 관리
                </h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  내 약 복용 기록 관리
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/medications/new')}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700 rounded-full"
            >
              <Icon name="plus" size={20} color="white" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Today's Medications */}
        {pendingLogs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                오늘 복용할 약 <span className="text-pink-600">{pendingLogs.length}</span>
              </h2>
            </div>

            <div className="space-y-3">
              {pendingLogs.map((log: any) => (
                <div key={log.id} className="bg-white rounded-2xl p-6 border-l-4 border-pink-500 shadow-sm">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="pill" size={24} color="#EC4899" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        {log.medications?.name || '알 수 없음'}
                      </h3>
                      <p className="text-base text-gray-600 mb-2">
                        {log.medications?.dosage} {log.medications?.unit}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Icon name="clock" size={16} color="#6B7280" />
                        <span>{formatTime(log.scheduled_time)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleMarkAsSkipped(log.id)}
                      className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                      건너뛰기
                    </button>
                    <button
                      onClick={() => handleMarkAsTaken(log.id)}
                      className="bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
                    >
                      복용 완료
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Medications */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              내 약 목록
            </h2>
          </div>

          {medications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Icon name="pill" size={40} color="white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                등록된 약이 없습니다
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-6">
                복용하시는 약을 등록하고<br />
                체계적으로 관리해보세요
              </p>
              <button
                onClick={() => router.push('/medications/new')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                <Icon name="plus" size={20} color="white" />
                약 등록하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  onClick={() => router.push(`/medications/${medication.id}`)}
                  className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="pill" size={24} color="#3B82F6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        {medication.name}
                      </h3>
                      <p className="text-base text-gray-600 mb-2">
                        {medication.dosage} {medication.unit} · {medication.frequency}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {medication.current_stock !== null && (
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              medication.current_stock <= 5
                                ? 'bg-red-50 text-red-600'
                                : 'bg-green-50 text-green-600'
                            }`}
                          >
                            재고: {medication.current_stock}개
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {medication.times.join(', ')}
                        </span>
                      </div>
                    </div>
                    <Icon name="chevronRight" size={20} color="#9CA3AF" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Today */}
        {completedLogs.length > 0 && (
          <section className="pb-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                오늘 복용 완료
              </h2>
            </div>

            <div className="space-y-3">
              {completedLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100"
                >
                  <div className="flex gap-4 items-center opacity-60">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        log.status === 'taken' ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        name={log.status === 'taken' ? 'check' : 'x'}
                        size={20}
                        color={log.status === 'taken' ? '#10B981' : '#6B7280'}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">
                        {log.medications?.name || '알 수 없음'}
                      </h3>
                      <p className="text-sm md:text-base text-gray-500">
                        {log.status === 'taken' ? '복용 완료' : '건너뜀'} · {formatTime(log.scheduled_time)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
