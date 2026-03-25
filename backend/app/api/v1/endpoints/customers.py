from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from ....core.db import prisma
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.get("/", response_model=Response[List[dict]])
async def read_customers(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    skip: int = 0,
    limit: int = 100,
):
    # Aggregate unique customers from ChatSessions
    # In a more advanced version, we'd have a Customer table.
    # For now, we group by customerIdentifier.
    
    sessions = await prisma.chatsession.find_many(
        where={"vendorId": current_vendor.id},
        take=limit,
        skip=skip,
        order={"updatedAt": "desc"}
    )
    
    customers = []
    for s in sessions:
        # Try to find name/phone from Orders
        latest_order = await prisma.order.find_first(
            where={
                "vendorId": current_vendor.id,
                "OR": [
                    {"customerPhone": s.customerIdentifier},
                    {"telegramChatId": s.customerIdentifier}
                ]
            },
            order={"createdAt": "desc"}
        )
        
        customers.append({
            "id": s.id,
            "identifier": s.customerIdentifier,
            "name": latest_order.customerName if latest_order else "Anonymous",
            "phone": latest_order.customerPhone if latest_order else s.customerIdentifier,
            "lastActive": s.updatedAt,
            "channel": s.channel,
            "orderCount": await prisma.order.count(where={"vendorId": current_vendor.id, "OR": [{"customerPhone": s.customerIdentifier}, {"telegramChatId": s.customerIdentifier}]})
        })
        
    return Response(data=customers)

@router.get("/{identifier}", response_model=Response[dict])
async def read_customer(
    identifier: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    # 1. Get Chat History
    session = await prisma.chatsession.find_first(
        where={"vendorId": current_vendor.id, "customerIdentifier": identifier},
        include={"messages": {"order": {"timestamp": "asc"}}}
    )
    
    # 2. Get Order History
    orders = await prisma.order.find_many(
        where={
            "vendorId": current_vendor.id,
            "OR": [
                {"customerPhone": identifier},
                {"telegramChatId": identifier}
            ]
        },
        include={"items": True},
        order={"createdAt": "desc"}
    )
    
    if not session and not orders:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    return Response(data={
        "identifier": identifier,
        "session": session,
        "orders": orders,
        "totalSpent": sum(float(o.totalAmount) for o in orders if o.status == "PAID")
    })
