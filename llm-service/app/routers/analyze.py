from fastapi import APIRouter

from app.models.schemas import EmotionAnalysisRequest, EmotionAnalysisResponse
from app.services.emotion_service import EmotionService

router = APIRouter()
emotion_service = EmotionService()


@router.post("/analyze/emotion", response_model=EmotionAnalysisResponse)
async def analyze_emotion(request: EmotionAnalysisRequest):
    """메시지의 감정을 분석합니다."""
    return await emotion_service.analyze(request)
