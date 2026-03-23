# Vendly: User Experience (UX) Architecture

Vendly is designed to provide a seamless, premium, and trust-based experience for both vendors (who manage the AI) and customers (who message the AI).

## 1. Vendor Experience (Dashboard Management)
The vendor dashboard (`vendly-web`) is the control center for the digital employee.

### Key Experience Pillars
- **"Set and Forget" Automation:** After initial onboarding and inventory upload, the vendor's primary interaction is monitoring sales and handling rare escalations.
- **Campaign-Led Negotiation:** Instead of manual approvals, the vendor sets up discount "rules" via coupons. The AI handles the negotiation at the speed of chat, ensuring no sales are lost to delays.
- **Human Takeover & Control:** A critical UX feature is the "Human Takeover" button. If a vendor sees the AI struggling or wants to provide a personal touch, they can "Silence" the AI with one click.
- **Trust-building Insights:** The dashboard shows not just orders, but the *reasoning* behind them (e.g., "AI closed this sale by offering a 5% discount within your limits").
- **Premium Interface:** Dark/Light mode support, sleek graphs for sales, and a clean inventory manager that makes bulk uploads feel effortless.

### Experience Flow
1. **Onboarding:** A guided tour showing how to feed the AI with product data.
2. **Monitoring:** Real-time push notifications when a sale is closed or a dispute is flagged.
3. **Control:** Adjusting haggling limits and bot personality on the fly.

## 2. Customer Experience (Messaging Interface)
The customer interacts with Vendly via WhatsApp or Telegram. The AI acts as a sophisticated, knowledgeable human employee.

### Key Experience Pillars
- **Colloquial & Natural:** The AI understands Nigerian slang ("Abeg," "Omo," "Abibi") and responds in a helpful, friendly, yet professional tone.
- ** सलाहकार (Advisor) Role:** Instead of just saying "Yes, we have it," the AI offers advice (e.g., "That dress is perfect for a garden wedding, but maybe consider the silk wrap if the weather is hot").
- **Frictionless Payments:** Payment links are generated instantly inside the chat. No need to navigate to a separate storefront website unless desired.
- **Transparency:** Clear communication on shipping fees, weight considerations, and delivery timelines.

### Experience Flow
1. **Greeting:** Fast, warm welcome when the customer first texts.
2. **Consultation:** Interactive discovery using Llama-3's reasoning capabilities.
3. **Haggling:** A satisfying negotiation experience where the customer feels they've "won" a better deal (within vendor limits).
4. **Fulfillment:** Instant tracking info reduces delivery anxiety.

## 3. Edge Case UX (Handling the Unexpected)
- **The "Apology" Experience:** If the bot goes offline or an API fails, a pre-cached "Human Manager is coming" message is sent to maintain trust.
- **Stock-out Navigation:** Instead of a hard "No," the AI uses its reasoning to pivot to the next best item ("Omo, that size is finished, but we just got this other one in...").
- **Payment Retries:** If Interswitch fails, the AI provides a "Retry" link or suggests the Bank Transfer (Virtual Account) alternative immediately.

---

## Technicalities Behind the UX
- **Low Latency:** Groq API ensures AI responses are under 2 seconds, maintaining the "Real-time Chat" feel.
- **Context Persistence:** Redis stores the recent chat history so the AI never "forgets" what a customer said 5 minutes ago.
- **Multilingual/Slang Processing:** Llama-3 is fine-tuned (via system prompting) to handle the nuances of local dialects and slang.
