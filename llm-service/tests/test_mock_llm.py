"""Mock LLM 클라이언트 테스트"""

import pytest

from app.services.llm_client import MockLLMClient, get_llm_client, BaseLLMClient


@pytest.mark.asyncio
async def test_mock_generate_returns_korean_response():
    client = MockLLMClient()
    response = await client.generate([{"role": "user", "content": "안녕하세요"}])
    assert isinstance(response, str)
    assert len(response) > 0
    assert response in MockLLMClient.MOCK_RESPONSES


@pytest.mark.asyncio
async def test_mock_generate_stream_yields_chars():
    client = MockLLMClient()
    chars = []
    async for char in client.generate_stream([{"role": "user", "content": "안녕하세요"}]):
        chars.append(char)
    result = "".join(chars)
    assert result in MockLLMClient.MOCK_RESPONSES
    # 스트리밍이므로 한 글자씩 나와야 함
    for char in chars:
        assert len(char) == 1


def test_mock_client_is_base_llm_client():
    client = MockLLMClient()
    assert isinstance(client, BaseLLMClient)


def test_get_llm_client_returns_mock_when_enabled(monkeypatch):
    monkeypatch.setattr("app.services.llm_client.settings.use_mock_llm", True)
    client = get_llm_client()
    assert isinstance(client, MockLLMClient)


def test_get_llm_client_returns_real_when_disabled(monkeypatch):
    monkeypatch.setattr("app.services.llm_client.settings.use_mock_llm", False)
    monkeypatch.setattr("app.services.llm_client.settings.llm_provider", "openai")
    from app.services.llm_client import OpenAIClient
    client = get_llm_client()
    assert isinstance(client, OpenAIClient)
