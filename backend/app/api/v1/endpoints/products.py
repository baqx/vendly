from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
import json
from ....core.db import prisma
from ....schemas.product import Product, ProductCreate
from ....schemas.responses import Response
from ....api import deps
from ....services.cloudinary_service import cloudinary_service

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
    title: str = Form(...),
    description: str = Form(None),
    basePrice: float = Form(...),
    mapPrice: float = Form(...),
    stockLevel: int = Form(0),
    images: List[UploadFile] = File(None),
    variants: str = Form(None), # JSON string for variants
):
    image_urls = []
    if images:
        for image in images:
            if image and image.filename: # Ensure it's a real file upload
                url = cloudinary_service.upload_image(image.file)
                if url:
                    image_urls.append({"url": url})

    # Prepare data for Prisma
    data = {
        "vendorId": current_vendor.id,
        "title": title,
        "description": description,
        "basePrice": basePrice,
        "mapPrice": mapPrice,
        "stockLevel": stockLevel,
        "images": {"create": image_urls}
    }
    
    if variants:
        try:
            v_data = json.loads(variants)
            data["variants"] = {"create": v_data}
        except Exception:
            pass
            
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
        where={"id": id, "vendorId": current_vendor.id},
        include={"images": True, "variants": True}
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.patch("/{id}", response_model=Product)
async def update_product(
    id: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    title: str = Form(None),
    description: str = Form(None),
    basePrice: float = Form(None),
    mapPrice: float = Form(None),
    stockLevel: int = Form(None),
    images: List[UploadFile] = File(None),
    variants: str = Form(None),
):
    # Check if product exists and belongs to vendor
    db_product = await prisma.product.find_first(
        where={"id": id, "vendorId": current_vendor.id}
    )
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {}
    if title is not None: update_data["title"] = title
    if description is not None: update_data["description"] = description
    if basePrice is not None: update_data["basePrice"] = basePrice
    if mapPrice is not None: update_data["mapPrice"] = mapPrice
    if stockLevel is not None: update_data["stockLevel"] = stockLevel
    
    if images:
        image_urls = []
        for image in images:
            url = cloudinary_service.upload_image(image.file)
            if url:
                image_urls.append({"url": url})
        if image_urls:
            # For simplicity, we append new images. 
            # In a real app, we might want to replace them.
            update_data["images"] = {"create": image_urls}

    if variants:
        try:
            v_data = json.loads(variants)
            # Replace variants
            await prisma.productvariant.delete_many(where={"productId": id})
            update_data["variants"] = {"create": v_data}
        except Exception:
            pass

    updated_product = await prisma.product.update(
        where={"id": id},
        data=update_data,
        include={"images": True, "variants": True}
    )
    return updated_product

@router.delete("/{id}", response_model=Response)
async def delete_product(
    id: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    # Check existence
    db_product = await prisma.product.find_first(
        where={"id": id, "vendorId": current_vendor.id}
    )
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    await prisma.product.delete(where={"id": id})
    return Response(message="Product deleted successfully")
