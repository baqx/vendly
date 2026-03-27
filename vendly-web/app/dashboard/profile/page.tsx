"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiForm } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Phone,
  Camera,
  Loader2,
  Check,
  Mail,
  User
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: vendorData, mutate } = useSWR<any>("/vendors/me", swrFetcher);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vendorData) {
      const v = vendorData;
      setStoreName(v.storeName || "");
      setStoreDesc(v.description || "");
      setEmail(v.email || "");
      setPhone(v.phoneNumber || "");
      if (v.logoUrl) setLogoPreview(v.logoUrl);
    }
  }, [vendorData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("storeName", storeName);
      formData.append("description", storeDesc);
      formData.append("phoneNumber", phone);
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      
      await apiForm("/vendors/me", "PATCH", formData);
      await mutate();
      setSaved(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const charCount = storeDesc.length;

  return (
    <div className="max-w-[760px] mx-auto pb-24 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-[13px] font-bold"
        >
          <ArrowLeft size={15} />
        </Link>
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-green-600 dark:text-green-400">
          Account Settings
        </span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-foreground leading-none">
          Store Profile
        </h1>
        <p className="text-muted-foreground font-medium mt-2 text-[15px]">
          Manage your boutique&apos;s public identity and verified contact details.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Store Identity */}
        <section className="bg-white dark:bg-card border border-border/50 rounded-[4px] shadow-minimal p-6 sm:p-8">
          <h2 className="text-[18px] font-extrabold text-foreground mb-8">Store Identity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-8 items-start">
            {/* Logo */}
            <div>
              <label className="block text-[12px] font-extrabold text-foreground mb-3 uppercase tracking-wider">
                Store Logo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full aspect-square max-w-[160px] bg-muted/30 border-2 border-dashed border-border rounded-[4px] flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden group"
              >
                {logoPreview ? (
                  <>
                    <img
                      src={logoPreview}
                      alt="logo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs font-bold">
                      <Camera size={20} />
                      Change
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud size={24} className="text-muted-foreground mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center px-4">
                      Upload Logo
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full border border-border/60 rounded-[4px] px-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  value={storeDesc}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) setStoreDesc(e.target.value);
                  }}
                  rows={4}
                  className="w-full border border-border/60 rounded-[4px] px-4 py-3 text-sm font-medium bg-transparent focus:ring-2 focus:ring-green-500/20 resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Max 250 characters.
                  </p>
                  <p className={`text-[10px] font-bold ${charCount > 230 ? "text-amber-500" : "text-muted-foreground"}`}>
                    {charCount}/250
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Business Contact */}
        <section className="bg-white dark:bg-card border border-border/50 rounded-[4px] shadow-minimal p-6 sm:p-8">
          <h2 className="text-[18px] font-extrabold text-foreground mb-8">Business Contact</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">
                Login Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full border border-border/60 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold bg-muted/30 text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">
                Verified Phone
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-border/60 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold bg-transparent focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky footer action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[30] pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="ml-auto" style={{ maxWidth: "760px" }}>
            <div className="pointer-events-auto border-t border-border/50 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center justify-end gap-3 shadow-minimal">
              <button
                onClick={() => {
                  if (vendorData) {
                    const v = vendorData;
                    setStoreName(v.storeName || "");
                    setStoreDesc(v.description || "");
                    setEmail(v.email || "");
                    setPhone(v.phoneNumber || "");
                    setLogoPreview(v.logoUrl || null);
                    setLogoFile(null);
                  }
                }}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-[4px] border border-border/60 text-[14px] font-bold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`inline-flex items-center gap-2 px-8 py-2.5 rounded-[4px] text-[14px] font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none ${
                  saved
                    ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-green-700 hover:bg-green-800 text-white"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check size={16} /> Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

