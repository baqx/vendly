from prisma import Prisma
import asyncio

async def check():
    prisma = Prisma()
    await prisma.connect()
    
    messages = await prisma.chatmessage.find_many(
        order={"timestamp": "desc"},
        take=4,
        include={"session": True}
    )
    
    for m in messages:
        print(f"[{m.role}] {m.timestamp}:")
        print(m.content)
        print("-" * 50)
            
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check())
