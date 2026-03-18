# 아키텍처 설계

## 3-Tier 서버 분리 구조

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Backend   │────▶│ LLM Service │
│   (Next.js)  │◀────│  (Node.js)  │◀────│  (FastAPI)  │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │           │
               ┌────▼───┐ ┌───▼────┐
               │PostgreSQL│ │ Redis  │
               └─────────┘ └────────┘
```

## 서버별 역할

### 1. Frontend Server (Next.js)
- **포트**: 3000
- **역할**: UI 렌더링, 라우팅, 클라이언트 상태 관리
- **통신**: Backend API 호출 (REST/GraphQL)
- **주요 페이지**:
  - `/` - 랜딩 페이지
  - `/chat` - AI 상담 챗봇
  - `/diagnosis` - 자가 진단 도구
  - `/community` - 커뮤니티 게시판
  - `/meditation` - 명상/이완 콘텐츠
  - `/mypage` - 마이페이지 (상담 기록, 감정 추적)

### 2. Backend Server (Node.js)
- **포트**: 4000
- **역할**: 비즈니스 로직, 인증/인가, 데이터 CRUD
- **통신**: Frontend ↔ Backend (REST API), Backend ↔ LLM (내부 API)
- **주요 API 그룹**:
  - `/api/auth` - 인증 (회원가입, 로그인, OAuth)
  - `/api/chat` - 대화 세션 관리
  - `/api/diagnosis` - 자가 진단 결과 저장/조회
  - `/api/community` - 게시글 CRUD
  - `/api/meditation` - 콘텐츠 관리
  - `/api/user` - 사용자 프로필, 감정 추적

### 3. LLM Server (FastAPI)
- **포트**: 8000
- **역할**: AI 모델 호출, 프롬프트 엔지니어링, 대화 컨텍스트 관리
- **통신**: Backend에서만 호출 (외부 직접 접근 불가)
- **주요 엔드포인트**:
  - `/llm/chat` - 상담 대화 생성
  - `/llm/analyze` - 감정 분석
  - `/llm/summarize` - 대화 요약
  - `/llm/diagnosis` - 진단 결과 해석

## 데이터 흐름

### 챗봇 대화 흐름
```
User → FE(Next.js) → BE(/api/chat) → LLM(/llm/chat) → OpenAI/Claude API
                                                              │
User ← FE(렌더링)  ← BE(저장+응답) ← LLM(후처리)    ←────────┘
```

### 자가 진단 흐름
```
User → FE(테스트 UI) → BE(/api/diagnosis) → DB 저장
                                    │
                              LLM(/llm/diagnosis) → 결과 해석
                                    │
User ← FE(결과 렌더링) ← BE(결과 반환) ←┘
```

## 데이터베이스 스키마 (초안)

### users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| email | VARCHAR | 이메일 |
| password_hash | VARCHAR | 암호화된 비밀번호 |
| nickname | VARCHAR | 닉네임 |
| created_at | TIMESTAMP | 생성일 |

### chat_sessions
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| title | VARCHAR | 세션 제목 |
| created_at | TIMESTAMP | 생성일 |

### chat_messages
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| session_id | UUID | FK → chat_sessions |
| role | VARCHAR | user / assistant |
| content | TEXT | 메시지 내용 |
| emotion_tag | VARCHAR | 감정 태그 (선택) |
| created_at | TIMESTAMP | 생성일 |

### diagnosis_results
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| test_type | VARCHAR | 테스트 종류 (PHQ-9, GAD-7 등) |
| score | INTEGER | 점수 |
| interpretation | TEXT | LLM 해석 결과 |
| created_at | TIMESTAMP | 생성일 |

### community_posts
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| title | VARCHAR | 제목 |
| content | TEXT | 내용 |
| is_anonymous | BOOLEAN | 익명 여부 |
| category | VARCHAR | 카테고리 |
| created_at | TIMESTAMP | 생성일 |

## 보안 고려사항
- LLM 서버는 Backend를 통해서만 접근 (외부 노출 금지)
- 사용자 상담 데이터 암호화 저장
- 개인정보 최소 수집 원칙
- JWT 기반 인증, Refresh Token은 Redis 관리
