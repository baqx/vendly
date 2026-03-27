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
        include={"items": True},
        skip=skip,
        take=limit,
        order={"createdAt": "desc"}
    )
    return Response(data=orders)

@router.get("/summary", response_model=Response[dict])
async def read_orders_summary(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    total_orders = await prisma.order.count(where={"vendorId": current_vendor.id})
    pending_orders = await prisma.order.count(where={"vendorId": current_vendor.id, "status": "PENDING"})
    delivered_orders = await prisma.order.count(where={"vendorId": current_vendor.id, "status": "DELIVERED"})
    
    # Sum of all paid orders
    paid_sum = await prisma.order.aggregate(
        where={"vendorId": current_vendor.id, "status": {"in": ["PAID", "DELIVERED", "SHIPPED"]}},
        _sum={"totalAmount": True}
    )
    
    total_amount = float(paid_sum.get("_sum", {}).get("totalAmount") or 0)
    avg_order_value = total_amount / total_orders if total_orders > 0 else 0
    delivery_rate = (delivered_orders / total_orders * 100) if total_orders > 0 else 0
    
    return Response(data={
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "deliveredOrders": delivered_orders,
        "totalRevenue": total_amount,
        "avgOrderValue": avg_order_value,
        "deliveryRate": delivery_rate
    })

from ....services.payment_service import payment_service

@router.post("/", response_model=Response[dict])
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
    return Response(data={**order.__dict__, "paymentLink": payment_link}, message="Order created successfully")

@router.get("/{id}", response_model=Response[Order])
async def read_order(
    id: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    order = await prisma.order.find_first(
        where={"id": id, "vendorId": current_vendor.id},
        include={"items": {"include": {"product": True}}}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Response(data=order)

@router.patch("/{id}", response_model=Response[Order])
async def update_order_status(
    id: str,
    status: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    order = await prisma.order.update(
        where={"id": id},
        data={"status": status}
    )
    return Response(data=order, message=f"Order status updated to {status}")
