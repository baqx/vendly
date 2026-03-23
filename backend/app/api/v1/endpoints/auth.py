from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from ....core import security
from ....core.config import settings
from ....core.db import prisma
from ....schemas.token import Token
from ....schemas.responses import Response

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    vendor = await prisma.vendor.find_unique(where={"email": form_data.username})
    if not vendor or not security.verify_password(form_data.password, vendor.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            vendor.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
