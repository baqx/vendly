from typing import Any
from fastapi import APIRouter, Depends
from ....core.db import prisma
from ....schemas.responses import Response
from ....api import deps
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/", response_model=Response[dict])
async def get_dashboard_stats(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    # 1. Sales stats
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = today.replace(day=1)
    
    today_sales = await prisma.transaction.aggregate(
        where={
            "vendorId": current_vendor.id,
            "type": "SALE",
            "timestamp": {"gte": today}
        },
        _sum={"amount": True}
    )
    
    month_sales = await prisma.transaction.aggregate(
        where={
            "vendorId": current_vendor.id,
            "type": "SALE",
            "timestamp": {"gte": month_start}
        },
        _sum={"amount": True}
    )
    
    # 2. Bot Status & Sessions
    active_chats = await prisma.chatsession.count(
        where={"vendorId": current_vendor.id, "active": True}
    )
    
    takeover_alerts = await prisma.chatsession.count(
        where={"vendorId": current_vendor.id, "humanTakeover": True}
    )
    
    # 3. Inventory & Orders
    product_count = await prisma.product.count(where={"vendorId": current_vendor.id})
    pending_orders = await prisma.order.count(
        where={"vendorId": current_vendor.id, "status": "PENDING"}
    )
    
    stats = {
        "todayRevenue": float(today_sales["_sum"]["amount"] or 0),
        "monthRevenue": float(month_sales["_sum"]["amount"] or 0),
        "walletBalance": float(current_vendor.walletBalance),
        "activeChats": active_chats,
        "takeoverAlerts": takeover_alerts,
        "productCount": product_count,
        "pendingOrders": pending_orders,
        "botEnabled": current_vendor.botEnabled
    }
    
    return Response(data=stats)
