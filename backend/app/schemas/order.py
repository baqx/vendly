from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime

class OrderItemBase(BaseModel):
    productId: str
    quantity: int = 1
    price: Decimal
    variant: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: str
    orderId: str
    
    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    customerName: str
    customerPhone: str
    shippingAddress: Optional[str] = None
    totalAmount: Decimal
    telegramChatId: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: str
    vendorId: str
    status: str
    paymentRef: Optional[str] = None
    logisticsRef: Optional[str] = None
    createdAt: datetime
    items: List[OrderItem] = []
    
    class Config:
        orm_mode = True
