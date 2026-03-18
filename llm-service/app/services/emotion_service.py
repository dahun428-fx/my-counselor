import json

from app.models.schemas import (
    EmotionAnalysisRequest,
    EmotionAnalysisResponse,
    RiskLevel,
)
from app.services.llm_client import get_llm_client
from app.prompts.counselor_prompt import detect_crisis

EMOTION_ANALYSIS_PROMPT = """당신은 한국어 텍스트의 감정을 분석하는 전문가입니다.

주어진 메시지에서 다음을 분석하세요:
1. emotions: 감지된 모든 감정 (한국어, 리스트)
2. primary_emotion: 가장 두드러진 감정 (한국어)
3. intensity: 감정 강도 (0.0 ~ 1.0)
4. risk_level: 위험 수준 ("low", "medium", "high", "critical")
5. action: 권장 행동 (null, "monitor", "support", "crisis_intervention")
6. suggested_resources: 추천 자원 (리스트, 위기 시 상담전화 포함)

반드시 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
"""


class EmotionService:
    def __init__(self):
        self.llm = get_llm_client()

    async def analyze(
        self, request: EmotionAnalysisRequest
    ) -> EmotionAnalysisResponse:
        # 위기 키워드 빠른 체크
        is_crisis = detect_crisis(request.message)

        messages: list[dict] = [
            {"role": "system", "content": EMOTION_ANALYSIS_PROMPT},
        ]

        # 컨텍스트 추가
        for m in request.context:
            messages.append({"role": m.role.value, "content": m.content})

        messages.append(
            {
                "role": "user",
                "content": f"다음 메시지의 감정을 분석하세요:\n\n\"{request.message}\"",
            }
        )

        raw = await self.llm.generate(messages, temperature=0.3)

        try:
            # JSON 파싱 (```json ... ``` 감싸기 처리)
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1]
                cleaned = cleaned.rsplit("```", 1)[0]
            data = json.loads(cleaned)
        except (json.JSONDecodeError, IndexError):
            # 파싱 실패 시 기본 응답
            data = {
                "emotions": ["불명확"],
                "primary_emotion": "불명확",
                "intensity": 0.5,
                "risk_level": "high" if is_crisis else "low",
                "action": "crisis_intervention" if is_crisis else None,
                "suggested_resources": (
                    ["자살예방상담전화: 1393"] if is_crisis else []
                ),
            }

        # 위기 감지 시 risk_level 강제 상향
        if is_crisis and data.get("risk_level") not in ("high", "critical"):
            data["risk_level"] = "critical"
            data["action"] = "crisis_intervention"
            data["suggested_resources"] = [
                "자살예방상담전화: 1393 (24시간)",
                "정신건강위기상담전화: 1577-0199 (24시간)",
                "생명의전화: 109",
            ]

        return EmotionAnalysisResponse(**data)
