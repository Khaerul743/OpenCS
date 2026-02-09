from dataclasses import dataclass
from datetime import datetime

from src.app.validators.agent_schema import AgentConf
from src.app.validators.analytic_schema import InsertAgentAnalytic
from src.app.validators.customer_schema import InsertNewCustomer
from src.domain.models.agent_analytics import AgentAnalytics
from src.domain.usecases.base import BaseUseCase, UseCaseResult
from src.domain.usecases.interfaces import (
    IAgentConfigurationRepository,
    IAnalyticRepository,
    ICustomerRepository,
)
from src.infrastructure.ai.agent.base import BaseAgentStateModel
from src.infrastructure.ai.agent.manager import WhatsappAgentManager


@dataclass
class MessageProcessingUseCaseInput:
    agent_id: int
    phone_number_id: str
    customer_data: InsertNewCustomer
    agent_state: BaseAgentStateModel


@dataclass
class MessageProcessingUseCaseOutput:
    customer_id: int
    text_message: str
    response: str
    detail_agent_output: dict


class MessageProcessingUseCase(
    BaseUseCase[MessageProcessingUseCaseInput, MessageProcessingUseCaseOutput]
):
    def __init__(
        self,
        customer_repo: ICustomerRepository,
        agent_conf_repo: IAgentConfigurationRepository,
        analytic_repo: IAnalyticRepository,
        whatsapp_agent_manager: WhatsappAgentManager,
    ):
        self.customer_repo: ICustomerRepository = customer_repo
        self.agent_conf_repo = agent_conf_repo
        self.analytic_repo = analytic_repo
        self.whatsapp_agent_manager = whatsapp_agent_manager

    async def execute(
        self, input_data: MessageProcessingUseCaseInput
    ) -> UseCaseResult[MessageProcessingUseCaseOutput]:
        try:
            # Insert new or get customer
            customer = await self.customer_repo.get_or_insert_custormer(
                input_data.agent_id, input_data.customer_data
            )

            if not customer.enable_ai:
                return UseCaseResult.error_result(
                    f"The user is disable this customer: customer phone number {customer.phone_number}",
                    RuntimeWarning(
                        f"The user is disable this customer: customer phone number {customer.phone_number}"
                    ),
                )

            # get Agent configuration
            agent_conf = await self.agent_conf_repo.get_agent_conf_by_agent_id(
                input_data.agent_id
            )

            if agent_conf is None:
                return UseCaseResult.error_result(
                    "Agent conf not found", RuntimeError("agent conf not found")
                )

            # Get agent from agent manager
            agent = self.whatsapp_agent_manager.get_or_create_by_phone_number_id(
                input_data.phone_number_id,
                AgentConf(
                    chromadb_path=agent_conf.chromadb_path,
                    collection_name=agent_conf.collection_name,
                    llm_provider=agent_conf.llm_provider,
                    llm_model=agent_conf.llm_model,
                    tone=agent_conf.tone,
                    base_prompt=agent_conf.base_prompt,
                    temperature=agent_conf.temperature,
                    include_memory=agent_conf.include_memory,
                    user_memory_id=agent_conf.user_memory_id,
                ),
            )

            # Execute the agent
            agent_result = agent.execute(input_data.agent_state, customer.wa_id)
            response_time = agent.get_response_time()
            result_message = agent.get_response()
            total_token = agent.get_token_usage()
            result_message = (
                "Maaf, sepertinya sistem kami sedang ada gangguan. Mohon coba lagi nanti"
                if result_message is None
                else result_message
            )

            # Insert Agent Analytic
            date_now = datetime.now().date()

            agent_analytic: AgentAnalytics = (
                await self.analytic_repo.insert_agent_analytic(
                    input_data.agent_id,
                    InsertAgentAnalytic(
                        date=str(date_now),
                        total_message=2,
                        response_time=response_time,
                        token=total_token,
                        ai_response=result_message,
                        human_takeover=agent_result["human_fallback"],
                    ),
                )
            )

            return UseCaseResult.success_result(
                MessageProcessingUseCaseOutput(
                    customer_id=customer.id,
                    text_message=input_data.agent_state.user_message,
                    response=result_message,
                    detail_agent_output={
                        "decision_summary": agent_result["decision_summary"],
                        "human_fallback": agent_result["human_fallback"],
                        "confidence_level": agent_result["confidence_level"],
                    },
                )
            )

        except Exception as e:
            return UseCaseResult.error_result(
                f"Unexpected error while processing message usecase: {str(e)}", e
            )
