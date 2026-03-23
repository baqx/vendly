from typing import Optional
from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime

class TransactionBase(BaseModel):
    amount: Decimal
    type: str # SALE, PAYOUT, COMMISSION, REFUND
    orderId: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    vendorId: str
    timestamp: datetime
    
    class Config:
        orm_mode = True
