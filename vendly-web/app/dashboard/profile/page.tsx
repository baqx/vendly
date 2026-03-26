"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiForm, apiJson } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Phone,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  Camera,
  Eye,
  EyeOff,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const mismatch = confirm.length > 0 && next !== confirm;

  const handleSave = () => {
    if (!current || !next || next !== confirm) return;
    toast.error("Password update is not currently supported in the API.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-card border border-border/60 rounded-[4px] shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
          <h2 className="text-[17px] font-extrabold text-foreground">Change Password</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {(["Current Password", "New Password", "Confirm New Password"] as const).map(
            (label, i) => {
              const val = i === 0 ? current : i === 1 ? next : confirm;
              const setter = i === 0 ? setCurrent : i === 1 ? setNext : setConfirm;
              const show = i === 0 ? showCurrent : i === 1 ? showNext : showConfirm;
              const toggle =
                i === 0
                  ? () => setShowCurrent((v) => !v)
                  : i === 1
                  ? () => setShowNext((v) => !v)
                  : () => setShowConfirm((v) => !v);
              const isError = i === 2 && mismatch;

              return (
                <div key={label}>
                  <label className="block text-[12px] font-extrabold text-foreground mb-1.5">
                    {label}
                  </label>
                  <div
                    className={`flex items-center border rounded-[4px] px-3 py-2.5 gap-2 transition-colors ${
                      isError
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                        : "border-border/60 bg-transparent focus-within:ring-2 focus-within:ring-green-500/20"
                    }`}
                  >
                    <input
                      type={show ? "text" : "password"}
                      value={val}
                      onChange={(e) => setter(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-transparent text-[13px] font-medium text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {isError && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      Passwords do not match.
                    </p>
                  )}
                </div>
              );
            }
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[4px] text-[13px] font-bold border border-border/60 hover:bg-muted text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!current || !next || next !== confirm}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-[4px] text-[13px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              saved
                ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400"
                : "bg-green-700 hover:bg-green-800 text-white"
            }`}
          >
            {saved ? (
              <>
                <Check size={14} /> Updated!
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: vendorData, mutate } = useSWR("/vendors/me", swrFetcher);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [twoFA, setTwoFA] = useState(true);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vendorData?.data) {
      const v = vendorData.data;
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
      if (storeName) formData.append("storeName", storeName);
      if (storeDesc) formData.append("description", storeDesc);
      if (phone) formData.append("phoneNumber", phone);
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
    <>
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      <div className="max-w-[760px] mx-auto pb-24 animate-in fade-in duration-500">
        {/* ── Breadcrumb ── */}
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

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-foreground leading-none">
            Store Profile
          </h1>
          <p className="text-muted-foreground font-medium mt-2 text-[15px]">
            Manage your boutique&apos;s public identity and account security.
          </p>
        </div>

        <div className="space-y-8">
          {/* ─────────────────────────────── 1. Store Identity ─────────────────────── */}
          <section className="bg-white dark:bg-card border border-border/50 rounded-[4px] shadow-minimal p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-extrabold text-foreground">Store Identity</h2>
              <button className="inline-flex items-center gap-1.5 text-[13px] font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
                <ExternalLink size={14} />
                Public Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 items-start">
              {/* Logo */}
              <div>
                <label className="block text-[12px] font-extrabold text-foreground mb-2">
                  Store Logo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full aspect-square max-w-[140px] bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-[4px] flex flex-col items-center justify-center cursor-pointer hover:bg-muted/60 transition-colors overflow-hidden group"
                >
                  {logoPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreview}
                        alt="logo"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                        <Camera size={20} />
                        <span className="text-[10px] font-bold">Change</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoPreview(null);
                        }}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-[4px] p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                      >
                        <X size={11} />
                      </button>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={22} className="text-muted-foreground mb-1.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center px-2">
                        Upload Logo
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-1.5">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-2.5 text-[14px] font-bold text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-1.5">
                    Store Description
                  </label>
                  <textarea
                    value={storeDesc}
                    onChange={(e) => {
                      if (e.target.value.length <= 250) setStoreDesc(e.target.value);
                    }}
                    rows={4}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-3 text-[13px] font-medium text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none leading-relaxed transition"
                  />
                  <p className="text-[11px] font-medium text-muted-foreground mt-1">
                    Brief description for your store profile. Max 250 characters.{" "}
                    <span className={charCount > 230 ? "text-amber-500 font-bold" : ""}>
                      ({charCount}/250)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────── 2. Personal Information ──────────────── */}
          <section className="bg-white dark:bg-card border border-border/50 rounded-[4px] shadow-minimal p-6 sm:p-8">
            <h2 className="text-[18px] font-extrabold text-foreground mb-6">
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-2.5 text-[14px] font-bold text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500/20 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[12px] font-extrabold text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border/60 rounded-[4px] px-4 py-2.5 text-[14px] font-bold text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500/20 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[12px] font-extrabold text-foreground mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center border border-border/60 rounded-[4px] px-4 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-green-500/20 transition bg-transparent">
                  <Phone size={15} className="text-muted-foreground shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] font-bold text-foreground outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────── 3. Security ──────────────────────────── */}
          <section className="bg-white dark:bg-card border border-border/50 rounded-[4px] shadow-minimal p-6 sm:p-8">
            <h2 className="text-[18px] font-extrabold text-foreground mb-6">Security</h2>

            <div className="space-y-3">
              {/* Change Password row */}
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-[4px] bg-muted/20 dark:bg-muted/10 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[4px] bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <RefreshCw size={17} />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-foreground">
                      Change Password
                    </p>
                    <p className="text-[12px] font-medium text-muted-foreground mt-0.5">
                      Keep your account secure with a strong password.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-1.5 rounded-[4px] border border-green-600/60 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 text-[13px] font-bold transition-colors shrink-0 ml-4"
                >
                  Update
                </button>
              </div>

              {/* Two-Factor Authentication row */}
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-[4px] bg-muted/20 dark:bg-muted/10 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[4px] bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <ShieldCheck size={17} />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-foreground">
                      Two-Factor Authentication
                    </p>
                    <p className="text-[12px] font-medium text-muted-foreground mt-0.5">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => setTwoFA((v) => !v)}
                  className={`w-12 h-6 rounded-[20px] p-1 transition-colors relative flex shrink-0 ml-4 ${
                    twoFA ? "bg-green-600" : "bg-muted-foreground/30"
                  }`}
                  aria-label="Toggle Two-Factor Authentication"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      twoFA ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ── Sticky footer action bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-[30] pointer-events-none">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="ml-auto" style={{ maxWidth: "760px" }}>
              <div className="pointer-events-auto border-t border-border/50 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => {
                    if (vendorData?.data) {
                      const v = vendorData.data;
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
                  className={`inline-flex items-center gap-2 px-7 py-2.5 rounded-[4px] text-[14px] font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none ${
                    saved
                      ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                      : "bg-green-700 hover:bg-green-800 text-white"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving...
                    </>
                  ) : saved ? (
                    <>
                      <Check size={15} /> Saved!
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
    </>
  );
}
