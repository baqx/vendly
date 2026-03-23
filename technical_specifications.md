# Vendly: Technical Specifications

This document details the deep technical logic, state management, and security protocols of the Vendly platform.

## 1. Bot Engine Logic (Groq + Llama-3)
- **Context Injection:** Every request to Groq includes a "System Prompt" containing the Vendor's Persona, Store Inventory (RAG-lite), and active Campaign/Coupon rules.
- **Stateful Conversations:** The backend retrieves the last 10 messages from `ChatMessage` to maintain context.
- **Intent Recognition:** The engine is tuned to recognize "Buy," "Discount," and "Help" intents.

## 2. Real-time Synchronization
- **WebSockets:** Used to push incoming WhatsApp/Telegram messages to the Vendor Dashboard in real-time.
- **Human Takeover Hook:** When the "Takeover" flag is active in the database, the Bot Engine is bypassed, and messages are routed directly to the dashboard's live chat console.

## 3. Financial Integrity (DRY)
- **Centralized Ledger:** All money movements (Sales, Payouts, Commissions) must go through the `TransactionService`. This ensures that commission calculations are never duplicated or inconsistent.
- **Interswitch Webhooks:** A single entry point handles all payment confirmations to prevent race conditions.

## 4. Security & Compliance
- **Token Storage:** Telegram and WhatsApp tokens are encrypted at rest.
- **CORS & Auth:** Strict CORS policies and JWT-based authentication for the Vendor Dashboard.
- **Data Privacy:** Personally Identifiable Information (PII) of customers (Phone numbers) is handled according to Nigerian data privacy regulations (NDPR).

## 5. Performance Optimization
- **Caching:** Frequently accessed product metadata is cached to reduce DB load during high-volume chat sessions.
- **Asynchronous Processing:** Heavy tasks like image processing or logistics API calls are handled via background tasks (Celery or FastAPI background tasks).
