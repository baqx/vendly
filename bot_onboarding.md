# Vendly: Bot Onboarding Technicalities

This document explains how vendors connect their WhatsApp and Telegram accounts to the Vendly platform to activate their AI employee.

## 1. Telegram Onboarding (Token-Based)

Telegram is the most straightforward platform for bot onboarding.

### Process:
1. **Creation:** The vendor goes to [@BotFather](https://t.me/botfather) on Telegram.
2. **Setup:** Vendor sends `/newbot`, follows the prompts to name the bot and choose a username.
3. **Token Retrieval:** BotFather provides an **API Token** (e.g., `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`).
4. **Integration:** Vendor pastes this token into the Vendly Dashboard (`/dashboard/bot`).
5. **Activation:**
    - Vendly backend calls the Telegram `setWebhook` method:
      `POST https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://api.vendly.com/bot/webhook/telegram`
    - Vendly uses the token to call `setMyName` and `setMyProfilePhoto` if the vendor updates these on the dashboard.

## 2. WhatsApp Onboarding (Meta Cloud API)

For stability, scale, and compliance, Vendly uses the **Official Meta WhatsApp Business Cloud API**.

### Process:
1. **Developer Assets:** Vendly provides a guided "Connect WhatsApp" flow using **Embedded Signup** (Meta's official onboarding tool).
2. **Business Selection:** Vendor logs into their Facebook/Meta account and selects (or creates) a WhatsApp Business Account (WABA).
3. **Phone Verification:** Vendor provides a phone number and verifies it via SMS/Voice code.
4. **Permissions:** Vendor grants Vendly permission to "Manage messages" and "Manage account."
5. **Token Exchange:** Meta provides an **Access Token** and **Phone Number ID** to Vendly.
6. **Webhook Registration:** Vendly registers the phone number for its webhook listener via the Meta Graph API.

### Alternative (For Small Individual Vendors):
If the vendor does not have a registered business, they can use the **WhatsApp Business App** with a QR code. However, for the AI to respond programmatically, Vendly must use a "browser-based" listener (e.g., `whatsapp-web.js`), which involves:
1. Vendly generates a QR code on the dashboard.
2. Vendor scans the QR code using "Linked Devices" in their WhatsApp app.
3. Vendly maintains a virtual session to listen and reply to messages.
*Note: This method is less stable and prone to session disconnects.*

## 3. Bot Identification in Database

When a bot is onboarded, the `Vendor` record is updated:
- `telegramToken`: Stored securely.
- `whatsappMetaToken`: Stored securely.
- `botEnabled`: Set to `true`.
- `botStatus`: Set to `ACTIVE`.

## 4. Initial "Handshake"
Once connected, the AI bot sends an initial "System Message" to the vendor on the platform (if possible) or a greeting message to a test number to confirm the connection is live.
