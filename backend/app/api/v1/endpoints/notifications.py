from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.notification import Notification, NotificationUpdate
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.get("/", response_model=Response[List[Notification]])
async def read_notifications(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    skip: int = 0,
    limit: int = 50,
):
    notifications = await prisma.notification.find_many(
        where={"vendorId": current_vendor.id},
        order={"createdAt": "desc"},
        skip=skip,
        take=limit,
    )
    return Response(data=notifications)

@router.patch("/{id}/read", response_model=Response[Notification])
async def mark_notification_as_read(
    id: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    notification = await prisma.notification.find_unique(where={"id": id})
    if not notification or notification.vendorId != current_vendor.id:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    updated = await prisma.notification.update(
        where={"id": id},
        data={"isRead": True}
    )
    return Response(data=updated, message="Notification marked as read")

@router.patch("/read-all", response_model=Response[dict])
async def mark_all_notifications_as_read(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    await prisma.notification.update_many(
        where={"vendorId": current_vendor.id, "isRead": False},
        data={"isRead": True}
    )
    return Response(data={"status": "success"}, message="All notifications marked as read")

@router.get("/unread-count", response_model=Response[int])
async def get_unread_count(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    count = await prisma.notification.count(
        where={"vendorId": current_vendor.id, "isRead": False}
    )
    return Response(data=count)
