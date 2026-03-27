from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NotificationBase(BaseModel):
    type: str
    title: str
    message: str
    link: Optional[str] = None

class NotificationCreate(NotificationBase):
    vendorId: str

class NotificationUpdate(BaseModel):
    isRead: bool

class Notification(NotificationBase):
    id: str
    vendorId: str
    isRead: bool
    createdAt: datetime

    class Config:
        from_attributes = True
