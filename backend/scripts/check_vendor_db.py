import asyncio
from prisma import Prisma

async def check():
    db = Prisma()
    await db.connect()
    try:
        vendor = await db.vendor.find_first()
        if vendor:
            print(f"Vendor Name: {vendor.storeName}")
            print(f"Telegram Token (DB): {vendor.telegramToken}")
            print(f"Is Bot Enabled: {vendor.botEnabled}")
        else:
            print("No vendor found in database.")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(check())
