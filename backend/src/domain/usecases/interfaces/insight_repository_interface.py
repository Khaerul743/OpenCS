from uuid import UUID
from abc import ABC, abstractmethod
from src.app.validators.insight_schema import AddInsight
from src.domain.models import Insight


class IInsightRepository(ABC):
    @abstractmethod
    async def createInsight(self, business_id: UUID, payload: AddInsight) -> Insight:
        pass
