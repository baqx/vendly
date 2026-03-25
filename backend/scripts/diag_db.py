import asyncio
import os
import asyncpg
from prisma import Prisma

async def test_asyncpg(url):
    print(f"\nTesting asyncpg with: {url}")
    try:
        conn = await asyncpg.connect(url, timeout=10)
        print("asyncpg: SUCCESS!")
        await conn.close()
        return True
    except Exception as e:
        print(f"asyncpg: FAILED with {type(e).__name__}: {e}")
        return False

async def test_prisma(url):
    print(f"\nTesting Prisma with: {url}")
    db = Prisma(datasource={'url': url})
    try:
        await db.connect()
        print("Prisma: SUCCESS!")
        await db.disconnect()
        return True
    except Exception as e:
        print(f"Prisma: FAILED with {type(e).__name__}: {e}")
        return False

async def main():
    # Direct host
    direct_url = "postgresql://neondb_owner:npg_bIW8ysT0SKck@ep-dark-bonus-an8ufcmn.us-east-1.aws.neon.tech/neondb?sslmode=require"
    # Pooler host
    pooler_url = "postgresql://neondb_owner:npg_bIW8ysT0SKck@ep-dark-bonus-an8ufcmn-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
    
    print("--- STARTING COMPREHENSIVE DB DIAGNOSTICS ---")
    
    await test_asyncpg(direct_url)
    await test_asyncpg(pooler_url)
    
    await test_prisma(direct_url)
    await test_prisma(pooler_url)
    
    # Try pooler with pgbouncer=true (common Prisma fix)
    pooler_pg_url = pooler_url + "&pgbouncer=true"
    await test_prisma(pooler_pg_url)

if __name__ == "__main__":
    asyncio.run(main())
