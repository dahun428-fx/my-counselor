from abc import ABC, abstractmethod
import asyncio
import random
from typing import AsyncIterator

from openai import AsyncOpenAI
from anthropic import AsyncAnthropic

from app.config import settings


class BaseLLMClient(ABC):
    """LLM 클라이언트 추상 인터페이스"""

    @abstractmethod
    async def generate(self, messages: list[dict], temperature: float = 0.7) -> str:
        ...

    @abstractmethod
    async def generate_stream(
        self, messages: list[dict], temperature: float = 0.7
    ) -> AsyncIterator[str]:
        ...


class MockLLMClient(BaseLLMClient):
    """API 키 없이 테스트할 수 있는 Mock LLM 클라이언트"""

    MOCK_RESPONSES = [
        "말씀해주셔서 감사합니다. 그런 감정을 느끼시는 것은 자연스러운 일이에요. 조금 더 자세히 이야기해주실 수 있을까요?",
        "그런 경험을 하셨군요. 많이 힘드셨을 것 같아요. 지금 기분이 어떠신지 좀 더 말씀해주시겠어요?",
        "충분히 그렇게 느끼실 수 있어요. 당신의 감정은 소중합니다. 어떤 부분이 가장 마음에 걸리시나요?",
        "이야기를 들으니 정말 쉽지 않은 상황이셨네요. 혼자서 많이 고민하셨을 것 같아요. 함께 이야기 나눠봐요.",
        "그 마음이 느껴집니다. 용기 내어 말씀해주셔서 감사해요. 지금 가장 필요한 것이 무엇인지 같이 생각해볼까요?",
    ]

    async def generate(self, messages: list[dict], temperature: float = 0.7) -> str:
        return random.choice(self.MOCK_RESPONSES)

    async def generate_stream(
        self, messages: list[dict], temperature: float = 0.7
    ) -> AsyncIterator[str]:
        response = random.choice(self.MOCK_RESPONSES)
        for char in response:
            yield char
            await asyncio.sleep(0.02)


class OpenAIClient(BaseLLMClient):
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    async def generate(self, messages: list[dict], temperature: float = 0.7) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message.content or ""

    async def generate_stream(
        self, messages: list[dict], temperature: float = 0.7
    ) -> AsyncIterator[str]:
        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield delta.content


class AnthropicClient(BaseLLMClient):
    def __init__(self):
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        self.model = settings.anthropic_model

    def _split_system(self, messages: list[dict]) -> tuple[str, list[dict]]:
        """Anthropic API는 system을 별도 파라미터로 받으므로 분리"""
        system = ""
        other: list[dict] = []
        for m in messages:
            if m["role"] == "system":
                system += m["content"] + "\n"
            else:
                other.append(m)
        return system.strip(), other

    async def generate(self, messages: list[dict], temperature: float = 0.7) -> str:
        system, msgs = self._split_system(messages)
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            system=system,
            messages=msgs,
            temperature=temperature,
        )
        return response.content[0].text

    async def generate_stream(
        self, messages: list[dict], temperature: float = 0.7
    ) -> AsyncIterator[str]:
        system, msgs = self._split_system(messages)
        async with self.client.messages.stream(
            model=self.model,
            max_tokens=2048,
            system=system,
            messages=msgs,
            temperature=temperature,
        ) as stream:
            async for text in stream.text_stream:
                yield text


def get_llm_client() -> BaseLLMClient:
    """설정에 따라 적절한 LLM 클라이언트를 반환"""
    if settings.use_mock_llm:
        return MockLLMClient()
    if settings.llm_provider == "anthropic":
        return AnthropicClient()
    return OpenAIClient()
