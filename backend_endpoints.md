a# Vendly: Backend Endpoints (FastAPI)

The backend is built with FastAPI (Python) and handles all core logic, AI prompt engineering, and payment/logistics integrations.

## 1. Authentication (`/auth`)
- `POST /register`: Register a new vendor.
- `POST /login`: Generate JWT tokens.
- `POST /refresh`: Refresh session tokens.

## 2. Vendor Profile (`/vendor`)
- `GET /me`: Get logged-in vendor details.
- `PATCH /me`: Update store settings (Name, Category, Location).
- `GET /bot/settings`: Get AI persona and bot configs.
- `PATCH /bot/settings`: Update AI persona, haggling limits, etc.
- `POST /bot/profile`: Update Telegram bot name/description/photo (via Token).

## 3. Inventory (`/inventory`)
- `GET /`: List all products (includes variants, reviews, multiple images).
- `POST /`: Add a new product.
- `GET /{id}`: Get product details.
- `PATCH /{id}`: Update product info.
- `DELETE /{id}`: Remove a product.
- `POST /upload`: Endpoint for image uploads (Cloudinary integration).

## 4. Bot & Chat (`/bot`)
- `POST /webhook/whatsapp`: Receives incoming messages from WhatsApp API (Meta).
- `POST /webhook/telegram`: Receives incoming messages from Telegram API.
- `GET /chats`: List all active/recent chat sessions.
- `GET /chats/{session_id}`: Retrieve message history for a session.
- `POST /chats/{session_id}/takeover`: Flag a chat for human intervention and disable AI.

## 5. Orders & Payments (`/orders`)
- `GET /`: List all orders with status (Pending, Success, Failed).
- `POST /create`: (Internal) Create an order based on bot interaction.
- `POST /payment/initialize`: Generate Interswitch payment link/virtual account.
- `POST /payment/verify/{ref}`: Server-side check for payment status.
- `POST /webhook/interswitch`: Async notification from Interswitch.

## 6. Earnings & Payouts (`/finance`)
- `GET /balance`: View current wallet balance and total earnings.
- `GET /transactions`: List all successful sales and commission deductions.
- `POST /payout`: Request a payout to the vendor's bank account.

## 7. Coupons & Campaigns (`/coupons`)
- `GET /`: List all active and expired coupons.
- `POST /`: Create a new coupon code (Code, Discount Type, Value, Constraints).
- `PATCH /{id}`: Update or deactivate a coupon.
- `DELETE /{id}`: Remove a coupon.

## 8. AI Engine (`/ai`)
- `POST /generate`: (Internal) Process an incoming message through Groq (Llama-3) with vendor-specific context.

---

## Technicalities (Backend)
- **Database:** PostgreSQL (with SQLAlchemy/tortoise-orm) for relational data (Vendors, Products, Orders).
- **Caching/Queue:** Redis for message queuing and active session states.
- **LLM Integration:** Asynchronous `httpx` calls to Groq Cloud.
- **Security:** OAuth2 password bearer with JWT. Environment variables for all API keys (Interswitch, Groq, Meta).
