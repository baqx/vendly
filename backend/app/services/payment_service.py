import os
import httpx
import time
import uuid
import hashlib
import base64
from typing import Optional, Dict
from ..core.config import settings

class PaymentService:
    def __init__(self):
        self.client_id = settings.INTERSWITCH_CLIENT_ID
        self.secret_key = settings.INTERSWITCH_SECRET_KEY
        self.merchant_code = settings.INTERSWITCH_MERCHANT_CODE
        self.pay_item_id = settings.INTERSWITCH_PAY_ITEM_ID
        self.base_url = "https://sandbox.interswitchng.com/collections/api/v1"

    def _generate_signature(self, method: str, url: str, timestamp: str, nonce: str) -> str:
        # Simplified SHA-512 signature for Interswitch
        signature_base = f"{method}{url}{timestamp}{nonce}{self.client_id}{self.secret_key}"
        return hashlib.sha512(signature_base.encode()).hexdigest()

    def get_auth_headers(self, method: str, url: str) -> Dict[str, str]:
        timestamp = str(int(time.time()))
        nonce = uuid.uuid4().hex
        signature = self._generate_signature(method, url, timestamp, nonce)
        
        auth_value = base64.b64encode(self.client_id.encode()).decode()
        
        return {
            "Authorization": f"InterswitchAuth {auth_value}",
            "Timestamp": timestamp,
            "Nonce": nonce,
            "Signature": signature,
            "SignatureMethod": "SHA512",
            "Content-Type": "application/json"
        }

    async def create_payment_link(
        self, 
        amount: float, 
        customer_email: str, 
        order_id: str
    ) -> str:
        amount_kobo = int(amount * 100)
        redirect_url = f"{settings.API_BASE_URL}{settings.API_V1_STR}/webhooks/interswitch/callback"
        
        # Hash order: txn_ref + product_id + pay_item_id + amount + redirect_url + secret_key
        # For simplicity in this flow, product_id is often the same as pay_item_id or just merchant_code
        hash_string = f"{order_id}{self.pay_item_id}{amount_kobo}{redirect_url}{self.secret_key}"
        hash_value = hashlib.sha512(hash_string.encode()).hexdigest()
        
        return (
            f"https://newwebpay.qa.interswitchng.com/collections/w/pay?"
            f"merchantcode={self.merchant_code}&payitemid={self.pay_item_id}"
            f"&amount={amount_kobo}&txnref={order_id}"
            f"&site_redirect_url={redirect_url}&hash={hash_value}"
            f"&currency=566&cust_id={customer_email}"
        )

    async def verify_transaction(self, ref: str, amount: float) -> bool:
        amount_kobo = int(amount * 100)
        terminal_id = settings.INTERSWITCH_TERMINAL_ID
        # V2 Purchases query uses terminalid, amount, and transactionreference
        url = f"https://qa.interswitchng.com/api/v2/purchases?terminalid={terminal_id}&amount={amount_kobo}&transactionreference={ref}"
        
        headers = self.get_auth_headers("GET", url)
        
        async with httpx.AsyncClient() as client:
            try:
                print(f"DEBUG: Verifying transaction {ref} at {url}")
                response = await client.get(url, headers=headers)
                print(f"DEBUG: Interswitch response ({response.status_code}): {response.text}")
                if response.status_code == 200:
                    data = response.json()
                    return data.get("ResponseCode") in ["00", "0"]
                return False
            except Exception as e:
                print(f"DEBUG: Interswitch verification error: {e}")
                return False

    def verify_webhook_signature(self, raw_payload: bytes, received_signature: str) -> bool:
        """
        Verify the X-Interswitch-Signature header.
        Interswitch uses HMAC-SHA512 of the entire raw JSON body with the secret key.
        """
        if not received_signature:
            return False
            
        # Create expected signature
        import hmac
        expected_signature = hmac.new(
            self.secret_key.encode(),
            raw_payload,
            hashlib.sha512
        ).hexdigest()
        
        # Security: Consistent time comparison
        return hmac.compare_digest(expected_signature.lower(), received_signature.lower())

payment_service = PaymentService()
