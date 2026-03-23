from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.coupon import Coupon, CouponCreate
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.get("/", response_model=Response[List[Coupon]])
async def read_coupons(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    coupons = await prisma.coupon.find_many(
        where={"vendorId": current_vendor.id}
    )
    return Response(data=coupons)

@router.post("/", response_model=Coupon)
async def create_coupon(
    *,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    coupon_in: CouponCreate,
):
    coupon = await prisma.coupon.create(
        data={
            **coupon_in.dict(),
            "vendorId": current_vendor.id,
        }
    )
    return Response(data=coupon, message="Coupon created successfully")
