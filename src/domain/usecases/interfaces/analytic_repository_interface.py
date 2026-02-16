from abc import ABC, abstractmethod
from uuid import UUID

from src.app.validators.analytic_schema import InsertAgentAnalytic
from src.domain.models import AgentAnalytics


class IAnalyticRepository(ABC):
    @abstractmethod
    async def get_agent_analytics(self, agent_id: UUID) -> list[AgentAnalytics] | None:
        pass

    @abstractmethod
    async def insert_agent_analytic(
        self, agent_id: UUID, payload: InsertAgentAnalytic
    ) -> AgentAnalytics:
        pass

    async def get_token_usage_trend(self, agent_id: UUID) -> list[dict] | None:
        pass

    @abstractmethod
    async def get_message_usage_trend(self, agent_id: UUID) -> list[dict] | None:
        pass
