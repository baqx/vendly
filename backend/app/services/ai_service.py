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
        vendor_context: dict
    ) -> str:
        # Construct messages for the AI
        store_name = vendor_context.get("storeName", "Vendly Store")
        persona = vendor_context.get("botPersonality", "Professional & Courteous")
        
        system_prompt = (
            f"You are {store_name}'s Digital Sales Employee. "
            f"Your personality is: {persona}. "
            f"Guidelines: Be helpful, close sales, negotiate fairly based on product MAP price. "
            f"Current Store Context: {vendor_context}"
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
