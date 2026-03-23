from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime
from .product import Product

class OrderBase(BaseModel):
    customerName: str
    customerPhone: str
    shippingAddress: Optional[str] = None
    totalAmount: Decimal

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: str
    vendorId: str
    status: str
    paymentRef: Optional[str] = None
    logisticsRef: Optional[str] = None
    createdAt: datetime
    
    class Config:
        orm_mode = True
