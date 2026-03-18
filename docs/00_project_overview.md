# My Counselor - 프로젝트 개요

## 프로젝트 비전
> **"매일 찾아오는 나만의 심리상담사"**

AI 기반 심리상담 웹 애플리케이션으로, 사용자가 매일 편하게 찾아와 AI 챗봇과 심리상담을 하고, 대화 맥락에 맞는 콘텐츠(영상, 도서 등)를 추천받는 서비스.

## 서비스 핵심
- **메인**: AI 챗봇 심리상담 (로그인 후 첫 화면)
- **부가**: 자가 진단, 커뮤니티, 명상/이완 콘텐츠

## 메인 플로우
```
회원가입/로그인 → 오늘의 상태 체크 → AI 맞춤 상담 → 콘텐츠 추천
```

## 핵심 기능
1. **회원가입/로그인** - 이메일+비밀번호 (bcrypt 암호화, JWT 인증)
2. **오늘의 상태 체크** - 매일 첫 접속 시 감정/수면/스트레스 체크 (템플릿)
3. **AI 챗봇 대화형 상담** - 상태 기반 맞춤 첫 대화, 공감 중심 상담
4. **콘텐츠 추천 (멀티모달)** - YouTube 영상, 도서, 명상 가이드 추천 (카드 UI)
5. **자가 진단 도구** - PHQ-9, GAD-7 등 표준 심리 검사
6. **커뮤니티** - 익명 고민 공유, 공감/댓글
7. **명상/이완 콘텐츠** - 가이드 명상, 호흡법, 이완 음악

## 플랫폼
- **1차**: Next.js 기반 웹 애플리케이션
- **향후**: 모바일 앱 (React Native 등)

## 아키텍처 개요
3-Tier 서버 분리 구조:
- **Frontend Server** - Next.js (React) 기반 UI
- **Backend Server** - API 서버, 인증, 데이터 관리
- **LLM Server** - AI 모델 서빙, 프롬프트 관리, 대화 엔진

## 기술 스택 요약
| 영역 | 기술 |
|------|------|
| Frontend | Next.js, React, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, Prisma, TypeScript |
| LLM Service | Python, FastAPI, OpenAI API / Claude API |
| Database | PostgreSQL, Redis (캐시/세션/Refresh Token) |
| 인프라 | Docker Compose, Vercel (FE), AWS/GCP |

## 문서 구조
| 파일 | 설명 |
|------|------|
| `00_project_overview.md` | 전체 프로젝트 개요 (본 문서) |
| `01_architecture.md` | 3-Tier 아키텍처 상세 설계 |
| `02_frontend_plan.md` | Frontend 상세 계획 및 Agent 역할 |
| `03_backend_plan.md` | Backend 상세 계획 및 Agent 역할 |
| `04_llm_service_plan.md` | LLM Service 상세 계획 및 Agent 역할 |
| `05_development_phases.md` | 단계별 개발 로드맵 |
| `06_agent_workflow.md` | Agent 간 협업 워크플로우 |
| `07_requirements_v2.md` | 요구사항 정의서 v2 (사용자 플로우, 기능 상세) |

## 현재 진행 상황
| Phase | 상태 |
|-------|------|
| Phase 1-init (프로젝트 초기화) | 완료 |
| Phase 1-A (인증 시스템) | 다음 |
| Phase 1-B (챗봇 고도화) | 대기 |
| Phase 2 (부가 서비스) | 대기 |
| Phase 3 (고도화) | 대기 |
