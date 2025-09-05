from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageCreate(BaseModel):
    sender_id: str
    recipient_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    recipient_id: str
    encrypted_content: str
    status: str  # "allowed", "flagged", "blocked"
    ai_score: float
    fuzzy_score: float
    created_at: datetime

class DecryptedMessage(BaseModel):
    id: str
    sender_id: str
    recipient_id: str
    content: str
    status: str
    ai_score: float
    fuzzy_score: float
    created_at: datetime