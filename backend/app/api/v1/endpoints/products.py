from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.product import Product, ProductCreate, ProductUpdate, ProductImageCreate, ProductVariantCreate
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.get("/", response_model=Response[List[Product]])
async def read_products(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    skip: int = 0,
    limit: int = 100,
):
    products = await prisma.product.find_many(
        where={"vendorId": current_vendor.id},
        include={"images": True, "variants": True},
        skip=skip,
        take=limit,
    )
    return Response(data=products)

@router.post("/", response_model=Product)
async def create_product(
    *,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    product_in: ProductCreate,
    images: Optional[List[ProductImageCreate]] = None,
    variants: Optional[List[ProductVariantCreate]] = None,
):
    # Create product with nested images and variants
    data = product_in.dict()
    data["vendorId"] = current_vendor.id
    
    # Prisma nested create
    if images:
        data["images"] = {"create": [img.dict() for img in images]}
    if variants:
        data["variants"] = {"create": [v.dict() for v in variants]}
        
    product = await prisma.product.create(
        data=data,
        include={"images": True, "variants": True}
    )
    return product
# Sync with Prisma's output structure.

@router.get("/{id}", response_model=Product)
async def read_product(
    id: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    product = await prisma.product.find_first(
        where={"id": id, "vendorId": current_vendor.id}
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
