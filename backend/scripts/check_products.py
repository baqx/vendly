from prisma import Prisma
import asyncio
import json

async def check():
    prisma = Prisma()
    await prisma.connect()
    
    vendor = await prisma.vendor.find_first(where={"email": "boutique@vendly.app"})
    if not vendor:
        print("Vendor not found")
        await prisma.disconnect()
        return
        
    products = await prisma.product.find_many(
        where={"vendorId": vendor.id},
        include={"images": True}
    )
    
    print(f"Total Products: {len(products)}")
    for p in products:
        print(f"- {p.title}: {len(p.description or '')} chars in desc, {len(p.images)} images")
        for img in p.images:
            print(f"  Img URL: {img.url[:100]}...")
            
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check())
