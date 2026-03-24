import httpx
import asyncio
import json
import time
from decimal import Decimal

BASE_URL = "http://localhost:8002/api/v1"
TEST_EMAIL = f"test_vendor_{int(time.time())}@vendly.com"
TEST_PASSWORD = "password123"
TOKEN = None
VENDOR_ID = None
PRODUCT_ID = None

async def test_auth():
    global TOKEN
    print("--- Testing Auth ---")
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Signup
        signup_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "storeName": "Test Restaurant",
            "phoneNumber": "+2348000000000"
        }
        r = await client.post(f"{BASE_URL}/vendors/signup", json=signup_data)
        print(f"Signup: {r.status_code} - {r.json().get('message', r.text)}")

        # Login
        login_data = {"username": TEST_EMAIL, "password": TEST_PASSWORD}
        r = await client.post(f"{BASE_URL}/auth/login", data=login_data)
        print(f"Login: {r.status_code} - {r.json() if r.status_code != 200 else ''}")
        if r.status_code == 200:
            TOKEN = r.json().get("access_token")
            print("Login: SUCCESS")
        else:
            print(f"Login: FAILED")

async def test_vendors():
    global VENDOR_ID
    print("\n--- Testing Vendors ---")
    if not TOKEN: return
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {"Authorization": f"Bearer {TOKEN}"}
        r = await client.get(f"{BASE_URL}/vendors/me", headers=headers)
        print(f"Get Vendor Me: {r.status_code}")
        if r.status_code == 200:
            VENDOR_ID = r.json().get("data", {}).get("id")

        # Update profile
        update_data = {"botPersonality": "Friendly"}
        r = await client.patch(f"{BASE_URL}/vendors/me", headers=headers, data=update_data)
        print(f"Patch Vendor Me: {r.status_code}")

async def test_products():
    global PRODUCT_ID
    print("\n--- Testing Products ---")
    if not TOKEN: return
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {"Authorization": f"Bearer {TOKEN}"}
        
        # Create Product (Multipart)
        files = {
            "image": ("test.jpg", b"fake-image-content", "image/jpeg")
        }
        data = {
            "title": "Gourmet Jollof Rice",
            "description": "Spicy and delicious party jollof.",
            "basePrice": "5000.00",
            "mapPrice": "4500.00",
            "stockLevel": "50",
            "tags": "food, spicy, lunch",
            "variants": json.dumps([{"name": "Size", "value": "Large"}])
        }
        r = await client.post(f"{BASE_URL}/products/", headers=headers, data=data, files=files)
        print(f"Create Product: {r.status_code}")
        if r.status_code == 200:
            PRODUCT_ID = r.json().get("id")
            print(f"Product ID: {PRODUCT_ID}")

        # Get Products
        r = await client.get(f"{BASE_URL}/products/", headers=headers)
        print(f"List Products: {r.status_code}")
        
        if PRODUCT_ID:
            r = await client.get(f"{BASE_URL}/products/{PRODUCT_ID}", headers=headers)
            print(f"Read Product: {r.status_code}")

async def test_coupons():
    print("\n--- Testing Coupons ---")
    if not TOKEN: return
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {"Authorization": f"Bearer {TOKEN}"}
        data = {
            "code": f"TEST50_{int(time.time())}",
            "discountType": "FIXED",
            "value": 50.0,
            "minOrderValue": 100.0,
            "active": True
        }
        r = await client.post(f"{BASE_URL}/coupons/", headers=headers, json=data)
        print(f"Create Coupon: {r.status_code} - {r.json() if r.status_code != 200 else ''}")

        r = await client.get(f"{BASE_URL}/coupons/", headers=headers)
        print(f"List Coupons: {r.status_code}")

async def test_orders_and_transactions():
    print("\n--- Testing Orders & Transactions ---")
    if not TOKEN: return
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {"Authorization": f"Bearer {TOKEN}"}
        
        # We need a Product ID to place an order
        if PRODUCT_ID:
            order_data = {
                "customerName": "John Doe",
                "customerPhone": "08012345678",
                "shippingAddress": "123 Lagos St",
                "totalAmount": 5000.00,
                "items": [
                    {
                        "productId": PRODUCT_ID,
                        "quantity": 1,
                        "price": 5000.00,
                        "variant": "Large"
                    }
                ]
            }
            r = await client.post(f"{BASE_URL}/orders/", headers=headers, json=order_data)
            print(f"Create Order: {r.status_code} - {r.json() if r.status_code != 200 else ''}")

        r = await client.get(f"{BASE_URL}/orders/", headers=headers)
        print(f"List Orders: {r.status_code}")

        r = await client.get(f"{BASE_URL}/transactions/", headers=headers)
        print(f"List Transactions: {r.status_code}")

async def test_webhooks():
    print("\n--- Testing Webhooks ---")
    async with httpx.AsyncClient(timeout=30.0) as client:
        tg_payload = {
            "message": {
                "chat": {"id": 12345678},
                "text": "Hello, I want to buy jollof rice"
            }
        }
        r = await client.post(f"{BASE_URL}/webhooks/telegram/test_token", json=tg_payload)
        print(f"Telegram Webhook: {r.status_code}")

        is_payload = {
            "TransactionReference": "TEST_REF_123",
            "Amount": "5000.00",
            "ResponseCode": "00"
        }
        r = await client.post(f"{BASE_URL}/webhooks/interswitch", json=is_payload)
        print(f"Interswitch Webhook: {r.status_code}")

async def main():
    await test_auth()
    await test_vendors()
    await test_products()
    await test_coupons()
    await test_orders_and_transactions()
    await test_webhooks()

if __name__ == "__main__":
    asyncio.run(main())
