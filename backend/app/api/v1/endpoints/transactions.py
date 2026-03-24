from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.transaction import Transaction, TransactionCreate
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.get("/", response_model=Response[List[Transaction]])
async def read_transactions(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    skip: int = 0,
    limit: int = 100,
):
    transactions = await prisma.transaction.find_many(
        where={"vendorId": current_vendor.id},
        skip=skip,
        take=limit,
        order={"timestamp": "desc"}
    )
    return Response(data=transactions)
