from supabase import AsyncClient

from src.app.validators.agent_schema import CreateAgentIn
from src.domain.services import AgentService

from .base import BaseController


class AgentController(BaseController):
    def __init__(self, db: AsyncClient):
        self.agent_service = AgentService(db)

    async def create_new_agent_handler(self, payload: CreateAgentIn):
        try:
            result = await self.agent_service.create_new_agent(payload)
            return result.model_dump()

        except Exception as e:
            raise e

    async def get_agent_analytic(self):
        result = await self.agent_service.get_agent_analytic()

        return {
            "total_tokens": result.total_tokens,
            "total_messages": result.total_messages,
            "total_human_takeovers": result.total_human_takeovers,
            "avg_response_time": result.avg_response_time,
            "response_rate": result.response_rate,
        }
