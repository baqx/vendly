from fastapi import APIRouter, Request, Header, HTTPException, Query
from ....core.db import prisma
from ....services.ai_service import ai_service

router = APIRouter()

@router.post("/telegram")
async def telegram_webhook(request: Request):
    data = await request.json()
    # 1. Parse TG Update (Message, sender, chat_id)
    # 2. Find/Create ChatSession
    # 3. Call AI Service
    # 4. Reply via TG API
    return {"status": "ok"}

@router.get("/whatsapp")
async def whatsapp_verify(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
):
    # Meta Webhook Verification
    if hub_verify_token == "vendly-token":
        return hub_challenge
    return HTTPException(status_code=403)

@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    data = await request.json()
    # 1. Parse Meta JSON
    # 2. Process message
    return {"status": "ok"}
