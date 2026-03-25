from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from decimal import Decimal
from datetime import datetime

class VendorBase(BaseModel):
    email: EmailStr
    storeName: str
    category: Optional[str] = None
    location: Optional[str] = None
    phoneNumber: Optional[str] = None
    description: Optional[str] = None
    logoUrl: Optional[str] = None

class VendorCreate(VendorBase):
    password: str

class VendorUpdate(BaseModel):
    storeName: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    phoneNumber: Optional[str] = None
    description: Optional[str] = None
    logoUrl: Optional[str] = None
    botEnabled: Optional[bool] = None
    botPersonality: Optional[str] = None
    hagglingLimit: Optional[Decimal] = None
    telegramToken: Optional[str] = None
    whatsappMetaToken: Optional[str] = None
    bankName: Optional[str] = None
    accountNumber: Optional[str] = None
    accountName: Optional[str] = None

class Vendor(VendorBase):
    id: str
    botEnabled: bool
    botPersonality: Optional[str] = None
    hagglingLimit: Decimal
    telegramToken: Optional[str] = None
    whatsappMetaToken: Optional[str] = None
    walletBalance: Decimal
    bankName: Optional[str] = None
    accountNumber: Optional[str] = None
    accountName: Optional[str] = None
    createdAt: datetime
    
    model_config = ConfigDict(from_attributes=True)
