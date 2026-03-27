import asyncio
from app.core.db import prisma
from app.core.security import create_access_token
from datetime import timedelta

async def get_test_token():
    # Find any vendor
    try:
        await prisma.connect()
        vendor = await prisma.vendor.find_first()
        if not vendor:
            print("Error: No vendor found in database.")
            return
        
        # Create token with vendor ID as 'sub'
        token = create_access_token(subject=vendor.id, expires_delta=timedelta(hours=1))
        print(f"TEST_TOKEN={token}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(get_test_token())
