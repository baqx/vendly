from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.order import Order, OrderCreate
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.get("/", response_model=Response[List[Order]])
async def read_orders(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    skip: int = 0,
    limit: int = 100,
):
    orders = await prisma.order.find_many(
        where={"vendorId": current_vendor.id},
        skip=skip,
        take=limit,
        order={"createdAt": "desc"}
    )
    return Response(data=orders)

@router.post("/", response_model=Order)
async def create_order(
    *,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    order_in: OrderCreate,
):
    order = await prisma.order.create(
        data={
            **order_in.dict(),
            "vendorId": current_vendor.id,
        }
    )
    return order
