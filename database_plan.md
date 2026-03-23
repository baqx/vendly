# Vendly: Database Plan (Prisma & PostgreSQL)

> [!WARNING]
> The official `prisma-client-python` for FastAPI is currently deprecated. For a robust Python backend, we recommend using **SQLAlchemy** or **Tortoise ORM**. However, the Prisma schema below is provided as requested and can be used to generate the database structure or integrated if you choose to use Prisma for the schema management.

## Schema Architecture

```prisma
// This is your Prisma schema file

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js" // For Next.js if needed
}

// Vendor Account & Store Settings
model Vendor {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String
  storeName         String
  category          String?
  location          String?
  
  // Bot Configuration
  botEnabled        Boolean  @default(false)
  botPersonality    String?  @db.Text
  telegramToken     String?
  whatsappMetaToken String?
  
  // Financials
  walletBalance     Decimal  @default(0.0) @db.Decimal(12, 2)
  
  // Relationships
  products          Product[]
  orders            Order[]
  coupons           Coupon[]
  transactions      Transaction[]
  chatSessions      ChatSession[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// Product & Inventory
model Product {
  id             String         @id @default(cuid())
  vendorId       String
  vendor         Vendor         @relation(fields: [vendorId], references: [id])
  
  title          String
  description    String?        @db.Text
  technicalSpecs Json?          // For electronics/technical items
  basePrice      Decimal        @db.Decimal(12, 2)
  mapPrice       Decimal        @db.Decimal(12, 2) // Minimum Acceptable Price
  stockLevel     Int            @default(0)
  
  images         ProductImage[]
  variants       ProductVariant[]
  reviews        ProductReview[]
  
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
}

model ProductVariant {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String  // e.g., "Color", "Size"
  value     String  // e.g., "Blue", "UK 14"
}

model ProductReview {
  id           String   @id @default(cuid())
  productId    String
  product      Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  rating       Int      @default(5)
  comment      String?  @db.Text
  customerName String?
  createdAt    DateTime @default(now())
}

// Orders & Transactions
model Order {
  id               String      @id @default(cuid())
  vendorId         String
  vendor           Vendor      @relation(fields: [vendorId], references: [id])
  
  customerName     String
  customerPhone    String
  shippingAddress  String?
  totalAmount      Decimal     @db.Decimal(12, 2)
  status           OrderStatus @default(PENDING)
  
  paymentRef       String?     @unique // Interswitch Reference
  logisticsRef     String?     // GIGL/Gokada Waybill
  
  transactions     Transaction[]
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
  DISPUTE
}

// Financial Ledger
model Transaction {
  id        String          @id @default(cuid())
  vendorId  String
  vendor    Vendor          @relation(fields: [vendorId], references: [id])
  orderId   String?
  order     Order?          @relation(fields: [orderId], references: [id])
  
  type      TransactionType
  amount    Decimal         @db.Decimal(12, 2)
  timestamp DateTime        @default(now())
}

enum TransactionType {
  SALE
  PAYOUT
  COMMISSION
  REFUND
}

// Coupons & AI Context
model Coupon {
  id             String   @id @default(cuid())
  vendorId       String
  vendor         Vendor   @relation(fields: [vendorId], references: [id])
  
  code           String   @unique
  discountType   String   // "PERCENTAGE" or "FIXED"
  value          Decimal  @db.Decimal(12, 2)
  minOrderValue  Decimal? @db.Decimal(12, 2)
  active         Boolean  @default(true)
  
  createdAt      DateTime @default(now())
}

// Bot Chat History
model ChatSession {
  id                 String        @id @default(cuid())
  vendorId           String
  vendor             Vendor        @relation(fields: [vendorId], references: [id])
  
  channel            ChatChannel
  customerIdentifier String        // Phone number or TG Chat ID
  active             Boolean       @default(true)
  humanTakeover      Boolean       @default(false)
  
  messages           ChatMessage[]
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
}

enum ChatChannel {
  WHATSAPP
  TELEGRAM
}

model ChatMessage {
  id        String      @id @default(cuid())
  sessionId String
  session   ChatSession @relation(fields: [sessionId], references: [id])
  
  role      MessageRole
  content   String      @db.Text
  timestamp DateTime    @default(now())
}

enum MessageRole {
  BOT
  CUSTOMER
  VENDOR
}
```

## Database Selection
- **PostgreSQL:** Best for relational data and complex queries like inventory management and financial tracking.
- **Provider Recommendation:** **Supabase** or **Neon** for easy serverless integration and built-in connection pooling.

## Future Considerations
- **Full-Text Search:** Potentially use `pg_trgm` or an external service like Algolia if product search becomes complex.
- **Analytics:** The `Transaction` table allows for easy generation of revenue reports and vendor analytics.
