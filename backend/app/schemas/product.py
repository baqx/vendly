from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime

class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    basePrice: Decimal
    mapPrice: Decimal
    stockLevel: int = 0
    tags: Optional[str] = None
    technicalSpecs: Optional[dict] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    basePrice: Optional[Decimal] = None
    mapPrice: Optional[Decimal] = None
    stockLevel: Optional[int] = None

class ProductVariantBase(BaseModel):
    name: str # e.g., Color
    value: str # e.g., Blue

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariant(ProductVariantBase):
    id: str
    class Config:
        orm_mode = True

class ProductImageBase(BaseModel):
    url: str

class ProductImageCreate(ProductImageBase):
    pass

class ProductImage(ProductImageBase):
    id: str
    class Config:
        orm_mode = True

class Product(ProductBase):
    id: str
    vendorId: str
    createdAt: datetime
    images: List[ProductImage] = []
    variants: List[ProductVariant] = []
    
    class Config:
        orm_mode = True
# Sync with Prisma's output structure.
