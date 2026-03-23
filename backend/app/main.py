from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .core.db import prisma
from .api.v1.api import api_router

app = FastAPI(
    title="Vendly API",
    description="AI-Powered 'Employee as a Service' for Vendors",
    version="1.0.0",
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

@app.get("/")
async def root():
    return {"message": "Welcome to Vendly API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
