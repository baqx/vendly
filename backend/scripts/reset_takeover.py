from prisma import Prisma
import asyncio

async def reset():
    prisma = Prisma()
    await prisma.connect()
    await prisma.chatsession.update_many(
        where={},
        data={"humanTakeover": False}
    )
    print("All sessions reset: humanTakeover=False")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(reset())
