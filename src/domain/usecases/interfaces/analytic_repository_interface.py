from abc import ABC, abstractmethod

from src.app.validators.analytic_schema import InsertAgentAnalytic
from src.domain.models import AgentAnalytics


class IAnalyticRepository(ABC):
    @abstractmethod
    async def get_agent_analytics(self, agent_id: int) -> list[AgentAnalytics] | None:
        pass

    @abstractmethod
    async def insert_agent_analytic(
        self, agent_id: int, payload: InsertAgentAnalytic
    ) -> AgentAnalytics:
        pass
