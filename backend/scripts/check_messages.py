from prisma import Prisma
import asyncio

async def check():
    prisma = Prisma()
    await prisma.connect()
    
    messages = await prisma.chatmessage.find_many(
        order={"timestamp": "desc"},
        take=50
    )
    
    for m in messages:
        print(f"[{m.role}] Len: {len(m.content)}")
        if len(m.content) > 1000:
            print(f"--- LARGE MESSAGE DETECTED ---\n{m.content[:500]}...")
            
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check())
