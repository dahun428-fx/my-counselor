"""시스템 프롬프트 레지스트리"""

from app.prompts.counselor_prompt import COUNSELOR_SYSTEM_PROMPT, CRISIS_SUPPLEMENT

PROMPTS = {
    "counselor": COUNSELOR_SYSTEM_PROMPT,
    "crisis_supplement": CRISIS_SUPPLEMENT,
}


def get_prompt(name: str) -> str:
    return PROMPTS[name]
