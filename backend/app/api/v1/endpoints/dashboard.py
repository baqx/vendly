from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from ....core.db import prisma
from ....schemas.responses import Response
from ....api import deps
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
async def get_dashboard_stats(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    return Response(data=stats)
