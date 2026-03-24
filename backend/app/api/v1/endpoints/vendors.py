from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core import security
from ....core.db import prisma
from ....schemas.vendor import Vendor, VendorCreate, VendorUpdate
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.post("/signup", response_model=Response[Vendor], status_code=status.HTTP_201_CREATED)
async def signup(vendor_in: VendorCreate):
    vendor = await prisma.vendor.find_unique(where={"email": vendor_in.email})
    if vendor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vendor with this email already exists",
        )
    
    hashed_password = security.get_password_hash(vendor_in.password)
    
    new_vendor = await prisma.vendor.create(
        data={
            "email": vendor_in.email,
            "passwordHash": hashed_password,
            "storeName": vendor_in.storeName,
            "phoneNumber": vendor_in.phoneNumber,
        }
    )
    return Response(data=new_vendor, message="Registration successful")

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from ....services.cloudinary_service import cloudinary_service

@router.patch("/me", response_model=Vendor)
async def update_vendor_me(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    storeName: str = Form(None),
    category: str = Form(None),
    location: str = Form(None),
    phoneNumber: str = Form(None),
    description: str = Form(None),
    botEnabled: bool = Form(None),
    botPersonality: str = Form(None),
    telegramToken: str = Form(None),
    logo: UploadFile = File(None),
):
    update_data = {}
    if storeName is not None: update_data["storeName"] = storeName
    if category is not None: update_data["category"] = category
    if location is not None: update_data["location"] = location
    if phoneNumber is not None: update_data["phoneNumber"] = phoneNumber
    if description is not None: update_data["description"] = description
    if botEnabled is not None: update_data["botEnabled"] = botEnabled
    if botPersonality is not None: update_data["botPersonality"] = botPersonality
    if telegramToken is not None: update_data["telegramToken"] = telegramToken
    
    if logo:
        url = cloudinary_service.upload_image(logo.file, folder="vendly/logos")
        if url:
            update_data["logoUrl"] = url

    updated_vendor = await prisma.vendor.update(
        where={"id": current_vendor.id},
        data=update_data
    )
    return Response(data=updated_vendor, message="Profile updated successfully")

@router.get("/me", response_model=Response[Vendor])
async def read_vendor_me(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    return Response(data=current_vendor)
