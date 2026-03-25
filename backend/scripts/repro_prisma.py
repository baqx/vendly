import asyncio
import os
from dotenv import load_dotenv
from prisma import Prisma

load_dotenv()

async def main():
    db = Prisma()
    await db.connect()
    
    token = "8731969925:AAEuMIIlTHyHTM4UIvCKZz6j9kGx4UFvUAM"
    print(f"Testing query for token: {token}")
    
    try:
        vendor = await db.vendor.find_first(
            where={
                "telegramToken": token
            }
        )
        if vendor:
            print(f"Vendor found: {vendor.storeName} (ID: {vendor.id})")
        else:
            print("No vendor found with that token.")
    except Exception as e:
        print(f"Error during query: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
