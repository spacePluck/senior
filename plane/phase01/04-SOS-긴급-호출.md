# Phase 1 - SOS 긴급 호출
## 기능 상세 기획서

> **개발 우선순위**: ⭐⭐⭐ (최우선)
> **예상 소요 시간**: 1주
> **기술**: Firebase Cloud Messaging, SMS API, Geolocation API

---

## 기능 개요

### 핵심 가치
- 시니어의 안전을 지키는 **생명줄**
- 가족의 **가장 큰 안심 요소**
- 3초 안에 도움 요청 가능

---

## SOS 버튼 UI

### 모든 화면에 고정

```
┌─────────────────────────────────────┐
│  [상단 앱 바]                       │
│                                      │
│  [메인 콘텐츠]                      │
│                                      │
│                                      │
│                                      │
│  [하단 네비게이션]                  │
│                                      │
│  ┌───────────┐ <- 우측 하단 고정   │
│  │    SOS    │                      │
│  │    🆘     │                      │
│  └───────────┘                      │
└─────────────────────────────────────┘
```

### 버튼 디자인
```css
.sos-button {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: white;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.5);
  z-index: 9999;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 3초 길게 누르기

```
┌─────────────────────────────────────┐
│  🚨 응급 상황인가요?                │
│                                      │
│  SOS 버튼을 길게 누르고 있습니다    │
│                                      │
│  [3초 카운트다운]                   │
│  ⏱️ ●○○ 2초 남음                  │
│                                      │
│  손을 떼면 취소됩니다                │
│                                      │
│  계속 누르고 계시면                  │
│  가족에게 자동으로 알림이 갑니다    │
└─────────────────────────────────────┘
```

```typescript
const handleSOSPress = () => {
  let pressTimer: NodeJS.Timeout;
  let countdown = 3;

  const onPressStart = () => {
    setShowCountdown(true);

    pressTimer = setInterval(() => {
      countdown--;
      setCountdownValue(countdown);

      if (countdown === 0) {
        clearInterval(pressTimer);
        triggerSOS();
      }
    }, 1000);
  };

  const onPressEnd = () => {
    clearInterval(pressTimer);
    setShowCountdown(false);
    countdown = 3;
  };

  return { onPressStart, onPressEnd };
};
```

---

## SOS 발동

```typescript
const triggerSOS = async () => {
  // 1. 현재 위치 가져오기
  const location = await getCurrentLocation();

  // 2. 응급 정보 카드 준비
  const emergencyCard = await getEmergencyCard(userId);

  // 3. 가족 모두에게 푸시 알림
  await sendFamilyPushNotifications({
    userId,
    title: '🚨 긴급 SOS',
    body: '어머니가 SOS 버튼을 눌렀습니다!',
    data: {
      type: 'sos_alert',
      location,
      emergencyCard
    },
    priority: 'high',
    sound: 'emergency'
  });

  // 4. 가족 모두에게 SMS 발송
  await sendFamilySMS({
    userId,
    message: `[긴급] 어머니가 SOS 버튼을 눌렀습니다!\n위치: ${location.address}\n전화: ${emergencyCard.phone}`
  });

  // 5. 실시간 위치 공유 시작
  await startLocationTracking(userId);

  // 6. DB 기록
  await supabase.from('sos_alerts').insert({
    user_id: userId,
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    emergency_card: emergencyCard,
    status: 'active'
  });
};
```

---

## 실시간 위치 공유

```
[가족 앱 화면]

┌─────────────────────────────────────┐
│  🚨 긴급 SOS 알림                   │
│                                      │
│  어머니가 SOS 버튼을 눌렀습니다!    │
│                                      │
│  현재 위치:                          │
│  서울시 강동구 천호동 123-45        │
│                                      │
│  [지도 표시]                        │
│  📍 실시간 위치 추적 중...          │
│                                      │
│  ━━━ 응급 정보 ━━━                 │
│                                      │
│  이름: 홍길순                       │
│  생년월일: 1950-03-15 (75세)        │
│  혈액형: A형                        │
│                                      │
│  복용 중인 약:                       │
│  • 혈압약 (아모디핀 5mg)            │
│  • 당뇨약 (메트포민 500mg)          │
│                                      │
│  알레르기: 페니실린                 │
│                                      │
│  기저 질환:                          │
│  • 고혈압                           │
│  • 당뇨                             │
│                                      │
│  비상 연락처:                        │
│  • 큰딸: 010-1234-5678              │
│  • 작은딸: 010-2345-6789            │
│                                      │
│  [전화하기] [119 신고]              │
└─────────────────────────────────────┘
```

---

## 응급 정보 카드

```typescript
interface EmergencyCard {
  name: string;
  birthDate: Date;
  age: number;
  bloodType: string;
  medications: string[];
  allergies: string[];
  conditions: string[];
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];
  photo?: string;
}
```

---

## DB 스키마

```sql
CREATE TABLE emergency_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  blood_type VARCHAR(10),
  allergies TEXT[],
  conditions TEXT[],
  medications TEXT[],
  emergency_contacts JSONB,
  photo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  emergency_card JSONB,
  status VARCHAR(20) DEFAULT 'active',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

**작성일**: 2025-01-24
**버전**: 1.0
