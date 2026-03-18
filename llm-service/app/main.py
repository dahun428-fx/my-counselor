from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import chat, analyze

app = FastAPI(
    title="My Counselor LLM Service",
    description="AI 심리상담 LLM 서비스",
    version="0.1.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat.router, prefix="/llm", tags=["chat"])
app.include_router(analyze.router, prefix="/llm", tags=["analyze"])


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "llm-service",
        "provider": settings.llm_provider,
    }
