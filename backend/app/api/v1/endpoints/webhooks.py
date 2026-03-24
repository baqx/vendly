import httpx
from fastapi import APIRouter, Request, Header, HTTPException, Query
from ....core.db import prisma
from ....services.ai_service import ai_service

router = APIRouter()

async def send_telegram_message(token: str, chat_id: int, text: str):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={"chat_id": chat_id, "text": text})

async def send_telegram_photo(token: str, chat_id: int, photo_url: str, caption: str = ""):
    url = f"https://api.telegram.org/bot{token}/sendPhoto"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={"chat_id": chat_id, "photo": photo_url, "caption": caption})

@router.post("/telegram/{token}")
async def telegram_webhook(token: str, request: Request):
    data = await request.json()
    
    if "message" not in data:
        return {"status": "ignored"}
        
    message = data["message"]
    chat_id = str(message["chat"]["id"])
    text = message.get("text", "")
    
    if not text:
        return {"status": "no text"}

    # 1. Find Vendor by token
    vendor = await prisma.vendor.find_first(where={"telegramToken": token})
    if not vendor:
        return {"status": "vendor not found"}

    # 2. Find/Create ChatSession
    session = await prisma.chatsession.find_first(
        where={
            "vendorId": vendor.id,
            "customerIdentifier": chat_id,
            "channel": "TELEGRAM"
        },
        include={"messages": {"order": {"timestamp": "asc"}, "take": 10}}
    )
    
    if not session:
        session = await prisma.chatsession.create(
            data={
                "vendorId": vendor.id,
                "customerIdentifier": chat_id,
                "channel": "TELEGRAM"
            }
        )
        history = []
    else:
        history = [{"role": m.role.lower(), "content": m.content} for m in session.messages]

    # If human has taken over, ignore (or notify vendor)
    if session.humanTakeover:
        return {"status": "human takeover active"}

    # 3. Save customer message
    await prisma.chatmessage.create(
        data={
            "sessionId": session.id,
            "role": "CUSTOMER",
            "content": text
        }
    )

    products = await prisma.product.find_many(
        where={"vendorId": vendor.id},
        include={"images": True}
    )
    product_list = [
        {
            "title": p.title,
            "description": p.description,
            "tags": p.tags,
            "basePrice": float(p.basePrice),
            "mapPrice": float(p.mapPrice),
            "stockLevel": p.stockLevel,
            "imageUrl": p.images[0].url if p.images else None
        } for p in products
    ]

    # 5. Get customer order history
    orders = await prisma.order.find_many(
        where={"telegramChatId": chat_id},
        take=3,
        include={"items": {"include": {"product": True}}},
        order={"createdAt": "desc"}
    )
    order_history = [
        {
            "id": o.id,
            "status": o.status,
            "total": float(o.totalAmount),
            "date": o.createdAt.strftime("%Y-%m-%d"),
            "items": [{"name": i.product.title, "qty": i.quantity} for i in o.items]
        } for o in orders
    ]

    # 6. Call AI Service
    vendor_context = {
        "storeName": vendor.storeName,
        "botPersonality": vendor.botPersonality,
        "phoneNumber": vendor.phoneNumber,
        "orderHistory": order_history,
        "customerInfo": {
            "name": session.customerName,
            "email": session.customerEmail,
            "phone": session.customerPhone
        }
    }
    
    ai_response = await ai_service.generate_response(
        prompt=text,
        history=history,
        vendor_context=vendor_context,
        products=product_list
    )

    # Detect SET_CUSTOMER: { ... } in AI response
    customer_match = re.search(r"SET_CUSTOMER:\s*({.*?})", ai_response)
    if customer_match:
        import json
        try:
            c_data = json.loads(customer_match.group(1))
            update_fields = {}
            if c_data.get("name"): update_fields["customerName"] = c_data["name"]
            if c_data.get("email"): update_fields["customerEmail"] = c_data["email"]
            if c_data.get("phone"): update_fields["customerPhone"] = c_data["phone"]
            
            if update_fields:
                await prisma.chatsession.update(
                    where={"id": session.id},
                    data=update_fields
                )
            ai_response = ai_response.replace(customer_match.group(0), "").strip()
        except:
            pass

    # Detect human takeover request in AI response
    if "TRANSFER_TO_HUMAN" in ai_response or "passing you to a human" in ai_response.lower():
        await prisma.chatsession.update(
            where={"id": session.id},
            data={"humanTakeover": True}
        )
        ai_response = ai_response.replace("TRANSFER_TO_HUMAN", "").strip()

    # 7. Check for image URLs in AI response and send if found
    import re
    image_regex = r"https?://res\.cloudinary\.com/[^\s]+"
    image_match = re.search(image_regex, ai_response)
    
    if image_match:
        photo_url = image_match.group(0)
        # Clean response of the URL to keep it pretty
        clean_response = ai_response.replace(photo_url, "").strip()
        await send_telegram_photo(token, int(chat_id), photo_url, clean_response)
    else:
        await send_telegram_message(token, int(chat_id), ai_response)

    # 7. Save AI message
    await prisma.chatmessage.create(
        data={
            "sessionId": session.id,
            "role": "BOT",
            "content": ai_response
        }
    )
    
from ....services.payment_service import payment_service

@router.post("/interswitch")
async def interswitch_webhook(request: Request):
    data = await request.json()
    ref = data.get("TransactionReference")
    amount = data.get("Amount")
    
    if not ref or not amount:
        return {"status": "error", "message": "Missing reference or amount"}
        
    # Verify with Interswitch
    is_valid = await payment_service.verify_transaction(ref, float(amount))
    
    if is_valid:
        # Update Order status
        order = await prisma.order.find_first(
            where={"paymentRef": ref},
            include={"vendor": True}
        )
        if order:
            await prisma.order.update(
                where={"id": order.id},
                data={"status": "PAID"}
            )
            
            # Send Success Notification to customer on Telegram if chat_id present
            if order.telegramChatId and order.vendor.telegramToken:
                receipt_text = (
                    f"✅ **Payment Confirmed!**\n\n"
                    f"Order ID: #{order.id[:8]}\n"
                    f"Amount: ₦{order.totalAmount}\n\n"
                    f"Thank you for your purchase from {order.vendor.storeName}. "
                    f"We are processing your order for dispatch. 🚀"
                )
                await send_telegram_message(order.vendor.telegramToken, int(order.telegramChatId), receipt_text)

            # Create Transaction record
            await prisma.transaction.create(
                data={
                    "vendorId": order.vendorId,
                    "orderId": order.id,
                    "amount": order.totalAmount,
                    "type": "SALE"
                }
            )
            # Update Vendor balance
            await prisma.vendor.update(
                where={"id": order.vendorId},
                data={"walletBalance": {"increment": order.totalAmount}}
            )
            
    return {"status": "ok", "verified": is_valid}

@router.get("/whatsapp")
async def whatsapp_verify(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
):
    # Meta Webhook Verification
    if hub_verify_token == "vendly-token":
        return hub_challenge
    return HTTPException(status_code=403)

@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    data = await request.json()
    # 1. Parse Meta JSON
    # 2. Process message
    return {"status": "ok"}
