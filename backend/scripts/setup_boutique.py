import httpx
import asyncio
import os

BASE_URL = "http://127.0.0.1:8002/api/v1"

async def setup_boutique():
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Signup
        print("Registering Boutique Vendor...")
        reg_data = {
            "email": "boutique@vendly.app",
            "password": "boutique-pass",
            "storeName": "Glamour Boutique",
            "phoneNumber": "+234800112233"
        }
        r = await client.post(f"{BASE_URL}/vendors/signup", json=reg_data)
        print(f"Signup: {r.status_code}")
        
        # 2. Login
        print("Logging in...")
        login_data = {"username": "boutique@vendly.app", "password": "boutique-pass"}
        r = await client.post(f"{BASE_URL}/auth/login", data=login_data)
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 3. Add Products
        print("Adding Boutique Products...")
        products = [
            {
                "title": "Silk Evening Dress",
                "description": "Elegant emerald green silk dress for formal events.",
                "basePrice": 45000,
                "mapPrice": 40000,
                "stockLevel": 10,
                "tags": "clothing, dress, formal"
            },
            {
                "title": "Designer Handbag",
                "description": "Premium leather handbag with gold-plated buckles.",
                "basePrice": 30000,
                "mapPrice": 25000,
                "stockLevel": 5,
                "tags": "accessories, bag, luxury"
            },
            {
                "title": "Leather Loafers",
                "description": "Comfortable and stylish brown leather loafers.",
                "basePrice": 20000,
                "mapPrice": 18000,
                "stockLevel": 15,
                "tags": "shoes, footwear, casual"
            }
        ]
        
        for p in products:
            # The endpoint expects Form fields
            data = {
                "title": p["title"],
                "description": p["description"],
                "basePrice": str(p["basePrice"]),
                "mapPrice": str(p["mapPrice"]),
                "stockLevel": str(p["stockLevel"]),
                "tags": p["tags"]
            }
            # Optional logo file
            files = {'logo': ('product.png', b'dummy', 'image/png')}
            r = await client.post(f"{BASE_URL}/products/", headers=headers, data=data, files=files)
            print(f"Created {p['title']}: {r.status_code}")

if __name__ == "__main__":
    asyncio.run(setup_boutique())
