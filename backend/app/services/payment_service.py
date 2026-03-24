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
        # In a real integration, we might call Interswitch to get a Paycode or just generate a Webpay URL
        # For Sandbox, we construct a Webpay URL with the merchant code
        # Example: https://webpay.interswitchng.com/pay?ref={order_id}&amount={amount}&merchant={code}
        amount_kobo = int(amount * 100)
        return (
            f"https://sandbox.interswitchng.com/collections/w/pay?"
            f"ref={order_id}&amount={amount_kobo}&merchant={self.merchant_code}"
            f"&item={self.pay_item_id}&email={customer_email}"
        )

    async def verify_transaction(self, ref: str, amount: float) -> bool:
        amount_kobo = int(amount * 100)
        terminal_id = settings.INTERSWITCH_TERMINAL_ID
        url = f"https://qa.interswitchng.com/api/v2/purchases?terminalid={terminal_id}&amount={amount_kobo}&transactionreference={ref}"
        
        headers = self.get_auth_headers("GET", url)
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("ResponseCode") == "00"
                return False
            except Exception:
                return False

payment_service = PaymentService()
