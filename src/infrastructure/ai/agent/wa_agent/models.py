from typing import Annotated, Any, List, Literal, Optional

from pydantic import BaseModel, Field, create_model

from src.infrastructure.ai.agent.base import BaseAgentStateModel


class MainAgentOutput(BaseModel):
    """Struktur output yang diperlukan"""

    your_answer: Optional[str] = Field(description="Jawaban kamu untuk customer")
    need_more_information: bool = Field(
        description="Berupa keputusan apakah kamu perlu informasi tambahan tentang bisnis"
    )
    human_fallback: bool = Field(
        description="Berupa keputusan apakah kamu ingin melakukan human fallback"
    )
    decision_summary: Optional[str] = Field(
        description=(
            "Ringkasan reasoning"
            "berisi kesimpulan dan informasi yang sekiranya diperlukan untuk menjawab pertanyaan customer"
        )
    )
    confidence: float = Field(
        description="Tingkat kepercayaan diri kamu dalam menjawab pertanyaan tersebut(1-100)"
    )


def create_call_preparation_tool_model(business_knowladge: list[str]):
    business_knowladge_type = Literal[tuple(business_knowladge)]
    return create_model(
        "CallPreparationToolOutput",
        rag_query=(
            str,
            Field(
                description=(
                    "Query untuk tool rag"
                    "Tentukan query yang sesuai untuk menjawab pertanyaan customer"
                )
            ),
        ),
        business_knowladge=(
            List[business_knowladge_type],
            Field(
                description=(
                    "key business knowladge"
                    "Pilih key yang paling relevan untuk menjawab pertanyaan pengguna"
                )
            ),
        ),
        decision_summary=(
            str,
            Field(
                description=(
                    "Ringkasan reasoning"
                    "Jelaskan apa yang sudah kamu lakukan dan mengapa"
                )
            ),
        ),
        __base__=BaseModel,
    )


class FinalResultOutput(BaseModel):
    your_answer: str = Field(description=("jawaban kamu"))
    confidence: float = Field(
        description="Tingkat kepercayaan diri kamu dalam menjawab pertanyaan tersebut(1-100)"
    )
    human_fallback: bool = Field(
        description="Berupa keputusan apakah kamu ingin melakukan human fallback"
    )
    decision_summary: Optional[str] = Field(
        description=(
            "Ringkasan reasoning"
            "berisi kesimpulan dan informasi yang sekiranya diperlukan untuk menjawab pertanyaan customer"
        )
    )
    call_tool_again: bool = Field(
        description=(
            "call tool again"
            "Berupa keputusan apakah kamu ingin menggunakan tool lagi supaya dapat konteks tambahan dalam menjawab customer"
        )
    )


class WhatsappAgentState(BaseAgentStateModel):
    human_fallback: bool = False
    need_more_information: bool = False
    call_tool_again: bool = False
    decision_summary: Optional[str] = None
    rag_query: Optional[str] = None
    rag_query_result: Optional[str] = None
    business_knowladge_key: List = []
    business_knowladge_result: Optional[str] = None
    confidence_level: float = 100
    conversation_summary: Optional[str] = None
    fallback_human: bool = False
