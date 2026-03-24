from dataclasses import dataclass
from uuid import UUID
from typing import Literal
from pydantic import BaseModel
from src.domain.usecases.base import UseCaseResult, BaseUseCase
from src.domain.usecases.interfaces import IAnalyticRepository

@dataclass
class GetCategoryPercentagesInput:
    agent_id: UUID

class SummaryType(BaseModel):
    category_type: Literal["pengiriman", "harga & promo", "produk & stok", "pemesanan", "komplain", "refund", "lainnya"]
    total: int
    change: str

class SampleType(BaseModel):
    category_type: Literal["pengiriman", "harga & promo", "produk & stok", "pemesanan", "komplain", "refund", "lainnya"]
    sample_messages: list[str]

class GetCategoryPercentagesOutput:
    summary: list[SummaryType]
    samples: list[SampleType]


class GetCategoryPercentages(BaseUseCase[GetCategoryPercentagesInput, GetCategoryPercentagesOutput]):
    def __init__(self, analytic_repo: IAnalyticRepository):
        self.analyic_repo = analytic_repo
    
    def execute(self, input_data: GetCategoryPercentagesInput) -> UseCaseResult[GetCategoryPercentagesOutput]:
        pass
