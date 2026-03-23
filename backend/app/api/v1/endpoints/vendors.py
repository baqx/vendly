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

@router.patch("/me", response_model=Vendor)
async def update_vendor_me(
    vendor_in: VendorUpdate,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    updated_vendor = await prisma.vendor.update(
        where={"id": current_vendor.id},
        data=vendor_in.dict(exclude_unset=True)
    )
    return Response(data=updated_vendor, message="Profile updated successfully")

@router.get("/me", response_model=Response[Vendor])
async def read_vendor_me(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    return Response(data=current_vendor)
