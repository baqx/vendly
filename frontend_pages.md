# Vendly: Frontend Pages (Next.js)

The frontend is a dedicated dashboard for vendors to manage their digital employees and business operations.

## 1. Authentication & Onboarding
- **Login Page (`/login`):** Standard email/password or OAuth login.
- **Signup Page (`/signup`):** Vendor registration.
- **Onboarding Wizard (`/onboarding`):** Setup basic store details (Name, Category, Location).

## 2. Dashboard Overview
- **Home Dashboard (`/dashboard`):** 
    - Real-time sales stats.
    - Active bot status (Online/Offline).
    - Recent "Human Takeover" alerts.
    - Quick links to inventory and orders.

## 3. Bot Management
- **Bot Configuration (`/dashboard/bot`):**
    - Connect WhatsApp/Telegram.
    - **Bot Profile Editor:** Change Telegram bot name and profile picture.
    - Define "Employee Personality" (Brand voice, tone).
    - Settlement rules (Interswitch Merchant ID, bank details).
    - Haggling limits (Max % discount allowed).

## 4. Inventory Management
- **Inventory List (`/dashboard/inventory`):** Table view of all products.
- **Product Detail/Edit (`/dashboard/inventory/[id]`):**
    - Image uploads (via Cloudinary or similar).
    - Technical specs (for electronics).
    - Ingredients/Details (for food/beauty).
    - Sizing/Stock management.

## 5. Order & Logistics
- **Order Management (`/dashboard/orders`):**
    - List of pending, paid, and shipped orders.
    - View chat history leading to the order.
- **Logistics Integration (`/dashboard/logistics`):**
    - GIGL/Gokada tracking overview.
    - Generate waybills manually if needed.

## 6. Earnings & Financials
- **Earnings Page (`/dashboard/earnings`):**
    - Wallet balance overview.
    - Transaction history (Sales vs. Fees).
    - Payout request form.
    - Bank account management for settlements.

## 7. Coupons & Campaigns
- **Coupons Manager (`/dashboard/coupons`):**
    - Create and manage discount codes.
    - Set rules for AI usage (e.g., "Only for orders > 20k").
    - View usage statistics for each campaign.

## 8. Real-time Communication
- **Live Chat Console (`/dashboard/chats`):**
    - View all active AI-customer conversations.
    - **Human Takeover Button:** Instantly silence the AI and take over the chat.
    - Notification center for flagged disputes.

---

## Technicalities (Frontend)
- **Framework:** Next.js (App Router).
- **Styling:** Tailwind CSS + Shadcn UI for a premium, accessible interface.
- **State Management:** React Context or Zustand for active chat states.
- **Real-time:** WebSockets (via Socket.io or FastAPI backend) to receive instant chat updates and "Takeover" notifications.
