# Frontend 상세 계획

## Agent 역할: FE Agent
- **담당**: UI/UX 구현, 컴포넌트 개발, 페이지 라우팅, 상태 관리
- **기술 스택**: Next.js (App Router), React, Tailwind CSS, TypeScript
- **참고 템플릿**: [Vercel AI Chatbot](https://vercel.com/templates/next.js/chatbot)

## 기술 스택 상세

| 항목 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | Next.js 14+ (App Router) | SSR/SSG 지원 |
| 언어 | TypeScript | 타입 안정성 |
| 스타일링 | Tailwind CSS | 유틸리티 퍼스트 |
| 상태 관리 | Zustand 또는 Jotai | 경량 상태 관리 |
| API 통신 | Axios 또는 fetch + SWR/TanStack Query | 서버 상태 캐싱 |
| 폼 관리 | React Hook Form + Zod | 유효성 검증 |
| UI 컴포넌트 | shadcn/ui | Radix 기반 |
| 실시간 통신 | AI SDK (Vercel) | 스트리밍 응답 |
| 차트 | Recharts | 감정 추적 시각화 |

## 디렉토리 구조

```
frontend/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 랜딩 페이지
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── chat/
│   │   ├── page.tsx            # 채팅 목록
│   │   └── [sessionId]/page.tsx # 채팅 상세
│   ├── diagnosis/
│   │   ├── page.tsx            # 진단 도구 목록
│   │   └── [testType]/page.tsx # 진단 실행
│   ├── community/
│   │   ├── page.tsx            # 게시판 목록
│   │   └── [postId]/page.tsx   # 게시글 상세
│   ├── meditation/
│   │   └── page.tsx            # 명상 콘텐츠
│   └── mypage/
│       └── page.tsx            # 마이페이지
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── chat/
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatSidebar.tsx
│   ├── diagnosis/
│   │   ├── TestCard.tsx
│   │   └── ResultChart.tsx
│   ├── community/
│   │   ├── PostCard.tsx
│   │   └── CommentSection.tsx
│   ├── meditation/
│   │   └── ContentCard.tsx
│   └── common/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── api.ts                  # API 클라이언트
│   ├── auth.ts                 # 인증 유틸
│   └── utils.ts                # 공통 유틸
├── stores/
│   ├── authStore.ts            # 인증 상태
│   └── chatStore.ts            # 채팅 상태
├── types/
│   └── index.ts                # 타입 정의
└── public/
    └── assets/                 # 정적 파일
```

## 주요 페이지 설계

### 1. 랜딩 페이지 (`/`)
- 서비스 소개, 주요 기능 안내
- CTA 버튼 (상담 시작하기)
- 간단한 감정 체크 위젯

### 2. AI 상담 채팅 (`/chat`)
- Vercel AI SDK 기반 스트리밍 응답
- 대화 세션 목록 (사이드바)
- 메시지 입력, 실시간 타이핑 표시
- 대화 내용 저장/불러오기

### 3. 자가 진단 (`/diagnosis`)
- PHQ-9 (우울증 선별), GAD-7 (불안 선별) 등 표준 도구
- 단계별 질문 UI (프로그레스 바)
- 결과 시각화 (차트 + LLM 해석)
- 이전 기록 비교

### 4. 커뮤니티 (`/community`)
- 카테고리별 게시판
- 익명/실명 선택 가능
- 공감 버튼, 댓글
- 신고 기능

### 5. 명상/이완 (`/meditation`)
- 카테고리: 가이드 명상, 호흡법, 이완 음악
- 오디오/비디오 플레이어
- 즐겨찾기

## FE Agent 개발 체크리스트

### Phase 1 (MVP)
- [ ] Next.js 프로젝트 초기화 (Vercel 챗봇 템플릿 기반)
- [ ] 기본 레이아웃 (Header, Sidebar, Footer)
- [ ] 채팅 UI 구현 (스트리밍 응답)
- [ ] Backend API 연동 설정

### Phase 2
- [ ] 인증 UI (로그인/회원가입)
- [ ] 자가 진단 UI
- [ ] 대화 히스토리 UI
- [ ] 마이페이지

### Phase 3
- [ ] 커뮤니티 게시판
- [ ] 명상 콘텐츠 페이지
- [ ] 감정 추적 대시보드

### Phase 4
- [ ] 반응형 최적화 (모바일 대응)
- [ ] PWA 지원
- [ ] 접근성 개선 (a11y)
