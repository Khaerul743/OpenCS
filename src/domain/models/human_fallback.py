from typing import Optional

from .base import BaseEntity


class Human_Fallback(BaseEntity):
    business_id: Optional[int] = None
    conversation_id: Optional[int] = None
    confidence_level: float
    last_decision_summary: str
