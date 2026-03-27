"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, Image as ImageIcon, Box, FileText, UploadCloud, Banknote, Truck, Bold, Italic, List as ListIcon, Link as LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { apiForm } from "@/lib/api";

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const isEditing = Boolean(productId);

  const [taxEnabled, setTaxEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    mapPrice: "",
    stockLevel: "",
    category: "",
    tags: "",
  });
  const [variants, setVariants] = useState<{ name: string; value: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: productResp } = useSWR<any>(
    isEditing ? `/products/${productId}` : null
  );
  const product = productResp;

  useEffect(() => {
    if (!product) return;
    setForm({
      title: product.title || "",
      description: product.description || "",
      basePrice: String(product.basePrice || ""),
      mapPrice: String(product.mapPrice || ""),
      stockLevel: String(product.stockLevel || ""),
      category: product.category || (product.tags?.[0] || ""),
      tags: product.tags?.join(", ") || "",
    });
    if (product.variants) {
      setVariants(product.variants);
    }
  }, [product]);

  const addVariant = () => setVariants([...variants, { name: "", value: "" }]);
  const removeVariant = (idx: number) => setVariants(variants.filter((_, i) => i !== idx));
  const updateVariant = (idx: number, field: "name" | "value", val: string) => {
    const newVariants = [...variants];
    newVariants[idx][field] = val;
    setVariants(newVariants);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("basePrice", form.basePrice);
      formData.append("stockLevel", form.stockLevel);
      formData.append("tags", form.tags);
      
      if (variants.length > 0) {
        formData.append("variants", JSON.stringify(variants));
      }
      
      images.forEach((file) => {
        formData.append("images", file);
      });

      const endpoint = isEditing ? `/products/${productId}` : "/products";
      const method = isEditing ? "PATCH" : "POST";

      await apiForm(endpoint, method, formData);
      toast.success(isEditing ? "Product updated!" : "Product published!");
      router.push("/dashboard/inventory");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4">
            <Link href="/dashboard/inventory" className="hover:text-green-700 transition-colors">Inventory</Link>
            <span>›</span>
            <span className="text-foreground">{isEditing ? "Edit Product" : "Add New Product"}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {isEditing ? "Edit Product" : "Create New Product"}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">Fill in the details to list your item across the ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Col: Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Information */}
          <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-green-700 dark:text-green-500" size={24} />
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">General Information</h2>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Premium Shea Butter Gold" 
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Description</label>
                <div className="rounded-[4px] border border-border/40 overflow-hidden bg-[#F4F6F9] dark:bg-muted/40 transition-all focus-within:ring-2 focus-within:ring-green-600/20">
                  <div className="flex items-center gap-1 p-2 border-b border-border/40 bg-muted/20">
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"><Bold size={14} /></button>
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"><Italic size={14} /></button>
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"><ListIcon size={14} /></button>
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"><LinkIcon size={14} /></button>
                  </div>
                  <textarea 
                    rows={6} 
                    placeholder="Describe your product in detail..." 
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent outline-none font-medium text-foreground resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Media Assets</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border/60 rounded-[4px] p-10 flex flex-col items-center justify-center gap-3 hover:bg-muted/30 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-[4px] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max. 5MB)</p>
                  </div>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {images.map((file, i) => (
                      <div key={i} className="px-3 py-1.5 bg-muted rounded-[4px] text-xs font-bold text-foreground flex items-center gap-2">
                        {file.name}
                        <button onClick={() => setImages(images.filter((_, idx) => idx !== i))}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Logistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <Banknote className="text-green-700 dark:text-green-500" size={24} />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Pricing</h2>
              </div>
              <div className="space-y-5 flex-1">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Base Price (₦)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-black text-foreground text-lg transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block text-muted-foreground/60">Compare at Price (₦)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={form.mapPrice}
                    onChange={(e) => setForm({ ...form, mapPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-[4px] border border-border/20 bg-muted/10 focus:ring-2 focus:ring-green-600/10 outline-none font-bold text-muted-foreground opacity-60 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F4F6F9] dark:bg-muted/30 rounded-[4px]">
                  <span className="text-sm font-bold text-foreground">Charge tax?</span>
                  <button 
                    onClick={() => setTaxEnabled(!taxEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${taxEnabled ? "bg-green-700" : "bg-muted-foreground/30"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-all ${taxEnabled ? "left-[22px]" : "left-[2px]"}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="text-green-700 dark:text-green-500" size={24} />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Inventory</h2>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">SKU</label>
                    <input 
                      type="text" 
                      placeholder="COF-001" 
                      className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Stock</label>
                    <input 
                      type="number" 
                      placeholder="100" 
                      value={form.stockLevel}
                      onChange={(e) => setForm({ ...form, stockLevel: e.target.value })}
                      className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block text-muted-foreground/60">Category / Tags</label>
                  <input 
                    type="text" 
                    placeholder="Skincare, Organic, Gold" 
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 outline-none font-bold text-foreground transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Secondary Info */}
        <div className="space-y-8">
          
          {/* Variants Card */}
          <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Box className="text-green-700 dark:text-green-500" size={24} />
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">Variants</h2>
            </div>
            
            <div className="space-y-4">
              {variants.length === 0 && (
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  Add options like size or color for your customers to choose.
                </p>
              )}
              {variants.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Size" 
                    value={v.name} 
                    onChange={(e) => updateVariant(i, "name", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 text-xs font-bold text-foreground"
                  />
                  <input 
                    type="text" 
                    placeholder="Large" 
                    value={v.value} 
                    onChange={(e) => updateVariant(i, "value", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 text-xs font-bold text-foreground"
                  />
                  <button onClick={() => removeVariant(i)} className="text-muted-foreground hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addVariant}
                className="flex items-center gap-2 text-[11px] font-black text-green-700 uppercase tracking-widest hover:underline pt-2"
              >
                <Plus size={14} /> Add Variant Option
              </button>
            </div>
          </div>

          {/* Visibility Info */}
          <div className="bg-[#f0fdf4] dark:bg-green-950/20 rounded-[4px] border border-green-100 dark:border-green-900/30 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-green-700 dark:text-green-500" size={20} />
              <h3 className="text-base font-extrabold text-foreground">Visibility</h3>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              New products are published immediately and becomes available for your AI assistant to sell on Telegram.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-card border border-border/50 rounded-[4px] shadow-sm">
        <button 
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-[4px] font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-700 hover:bg-green-800 text-white px-10 py-3 rounded-[4px] font-black flex items-center gap-2 shadow-minimal transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Publish Product"}
        </button>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse text-muted-foreground font-bold italic tracking-widest">Loading Editor...</div>}>
      <AddProductForm />
    </Suspense>
  );
}
