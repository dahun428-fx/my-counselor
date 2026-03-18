from pydantic import BaseModel, Field
from enum import Enum


# --- Enums ---

class Role(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# --- Chat ---

class ChatMessage(BaseModel):
    role: Role
    content: str


class UserContext(BaseModel):
    emotion_history: list[str] = Field(default_factory=list)
    previous_sessions_summary: str | None = None


class ChatRequest(BaseModel):
    session_id: str
    messages: list[ChatMessage]
    user_context: UserContext | None = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    detected_emotions: list[str] = Field(default_factory=list)
    risk_level: RiskLevel = RiskLevel.LOW
    crisis_resources: list[str] | None = None


# --- Emotion Analysis ---

class EmotionAnalysisRequest(BaseModel):
    message: str
    context: list[ChatMessage] = Field(default_factory=list)


class EmotionAnalysisResponse(BaseModel):
    emotions: list[str]
    primary_emotion: str
    intensity: float = Field(ge=0.0, le=1.0, description="0.0 ~ 1.0")
    risk_level: RiskLevel
    action: str | None = None
    suggested_resources: list[str] = Field(default_factory=list)
