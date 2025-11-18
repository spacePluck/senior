# VIP Care - 개발 가이드

## 📋 개발 진행 상태 체크 및 커밋 가이드

### 진행 상태 체크 방법

각 마일스톤 완료 시 다음 형식으로 상태를 체크합니다:

```
✅ Phase X 완료 항목
- ✅ 기능 A
- ✅ 기능 B
- ✅ 기능 C

📊 현재 상태
- ✅ Service Layer: X개 메서드 구현
- ✅ Hooks: X개 구현
- ✅ UI Components: X개 구현
- ✅ Pages: X개 구현

⏳ 다음 단계
- 기능 D
- 기능 E
```

---

## 🎯 마일스톤 커밋 가이드

### 1. 마일스톤 정의

각 Phase를 작은 마일스톤으로 나눕니다:

#### Phase 1: MVP (기본 기능)
```
Milestone 1.1: 인프라 구축 ✅
- Supabase 설정
- Database schema
- Service Layer 구조
- UI Components

Milestone 1.2: 복약 관리 ✅
- 약 목록/등록/상세
- 복약 알림
- 재고 관리

Milestone 1.3: 건강 기록 ✅
- 건강 기록 대시보드
- 혈압 측정 및 기록

Milestone 1.4: AI 어시스턴트 ⏳
- OpenAI GPT-4 통합
- 건강 상담 챗봇
- 주간 리포트

Milestone 1.5: SOS 및 가족 모니터링 ⏳
- SOS 긴급 호출
- 가족 모니터링
```

#### Phase 2: 서비스 통합
```
Milestone 2.1: 병원 예약
Milestone 2.2: 홈케어 (바야다)
Milestone 2.3: 택시 연동 (카카오)
Milestone 2.4: 식사 서비스
```

#### Phase 3: AI 및 글로벌
```
Milestone 3.1: AI 재활 (EverEx)
Milestone 3.2: 다국어 지원
Milestone 3.3: 글로벌 출시
```

---

### 2. 커밋 메시지 템플릿 (한국어)

```bash
git commit -m "$(cat <<'EOF'
✅ [마일스톤 X.X]: [기능명]

## 완료된 작업
- ✅ [작업 1]
- ✅ [작업 2]
- ✅ [작업 3]

## 구현 내역
### Service Layer
- [Service명]: X개 메서드

### Hooks
- [Hook명]: 기능 설명

### UI Components
- [Component명]: 기능 설명

### Pages
- [Page 경로]: 기능 설명

## 기술 스택
- [사용된 기술 1]
- [사용된 기술 2]

## 테스트
- ✅ [테스트 항목 1]
- ✅ [테스트 항목 2]

## 다음 단계
- ⏳ [다음 작업 1]
- ⏳ [다음 작업 2]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### 3. 실제 커밋 예시

#### ✅ Milestone 1.1-1.3 (완료)
```bash
git commit -m "✅ Phase 1 핵심 기능: 복약 관리 및 건강 기록

## 완료된 작업
- ✅ Supabase 설정 및 DB 스키마
- ✅ Service Layer 아키텍처
- ✅ 복약 관리 완전 구현
- ✅ 건강 기록 (혈압) 구현

## 구현 내역
- Service Layer: 32개 메서드
- Hooks: 3개
- UI Components: 4개
- Pages: 5개

## 다음 단계
- ⏳ AI 건강 어시스턴트
- ⏳ SOS 긴급 호출

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

#### ⏳ Milestone 1.4 (다음 작업 예정)
```bash
git commit -m "✅ Phase 1: AI 건강 어시스턴트 통합

## 완료된 작업
- ✅ OpenAI GPT-4 통합
- ✅ 건강 상담 챗봇
- ✅ 주간 건강 리포트 생성
- ✅ 약 복용 리마인더 AI

## 구현 내역
### Service Layer
- AIService: 5개 메서드 추가

### Hooks
- useAIAssistant: 채팅, 리포트 생성

### Pages
- app/[locale]/ai/chat: AI 상담 페이지

## API 사용량
- 예상 월 비용: ~$50 (500명 사용자 기준)

## 다음 단계
- ⏳ SOS 긴급 호출
- ⏳ 가족 모니터링

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🔄 일일 개발 워크플로우

### 1. 개발 시작
```bash
# 1. 최신 코드 pull
git pull origin main

# 2. Feature branch 생성 (선택사항)
git checkout -b feature/ai-assistant

# 3. 개발 서버 실행
npm run dev
```

### 2. 개발 중 (한국어 커밋)
```bash
# 작은 단위로 자주 커밋
git add .
git commit -m "feat: OpenAI 통합 추가"
git commit -m "feat: AI 채팅 인터페이스 생성"
git commit -m "fix: API 속도 제한 처리"
git commit -m "style: 코드 포맷팅 정리"
```

### 3. 마일스톤 완료 시
```bash
# 1. 모든 변경사항 확인
git status
git diff

# 2. 마일스톤 커밋 (위 템플릿 사용)
git add .
git commit -m "✅ Phase 1: AI 건강 어시스턴트 통합..."

# 3. Push (필요시)
git push origin main
```

---

## 📊 진행 상태 추적

### Progress Tracker (매 마일스톤 업데이트)

```markdown
# VIP Care - 진행 상황

## Phase 1: MVP (기본 기능) - 진행률: 60%
- ✅ Milestone 1.1: 인프라 구축
- ✅ Milestone 1.2: 복약 관리
- ✅ Milestone 1.3: 건강 기록
- ⏳ Milestone 1.4: AI 어시스턴트 (진행 중)
- ⏳ Milestone 1.5: SOS 및 가족 모니터링

## Phase 2: 서비스 통합 - 진행률: 0%
- ⏳ Milestone 2.1: 병원 예약
- ⏳ Milestone 2.2: 홈케어
- ⏳ Milestone 2.3: 택시 연동
- ⏳ Milestone 2.4: 식사 서비스

## Phase 3: AI 및 글로벌 - 진행률: 0%
- ⏳ Milestone 3.1: AI 재활
- ⏳ Milestone 3.2: 다국어 지원
- ⏳ Milestone 3.3: 글로벌 출시
```

---

## 🎯 체크리스트 템플릿

각 마일스톤 완료 전 체크:

```markdown
## 커밋 전 체크리스트

### 코드 품질
- [ ] 모든 파일에 적절한 주석
- [ ] 타입 에러 없음 (TypeScript)
- [ ] ESLint 경고 없음
- [ ] 불필요한 console.log 제거

### 기능 테스트
- [ ] 주요 기능 동작 확인
- [ ] 에러 핸들링 확인
- [ ] 로딩 상태 확인
- [ ] 엣지 케이스 테스트

### 문서화
- [ ] README.md 업데이트 (필요시)
- [ ] ARCHITECTURE.md 업데이트 (필요시)
- [ ] 주요 변경사항 기록

### 커밋
- [ ] 명확한 커밋 메시지 (한국어)
- [ ] 진행 상태 체크 포함
- [ ] 다음 단계 명시
```

---

## 📝 커밋 컨벤션 (한국어)

### Commit Type
```
✅        - 마일스톤 완료
feat:     - 새 기능 추가
fix:      - 버그 수정
docs:     - 문서 변경
style:    - 코드 포맷팅
refactor: - 리팩토링
test:     - 테스트 추가
chore:    - 빌드/설정 변경
```

### 예시
```bash
git commit -m "feat: 약 재고 관리 기능 추가"
git commit -m "fix: 날짜 포맷팅 오류 해결"
git commit -m "docs: API 문서 업데이트"
git commit -m "refactor: Service Layer 로직 분리"
git commit -m "test: 복약 관리 테스트 추가"
git commit -m "✅ Phase 1: 복약 관리 완료"
```

---

## 🚀 릴리스 프로세스

### 버전 관리
```
v0.1.0 - Phase 1 MVP (현재)
v0.2.0 - Phase 2 서비스 통합
v0.3.0 - Phase 3 AI 및 글로벌
v1.0.0 - 프로덕션 배포
```

### 릴리스 커밋
```bash
# 버전 업데이트
npm version minor  # v0.1.0 → v0.2.0

# 릴리스 태그
git tag -a v0.1.0 -m "릴리스 v0.1.0: Phase 1 MVP 완료"
git push origin v0.1.0
```

---

## 📈 개발 속도 추적

```markdown
## 개발 속도

### 1주차 (완료)
- 인프라 구축
- Service Layer 아키텍처
- UI 컴포넌트 라이브러리

### 2주차 (완료)
- 복약 관리
- 건강 기록
- 데이터베이스 스키마

### 3주차 (예정)
- AI 건강 어시스턴트
- SOS 기능
- 가족 모니터링

### 4주차 (예정)
- 테스트 및 버그 수정
- Phase 1 완료
```

---

## 📌 커밋 메시지 작성 팁

### 좋은 예시 ✅
```bash
git commit -m "feat: 혈압 정상 범위 자동 체크 기능 추가"
git commit -m "fix: 복약 알림 시간 오류 수정"
git commit -m "refactor: 건강 기록 Service 로직 분리"
```

### 나쁜 예시 ❌
```bash
git commit -m "수정"
git commit -m "bug fix"
git commit -m "작업중"
```

### 커밋 메시지 구조
```
[타입]: [간결한 설명] (50자 이내)

[상세 설명] (선택사항, 72자 이내로 줄바꿈)

[관련 이슈] (선택사항)
```

---

이 가이드를 따라 체계적으로 개발을 진행하고 커밋하세요!
