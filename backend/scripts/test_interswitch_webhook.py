import hmac
import hashlib
import json
import requests
import time

# Configuration
WEBHOOK_URL = "http://localhost:8000/api/v1/webhooks/interswitch/notify"
SECRET_KEY = "your_secret_key" 

def sign_payload(payload_bytes, secret):
    return hmac.new(
        secret.encode(),
        payload_bytes,
        hashlib.sha512
    ).hexdigest()

def test_webhook():
    payload = {
        "txnRef": "VEN-testref-123",
        "responseCode": "00",
        "amount": 500000, # 5000 Naira in kobo
        "appId": "test_app",
        "paymentLogId": "log_999"
    }
    
    body = json.dumps(payload).encode()
    signature = sign_payload(body, SECRET_KEY)
    
    headers = {
        "Content-Type": "application/json",
        "X-Interswitch-Signature": signature
    }
    
    print(f"Sending request to {WEBHOOK_URL}...")
    try:
        response = requests.post(WEBHOOK_URL, data=body, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_webhook()
