import asyncio
import httpx
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

async def test_api():
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("--- Testing Authentication ---")
        login_data = {
            "username": "test@example.com",
            "password": "password123"
        }
        r = await client.post(f"{BASE_URL}/auth/login", data=login_data)
        if r.status_code != 200:
            print(f"Login failed ({r.status_code}), attempting signup...")
            signup_data = {
                "email": "test@example.com",
                "password": "password123",
                "storeName": "Test Store",
                "phoneNumber": "08012345678"
            }
            sr = await client.post(f"{BASE_URL}/vendors/signup", json=signup_data)
            print(f"Signup Status: {sr.status_code}, Body: {sr.text}")
            r = await client.post(f"{BASE_URL}/auth/login", data=login_data)
        
        if r.status_code != 200:
            print(f"Final Login Failed: {r.status_code}, Body: {r.text}")
            return

        token_data = r.json()
        token = token_data.get("access_token")
        if not token:
            print(f"No token received: {token_data}")
            return
            
        headers = {"Authorization": f"Bearer {token}"}
        print("Authenticated successfully.")

        # 2. Test Dashboard Stats
        print("\n--- Testing Dashboard Stats ---")
        r = await client.get(f"{BASE_URL}/dashboard/", headers=headers)
        print(f"Status: {r.status_code}, Body: {r.text}")
        if r.status_code == 200:
            data = r.json().get("data", {})
            print(f"Chart Data Points: {len(data.get('chartData', []))}")
        else:
            print("Dashboard Stats test failed.")

        # 3. Test Products
        print("\n--- Testing Product Lifecycle ---")
        product_form = {
            "title": "Test Product",
            "basePrice": "100.0",
            "mapPrice": "80.0",
            "stockLevel": "10"
        }
        r = await client.post(f"{BASE_URL}/products/", data=product_form, files={}, headers=headers)
        if r.status_code != 200:
            print(f"Product creation failed: {r.status_code}, Body: {r.text}")
            return
            
        product_id = r.json().get("id")
        print(f"Created Product ID: {product_id}")

        patch_data = {"title": "Updated Test Product", "stockLevel": "50"}
        r = await client.patch(f"{BASE_URL}/products/{product_id}", data=patch_data, headers=headers)
        print(f"Patch Status: {r.status_code}")
        if r.status_code == 200:
            assert r.json().get("title") == "Updated Test Product"

        r = await client.delete(f"{BASE_URL}/products/{product_id}", headers=headers)
        print(f"Delete Status: {r.status_code}")

        # 4. Test Customers
        print("\n--- Testing Customer Endpoints ---")
        r = await client.get(f"{BASE_URL}/customers/", headers=headers)
        print(f"List Customers Status: {r.status_code}")

        print("\nVerification complete.")

if __name__ == "__main__":
    asyncio.run(test_api())
