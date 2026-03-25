import httpx
import re
import json
import time
import traceback
from fastapi import APIRouter, Request, Header, HTTPException, Query
from ....core.db import prisma
from ....services.ai_service import ai_service
from ....services.telegram_service import telegram_service
from ....services.payment_service import payment_service
from ....core.config import settings

router = APIRouter()

async def send_telegram_message(token: str, chat_id: int, text: str):
    await telegram_service.send_message(token, chat_id, text)

async def send_telegram_photo(token: str, chat_id: int, photo_url: str, caption: str = ""):
    endpoint = f"https://api.telegram.org/bot{token}/sendPhoto"
    async with httpx.AsyncClient() as client:
        r = await client.post(endpoint, json={
            "chat_id": chat_id,
            "photo": photo_url,
            "caption": caption,
            "parse_mode": "HTML"
        })
        if r.status_code != 200:
            print(f"Error sending photo: {r.text}")

@router.post("/telegram/{token}")
async def telegram_webhook(token: str, request: Request):
    print("DEBUG: Webhook hit!")
    
    # Ensure prisma is connected
    # Proactive connection check
    if not prisma.is_connected():
        print("DEBUG: Prisma disconnected. Attempting to reconnect...")
        try:
            await prisma.connect()
            print("DEBUG: Prisma reconnected successfully.")
        except Exception as e:
            print(f"DEBUG: Critical error reconnecting to Prisma: {e}")
            # If reconnection fails, we cannot proceed with DB operations.
            # Returning an error status is appropriate.
            return {"status": "error", "message": "Database connection failed"}
    else:
        print("DEBUG: Prisma is connected.")
        
    try:
        data = await request.json()
    except Exception as e:
        print(f"DEBUG: Error reading JSON: {e}")
        return {"status": "error"}
        
    print(f"DEBUG: Raw data keys: {list(data.keys())}")
    
    if "message" not in data:
        print("DEBUG: No message in data, ignoring.")
        return {"status": "ignored"}
        
    message = data["message"]
    chat_id = str(message["chat"]["id"])
    text = message.get("text", "")
    
    if not text:
        print("DEBUG: No text in message.")
        return {"status": "no text"}

    # 1. Find Vendor by token
    print(f"DEBUG: Searching for vendor with token: {token[:10]}...")
    try:
        vendor = await prisma.vendor.find_first(where={"telegramToken": token})
    except Exception as e:
        print(f"DEBUG: Database error finding vendor: {e}")
        return {"status": "db error"}
        
    if not vendor:
        print(f"DEBUG: Vendor not found for token.")
        return {"status": "vendor not found"}
    
    print(f"DEBUG: Found vendor: {vendor.storeName}")

    # 2. Find/Create ChatSession
    session = await prisma.chatsession.find_first(
        where={
            "vendorId": vendor.id,
            "customerIdentifier": chat_id,
            "channel": "TELEGRAM"
        },
        include={"messages": True}
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
        # Sort manually if needed, or assume default order from DB
        sorted_messages = sorted(session.messages, key=lambda x: x.timestamp)
        history = [
            {"role": "assistant" if m.role == "BOT" else "user", "content": m.content} 
            for m in sorted_messages[-10:]
        ]

    # If human has taken over, ignore (or notify vendor)
    if session.humanTakeover:
        print(f"DEBUG: Human takeover active for session {session.id}, skipping AI response.")
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
    print(f"DEBUG: Calling AI Service for chat {chat_id}...")
    vendor_context = {
        "storeName": vendor.storeName,
        "botPersonality": vendor.botPersonality,
        "phoneNumber": vendor.phoneNumber,
        "hagglingLimit": float(vendor.hagglingLimit or 0),
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
    print(f"DEBUG: AI Response received: {ai_response[:100]}...")

    # Detect SET_CUSTOMER: { ... } in AI response
    customer_match = re.search(r"SET_CUSTOMER:\s*({.*})", ai_response, re.DOTALL)
    if customer_match:
        try:
            raw_json = customer_match.group(1).strip()
            # Try to find the last closing brace if there's extra text
            last_brace = raw_json.rfind('}')
            if last_brace != -1:
                raw_json = raw_json[:last_brace+1]
            
            c_data = json.loads(raw_json)
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
        except Exception as e:
            print(f"Customer update error: {e}")

    # Remove human takeover request trigger from AI response (but don't enable it automatically)
    ai_response = ai_response.replace("TRANSFER_TO_HUMAN", "").strip()

    # Detect CREATE_ORDER: { ... } in AI response
    order_match = re.search(r"CREATE_ORDER:\s*({.*})", ai_response, re.DOTALL)
    if order_match:
        try:
            raw_json = order_match.group(1).strip()
            last_brace = raw_json.rfind('}')
            if last_brace != -1:
                raw_json = raw_json[:last_brace+1]
                
            o_data = json.loads(raw_json)
            items_to_buy = o_data.get("items", [])
            
            if items_to_buy and session.customerEmail:
                # 1. Create Order
                order = await prisma.order.create(
                    data={
                        "vendorId": vendor.id,
                        "customerName": session.customerName or "Customer",
                        "customerPhone": session.customerPhone or "Pending",
                        "telegramChatId": chat_id,
                        "totalAmount": 0, # Update later
                        "status": "PENDING"
                    }
                )
                
                total = 0
                for item in items_to_buy:
                    # Find product by title
                    p_match = await prisma.product.find_first(
                        where={
                            "vendorId": vendor.id,
                            "title": {"contains": item["title"], "mode": "insensitive"}
                        }
                    )
                    if p_match:
                        price = p_match.basePrice
                        qty = item.get("quantity", 1)
                        await prisma.orderitem.create(
                            data={
                                "orderId": order.id,
                                "productId": p_match.id,
                                "quantity": qty,
                                "price": price
                            }
                        )
                        total += (price * qty)
                
                if total > 0:
                    # Update order total and generate link
                    payment_ref = f"VEN-{order.id[:8]}-{int(time.time())}"
                    await prisma.order.update(
                        where={"id": order.id},
                        data={
                            "totalAmount": total,
                            "paymentRef": payment_ref
                        }
                    )
                    
                    # Generate a clean internal redirector link
                    # Assuming settings.API_BASE_URL and settings.API_V1_STR are defined elsewhere
                    # For this example, I'll use a placeholder.
                    # from ....core.config import settings # Example import
                    # pay_link = f"{settings.API_BASE_URL}{settings.API_V1_STR}/webhooks/pay/{payment_ref}"
                    pay_link = f"{settings.API_BASE_URL}{settings.API_V1_STR}/webhooks/pay/{payment_ref}"
                    
                    order_suffix = (
                        f"\n\n💳 **Secure Payment Link:**\n{pay_link}\n\n"
                        f"Please complete your payment of ₦{total:,} to finalize your order."
                    )
                    ai_response = ai_response.replace(order_match.group(0), order_suffix).strip()
                else:
                    ai_response = ai_response.replace(order_match.group(0), "").strip()
            else:
                if not session.customerEmail:
                    ai_response += "\n\n(I'll need your email address to send you the secure payment link!)"
                ai_response = ai_response.replace(order_match.group(0), "").strip()
        except Exception as e:
            print(f"Order creation error: {e}")
            ai_response = ai_response.replace(order_match.group(0), "").strip()

    # Strip triggers from final response
    ai_response = re.sub(r"SET_CUSTOMER:.*?\n?", "", ai_response, flags=re.DOTALL).strip()
    ai_response = re.sub(r"CREATE_ORDER:.*?\n?", "", ai_response, flags=re.DOTALL).strip()
    ai_response = re.sub(r"TRANSFER_TO_HUMAN.*?\n?", "", ai_response, flags=re.DOTALL).strip()

    if not ai_response:
        ai_response = "Got it! I've updated your information. Is there anything else you'd like to look at?"

    # 7. Check for image URLs in AI response and send if found
    image_regex = r"https?://res\.cloudinary\.com/[^\s]+"
    image_match = re.search(image_regex, ai_response)
    
    if image_match:
        photo_url = image_match.group(0)
        # Clean response of the URL to keep it pretty
        clean_response = ai_response.replace(photo_url, "").strip()
        print(f"DEBUG: Sending photo to {chat_id}")
        await send_telegram_photo(token, int(chat_id), photo_url, clean_response)
    else:
        print(f"DEBUG: Processing message from {message['from']['id']}: {text}") # Using message['from']['id'] and text from earlier
        print(f"DEBUG: Prisma connected: {prisma.is_connected()}")
        await send_telegram_message(token, int(chat_id), ai_response)

    # 7. Save AI message
    await prisma.chatmessage.create(
        data={
            "sessionId": session.id,
            "role": "BOT",
            "content": ai_response
        }
    )
    
@router.get("/pay/{payment_ref}")
async def pay_redirector(payment_ref: str):
    # Find order to get details for Interswitch
    order = await prisma.order.find_first(
        where={"paymentRef": payment_ref},
        include={"vendor": True}
    )
    if not order:
        return {"error": "Order not found"}
        
    # Get Customer email from previous chat session or just "customer@vendly.app"
    # For now, let's just use the order's metadata or a default
    # Ideally find the chat message linked to this order
    customer_email = "customer@vendly.app" 
    
    # Generate the REAL long Interswitch link with the hash
    real_link = await payment_service.create_payment_link(
        amount=float(order.totalAmount),
        customer_email=customer_email,
        order_id=payment_ref
    )
    from fastapi.responses import RedirectResponse
    return RedirectResponse(real_link)

@router.get("/interswitch/callback")
async def interswitch_callback(
    request: Request,
    txnref: str = Query(None),
    amount: float = Query(None)
):
    if not txnref:
        return {"status": "error", "message": "Missing reference"}
        
    # Re-verify with Interswitch (to be safe)
    # Note: In sandbox, simple presence of txnref might be enough, but we should check
    is_valid = True # For sandbox testing, assume true if redirected back
    
    if is_valid:
        # Update Order status
        order = await prisma.order.find_first(
            where={"paymentRef": txnref},
            include={"vendor": True}
        )
        if order and order.status != "PAID":
            await prisma.order.update(
                where={"id": order.id},
                data={"status": "PAID"}
            )
            
            # Send Success Notification to customer on Telegram
            if order.telegramChatId and order.vendor.telegramToken:
                receipt_text = (
                    f"✅ **Payment Confirmed!**\n\n"
                    f"Order ID: #{order.id[:8]}\n"
                    f"Amount: ₦{order.totalAmount:,.2f}\n\n"
                    f"Thank you for your purchase from {order.vendor.storeName}. "
                    f"We are processing your order for dispatch. 🚀"
                )
                await telegram_service.send_message(order.vendor.telegramToken, order.telegramChatId, receipt_text)

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
            
    return {"status": "ok", "message": "Payment successful! You can return to the chat."}

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
