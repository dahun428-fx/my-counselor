# 개발 단계별 로드맵

> 최종 업데이트: 2026-03-18 (v2 요구사항 반영)

## Phase 1-init - 프로젝트 초기화 [완료]

### 목표
3개 서버 프로젝트 초기화 및 기본 통신 확인

### 완료 항목
- [x] Next.js 프로젝트 초기화 (App Router, TypeScript, Tailwind, shadcn/ui)
- [x] Express + Prisma 프로젝트 초기화
- [x] FastAPI 프로젝트 초기화
- [x] Docker Compose 환경 구성 (PostgreSQL, Redis, 3개 서버)
- [x] FE → BE → LLM 통신 연동 확인
- [x] LLM Mock 모드 구현

### 산출물
- 3개 서버 Docker 환경에서 동작 확인 완료
- E2E 테스트 성공 (세션 생성 → 메시지 전송 → LLM 응답)

---

## Phase 1-A - 인증 시스템 [다음]

### 목표
회원가입/로그인 구현, 인증 기반 메인 플로우 확립

### FE Agent 작업
- [ ] 로그인 페이지 (`/login`)
- [ ] 회원가입 페이지 (`/register`)
- [ ] 인증 상태 관리 (authStore - JWT 토큰)
- [ ] 라우트 가드 (미인증 → `/login` 리다이렉트)
- [ ] 메인 페이지(`/`)를 AI 챗봇으로 변경 (랜딩 제거)
- [ ] Header 업데이트 (로그인 상태 반영, 로그아웃)

### BE Agent 작업
- [ ] bcrypt 비밀번호 암호화
- [ ] 회원가입 API (`POST /api/auth/register`)
- [ ] 로그인 API (`POST /api/auth/login`) - JWT 발급
- [ ] 로그아웃 API (`POST /api/auth/logout`)
- [ ] 토큰 갱신 API (`POST /api/auth/refresh`)
- [ ] 인증 미들웨어 (JWT 검증)
- [ ] 채팅 API에 인증 적용 (userId 연결)

### LLM Agent 작업
- [ ] (이 Phase에서는 변경 없음)

### 산출물
- 회원가입 → 로그인 → 챗봇 접속 플로우 동작
- 미인증 사용자 접근 차단

---

## Phase 1-B - 챗봇 고도화 (상태 체크 + 콘텐츠 추천)

### 목표
매일 첫 접속 시 상태 체크, AI 맞춤 첫 대화, 콘텐츠 추천

### FE Agent 작업
- [ ] 오늘의 상태 체크 UI (감정/수면/스트레스 선택 카드)
- [ ] 하루 1회 체크 로직 (이미 했으면 스킵)
- [ ] 콘텐츠 추천 카드 UI (YouTube 썸네일, 도서 카드)
- [ ] 채팅 메시지 내 카드 렌더링 (일반 텍스트 + 추천 카드 혼합)
- [ ] 채팅 사이드바 (세션 목록, 세션 전환)

### BE Agent 작업
- [ ] Daily Check-in API (`POST /api/checkin`, `GET /api/checkin/today`)
- [ ] Check-in DB 모델 (DailyCheckin: userId, mood, sleep, stress, date)
- [ ] 채팅 메시지 전송 시 오늘의 상태 데이터를 LLM에 함께 전달
- [ ] 감정 추적 데이터 조회 API (`GET /api/user/emotions`)

### LLM Agent 작업
- [ ] 상태 체크 기반 첫 대화 프롬프트 설계
  - 감정별 공감 시작 메시지 분기
  - 수면/스트레스 정보를 대화 컨텍스트에 반영
- [ ] 콘텐츠 추천 프롬프트 설계
  - 대화 맥락 기반 추천 시점 판단
  - 구조화된 추천 응답 포맷 (JSON)
  - YouTube 영상, 도서, 명상 가이드 추천 로직
- [ ] 추천 응답 스키마 정의
  ```json
  {
    "reply": "대화 응답 텍스트",
    "recommendations": [
      {
        "type": "youtube",
        "title": "불안할 때 듣는 명상 음악",
        "url": "https://youtube.com/...",
        "thumbnail": "https://img.youtube.com/..."
      },
      {
        "type": "book",
        "title": "마음의 치유",
        "author": "저자명",
        "description": "한줄 소개"
      }
    ]
  }
  ```

### 산출물
- 로그인 → 상태 체크 → 맞춤 AI 대화 → 콘텐츠 추천 전체 플로우
- 감정 추적 데이터 축적 시작

---

## Phase 2 - 부가 서비스

### 목표
자가 진단, 커뮤니티, 명상 콘텐츠 등 부가 기능 추가

### FE Agent 작업
- [ ] 자가 진단 UI (PHQ-9, GAD-7 단계별 질문 + 결과 차트)
- [ ] 커뮤니티 게시판 UI (목록, 상세, 작성, 익명, 공감/댓글)
- [ ] 명상/이완 콘텐츠 페이지 (카테고리, 플레이어)
- [ ] 마이페이지 (프로필, 감정 추적 대시보드)

### BE Agent 작업
- [ ] 자가 진단 API (질문지 관리, 결과 저장/조회)
- [ ] 커뮤니티 API (게시글 CRUD, 댓글, 공감, 신고)
- [ ] 명상 콘텐츠 API (콘텐츠 관리, 즐겨찾기)
- [ ] 사용자 프로필 API

### LLM Agent 작업
- [ ] 진단 결과 해석 기능
- [ ] 대화 요약 기능
- [ ] 토큰 사용량 최적화

### 산출물
- 풀 기능 웹 애플리케이션
- 자가 진단 + 커뮤니티 + 명상 콘텐츠

---

## Phase 3 - 고도화

### 목표
성능 최적화, 모바일 대응, 데이터 분석, 소셜 로그인

### FE Agent 작업
- [ ] 반응형 완전 최적화 (모바일 퍼스트)
- [ ] PWA 지원 (오프라인, 푸시 알림)
- [ ] 접근성 개선 (WCAG 2.1)
- [ ] 성능 최적화 (Core Web Vitals)

### BE Agent 작업
- [ ] 소셜 로그인 (Google, Kakao)
- [ ] API Rate Limiting
- [ ] 로깅/모니터링 (APM)
- [ ] 데이터 분석 대시보드 (관리자)
- [ ] 백업/복구 전략

### LLM Agent 작업
- [ ] RAG 도입 (심리학 지식 베이스)
- [ ] 사용자 히스토리 기반 맞춤 응답
- [ ] 모델 성능 모니터링
- [ ] 비용 최적화

### 산출물
- 프로덕션 레디 서비스
- 모바일 앱 전환 준비 완료
