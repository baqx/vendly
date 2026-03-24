"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Truck,
  FileText,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function AddCustomerPage() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+234",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCustomer = () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in the required fields (Name & Email).");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating customer profile...", { id: "create-customer" });
    
    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Customer profile created successfully!", { 
        id: "create-customer",
        description: "Redirecting to directory." 
      });
      router.push("/dashboard/customers");
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto pb-20">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-2">
        <Link 
          href="/dashboard/customers" 
          className="flex items-center gap-2 text-sm font-extrabold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors w-fit group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Customers
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Add New Customer</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Create a new profile to track orders and manage relationships.
        </p>
      </div>

      {/* ── Main Form Card ── */}
      <div className="bg-card border border-border/50 rounded-3xl shadow-sm p-6 lg:p-10 space-y-12 relative overflow-hidden">
        
        {/* Section 1: Personal Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-13">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-foreground">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Ama Odunayo"
                className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-foreground">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ama.o@example.com"
                className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-extrabold text-foreground">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative shrink-0 w-[100px]">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-full bg-muted/40 border border-border/50 rounded-xl pl-4 pr-8 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="+234">+234</option>
                    <option value="+233">+233</option>
                    <option value="+254">+254</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="812 345 6789"
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Shipping Address */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
              <Truck size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">Shipping Address</h2>
          </div>

          <div className="space-y-6 pl-0 md:pl-13">
             <div className="space-y-2">
              <label className="text-xs font-extrabold text-foreground">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="House number, Street name, Area"
                className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-foreground">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Lagos"
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>
               <div className="space-y-2">
                <label className="text-xs font-extrabold text-foreground">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Lagos State"
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-foreground">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="100001"
                  className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Private Notes */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">Private Notes</h2>
          </div>

          <div className="pl-0 md:pl-13 space-y-2">
             <label className="text-xs font-extrabold text-foreground">Notes (Internal only)</label>
             <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Mention sizing preferences, preferred delivery times, or previous communication history..."
                className="w-full h-32 bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
              />
          </div>
        </section>

        {/* Action Row */}
        <div className="pt-6 border-t border-border/40 flex items-center justify-end gap-3 mt-10">
          <button
            onClick={() => router.push("/dashboard/customers")}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-extrabold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={handleCreateCustomer}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl text-sm font-extrabold transition-all shadow-md shadow-green-700/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSubmitting ? "Creating..." : "Create Customer"}
            {!isSubmitting && <CheckCircle2 size={16} />}
          </button>
        </div>
      </div>

      {/* ── Bottom Widgets ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Pro Tip Card */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 flex gap-5 relative overflow-hidden transition-all hover:shadow-sm">
          {/* Faint star background graphic */}
          <div className="absolute -right-8 -bottom-8 text-muted/30 rotate-12 pointer-events-none">
            <StarGraphic />
          </div>
          
          <div className="w-10 h-10 rounded-xl bg-green-400 dark:bg-green-600 flex items-center justify-center shrink-0 relative z-10 shadow-inner">
             <Sparkles size={20} className="text-white fill-current" />
          </div>
          <div className="relative z-10">
            <h3 className="text-base font-extrabold text-foreground mb-1">Pro Tip</h3>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Adding a shipping address now will speed up the checkout process for future orders from this customer.
            </p>
          </div>
        </div>

        {/* Total Customers Metric */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 flex items-center justify-between transition-all hover:shadow-sm">
           <div>
            <p className="text-[10px] uppercase tracking-widest font-extrabold text-muted-foreground mb-2">Total Customers</p>
            <span className="text-4xl font-black text-green-700 dark:text-green-500 tracking-tight">1,284</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
            <TrendingUp size={20} />
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple decorative star SVG for the Pro Tip background
function StarGraphic() {
  return (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
            stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}
