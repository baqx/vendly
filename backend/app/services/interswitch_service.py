import httpx
import hashlib
import time
import base64
from typing import List, Dict, Optional
from ..core.config import settings

class InterswitchService:
    def __init__(self):
        self.client_id = settings.INTERSWITCH_CLIENT_ID
        self.secret_key = settings.INTERSWITCH_SECRET_KEY
        self.terminal_id = settings.INTERSWITCH_TERMINAL_ID
        self.base_url = "https://qa.interswitchng.com/quicktellerservice/api/v5/transactions"
        self.auth_url = "https://passport.interswitchng.com/passport/oauth/token"
        self._token = None
        self._token_expiry = 0

    async def _get_access_token(self) -> str:
        if self._token and time.time() < self._token_expiry:
            return self._token

        auth_str = f"{self.client_id}:{self.secret_key}"
        encoded_auth = base64.b64encode(auth_str.encode()).decode()

        headers = {
            "Authorization": f"Basic {encoded_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"grant_type": "client_credentials"}

        async with httpx.AsyncClient() as client:
            response = await client.post(self.auth_url, headers=headers, data=data)
            if response.status_code != 200:
                raise Exception(f"Failed to get Interswitch token: {response.text}")
            
            res_data = response.json()
            self._token = res_data["access_token"]
            self._token_expiry = time.time() + int(res_data.get("expires_in", 3600)) - 60
            return self._token

    async def get_banks(self) -> List[Dict]:
        token = await self._get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "TerminalId": self.terminal_id
        }

        async with httpx.AsyncClient() as client:
            # Note: The endpoint in some docs is get-bank-codes
            response = await client.get(f"{self.base_url}/get-bank-codes", headers=headers)
            if response.status_code != 200:
                # Fallback to alternative endpoint name if needed
                response = await client.get(f"{self.base_url}/list-of-receiving-institutions", headers=headers)
                
            if response.status_code != 200:
                raise Exception(f"Failed to fetch banks: {response.text}")
            
            # The structure might vary, adjust based on actual response
            data = response.json()
            return data.get("banks", data.get("Institutions", []))

    async def name_enquiry(self, account_number: str, bank_code: str) -> Dict:
        token = await self._get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "TerminalId": self.terminal_id,
            "bankCode": bank_code,
            "accountId": account_number
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/DoAccountNameInquiry", headers=headers)
            if response.status_code != 200:
                raise Exception(f"Name enquiry failed: {response.text}")
            
            return response.json()

    def _calculate_mac(self, amount: str, account_number: str, bank_code: str) -> str:
        # Simplified MAC as per Chunk 19: sha512(...)
        # Need to follow the EXACT concatenation rule from the docs
        # mac = sha512(initiatingAmount + initiatingCurrencyCode + initiatingPaymentMethodCode + 
        #              terminatingAmount + terminatingCurrencyCode + terminatingPaymentMethodCode + 
        #              terminatingCountryCode)
        
        # Default values for Vendly usage
        initiating_amount = amount
        currency_code = "566" # NGN
        payment_method_ca = "CA"
        payment_method_ac = "AC"
        country_code = "NG"
        
        raw_str = (
            initiating_amount + 
            currency_code + 
            payment_method_ca + 
            initiating_amount + 
            currency_code + 
            payment_method_ac + 
            country_code
        )
        return hashlib.sha512(raw_str.encode()).hexdigest()

    async def initiate_transfer(self, amount: float, account_number: str, bank_code: str, 
                                sender_name: str, beneficiary_name: str) -> Dict:
        token = await self._get_access_token()
        amt_kobo = str(int(amount * 100))
        mac = self._calculate_mac(amt_kobo, account_number, bank_code)
        
        headers = {
            "Authorization": f"Bearer {token}",
            "TerminalId": self.terminal_id,
            "Content-Type": "application/json"
        }

        payload = {
            "transferCode": f"VND-{int(time.time()*1000)}", # Unique transfer code
            "mac": mac,
            "termination": {
                "amount": amt_kobo,
                "accountReceivable": {
                    "accountNumber": account_number,
                    "accountType": "00"
                },
                "entityCode": bank_code,
                "currencyCode": "566",
                "paymentMethodCode": "AC",
                "countryCode": "NG"
            },
            "sender": {
                "phone": "08000000000", # Fallback or dynamic
                "email": "payout@vendly.app",
                "lastname": "Vendly",
                "othernames": sender_name
            },
            "initiatingEntityCode": "PBL", # Check if this should be different
            "initiation": {
                "amount": amt_kobo,
                "currencyCode": "566",
                "paymentMethodCode": "CA",
                "channel": "7"
            },
            "beneficiary": {
                "lastname": beneficiary_name.split()[-1] if ' ' in beneficiary_name else beneficiary_name,
                "othernames": ' '.join(beneficiary_name.split()[:-1]) if ' ' in beneficiary_name else "Store"
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(f"{self.base_url}/TransferFunds", headers=headers, json=payload)
            if response.status_code != 200:
                raise Exception(f"Transfer failed: {response.text}")
            
            return response.json()

interswitch_service = InterswitchService()
