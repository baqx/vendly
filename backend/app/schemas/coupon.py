from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime

class CouponBase(BaseModel):
    code: str
    discountType: str # PERCENTAGE, FIXED
    value: Decimal
    minOrderValue: Optional[Decimal] = None
    active: bool = True

class CouponCreate(CouponBase):
    pass

class Coupon(CouponBase):
    id: str
    vendorId: str
    createdAt: datetime
    
    class Config:
        orm_mode = True
