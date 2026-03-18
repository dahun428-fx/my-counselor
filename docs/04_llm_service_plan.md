# LLM Service 상세 계획

## Agent 역할: LLM Agent
- **담당**: AI 모델 호출, 프롬프트 엔지니어링, 대화 컨텍스트 관리, 감정 분석
- **기술 스택**: Python, FastAPI, OpenAI API / Claude API

## 기술 스택 상세

| 항목 | 기술 | 비고 |
|------|------|------|
| 언어 | Python 3.11+ | AI/ML 생태계 |
| 프레임워크 | FastAPI | 비동기, 고성능 |
| AI API | OpenAI API / Anthropic Claude API | 상담 특화 프롬프트 |
| 벡터 DB | Pinecone 또는 ChromaDB | RAG 구현 (선택) |
| 캐싱 | Redis | 응답 캐싱, 세션 관리 |
| 테스트 | pytest | 단위/통합 테스트 |
| 패키지 관리 | Poetry 또는 uv | 의존성 관리 |

## 디렉토리 구조

```
llm-service/
├── app/
│   ├── main.py                   # FastAPI 앱 진입점
│   ├── config.py                 # 설정 관리
│   ├── routers/
│   │   ├── chat.py               # 상담 대화 라우터
│   │   ├── analyze.py            # 감정 분석 라우터
│   │   ├── summarize.py          # 대화 요약 라우터
│   │   └── diagnosis.py          # 진단 해석 라우터
│   ├── services/
│   │   ├── llm_client.py         # LLM API 클라이언트 (OpenAI/Claude)
│   │   ├── chat_service.py       # 상담 대화 서비스
│   │   ├── emotion_service.py    # 감정 분석 서비스
│   │   ├── summary_service.py    # 요약 서비스
│   │   └── diagnosis_service.py  # 진단 해석 서비스
│   ├── prompts/
│   │   ├── system_prompts.py     # 시스템 프롬프트 관리
│   │   ├── counselor_prompt.py   # 상담사 역할 프롬프트
│   │   ├── emotion_prompt.py     # 감정 분석 프롬프트
│   │   └── diagnosis_prompt.py   # 진단 해석 프롬프트
│   ├── models/
│   │   ├── schemas.py            # Pydantic 스키마
│   │   └── enums.py              # 열거형
│   └── utils/
│       ├── token_counter.py      # 토큰 관리
│       └── context_manager.py    # 대화 컨텍스트 관리
├── tests/
│   ├── test_chat.py
│   └── test_emotion.py
├── pyproject.toml
└── Dockerfile
```

## API 설계

### 상담 대화 (`/llm/chat`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/llm/chat` | 상담 대화 응답 생성 |
| POST | `/llm/chat/stream` | 스트리밍 응답 생성 |

**요청 예시**:
```json
{
  "session_id": "uuid",
  "messages": [
    {"role": "user", "content": "요즘 너무 불안해요..."}
  ],
  "user_context": {
    "emotion_history": ["불안", "우울"],
    "previous_sessions_summary": "..."
  }
}
```

### 감정 분석 (`/llm/analyze`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/llm/analyze/emotion` | 메시지 감정 분석 |
| POST | `/llm/analyze/risk` | 위험 수준 평가 |

**요청 예시**:
```json
{
  "message": "살고 싶지 않아요...",
  "context": []
}
```

**응답 예시**:
```json
{
  "emotions": ["절망", "우울"],
  "risk_level": "high",
  "action": "crisis_intervention",
  "suggested_resources": ["자살예방상담전화 1393"]
}
```

### 대화 요약 (`/llm/summarize`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/llm/summarize` | 대화 내용 요약 |

### 진단 해석 (`/llm/diagnosis`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/llm/diagnosis/interpret` | 진단 결과 해석 |

## 프롬프트 설계 방향

### 상담사 시스템 프롬프트 핵심 원칙
1. **공감 우선** - 사용자의 감정을 먼저 인정하고 공감
2. **비지시적 상담** - 해결책을 직접 제시하기보다 스스로 탐색하도록 유도
3. **안전 경계** - 위기 상황 감지 시 전문 기관 안내 (필수)
4. **윤리 준수** - 의료 진단 불가, 전문 상담 대체 불가 면책 고지
5. **대화 흐름 유지** - 자연스러운 대화, 적절한 질문

### 위기 대응 프로토콜
- 자해/자살 관련 키워드 감지
- 즉시 위기 상담 전화번호 안내 (1393, 109)
- 대화 톤을 위기 개입 모드로 전환
- 관리자 알림 (선택)

## LLM Agent 개발 체크리스트

### Phase 1 (MVP)
- [ ] FastAPI 프로젝트 초기화
- [ ] LLM 클라이언트 구현 (OpenAI/Claude API 연동)
- [ ] 상담사 시스템 프롬프트 설계
- [ ] 기본 채팅 엔드포인트 구현 (+ 스트리밍)
- [ ] 위기 감지 기본 로직

### Phase 2
- [ ] 감정 분석 기능
- [ ] 대화 컨텍스트 관리 (이전 대화 요약 포함)
- [ ] 진단 결과 해석 기능

### Phase 3
- [ ] 대화 요약 기능
- [ ] 토큰 사용량 최적화
- [ ] 프롬프트 A/B 테스트 프레임워크

### Phase 4
- [ ] RAG 도입 (심리학 지식 베이스)
- [ ] 맞춤형 응답 개선 (사용자 히스토리 기반)
- [ ] 모델 성능 모니터링
