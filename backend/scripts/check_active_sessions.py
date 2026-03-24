from prisma import Prisma
import asyncio

async def check():
    prisma = Prisma()
    await prisma.connect()
    
    sessions = await prisma.chatsession.find_many(
        where={"active": True},
        include={"messages": True}
    )
    
    print(f"Total Active Sessions: {len(sessions)}")
    for s in sessions:
        print(f"Session {s.id}: HumanTakeover={s.humanTakeover}, Messages={len(s.messages)}")
        for m in s.messages[-2:]:
            print(f"  [{m.role}] {m.content[:50]}...")
            
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check())
