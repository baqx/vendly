"use client";

import { ArrowLeft, Printer, RotateCcw, CheckCircle2, Truck, Package, CreditCard, User, Mail, Phone, MapPin, Building, ShieldCheck, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const params = useParams();
  const rawId = params.id as string;
  
  // Default to a PENDING order so "Update Status" button visually works
  const queriedId = rawId ? `#${rawId}` : "#ORD-8818"; 

  const allOrders = [
    { id: "#ORD-8821", customer: "Elena Aris", email: "elena@example.com", avatar: "EA", product: "Organic Coffee Beans", qty: "2× 500g Packs", status: "DELIVERED", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", amount: "$45.00", date: "Oct 24, 2023" },
    { id: "#ORD-8820", customer: "Kofi Osei", email: "kofi.o@provider.gh", avatar: "KO", product: "Premium Shea Butter", qty: "1× 1kg Tub", status: "SHIPPED", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", amount: "$28.50", date: "Oct 24, 2023" },
    { id: "#ORD-8819", customer: "Mariam Ade", email: "m.ade@web.ng", avatar: "MA", product: "Artisan Spice Kit", qty: "3× Starter Sets", status: "PAID", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", amount: "$112.00", date: "Oct 23, 2023" },
    { id: "#ORD-8818", customer: "Chidi L.", email: "chidi@corp.com", avatar: "CL", product: "Woven Storage Baskets", qty: "4× Medium", status: "PENDING", statusColor: "bg-green-50 text-green-700 dark:bg-muted dark:text-muted-foreground border border-green-200 dark:border-border", amount: "$210.00", date: "Oct 23, 2023" },
    { id: "#ORD-8817", customer: "Jane Doe", email: "jane.doe@mail.com", avatar: "JD", product: "Handcrafted Soap Bar", qty: "10× Bulk Order", status: "DELIVERED", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", amount: "$60.00", date: "Oct 22, 2023" },
    { id: "#ORD-8816", customer: "Sarah T.", email: "sarah@web.com", avatar: "ST", product: "Vanilla Extract", qty: "2× Bottles", status: "PENDING", statusColor: "bg-green-50 text-green-700 dark:bg-muted dark:text-muted-foreground border border-green-200 dark:border-border", amount: "$35.00", date: "Oct 21, 2023" },
    { id: "#ORD-8815", customer: "Mark Z.", email: "markz@mail.com", avatar: "MZ", product: "Cocoa Powder", qty: "5× 1kg Bags", status: "PAID", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", amount: "$85.00", date: "Oct 20, 2023" },
  ];

  const foundOrder = allOrders.find(o => o.id === queriedId) || allOrders[0];
  const [order, setOrder] = useState(foundOrder);
  const [isRefunding, setIsRefunding] = useState(false);

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleRefund = () => {
    setIsRefunding(true);
    toast.loading("Processing refund...", { id: "refund-toast" });
    setTimeout(() => {
      setIsRefunding(false);
      toast.success("Refund processed successfully", { 
        id: "refund-toast",
        description: "The amount has been returned to the customer's original payment method and inventory has been restocked."
      });
    }, 1500);
  };

  const handleUpdateStatus = () => {
    if (order.status === "DELIVERED") {
      toast.info("Order is already delivered.");
      return;
    }
    setOrder({ ...order, status: "DELIVERED", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" });
    toast.success("Order status updated!", {
      description: `Status for ${order.id} changed to DELIVERED.`,
    });
  };

  const isPaid = ["PAID", "SHIPPED", "DELIVERED"].includes(order.status);
  const isShipped = ["SHIPPED", "DELIVERED"].includes(order.status);
  const isDelivered = order.status === "DELIVERED";

  let progressWidth = "33.33%";
  if (isPaid) progressWidth = "66.66%";
  if (isShipped) progressWidth = "100%";

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
            <span className={`font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mt-1 ${order.statusColor}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm font-bold text-muted-foreground">Placed on {order.date} at 02:45 PM</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/50 hover:bg-muted text-foreground font-bold transition-all text-sm border border-border/50 shadow-sm active:scale-95">
            <Printer size={16} />
            <span className="hidden sm:inline">Print Invoice</span>
          </button>
          <button onClick={handleRefund} disabled={isRefunding} className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/50 hover:bg-muted text-foreground font-bold transition-all text-sm border border-border/50 shadow-sm active:scale-95 ${isRefunding ? "opacity-50 cursor-not-allowed" : ""}`}>
            <RotateCcw size={16} className={isRefunding ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{isRefunding ? "Processing..." : "Refund Order"}</span>
          </button>
          <button onClick={handleUpdateStatus} className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-700/20 hover:scale-105 active:scale-95 text-sm">
            <span>Update Status</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2 mt-4">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Order Timeline */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:px-10">
            <h2 className="text-lg font-extrabold text-foreground mb-8">Order Timeline</h2>
            
            <div className="relative flex items-center justify-between mx-auto max-w-4xl px-4 sm:px-10">
              {/* Progress Line */}
              <div className="absolute left-6 top-5 right-6 h-1.5 bg-muted rounded-full">
                <div className={`h-full bg-green-600 dark:bg-green-500 rounded-full transition-all duration-1000`} style={{ width: progressWidth }} />
              </div>

              {/* Step 1: Placed */}
              <div className="relative flex flex-col items-center gap-3 z-10 w-28">
                <div className={`w-11 h-11 rounded-full text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-card transition-colors ${"bg-green-600 dark:bg-green-500"}`}>
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className="text-[13px] font-extrabold text-foreground">Order Placed</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Oct 24, 02:45 PM</p>
                </div>
              </div>

              {/* Step 2: Paid */}
              <div className={`relative flex flex-col items-center gap-3 z-10 w-28 ${isPaid ? "" : "opacity-50 grayscale"}`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-card ${isPaid ? "bg-green-600 dark:bg-green-500 text-white shadow-md" : "bg-muted text-muted-foreground border border-border/50"}`}>
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className="text-[13px] font-extrabold text-foreground">Paid</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isPaid ? "Oct 24, 03:10 PM" : "PENDING"}</p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className={`relative flex flex-col items-center gap-3 z-10 w-28 ${isShipped ? "" : "opacity-50 grayscale"}`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-card ${isShipped ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 shadow-md" : "bg-muted text-muted-foreground border border-border/50"}`}>
                  <Truck className={`w-5 h-5 ${isShipped ? "stroke-[2.5]" : "stroke-[2]"}`} />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className={`text-[13px] font-extrabold ${isShipped ? "text-green-700 dark:text-green-500" : "text-foreground"}`}>Shipped</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isShipped ? "Oct 25, 09:30 AM" : "PENDING"}</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className={`relative flex flex-col items-center gap-3 z-10 w-28 ${isDelivered ? "" : "opacity-50 grayscale"}`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-card ${isDelivered ? "bg-green-600 dark:bg-green-500 text-white shadow-md" : "bg-muted text-muted-foreground border border-border/50"}`}>
                  <Package className={`w-5 h-5 ${isDelivered ? "stroke-[2.5]" : "stroke-[2]"}`} />
                </div>
                <div className="text-center absolute top-14 w-full">
                  <p className={`text-[13px] font-extrabold ${isDelivered ? "text-green-700 dark:text-green-500" : "text-foreground"}`}>Delivered</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isDelivered ? order.date : "ESTIMATED OCT 27"}</p>
                </div>
              </div>
            </div>
            
            {/* Spacer for absolute positioned text */}
            <div className="h-14 w-full" />
          </div>

          {/* Ordered Items */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8">
            <h2 className="text-xl font-extrabold text-foreground mb-6">Ordered Items (3)</h2>
            <div className="space-y-6">
                {/* Item 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 group pb-6 border-b border-border/40">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-900/50`}>
                    <Image src="/images/shoes.png" width={80} height={80} alt="Velocity X1 Run Sneakers" className="object-cover drop-shadow-lg group-hover:scale-110 transition-transform duration-500 mix-blend-normal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-foreground truncate">Velocity X1 Run Sneakers</h4>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 truncate">
                      SKU: VL-RUN-42 <span className="mx-1.5 opacity-50">|</span> Color: Crimson Red
                    </p>
                  </div>
                  <div className="text-right sm:pl-4">
                    <p className="text-base font-black text-foreground">$120.00</p>
                    <p className="text-xs font-bold text-muted-foreground mt-0.5">Qty: 01</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 group pb-6 border-b border-border/40">
                  <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-slate-800`}>
                    <Image src="/images/shoes.png" width={80} height={80} alt="Heritage Leather Watch" className="object-cover drop-shadow-lg group-hover:scale-110 transition-transform duration-500 opacity-0" />
                    {/* Fallback emoji */}
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 text-2xl">⌚</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-foreground truncate">Heritage Leather Watch</h4>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 truncate">
                      SKU: WR-LTH-01 <span className="mx-1.5 opacity-50">|</span> Size: Standard
                    </p>
                  </div>
                  <div className="text-right sm:pl-4">
                    <p className="text-base font-black text-foreground">$245.00</p>
                    <p className="text-xs font-bold text-muted-foreground mt-0.5">Qty: 01</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 group">
                  <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-slate-900`}>
                    <Image src="/images/shoes.png" width={80} height={80} alt="Verdant Pro Headphones" className="object-cover drop-shadow-lg group-hover:scale-110 transition-transform duration-500 opacity-0" />
                    {/* Fallback emoji */}
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 text-2xl">🎧</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-foreground truncate">Verdant Pro Headphones</h4>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 truncate">
                      SKU: VD-PRO-90 <span className="mx-1.5 opacity-50">|</span> Noise Cancelling
                    </p>
                  </div>
                  <div className="text-right sm:pl-4">
                    <p className="text-base font-black text-foreground">$89.00</p>
                    <p className="text-xs font-bold text-muted-foreground mt-0.5">Qty: 02</p>
                  </div>
                </div>
            </div>
          </div>

          {/* Logistics & Tracking */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8 flex flex-col hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-foreground">Logistics & Tracking</h3>
              <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                DHL Express
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">TRACKING NUMBER</p>
                <p className="text-sm font-black text-foreground">9921-8842-7721</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">CARRIER PARTNER</p>
                <p className="text-sm font-bold text-foreground">DHL Global Logistics</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">WEIGHT</p>
                <p className="text-sm font-bold text-foreground">2.4 kg (5.3 lbs)</p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-2xl border border-border/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-card border border-border/50 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <CheckCircle2 size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-foreground">Latest Update: En Route to Destination</h4>
                <p className="text-[11px] font-bold text-muted-foreground mt-1">Lagos Sorting Facility, Nigeria</p>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mt-2">OCT 25, 2023 • 11:20 PM</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column (Sidebar Information Context) */}
        <div className="space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8 flex flex-col hover:shadow-md transition-all">
            <h3 className="text-lg font-extrabold text-foreground mb-6">Customer Details</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-lg overflow-hidden shrink-0 ring-1 ring-border/50 object-cover relative">
                <Image src="/rahman.jpeg" fill className="object-cover" alt="Adebola Johnson" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-foreground">Adebola Johnson</h4>
                <Link href="/dashboard/customers" className="text-[11px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest hover:underline mt-0.5 inline-block">
                  View Profile
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-0.5">EMAIL ADDRESS</p>
                  <p className="text-sm font-bold text-foreground break-all">ade.johnson@example.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-0.5">PHONE NUMBER</p>
                  <p className="text-sm font-bold text-foreground">+234 812 345 6789</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8 flex flex-col hover:shadow-md transition-all">
            <h3 className="text-lg font-extrabold text-foreground mb-6">Address Information</h3>
            
            <div className="mb-6 pb-6 border-b border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-green-700 dark:text-green-500" />
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">SHIPPING ADDRESS</p>
              </div>
              <h4 className="text-sm font-extrabold text-foreground mb-2">Adebola Johnson</h4>
              <p className="text-xs font-bold text-muted-foreground leading-loose">
                42 Victoria Island Business<br/>
                District<br/>
                Suite 110, Palms Plaza<br/>
                Lagos, 101241<br/>
                Nigeria
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
          <div className="bg-[#f0fdf4] dark:bg-green-900/10 rounded-[2rem] border border-green-100 dark:border-green-900/30 shadow-sm p-6 lg:p-8 flex flex-col hover:shadow-md transition-all">
            <h3 className="text-lg font-extrabold text-foreground mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-green-200/50 dark:border-green-900/30">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Subtotal</span>
                <span className="font-extrabold text-foreground">$543.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Shipping</span>
                <span className="font-extrabold text-foreground">$25.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Tax (VAT 7.5%)</span>
                <span className="font-extrabold text-foreground">$40.73</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="font-black text-foreground block">Total</span>
                <span className="font-black text-foreground block">Amount</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-green-700 dark:text-green-500 tracking-tight">$608.73</span>
                <span className="block text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1">PAID VIA VISA CARD</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-xl border border-green-200/50 dark:border-green-900/30">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">SECURED BY STRIPE</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
