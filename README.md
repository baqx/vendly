# Vendly: AI-Powered Social Commerce Ecosystem

Vendly is an AI-powered social commerce ecosystem that automates the transition from chat-based inquiries to confirmed sales for small and medium-sized enterprises (SMEs). We offer an integrated suite of services including a consultative AI sales assistant that handles real-time negotiations and automated order capture on platforms like Telegram and WhatsApp, alongside a professional vendor dashboard for unified inventory management, financial tracking through a digital wallet, and deep business analytics. Our platform is specifically targeted at social media vendors and modern retailers who rely on consultative, chat-based selling and require a scalable infrastructure to manage high-volume customer interactions and secure payment processing without increasing operational overhead.

---

## 👥 Team & Contributions

 Below are the core contributors and their respective roles in bringing Vendly to life:

*   **abdulbaqeee** (Backend & Bot Infrastructure): Architected the FastAPI backend, integrated the Groq AI service for consultative selling, and built the Telegram/WhatsApp webhook infrastructure.
*   **Ubaidah** (Frontend): Designed and implemented the comprehensive Vendor Dashboard using Next.js and Tailwind CSS, focusing on a premium user experience and clear business analytics.
*   **aleem** (Integration & Deployment): Managed the end-to-end integration between the AI agents and the dashboard, and handled the production deployment on Render, ensuring database and binary stability.

---

## 🏗️ Project Structure

- `backend/`: High-concurrency FastAPI implementation (Python) with Prisma ORM.
- `vendly-web/`: Premium Next.js frontend for vendor management and real-time analytics.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Python 3.12, FastAPI, Pydantic V2, Prisma (Python).
- **AI/LLM:** Groq (Llama-3 model) with custom vendor-context injection.
- **Database:** PostgreSQL (managed via Prisma).
- **Payments:** Interswitch Integration for secure localized transactions.
- **Deployment:** Render (Web Services & PostgreSQL).

---

## 📖 Key Documentation

- [Project Overview](project_overview.md) - High-level vision and business description.
- [API Documentation](api_documentation.md) - Exhaustive endpoint and payload specification.
- [Frontend Design](frontend_pages.md) - Deep dive into vendor dashboard UI components.
- [Database Schema](prisma/schema.prisma) - Full Prisma data model and relationships.

---

*Vendly: Transforming business chats into business ecosystems.*
