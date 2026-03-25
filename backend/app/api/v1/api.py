from fastapi import APIRouter
from .endpoints import auth, vendors, products, ai, orders, transactions, coupons, webhooks, chats, dashboard, payouts, customers

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(vendors.router, prefix="/vendors", tags=["vendors"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(coupons.router, prefix="/coupons", tags=["coupons"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(payouts.router, prefix="/payouts", tags=["payouts"])
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
