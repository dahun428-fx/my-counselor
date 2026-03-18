"""채팅 엔드포인트 테스트"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "llm-service"


def test_crisis_detection():
    from app.prompts.counselor_prompt import detect_crisis

    assert detect_crisis("죽고 싶어요") is True
    assert detect_crisis("자살하고 싶어") is True
    assert detect_crisis("오늘 날씨가 좋네요") is False
    assert detect_crisis("사라지고 싶어요") is True
