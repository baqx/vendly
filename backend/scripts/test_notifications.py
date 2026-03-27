import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQ2MjkwMjEsInN1YiI6ImNtbjNmNDZiMzAwMDBlOXJwbGgxOXZhbDgifQ.2Phf6fJeFcSaczXLsa7X91gnrTqYfsLeE0n0Zme9y4w"

def test_notifications():
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    
    print("Testing /notifications/unread-count...")
    try:
        r = requests.get(f"{BASE_URL}/notifications/unread-count", headers=headers)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

    print("\nTesting /notifications/...")
    try:
        r = requests.get(f"{BASE_URL}/notifications/", headers=headers)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Note: This script requires a valid AUTH_TOKEN to work if authentication is enabled.
    test_notifications()
