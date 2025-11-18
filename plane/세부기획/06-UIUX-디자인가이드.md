# UI/UX 디자인 가이드

> **목표**: 시니어 친화적이고 일관된 사용자 경험 제공

---

## 📋 목차

1. [디자인 원칙](#1-디자인-원칙)
2. [컬러 시스템](#2-컬러-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [레이아웃 & 그리드](#4-레이아웃--그리드)
5. [컴포넌트 가이드](#5-컴포넌트-가이드)
6. [인터랙션 패턴](#6-인터랙션-패턴)
7. [접근성 가이드](#7-접근성-가이드)

---

## 1. 디자인 원칙

### 1.1 핵심 원칙

**1. 단순성 (Simplicity)**
```
- 한 화면에 하나의 주요 작업
- 불필요한 요소 제거
- 명확한 정보 계층 구조
```

**2. 가독성 (Readability)**
```
- 큰 폰트 크기 (최소 18px)
- 충분한 대비 (WCAG AAA 기준)
- 명확한 색상 구분
```

**3. 터치 친화성 (Touch-Friendly)**
```
- 최소 터치 영역: 48px × 48px
- 넉넉한 간격 (최소 16px)
- 큰 버튼 (권장 56px 이상)
```

**4. 피드백 명확성 (Clear Feedback)**
```
- 모든 액션에 즉각적인 피드백
- 명확한 성공/실패 메시지
- 진행 상태 표시
```

**5. 오류 방지 (Error Prevention)**
```
- 중요 작업은 확인 단계 추가
- 실수 쉽게 되돌리기
- 명확한 안내 메시지
```

### 1.2 시니어 UX 체크리스트

```
✅ 텍스트가 18px 이상인가?
✅ 색상 대비가 4.5:1 이상인가?
✅ 터치 영역이 48px 이상인가?
✅ 주요 버튼이 화면 하단에 있는가?
✅ 아이콘에 텍스트 레이블이 있는가?
✅ 한 화면에 정보가 과도하지 않은가?
✅ 로딩 상태를 명확히 보여주는가?
✅ 오류 메시지가 이해하기 쉬운가?
✅ 뒤로 가기가 쉬운가?
✅ 음성 입력이 가능한가?
```

---

## 2. 컬러 시스템

### 2.1 메인 컬러 팔레트

```css
/* Primary - 차분한 파랑 (신뢰감) */
--color-primary: #667EEA;
--color-primary-light: #E8F0FF;
--color-primary-dark: #5568D3;

/* Secondary - 따뜻한 주황 (친근함) */
--color-secondary: #FF8C42;
--color-secondary-light: #FFE8D9;
--color-secondary-dark: #E67A2E;

/* Success - 부드러운 초록 */
--color-success: #48BB78;
--color-success-light: #E8F9F3;
--color-success-dark: #38A169;

/* Warning - 밝은 노랑 */
--color-warning: #F6AD55;
--color-warning-light: #FFF4E8;
--color-warning-dark: #ED8936;

/* Danger - 온화한 빨강 */
--color-danger: #FC8181;
--color-danger-light: #FFE8E8;
--color-danger-dark: #F56565;

/* Gray Scale */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;

/* Text */
--color-text-primary: #1F2937;   /* gray-800 */
--color-text-secondary: #4B5563; /* gray-600 */
--color-text-tertiary: #9CA3AF;  /* gray-400 */
--color-text-inverse: #FFFFFF;

/* Background */
--color-bg: #FFFFFF;
--color-bg-secondary: #F9FAFB;   /* gray-50 */
--color-bg-card: #FFFFFF;

/* Accent */
--color-accent-pink: #FF6B9D;
--color-accent-purple: #9F7AEA;
--color-accent-peach: #FDB57D;
--color-accent-yellow: #FFD93D;
```

### 2.2 색상 사용 가이드

**주요 버튼**
```css
background: var(--color-primary);
color: white;
대비: 4.5:1 이상 보장
```

**경고 버튼**
```css
background: var(--color-danger);
color: white;
```

**성공 피드백**
```css
background: var(--color-success-light);
border: 2px solid var(--color-success);
color: var(--color-success-dark);
```

**카드/섹션 구분**
```css
background: var(--color-bg-card);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
border-radius: 16px;
```

---

## 3. 타이포그래피

### 3.1 폰트 설정

```css
/* 기본 폰트 */
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont,
             'Segoe UI', sans-serif;

/* 폰트 웨이트 */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 3.2 타입 스케일

```css
/* Heading */
--text-4xl: 40px;  /* 주요 제목 */
--text-3xl: 32px;  /* 섹션 제목 */
--text-2xl: 28px;  /* 카드 제목 */
--text-xl: 24px;   /* 서브 제목 */
--text-lg: 20px;   /* 큰 본문 */

/* Body */
--text-base: 18px; /* 기본 본문 (최소 크기) */
--text-md: 16px;   /* 작은 본문 (최소 사용) */
--text-sm: 14px;   /* 캡션 (꼭 필요할 때만) */

/* Line Height */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 3.3 텍스트 스타일

```css
/* 페이지 제목 */
.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

/* 섹션 제목 */
.section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
}

/* 본문 */
.body-text {
  font-size: var(--text-base);
  font-weight: var(--font-regular);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* 강조 텍스트 */
.text-emphasis {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* 작은 텍스트 (최소 사용) */
.text-small {
  font-size: var(--text-md);
  color: var(--color-text-tertiary);
  line-height: var(--leading-normal);
}
```

---

## 4. 레이아웃 & 그리드

### 4.1 반응형 레이아웃

```css
/* 컨테이너 */
.container {
  max-width: 560px; /* 모바일 우선 */
  margin: 0 auto;
  padding: 0 20px;
}

/* 반응형 패딩 */
.spacing-responsive {
  padding: 20px;
}

@media (min-width: 768px) {
  .spacing-responsive {
    padding: 24px;
  }
}

@media (min-width: 1024px) {
  .spacing-responsive {
    padding: 32px;
  }
}
```

### 4.2 간격 시스템

```css
/* Spacing Scale */
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;

/* 컴포넌트 간 간격 */
.component-gap {
  margin-bottom: var(--spacing-6); /* 24px */
}

/* 섹션 간 간격 */
.section-gap {
  margin-bottom: var(--spacing-10); /* 40px */
}
```

### 4.3 그리드 시스템

```css
/* 기본 그리드 (2열) */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

/* 3열 그리드 */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3);
}

/* 반응형 그리드 */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-5);
  }
}
```

---

## 5. 컴포넌트 가이드

### 5.1 버튼

```typescript
// Primary Button (주요 액션)
<button className="btn-primary">
  예약하기
</button>

.btn-primary {
  min-height: 56px;
  padding: 16px 24px;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: white;
  background: var(--color-primary);
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: scale(0.98);
}

// Secondary Button
.btn-secondary {
  min-height: 56px;
  padding: 16px 24px;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
  background: var(--color-primary-light);
  border-radius: 12px;
  border: 2px solid var(--color-primary);
}

// Danger Button
.btn-danger {
  background: var(--color-danger);
  color: white;
}

// Full Width Button
.btn-full {
  width: 100%;
}

// Large Button (화면 하단 고정용)
.btn-large {
  min-height: 64px;
  font-size: var(--text-xl);
}
```

### 5.2 카드

```typescript
.card {
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

// 클릭 가능한 카드
.card-interactive {
  cursor: pointer;
}

.card-interactive:active {
  transform: scale(0.98);
}

// 카드 헤더
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

// 카드 타이틀
.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}
```

### 5.3 입력 필드

```typescript
.input {
  min-height: 56px;
  padding: 16px 20px;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  background: white;
  border: 2px solid var(--color-gray-300);
  border-radius: 12px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

// 에러 상태
.input-error {
  border-color: var(--color-danger);
}

// 레이블
.label {
  display: block;
  margin-bottom: 8px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

// 도움말 텍스트
.help-text {
  margin-top: 8px;
  font-size: var(--text-md);
  color: var(--color-text-tertiary);
}

// 에러 메시지
.error-text {
  margin-top: 8px;
  font-size: var(--text-md);
  color: var(--color-danger);
  font-weight: var(--font-medium);
}
```

### 5.4 체크박스 & 라디오

```typescript
// 큰 체크박스 (터치 친화적)
.checkbox-large {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-gray-400);
  border-radius: 6px;
  cursor: pointer;
}

.checkbox-large:checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

// 체크박스 레이블
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 8px;
  cursor: pointer;
}

.checkbox-label:hover {
  background: var(--color-gray-50);
  border-radius: 8px;
}
```

### 5.5 알림/토스트

```typescript
// 성공 알림
.toast-success {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--color-success-light);
  border: 2px solid var(--color-success);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.2);
}

.toast-success-icon {
  width: 32px;
  height: 32px;
  background: var(--color-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.toast-success-text {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-success-dark);
}

// 에러 알림
.toast-error {
  background: var(--color-danger-light);
  border-color: var(--color-danger);
}

// 경고 알림
.toast-warning {
  background: var(--color-warning-light);
  border-color: var(--color-warning);
}
```

### 5.6 배지

```typescript
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  border-radius: 20px;
}

.badge-primary {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.badge-success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.badge-danger {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
}
```

---

## 6. 인터랙션 패턴

### 6.1 로딩 상태

```typescript
// 스피너
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// 로딩 오버레이
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 9999;
}

.loading-text {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
}

// 스켈레톤
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 6.2 애니메이션

```css
/* 페이드 인 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* 슬라이드 업 */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

/* 바운스 */
@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.bounce {
  animation: bounce 0.3s ease-in-out;
}
```

### 6.3 제스처

```typescript
// 스와이프 삭제
.swipeable-item {
  position: relative;
  touch-action: pan-y;
}

.swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--color-danger);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  transform: translateX(100%);
  transition: transform 0.3s;
}

.swipeable-item.swiped .swipe-actions {
  transform: translateX(0);
}

// 길게 누르기
.long-pressable {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.long-pressable:active {
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## 7. 접근성 가이드

### 7.1 색상 대비

```
모든 텍스트는 WCAG AAA 기준을 만족해야 함:
- 일반 텍스트: 7:1 이상
- 큰 텍스트 (24px 이상): 4.5:1 이상
- UI 컴포넌트: 3:1 이상
```

### 7.2 키보드 네비게이션

```typescript
// 포커스 스타일 (명확하게)
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

// 스킵 링크
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 10000;
}

.skip-link:focus {
  top: 0;
}
```

### 7.3 스크린 리더

```html
<!-- aria-label 사용 -->
<button aria-label="설정 메뉴 열기">
  <IconSettings />
</button>

<!-- 의미있는 대체 텍스트 -->
<img src="medicine.jpg" alt="아침에 복용할 혈압약 3알" />

<!-- 로딩 상태 안내 -->
<div role="status" aria-live="polite">
  <span className="sr-only">데이터를 불러오는 중입니다...</span>
  <Spinner />
</div>

<!-- 폼 레이블 연결 -->
<label htmlFor="phone">전화번호</label>
<input
  id="phone"
  type="tel"
  aria-describedby="phone-help"
/>
<span id="phone-help">'-' 없이 숫자만 입력하세요</span>
```

### 7.4 음성 지원

```typescript
// Web Speech API (음성 입력)
const startVoiceInput = () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    handleVoiceInput(transcript);
  };

  recognition.start();
};

// TTS (텍스트 읽어주기)
const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.9; // 조금 느리게
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
};
```

---

## 8. 반응형 가이드

### 8.1 브레이크포인트

```css
/* Mobile First */
/* xs: 0px ~ */
/* sm: 640px ~ */
@media (min-width: 640px) { }

/* md: 768px ~ */
@media (min-width: 768px) { }

/* lg: 1024px ~ */
@media (min-width: 1024px) { }

/* xl: 1280px ~ */
@media (min-width: 1280px) { }
```

### 8.2 반응형 텍스트

```css
.text-responsive-xl {
  font-size: 28px;
}

@media (min-width: 768px) {
  .text-responsive-xl {
    font-size: 32px;
  }
}

@media (min-width: 1024px) {
  .text-responsive-xl {
    font-size: 40px;
  }
}
```

### 8.3 모바일 vs 데스크톱

```typescript
// 모바일: 전체 화면 사용
.mobile-layout {
  padding: 16px;
}

// 데스크톱: 가운데 정렬
@media (min-width: 1024px) {
  .desktop-layout {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px;
  }
}
```

---

## 9. 다크모드 (미래 기능)

```css
/* 다크모드 변수 */
[data-theme='dark'] {
  --color-bg: #1F2937;
  --color-bg-secondary: #111827;
  --color-bg-card: #374151;

  --color-text-primary: #F9FAFB;
  --color-text-secondary: #E5E7EB;
  --color-text-tertiary: #9CA3AF;
}
```

---

**작성일**: 2025-01-24
**버전**: 1.0
**다음 단계**: 개발 착수
