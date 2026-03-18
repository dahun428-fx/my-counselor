"""대화 컨텍스트 관리

Phase 1에서는 인메모리 저장소를 사용합니다.
Phase 2에서 Redis로 전환할 수 있습니다.
"""

from collections import defaultdict

from app.models.schemas import ChatMessage

# 세션당 최대 보관 메시지 수
MAX_CONTEXT_MESSAGES = 50


class ContextManager:
    """인메모리 대화 컨텍스트 관리자"""

    def __init__(self):
        self._store: dict[str, list[dict]] = defaultdict(list)

    def save(self, session_id: str, messages: list[ChatMessage]) -> None:
        """세션의 대화 이력을 저장합니다."""
        serialized = [{"role": m.role.value, "content": m.content} for m in messages]
        self._store[session_id] = serialized[-MAX_CONTEXT_MESSAGES:]

    def get(self, session_id: str) -> list[dict]:
        """세션의 대화 이력을 조회합니다."""
        return self._store.get(session_id, [])

    def clear(self, session_id: str) -> None:
        """세션의 대화 이력을 삭제합니다."""
        self._store.pop(session_id, None)

    def get_summary_context(self, session_id: str, last_n: int = 10) -> list[dict]:
        """최근 N개의 메시지만 반환합니다 (토큰 절약)."""
        history = self.get(session_id)
        return history[-last_n:]
