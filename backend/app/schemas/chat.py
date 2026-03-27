from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ChatMessageBase(BaseModel):
    role: str # BOT, CUSTOMER, VENDOR
    content: str

class ChatMessage(ChatMessageBase):
    id: str
    timestamp: datetime
    class Config:
        orm_mode = True

class ChatSessionBase(BaseModel):
    channel: str # WHATSAPP, TELEGRAM
    customerIdentifier: str
    active: bool = True
    humanTakeover: bool = False

class ChatSession(ChatSessionBase):
    id: str
    vendorId: str
    createdAt: datetime
    updatedAt: datetime
    messages: List[ChatMessage] = []
    
    class Config:
        orm_mode = True
class ChatResponse(BaseModel):
    response: str

# Sync with Prisma's output structure.
