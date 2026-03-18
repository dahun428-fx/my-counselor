"""감정 분석 관련 테스트"""

import pytest

from app.prompts.counselor_prompt import detect_crisis, CRISIS_KEYWORDS


def test_crisis_keywords_not_empty():
    assert len(CRISIS_KEYWORDS) > 0


def test_detect_crisis_positive_cases():
    cases = [
        "죽고 싶다",
        "자살을 생각했어요",
        "살고 싶지 않아요",
        "사라지고 싶다",
        "자해를 했어요",
    ]
    for case in cases:
        assert detect_crisis(case) is True, f"Failed for: {case}"


def test_detect_crisis_negative_cases():
    cases = [
        "오늘 기분이 좋아요",
        "회사에서 스트레스를 받았어요",
        "좀 우울한 하루였어요",
        "친구와 다퉜어요",
    ]
    for case in cases:
        assert detect_crisis(case) is False, f"False positive for: {case}"
