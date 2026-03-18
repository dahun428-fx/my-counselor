# Agent 간 협업 워크플로우

## Agent 구성

| Agent | 담당 영역 | 기술 스택 | 작업 디렉토리 |
|-------|----------|----------|--------------|
| **FE Agent** | UI/UX, 페이지, 컴포넌트 | Next.js, React, TypeScript | `frontend/` |
| **BE Agent** | API, 인증, DB | Node.js, Express/Fastify, Prisma | `backend/` |
| **LLM Agent** | AI 모델, 프롬프트, 분석 | Python, FastAPI | `llm-service/` |

## 프로젝트 모노레포 구조

```
my-counselor/
├── docs/                    # 프로젝트 문서 (본 디렉토리)
├── frontend/                # FE Agent 작업 영역
├── backend/                 # BE Agent 작업 영역
├── llm-service/             # LLM Agent 작업 영역
├── docker-compose.yml       # 로컬 개발 환경
└── README.md
```

## Agent 간 통신 규약

### API 계약 (Contract)
각 Agent는 다음 원칙을 따른다:
1. **API 스펙을 먼저 합의** - 구현 전에 엔드포인트, 요청/응답 형식을 문서화
2. **변경 시 사전 공유** - API 변경 시 관련 Agent에 알리고 문서 업데이트
3. **독립 실행 가능** - 각 서버는 Mock 데이터로 단독 실행 가능해야 함

### 통신 흐름
```
FE Agent                BE Agent               LLM Agent
   │                       │                       │
   │  REST API 호출        │                       │
   │──────────────────────▶│                       │
   │                       │  내부 API 호출        │
   │                       │──────────────────────▶│
   │                       │                       │
   │                       │  LLM 응답 반환        │
   │                       │◀──────────────────────│
   │  응답 반환            │                       │
   │◀──────────────────────│                       │
```

## Agent별 작업 규칙

### FE Agent
- `frontend/` 디렉토리만 수정
- Backend API 호출 시 `lib/api.ts` 통해서만 접근
- 새 페이지/컴포넌트 추가 시 `02_frontend_plan.md` 업데이트
- UI 변경 사항은 스크린샷 또는 설명과 함께 기록

### BE Agent
- `backend/` 디렉토리만 수정
- API 엔드포인트 추가/변경 시 `03_backend_plan.md` 업데이트
- DB 스키마 변경 시 `01_architecture.md`의 스키마 섹션도 업데이트
- LLM 서버 호출은 `services/llm.service.ts` 통해서만

### LLM Agent
- `llm-service/` 디렉토리만 수정
- 프롬프트 변경 시 `04_llm_service_plan.md` 업데이트
- 새 엔드포인트 추가 시 BE Agent에 알림
- 모델/프롬프트 변경 이력 기록

## 개발 진행 방식

### 1. 기능 단위 개발
```
1. 기능 요구사항 확인
2. API 스펙 정의 (BE + LLM Agent 합의)
3. 병렬 개발:
   - FE Agent: UI 구현 (Mock 데이터 사용)
   - BE Agent: API 구현
   - LLM Agent: AI 기능 구현
4. 통합 테스트
5. 문서 업데이트
```

### 2. 문서 최신화 규칙
- 작업 완료 시 해당 `.md` 파일의 체크리스트 업데이트 (`[ ]` → `[x]`)
- API 변경 시 관련 문서 즉시 반영
- 새로운 결정 사항은 해당 문서에 기록

### 3. 로컬 개발 환경
```yaml
# docker-compose.yml (예정)
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
  backend:
    build: ./backend
    ports: ["4000:4000"]
    depends_on: [postgres, redis]
  llm-service:
    build: ./llm-service
    ports: ["8000:8000"]
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
```

## 현재 진행 상황

| Phase | 상태 | 비고 |
|-------|------|------|
| Phase 1 (MVP) | 준비 중 | 문서화 완료, 구현 시작 예정 |
| Phase 2 | 대기 | - |
| Phase 3 | 대기 | - |
| Phase 4 | 대기 | - |
