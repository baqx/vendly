from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from ....services.ai_service import ai_service
from ....schemas.chat import ChatResponse, ChatMessage
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.post("/chat", response_model=Response[ChatResponse])
async def chat_with_bot(
    *,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    message_in: ChatMessage,
):
    response_text = await ai_service.generate_response(
        prompt=message_in.content,
        history=[],
        vendor_context=current_vendor.dict()
    )
    return Response(data=ChatResponse(response=response_text))
