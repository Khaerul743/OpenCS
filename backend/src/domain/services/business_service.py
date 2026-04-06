from supabase import AsyncClient

from src.app.validators.business_schema import AddBusinessIn, BusinessUpdateIn
from src.core.context.request_context import current_user_id
from src.core.exceptions.auth_exception import UnauthorizedException
from src.core.exceptions.business_exception import (
    BusinessIsAlreadyExist,
    BusinessNotFound,
)
from src.core.exceptions.agent_exception import AgentNotFound
from src.domain.models.businesses import Business
from src.domain.repositories import BusinessRepository, CustomerRepository, AgentRepository
from src.domain.usecases.business import AddBusiness, AddBusinessInput, GetCustomers, GetCustomersInput

from .base import BaseService


class BusinessService(BaseService):
    def __init__(self, db: AsyncClient):
        self.db = db
        self.business_repo = BusinessRepository(db)
        self.customer_repo = CustomerRepository(db)
        self.agent_repo = AgentRepository(db)

        # usecases
        self.add_business_usecase = AddBusiness(self.business_repo)
        self.get_customers_usecase = GetCustomers(self.customer_repo)

        super().__init__(__name__)

    async def get_current_business(self):
        result = await self.business_repo.get_business_by_contextvar()
        if result is None:
            raise BusinessNotFound()

        return result

    async def get_customers(self):
        user_id = current_user_id.get()
        if user_id is None:
            raise UnauthorizedException()

        agent_id = await self.agent_repo.get_agent_id_by_user_id(user_id)
        if agent_id is None:
            raise AgentNotFound("Agent not found for current user")

        result = await self.get_customers_usecase.execute(
            GetCustomersInput(agent_id=agent_id)
        )
        if not result.is_success():
            self.raise_error_usecase(result)

        result_data = result.get_data()
        if result_data is None:
            raise RuntimeError("Get customers usecase did not return data")

        return {
            "total_customers": result_data.total_customers,
            "customers": result_data.customers
        }

    async def add_new_business(self, payload: AddBusinessIn) -> Business:
        user_id = current_user_id.get()
        if user_id is None:
            raise UnauthorizedException()

        business_own = await self.business_repo.get_business_by_contextvar()
        if business_own:
            raise BusinessIsAlreadyExist(
                "Cannot add new business, because business is already exist"
            )

        result = await self.add_business_usecase.execute(
            AddBusinessInput(user_id, payload)
        )
        if not result.is_success():
            self.raise_error_usecase(result)

        data_business = result.get_data()
        if data_business is None:
            raise RuntimeError("Add business usecase did not returned data")

        return data_business.business_data

    async def update_business(self, payload: BusinessUpdateIn):
        try:
            user_id = current_user_id.get()
            if user_id is None:
                raise UnauthorizedException()

            business_id = await self.business_repo.get_business_id_by_user_id(user_id)
            if business_id is None:
                raise BusinessNotFound()

            response = await self.business_repo.update_business_by_user_id(
                user_id, payload
            )
            return response

        except UnauthorizedException as e:
            self.logger.warning(str(e))
            raise e

        except BusinessNotFound as e:
            self.logger.warning(str(e))
            raise e
