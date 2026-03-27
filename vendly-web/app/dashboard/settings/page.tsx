"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiForm, apiJson } from "@/lib/api";
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
  CreditCard,
  Bot,
  Phone,
  Percent,
  Lock,
  ArrowRight
} from "lucide-react";

interface Bank {
  code: string;
  name?: string;
  InstitutionName?: string;
}

interface Vendor {
  id: string;
  storeName?: string;
  description?: string;
  location?: string;
  phoneNumber?: string;
  category?: string;
  logoUrl?: string;
  botEnabled?: boolean;
  telegramToken?: string;
  hagglingLimit?: number;
  botPersonality?: string;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  walletBalance?: number;
}

interface BankValidationResponse {
  AccountName?: string;
}

export default function SettingsPage() {
  const { data: vendorData, mutate } = useSWR<Vendor>("/vendors/me", swrFetcher);
  const { data: banksResp } = useSWR<Bank[]>("/payouts/banks", swrFetcher as any);
  const banks = banksResp || [];

  const [activeSection, setActiveSection] = useState("profile");
  
  // Profile State
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // AI State
  const [botEnabled, setBotEnabled] = useState(false);
  const [telegramToken, setTelegramToken] = useState("");
  const [tone, setTone] = useState("professional");
  const [behavior, setBehavior] = useState("helpful");
  const [hagglingLimit, setHagglingLimit] = useState(0);
  
  // Settlement State
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vendorData) {
      const v = vendorData;
      setStoreName(v.storeName || "");
      setDescription(v.description || "");
      setLocation(v.location || "");
      setPhoneNumber(v.phoneNumber || "");
      if (v.category) {
        setCategories(v.category.split(",").map(c => c.trim()).filter(Boolean));
      }
      if (v.logoUrl) setLogoPreview(v.logoUrl);
      
      setBotEnabled(v.botEnabled || false);
      setTelegramToken(v.telegramToken || "");
      setHagglingLimit(Number(v.hagglingLimit) || 0);

      if (v.botPersonality) {
        const p = v.botPersonality.toLowerCase();
        if (p.includes("professional")) setTone("professional");
        else if (p.includes("friendly")) setTone("friendly");
        else if (p.includes("casual")) setTone("casual");
        
        if (p.includes("aggressive")) setBehavior("aggressive");
        else if (p.includes("helpful")) setBehavior("helpful");
        else if (p.includes("passive")) setBehavior("passive");
      }

      setBankName(v.bankName || "");
      setBankCode(v.bankCode || "");
      setAccountNumber(v.accountNumber || "");
      setAccountName(v.accountName || "");
    }
  }, [vendorData]);

  const sections = [
    { id: "profile", label: "Store Profile", icon: Store },
    { id: "ai", label: "AI Assistant", icon: Bot },
    { id: "settlement", label: "Settlement", icon: CreditCard },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("storeName", storeName);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("phoneNumber", phoneNumber);
      formData.append("category", categories.join(", "));
      
      formData.append("botEnabled", String(botEnabled));
      formData.append("telegramToken", telegramToken);
      formData.append("botPersonality", `${tone} and ${behavior}`);
      formData.append("hagglingLimit", String(hagglingLimit));
      
      formData.append("bankName", bankName);
      formData.append("bankCode", bankCode);
      formData.append("accountNumber", accountNumber);
      formData.append("accountName", accountName);
      
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      
      await apiForm("/vendors/me", "PATCH", formData);
      await mutate();
      setSaved(true);
      toast.success("Settings updated and synchronized!");
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

  const handleValidateAccount = async () => {
    if (!bankCode || accountNumber.length < 10) return;
    setIsValidating(true);
    try {
      const data = await apiJson<BankValidationResponse>("/payouts/validate", "POST", { accountNumber, bankCode });
      if (data?.AccountName) {
        setAccountName(data.AccountName);
        toast.success("Account verified!");
      } else {
        toast.error("Could not verify account name.");
      }
    } catch (error) {
      toast.error("Validation failed. Please check details.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-foreground leading-none">Settings</h1>
          <p className="text-muted-foreground font-medium mt-3 text-[15px] max-w-xl">
            Configure your store's identity, AI behavior, and financial settlement details.
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

      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8 items-start mt-8">
        {/* Sticky Sidebar Navigation */}
        <div className="w-full lg:sticky lg:top-[100px] space-y-2">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[4px] font-bold text-[14px] transition-all ${
                  activeSection === section.id 
                    ? "bg-white dark:bg-card text-green-700 dark:text-green-400 shadow-minimal border border-border/50"
                    : "text-muted-foreground hover:bg-white/50 dark:hover:bg-card/50 hover:text-foreground border border-transparent"
                }`}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-10 min-w-0 w-full">
          
          {/* 1. Store Profile */}
          <div id="profile" className="bg-white dark:bg-card border border-border/50 shadow-minimal rounded-[4px] p-6 sm:p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-[4px] text-green-700 dark:text-green-500">
                <Store size={20} />
              </div>
              <h2 className="text-[18px] font-extrabold text-foreground tracking-tight">Store Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 items-start">
              <div className="space-y-4">
                <label className="block text-[12px] font-extrabold text-foreground uppercase tracking-widest">Logo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square bg-muted/30 border-2 border-dashed border-border rounded-[4px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground relative overflow-hidden group"
                >
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="logo" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                        <UploadCloud size={20} />
                        <span className="text-[10px] font-bold">Change</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={24} />
                      <span className="text-[10px] font-bold uppercase text-center px-4">Upload Logo</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Store Name</label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Category</label>
                  <input 
                    type="text" 
                    value={categories.join(", ")}
                    onChange={(e) => setCategories(e.target.value.split(",").map(c => c.trim()))}
                    placeholder="e.g. Fashion, Electronics"
                    className="w-full border border-border/60 rounded-[4px] px-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Lagos, Nigeria"
                      className="w-full border border-border/60 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+234..."
                      className="w-full border border-border/60 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Store Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-3 text-sm font-medium bg-transparent focus:ring-2 focus:ring-green-500/20 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI Assistant Configuration */}
          <div id="ai" className="bg-white dark:bg-card border border-border/50 shadow-minimal rounded-[4px] p-6 sm:p-8 scroll-mt-24 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-[4px] text-green-700 dark:text-green-500">
                  <Bot size={20} />
                </div>
                <h2 className="text-[18px] font-extrabold text-foreground tracking-tight">AI Assistant</h2>
              </div>
              <button 
                onClick={() => setBotEnabled(!botEnabled)}
                className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center ${botEnabled ? "bg-green-700" : "bg-muted"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${botEnabled ? "translate-x-7" : "translate-x-0"}`} />
              </button>
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest flex items-center gap-2">
                    Telegram Bot Token
                    <HelpCircle size={14} className="text-muted-foreground cursor-help" />
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="password" 
                      value={telegramToken}
                      onChange={(e) => setTelegramToken(e.target.value)}
                      placeholder="123456:ABC-DEF..."
                      className="w-full border border-border/60 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium pt-1">Obtain this token from @BotFather on Telegram.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">AI Persona / Tone</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "professional", icon: Briefcase },
                      { id: "friendly", icon: Smile },
                      { id: "casual", icon: Coffee }
                    ].map(t => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTone(t.id)}
                          className={`flex flex-col items-center gap-2 py-4 rounded-[4px] border-2 transition-all ${
                            tone === t.id ? "bg-green-700 border-green-700 text-white" : "bg-background border-border/50 text-muted-foreground hover:border-green-700/50"
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-[10px] font-black uppercase">{t.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Haggling Limit (%)</label>
                  <div className="relative">
                    <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="number" 
                      value={hagglingLimit}
                      onChange={(e) => setHagglingLimit(Number(e.target.value))}
                      max={50}
                      min={0}
                      className="w-full border border-border/60 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium pt-1">Maximum discount the AI is authorized to negotiate.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Sales Behavior</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "aggressive", icon: Zap, color: "text-amber-500", desc: "Priority on closing sales and upselling." },
                    { id: "helpful", icon: HelpCircle, color: "text-blue-500", desc: "Balanced guidance and suggestions." },
                    { id: "passive", icon: Eye, color: "text-slate-400", desc: "Responds only when explicitly prompted." }
                  ].map(b => {
                    const Icon = b.icon;
                    return (
                      <div 
                        key={b.id}
                        onClick={() => setBehavior(b.id)}
                        className={`p-5 rounded-[4px] border-2 cursor-pointer transition-all ${
                          behavior === b.id ? "bg-green-800 border-green-800 text-white" : "bg-white dark:bg-card border-border/50 hover:border-green-700/30 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2 uppercase text-[10px] font-black">
                          <Icon size={16} className={behavior === b.id ? "text-green-300" : b.color} />
                          {b.id}
                        </div>
                        <p className={`text-[11px] font-medium leading-relaxed ${behavior === b.id ? "text-green-100" : "text-muted-foreground"}`}>
                          {b.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Settlement Details */}
          <div id="settlement" className="bg-white dark:bg-card border border-border/50 shadow-minimal rounded-[4px] p-6 sm:p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-[4px] text-green-700 dark:text-green-500">
                <CreditCard size={20} />
              </div>
              <h2 className="text-[18px] font-extrabold text-foreground tracking-tight">Settlement Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Select Bank</label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select 
                    value={bankCode}
                    onChange={(e) => {
                      const b = banks.find((x: any) => x.code === e.target.value);
                      setBankCode(e.target.value);
                      if (b) setBankName(b.name || b.InstitutionName || "");
                    }}
                    className="w-full border border-border/60 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20 appearance-none"
                  >
                    <option value="">Select your bank...</option>
                    {banks.map((b: any) => (
                      <option key={b.code} value={b.code}>{b.name || b.InstitutionName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Account Number</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="0123456789"
                    className="flex-1 border border-border/60 rounded-[4px] px-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                  />
                  <button 
                    onClick={handleValidateAccount}
                    disabled={isValidating || !bankCode || accountNumber.length < 10}
                    className="px-4 py-3 bg-muted hover:bg-muted-foreground/10 rounded-[4px] text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    {isValidating ? "..." : "Verify"}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-foreground/50">
                <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">Verified Account Name</label>
                <input 
                  type="text" 
                  value={accountName}
                  readOnly
                  placeholder="Will be verified automatically"
                  className="w-full border border-border/40 rounded-[4px] px-4 py-3 text-sm font-bold bg-muted/10 cursor-not-allowed"
                />
              </div>

              <div className="col-span-1 md:col-span-2 pt-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-[4px] flex gap-3">
                  <HelpCircle className="text-amber-600 shrink-0" size={20} />
                  <p className="text-[12px] font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
                    Settlements are processed automatically every 24 hours to the verified bank account above. Please ensure details are correct to avoid delays.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

