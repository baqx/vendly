# WhatsApp Business API Integration Guide for Multi-Vendor Platforms

To enable WhatsApp bots for your vendors, you need to navigate the **WhatsApp Business Platform (API)**. Unlike the standard WhatsApp app, the API is designed for automated, high-volume business communication.

## 1. Core Requirements
*   **Meta Business Manager**: A verified Facebook Business Manager account is mandatory.
*   **A Clean Phone Number**: A number that has **never** been used with a regular WhatsApp or WhatsApp Business app.
*   **SSL-Enabled Backend**: A secure server (like our current FastAPI setup) to receive webhooks from Meta.

## 2. Setup Process
1.  **Create a WABA (WhatsApp Business Account)**: Done via the Meta for Developers portal.
2.  **Phone Number Verification**: Link the dedicated number to the WABA and verify via SMS/Voice.
3.  **Webhook Configuration**: Point Meta's webhook to `https://your-domain.com/api/v1/webhooks/whatsapp`.
4.  **Message Templates**: Pre-approve "Outbound" messages (notifications, order confirmations) with Meta. Customer-initiated chats (Inbound) are free-form.

## 3. Multi-Vendor Architecture
Since Vendly is a platform, you have two options:
*   **Platform-Owned (Easiest)**: You own one WABA and use different "Customer Service" numbers for different vendors, or route messages based on the phone number the customer hits.
*   **On-Behalf-Of (OBO)**: Your vendors create their own WABAs and grant you "Shared Access". This is more complex but better for vendor branding.

## 4. Operational Rules (The "24-Hour Rule")
*   You can only respond to customers for free within **24 hours** of their last message.
*   Outside this window, you **must** use a paid "Message Template".

## 5. Integration into Vendly
Our current `webhooks.py` already has a skeleton for `/whatsapp`. We just need to:
1.  Add the `WHATSAPP_SECRET` and `WHATSAPP_TOKEN` to `.env`.
2.  Implement the JSON parsing for Meta's unique "Cloud API" format (which differs from Telegram).
3.  Reuse the `AIService` logic to generate responses.
