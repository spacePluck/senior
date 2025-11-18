'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import SeniorButton from '@/components/ui/SeniorButton';
import SeniorCard from '@/components/ui/SeniorCard';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import type { WeeklyHealthReport } from '@/lib/services/ai.service';

export default function WeeklyReportPage() {
  const t = useTranslations();
  const router = useRouter();
  const { generateWeeklyReport, loading } = useAIAssistant();
  const [report, setReport] = useState<WeeklyHealthReport | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);

    try {
      const newReport = await generateWeeklyReport();
      setReport(newReport);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('리포트 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setGenerating(false);
    }
  };

  // 컴포넌트 마운트 시 자동으로 리포트 생성
  useEffect(() => {
    handleGenerateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (generating || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2
            className="text-xl md:text-2xl font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            주간 건강 리포트 생성 중...
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            AI가 건강 데이터를 분석하고 있습니다
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center px-4">
          <div
            className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 flex items-center justify-center"
            style={{
              background: '#F3F4F6',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <Icon name="fileText" size={40} color="var(--color-text-tertiary)" />
          </div>
          <h2
            className="text-xl md:text-2xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            리포트를 생성할 수 없습니다
          </h2>
          <p className="text-base md:text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            충분한 건강 데이터가 필요합니다
          </p>
          <SeniorButton onClick={() => router.back()}>
            돌아가기
          </SeniorButton>
        </div>
      </div>
    );
  }

  const adherenceRate = report.medicationAdherence.rate;
  const getAdherenceColor = () => {
    if (adherenceRate >= 90) return 'var(--color-success)';
    if (adherenceRate >= 70) return 'var(--color-warning)';
    return 'var(--color-error)';
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
            <div className="flex-1">
              <h1
                className="text-responsive-xl font-bold"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
              >
                주간 건강 리포트
              </h1>
              <p className="text-sm md:text-base" style={{ color: 'var(--color-text-tertiary)' }}>
                {report.period}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="responsive-container space-y-4 md:space-y-5">
        {/* Summary */}
        <SeniorCard>
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-pink) 100%)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Icon name="sparkles" size={28} color="white" />
            </div>
            <div className="flex-1">
              <h2
                className="text-lg md:text-xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                AI 종합 분석
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {report.summary}
              </p>
            </div>
          </div>
        </SeniorCard>

        {/* Medication Adherence */}
        <section className="space-y-3">
          <h2
            className="text-responsive-lg font-bold px-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            복약 순응도
          </h2>

          <SeniorCard>
            <div className="text-center mb-6">
              <div
                className="inline-flex items-baseline justify-center mb-2"
              >
                <span
                  className="text-5xl md:text-6xl font-bold"
                  style={{ color: getAdherenceColor() }}
                >
                  {adherenceRate.toFixed(0)}
                </span>
                <span
                  className="text-3xl md:text-4xl font-bold ml-1"
                  style={{ color: getAdherenceColor() }}
                >
                  %
                </span>
              </div>
              <p className="text-base md:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                {adherenceRate >= 90
                  ? '완벽해요! 👍'
                  : adherenceRate >= 70
                  ? '잘하고 계세요! 💪'
                  : '조금 더 노력해봐요 🙏'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center spacing-responsive" style={{ background: '#E8F9F3', borderRadius: 'var(--radius-md)' }}>
                <p className="text-sm md:text-base mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  복용 완료
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
                  {report.medicationAdherence.takenDoses}
                </p>
              </div>
              <div className="text-center spacing-responsive" style={{ background: '#FEE2E2', borderRadius: 'var(--radius-md)' }}>
                <p className="text-sm md:text-base mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  건너뜀
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-error)' }}>
                  {report.medicationAdherence.missedDoses}
                </p>
              </div>
              <div className="text-center spacing-responsive" style={{ background: '#E8F0FF', borderRadius: 'var(--radius-md)' }}>
                <p className="text-sm md:text-base mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  총 횟수
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {report.medicationAdherence.totalDoses}
                </p>
              </div>
            </div>
          </SeniorCard>
        </section>

        {/* Health Metrics */}
        {Object.keys(report.healthMetrics).length > 0 && (
          <section className="space-y-3">
            <h2
              className="text-responsive-lg font-bold px-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              건강 지표
            </h2>

            {report.healthMetrics.bloodPressure && (
              <SeniorCard>
                <div className="flex items-center justify-between">
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
                      <h3
                        className="text-base md:text-lg font-bold mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        평균 혈압
                      </h3>
                      <p
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {report.healthMetrics.bloodPressure.average} <span className="text-base">mmHg</span>
                      </p>
                      <p className="text-sm md:text-base" style={{ color: 'var(--color-text-tertiary)' }}>
                        {report.healthMetrics.bloodPressure.count}회 측정
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-3 p-3 rounded-lg"
                  style={{
                    background: report.healthMetrics.bloodPressure.status.includes('정상')
                      ? '#E8F9F3'
                      : '#FFF4E8',
                  }}
                >
                  <p
                    className="text-sm md:text-base font-medium"
                    style={{
                      color: report.healthMetrics.bloodPressure.status.includes('정상')
                        ? 'var(--color-success)'
                        : 'var(--color-warning)',
                    }}
                  >
                    {report.healthMetrics.bloodPressure.status}
                  </p>
                </div>
              </SeniorCard>
            )}

            {report.healthMetrics.bloodSugar && (
              <SeniorCard>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: '#E8F0FF',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Icon name="droplet" size={24} color="var(--color-primary)" />
                    </div>
                    <div>
                      <h3
                        className="text-base md:text-lg font-bold mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        평균 혈당
                      </h3>
                      <p
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {report.healthMetrics.bloodSugar.average} <span className="text-base">mg/dL</span>
                      </p>
                      <p className="text-sm md:text-base" style={{ color: 'var(--color-text-tertiary)' }}>
                        {report.healthMetrics.bloodSugar.count}회 측정
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-3 p-3 rounded-lg"
                  style={{
                    background: report.healthMetrics.bloodSugar.status.includes('정상')
                      ? '#E8F9F3'
                      : '#FFF4E8',
                  }}
                >
                  <p
                    className="text-sm md:text-base font-medium"
                    style={{
                      color: report.healthMetrics.bloodSugar.status.includes('정상')
                        ? 'var(--color-success)'
                        : 'var(--color-warning)',
                    }}
                  >
                    {report.healthMetrics.bloodSugar.status}
                  </p>
                </div>
              </SeniorCard>
            )}

            {report.healthMetrics.weight && (
              <SeniorCard>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: '#E8F9F3',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Icon name="activity" size={24} color="var(--color-success)" />
                    </div>
                    <div>
                      <h3
                        className="text-base md:text-lg font-bold mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        체중 변화
                      </h3>
                      <p
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {report.healthMetrics.weight.current} <span className="text-base">kg</span>
                      </p>
                      <p
                        className="text-sm md:text-base"
                        style={{
                          color:
                            report.healthMetrics.weight.change > 0
                              ? 'var(--color-error)'
                              : report.healthMetrics.weight.change < 0
                              ? 'var(--color-success)'
                              : 'var(--color-text-tertiary)',
                        }}
                      >
                        {report.healthMetrics.weight.change > 0 ? '+' : ''}
                        {report.healthMetrics.weight.change} kg
                      </p>
                    </div>
                  </div>
                </div>
              </SeniorCard>
            )}
          </section>
        )}

        {/* Recommendations */}
        <section className="space-y-3 pb-4">
          <h2
            className="text-responsive-lg font-bold px-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            AI 건강 조언
          </h2>

          <SeniorCard>
            <div className="space-y-4">
              {report.recommendations.map((recommendation, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      background: 'var(--color-primary)',
                      borderRadius: '50%',
                    }}
                  >
                    <Icon name="check" size={14} color="white" />
                  </div>
                  <p
                    className="flex-1 text-base md:text-lg leading-relaxed"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </SeniorCard>
        </section>
      </main>
    </div>
  );
}
