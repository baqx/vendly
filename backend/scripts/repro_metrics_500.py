import asyncio
import httpx
from app.core.db import prisma
from app.core.security import create_access_token
from datetime import timedelta

async def repro():
    try:
        await prisma.connect()
        vendor = await prisma.vendor.find_first()
        if not vendor:
            print("No vendor found.")
            return
        
        token = create_access_token(subject=vendor.id, expires_delta=timedelta(hours=1))
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Check health first
            try:
                health = await client.get("http://127.0.0.1:8000/health")
                print(f"Health: {health.status_code}")
            except Exception as e:
                print(f"Health check failed: {e}")
                return

            response = await client.get(
                "http://127.0.0.1:8000/api/v1/dashboard/metrics",
                headers={"Authorization": f"Bearer {token}"}
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(repro())
