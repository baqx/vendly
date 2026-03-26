"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiForm } from "@/lib/api";
import { toast } from "sonner";
import { 
  UploadCloud, 
  X, 
  Plus, 
  MapPin, 
  Building,
  Briefcase,
  Smile,
  Coffee,
  Zap,
  HelpCircle,
  Eye,
  Store,
  Truck,
  CreditCard,
  Bot
} from "lucide-react";

export default function SettingsPage() {
  const { data: vendorData, mutate } = useSWR<any>("/vendors/me", swrFetcher);

  const [activeSection, setActiveSection] = useState("profile");
  const [tone, setTone] = useState("professional");
  const [behavior, setBehavior] = useState("helpful");
  const [discountRules, setDiscountRules] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vendorData?.data) {
      const v = vendorData.data;
      setStoreName(v.storeName || "");
      setDescription(v.description || "");
      if (v.category) {
        setCategories(v.category.split(",").map((c: string) => c.trim()).filter(Boolean));
      }
      if (v.logoUrl) setLogoPreview(v.logoUrl);
      
      if (v.botPersonality) {
        const p = v.botPersonality.toLowerCase();
        if (p.includes("professional")) setTone("professional");
        else if (p.includes("friendly")) setTone("friendly");
        else if (p.includes("casual")) setTone("casual");
        
        if (p.includes("aggressive")) setBehavior("aggressive");
        else if (p.includes("helpful")) setBehavior("helpful");
        else if (p.includes("passive")) setBehavior("passive");
      }
      setDiscountRules(v.hagglingLimit > 0);
    }
  }, [vendorData]);

  const sections = [
    { id: "profile", label: "Store Profile" },
    { id: "delivery", label: "Delivery Options" },
    { id: "payment", label: "Payment Setup" },
    { id: "ai", label: "AI Assistant" },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const removeCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
  };

  const addCategory = () => {
    const cat = prompt("Enter new category name:");
    if (cat && cat.trim() && !categories.includes(cat.trim())) {
      setCategories(prev => [...prev, cat.trim()]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (storeName) formData.append("storeName", storeName);
      if (description) formData.append("description", description);
      if (categories.length > 0) formData.append("category", categories.join(", "));
      
      const combinedPersonality = `${tone} and ${behavior}`;
      formData.append("botPersonality", combinedPersonality);
      formData.append("hagglingLimit", discountRules ? "10.0" : "0.0");
      
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      
      await apiForm("/vendors/me", "PATCH", formData);
      await mutate();
      setSaved(true);
      toast.success("Settings updated successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-foreground leading-none">Settings</h1>
          <p className="text-muted-foreground font-medium mt-3 text-[15px] max-w-xl">
            Configure your store's digital identity, logistics, and AI-driven growth tools from one central ledger.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-3.5 rounded-[4px] font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap disabled:opacity-70 disabled:pointer-events-none ${
            saved 
              ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
              : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {isSaving ? "Saving..." : saved ? "✓ Saved!" : "Save All Changes"}
        </button>
      </div>

      <div className="flex flex-col gap-8 items-stretch mt-8">
        {/* Top Sticky Navigation */}
        <div className="w-full sticky top-[72px] z-30 bg-muted/30 dark:bg-card/80 backdrop-blur-xl border border-border/80 rounded-[4px] p-1.5 shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`flex-1 text-center px-4 py-2.5 rounded-[4px] font-bold text-[14px] transition-all whitespace-nowrap ${
                  activeSection === section.id 
                    ? "bg-white dark:bg-muted text-green-700 dark:text-green-400 shadow-sm border border-border/50"
                    : "text-muted-foreground hover:bg-white/50 dark:hover:bg-muted/50 hover:text-foreground border border-transparent"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-10 min-w-0 w-full max-w-4xl mx-auto">
          
          {/* 1. Store Profile */}
          <div id="profile" className="bg-white dark:bg-card border border-border/50 shadow-minimal rounded-[4px] p-6 sm:p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-[4px] text-green-700 dark:text-green-500">
                <Store size={20} />
              </div>
              <h2 className="text-[18px] font-extrabold text-foreground tracking-tight">Store Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 items-start">
              <div>
                <label className="block text-[12px] font-extrabold text-foreground mb-2">Store Logo</label>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square bg-[#F8F9FF] dark:bg-muted/30 border-2 border-dashed border-border rounded-[4px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground relative overflow-hidden group"
                >
                  {logoPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoPreview} alt="logo preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                        <UploadCloud size={20} />
                        <span className="text-[10px] font-bold">Change</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLogoPreview(null); }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-[4px] p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">Upload PNG/JPG</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-2">Store Name</label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-2.5 text-sm font-bold text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {categories.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-[12px] font-bold rounded-[4px]">
                        {cat}
                        <button onClick={() => removeCategory(cat)} className="hover:text-green-950 dark:hover:text-green-200 transition-colors"><X size={14} /></button>
                      </span>
                    ))}
                    <button onClick={addCategory} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-[12px] font-bold rounded-[4px] transition-colors border border-border/50">
                      <Plus size={14} />
                      Add Category
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-3 text-[13px] font-medium text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500/20 min-h-[100px] resize-y leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Delivery Options */}
          <div id="delivery" className="bg-white dark:bg-card border border-border/50 shadow-minimal rounded-[4px] p-6 sm:p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-[4px] text-green-700 dark:text-green-500">
                <Truck size={20} />
              </div>
              <h2 className="text-[18px] font-extrabold text-foreground tracking-tight">Delivery Options</h2>
            </div>

            <div className="space-y-4">
              {/* Existing Zone */}
              <div className="bg-[#F8F9FF] dark:bg-muted/20 border border-border/60 rounded-[4px] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-extrabold text-foreground">Lagos Metropolitan</h3>
                    <p className="text-[13px] font-medium text-muted-foreground mt-0.5">Same-day and standard delivery zones</p>
                  </div>
                  <span className="bg-green-700 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[4px]">
                    ACTIVE
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-foreground mb-1.5">Flat Rate (₦)</label>
                    <input 
                      type="text" 
                      defaultValue="2500" 
                      className="w-full bg-white dark:bg-card border border-border/80 rounded-[4px] px-3 py-2 text-[13px] font-bold text-foreground focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-foreground mb-1.5">Est. Days</label>
                    <input 
                      type="text" 
                      defaultValue="1-2 Days" 
                      className="w-full bg-white dark:bg-card border border-border/80 rounded-[4px] px-3 py-2 text-[13px] font-bold text-foreground focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Add Zone Button */}
              <button 
                onClick={() => alert("Shipping zone management coming soon!")}
                className="w-full py-4 border-2 border-dashed border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/30 transition-all rounded-[4px] flex items-center justify-center gap-2 font-bold text-[14px]"
              >
                <MapPin size={16} />
                Add New Shipping Zone
              </button>
            </div>
          </div>

          {/* 3. Payment Setup */}
          <div id="payment" className="bg-white dark:bg-card border border-border/50 shadow-minimal rounded-[4px] p-6 sm:p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-[4px] text-green-700 dark:text-green-500">
                <CreditCard size={20} />
              </div>
              <h2 className="text-[18px] font-extrabold text-foreground tracking-tight">Payment Setup</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-extrabold text-foreground mb-2">Bank Account Details</label>
                <div className="bg-[#F8F9FF] dark:bg-muted/30 border border-border/60 rounded-[4px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-card border border-border/50 rounded-[4px] flex items-center justify-center shadow-sm text-green-700 dark:text-green-500">
                      <Building size={20} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-extrabold text-foreground">First Bank of Nigeria</h4>
                      <p className="text-[14px] font-extrabold text-muted-foreground tracking-widest mt-0.5">•••• 4291</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("Bank account change flow coming soon!")}
                    className="text-[12px] font-extrabold text-green-700 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-2">Payout Schedule</label>
                  <select className="w-full bg-[#F8F9FF] dark:bg-muted/30 border border-border/60 rounded-[4px] px-3 py-2.5 text-[13px] font-bold text-foreground focus:outline-none focus:border-green-500 appearance-none">
                    <option>Weekly (Every Monday)</option>
                    <option>Bi-Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-2">Currency</label>
                  <select className="w-full bg-[#F8F9FF] dark:bg-muted/30 border border-border/60 rounded-[4px] px-3 py-2.5 text-[13px] font-bold text-foreground focus:outline-none focus:border-green-500 appearance-none">
                    <option>Nigerian Naira (₦)</option>
                    <option>US Dollar ($)</option>
                    <option>Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4. AI Assistant Configuration */}
          <div id="ai" className="bg-gradient-to-br from-white via-green-50/50 to-white dark:from-card dark:via-green-900/10 dark:to-card border border-border/50 shadow-minimal rounded-[4px] p-6 sm:p-8 scroll-mt-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-[4px] text-green-700 dark:text-green-500">
                <Bot size={20} />
              </div>
              <h2 className="text-[18px] font-extrabold text-foreground tracking-tight">AI Assistant Configuration</h2>
            </div>
            
            <div className="space-y-8 relative z-10">
              
              {/* Tone Selector */}
              <div>
                <label className="block text-[12px] font-extrabold text-foreground mb-3">Tone Selector</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setTone("professional")}
                    className={`flex flex-col items-center justify-center p-4 rounded-[4px] border-2 transition-all ${
                      tone === "professional" 
                        ? "border-green-700 bg-white dark:bg-card text-green-700 dark:text-green-500 shadow-sm" 
                        : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Briefcase size={20} className="mb-2" />
                    <span className="text-[12px] font-bold">Professional</span>
                  </button>
                  <button 
                    onClick={() => setTone("friendly")}
                    className={`flex flex-col items-center justify-center p-4 rounded-[4px] border-2 transition-all ${
                      tone === "friendly" 
                        ? "border-green-700 bg-white dark:bg-card text-green-700 dark:text-green-500 shadow-sm" 
                        : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Smile size={20} className="mb-2" />
                    <span className="text-[12px] font-bold">Friendly</span>
                  </button>
                  <button 
                    onClick={() => setTone("casual")}
                    className={`flex flex-col items-center justify-center p-4 rounded-[4px] border-2 transition-all ${
                      tone === "casual" 
                        ? "border-green-700 bg-white dark:bg-card text-green-700 dark:text-green-500 shadow-sm" 
                        : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Coffee size={20} className="mb-2" />
                    <span className="text-[12px] font-bold">Casual</span>
                  </button>
                </div>
              </div>

              {/* Discount Rules */}
              <div className="bg-[#F8F9FF] dark:bg-muted/30 border border-border/50 rounded-[4px] p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-extrabold text-foreground">Discount Rules</h3>
                  <p className="text-[12px] font-medium text-muted-foreground mt-0.5">Allow AI to suggest personalized coupons to customers at risk of abandonment.</p>
                </div>
                {/* Toggle Switch */}
                <button 
                  onClick={() => setDiscountRules(!discountRules)}
                  className={`w-12 h-6 rounded-[20px] p-1 transition-colors relative flex shrink-0 ${discountRules ? "bg-green-700" : "bg-muted-foreground/30"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${discountRules ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Sales Behavior */}
              <div>
                <label className="block text-[12px] font-extrabold text-foreground mb-3">Sales Behavior</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Aggressive */}
                  <div 
                    onClick={() => setBehavior("aggressive")}
                    className={`p-5 rounded-[4px] border-2 cursor-pointer transition-all ${
                      behavior === "aggressive"
                        ? "bg-green-800 border-green-800 text-white shadow-sm"
                        : "bg-white dark:bg-card border-border/50 hover:border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className={behavior === "aggressive" ? "text-green-300" : "text-amber-500"} />
                      <h4 className="text-[11px] font-black uppercase tracking-wider">AGGRESSIVE</h4>
                    </div>
                    <p className={`text-[11px] font-medium leading-relaxed ${behavior === "aggressive" ? "text-green-100" : "text-muted-foreground"}`}>
                      Priority on closing sales and upselling high-margin items.
                    </p>
                  </div>

                  {/* Helpful */}
                  <div 
                    onClick={() => setBehavior("helpful")}
                    className={`p-5 rounded-[4px] border-2 cursor-pointer transition-all ${
                      behavior === "helpful"
                        ? "bg-green-800 border-green-800 text-white shadow-sm"
                        : "bg-white dark:bg-card border-border/50 hover:border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle size={16} className={behavior === "helpful" ? "text-green-300" : "text-blue-500"} />
                      <h4 className="text-[11px] font-black uppercase tracking-wider">HELPFUL</h4>
                    </div>
                    <p className={`text-[11px] font-medium leading-relaxed ${behavior === "helpful" ? "text-green-100" : "text-muted-foreground"}`}>
                      Balances product guidance with soft sales suggestions.
                    </p>
                  </div>

                  {/* Passive */}
                  <div 
                    onClick={() => setBehavior("passive")}
                    className={`p-5 rounded-[4px] border-2 cursor-pointer transition-all ${
                      behavior === "passive"
                        ? "bg-green-800 border-green-800 text-white shadow-sm"
                        : "bg-white dark:bg-card border-border/50 hover:border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Eye size={16} className={behavior === "passive" ? "text-green-300" : "text-slate-400"} />
                      <h4 className="text-[11px] font-black uppercase tracking-wider">PASSIVE</h4>
                    </div>
                    <p className={`text-[11px] font-medium leading-relaxed ${behavior === "passive" ? "text-green-100" : "text-muted-foreground"}`}>
                      Responds only when prompted by customer questions.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
