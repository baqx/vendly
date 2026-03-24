import os
from dotenv import load_dotenv
from pydantic import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vendly"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: Optional[str] = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: Optional[str] = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: Optional[str] = os.getenv("CLOUDINARY_API_SECRET")

    # Interswitch
    INTERSWITCH_CLIENT_ID: Optional[str] = os.getenv("INTERSWITCH_CLIENT_ID")
    INTERSWITCH_SECRET_KEY: Optional[str] = os.getenv("INTERSWITCH_SECRET_KEY")
    INTERSWITCH_MERCHANT_CODE: Optional[str] = os.getenv("INTERSWITCH_MERCHANT_CODE")
    INTERSWITCH_PAY_ITEM_ID: Optional[str] = os.getenv("INTERSWITCH_PAY_ITEM_ID")
    INTERSWITCH_TERMINAL_ID: Optional[str] = os.getenv("INTERSWITCH_TERMINAL_ID")

    class Config:
        case_sensitive = True

settings = Settings()
