# Vendly Backend

## Setup

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Setup:**
   - Ensure PostgreSQL is running.
   - Update `DATABASE_URL` in `.env`.
   - Run Prisma migrations:
     ```bash
     prisma db push
     ```

3. **Generate Prisma Client:**
   ```bash
   prisma generate
   ```

4. **Run the Application:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Key Technologies
- **FastAPI:** Core web framework.
- **Prisma (Python):** Database ORM.
- **Groq:** AI Engine (Llama-3).
- **Interswitch:** Payment processing.

## Maintainability Rules
- Follow **Clean Architecture** (Routers -> Services -> CRUD -> Models).
- Use **Type Hints** everywhere.
- Abstract external integrations into the `services/` directory.
