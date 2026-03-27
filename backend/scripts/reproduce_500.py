import asyncio
import json
from prisma import Prisma

async def debug():
    prisma = Prisma()
    await prisma.connect()
    try:
        # 1. Find a vendor to act as
        v = await prisma.vendor.find_first()
        if not v:
            print("No vendor found in database.")
            return
            
        # 2. Try to find the specific customer identifier
        identifier = "7381373335"
        print(f"Testing find_first with problematic include for identifier {identifier}...")
        
        # 3. Try reproducing the 500 equivalent at the DB level
        try:
            session = await prisma.chatsession.find_first(
                where={"vendorId": v.id, "customerIdentifier": identifier},
                include={"messages": {"order": {"timestamp": "asc"}}} # This is what I suspect is wrong
            )
            print("Successfully fetched (is the python client supporting this?).")
        except Exception as e:
            print(f"CAUGHT ERROR (AS EXPECTED): {e}")
            
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(debug())
