import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8002/api/v1"

async def activate_bot():
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Login
        print("Logging in...")
        login_data = {"username": "boutique@vendly.app", "password": "boutique-pass"}
        r = await client.post(f"{BASE_URL}/auth/login", data=login_data)
        if r.status_code != 200:
            print(f"Login failed: {r.status_code} - {r.text}")
            return
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Update Profile with Bot Token
        print("Updating profile with token...")
        data = {
            "telegramToken": "8731969925:AAEuMIIlTHyHTM4UIvCKZz6j9kGx4UFvUAM",
            "botEnabled": "true",
            "botPersonality": "Luxury, professional, and very helpful boutique assistant.",
            "hagglingLimit": "10.0"
        }
        r = await client.patch(f"{BASE_URL}/vendors/me", headers=headers, data=data)
        print(f"Profile Update: {r.status_code}")
        print(r.json())

if __name__ == "__main__":
    asyncio.run(activate_bot())
