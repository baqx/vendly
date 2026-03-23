# Vendly: Technical Specifications

This document outlines the deeper technicalities and architectural decisions behind the Vendly platform.

## 1. Core Tech Stack
- **Backend:** FastAPI (Asynchronous Python 3.12+).
- **Frontend:** Next.js 15 (App Router, Server Components).
- **Database:** PostgreSQL (Cloud-hosted via Neon or similar).
- **LLM Engine:** Groq Cloud (Llama-3 models).
- **Payments:** Interswitch (Card & Transfers).
- **Logistics:** GIGL / Gokada APIs.
- **Real-time:** WebSockets / Polling for dashboard updates.

## 2. AI Implementation (Groq + Llama-3)
- **Prompt Engineering:**
    - **System Role:** Defined as a "Retail Assistant" with access to specific vendor inventory and pricing rules.
    - **Dynamic Injection:** Every API call to Groq includes the current product catalog and previous chat history.
- **Haggling Logic:** 
    - The backend calculates standard math (Price - Discount) before the AI proposes it, ensuring the AI never goes below the vendor's "Minimum Acceptable Price" (MAP).
- **Intent Recognition:** 
    - Custom logic to detect intents like `DISPUTE`, `REFUND`, `COMPLAINT`, and `CHECKOUT`.

## 3. Security & Safety
- **Encryption:** All API communications (Interswitch, Groq) are over TLS 1.3.
- **Auth:** JWT-based authentication for vendors.
- **PII Protection:** Stripping sensitive customer data (like card numbers) before sending chat history to the LLM (if applicable).
- **Rate Limiting:** IP-based and Vendor-based rate limiting on the `/bot` and `/ai` endpoints.

## 4. Scalability & Resilience
- **Redis Integration:** Used for ephemeral session storage and message queuing for high-traffic bots.
- **Background Tasks:** Using FastAPI's `BackgroundTasks` or Celery for non-blocking logistics bookings and email notifications.
- **Error Handling:** Graceful fallback if Groq or Interswitch APIs are down (e.g., notifying the human vendor immediately).

## 5. Edge Case Handling
- **Out of Stock mid-conversation:** 
    - AI is blocked from generating checkout links for items with 0 inventory.
    - AI proactively suggests similar alternatives or "Notify when back in stock."
- **Webhook Delays:** 
    - If payment is made but the webhook is missed, the 'Verify' button on the dashboard allows manual re-query of Interswitch status.
- **Bot Rate Limiting (WhatsApp/TG):** 
    - Implementation of a message queue (Redis) to throttle outgoing messages and avoid being flagged as spam.
- **Unexpected AI Behavior:** 
    - A "Safety Filter" on the backend monitors AI output for sensitive keywords (e.g., inappropriate language) and flags for human takeover automatically.
- **Refunds & Disputes:** 
    - System tracks `refund_id` and links it back to the original Interswitch `transaction_id` for auditing.

## 6. Deployment Architecture (Recommended)
- **Backend:** Dockerized and deployed on Render or AWS App Runner.
- **Frontend:** Vercel (for high-speed Edge delivery).
- **DB:** Managed PostgreSQL for automated backups.

---

## Data Schema (High Level)
- **Vendors:** Store info, API keys, Social IDs.
- **Products:** Title, Description, Technical Specs, Sizing, Pricing, MAP.
- **Orders:** Customer Info, Reference, Amount, Status (Pending/Paid/Shipped).
- **Chats:** Session ID, History (JSONB), Active Flag.
