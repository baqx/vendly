# Vendly: Coding Standards & Maintainability

This document defines the architectural patterns and coding standards for Vendly to ensure the codebase remains clean, scalable, and easy for future developers to maintain.

## 1. Core Principles
- **DRY (Don't Repeat Yourself):** Abstract common logic into shared utilities, components, or services.
- **SOLID:** Follow object-oriented design principles to ensure flexible and robust code.
- **KISS (Keep It Simple, Stupid):** Prioritize readable, simple code over clever, complex solutions.
- **Type Safety:** TypeScript (Frontend) and Pydantic/Type Hints (Backend) are mandatory for all core logic.

## 2. Backend Architecture (FastAPI)

We follow a **Layered Clean Architecture** to separate concerns:

- **Routers (`/api/v1/*.py`):** Handle HTTP requests/responses and input validation via Pydantic.
- **Services (`/services/*.py`):** The "Brain." Contains business logic, AI orchestration, and complex workflows.
- **CRUD/Repository (`/crud/*.py`):** Handles all database interactions via Prisma/SQLAlchemy.
- **Models/Schemas (`/models/*.py`):** Database entities and Pydantic schemas.

### Maintainability Patterns:
- **Dependency Injection:** Use FastAPI's `Depends` for DB sessions and external clients (Groq, Interswitch).
- **Global Error Handling:** Use custom exception handlers to ensure unified error responses.
- **Base CRUD:** Inherit from a generic BaseCRUD class for standard operations (Create, Read, Update, Delete).

## 3. Frontend Architecture (Next.js)

We follow a **Feature-Based Structure** to keep the project organized as it grows:

- **`components/ui/`**: Low-level, reusable primitives (Shadcn UI).
- **`components/shared/`**: Common elements used across multiple pages (Headers, Sidebars).
- **`features/[feature_name]/`**: Contains components, hooks, and logic specific to a domain (e.g., `features/inventory`, `features/chat`).
- **`hooks/`**: Shared React hooks for data fetching (SWR/React Query) and state management.

### Maintainability Patterns:
- **Atomic Design:** Keep components small, focused, and pure where possible.
- **Centralized Config:** Store API URLs, constant strings, and brand tokens in a `config/` directory.
- **Consistent Styling:** Use Tailwind CSS exclusively. No ad-hoc inline styles.

## 4. Documentation & Clarity
- **Self-Documenting Code:** Use descriptive variable and function names (e.g., `calculate_commission_fee` vs `calc_fee`).
- **Inline Comments:** Use only for "Why," not "What." Explain complex logic or edge-case handling.
- **Docstrings:** Required for all public service methods and complex utility functions.

## 5. Testing & Quality
- **Unit Tests:** Mandatory for financial logic (commissions, payouts) and AI response parsing.
- **Continuous Integration:** PRs must pass linting (Ruff/ESLint) and basic unit tests before merging.
