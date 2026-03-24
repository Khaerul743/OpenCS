from datetime import datetime
from typing import Optional
from uuid import UUID

from .base import BaseEntity


class AgentAnalytics(BaseEntity):
    agent_id: UUID
    date: datetime
    total_message: int
    human_takeover: int
    response_time: float
    token: int
    ai_response: str
    created_at: Optional[datetime] = None
