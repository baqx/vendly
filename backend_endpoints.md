# Vendly: Backend Endpoints (FastAPI)

The backend is built with FastAPI (Python) and handles all core logic, AI prompt engineering, and payment/logistics integrations.

## 1. Authentication (`/auth`)
- `POST /signup`: Register a new vendor.
- `POST /login`: Generate JWT tokens (Returns `accessToken`).
- `POST /refresh`: Refresh session tokens.

## 2. Vendors Profile (`/vendors`)
- `GET /me`: Get logged-in vendor details.
- `PATCH /me`: Update store settings and AI Bot config (Multipart/Form-Data for logo).

## 3. Products (`/products`)
- `GET /`: List all products for the current vendor.
- `POST /`: Add a new product (Multipart/Form-Data for images).
- `GET /{id}`: Get product details.
- `PATCH /{id}`: Update product info.
- `DELETE /{id}`: Remove a product.

## 4. Webhooks (`/webhooks`)
- `POST /telegram/{token}`: Receives incoming messages from Telegram API.
- `POST /interswitch`: Async notification from Interswitch for payment verification.
- `GET /whatsapp`: Meta Webhook Verification.
- `POST /whatsapp`: Receives incoming messages from WhatsApp API (Pending).

## 5. Orders & Transactions (`/orders` & `/transactions`)
- `GET /orders/`: List all vendor orders.
- `POST /orders/`: Create a new order (Automatically generates payment link).
- `GET /transactions/`: List all financial transactions.

## 6. Coupons (`/coupons`)
- `GET /`: List all active and expired coupons.
- `POST /`: Create a new coupon.

## 7. AI Engine (`/ai`)
- `POST /generate`: Process prompt through Groq (Llama-3) with product context.

---

## Technicalities (Backend)
- **Database:** PostgreSQL (with Prisma) for relational data.
- **Media:** Cloudinary for image and logo storage.
- **LLM Integration:** Asynchronous `httpx` calls to Groq Cloud.
- **Security:** OAuth2 password bearer with JWT. Environment variables for all API keys.
