"use client";

import { ArrowLeft, Printer, RotateCcw, CheckCircle2, Truck, Package, CreditCard, User, Mail, Phone, MapPin, Building, ShieldCheck, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  variant?: string | null;
  product?: { 
    title?: string | null;
    images?: { url: string }[];
  };
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress?: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-900 border border-amber-200/60 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50",
  PAID: "bg-success-bg text-green-900 border border-green-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-green-900/30",
  SHIPPED: "bg-info-bg text-blue-900 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/30",
  DELIVERED: "bg-success-bg text-green-900 border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/30",
};

const STATUS_FLOW = ["PENDING", "PAID", "SHIPPED", "DELIVERED"] as const;

type OrderStatus = (typeof STATUS_FLOW)[number];

const getNextStatus = (status: string) => {
  const currentIndex = STATUS_FLOW.indexOf(status as OrderStatus);
  if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[currentIndex + 1];
};

export default function OrderDetailsPage() {
  const params = useParams();
  const rawId = params.id as string;

  const { data: orderData, mutate } = useSWR<Order>(rawId ? `/orders/${rawId}` : null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const order: Order = orderData ?? {
    id: rawId || "order",
    customerName: "Customer",
    customerPhone: "--",
    shippingAddress: "--",
    totalAmount: 0,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    items: [],
  };

  const statusPill = STATUS_STYLES[order.status] || "bg-muted text-muted-foreground";
  const placedDate = formatDate(order.createdAt);
  const placedTime = formatTime(order.createdAt);
  const itemSubtotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const orderTotal = order.totalAmount || itemSubtotal;
  const customerInitials = order.customerName
    ? order.customerName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()
    : "CU";
  const customerLink = order.customerPhone
    ? `/dashboard/customers/${encodeURIComponent(order.customerPhone)}`
    : "/dashboard/customers";

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleRefund = () => {
    setIsRefunding(true);
    toast.info("Refunds are not available yet for Vendly orders.");
    setTimeout(() => setIsRefunding(false), 800);
  };

  const handleUpdateStatus = async () => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) {
      toast.info("Order is already delivered.");
      return;
    }

    setIsUpdating(true);
    try {
      const updated = await apiRequest<Order>(`/orders/${order.id}?status=${nextStatus}`, {
        method: "PATCH",
      });
      mutate(updated, false);
      toast.success("Order status updated!", {
        description: `Status for ${order.id} changed to ${nextStatus}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update order status.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const isPaid = ["PAID", "SHIPPED", "DELIVERED"].includes(order.status);
  const isShipped = ["SHIPPED", "DELIVERED"].includes(order.status);
  const isDelivered = order.status === "DELIVERED";

  let progressWidth = "33.33%";
  if (isPaid) progressWidth = "66.66%";
  if (isShipped) progressWidth = "100%";
  const nextStatus = getNextStatus(order.status);

  return (

    <div className="space-y-6 pb-20">
      
      {/* Breadcrumb & Header Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/40">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Link href="/dashboard/orders" className="hover:text-green-700 dark:hover:text-green-500 transition-colors">Orders</Link>
            <span>›</span>
            <span className="text-foreground">Details</span>
          </div>

          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-foreground">{order.id}</h1>
            <span className={`font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-[4px] mt-1 ${statusPill}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm font-bold text-muted-foreground">Placed on {placedDate} at {placedTime}</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-3 rounded-[4px] bg-muted/50 hover:bg-muted text-foreground font-bold transition-all text-sm border border-border/50 active:scale-95">
            <Printer size={16} />
            <span className="hidden sm:inline">Print Invoice</span>
          </button>
          <button onClick={handleRefund} disabled={isRefunding} className={`flex items-center gap-2 px-5 py-3 rounded-[4px] bg-muted/50 hover:bg-muted text-foreground font-bold transition-all text-sm border border-border/50 active:scale-95 ${isRefunding ? "opacity-50 cursor-not-allowed" : ""}`}>
            <RotateCcw size={16} className={isRefunding ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{isRefunding ? "Processing..." : "Refund Order"}</span>
          </button>
          <button
            onClick={handleUpdateStatus}
            disabled={!nextStatus || isUpdating}
            className={`bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-[4px] font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 text-sm ${
              !nextStatus || isUpdating ? "opacity-60 cursor-not-allowed hover:scale-100 active:scale-100" : ""
            }`}
          >
            <span>{isUpdating ? "Updating..." : nextStatus ? `Mark ${nextStatus}` : "Order Completed"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2 mt-4">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Order Timeline */}
          <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 lg:px-10">
            <h2 className="text-lg font-extrabold text-foreground mb-8">Order Timeline</h2>
            
            <div className="relative flex items-center justify-between mx-auto max-w-4xl px-4 sm:px-10">
              {/* Progress Line */}
              <div className="absolute left-6 top-5 right-6 h-1.5 bg-muted rounded-[4px]">
                <div className={`h-full bg-green-600 dark:bg-emerald-500 rounded-[4px] transition-all duration-1000`} style={{ width: progressWidth }} />
              </div>

              {/* Step 1: Placed */}
              <div className="relative flex flex-col items-center gap-3 z-10 w-28">
                <div className={`w-11 h-11 rounded-[4px] text-white flex items-center justify-center ring-4 ring-white dark:ring-card transition-colors ${"bg-green-600 dark:bg-emerald-500"}`}>
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className="text-[13px] font-extrabold text-foreground">Order Placed</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{placedDate} • {placedTime}</p>
                </div>
              </div>

              {/* Step 2: Paid */}
              <div className={`relative flex flex-col items-center gap-3 z-10 w-28 ${isPaid ? "" : "opacity-50 grayscale"}`}>
                <div className={`w-11 h-11 rounded-[4px] flex items-center justify-center ring-4 ring-white dark:ring-card ${isPaid ? "bg-green-600 dark:bg-emerald-500 text-white" : "bg-muted text-muted-foreground border border-border/50"}`}>
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className="text-[13px] font-extrabold text-foreground">Paid</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isPaid ? placedDate : "PENDING"}</p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className={`relative flex flex-col items-center gap-3 z-10 w-28 ${isShipped ? "" : "opacity-50 grayscale"}`}>
                <div className={`w-11 h-11 rounded-[4px] flex items-center justify-center ring-4 ring-white dark:ring-card ${isShipped ? "bg-success-bg dark:bg-green-900/30 text-green-700 dark:text-green-500 border border-green-100 dark:border-green-900/30" : "bg-muted text-muted-foreground border border-border/50"}`}>
                  <Truck className={`w-5 h-5 ${isShipped ? "stroke-[2.5]" : "stroke-[2]"}`} />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className={`text-[13px] font-extrabold ${isShipped ? "text-green-700 dark:text-green-500" : "text-foreground"}`}>Shipped</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isShipped ? "DISPATCHED" : "PENDING"}</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className={`relative flex flex-col items-center gap-3 z-10 w-28 ${isDelivered ? "" : "opacity-50 grayscale"}`}>
                <div className={`w-11 h-11 rounded-[4px] flex items-center justify-center ring-4 ring-white dark:ring-card ${isDelivered ? "bg-green-600 dark:bg-emerald-500 text-white" : "bg-muted text-muted-foreground border border-border/50"}`}>
                  <Package className={`w-5 h-5 ${isDelivered ? "stroke-[2.5]" : "stroke-[2]"}`} />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className={`text-[13px] font-extrabold ${isDelivered ? "text-green-700 dark:text-green-500" : "text-foreground"}`}>Delivered</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isDelivered ? "ARRIVED" : "PENDING"}</p>
                </div>
              </div>
            </div>
            
            {/* Spacer for absolute positioned text */}
            <div className="h-14 w-full" />
          </div>

          {/* Ordered Items */}
          <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 lg:p-8">
            <h2 className="text-xl font-extrabold text-foreground mb-6">Ordered Items ({order.items.length})</h2>
            <div className="space-y-6">
              {order.items.length === 0 ? (
                <div className="py-6 text-sm font-bold text-muted-foreground">
                  No items found for this order.
                </div>
              ) : (
                order.items.map((item, index) => {
                  const title = item.product?.title || item.productId || "Order item";
                  const variantLabel = item.variant ? `Variant: ${item.variant}` : "Variant: --";
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 group ${
                        index < order.items.length - 1 ? "pb-6 border-b border-border/40" : ""
                      }`}
                    >
                      <div className="w-20 h-20 rounded-[4px] flex items-center justify-center overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-900/50 border border-border/40 relative">
                        {item.product?.images?.[0]?.url ? (
                          <Image src={item.product.images[0].url} fill alt={title} className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Package className="text-muted-foreground/30" size={32} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-foreground truncate">{title}</h4>
                        <p className="text-[11px] font-bold text-muted-foreground mt-1 truncate">
                          {variantLabel}
                        </p>
                      </div>
                      <div className="text-right sm:pl-4">
                        <p className="text-base font-black text-foreground">{formatCurrency(item.price)}</p>
                        <p className="text-xs font-bold text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Logistics & Tracking */}
          <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 lg:p-8 flex flex-col transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-foreground">Logistics & Tracking</h3>
              <span className="bg-muted text-muted-foreground font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-[4px]">
                Not Linked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">TRACKING NUMBER</p>
                <p className="text-sm font-black text-foreground">--</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">CARRIER PARTNER</p>
                <p className="text-sm font-bold text-foreground">--</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">WEIGHT</p>
                <p className="text-sm font-bold text-foreground">--</p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-[4px] border border-border/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[4px] bg-white dark:bg-card border border-border/50 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-foreground">Latest Update: Logistics not available</h4>
                <p className="text-[11px] font-bold text-muted-foreground mt-1">Tracking data will appear once logistics are connected.</p>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mt-2">{placedDate} • {placedTime}</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column (Sidebar Information Context) */}
        <div className="space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 lg:p-8 flex flex-col transition-all">
            <h3 className="text-lg font-extrabold text-foreground mb-6">Customer Details</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-[4px] bg-success-bg dark:bg-green-900/30 flex items-center justify-center font-black text-green-700 text-lg overflow-hidden shrink-0 ring-1 ring-border/50">
                {customerInitials}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-foreground">{order.customerName || "Customer"}</h4>
                <Link href={customerLink} className="text-[11px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest hover:underline mt-0.5 inline-block">
                  View Profile
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-0.5">EMAIL ADDRESS</p>
                  <p className="text-sm font-bold text-foreground break-all">--</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-0.5">PHONE NUMBER</p>
                  <p className="text-sm font-bold text-foreground">{order.customerPhone || "--"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 lg:p-8 flex flex-col transition-all">
            <h3 className="text-lg font-extrabold text-foreground mb-6">Address Information</h3>
            
            <div className="mb-6 pb-6 border-b border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-green-700 dark:text-green-500" />
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">SHIPPING ADDRESS</p>
              </div>
              <h4 className="text-sm font-extrabold text-foreground mb-2">{order.customerName || "Customer"}</h4>
              <p className="text-xs font-bold text-muted-foreground leading-loose">
                {order.shippingAddress || "--"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-green-700 dark:text-green-500" />
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">BILLING ADDRESS</p>
              </div>
              <p className="text-xs font-bold text-muted-foreground italic tracking-wide">
                Same as shipping address
              </p>
            </div>
          </div>
          
          {/* Payment Summary */}
          <div className="bg-success-bg dark:bg-green-900/10 rounded-[4px] border border-green-100 dark:border-green-900/30 p-6 lg:p-8 flex flex-col transition-all">
            <h3 className="text-lg font-extrabold text-foreground mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-green-200/50 dark:border-green-900/30">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Subtotal</span>
                <span className="font-extrabold text-foreground">{formatCurrency(itemSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Shipping</span>
                <span className="font-extrabold text-foreground">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Tax (VAT 7.5%)</span>
                <span className="font-extrabold text-foreground">{formatCurrency(0)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="font-black text-foreground block">Total</span>
                <span className="font-black text-foreground block">Amount</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-green-700 dark:text-green-500 tracking-tight">{formatCurrency(orderTotal)}</span>
                <span className="block text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1">PAYMENT STATUS: {order.status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/40 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-[4px] border border-green-200/50 dark:border-green-900/30">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">SECURED BY VENDLY</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

