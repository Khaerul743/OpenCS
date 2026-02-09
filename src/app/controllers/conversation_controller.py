from supabase import AsyncClient

from src.domain.services import ConversationService

from .base import BaseController


class ConversationController(BaseController):
    def __init__(self, db: AsyncClient):
        self.conversation_service = ConversationService(db)

    async def get_all_conversation_handler(self):
        conversations = await self.conversation_service.get_all_conversation()
        if conversations is None:
            return []
        return conversations

    async def get_all_messages_handler(self, conversation_id: int):
        messages = await self.conversation_service.get_all_messages(conversation_id)
        if messages is None:
            return []

        return messages

    async def get_all_conversation_human_fallback_handler(self):
        conversation_fallback = (
            await self.conversation_service.get_all_conversation_with_human_fallback()
        )

        return conversation_fallback

    async def post_direct_message_handler(
        self, conversation_id: int, text_message: str
    ):
        result = await self.conversation_service.post_new_message(
            conversation_id, text_message
        )
        return {
            "conversation_id": result.conversation_id,
            "detail": result.response_webhook,
        }

    async def get_customer_status_agent_handler(self, conversation_id: int):
        result = await self.conversation_service.get_customer_status_agent(
            conversation_id
        )
        return {"customer status agent": result}

    async def update_customer_status_agent_handler(
        self, conversation_id: int, status: bool
    ):
        result = await self.conversation_service.update_customer_status_agent(
            conversation_id, status
        )
        return result.model_dump()

    async def delete_conversation_fallback_handler(self, conversation_id: int):
        result = await self.conversation_service.delete_conversation_fallback(
            conversation_id
        )
        return result.model_dump()
