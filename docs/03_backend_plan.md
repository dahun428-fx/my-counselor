# Backend 상세 계획

## Agent 역할: BE Agent
- **담당**: API 설계/구현, 인증/인가, 데이터베이스 관리, LLM 서버 연동
- **기술 스택**: Node.js, Express 또는 Fastify, TypeScript, PostgreSQL, Redis

## 기술 스택 상세

| 항목 | 기술 | 비고 |
|------|------|------|
| 런타임 | Node.js 20+ | LTS |
| 프레임워크 | Express 또는 Fastify | Fastify 권장 (성능) |
| 언어 | TypeScript | 타입 안정성 |
| ORM | Prisma | 타입세이프 DB 접근 |
| 인증 | JWT + Refresh Token | Redis에 토큰 저장 |
| 유효성 검증 | Zod | 스키마 기반 검증 |
| 로깅 | Pino | 구조화된 로깅 |
| 테스트 | Vitest + Supertest | 단위/통합 테스트 |
| API 문서 | Swagger (OpenAPI) | 자동 문서화 |

## 디렉토리 구조

```
backend/
├── src/
│   ├── app.ts                    # 앱 진입점
│   ├── server.ts                 # 서버 시작
│   ├── config/
│   │   ├── database.ts           # DB 설정
│   │   ├── redis.ts              # Redis 설정
│   │   └── env.ts                # 환경 변수
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── diagnosis.routes.ts
│   │   ├── community.routes.ts
│   │   ├── meditation.routes.ts
│   │   └── user.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── diagnosis.controller.ts
│   │   ├── community.controller.ts
│   │   ├── meditation.controller.ts
│   │   └── user.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── chat.service.ts
│   │   ├── diagnosis.service.ts
│   │   ├── community.service.ts
│   │   ├── llm.service.ts        # LLM 서버 통신
│   │   └── user.service.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT 검증
│   │   ├── error.middleware.ts    # 에러 핸들링
│   │   └── validate.middleware.ts # 요청 검증
│   ├── models/
│   │   └── schema.prisma         # Prisma 스키마
│   └── types/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   └── integration/
└── package.json
```

## API 설계

### 인증 API (`/api/auth`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| POST | `/api/auth/refresh` | 토큰 갱신 |
| POST | `/api/auth/oauth/:provider` | 소셜 로그인 |

### 채팅 API (`/api/chat`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/chat/sessions` | 세션 목록 조회 |
| POST | `/api/chat/sessions` | 새 세션 생성 |
| GET | `/api/chat/sessions/:id` | 세션 상세 (메시지 포함) |
| POST | `/api/chat/sessions/:id/messages` | 메시지 전송 (→ LLM 호출) |
| DELETE | `/api/chat/sessions/:id` | 세션 삭제 |

### 자가 진단 API (`/api/diagnosis`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/diagnosis/tests` | 진단 도구 목록 |
| GET | `/api/diagnosis/tests/:type` | 특정 진단 질문지 |
| POST | `/api/diagnosis/results` | 결과 제출 및 분석 요청 |
| GET | `/api/diagnosis/results` | 내 결과 목록 |
| GET | `/api/diagnosis/results/:id` | 결과 상세 |

### 커뮤니티 API (`/api/community`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/community/posts` | 게시글 목록 (페이지네이션) |
| POST | `/api/community/posts` | 게시글 작성 |
| GET | `/api/community/posts/:id` | 게시글 상세 |
| PUT | `/api/community/posts/:id` | 게시글 수정 |
| DELETE | `/api/community/posts/:id` | 게시글 삭제 |
| POST | `/api/community/posts/:id/comments` | 댓글 작성 |
| POST | `/api/community/posts/:id/empathy` | 공감 |
| POST | `/api/community/posts/:id/report` | 신고 |

### 명상 콘텐츠 API (`/api/meditation`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/meditation/contents` | 콘텐츠 목록 |
| GET | `/api/meditation/contents/:id` | 콘텐츠 상세 |
| POST | `/api/meditation/favorites/:id` | 즐겨찾기 추가 |
| DELETE | `/api/meditation/favorites/:id` | 즐겨찾기 삭제 |

### 사용자 API (`/api/user`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/user/profile` | 프로필 조회 |
| PUT | `/api/user/profile` | 프로필 수정 |
| GET | `/api/user/emotions` | 감정 추적 기록 |
| POST | `/api/user/emotions` | 감정 기록 추가 |

## BE Agent 개발 체크리스트

### Phase 1 (MVP)
- [ ] 프로젝트 초기화 (TypeScript, Prisma, Express/Fastify)
- [ ] DB 스키마 설계 및 마이그레이션
- [ ] 채팅 API 구현 (세션 생성, 메시지 전송)
- [ ] LLM 서버 통신 모듈 구현

### Phase 2
- [ ] 인증 시스템 (JWT, OAuth)
- [ ] 자가 진단 API
- [ ] 대화 히스토리 저장/조회

### Phase 3
- [ ] 커뮤니티 API
- [ ] 명상 콘텐츠 API
- [ ] 감정 추적 API

### Phase 4
- [ ] API Rate Limiting
- [ ] 로깅/모니터링
- [ ] 성능 최적화
