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

  const { data: product } = useSWR(
    isEditing ? `/products/${productId}` : null
  );

  useEffect(() => {
    if (!product) return;
    setForm({
      title: product.title ?? "",
      description: product.description ?? "",
      basePrice: product.basePrice?.toString?.() ?? "",
      mapPrice: product.mapPrice?.toString?.() ?? "",
      stockLevel: product.stockLevel?.toString?.() ?? "",
      category: "",
      tags: product.tags ?? "",
    });
    setVariants(product.variants ?? []);
  }, [product]);

  const previews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    setImages(Array.from(files));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!form.basePrice.trim()) {
      toast.error("Base price is required.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", form.title);
    if (form.description) formData.append("description", form.description);
    formData.append("basePrice", form.basePrice);
    if (form.mapPrice) formData.append("mapPrice", form.mapPrice);
    if (form.stockLevel) formData.append("stockLevel", form.stockLevel);
    if (variants.length > 0) {
      formData.append("variants", JSON.stringify(variants));
    }
    images.forEach((file) => formData.append("images", file));

    try {
      if (isEditing) {
        await apiForm(`/products/${productId}`, "PATCH", formData);
        toast.success("Product updated successfully.");
      } else {
        await apiForm("/products", "POST", formData);
        toast.success("Product created successfully.");
      }
      router.push("/dashboard/inventory");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save product.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVariant = () => setVariants((prev) => [...prev, { name: "", value: "" }]);
  const updateVariant = (index: number, field: "name" | "value", value: string) => {
    setVariants((prev) =>
      prev.map((variant, idx) => (idx === index ? { ...variant, [field]: value } : variant))
    );
  };
  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="relative flex flex-col pt-2 pb-16">
      <div className="space-y-8 flex-1">
        {/* Breadcrumb Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <span>›</span>
            <Link href="/dashboard/inventory" className="hover:text-foreground transition-colors">Products</Link>
            <span>›</span>
            <span className="text-green-700 dark:text-green-500">{isEditing ? "Edit" : "Add New"}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-green-700 dark:text-green-500" size={24} />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Basic Information</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground block">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Organic Arabica Coffee Beans" 
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-5 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-medium text-foreground transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">Category</label>
                    <select 
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-5 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-medium text-foreground transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="">Select a category</option>
                      <option value="clothing">Clothing</option>
                      <option value="electronics">Electronics</option>
                      <option value="food">Food & Beverage</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">Product Tags</label>
                    <input 
                      type="text" 
                      placeholder="Organic, Fair Trade" 
                      value={form.tags}
                      onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-5 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-medium text-foreground transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground block">Description</label>
                  <div className="w-full rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600/30 transition-all">
                    {/* Rich text toolbar */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-white/50 dark:bg-muted/30">
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"><Bold size={16} /></button>
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"><Italic size={16} /></button>
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"><ListIcon size={16} /></button>
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"><LinkIcon size={16} /></button>
                    </div>
                    <textarea 
                      rows={6} 
                      placeholder="Describe the product details, origins, and unique selling points..." 
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-5 py-4 bg-transparent outline-none font-medium text-sm text-foreground resize-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Media Card */}
            <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="text-green-700 dark:text-green-500" size={24} />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Product Media</h2>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-64 border-2 border-dashed border-green-300 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20 rounded-[4px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors group"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-500 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">Main Image</h3>
                  <p className="text-xs font-medium text-muted-foreground mt-1">Drag and drop or click to upload</p>
                </div>

                {/* Sub grid */}
                <div className="grid grid-cols-2 gap-4">
                  {previews.slice(0, 4).map((src, idx) => (
                    <div key={src} className="aspect-square rounded-[4px] bg-[#F4F6F9] dark:bg-muted/30 border border-border/40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - previews.length) }).map((_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-[4px] bg-[#F4F6F9] dark:bg-muted/30 border border-border/40 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                    >
                       <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-muted/50 flex items-center justify-center text-muted-foreground/60">
                         <Plus size={16} />
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] font-bold text-muted-foreground">Recommended size: 1080×1080px. Max file size: 5MB.</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SIDEBAR CONTENT */}
          <div className="space-y-8">
            
            {/* Pricing Card */}
            <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Banknote className="text-green-700 dark:text-green-500" size={24} />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Pricing</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Base Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-extrabold">$</span>
                    <input 
                      type="text" 
                      placeholder="0.00" 
                      value={form.basePrice}
                      onChange={(e) => setForm((prev) => ({ ...prev, basePrice: e.target.value }))}
                      className="w-full pl-8 pr-5 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Sale Price (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-extrabold">$</span>
                    <input 
                      type="text" 
                      placeholder="0.00" 
                      value={form.mapPrice}
                      onChange={(e) => setForm((prev) => ({ ...prev, mapPrice: e.target.value }))}
                      className="w-full pl-8 pr-5 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
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

            {/* Inventory Card */}
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
                      className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Stock</label>
                    <input 
                      type="text" 
                      placeholder="100" 
                      value={form.stockLevel}
                      onChange={(e) => setForm((prev) => ({ ...prev, stockLevel: e.target.value }))}
                      className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Shipping Weight (kg)</label>
                  <input 
                    type="text" 
                    placeholder="0.5" 
                    className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" placeholder="L" className="w-full px-4 py-3 text-center rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 outline-none font-bold text-foreground transition-all" />
                    <input type="text" placeholder="W" className="w-full px-4 py-3 text-center rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 outline-none font-bold text-foreground transition-all" />
                    <input type="text" placeholder="H" className="w-full px-4 py-3 text-center rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 outline-none font-bold text-foreground transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Variants Card */}
            <div className="bg-white dark:bg-card rounded-[4px] p-8 border border-border/50 shadow-none space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Box className="text-green-700 dark:text-green-500" size={24} />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Variants</h2>
              </div>

              <div className="space-y-4">
                {variants.length === 0 && (
                  <p className="text-xs font-medium text-muted-foreground">
                    Add size, color, or other options customers can select.
                  </p>
                )}
                {variants.map((variant, idx) => (
                  <div key={`${variant.name}-${idx}`} className="grid grid-cols-2 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Name (e.g., Size)"
                      value={variant.name}
                      onChange={(e) => updateVariant(idx, "name", e.target.value)}
                      className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Value (e.g., Medium)"
                        value={variant.value}
                        onChange={(e) => updateVariant(idx, "value", e.target.value)}
                        className="w-full px-4 py-3 rounded-[4px] border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="p-2 rounded-[4px] border border-border/40 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-border/60 bg-muted/30 text-sm font-bold text-foreground hover:bg-muted transition-colors w-fit"
                >
                  <Plus size={16} />
                  Add Variant
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-8">
        <div className="bg-white dark:bg-card border border-border/50 shadow-none rounded-[4px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
            <AlertCircle size={16} className="text-muted-foreground" />
            Unsaved changes detected.
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-3 font-bold text-foreground hover:bg-muted rounded-[4px] transition-colors">
              Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-[4px] font-extrabold flex items-center justify-center gap-2 transition-all shadow-none hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <UploadCloud size={18} />
              <span>{isEditing ? "Update Product" : "Publish Product"}</span>
            </button>
          </div>
        </div>
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
