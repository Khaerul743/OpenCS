from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class InsertAgentAnalytic(BaseModel):
    date: str
    total_message: int
    human_takeover: Optional[int] = 0
    response_time: float
    token: int
    ai_response: str
    created_at: Optional[datetime] = None
