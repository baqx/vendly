import asyncio
import httpx

async def set_webhook(token: str, url: str):
    endpoint = f"https://api.telegram.org/bot{token}/setWebhook"
    async with httpx.AsyncClient() as client:
        r = await client.post(endpoint, json={"url": url})
        if r.status_code == 200:
            print(f"✅ Webhook successfully set to: {url}")
        else:
            print(f"❌ Failed to set webhook. Status: {r.status_code}")
            print(r.text)

if __name__ == "__main__":
    token = "8626498181:AAGqJtaNLOzUBKMBnMlAU36NFBDGIcahdAg"
    url = "https://vendly-oqsy.onrender.com/api/v1/webhooks/telegram/8626498181:AAGqJtaNLOzUBKMBnMlAU36NFBDGIcahdAg"
    asyncio.run(set_webhook(token, url))
