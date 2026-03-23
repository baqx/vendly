import os
import httpx
from typing import Optional

class PaymentService:
    def __init__(self):
        self.merchant_id = os.getenv("INTERSWITCH_MERCHANT_ID")
        self.api_key = os.getenv("INTERSWITCH_API_KEY")
        self.base_url = "https://sandbox.interswitchng.com/collections/api/v1"

    async def create_payment_link(
        self, 
        amount: float, 
        customer_email: str, 
        order_id: str
    ) -> str:
        # Placeholder for Interswitch "Paycode" or "Webpay" integration
        return f"https://webpay.interswitchng.com/pay?ref={order_id}"

payment_service = PaymentService()
