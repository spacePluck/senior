# Phase 3 - EverEx AI 재활 시스템 연동
## 기능 상세 기획서

> **개발 우선순위**: ⭐⭐⭐ (최우선)
> **예상 소요 시간**: 10주
> **담당**: Frontend 2명 + Backend 2명 + AI 엔지니어 1명
> **파트너**: EverEx (에버엑스) - AI 디지털 재활 치료 전문 기업

---

## EverEx 소개

### 회사 개요
- **설립**: 2020년 (한국)
- **전문 분야**: AI 기반 디지털 재활 치료
- **핵심 기술**:
  - 컴퓨터 비전으로 동작 분석
  - AI가 재활 운동 코칭
  - 실시간 피드백 제공

### 제공 서비스
```typescript
const EVEREX_PROGRAMS = {
  strokeRehab: {
    name: '뇌졸중 재활',
    duration: '12주 프로그램',
    exercises: [
      '팔 들기 운동',
      '손가락 굽히기',
      '걷기 훈련',
      '균형 감각 훈련'
    ],
    aiCoaching: true,
    progressTracking: true
  },

  fallPrevention: {
    name: '낙상 예방 운동',
    duration: '8주 프로그램',
    exercises: [
      '하체 근력 강화',
      '균형 감각 향상',
      '보폭 조절 훈련',
      '반사 신경 훈련'
    ],
    aiCoaching: true,
    difficultyLevels: ['초급', '중급', '고급']
  },

  arthritisManagement: {
    name: '관절염 관리',
    duration: '지속적',
    exercises: [
      '관절 가동 범위 운동',
      '근력 강화',
      '유연성 향상',
      '통증 완화 스트레칭'
    ],
    aiCoaching: true,
    customizable: true
  },

  cognitiveTraining: {
    name: '인지 기능 훈련',
    duration: '12주 프로그램',
    activities: [
      '기억력 게임',
      '주의력 훈련',
      '문제 해결 과제',
      '언어 능력 향상'
    ],
    aiAdaptive: true
  }
};
```

---

## 서비스 신청 플로우

### 1. 프로그램 선택
```
┌─────────────────────────────────────┐
│  EverEx AI 재활 프로그램            │
│                                      │
│  AI가 함께하는 똑똑한 재활 운동!    │
│                                      │
│  ━━━ 프로그램 선택 ━━━             │
│                                      │
│  ┌────────────────────┐             │
│  │ 🧠 뇌졸중 재활     │             │
│  │                    │             │
│  │ 12주 프로그램      │             │
│  │ • 팔/다리 기능 회복│             │
│  │ • 보행 훈련        │             │
│  │ • AI 실시간 코칭   │             │
│  │                    │             │
│  │ 월 150,000원       │             │
│  │ [선택하기]         │             │
│  └────────────────────┘             │
│                                      │
│  ┌────────────────────┐             │
│  │ 🦴 낙상 예방 운동  │             │
│  │                    │             │
│  │ 8주 프로그램       │             │
│  │ • 하체 근력 강화   │             │
│  │ • 균형 감각 훈련   │             │
│  │ • 낙상 위험 평가   │             │
│  │                    │             │
│  │ 월 100,000원       │             │
│  │ [선택하기]         │             │
│  └────────────────────┘             │
│                                      │
│  ┌────────────────────┐             │
│  │ 🦵 관절염 관리     │             │
│  │                    │             │
│  │ 맞춤형 프로그램    │             │
│  │ • 관절 가동 운동   │             │
│  │ • 통증 완화        │             │
│  │ • 근력 유지        │             │
│  │                    │             │
│  │ 월 80,000원        │             │
│  │ [선택하기]         │             │
│  └────────────────────┘             │
└─────────────────────────────────────┘
```

### 2. 초기 평가
```
┌─────────────────────────────────────┐
│  낙상 예방 운동 - 초기 평가         │
│                                      │
│  AI가 현재 상태를 평가합니다        │
│                                      │
│  ━━━ 기본 정보 ━━━                 │
│                                      │
│  나이: 75세                          │
│  성별: 여성                          │
│                                      │
│  현재 건강 상태:                     │
│  ☑ 고혈압                           │
│  ☐ 당뇨                             │
│  ☑ 관절염 (무릎)                   │
│  ☐ 뇌졸중 병력                     │
│                                      │
│  과거 낙상 경험:                     │
│  ◉ 있음 (6개월 전)                 │
│  ○ 없음                             │
│                                      │
│  보조 기구 사용:                     │
│  ◉ 지팡이                           │
│  ○ 보행기                           │
│  ○ 휠체어                           │
│  ○ 없음                             │
│                                      │
│  ━━━ 기능 평가 ━━━                 │
│                                      │
│  1. 의자에서 일어서기               │
│  [동영상 촬영 시작]                 │
│                                      │
│  📱 스마트폰을 세워놓고              │
│  의자에서 일어나는 모습을           │
│  촬영해주세요                        │
│                                      │
│  [촬영 시작]                        │
└─────────────────────────────────────┘

↓ AI 분석 중

┌─────────────────────────────────────┐
│  🤖 AI 분석 중...                   │
│                                      │
│  [진행 바]                          │
│                                      │
│  • 자세 분석 중...                  │
│  • 균형 감각 평가 중...             │
│  • 근력 측정 중...                  │
│                                      │
│  잠시만 기다려주세요 (약 30초)      │
└─────────────────────────────────────┘

↓ 평가 결과

┌─────────────────────────────────────┐
│  ✅ 초기 평가 완료                  │
│                                      │
│  ━━━ AI 분석 결과 ━━━              │
│                                      │
│  종합 점수: 65/100                  │
│  등급: 🟡 주의 필요                 │
│                                      │
│  ━━━ 세부 평가 ━━━                 │
│                                      │
│  하체 근력: 60점                    │
│  🟡 약간 약함                       │
│  → 근력 강화 운동 필요              │
│                                      │
│  균형 감각: 55점                    │
│  🟠 주의 필요                       │
│  → 균형 훈련 집중 필요              │
│                                      │
│  보행 안정성: 70점                  │
│  🟢 양호                            │
│                                      │
│  반응 속도: 65점                    │
│  🟡 보통                            │
│                                      │
│  ━━━ AI 권장사항 ━━━               │
│                                      │
│  💡 권장 난이도: 초급               │
│  💡 주 운동 횟수: 주 3-4회          │
│  💡 1회 운동 시간: 20-30분          │
│                                      │
│  💡 집중 개선 영역:                 │
│  1. 균형 감각 향상                  │
│  2. 하체 근력 강화                  │
│  3. 보폭 안정화                     │
│                                      │
│  [맞춤 프로그램 시작하기]           │
└─────────────────────────────────────┘
```

### 3. 일일 운동 세션
```
┌─────────────────────────────────────┐
│  오늘의 운동 (3일차)                │
│                                      │
│  목표: 주 4회 운동                  │
│  이번 주: 2/4 완료 ✅✅⚪⚪        │
│                                      │
│  ━━━ 운동 메뉴 (총 25분) ━━━      │
│                                      │
│  1. ✅ 준비 운동 (5분) - 완료       │
│  2. 🔵 한 발로 서기 (8분) - 진행중 │
│  3. ⚪ 무릎 들어올리기 (8분)       │
│  4. ⚪ 마무리 스트레칭 (4분)       │
│                                      │
│  [운동 시작]                        │
└─────────────────────────────────────┘

↓ 운동 중

┌─────────────────────────────────────┐
│  🏃 한 발로 서기 (2/5)              │
│                                      │
│  [카메라 화면]                      │
│  👤 실시간 자세 분석                │
│                                      │
│  🟢 몸통: 올바름                    │
│  🟢 무릎: 좋아요                    │
│  🟡 발목: 조금 더 안정적으로!       │
│                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                      │
│  🤖 AI 코치:                        │
│  "좋아요! 발목에 조금 더            │
│   힘을 주세요. 시선은 정면을        │
│   바라보세요."                       │
│                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                      │
│  남은 시간: 15초                    │
│  [프로그레스 바]                    │
│                                      │
│  완료한 세트: 2/5                   │
└─────────────────────────────────────┘

↓ 운동 완료

┌─────────────────────────────────────┐
│  ✅ 오늘 운동 완료!                 │
│                                      │
│  총 운동 시간: 27분                 │
│  완료도: 100%                       │
│                                      │
│  ━━━ 오늘의 성과 ━━━               │
│                                      │
│  정확도: 88% 🟢                     │
│  개선: +5% (지난 번 대비)           │
│                                      │
│  균형 유지 시간: 평균 18초          │
│  목표: 20초 → 90% 달성              │
│                                      │
│  ━━━ AI 피드백 ━━━                 │
│                                      │
│  💪 잘하셨어요!                     │
│  오늘 균형 감각이 지난번보다        │
│  많이 좋아졌습니다.                  │
│                                      │
│  💡 개선 포인트:                    │
│  • 발목 안정성을 조금 더 높여보세요│
│  • 다음 번엔 시선 고정에            │
│    더 집중해주세요                   │
│                                      │
│  🎯 다음 운동: 내일 오후 2시 권장   │
│                                      │
│  [주간 리포트 보기]                 │
│  [운동 영상 다시보기]               │
└─────────────────────────────────────┘
```

### 4. 주간/월간 리포트
```
┌─────────────────────────────────────┐
│  📊 이번 주 진행 리포트             │
│  2025-02-17 ~ 02-23                 │
│                                      │
│  ━━━ 운동 기록 ━━━                 │
│                                      │
│  목표 달성: 4/4회 ✅                │
│  총 운동 시간: 110분                │
│                                      │
│  월  화  수  목  금  토  일         │
│  ✅  ✅  ⚪  ✅  ✅  ⚪  ⚪        │
│                                      │
│  ━━━ 기능 개선 추이 ━━━            │
│                                      │
│  [그래프]                           │
│                                      │
│  균형 감각: 55점 → 68점 (+13) 📈   │
│  하체 근력: 60점 → 70점 (+10) 📈   │
│  보행 안정성: 70점 → 75점 (+5) 📈  │
│                                      │
│  ━━━ AI 종합 평가 ━━━              │
│                                      │
│  🎉 축하합니다!                     │
│  이번 주 정말 열심히 하셨네요!      │
│                                      │
│  균형 감각이 눈에 띄게 좋아졌습니다.│
│  이 속도면 4주 후에는 '양호' 단계에 │
│  도달할 수 있을 것 같습니다.        │
│                                      │
│  💡 다음 주 목표:                   │
│  • 한 발 서기 20초 이상 유지하기   │
│  • 보폭 5cm 늘리기                  │
│                                      │
│  [전체 기간 리포트 보기]            │
│  [가족과 공유하기]                  │
└─────────────────────────────────────┘
```

---

## DB 스키마

```sql
-- EverEx 프로그램
CREATE TABLE everex_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'stroke_rehab', 'fall_prevention', 'arthritis', 'cognitive'
  duration_weeks INTEGER,
  description TEXT,
  monthly_price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EverEx 구독
CREATE TABLE everex_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  program_id UUID NOT NULL REFERENCES everex_programs(id),

  -- 초기 평가
  initial_assessment JSONB,
  -- {
  --   "overall_score": 65,
  --   "strength": 60,
  --   "balance": 55,
  --   "mobility": 70,
  --   "recommendations": {...}
  -- }

  -- 프로그램 설정
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  weekly_sessions INTEGER DEFAULT 4,
  session_duration_minutes INTEGER DEFAULT 30,

  -- 구독 정보
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  -- 'active', 'paused', 'completed', 'cancelled'

  -- 결제
  monthly_amount INTEGER NOT NULL,
  payment_method VARCHAR(50),
  auto_payment BOOLEAN DEFAULT true,

  -- EverEx 시스템 연동
  everex_user_id VARCHAR(100),
  everex_subscription_id VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 운동 세션
CREATE TABLE everex_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES everex_subscriptions(id),

  -- 세션 정보
  session_date DATE NOT NULL,
  exercises JSONB NOT NULL,
  -- [
  --   {"name": "한 발 서기", "sets": 5, "accuracy": 88, "duration": 120},
  --   ...
  -- ]

  -- 결과
  total_duration_minutes INTEGER,
  completion_percentage INTEGER,
  overall_accuracy INTEGER,

  -- AI 피드백
  ai_feedback TEXT,
  improvements TEXT[],
  next_goals TEXT[],

  -- 동영상 (선택적)
  video_urls TEXT[],

  -- 상태
  status VARCHAR(20) DEFAULT 'completed',
  -- 'scheduled', 'in_progress', 'completed', 'skipped'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 진행 상황 추적
CREATE TABLE everex_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES everex_subscriptions(id),

  -- 측정 일자
  measurement_date DATE NOT NULL,

  -- 기능 점수 (0-100)
  balance_score INTEGER,
  strength_score INTEGER,
  mobility_score INTEGER,
  flexibility_score INTEGER,
  cognitive_score INTEGER,

  -- 구체적 지표
  metrics JSONB,
  -- {
  --   "single_leg_stand_seconds": 18,
  --   "walking_speed_mps": 0.8,
  --   "stride_length_cm": 65,
  --   ...
  -- }

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## API 엔드포인트

### 프로그램 구독
```typescript
// POST /api/everex/subscribe
export async function POST(req: Request) {
  const {
    userId,
    programId,
    initialAssessment,
    paymentMethod
  } = await req.json();

  const program = await getProgram(programId);

  // 1. EverEx API로 사용자 등록
  const everexUser = await createEverExUser({
    name: await getUserName(userId),
    age: await getUserAge(userId),
    healthConditions: await getUserHealthConditions(userId)
  });

  // 2. EverEx 구독 생성
  const everexSub = await createEverExSubscription({
    everexUserId: everexUser.id,
    programId: program.everex_program_id,
    assessmentData: initialAssessment
  });

  // 3. 자체 DB에 기록
  const { data: subscription } = await supabase
    .from('everex_subscriptions')
    .insert({
      user_id: userId,
      program_id: programId,
      initial_assessment: initialAssessment,
      difficulty_level: initialAssessment.recommended_difficulty,
      start_date: new Date(),
      monthly_amount: program.monthly_price,
      payment_method: paymentMethod,
      auto_payment: true,
      everex_user_id: everexUser.id,
      everex_subscription_id: everexSub.id,
      status: 'active'
    })
    .select()
    .single();

  // 4. 첫 달 결제
  await processPayment({
    amount: program.monthly_price,
    method: paymentMethod,
    userId,
    description: `EverEx ${program.name} 첫 달`
  });

  // 5. 알림
  await sendNotification({
    userId,
    title: '✅ AI 재활 프로그램 시작!',
    body: `${program.name}이 시작되었습니다. 첫 운동을 시작해보세요!`
  });

  return Response.json({ success: true, data: subscription });
}
```

### 운동 세션 완료
```typescript
// POST /api/everex/sessions/:id/complete
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const {
    exercises,
    totalDuration,
    completionPercentage,
    videoUrls
  } = await req.json();

  // 1. AI 분석 결과 가져오기 (EverEx API)
  const aiAnalysis = await getEverExAIAnalysis(params.id);

  // 2. 세션 완료 처리
  const { data: session } = await supabase
    .from('everex_sessions')
    .update({
      exercises,
      total_duration_minutes: totalDuration,
      completion_percentage: completionPercentage,
      overall_accuracy: aiAnalysis.overall_accuracy,
      ai_feedback: aiAnalysis.feedback,
      improvements: aiAnalysis.improvements,
      next_goals: aiAnalysis.next_goals,
      video_urls: videoUrls,
      status: 'completed'
    })
    .eq('id', params.id)
    .select()
    .single();

  // 3. 진행 상황 업데이트
  await updateProgress(session.subscription_id, aiAnalysis.scores);

  // 4. 사용자에게 알림
  await sendNotification({
    userId: session.user_id,
    title: '✅ 운동 완료!',
    body: `정확도 ${aiAnalysis.overall_accuracy}% - 잘하셨어요!`
  });

  // 5. 가족에게 공유
  await sendFamilyNotifications(session.user_id, {
    title: '오늘 재활 운동 완료',
    body: `${totalDuration}분 운동, 완료도 ${completionPercentage}%`,
    sessionId: session.id
  });

  return Response.json({ success: true, data: session });
}
```

---

## EverEx API 연동

```typescript
const EVEREX_API_URL = process.env.EVEREX_API_URL;
const EVEREX_API_KEY = process.env.EVEREX_API_KEY;

// 사용자 등록
export const createEverExUser = async (userData: {
  name: string;
  age: number;
  healthConditions: string[];
}) => {
  const response = await fetch(`${EVEREX_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EVEREX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  return await response.json();
};

// 구독 생성
export const createEverExSubscription = async (subData: {
  everexUserId: string;
  programId: string;
  assessmentData: any;
}) => {
  const response = await fetch(`${EVEREX_API_URL}/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EVEREX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subData)
  });

  return await response.json();
};

// AI 분석 결과 조회
export const getEverExAIAnalysis = async (sessionId: string) => {
  const response = await fetch(
    `${EVEREX_API_URL}/sessions/${sessionId}/analysis`,
    {
      headers: {
        'Authorization': `Bearer ${EVEREX_API_KEY}`
      }
    }
  );

  return await response.json();
};
```

---

**작성일**: 2025-01-24
**버전**: 1.0
**다음 문서**: 02-K-DOC-원격진료-연동.md
