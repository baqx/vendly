import asyncio
from app.services.ai_service import ai_service
from app.core.db import prisma

async def debug():
    await prisma.connect()
    vendor = await prisma.vendor.find_first(where={"email": "boutique@vendly.app"})
    products = await prisma.product.find_many(where={"vendorId": vendor.id})
    
    # Simulate a "Hi" message
    history = []
    response = await ai_service.generate_response(
        "Hi", 
        vendor.storeName, 
        vendor.botPersonality, 
        products, 
        history
    )
    print("--- RAW AI RESPONSE ---")
    print(response)
    print("--- END ---")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(debug())
