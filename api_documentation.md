# Vendly API Documentation (Exhaustive)

This document is the definitive guide to the Vendly Backend API (v1). It contains every available endpoint, full request payloads, and unshortened example responses.

## 🌐 Base URL
`https://vendly.outray.app/api/v1`

## 📦 Standard Response Wrapper
Most API responses are wrapped in a standard JSON object. Some endpoints return raw objects (noted below).
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

---

## 🔐 1. Authentication (`/auth`)

### [POST] Login
Receive a JWT access token.
- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Payload (Form-Data):**
  - `username`: (string) Vendor email (e.g., "vendor@example.com")
  - `password`: (string) Vendor password (e.g., "secure_password123")
- **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW42OTNpaWcwMDAxMW90cnF0YTBlZmxpIiwiZXhwIjoxNzA0ODgyNDA2fQ.t9sX...",
  "token_type": "bearer"
}
```

---

## 🏪 2. Vendor Profile (`/vendors`)

### [POST] Signup
Register a new vendor account.
- **URL:** `/api/v1/vendors/signup`
- **Method:** `POST`
- **Auth Required:** No
- **Payload (JSON):**
```json
{
  "email": "vendor@example.com",
  "password": "secure_password123",
  "storeName": "Glamour Boutique",
  "phoneNumber": "+2348012345678"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "cmn693iig00011otrqta0efli",
    "email": "vendor@example.com",
    "storeName": "Glamour Boutique",
    "category": null,
    "location": null,
    "phoneNumber": "+2348012345678",
    "description": null,
    "logoUrl": null,
    "botEnabled": false,
    "botPersonality": null,
    "hagglingLimit": 0.0,
    "telegramToken": null,
    "whatsappMetaToken": null,
    "walletBalance": 0.0,
    "bankName": null,
    "accountNumber": null,
    "accountName": null,
    "createdAt": "2024-03-25T16:17:27.000Z"
  },
  "error": null
}
```

### [GET] My Profile
Fetch current vendor settings and financials.
- **URL:** `/api/v1/vendors/me`
- **Method:** `GET`
- **Auth Required:** Yes (JWT)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "cmn693iig00011otrqta0efli",
    "email": "vendor@example.com",
    "storeName": "Glamour Boutique",
    "category": "Fashion",
    "location": "Lagos, Nigeria",
    "phoneNumber": "+2348012345678",
    "description": "High-end retail",
    "logoUrl": "https://res.cloudinary.com/demo/image/upload/v123456/logo.png",
    "botEnabled": true,
    "botPersonality": "Friendly assistant",
    "hagglingLimit": 10.00,
    "telegramToken": "123456:ABC-DEF",
    "whatsappMetaToken": null,
    "walletBalance": 15000.50,
    "bankName": "GTBank",
    "accountNumber": "0123456789",
    "accountName": "Baqee Store",
    "createdAt": "2024-03-22T10:00:00.000Z"
  },
  "error": null
}
```

### [PATCH] Update Profile
Update profile details & bank information.
- **URL:** `/api/v1/vendors/me`
- **Method:** `PATCH`
- **Auth Required:** Yes (JWT)
- **Payload (Multipart Form-Data):** All fields are optional.
  - `storeName`: string
  - `category`: string
  - `location`: string
  - `phoneNumber`: string
  - `description`: string
  - `botEnabled`: boolean ("true" or "false")
  - `botPersonality`: string
  - `hagglingLimit`: float
  - `telegramToken`: string
  - `bankName`: string
  - `accountNumber`: string
  - `accountName`: string
  - `logo`: File Binary (Image)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "cmn693iig00011otrqta0efli",
    "email": "vendor@example.com",
    "storeName": "Glamour Boutique (Updated)",
    "category": "Fashion",
    "location": "Lagos, Nigeria",
    "phoneNumber": "+2348012345678",
    "description": "High-end retail",
    "logoUrl": "https://res.cloudinary.com/demo/image/upload/v123456/logo.png",
    "botEnabled": true,
    "botPersonality": "Friendly assistant",
    "hagglingLimit": 10.00,
    "telegramToken": "123456:ABC-DEF",
    "whatsappMetaToken": null,
    "walletBalance": 15000.50,
    "bankName": "GTBank",
    "accountNumber": "0123456789",
    "accountName": "Baqee Store",
    "createdAt": "2024-03-22T10:00:00.000Z"
  },
  "error": null
}
```

---

## 🛠️ 3. Inventory Management (`/products`)

### [GET] List Products
- **URL:** `/api/v1/products/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Params:** `skip` (int, default: 0), `limit` (int, default: 100)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": "p_123",
      "vendorId": "cmn693iig00011otrqta0efli",
      "title": "Silk Summer Dress",
      "description": "Premium silk dress perfect for summer.",
      "basePrice": 45000.0,
      "mapPrice": 40000.0,
      "stockLevel": 10,
      "tags": "summer,silk,dress",
      "technicalSpecs": {
        "material": "Silk",
        "origin": "Nigeria"
      },
      "createdAt": "2024-03-25T12:00:00.000Z",
      "images": [
        {
          "id": "img_1",
          "url": "https://res.cloudinary.com/demo/image/upload/v123456/dress1.jpg"
        }
      ],
      "variants": [
        {
          "id": "var_1",
          "name": "Size",
          "value": "Medium"
        },
        {
          "id": "var_2",
          "name": "Color",
          "value": "Emerald"
        }
      ]
    }
  ],
  "error": null
}
```

### [POST] Create Product
- **URL:** `/api/v1/products/`
- **Method:** `POST`
- **Auth Required:** Yes
- **Payload (Multipart Form-Data):**
  - `title`: (string) e.g., "Designer Handbag"
  - `description`: (string) e.g., "Italian leather handbag"
  - `basePrice`: (float) e.g., "120000.0"
  - `mapPrice`: (float) e.g., "110000.0"
  - `stockLevel`: (integer) e.g., "5"
  - `images`: (List of File Binaries)
  - `variants`: (JSON string) e.g., `[{"name": "Color", "value": "Black"}, {"name": "Size", "value": "Standard"}]`
- **Response (200 OK - Note: Not wrapped in Response):**
```json
{
  "id": "p_124",
  "vendorId": "cmn693iig00011otrqta0efli",
  "title": "Designer Handbag",
  "description": "Italian leather handbag",
  "basePrice": 120000.0,
  "mapPrice": 110000.0,
  "stockLevel": 5,
  "tags": null,
  "technicalSpecs": null,
  "createdAt": "2024-03-25T14:00:00.000Z",
  "images": [],
  "variants": [
    {
      "id": "var_3",
      "name": "Color",
      "value": "Black"
    },
    {
      "id": "var_4",
      "name": "Size",
      "value": "Standard"
    }
  ]
}
```

### [PATCH] Update Product
- **URL:** `/api/v1/products/{id}`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Payload (Multipart Form-Data):** All optional.
  - `title`: string
  - `description`: string
  - `basePrice`: float
  - `stockLevel`: integer
  - `images`: List of File Binaries
- **Response (200 OK - Note: Not wrapped in Response):**
```json
{
  "id": "p_124",
  "vendorId": "cmn693iig00011otrqta0efli",
  "title": "Designer Handbag (Updated Price)",
  "description": "Italian leather handbag",
  "basePrice": 115000.0,
  "mapPrice": 110000.0,
  "stockLevel": 2,
  "tags": null,
  "technicalSpecs": null,
  "createdAt": "2024-03-25T14:00:00.000Z",
  "images": [],
  "variants": [
    {
      "id": "var_3",
      "name": "Color",
      "value": "Black"
    },
    {
      "id": "var_4",
      "name": "Size",
      "value": "Standard"
    }
  ]
}
```

### [DELETE] Remove Product
- **URL:** `/api/v1/products/{id}`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Response (200 OK - Note: Not wrapped in Response):**
```json
{
  "message": "Product deleted successfully",
  "id": "p_124"
}
```

---

## 📦 4. Orders Management (`/orders`)

### [GET] List Orders
- **URL:** `/api/v1/orders/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Params:** `skip` (int, default: 0), `limit` (int, default: 100)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": "ord_1",
      "vendorId": "cmn693iig00011otrqta0efli",
      "customerName": "John Doe",
      "customerPhone": "08012345678",
      "shippingAddress": "123 Main Street, Ikeja",
      "totalAmount": 50000.0,
      "telegramChatId": "chat_12345",
      "notes": "Please deliver in the morning",
      "status": "PAID",
      "paymentRef": "VEN-PAY-123",
      "logisticsRef": null,
      "createdAt": "2024-03-25T10:00:00.000Z",
      "items": [
        {
          "id": "item_1",
          "orderId": "ord_1",
          "productId": "p_123",
          "quantity": 1,
          "price": 50000.0,
          "variant": "Medium"
        }
      ]
    }
  ],
  "error": null
}
```

### [POST] Create Order
- **URL:** `/api/v1/orders/`
- **Method:** `POST`
- **Auth Required:** Yes
- **Payload (JSON):**
```json
{
  "customerName": "Jane Smith",
  "customerPhone": "08098765432",
  "shippingAddress": "45 Broad Street, Lagos Island",
  "totalAmount": 35000.0,
  "telegramChatId": "chat_67890",
  "notes": "Call upon arrival",
  "items": [
    {
      "productId": "p_123",
      "quantity": 1,
      "price": 35000.0,
      "variant": "Small"
    }
  ]
}
```
- **Response (200 OK - Note: Not wrapped in Response + includes paymentLink):**
```json
{
  "id": "ord_2",
  "vendorId": "cmn693iig00011otrqta0efli",
  "customerName": "Jane Smith",
  "customerPhone": "08098765432",
  "shippingAddress": "45 Broad Street, Lagos Island",
  "totalAmount": 35000.0,
  "telegramChatId": "chat_67890",
  "notes": "Call upon arrival",
  "status": "PENDING",
  "paymentRef": null,
  "logisticsRef": null,
  "createdAt": "2024-03-25T11:00:00.000Z",
  "items": [
    {
      "id": "item_2",
      "orderId": "ord_2",
      "productId": "p_123",
      "quantity": 1,
      "price": 35000.0,
      "variant": "Small"
    }
  ],
  "paymentLink": "https://example.com/api/v1/webhooks/pay/VEN-REG-..."
}
```

### [GET] Order Detail
- **URL:** `/api/v1/orders/{id}`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK - Note: Not wrapped in Response. Product data nested inside items):**
```json
{
  "id": "ord_1",
  "vendorId": "cmn693iig00011otrqta0efli",
  "customerName": "John Doe",
  "customerPhone": "08012345678",
  "shippingAddress": "123 Main Street, Ikeja",
  "totalAmount": 50000.0,
  "telegramChatId": "chat_12345",
  "notes": "Please deliver in the morning",
  "status": "PAID",
  "paymentRef": "VEN-PAY-123",
  "logisticsRef": null,
  "createdAt": "2024-03-25T10:00:00.000Z",
  "items": [
    {
      "id": "item_1",
      "orderId": "ord_1",
      "productId": "p_123",
      "quantity": 1,
      "price": 50000.0,
      "variant": "Medium",
      "product": {
        "id": "p_123",
        "vendorId": "cmn693iig00011otrqta0efli",
        "title": "Silk Summer Dress",
        "description": "Premium silk dress perfect for summer.",
        "basePrice": 45000.0,
        "mapPrice": 40000.0,
        "stockLevel": 10,
        "tags": "summer,silk,dress",
        "technicalSpecs": {
          "material": "Silk",
          "origin": "Nigeria"
        },
        "createdAt": "2024-03-25T12:00:00.000Z"
      }
    }
  ]
}
```

### [PATCH] Update Status
- **URL:** `/api/v1/orders/{id}?status=SHIPPED`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Query Params:** `status` (string)
- **Response (200 OK - Note: Not wrapped in Response):**
```json
{
  "id": "ord_1",
  "vendorId": "cmn693iig00011otrqta0efli",
  "customerName": "John Doe",
  "customerPhone": "08012345678",
  "shippingAddress": "123 Main Street, Ikeja",
  "totalAmount": 50000.0,
  "telegramChatId": "chat_12345",
  "notes": "Please deliver in the morning",
  "status": "SHIPPED",
  "paymentRef": "VEN-PAY-123",
  "logisticsRef": null,
  "createdAt": "2024-03-25T10:00:00.000Z",
  "items": []
}
```

---

## 💰 5. Transactions & Earnings (`/transactions`)

### [GET] Earnings Summary
- **URL:** `/api/v1/transactions/summary`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "totalEarned": 2500000.0,
    "totalWithdrawn": 1200000.0,
    "currentBalance": 1300000.0,
    "pendingPayouts": 0.0
  },
  "error": null
}
```

### [GET] Transaction History
- **URL:** `/api/v1/transactions/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Params:** `skip` (int, default: 0), `limit` (int, default: 100)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": "tx_1",
      "vendorId": "cmn693iig00011otrqta0efli",
      "amount": 50000.0,
      "type": "SALE",
      "orderId": "ord_1",
      "timestamp": "2024-03-25T10:05:00.000Z",
      "order": {
        "id": "ord_1",
        "vendorId": "cmn693iig00011otrqta0efli",
        "customerName": "John Doe",
        "customerPhone": "08012345678",
        "shippingAddress": "123 Main Street, Ikeja",
        "totalAmount": 50000.0,
        "telegramChatId": "chat_12345",
        "notes": "Please deliver in the morning",
        "status": "PAID",
        "paymentRef": "VEN-PAY-123",
        "logisticsRef": null,
        "createdAt": "2024-03-25T10:00:00.000Z"
      }
    },
    {
      "id": "tx_2",
      "vendorId": "cmn693iig00011otrqta0efli",
      "amount": -20000.0,
      "type": "PAYOUT",
      "orderId": null,
      "timestamp": "2024-03-24T10:05:00.000Z"
    }
  ],
  "error": null
}
```

---

## 🏧 6. Payouts (`/payouts`)

### [POST] Request Payout
- **URL:** `/api/v1/payouts/`
- **Method:** `POST`
- **Auth Required:** Yes
- **Payload (JSON):**
```json
{
  "amount": 50000.0
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Payout request successful",
  "data": {
    "transactionId": "tx_3"
  },
  "error": null
}
```
- **Response (400 Bad Request - Missing Bank Details):**
```json
{
  "detail": "Incomplete bank details. Please update your profile with bank name, account number, and account name."
}
```
- **Response (400 Bad Request - Insufficient Funds):**
```json
{
  "detail": "Insufficient funds"
}
```

### [GET] List Payouts
- **URL:** `/api/v1/payouts/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": "tx_2",
      "vendorId": "cmn693iig00011otrqta0efli",
      "amount": -20000.0,
      "type": "PAYOUT",
      "orderId": null,
      "timestamp": "2024-03-24T10:05:00.000Z"
    }
  ],
  "error": null
}
```

---

## 👤 7. Customers (`/customers`)

### [GET] List Customers
- **URL:** `/api/v1/customers/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Params:** `skip` (int, default: 0), `limit` (int, default: 100)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": "chat_session_1",
      "identifier": "08012345678",
      "name": "John Doe",
      "phone": "08012345678",
      "lastActive": "2024-03-25T09:30:00.000Z",
      "channel": "TELEGRAM",
      "orderCount": 5
    }
  ],
  "error": null
}
```

### [GET] Customer Detail
- **URL:** `/api/v1/customers/{identifier}`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "identifier": "08012345678",
    "session": {
      "id": "chat_session_1",
      "vendorId": "cmn693iig00011otrqta0efli",
      "channel": "TELEGRAM",
      "customerIdentifier": "08012345678",
      "active": true,
      "humanTakeover": false,
      "createdAt": "2024-03-20T09:30:00.000Z",
      "updatedAt": "2024-03-25T09:30:00.000Z",
      "messages": [
        {
          "id": "msg_1",
          "role": "CUSTOMER",
          "content": "Hi, I need a dress",
          "timestamp": "2024-03-25T09:00:00.000Z"
        },
        {
          "id": "msg_2",
          "role": "BOT",
          "content": "Sure, we have Silk and Cotton dresses. Which do you prefer?",
          "timestamp": "2024-03-25T09:00:05.000Z"
        }
      ]
    },
    "orders": [
      {
        "id": "ord_1",
        "vendorId": "cmn693iig00011otrqta0efli",
        "customerName": "John Doe",
        "customerPhone": "08012345678",
        "shippingAddress": "123 Main Street, Ikeja",
        "totalAmount": 50000.0,
        "telegramChatId": "chat_12345",
        "notes": "Please deliver in the morning",
        "status": "PAID",
        "paymentRef": "VEN-PAY-123",
        "logisticsRef": null,
        "createdAt": "2024-03-25T10:00:00.000Z",
        "items": [
          {
            "id": "item_1",
            "orderId": "ord_1",
            "productId": "p_123",
            "quantity": 1,
            "price": 50000.0,
            "variant": "Medium"
          }
        ]
      }
    ],
    "totalSpent": 50000.0
  },
  "error": null
}
```

---

## 💬 8. Chat Sessions (`/chats`)

### [GET] List All Chats
- **URL:** `/api/v1/chats/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Params:** `skip` (int, default: 0), `limit` (int, default: 100)
- **Response (200 OK - Note: Not wrapped in Response):**
```json
[
  {
    "id": "chat_session_1",
    "vendorId": "cmn693iig00011otrqta0efli",
    "channel": "TELEGRAM",
    "customerIdentifier": "08012345678",
    "active": true,
    "humanTakeover": false,
    "createdAt": "2024-03-20T09:30:00.000Z",
    "updatedAt": "2024-03-25T09:30:00.000Z",
    "messages": [
      {
        "id": "msg_1",
        "role": "CUSTOMER",
        "content": "Hi, I need a dress",
        "timestamp": "2024-03-25T09:00:00.000Z"
      },
      {
        "id": "msg_2",
        "role": "BOT",
        "content": "Sure, we have Silk and Cotton dresses. Which do you prefer?",
        "timestamp": "2024-03-25T09:00:05.000Z"
      }
    ]
  }
]
```

### [GET] Chat Detail
- **URL:** `/api/v1/chats/{id}`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK - Note: Not wrapped in Response):**
(Returns a single ChatSession object matching the structure above).

### [PATCH] Toggle Human Takeover
- **URL:** `/api/v1/chats/{id}/takeover?takeover=true`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Query Params:** `takeover` (boolean)
- **Response (200 OK - Note: Not wrapped in Response):**
```json
{
  "status": "success",
  "humanTakeover": true
}
```

---

## 🎟️ 9. Coupons (`/coupons`)

### [GET] List Coupons
- **URL:** `/api/v1/coupons/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": "coup_1",
      "vendorId": "cmn693iig00011otrqta0efli",
      "code": "WELCOME20",
      "discountType": "PERCENTAGE",
      "value": 20.0,
      "minOrderValue": 2500.0,
      "active": true,
      "createdAt": "2024-03-25T10:00:00.000Z"
    }
  ],
  "error": null
}
```

### [POST] Create Coupon
- **URL:** `/api/v1/coupons/`
- **Method:** `POST`
- **Auth Required:** Yes
- **Payload (JSON):**
```json
{
  "code": "WELCOME20",
  "discountType": "PERCENTAGE",
  "value": 20.0,
  "minOrderValue": 2500.0,
  "active": true
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": "coup_1",
    "vendorId": "cmn693iig00011otrqta0efli",
    "code": "WELCOME20",
    "discountType": "PERCENTAGE",
    "value": 20.0,
    "minOrderValue": 2500.0,
    "active": true,
    "createdAt": "2024-03-25T10:00:00.000Z"
  },
  "error": null
}
```

---

## 🤖 10. AI Assistant (`/ai`)

### [POST] Direct Chat
Interface with the AI using vendor context (primarily for testing or internal dashboard use).
- **URL:** `/api/v1/ai/chat`
- **Method:** `POST`
- **Auth Required:** Yes
- **Payload (JSON):**
```json
{
  "role": "VENDOR",
  "content": "Analyze my stock levels."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "response": "Based on your inventory, you are low on 'Silk Dress'."
  },
  "error": null
}
```

---

## 📊 11. Dashboard Analytics (`/dashboard`)

### [GET] Overview Stats
- **URL:** `/api/v1/dashboard/`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "todayRevenue": 150000.0,
    "monthRevenue": 4500000.0,
    "walletBalance": 150200.5,
    "activeChats": 12,
    "takeoverAlerts": 2,
    "productCount": 45,
    "pendingOrders": 8,
    "botEnabled": true,
    "chartData": [
      {
        "date": "2024-03-24",
        "amount": 120000.0
      },
      {
        "date": "2024-03-25",
        "amount": 150000.0
      }
    ]
  },
  "error": null
}
```

---

## 🔗 12. Webhooks (`/webhooks`)

### [POST] Telegram Webhook
Target URL configured in Telegram Bot settings.
- **URL:** `/api/v1/webhooks/telegram/{token}`
- **Method:** `POST`
- **Auth Required:** No
- **Payload:** Raw JSON payload from Telegram containing message details.
- **Response:** Handled internally (no strict format, typically 200 OK with `{"status": "ok"}`).

### [GET] Payment Link Wrapper
Redirects to the interswitch payment page.
- **URL:** `/api/v1/webhooks/pay/{payment_ref}`
- **Method:** `GET`
- **Auth Required:** No

### [GET] Interswitch Callback
Handles the asynchronous return from the payment gateway.
- **URL:** `/api/v1/webhooks/interswitch/callback`
- **Method:** `GET`
- **Auth Required:** No
- **Query Params:** `amount`, `txnref`, `apprCode`, `resp`
- **Response:** Raw string `"Payment handled."`
