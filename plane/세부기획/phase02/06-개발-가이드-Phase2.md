# Phase 2 - 개발 가이드
## 기술 스택 & API 연동

> **목적**: Phase 2 개발 시 추가되는 기술 스택 및 외부 API 연동 가이드

---

## Phase 2 추가 기술 스택

### 결제 시스템
```json
{
  "PG사": "토스페이먼츠 (Toss Payments)",
  "라이브러리": "@tosspayments/sdk",
  "지원 결제": ["카드", "계좌이체", "간편결제"],
  "정기결제": "빌링키 방식"
}
```

### 실시간 통신
```json
{
  "위치추적": "Supabase Realtime",
  "배달추적": "WebSocket + Polling",
  "푸시알림": "Firebase Cloud Messaging"
}
```

### 외부 API
```json
{
  "병원예약": "병원 자체 API / 중개 플랫폼",
  "바야다": "Bayada API",
  "카카오택시": "Kakao Mobility API",
  "배달": "배달의민족/쿠팡이츠 API"
}
```

---

## 외부 API 연동 가이드

### 1. Kakao Mobility API

#### 인증
```typescript
const KAKAO_ADMIN_KEY = process.env.KAKAO_MOBILITY_ADMIN_KEY;

const headers = {
  'Authorization': `KakaoAK ${KAKAO_ADMIN_KEY}`,
  'Content-Type': 'application/json'
};
```

#### 택시 호출
```typescript
const callTaxi = async (params: {
  origin: { x: number; y: number; name: string };
  destination: { x: number; y: number; name: string };
}) => {
  const response = await fetch(
    'https://apis-navi.kakaomobility.com/v1/taxi/call',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    }
  );

  return await response.json();
};
```

### 2. Toss Payments

#### SDK 초기화
```typescript
import { loadTossPayments } from '@tosspayments/sdk';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

const tossPayments = await loadTossPayments(clientKey);
```

#### 일반 결제
```typescript
const requestPayment = async ({
  amount,
  orderName,
  orderId
}: PaymentRequest) => {
  await tossPayments.requestPayment('카드', {
    amount,
    orderId,
    orderName,
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`
  });
};
```

#### 정기 결제 (빌링키)
```typescript
// 1. 빌링키 발급
const issueBillingKey = async (customerKey: string) => {
  await tossPayments.requestBillingAuth('카드', {
    customerKey,
    successUrl: `${window.location.origin}/billing/success`,
    failUrl: `${window.location.origin}/billing/fail`
  });
};

// 2. 빌링키로 결제
const chargeWithBillingKey = async ({
  billingKey,
  amount,
  orderName
}: BillingPayment) => {
  const response = await fetch(
    `https://api.tosspayments.com/v1/billing/${billingKey}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          process.env.TOSS_SECRET_KEY + ':'
        ).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderName
      })
    }
  );

  return await response.json();
};
```

### 3. Bayada API

```typescript
const BAYADA_API_URL = process.env.BAYADA_API_URL;
const BAYADA_API_KEY = process.env.BAYADA_API_KEY;

const bayadaHeaders = {
  'Authorization': `Bearer ${BAYADA_API_KEY}`,
  'Content-Type': 'application/json'
};

// 전문가 매칭
const matchProfessional = async (criteria: MatchCriteria) => {
  const response = await fetch(
    `${BAYADA_API_URL}/professionals/match`,
    {
      method: 'POST',
      headers: bayadaHeaders,
      body: JSON.stringify(criteria)
    }
  );

  return await response.json();
};

// 계약 생성
const createContract = async (contractData: ContractData) => {
  const response = await fetch(
    `${BAYADA_API_URL}/contracts`,
    {
      method: 'POST',
      headers: bayadaHeaders,
      body: JSON.stringify(contractData)
    }
  );

  return await response.json();
};
```

---

## 정기 결제 시스템

### 빌링키 관리

```sql
CREATE TABLE billing_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  customer_key VARCHAR(100) UNIQUE NOT NULL,
  billing_key VARCHAR(100) NOT NULL,
  card_company VARCHAR(50),
  card_number_masked VARCHAR(20),
  card_type VARCHAR(20),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);
```

### Cron Job: 월 정기 결제
```typescript
// Cron: 매월 1일 실행
export const processMonthlySubscriptions = async () => {
  // 1. 바야다 정기 구독
  await processBayadaSubscriptions();

  // 2. 도시락 정기 배송
  await processFoodSubscriptions();

  // 3. 청소 정기 서비스 (해당되는 경우)
  await processHomeServiceSubscriptions();
};

const processBayadaSubscriptions = async () => {
  const { data: subscriptions } = await supabase
    .from('bayada_contracts')
    .select('*, billing_key:billing_keys(*)')
    .eq('status', 'active')
    .eq('auto_payment', true);

  for (const subscription of subscriptions) {
    try {
      const payment = await chargeWithBillingKey({
        billingKey: subscription.billing_key.billing_key,
        amount: subscription.final_monthly_amount,
        orderName: `바야다 홈케어 월 정기 결제`
      });

      if (payment.status === 'DONE') {
        // 결제 성공
        await sendNotification({
          userId: subscription.user_id,
          title: '💳 정기 결제 완료',
          body: `바야다 ${subscription.final_monthly_amount.toLocaleString()}원 결제되었습니다`
        });
      } else {
        // 결제 실패
        await sendNotification({
          userId: subscription.user_id,
          title: '⚠️ 결제 실패',
          body: '정기 결제에 실패했습니다. 결제 수단을 확인해주세요',
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Subscription payment failed:', error);
    }
  }
};
```

---

## Realtime 위치 추적

### Supabase Realtime 활용

```typescript
// 클라이언트: 택시 위치 실시간 구독
export const useTaxiLocation = (callId: string) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const channel = supabase
      .channel(`taxi:${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'taxi_calls',
          filter: `id=eq.${callId}`
        },
        (payload) => {
          setLocation({
            latitude: payload.new.driver_latitude,
            longitude: payload.new.driver_longitude
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callId]);

  return location;
};

// 서버: 위치 업데이트 (외부 API에서 받은 데이터)
const updateTaxiLocation = async (
  callId: string,
  location: { latitude: number; longitude: number }
) => {
  await supabase
    .from('taxi_calls')
    .update({
      driver_latitude: location.latitude,
      driver_longitude: location.longitude,
      last_location_update: new Date()
    })
    .eq('id', callId);

  // Realtime 구독자들에게 자동 전파됨
};
```

---

## 환경 변수

### .env.local (Phase 2 추가)
```env
# Phase 1 환경 변수 (기존)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
OPENAI_API_KEY=sk-xxx

# Phase 2 추가

# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
TOSS_SECRET_KEY=test_sk_xxx

# Kakao Mobility
KAKAO_MOBILITY_ADMIN_KEY=xxx
NEXT_PUBLIC_KAKAO_MAP_KEY=xxx

# Bayada
BAYADA_API_URL=https://api.bayada.com
BAYADA_API_KEY=xxx

# 병원 예약 API (예: 굿닥)
GOODOC_API_KEY=xxx

# 배달 API
BAEMIN_API_KEY=xxx
COUPANG_EATS_API_KEY=xxx
```

---

## 에러 핸들링

### 공통 에러 처리
```typescript
class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any) => {
  if (error instanceof APIError) {
    return Response.json({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    }, { status: error.statusCode });
  }

  // 알 수 없는 에러
  console.error('Unexpected error:', error);
  return Response.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '일시적인 오류가 발생했습니다'
    }
  }, { status: 500 });
};
```

### 재시도 로직
```typescript
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      // 5xx 에러면 재시도
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      // 4xx 에러면 재시도 안 함
      return response;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw lastError;
};
```

---

## 테스트

### 결제 테스트
```typescript
// Toss Payments 테스트 키 사용
const testPayment = async () => {
  const tossPayments = await loadTossPayments(
    'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
  );

  await tossPayments.requestPayment('카드', {
    amount: 1000,
    orderId: 'test-order-001',
    orderName: '테스트 결제',
    successUrl: '/payment/success',
    failUrl: '/payment/fail'
  });
};
```

### API Mock
```typescript
// 외부 API Mock (개발/테스트 환경)
export const mockKakaoTaxiCall = () => {
  if (process.env.NODE_ENV !== 'production') {
    return {
      success: true,
      call_id: 'mock-call-123',
      estimated_fare: 15000,
      estimated_wait_time: 3
    };
  }

  // 실제 API 호출
  return callKakaoTaxi(params);
};
```

---

## 배포

### Vercel 환경 변수 설정
```bash
# Toss Payments
vercel env add NEXT_PUBLIC_TOSS_CLIENT_KEY production
vercel env add TOSS_SECRET_KEY production

# Kakao
vercel env add KAKAO_MOBILITY_ADMIN_KEY production

# Bayada
vercel env add BAYADA_API_URL production
vercel env add BAYADA_API_KEY production
```

### Cron Job 설정 (Vercel)
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/monthly-payments",
      "schedule": "0 0 1 * *"
    },
    {
      "path": "/api/cron/subscription-deliveries",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/booking-reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

**작성일**: 2025-01-24
**버전**: 1.0
