from uuid import UUID

from supabase import AsyncClient
from src.app.validators.insight_schema import AddInsight
from src.domain.usecases.interfaces import IInsightRepository
from src.domain.models import Insight


class InsightRepository(IInsightRepository):
    def __init__(self, db: AsyncClient):
        self.db = db

    async def createInsight(self, business_id: UUID, payload: AddInsight) -> Insight:
        payload_dict = payload.model_dump()
        payload_dict["business_id"] = str(business_id)
        result = await self.db.table("Insight").insert(payload_dict).execute()
        result_data = result.data[0]
        return Insight.model_validate(result_data)
