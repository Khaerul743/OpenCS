from abc import ABC, abstractmethod

from src.app.validators.customer_schema import InsertNewCustomer
from src.domain.models import Customers


class ICustomerRepository(ABC):
    @abstractmethod
    async def get_or_insert_custormer(
        self, agent_id: int, customer_data: InsertNewCustomer
    ) -> Customers:
        pass

    @abstractmethod
    async def get_all_customer_by_business_id(
        self, business_id: int
    ) -> list[Customers]:
        pass

    @abstractmethod
    async def get_customer_status_agent_by_agent_id(self, agent_id: int) -> bool | None:
        pass

    @abstractmethod
    async def get_phone_number_by_conversation_id(
        self, conversation_id: int
    ) -> str | None:
        pass
