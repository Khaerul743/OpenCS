from typing import Optional

from pydantic import BaseModel


class InsertNewHumanFallback(BaseModel):
    business_id: int
    conversation_id: int
    confidence_level: float
    last_decision_summary: str
