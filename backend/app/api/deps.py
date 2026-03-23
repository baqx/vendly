from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from ..core import security
from ..core.config import settings
from ..core.db import prisma
from ..schemas.token import TokenPayload
from ..schemas.vendor import Vendor

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

async def get_current_vendor(
    token: str = Depends(reusable_oauth2)
) -> Vendor:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    vendor = await prisma.vendor.find_unique(where={"id": token_data.sub})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

async def get_current_active_vendor(
    current_vendor: Vendor = Depends(get_current_vendor),
) -> Vendor:
    # Example for active check if we add it to the model later
    return current_vendor
