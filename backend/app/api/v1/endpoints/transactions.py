from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.transaction import Transaction, TransactionCreate
from ....schemas.responses import Response
from ....api import deps

router = APIRouter()

@router.get("/summary", response_model=Response[dict])
async def read_transaction_summary(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    # 1. Total Earned (SALE)
    sales = await prisma.transaction.find_many(
        where={"vendorId": current_vendor.id, "type": "SALE"}
    )
    total_earned = sum(float(tx.amount) for tx in sales)
    
    # 2. Total Withdrawn (PAYOUT)
    payouts = await prisma.transaction.find_many(
        where={"vendorId": current_vendor.id, "type": "PAYOUT"}
    )
    total_withdrawn = sum(abs(float(tx.amount)) for tx in payouts)
    
    return Response(data={
        "totalEarned": total_earned,
        "totalWithdrawn": total_withdrawn,
        "currentBalance": float(current_vendor.walletBalance),
        "pendingPayouts": 0.0 # Placeholder for now
    })

@router.get("/", response_model=Response[List[Transaction]])
async def read_transactions(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
    skip: int = 0,
    limit: int = 100,
):
    transactions = await prisma.transaction.find_many(
        where={"vendorId": current_vendor.id},
        include={"order": True},
        skip=skip,
        take=limit,
        order={"timestamp": "desc"}
    )
    return Response(data=transactions)
