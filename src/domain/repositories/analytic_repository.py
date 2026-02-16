from uuid import UUID

from supabase import AsyncClient

from src.app.validators.analytic_schema import InsertAgentAnalytic
from src.domain.models import AgentAnalytics
from src.domain.usecases.interfaces import IAnalyticRepository


class AnalyticsRepository(IAnalyticRepository):
    def __init__(self, db: AsyncClient):
        self.db = db

    async def get_agent_analytics(self, agent_id: UUID):
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
        self, agent_id: UUID, payload: InsertAgentAnalytic
    ) -> AgentAnalytics:
        payload_dict = payload.model_dump(exclude_unset=True)
        payload_dict["agent_id"] = str(agent_id)
        print(payload_dict)
        result = await self.db.table("Agent_analytics").insert(payload_dict).execute()
        return AgentAnalytics.model_validate(result.data[0])

    async def get_token_usage_trend(self, agent_id: UUID) -> list[dict] | None:
        result = (
            await self.db.table("Agent_analytics")
            .select("date, token")
            .eq("agent_id", agent_id)
            .execute()
        )
        if len(result.data) == 0:
            return None

        return result.data

    async def get_message_usage_trend(self, agent_id: UUID) -> list[dict] | None:
        result = (
            await self.db.table("Agent_analytics")
            .select("date, total_message")
            .eq("agent_id", agent_id)
            .execute()
        )
        if len(result.data) == 0:
            return None

        return result.data
