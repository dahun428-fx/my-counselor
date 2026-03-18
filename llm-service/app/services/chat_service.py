import json
from typing import AsyncIterator

from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    RiskLevel,
)
from app.services.llm_client import get_llm_client
from app.prompts.counselor_prompt import (
    COUNSELOR_SYSTEM_PROMPT,
    CRISIS_SUPPLEMENT,
    detect_crisis,
)
from app.utils.context_manager import ContextManager

CRISIS_RESOURCES = [
    "자살예방상담전화: 1393 (24시간)",
    "정신건강위기상담전화: 1577-0199 (24시간)",
    "생명의전화: 109",
]


class ChatService:
    def __init__(self):
        self.llm = get_llm_client()
        self.context_manager = ContextManager()

    def _build_messages(self, request: ChatRequest) -> tuple[list[dict], bool]:
        """시스템 프롬프트 + 사용자 메시지를 조합합니다."""
        # 위기 감지
        last_user_msg = ""
        for m in reversed(request.messages):
            if m.role == "user":
                last_user_msg = m.content
                break

        is_crisis = detect_crisis(last_user_msg)

        # 시스템 프롬프트 구성
        system_prompt = COUNSELOR_SYSTEM_PROMPT
        if is_crisis:
            system_prompt += "\n" + CRISIS_SUPPLEMENT

        # 사용자 컨텍스트 추가
        if request.user_context:
            ctx = request.user_context
            context_note = "\n\n## 사용자 컨텍스트\n"
            if ctx.emotion_history:
                context_note += f"- 최근 감정 이력: {', '.join(ctx.emotion_history)}\n"
            if ctx.previous_sessions_summary:
                context_note += (
                    f"- 이전 상담 요약: {ctx.previous_sessions_summary}\n"
                )
            system_prompt += context_note

        messages: list[dict] = [{"role": "system", "content": system_prompt}]

        # 대화 이력
        for m in request.messages:
            messages.append({"role": m.role.value, "content": m.content})

        return messages, is_crisis

    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        messages, is_crisis = self._build_messages(request)
        reply = await self.llm.generate(messages, temperature=0.7)

        # 컨텍스트 저장
        self.context_manager.save(request.session_id, request.messages)

        return ChatResponse(
            session_id=request.session_id,
            reply=reply,
            risk_level=RiskLevel.CRITICAL if is_crisis else RiskLevel.LOW,
            crisis_resources=CRISIS_RESOURCES if is_crisis else None,
        )

    async def generate_stream(self, request: ChatRequest) -> AsyncIterator[str]:
        messages, is_crisis = self._build_messages(request)

        # SSE: 위기 메타데이터를 먼저 전송
        if is_crisis:
            meta = {
                "type": "meta",
                "risk_level": "critical",
                "crisis_resources": CRISIS_RESOURCES,
            }
            yield f"data: {json.dumps(meta, ensure_ascii=False)}\n\n"

        # 본문 스트리밍
        async for chunk in self.llm.generate_stream(messages, temperature=0.7):
            payload = {"type": "content", "content": chunk}
            yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"

        yield "data: [DONE]\n\n"

        # 컨텍스트 저장
        self.context_manager.save(request.session_id, request.messages)
