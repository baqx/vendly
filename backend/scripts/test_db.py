import asyncio
import os
import sys
from prisma import Prisma

async def main():
    print("Attempting to connect to database...")
    db = Prisma()
    try:
        await db.connect()
        print("Successfully connected to database!")
        vendors = await db.vendor.find_many()
        print(f"Found {len(vendors)} vendors.")
        await db.disconnect()
    except Exception as e:
        print(f"Database connection failed: {e}")
        # Print environment variable to verify (safely)
        db_url = os.getenv("DATABASE_URL", "NOT_SET")
        print(f"DATABASE_URL ends with: ...{db_url[-20:] if db_url != 'NOT_SET' else ''}")

if __name__ == "__main__":
    asyncio.run(main())
