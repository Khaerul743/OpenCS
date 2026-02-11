from supabase import AsyncClient

from src.app.validators.agent_schema import InsertAgent
from src.domain.models import Agents
from src.domain.usecases.interfaces import IAgentRepository


class AgentRepository(IAgentRepository):
    def __init__(self, db: AsyncClient):
        self.db = db

    async def get_agent_by_phone_number_id(self, phone_number_id: str) -> Agents | None:
        result = (
            await self.db.table("Agents")
            .select("*")
            .eq("phone_number_id", phone_number_id)
            .maybe_single()
            .execute()
        )
        if result is None:
            return None

        return Agents.model_validate(result.data)

    async def get_agent_id_by_user_id(self, user_id: int) -> int | None:
        result = (
            await self.db.table("Businesses")
            .select("Agents(id)")
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )
        if result is None:
            return None
        return result.data["Agents"]["id"]

    async def get_agent_by_business_id(self, business_id: int) -> Agents | None:
        result = (
            await self.db.table("Agents")
            .select("*")
            .eq("business_id", business_id)
            .maybe_single()
            .execute()
        )
        if result is None:
            return None
        return Agents.model_validate(result.data)

    async def get_status_agent(self, agent_id: int) -> bool | None:
        result = await (
            self.db.table("Agents")
            .select("enable_ai")
            .eq("id", agent_id)
            .maybe_single()
            .execute()
        )
        if result is None:
            return None

        return result.data["enable_ai"]

    async def create_agent_by_business_id(
        self, business_id: int, agent_data: InsertAgent
    ) -> Agents:
        payload = agent_data.model_dump()
        payload["business_id"] = business_id

        result = await self.db.table("Agents").insert(payload).execute()

        return Agents.model_validate(result.data[0])

    async def update_status_agent(self, agent_id: int, status: bool) -> Agents | None:
        result = (
            await self.db.table("Agents")
            .update({"enable_ai": status})
            .eq("id", agent_id)
            .execute()
        )
        if len(result.data) == 0:
            return None

        return Agents.model_validate(result.data[0])
