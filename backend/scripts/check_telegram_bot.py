import asyncio
import httpx
import sys

async def check_bot(token: str):
    base_url = f"https://api.telegram.org/bot{token}"
    
    print(f"--- Checking Bot Token: {token[:10]}... ---")
    
    async with httpx.AsyncClient() as client:
        # 1. getMe
        try:
            r = await client.get(f"{base_url}/getMe")
            if r.status_code == 200:
                data = r.json()
                bot = data['result']
                print(f"[OK] Token is Valid!")
                print(f"Bot Name: {bot.get('first_name')}")
                print(f"Username: @{bot.get('username')}")
            else:
                print(f"[ERROR] Token is Invalid! Status: {r.status_code}")
                return
        except Exception as e:
            print(f"[ERROR] calling getMe: {str(e)}")
            return

        # 2. getWebhookInfo
        try:
            r = await client.get(f"{base_url}/getWebhookInfo")
            if r.status_code == 200:
                data = r.json()
                webhook = data['result']
                url = webhook.get('url', 'NOT SET')
                print(f"--- Webhook Status ---")
                print(f"URL: {url}")
                print(f"Pending updates: {webhook.get('pending_update_count')}")
                print(f"Last error: {webhook.get('last_error_message', 'None')}")
            else:
                print(f"[ERROR] Could not get webhook info. Status: {r.status_code}")
        except Exception as e:
            print(f"❌ Error calling getWebhookInfo: {str(e)}")

if __name__ == "__main__":
    token = "8626498181:AAGqJtaNLOzUBKMBnMlAU36NFBDGIcahdAg"
    if len(sys.argv) > 1:
        token = sys.argv[1]
    asyncio.run(check_bot(token))
