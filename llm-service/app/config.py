from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # LLM Provider
    llm_provider: str = Field(default="openai", description="openai or anthropic")

    # OpenAI
    openai_api_key: str = Field(default="")
    openai_model: str = Field(default="gpt-4o")

    # Anthropic
    anthropic_api_key: str = Field(default="")
    anthropic_model: str = Field(default="claude-sonnet-4-20250514")

    # Mock mode (API 키 없이 테스트용)
    use_mock_llm: bool = Field(default=True, description="True이면 Mock LLM 클라이언트 사용")

    # Server
    port: int = Field(default=8000)

    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0")

    # CORS
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"]
    )

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


settings = Settings()
