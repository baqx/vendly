from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from ....core.db import prisma
from ....schemas.responses import Response
from ....api import deps
from pydantic import BaseModel
from decimal import Decimal
from ....services.interswitch_service import interswitch_service

router = APIRouter()

class PayoutRequest(BaseModel):
    amount: Decimal

class ValidateAccountRequest(BaseModel):
    accountNumber: str
    bankCode: str

@router.post("/", response_model=Response[dict])
async def request_payout(
    payout_in: PayoutRequest,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    if not all([current_vendor.bankName, current_vendor.bankCode, current_vendor.accountNumber, current_vendor.accountName]):
        raise HTTPException(
            status_code=400, 
            detail="Incomplete bank details. Please update your settlement settings with bank, account number, and verified name."
        )
        
    if payout_in.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
        
    if current_vendor.walletBalance < payout_in.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
        
    # Initiate real Interswitch transfer
    try:
        transfer_result = await interswitch_service.initiate_transfer(
            amount=float(payout_in.amount),
            account_number=current_vendor.accountNumber,
            bank_code=current_vendor.bankCode,
            sender_name=current_vendor.storeName,
            beneficiary_name=current_vendor.accountName
        )
        
        if transfer_result.get("ResponseCode") != "90000":
            raise HTTPException(
                status_code=400, 
                detail=f"Transfer failed: {transfer_result.get('ResponseCodeGrouping', 'Unknown error')}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
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
        
    return Response(data={"transactionId": new_tx.id, "interswitchRef": transfer_result.get("TransactionReference")}, message="Payout successful")

@router.get("/banks")
async def get_banks(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    try:
        banks = await interswitch_service.get_banks()
        return Response(data=banks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate")
async def validate_account(
    req: ValidateAccountRequest,
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    try:
        result = await interswitch_service.name_enquiry(req.accountNumber, req.bankCode)
        return Response(data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=Response[List[dict]])
async def list_payouts(
    current_vendor: Any = Depends(deps.get_current_active_vendor),
):
    payouts = await prisma.transaction.find_many(
        where={"vendorId": current_vendor.id, "type": "PAYOUT"},
        order={"timestamp": "desc"}
    )
    return Response(data=payouts)
