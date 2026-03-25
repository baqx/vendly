import asyncio
import httpx
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

async def test_earnings():
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Login
        login_data = {"username": "test@example.com", "password": "password123"}
        r = await client.post(f"{BASE_URL}/auth/login", data=login_data)
        token = r.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        print("--- Testing Earnings Summary ---")
        r = await client.get(f"{BASE_URL}/transactions/summary", headers=headers)
        print(f"Summary Status: {r.status_code}")
        print(f"Data: {json.dumps(r.json().get('data'), indent=2)}")
        
        print("\n--- Testing Payout Validation (Should Fail) ---")
        # Ensure bank details are empty first (for the test vendor)
        await client.patch(f"{BASE_URL}/vendors/me", data={"bankName": ""}, headers=headers)
        
        payout_data = {"amount": 50.0}
        r = await client.post(f"{BASE_URL}/payouts/", json=payout_data, headers=headers)
        print(f"Payout (No Bank) Status: {r.status_code}")
        print(f"Body: {r.text}")
        assert r.status_code == 400
        
        print("\n--- Testing Payout Validation (Should Succeed with Balance) ---")
        # Add some initial balance if needed (manual db injection usually, but we'll just check logic)
        await client.patch(f"{BASE_URL}/vendors/me", data={
            "bankName": "Test Bank",
            "accountNumber": "1234567890",
            "accountName": "Test Account"
        }, headers=headers)
        
        # We might not have enough balance to test the actual payout, but the 400 'Insufficient' is better than 400 'Incomplete bank'
        r = await client.post(f"{BASE_URL}/payouts/", json=payout_data, headers=headers)
        print(f"Payout (With Bank) Status: {r.status_code}")
        print(f"Body: {r.text}")
        # If balance is 0, it should say 'Insufficient funds', NOT 'Incomplete bank details'
        if "Insufficient funds" in r.text or r.status_code == 200:
            print("Validation passed (Bank details recognized)")
        else:
            print("Validation failed!")

if __name__ == "__main__":
    asyncio.run(test_earnings())
