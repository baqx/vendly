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
            f"You are {store_name}'s Digital Sales Employee. "
            f"Your personality is: {persona}. "
            f"Vendor Contact: {vendor_context.get('phoneNumber', 'Not provided')}. "
            f"Current Customer: {customer_context_text}"
            f"Order History Context: {order_history_text}\n"
            f"Guidelines: Be helpful, close sales, negotiate fairly based on product MAP price. "
            f"Data Collection: If customer name, email, or phone is 'Unknown', you MUST ask for them before finalizing an order. "
            f"Once the customer provides their name, email, or phone, include 'SET_CUSTOMER: {{\"name\": \"...\", \"email\": \"...\", \"phone\": \"...\"}}' in your response (only include the fields provided). "
            f"Consutative Selling: If a customer mentions a problem or a casual need (e.g., 'I am cold' or 'I need a gift'), scan the 'Available Products' list, descriptions, and tags to suggest relevant items. "
            f"If the customer asks about order status or details, use the 'Order History Context' provided. "
            f"If multiple orders exist and the request is vague, list the recent orders (Order ID and Date) and ask which one they need help with. "
            f"If they provide an Order ID that isn't in your immediate history context, politely ask them to double check the reference. "
            f"NEVER sell below the MAP price. If a customer asks for a price lower than MAP, politely explain that's the best you can do. "
            f"If the customer asks for a human, says they are angry, or requests help a bot cannot provide, include 'TRANSFER_TO_HUMAN' in your response. "
            f"Always try to close the sale with a payment link once they agree.\n"
            f"{product_info}"
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
