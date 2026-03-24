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

from ....services.payment_service import payment_service

@router.post("/", response_model=Order)
async def create_order(
    *,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    order_in: OrderCreate,
):
    # 1. Create the order in the database with nested items
    order = await prisma.order.create(
        data={
            "customerName": order_in.customerName,
            "customerPhone": order_in.customerPhone,
            "shippingAddress": order_in.shippingAddress,
            "totalAmount": order_in.totalAmount,
            "telegramChatId": order_in.telegramChatId,
            "notes": order_in.notes,
            "vendorId": current_vendor.id,
            "items": {
                "create": [
                    {
                        "productId": item.productId,
                        "quantity": item.quantity,
                        "price": item.price,
                        "variant": item.variant
                    } for item in order_in.items
                ]
            }
        },
        include={"items": True}
    )
    
    payment_link = await payment_service.create_payment_link(
        amount=float(order.totalAmount),
        customer_email=f"{order.customerPhone}@vendly.com", # Placeholder if email missing
        order_id=order.id
    )
    
    # We can return this in a custom response or just give the order + link
    return {**order.__dict__, "paymentLink": payment_link}
