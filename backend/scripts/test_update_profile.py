import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQ2MjkwMjEsInN1YiI6ImNtbjNmNDZiMzAwMDBlOXJwbGgxOXZhbDgifQ.2Phf6fJeFcSaczXLsa7X91gnrTqYfsLeE0n0Zme9y4w"

def test_update_profile():
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
    }
    
    # We use multipart/form-data for PATCH /me
    data = {
        "storeName": "Test Store Updated",
        "description": "This is a test store description.",
        "location": "Lagos, Nigeria",
        "phoneNumber": "+2348000000000",
        "category": "Fashion, Electronics",
        "botEnabled": "true",
        "botPersonality": "friendly and helpful",
        "hagglingLimit": "15.0",
        "bankName": "Access Bank",
        "accountNumber": "0123456789",
        "accountName": "Test Business"
    }
    
    print("Testing PATCH /vendors/me...")
    try:
        r = requests.patch(f"{BASE_URL}/vendors/me", headers=headers, data=data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_update_profile()
