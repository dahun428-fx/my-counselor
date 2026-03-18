from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """상담 대화 응답을 생성합니다."""
    return await chat_service.generate_response(request)


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """상담 대화 응답을 스트리밍으로 생성합니다."""
    return StreamingResponse(
        chat_service.generate_stream(request),
        media_type="text/event-stream",
    )
