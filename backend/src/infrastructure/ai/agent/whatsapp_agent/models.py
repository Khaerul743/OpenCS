from typing import Annotated, Any, Optional, Sequence

from src.infrastructure.ai.agent.base import BaseAgentStateModel

# class WhatsappAgentState(BaseAgentStateModel):
#     is_include_document: bool = False
#     document_name: Optional[str] = "none"
#     document_content: Optional[str] = "none"
#     document_type: Optional[str] = "none"
#     # can_answer: bool = False
#     reason: Optional[str] = "none"
#     include_ws: bool = False
#     user_id: Optional[str] = None


class WhatsappAgentState(BaseAgentStateModel):
    business_name: str
    business_desc: str
    business_location: str
    business_knowladge: dict
    user_id: Optional[str] = None
