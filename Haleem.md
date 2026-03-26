Foundation (API + Auth + SWR)

Add NEXT_PUBLIC_API_BASE_URL with default https://vendly-oqsy.onrender.com/api/v1.

Create API client helpers to handle:

Standard wrapper responses ({ success, message, data, error }).
Raw responses (products/orders/chats endpoints that are unwrapped).
Auth header injection from token store.
Implement token store + auth helpers:

setToken, getToken, clearToken backed by LocalStorage + in‑memory cache.
login() and logout() helpers.
Add SWRConfig at app root with a typed fetcher and sensible defaults (revalidate on focus, dedupe interval).

Add a lightweight client‑side auth guard in dashboard layout to redirect unauthenticated users to /login.

Auth & Onboarding

Login (/login): call POST /auth/login with FormData (username, password), store token, route to /dashboard.

Signup (/signup): call POST /vendors/signup with JSON; update copy to “Account created” (no email verification in API), then route to /login.

Add phoneNumber field to signup to align with API payload.

Onboarding: on finish, call PATCH /vendors/me with store/bot fields (storeName, category, location, botPersonality, telegramToken, whatsappMetaToken).

Vendor Profile & Settings

Use GET /vendors/me to populate:

/dashboard/profile
/dashboard/settings
dashboard header store name/logo.
Use PATCH /vendors/me (multipart) for profile updates:

Support logo upload.
Bot config (botEnabled, botPersonality, hagglingLimit, telegramToken, bank details).
Dashboard Overview (/dashboard)

Replace metrics with GET /dashboard data (todayRevenue, monthRevenue, walletBalance, activeChats, takeoverAlerts, productCount, pendingOrders).

Use chartData from /dashboard to drive revenue chart.

Use GET /orders for Recent Orders table.

Use GET /products for Top Sellers (fallback to most recent/highest stock if no sales data).

Inventory (Products)

List (/dashboard/inventory): GET /products?skip&limit, map stockLevel → “In Stock / Low / Out”.

Add (/dashboard/inventory/add): POST /products with FormData.

Add lightweight variants input to match API (variants JSON).
Wire image inputs to actual file selection + preview.
Edit: support ?id= on add page to load a product and PATCH /products/{id} on save.

Detail (/dashboard/inventory/[id]):

Primary: call GET /products/{id} if supported (per backend_endpoints.md).
Fallback: use cached list if API lacks detail.
Delete: DELETE /products/{id} from detail page.

Orders

List (/dashboard/orders): GET /orders?skip&limit, map status to pills.

Detail (/dashboard/orders/[id]): GET /orders/{id}, render line items from API.

Status Update: PATCH /orders/{id}?status=... (progress to next state).

Manual Order (/dashboard/orders/add): POST /orders using live products & customer inputs; on success show payment link.

Transactions & Payouts

Wallet summary: GET /transactions/summary.

History: GET /transactions.

Add a Payouts section or tab to show GET /payouts.

Withdraw: POST /payouts with error handling for detail responses.

Customers

List (/dashboard/customers): GET /customers.

Detail (/dashboard/customers/[identifier]): GET /customers/{identifier} to populate profile, order history, and session messages.

Keep “Add Customer” UI but mark as “API not available” (no create endpoint).

Chats / Messages

Inbox: GET /chats?skip&limit.

Thread: GET /chats/{id}.

Human Takeover: PATCH /chats/{id}/takeover?takeover=true|false.

Disable “Send” action or show a toast explaining vendor‑side send endpoint isn’t available yet.

Coupons (New Page)

Add /dashboard/coupons page and nav link.

Use GET /coupons for list, POST /coupons for create form.

AI Assistant

Upgrade /dashboard/ai to use POST /ai/chat for test prompts.

Tie “Activate/Deactivate Bot” to PATCH /vendors/me (botEnabled).

Search & Analytics

Search page: fetch products/orders/customers in parallel and filter client‑side.

Analytics page: use /dashboard summary for headline metrics; keep detailed charts as static until a dedicated analytics endpoint exists.