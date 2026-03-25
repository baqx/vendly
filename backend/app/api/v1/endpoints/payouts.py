from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.responses import Response
from ....api import deps
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter()

class PayoutRequest(BaseModel):
    amount: Decimal

@router.post("/", response_model=Response[dict])
async def request_payout(
    payout_in: PayoutRequest,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    if not all([current_vendor.bankName, current_vendor.accountNumber, current_vendor.accountName]):
        raise HTTPException(
            status_code=400, 
            detail="Incomplete bank details. Please update your profile with bank name, account number, and account name."
        )
        
    if payout_in.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
        
    if current_vendor.walletBalance < payout_in.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
        
    # In a real app, this might trigger a bank transfer API (e.g., Mono/Flutterwave/Paystack)
    # For now, we deduct balance and record a transaction
    
    async with prisma.tx() as transaction:
        # 1. Create Transaction
        new_tx = await transaction.transaction.create(
            data={
                "vendorId": current_vendor.id,
                "amount": -payout_in.amount,
                "type": "PAYOUT"
            }
        )
        
        # 2. Update Vendor Balance
        await transaction.vendor.update(
            where={"id": current_vendor.id},
            data={"walletBalance": {"decrement": payout_in.amount}}
        )
        
    return Response(data={"transactionId": new_tx.id}, message="Payout request successful")

@router.get("/", response_model=Response[List[dict]])
async def list_payouts(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    payouts = await prisma.transaction.find_many(
        where={"vendorId": current_vendor.id, "type": "PAYOUT"},
        order={"timestamp": "desc"}
    )
    return Response(data=payouts)
