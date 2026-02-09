from supabase import AsyncClient

from src.core.context.request_context import current_user_id
from src.core.exceptions.auth_exception import UnauthorizedException
from src.core.exceptions.business_exception import BusinessNotFound
from src.core.exceptions.whatsapp_exceptions import ConversationNotFound
from src.domain.repositories import (
    BusinessRepository,
    ConversationRepository,
    CustomerRepository,
    HumanFallbackRepository,
    MessageRepository,
)
from src.domain.usecases.whatsapp import SendTextMessage, SendTextMessageInput
from src.infrastructure.meta import WhatsappManager

from .base import BaseService


class ConversationService(BaseService):
    def __init__(self, db: AsyncClient):
        self.db = db

        # Repositories
        self.conversation_repo = ConversationRepository(db)
        self.business_repo = BusinessRepository(db)
        self.message_repo = MessageRepository(db)
        self.customer_repo = CustomerRepository(db)
        self.human_fallback_repo = HumanFallbackRepository(db)

        # dependencies
        self.whatsapp_manager = WhatsappManager()

        # Use case
        self.send_text_message_use_case = SendTextMessage(
            self.conversation_repo,
            self.message_repo,
            self.customer_repo,
            self.whatsapp_manager,
        )

    async def _get_business_id(self, user_id: int) -> int | None:
        business_id = await self.business_repo.get_business_id_by_user_id(user_id)
        return business_id

    async def get_all_conversation(self):
        user_id = current_user_id.get()
        if user_id is None:
            raise UnauthorizedException()

        business_id = await self._get_business_id(user_id)
        if business_id is None:
            raise BusinessNotFound()

        conversations = (
            await self.conversation_repo.get_all_conversations_by_business_id(
                business_id
            )
        )

        return conversations

    async def get_all_messages(self, conversation_id: int):
        messages = await self.message_repo.get_all_message_by_conversation_id(
            conversation_id
        )

        return messages

    async def get_all_conversation_with_human_fallback(self):
        user_id = current_user_id.get()
        if user_id is None:
            raise UnauthorizedException()
        business_id = await self._get_business_id(user_id)
        if business_id is None:
            raise BusinessNotFound()

        conversation_human_fallbacks = (
            await self.human_fallback_repo.get_all_human_fallback_by_business_id(
                business_id
            )
        )

        if conversation_human_fallbacks is None:
            return []

        return conversation_human_fallbacks

    async def post_new_message(self, conversation_id: int, text_message: str):
        conversation = await self.conversation_repo.get_conversation_by_id(
            conversation_id
        )
        if conversation is None:
            raise ConversationNotFound()

        send_message_result = await self.send_text_message_use_case.execute(
            SendTextMessageInput(conversation.id, "human_admin", text_message)
        )

        if not send_message_result.is_success():
            self.raise_error_usecase(send_message_result)

        result_data = send_message_result.get_data()
        if result_data is None:
            raise RuntimeError("Send message use case did not returned the data")

        return result_data
