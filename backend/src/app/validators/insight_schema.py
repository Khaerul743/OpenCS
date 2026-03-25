from pydantic import BaseModel


class AddInsight(BaseModel):
    overview: str
    insight: str
    reason: str
    impact: str
    recommendation: str
