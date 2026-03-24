from dataclasses import dataclass

from src.app.validators.human_fallback_schema import InsertNewHumanFallback
from src.domain.models import Human_Fallback
from src.domain.usecases.base import BaseUseCase, UseCaseResult
from src.domain.usecases.interfaces import (
    IConversationRepository,
    IHumanFallbackRepository,
)


@dataclass
class HumanFallbackInput:
    payload: InsertNewHumanFallback


@dataclass
class HumanFallbackOutput:
    result: Human_Fallback


class HumanFallbackUseCase(BaseUseCase[HumanFallbackInput, HumanFallbackOutput]):
    def __init__(
        self,
        human_fallback_repo: IHumanFallbackRepository,
        conversation_repo: IConversationRepository,
    ):
        self.human_fallback_repo = human_fallback_repo
        self.conversation_repo = conversation_repo

    async def execute(
        self, input_data: HumanFallbackInput
    ) -> UseCaseResult[HumanFallbackOutput]:
        try:
            result = await self.human_fallback_repo.get_or_insert_new_human_fallback(
                input_data.payload
            )
            await self.conversation_repo.update_conversation_status(
                input_data.payload.conversation_id, True
            )
            return UseCaseResult.success_result(HumanFallbackOutput(result=result))

        except Exception as e:
            return UseCaseResult.error_result(
                f"Unexpected error while insert new human fallback: {e}", e
            )
