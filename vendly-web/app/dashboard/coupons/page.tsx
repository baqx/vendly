"use client";

import { useState } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiJson } from "@/lib/api";
import { toast } from "sonner";
import { 
  Ticket, 
  Plus, 
  Tag, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  TrendingDown
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  timesUsed: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function CouponsPage() {
  const { data, isLoading, mutate } = useSWR("/coupons", swrFetcher);
  const coupons: Coupon[] = data?.data || [];

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 10,
    maxUses: 100,
    expiresAt: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCoupons = coupons.filter(c => c.isActive).length;
  const totalUses = coupons.reduce((acc, c) => acc + c.timesUsed, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountPercent: Number(formData.discountPercent),
        maxUses: Number(formData.maxUses),
        isActive: true,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      };

      await apiJson("/coupons", "POST", payload);
      toast.success("Coupon created successfully");
      setIsCreating(false);
      setFormData({ code: "", discountPercent: 10, maxUses: 100, expiresAt: "" });
      mutate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Discount Coupons</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Create and track promotional codes to boost sales.
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-[4px] text-sm font-bold transition-all shadow-none shadow-green-700/20"
        >
          {isCreating ? <XCircle size={16} /> : <Plus size={16} />}
          {isCreating ? "Cancel" : "Create Coupon"}
        </button>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border/50 rounded-[4px] p-6 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-[4px] bg-green-50 text-green-700 flex items-center justify-center shrink-0">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Total Coupons</p>
            <h2 className="text-2xl font-black tracking-tight text-foreground mt-1">{isLoading ? "..." : coupons.length}</h2>
          </div>
        </div>
        
        <div className="bg-card border border-border/50 rounded-[4px] p-6 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-[4px] bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/50">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Active Now</p>
            <h2 className="text-2xl font-black tracking-tight text-foreground mt-1">{isLoading ? "..." : activeCoupons}</h2>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[4px] p-6 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-[4px] bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100/50">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Total Claimed</p>
            <h2 className="text-2xl font-black tracking-tight text-foreground mt-1">{isLoading ? "..." : totalUses}</h2>
          </div>
        </div>
      </div>

      {/* ── Create Form ── */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-[4px] p-6 lg:p-8 animate-in slide-in-from-top-4 duration-300 shadow-minimal">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-[4px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-500 flex items-center justify-center">
              <Plus size={16} />
            </div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">New Coupon</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Coupon Code</label>
              <input 
                type="text" 
                required
                placeholder="e.g. SUMMER20"
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full bg-background border border-border rounded-[4px] px-4 py-2.5 text-sm font-bold shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors uppercase placeholder:normal-case placeholder:font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Discount %</label>
              <div className="relative">
                <TrendingDown size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="number" 
                  min="1" max="100" required
                  value={formData.discountPercent}
                  onChange={e => setFormData({...formData, discountPercent: Number(e.target.value)})}
                  className="w-full bg-background border border-border rounded-[4px] pl-10 pr-4 py-2.5 text-sm font-bold shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Max Uses</label>
              <input 
                type="number" min="1" required
                value={formData.maxUses}
                onChange={e => setFormData({...formData, maxUses: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-[4px] px-4 py-2.5 text-sm font-bold shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Expiry Date (Optional)</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="datetime-local" 
                  value={formData.expiresAt}
                  onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                  className="w-full bg-background border border-border rounded-[4px] pl-10 pr-4 py-2.5 text-sm font-bold shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-8 py-2.5 rounded-[4px] text-sm font-bold transition-all disabled:opacity-70 min-w-[140px]"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Coupon"}
            </button>
          </div>
        </form>
      )}

      {/* ── Table Container ── */}
      <div className="bg-card border border-border/50 rounded-[4px] shadow-none overflow-hidden pt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40">
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Code</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Discount</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Usage</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="flex justify-center"><Loader2 size={24} className="animate-spin text-green-700" /></div>
                  </td>
                </tr>
              )}
              {!isLoading && coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm font-medium">
                    <Ticket size={32} className="mx-auto mb-3 opacity-20" />
                    No coupons found. Create your first discount!
                  </td>
                </tr>
              )}
              {!isLoading && coupons.map((coupon) => {
                const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                const isActive = coupon.isActive && !isExpired && coupon.timesUsed < coupon.maxUses;
                
                return (
                  <tr key={coupon.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-black text-foreground bg-muted/50 px-2 py-1 rounded border border-border/50 font-mono tracking-wider">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-black text-green-700 dark:text-green-500">
                        {coupon.discountPercent}% OFF
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {coupon.timesUsed} <span className="text-muted-foreground font-medium text-xs">/ {coupon.maxUses}</span>
                        </span>
                        <div className="w-16 h-1.5 bg-muted rounded overflow-hidden">
                          <div 
                            className="bg-green-700 h-full rounded transition-all" 
                            style={{ width: `${Math.min(100, (coupon.timesUsed / coupon.maxUses) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-extrabold tracking-widest uppercase border ${
                        isActive 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {isActive ? "Active" : isExpired ? "Expired" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
