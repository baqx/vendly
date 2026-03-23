# Groq API Integration Research

Vendly will use Groq Cloud to power its AI "Employee as a Service" bot. Groq provides exceptionally fast inference for Large Language Models (LLMs), which is critical for real-time chat interactions on WhatsApp and Telegram.

## Model Selection
- **Llama 3 (70B or 8B):** We will likely use `llama3-70b-8192` for complex reasoning (haggling, product advice) and `llama3-8b-8192` for simpler, high-speed tasks if needed.
- **Free Tier:** Groq offers a generous free tier for developers, which aligns with the project requirements.

## API Authentication
- **API Key:** Obtained from the Groq Cloud Console.
- **Header:** `Authorization: Bearer <GROQ_API_KEY>`

## HTTP Request Details (Python `httpx` Example)

The backend will communicate with Groq via standard RESTful POST requests.

```python
import httpx
import os

async def get_bot_response(prompt: str):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful vendor assistant for Vendly..."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1024
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
```

## Key Considerations
- **Rate Limits:** We must handle 429 errors gracefully, especially on the free tier.
- **System Prompting:** The "Employee as a Service" persona will be defined in the `system` message, including brand voice, pricing limits for haggling, and escalation rules.
- **Context Window:** Llama-3 handles up to 8k tokens, sufficient for most vendor-customer chat histories.

## Implementation Plan
1.  Store Groq API key in `.env`.
2.  Implement an `AIEngine` class in the FastAPI backend.
3.  Inject vendor-specific data (inventory, return policy) into the prompt for each interaction.
