# 시니어 통합 서비스 플랫폼 - 기능 명세서 (Phase 1)

> **현재 상태**: Alert 기반 목업 → **목표**: 실제 작동하는 MVP

---

## 📱 현재 구현 현황 분석

### ✅ 완료된 부분
- 다국어 지원 (한국어, 영어, 일본어)
- 반응형 UI/UX (모바일 우선)
- 페이지 라우팅 (홈, 검색, 예약내역, 프로필)
- 하단 네비게이션
- 디자인 시스템 (아이콘, 컬러, 타이포그래피)

### ⚠️ 개선 필요 (Alert → 실제 기능)
1. **홈 화면**: 약 복용, 예약 카드 → Alert
2. **서비스 아이콘**: 6개 서비스 → Alert
3. **AI 검색**: 입력창만 있음
4. **예약 기능**: 목업 데이터만 표시
5. **프로필**: 메뉴 항목 클릭 → Alert

---

## 🎯 Phase 1 MVP 목표

**기간**: 2-3주
**목표**: 핵심 1개 서비스(이발 예약)를 실제로 작동하게 만들기

### 핵심 사용자 시나리오
```
시니어가 앱에 들어와서
→ "명성이발관 예약하기" 버튼 클릭
→ 날짜/시간 선택
→ 예약 완료
→ 예약 내역에서 확인
→ 방문 완료 후 리뷰 작성
```

---

## 🏗️ 상세 기능 명세

---

## 1️⃣ 홈 화면 (Home Page)

### 1.1 오늘 할 일 섹션
**현재**: Alert 창으로 처리
**개선**: 실제 데이터 연동

#### 약 복용 카드
```typescript
기능:
- [ ] 약 복용 시간 알림 표시 (LocalStorage 기반)
- [ ] "복용 완료" 버튼 클릭 시 체크 표시
- [ ] 복용 기록 저장 (날짜별)
- [ ] 미복용 시 빨간색 경고 표시

데이터 구조:
{
  id: string;
  name: string; // "아침 약"
  time: string; // "09:00"
  completed: boolean;
  completedAt?: Date;
}

페이지:
- /medicine-management (약 관리 페이지)
```

#### 예약 카드 (이발 예약)
```typescript
기능:
- [ ] 오늘 예약된 일정 표시
- [ ] "위치 보기" → 카카오맵/네이버맵 연동
- [ ] "전화하기" → tel: 링크로 바로 전화
- [ ] 예약 시간 30분 전 알림

데이터 구조:
{
  id: string;
  shopName: string;
  serviceName: string;
  date: Date;
  time: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    phone: string;
  };
  status: 'scheduled' | 'arrived' | 'completed' | 'cancelled';
}
```

### 1.2 AI 어시스턴트 섹션
```typescript
기능:
- [ ] 음성 입력 버튼 (Web Speech API)
- [ ] 텍스트 검색 입력
- [ ] 검색 결과 페이지로 이동
- [ ] 최근 검색어 저장/표시

구현:
- Input 포커스 시 최근 검색어 드롭다운
- 검색어 자동완성 (미래: AI 추천)
- 마이크 버튼: navigator.mediaDevices.getUserMedia()
```

### 1.3 서비스 바로가기
```typescript
현재: 6개 서비스 (이발, 식사, 병원, 청소, 여가, 택시) → Alert

Phase 1 구현:
- [x] 이발 예약 페이지로 이동 (/search/haircut)
- [ ] 나머지 5개: "준비중입니다" 토스트 메시지

Phase 2:
- [ ] 각 카테고리별 검색 페이지 구현
```

### 1.4 추천 매장
```typescript
기능:
- [ ] 사용자 위치 기반 근처 매장 추천
- [ ] "단골" 매장 표시 (방문 3회 이상)
- [ ] 별점/거리/가격 표시
- [ ] "지금 예약" → 예약 페이지로 이동

데이터 구조:
{
  id: string;
  name: string;
  category: 'haircut' | 'meal' | 'hospital' | ...;
  rating: number;
  distance: number; // meters
  price: number;
  isRegular: boolean; // 단골 여부
  image?: string;
  tags: string[]; // ["친절해요", "깨끗해요"]
}
```

---

## 2️⃣ 검색 페이지 (Search Page)

### 2.1 카테고리별 검색
```typescript
현재: 카테고리 버튼만 있음

구현:
- [ ] 카테고리 클릭 시 해당 서비스 목록 페이지로 이동
- [ ] /search/[category] 동적 라우팅
- [ ] 카테고리별 필터 (거리, 가격, 평점)
```

### 2.2 검색 결과 페이지
```typescript
경로: /search/haircut (이발 예약 예시)

기능:
- [ ] 매장 목록 표시 (카드 형태)
- [ ] 필터: 거리순, 평점순, 가격순
- [ ] 지도 보기 / 리스트 보기 토글
- [ ] 무한 스크롤 (페이지네이션)

매장 카드:
- 매장명, 별점, 거리, 가격
- 대표 이미지
- "예약하기" 버튼
```

---

## 3️⃣ 예약 플로우 (Booking Flow)

### 3.1 매장 상세 페이지
```typescript
경로: /shop/[shopId]

섹션:
1. 매장 정보
   - 이름, 주소, 전화번호
   - 영업시간
   - 대표 사진 (갤러리)
   - 별점 + 리뷰 수

2. 서비스 메뉴
   - 서비스명, 가격, 소요시간
   - 선택 가능한 라디오 버튼

3. 리뷰 섹션
   - 최근 리뷰 3개 표시
   - "전체 보기" 버튼

4. 하단 고정 버튼
   - "예약하기" (큰 버튼)
   - "전화하기"
```

### 3.2 예약 날짜/시간 선택
```typescript
경로: /booking/datetime?shopId=xxx&serviceId=xxx

기능:
- [ ] 달력 UI (react-day-picker 또는 자체 제작)
- [ ] 선택한 날짜의 예약 가능 시간 표시
- [ ] 이미 예약된 시간 비활성화
- [ ] 오늘/내일/모레 빠른 선택 버튼

데이터:
{
  availableSlots: {
    date: string; // "2025-01-24"
    slots: Array<{
      time: string; // "10:00"
      available: boolean;
    }>;
  }[];
}
```

### 3.3 예약 확인 및 결제
```typescript
경로: /booking/confirm

표시 정보:
- 매장명
- 서비스명
- 날짜/시간
- 가격
- 예약자 정보 (이름, 전화번호)

결제 방법:
Phase 1:
- [ ] 현장 결제 (예약만 진행)

Phase 2:
- [ ] 토스페이먼츠 연동
- [ ] 포인트 사용

버튼:
- "예약 완료" → 예약 완료 페이지로 이동
```

### 3.4 예약 완료
```typescript
경로: /booking/success?bookingId=xxx

표시:
- ✅ 성공 아이콘
- 예약 정보 요약
- "예약 내역 보기" 버튼
- "홈으로 가기" 버튼

추가 기능:
- [ ] 카카오톡 알림톡 발송 (미래)
- [ ] SMS 발송
```

---

## 4️⃣ 예약 내역 페이지 (Bookings Page)

### 4.1 예약 목록
```typescript
현재: 하드코딩된 데이터

개선:
- [ ] API에서 예약 목록 가져오기
- [ ] 예정/완료 탭 전환
- [ ] 날짜별 그룹핑
- [ ] 각 예약 카드 클릭 → 예약 상세 페이지

예약 카드:
- 매장명, 서비스, 날짜/시간
- 상태 배지 (예정, 도착, 완료, 취소)
- "취소하기" 버튼 (예정 상태만)
```

### 4.2 예약 상세
```typescript
경로: /booking/[bookingId]

섹션:
1. 예약 정보
   - 매장명, 서비스, 날짜/시간
   - 상태

2. 매장 정보
   - 주소, 전화번호
   - "길 찾기" 버튼
   - "전화하기" 버튼

3. 액션 버튼
   - 예정 상태: "취소하기", "일정 변경"
   - 완료 상태: "리뷰 작성하기"
```

### 4.3 예약 취소
```typescript
기능:
- [ ] 취소 사유 선택 (선택사항)
- [ ] 취소 확인 다이얼로그
- [ ] 취소 완료 후 상태 업데이트
- [ ] 환불 안내 (결제한 경우)

취소 정책:
- 24시간 전: 100% 환불
- 3시간 전: 50% 환불
- 그 이후: 환불 불가
```

### 4.4 리뷰 작성
```typescript
경로: /review/write?bookingId=xxx

입력 항목:
- [ ] 별점 (1-5)
- [ ] 리뷰 내용 (텍스트)
- [ ] 사진 첨부 (선택, 최대 3장)
- [ ] 태그 선택 (친절해요, 깨끗해요 등)

제출 후:
- 포인트 적립 (100P)
- 리뷰 목록에 표시
```

---

## 5️⃣ 프로필 페이지 (Profile Page)

### 5.1 사용자 정보
```typescript
현재: 하드코딩

개선:
- [ ] 로그인 시스템 구축
- [ ] 프로필 수정 페이지 (/profile/edit)
- [ ] 사진 업로드

저장 정보:
- 이름, 전화번호, 생년월일
- 프로필 사진
- 주소 (기본 주소)
```

### 5.2 포인트 시스템
```typescript
기능:
- [ ] 포인트 적립 내역
- [ ] 포인트 사용 내역
- [ ] 포인트 적립 규칙 안내

적립 규칙:
- 회원가입: 1,000P
- 예약 완료: 예약금의 1%
- 리뷰 작성: 100P
- 친구 추천: 500P
```

### 5.3 주요 메뉴 구현

#### 결제 수단 관리
```typescript
경로: /profile/payment

기능:
- [ ] 카드 등록/삭제
- [ ] 기본 결제 수단 설정
- [ ] 자동결제 설정
```

#### 가족 연결
```typescript
경로: /profile/family

기능:
- [ ] 가족 초대 코드 생성
- [ ] 가족 계정 연결
- [ ] 가족이 내 예약/활동 모니터링 가능
- [ ] 가족 알림 설정

미래 기능:
- 가족이 대신 예약 가능
- 응급 상황 시 가족에게 자동 알림
```

#### 약 관리
```typescript
경로: /profile/medicine

기능:
- [ ] 복용 중인 약 목록
- [ ] 약 추가 (이름, 복용시간, 복용량)
- [ ] 복용 알림 설정
- [ ] 복용 기록 캘린더
```

#### 알림 설정
```typescript
경로: /profile/notifications

설정 항목:
- [ ] 예약 알림 (30분 전, 1시간 전)
- [ ] 약 복용 알림
- [ ] 마케팅 알림
- [ ] 푸시 알림 on/off
```

---

## 6️⃣ 인증 시스템 (Authentication)

### 6.1 회원가입/로그인
```typescript
Phase 1: 간단한 전화번호 인증
- [ ] 전화번호 입력
- [ ] SMS 인증번호 발송
- [ ] 인증번호 확인
- [ ] 이름 입력
- [ ] 회원가입 완료

Phase 2: 소셜 로그인
- [ ] 카카오톡 로그인
- [ ] 네이버 로그인
```

### 6.2 자동 로그인
```typescript
구현:
- [ ] JWT 토큰 기반 인증
- [ ] Access Token + Refresh Token
- [ ] 토큰 만료 시 자동 갱신
```

---

## 7️⃣ 데이터 관리 전략

### Phase 1: Local Storage + Mock API
```typescript
목적: 빠른 프로토타이핑

구현:
1. 매장 데이터: JSON 파일 (public/data/shops.json)
2. 예약 데이터: LocalStorage
3. 사용자 정보: LocalStorage

장점: 서버 없이 바로 구현 가능
단점: 데이터 공유 불가, 새로고침 시 유실
```

### Phase 2: Supabase (Backend as a Service)
```typescript
목적: 실제 서비스 런칭

테이블 구조:

1. users (사용자)
   - id, name, phone, email
   - profile_image, birth_date
   - created_at

2. shops (매장)
   - id, name, category, description
   - address, lat, lng, phone
   - business_hours, rating, review_count
   - images[]

3. services (서비스)
   - id, shop_id, name
   - price, duration
   - description

4. bookings (예약)
   - id, user_id, shop_id, service_id
   - date, time, status
   - created_at, updated_at

5. reviews (리뷰)
   - id, booking_id, user_id, shop_id
   - rating, content, images[]
   - created_at

6. medicine_logs (약 복용 기록)
   - id, user_id, medicine_name
   - scheduled_time, completed_at
   - date
```

---

## 8️⃣ 기술 스택 (Phase 1)

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- next-intl (다국어)

### 상태 관리
- React Context API (글로벌 상태)
- LocalStorage (간단한 데이터 저장)

### 외부 라이브러리
```json
추가 필요:
- date-fns (날짜 처리)
- react-day-picker (달력 UI)
- sonner (토스트 알림)
- zustand (상태 관리, 선택사항)
```

### Phase 2 추가
- Supabase (백엔드)
- TanStack Query (서버 상태 관리)
- 토스페이먼츠 (결제)

---

## 9️⃣ 개발 우선순위

### Week 1: 데이터 레이어 & 이발 예약 플로우
```
Day 1-2: 데이터 구조 설계
- [ ] TypeScript 타입 정의
- [ ] Mock 데이터 생성 (shops.json)
- [ ] LocalStorage 유틸리티 함수

Day 3-5: 검색 → 매장 상세 → 예약
- [ ] /search/haircut 페이지 구현
- [ ] /shop/[id] 매장 상세 페이지
- [ ] /booking/datetime 날짜 선택
- [ ] /booking/confirm 예약 확인
- [ ] /booking/success 완료 페이지

Day 6-7: 예약 내역
- [ ] 예약 목록 API 연동 (LocalStorage)
- [ ] 예약 상세 페이지
- [ ] 예약 취소 기능
```

### Week 2: 홈 화면 실제 기능 & 리뷰
```
Day 1-2: 약 관리
- [ ] /profile/medicine 약 관리 페이지
- [ ] 약 추가/수정/삭제
- [ ] 홈 화면에 오늘 복용할 약 표시
- [ ] 복용 완료 체크

Day 3-4: 홈 화면 개선
- [ ] 오늘 예약 표시 (실제 데이터)
- [ ] 위치 보기, 전화하기 기능
- [ ] 추천 매장 표시

Day 5-7: 리뷰 시스템
- [ ] /review/write 리뷰 작성 페이지
- [ ] 사진 업로드
- [ ] 매장 상세 페이지에 리뷰 표시
- [ ] 리뷰 작성 후 포인트 적립
```

### Week 3: 인증 & 프로필
```
Day 1-3: 인증 시스템
- [ ] 전화번호 입력 UI
- [ ] SMS 인증 (Mock)
- [ ] JWT 토큰 생성/저장
- [ ] 로그인 상태 관리

Day 4-5: 프로필 기능
- [ ] 프로필 수정
- [ ] 포인트 적립/사용 내역
- [ ] 주소 관리
- [ ] 알림 설정

Day 6-7: 버그 수정 & 테스트
- [ ] 전체 플로우 테스트
- [ ] 반응형 체크
- [ ] 다국어 번역 확인
- [ ] 성능 최적화
```

---

## 🔟 성공 지표 (KPI)

### Phase 1 MVP 목표
- [ ] 1명의 사용자가 처음부터 끝까지 예약 완료 가능
- [ ] 예약 → 예약 확인 → 리뷰 작성 전체 플로우 작동
- [ ] 모바일 환경에서 버그 없이 작동
- [ ] 로딩 시간 3초 이내

### 추후 지표
- DAU (일일 활성 사용자)
- 예약 전환율 (방문 → 예약 비율)
- 리뷰 작성률
- 재방문율 (7일 내 재방문)

---

## 📝 다음 단계

1. **이 명세서 검토 후 승인**
2. **Week 1 Day 1-2 작업 시작** (데이터 구조 설계)
3. **매일 진행 상황 체크**

---

**작성일**: 2025-01-24
**작성자**: Claude Code
**버전**: 1.0
