from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.chat import ChatSession, ChatMessage
from ....api import deps

router = APIRouter()

@router.get("/", response_model=List[ChatSession])
async def read_sessions(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    skip: int = 0,
    limit: int = 100,
):
    sessions = await prisma.chatsession.find_many(
        where={"vendorId": current_vendor.id},
        include={"messages": True},
        skip=skip,
        take=limit,
    )
    return sessions

@router.get("/{id}", response_model=ChatSession)
async def read_session(
    id: str,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    session = await prisma.chatsession.find_first(
        where={"id": id, "vendorId": current_vendor.id},
        include={"messages": True}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.patch("/{id}/takeover")
async def toggle_takeover(
    id: str,
    takeover: bool,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    session = await prisma.chatsession.update(
        where={"id": id},
        data={"humanTakeover": takeover}
    )
    return {"status": "success", "humanTakeover": session.humanTakeover}
