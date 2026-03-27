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

    # Setup Status Checklist
    profile_completed = bool(current_vendor.storeName and current_vendor.category and current_vendor.location)
    products_added = product_count > 0
    bot_configured = bool(current_vendor.telegramToken)
    
    setup_status = {
        "profileCompleted": profile_completed,
        "productsAdded": products_added,
        "botConfigured": bot_configured,
        "isFullyOnboarded": all([profile_completed, products_added, bot_configured])
    }

    data = {
        "todayRevenue": today_revenue,
        "monthRevenue": month_revenue,
        "walletBalance": float(current_vendor.walletBalance),
        "activeChats": active_chats,
        "takeoverAlerts": takeover_alerts,
        "productCount": product_count,
        "pendingOrders": pending_orders,
        "setupStatus": setup_status,
        "botStatus": {
            "telegram": {
                "active": bool(current_vendor.telegramToken and current_vendor.botEnabled),
                "configured": bool(current_vendor.telegramToken)
            },
            "whatsapp": {
                "active": bool(current_vendor.whatsappMetaToken and current_vendor.botEnabled),
                "configured": bool(current_vendor.whatsappMetaToken)
            }
        }
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

@router.get("/analytics")
async def get_detailed_analytics(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    # Fetch all orders to calculate metrics
    orders = await prisma.order.find_many(
        where={
            "vendorId": current_vendor.id,
            "status": {"in": ["PAID", "DELIVERED", "SHIPPED"]}
        }
    )
    
    total_revenue = sum(float(o.totalAmount) for o in orders)
    total_orders = len(orders)
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0.0
    
    # Simple conversion: orders / chat sessions
    chat_sessions = await prisma.chatsession.count(where={"vendorId": current_vendor.id})
    conversion_rate = (total_orders / chat_sessions * 100) if chat_sessions > 0 else 0.0
    
    # Top Categories (derived from product tags)
    products = await prisma.product.find_many(
        where={"vendorId": current_vendor.id},
        select={"tags": True}
    )
    
    category_counts = {}
    for p in products:
        tag = (p.get("tags") or "General").split(",")[0].strip().title()
        category_counts[tag] = category_counts.get(tag, 0) + 1
        
    total_products = len(products)
    top_categories = []
    colors = ["#16a34a", "#4ade80", "#bbf7d0", "#86efac"]
    for i, (cat, count) in enumerate(sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:3]):
        top_categories.append({
            "label": cat,
            "pct": round(count / total_products * 100) if total_products > 0 else 0,
            "color": colors[i % len(colors)]
        })

    # AI Assisted Sales (Simplified: any order where the customer had a chat session)
    # In a real app, we'd check if the chat happened within X hours of the order.
    # For now, we'll check if the customerName/Identifier exists in chats.
    customer_ids_in_chats = await prisma.chatsession.find_many(
        where={"vendorId": current_vendor.id},
        select={"customerIdentifier": True}
    )
    chat_id_set = {c["customerIdentifier"] for c in customer_ids_in_chats}
    
    ai_assisted_count = 0
    for o in orders:
        if o.customerPhone in chat_id_set:
            ai_assisted_count += 1

    return Response(data={
        "conversionRate": f"{round(conversion_rate, 2)}%",
        "avgOrderValue": avg_order_value,
        "totalOrders": total_orders,
        "topCategories": top_categories,
        "sessionCount": chat_sessions,
        "aiAssistedSales": ai_assisted_count
    })
