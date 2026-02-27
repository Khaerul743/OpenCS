from datetime import datetime
from typing import Optional
from uuid import UUID

from .base import BaseEntity


class Agents(BaseEntity):
    business_id: Optional[UUID] = None
    phone_number_id: Optional[str] = None
    name: str
    enable_ai: bool = True
    fallback_to_human: str
    updated_at: datetime
