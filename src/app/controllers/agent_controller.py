from supabase import AsyncClient

from src.app.validators.agent_schema import CreateAgentIn, UpdateAgentIn
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

    async def get_token_usage_trend_handler(self):
        result = await self.agent_service.get_token_usage_trend()

        return result.trend_data

    async def get_message_usage_trend_handler(self):
        result = await self.agent_service.get_message_usage_trend()
        return result.trend_data

    async def get_status_agent_handler(self):
        result = await self.agent_service.get_status_agent()
        return {"status": result}

    async def update_status_agent_handler(self, status: bool):
        result = await self.agent_service.update_status_agent(status)

        return result.model_dump()

    async def update_agent_handler(self, payload: UpdateAgentIn):
        result = await self.agent_service.update_agent(payload)
        return result

    async def invoke_agent_handler(self, text_message: str):
        result = await self.agent_service.invoke_agent(text_message)
        return {"response": result.response, "detail": result.detail_agent_output}
