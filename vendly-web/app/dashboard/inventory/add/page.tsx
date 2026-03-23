"use client";

import { useState } from "react";
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Type, DollarSign, Box } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const [variants, setVariants] = useState([{ name: "", value: "" }]);

  const addVariant = () => setVariants([...variants, { name: "", value: "" }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory" className="p-2 rounded-lg border border-border bg-white hover:bg-muted transition-all">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">New Product</h1>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-secondary transition-all shadow-md">
          <Save size={20} />
          <span>Save Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b border-border pb-2">General Information</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Oversized Cotton Tee" 
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Description</label>
                <textarea 
                  rows={4} 
                  placeholder="Describe your product for the AI to understand..." 
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-bold text-lg">Variants</h3>
              <button 
                onClick={addVariant}
                className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
            
            <div className="space-y-3">
              {variants.map((variant, i) => (
                <div key={i} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Option Name</label>
                    <input 
                      type="text" 
                      placeholder="Color" 
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Value</label>
                    <input 
                      type="text" 
                      placeholder="Blue" 
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => removeVariant(i)}
                    className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b border-border pb-2">Images</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-all bg-muted/20">
                <Plus size={24} />
                <span className="text-[10px] font-bold mt-1">Upload</span>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b border-border pb-2">Pricing & Stock</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Base Price (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₦</span>
                  <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-2 rounded-lg border border-border outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Stock Level</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
