"use client";

import { useState } from "react";
import { ArrowLeft, UserPlus, Search, Plus, Trash2, MapPin, CreditCard, Lightbulb, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateManualOrderPage() {
  const router = useRouter();
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK" | "POS" | "LINK">("CASH");
  const [productSearch, setProductSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrder = () => {
    setIsSubmitting(true);
    toast.loading("Creating order...", { id: "create-order" });
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Order #ORD-8822 created successfully!", { 
        id: "create-order",
        description: "Navigating back to orders list."
      });
      router.push("/dashboard/orders");
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/orders" className="flex items-center gap-2 text-sm font-extrabold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors w-fit group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create Manual Order</h1>
        <p className="text-muted-foreground font-medium">Generate a new transaction for in-person sales or phone orders.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-8 w-full">
          
          {/* Customer Selection */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                  <UserPlus size={18} />
                </div>
                <h2 className="text-xl font-extrabold text-foreground">Customer Selection</h2>
              </div>
              <button 
                onClick={() => toast("Customer Directory", { description: "Select from recent customers modal would open here." })} 
                className="text-xs font-extrabold text-green-700 dark:text-green-500 hover:underline"
              >
                Select Existing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chinua Achebe" 
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  placeholder="chinua@example.com" 
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+234 ..." 
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>
            </div>
          </div>

          {/* Items & Inventory */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
               <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                  <Search size={18} />
                </div>
                <h2 className="text-xl font-extrabold text-foreground">Items & Inventory</h2>
              </div>
              <button 
                onClick={() => toast.info("Opening product catalog scanner...")}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-xs"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>

            {/* Added Item Row */}
            <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <Image src="/images/watch.png" width={40} height={40} alt="Watch" className="object-cover drop-shadow-md brightness-110" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-foreground">Emerald Trail Runners</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">SKU: VLD-4421-G</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="space-y-1.5 flex-1 sm:flex-none">
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest text-center">QTY</p>
                  <div className="flex items-center justify-center bg-white dark:bg-card border border-border/60 rounded-lg px-4 py-2 font-extrabold text-sm w-16 mx-auto shadow-sm">
                    1
                  </div>
                </div>
                <div className="space-y-1.5 flex-1 sm:flex-none min-w-[80px]">
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest text-center">PRICE</p>
                  <p className="text-sm font-extrabold text-foreground text-center bg-white dark:bg-card border border-border/60 rounded-lg px-4 py-2 shadow-sm">₦45,000</p>
                </div>
                <button 
                  onClick={() => toast.success("Emerald Trail Runners removed from order.")}
                  className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors mt-4"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Empty Search State */}
            <div className="border-2 border-dashed border-border/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground/50">
                <Search size={24} />
              </div>
              <p className="text-sm font-bold text-muted-foreground mb-4">Search for products to add to this order</p>
              <div className="relative max-w-sm w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                <input 
                  type="text" 
                  placeholder="Type name or SKU..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-muted/40 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>
            </div>
          </div>

          {/* Logistics & Notes */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-foreground">Logistics & Notes</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest mb-2">Shipping Address</h3>
                <input 
                  type="text" 
                  placeholder="Street Address" 
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  />
                  <input 
                    type="text" 
                    placeholder="State/Province" 
                    className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-2 group w-fit">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${shippingSameAsBilling ? "bg-green-600 border-green-600 text-white" : "border-muted-foreground bg-transparent"}`}>
                    {shippingSameAsBilling && <CheckCircle2 size={12} className="stroke-[4]" />}
                  </div>
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors select-none">Billing address same as shipping</span>
                  <input type="checkbox" className="hidden" checked={shippingSameAsBilling} onChange={() => setShippingSameAsBilling(!shippingSameAsBilling)} />
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest mb-2">Order Notes</h3>
                <textarea 
                  placeholder="Add any special instructions or internal notes here..." 
                  className="w-full h-[150px] bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                <CreditCard size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-foreground">Payment Method</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "CASH", label: "CASH", icon: <CreditCard size={20} /> },
                { id: "BANK", label: "BANK", icon: <CreditCard size={20} /> },
                { id: "POS", label: "POS", icon: <CreditCard size={20} /> },
                { id: "LINK", label: "LINK", icon: <CreditCard size={20} /> },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                    paymentMethod === method.id 
                      ? "bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 shadow-md scale-[1.02]" 
                      : "bg-muted/30 border-border/50 hover:border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={paymentMethod === method.id ? "text-green-600 dark:text-green-500" : ""}>{method.icon}</div>
                  <span className="text-xs font-extrabold uppercase tracking-widest">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>


        {/* Right Column - Order Summary (Sticky) */}
        <div className="w-full xl:w-[400px] shrink-0 space-y-6 lg:sticky lg:top-8">
          
          <div className="bg-green-50/50 dark:bg-green-950/10 rounded-[2rem] border border-green-100 dark:border-green-900/30 shadow-sm p-6 lg:p-8 flex flex-col">
            <h2 className="text-xl font-extrabold text-foreground mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-green-200/50 dark:border-green-900/50">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Subtotal</span>
                <span className="font-extrabold text-foreground">₦45,000.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Shipping</span>
                <span className="font-extrabold text-foreground">₦2,500.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Tax (7.5%)</span>
                <span className="font-extrabold text-foreground">₦3,375.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Discounts</span>
                <span className="font-extrabold text-red-500">- ₦0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest pb-1">TOTAL<br/>AMOUNT</span>
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end text-green-700 dark:text-green-400">
                  <span className="text-xl font-black">₦</span>
                  <span className="text-4xl font-black tracking-tight">50,875.00</span>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground mt-1">Conversion rate applied: ₦1,200/USD</p>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <button 
                onClick={handleCreateOrder}
                disabled={isSubmitting}
                className={`w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-extrabold text-base transition-all shadow-xl shadow-green-700/20 hover:scale-105 active:scale-95 ${isSubmitting ? "opacity-70 cursor-not-allowed hover:scale-100 active:scale-100" : ""}`}
              >
                {isSubmitting ? "Processing..." : "Create Order"}
              </button>
              <button 
                onClick={() => {
                  toast.info("Draft discarded.");
                  router.push("/dashboard/orders");
                }}
                disabled={isSubmitting}
                className="w-full bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-900/50 py-4 rounded-xl font-extrabold text-sm transition-colors text-center"
              >
                Discard Draft
              </button>
            </div>
          </div>

          <div className="bg-muted/40 rounded-[2rem] border border-border/50 p-6 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
              <Lightbulb size={16} className="fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-foreground mb-1">Quick Tip</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Orders created manually will automatically deduct stock from your main inventory. Ensure you check availability before confirming.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
