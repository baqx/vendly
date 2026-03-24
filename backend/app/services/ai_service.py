import os
import httpx
from typing import Optional, List
from ..core.config import settings

class AIService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"

    async def generate_response(
        self, 
        prompt: str, 
        history: List[dict], 
        vendor_context: dict,
        products: List[dict] = None
    ) -> str:
        # Construct messages for the AI
        store_name = vendor_context.get("storeName", "Vendly Store")
        persona = vendor_context.get("botPersonality", "Professional & Courteous")
        haggling_limit = vendor_context.get("hagglingLimit", 0.0)
        
        product_info = ""
        if products:
            product_info = "\nAvailable Products:\n" + "\n".join([
                f"- {p['title']}: {p['basePrice']} (Min price: {p['mapPrice']}). Stock: {p['stockLevel']}. Tags: {p['tags']}. Description: {p['description']}. Image: {p['imageUrl'] or 'No image available'}" 
                for p in products
            ])

        order_history_text = ""
        if vendor_context.get("orderHistory"):
            order_history_text = "\nCustomer Order History:\n" + "\n".join([
                f"- Order #{o['id'][:8]} ({o['date']}): {o['status']}. Items: {o['items']}" 
                for o in vendor_context["orderHistory"]
            ])

        cust = vendor_context.get("customerInfo", {})
        customer_context_text = (
            f"Customer Name: {cust.get('name') or 'Unknown'}. "
            f"Customer Email: {cust.get('email') or 'Unknown'}. "
            f"Customer Phone: {cust.get('phone') or 'Unknown'}.\n"
        )

        system_prompt = (
            f"You are the digital sales presence for '{store_name}'. Speak as a helpful human. "
            "NEVER identify as AI or a bot.\n\n"
            f"Personality: {persona}\n"
            f"Available Products:\n{product_info}\n\n"
            "Rules:\n"
            "1. If the customer provides name/email/phone, use: SET_CUSTOMER: {\"name\": \"...\", \"email\": \"...\", \"phone\": \"...\"}\n"
            "2. If they are ready to buy, use: CREATE_ORDER: {\"items\": [{\"title\": \"EXACT_PRODUCT_TITLE\", \"quantity\": 1}]}\n"
            "3. Use TRANSFER_TO_HUMAN if you can't help.\n"
            "4. ALWAYS put the trigger block at the VERY END of your message.\n"
            "5. Ensure JSON is valid (double quotes, no trailing commas)."
        )
        
        messages = [{"role": "system", "content": system_prompt}] + history + [{"role": "user", "content": prompt}]
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": settings.GROQ_MODEL,
                        "messages": messages,
                        "temperature": 0.5, # Slightly lower for more consistent behavior
                        "max_tokens": 1024,
                    },
                    timeout=30.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                return f"Error from AI Service: {response.status_code} - {response.text}"
            except Exception as e:
                return f"AI Service error: {str(e)}"

ai_service = AIService()
