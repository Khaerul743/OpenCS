from supabase import AsyncClient

from src.app.validators.analytic_schema import InsertAgentAnalytic
from src.domain.models import AgentAnalytics
from src.domain.usecases.interfaces import IAnalyticRepository


class AnalyticsRepository(IAnalyticRepository):
    def __init__(self, db: AsyncClient):
        self.db = db

    async def get_agent_analytics(self, agent_id: int):
        result = (
            await self.db.table("Agent_analytics")
            .select("*")
            .eq("agent_id", agent_id)
            .execute()
        )
        if len(result.data) == 0:
            return None

        result_data = [AgentAnalytics.model_validate(i) for i in result.data]
        return result_data

    async def insert_agent_analytic(
        self, agent_id: int, payload: InsertAgentAnalytic
    ) -> AgentAnalytics:
        payload_dict = payload.model_dump(exclude_unset=True)
        payload_dict["agent_id"] = agent_id
        print(payload_dict)
        result = await self.db.table("Agent_analytics").insert(payload_dict).execute()
        return AgentAnalytics.model_validate(result.data[0])
