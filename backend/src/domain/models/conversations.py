from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from .base import BaseEntity


class Conversations(BaseEntity):
    customer_id: Optional[UUID] = None
    status: Literal["active", "inactive"] = "active"
    last_message_at: datetime
