from typing import Any
from fastapi import APIRouter, Depends
from ....core.db import prisma
from ....schemas.responses import Response
from ....api import deps
from datetime import datetime, timedelta
import calendar

router = APIRouter()

@router.get("/metrics")
async def get_dashboard_metrics(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    month_start = datetime(now.year, now.month, 1)

    # Orders query for revenue
    orders = await prisma.order.find_many(
        where={
            "vendorId": current_vendor.id,
            "status": {"in": ["PAID", "DELIVERED", "SHIPPED", "PENDING"]}
        }
    )

    today_revenue = sum(float(o.totalAmount) for o in orders if o.createdAt >= today_start)
    month_revenue = sum(float(o.totalAmount) for o in orders if o.createdAt >= month_start)
    pending_orders = sum(1 for o in orders if o.status == "PENDING")

    active_chats = await prisma.chatsession.count(
        where={
            "vendorId": current_vendor.id,
            "active": True
        }
    )

    takeover_alerts = await prisma.chatsession.count(
        where={
            "vendorId": current_vendor.id,
            "humanTakeover": True
        }
    )

    product_count = await prisma.product.count(
        where={
            "vendorId": current_vendor.id
        }
    )

    data = {
        "todayRevenue": today_revenue,
        "monthRevenue": month_revenue,
        "walletBalance": float(current_vendor.walletBalance),
        "activeChats": active_chats,
        "takeoverAlerts": takeover_alerts,
        "productCount": product_count,
        "pendingOrders": pending_orders
    }

    return Response(data=data)

@router.get("/revenue-chart")
async def get_revenue_chart(
    period: str = "6months",
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    now = datetime.utcnow()
    six_months_ago = now - timedelta(days=6*30)
    
    orders = await prisma.order.find_many(
        where={
            "vendorId": current_vendor.id,
            "status": {"in": ["PAID", "DELIVERED", "SHIPPED"]},
            "createdAt": {"gte": six_months_ago}
        }
    )
    
    chart_data = {}
    for i in range(5, -1, -1):
        d = now - timedelta(days=i*30)
        month_label = f"{calendar.month_abbr[d.month]} '{str(d.year)[2:]}"
        chart_data[month_label] = 0.0

    for order in orders:
        month_label = f"{calendar.month_abbr[order.createdAt.month]} '{str(order.createdAt.year)[2:]}"
        if month_label in chart_data:
            chart_data[month_label] += float(order.totalAmount)

    data = [{"date": k, "amount": v} for k, v in chart_data.items()]
    
    return Response(data=data)

@router.get("/activity-logs")
async def get_activity_logs(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    # Fetch recent orders to simulate activity logs for MVP
    recent_orders = await prisma.order.find_many(
        where={"vendorId": current_vendor.id},
        order={"createdAt": "desc"},
        take=5
    )
    
    logs = []
    for o in recent_orders:
        logs.append({
            "id": f"log_order_{o.id}",
            "type": "ORDER",
            "title": f"New Order Received from {o.customerName}",
            "summary": f"Order total: ₦{o.totalAmount}",
            "detail": f"Order {o.id} is currently {o.status}. Please process.",
            "createdAt": o.createdAt.isoformat()
        })
        
    return Response(data=logs)

@router.get("/tasks")
async def get_dashboard_tasks(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    tasks = []
    
    # 1. Pending Orders
    pending_orders = await prisma.order.find_many(
        where={
            "vendorId": current_vendor.id,
            "status": "PENDING"
        },
        take=5
    )
    for o in pending_orders:
        tasks.append({
            "id": f"task_order_{o.id}",
            "label": f"Ship order object #{o.id[-6:].upper()} to {o.customerName}",
            "urgent": True,
            "actionUrl": f"/dashboard/orders"
        })
        
    # 2. Human Takeover Chats
    takeover_chats = await prisma.chatsession.find_many(
        where={
            "vendorId": current_vendor.id,
            "humanTakeover": True
        },
        take=5
    )
    for c in takeover_chats:
        tasks.append({
            "id": f"task_chat_{c.id}",
            "label": f"Take over chat with {c.customerName or c.customerIdentifier}",
            "urgent": True,
            "actionUrl": "/dashboard/messages"
        })
        
    return Response(data=tasks)
