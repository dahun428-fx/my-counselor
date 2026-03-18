# My Counselor - 프로젝트 개요

## 프로젝트 비전
AI 기반 심리상담 웹 애플리케이션으로, 사용자가 언제 어디서든 심리적 지원을 받을 수 있는 플랫폼을 구축한다.

## 핵심 기능
1. **AI 챗봇 대화형 상담** - LLM 기반 심리상담 챗봇
2. **자가 진단 도구** - 심리 테스트, 감정 일기, 감정 추적
3. **커뮤니티** - 익명 고민 공유, 공감/댓글
4. **명상/이완 콘텐츠** - 가이드 명상, 호흡법, 이완 음악

## 플랫폼
- **1차**: Next.js 기반 웹 애플리케이션 (Vercel 챗봇 템플릿 활용)
- **향후**: 모바일 앱 (React Native 등)

## 아키텍처 개요
3-Tier 서버 분리 구조:
- **Frontend Server** - Next.js (React) 기반 UI
- **Backend Server** - API 서버, 인증, 데이터 관리
- **LLM Server** - AI 모델 서빙, 프롬프트 관리, 대화 엔진

## 기술 스택 요약
| 영역 | 기술 |
|------|------|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Node.js (Express 또는 Fastify) |
| LLM Service | Python (FastAPI), OpenAI API / Claude API |
| Database | PostgreSQL, Redis (캐시/세션) |
| 인프라 | Vercel (FE), Docker, AWS/GCP |

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
