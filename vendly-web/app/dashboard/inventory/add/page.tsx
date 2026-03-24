"use client";

import { useState } from "react";
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Type, DollarSign, Box, FileText, UploadCloud, Banknote, Truck, Info, Bold, Italic, List as ListIcon, Link as LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const [taxEnabled, setTaxEnabled] = useState(true);

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
            <span className="text-green-700 dark:text-green-500">Add New</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Add New Product</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-card rounded-3xl p-8 border border-border/50 shadow-sm space-y-6">
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
                    className="w-full px-5 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-medium text-foreground transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">Category</label>
                    <select 
                      className="w-full px-5 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-medium text-foreground transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_1rem_center] bg-no-repeat"
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
                      className="w-full px-5 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-medium text-foreground transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground block">Description</label>
                  <div className="w-full rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600/30 transition-all">
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
                      className="w-full px-5 py-4 bg-transparent outline-none font-medium text-sm text-foreground resize-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Media Card */}
            <div className="bg-white dark:bg-card rounded-3xl p-8 border border-border/50 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="text-green-700 dark:text-green-500" size={24} />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Product Media</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Dropzone */}
                <div className="relative h-64 border-2 border-dashed border-green-300 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors group">
                  <div className="w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-500 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">Main Image</h3>
                  <p className="text-xs font-medium text-muted-foreground mt-1">Drag and drop or click to upload</p>
                </div>

                {/* Sub grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-[#F4F6F9] dark:bg-muted/30 border border-border/40 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                       <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-muted/50 flex items-center justify-center text-muted-foreground/60">
                         <Plus size={16} />
                       </div>
                    </div>
                  ))}
                  {[3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-[#F4F6F9] dark:bg-muted/30 border border-border/40 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
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
            <div className="bg-white dark:bg-card rounded-3xl p-8 border border-border/50 shadow-sm space-y-6">
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
                      className="w-full pl-8 pr-5 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
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
                      className="w-full pl-8 pr-5 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F4F6F9] dark:bg-muted/30 rounded-xl">
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
            <div className="bg-white dark:bg-card rounded-3xl p-8 border border-border/50 shadow-sm space-y-6">
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
                      className="w-full px-4 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Stock</label>
                    <input 
                      type="text" 
                      placeholder="100" 
                      className="w-full px-4 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Shipping Weight (kg)</label>
                  <input 
                    type="text" 
                    placeholder="0.5" 
                    className="w-full px-4 py-3 rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 outline-none font-bold text-foreground transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" placeholder="L" className="w-full px-4 py-3 text-center rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 outline-none font-bold text-foreground transition-all" />
                    <input type="text" placeholder="W" className="w-full px-4 py-3 text-center rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 outline-none font-bold text-foreground transition-all" />
                    <input type="text" placeholder="H" className="w-full px-4 py-3 text-center rounded-xl border border-border/40 bg-[#F4F6F9] dark:bg-muted/40 focus:ring-2 focus:ring-green-600/20 outline-none font-bold text-foreground transition-all" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-8">
        <div className="bg-white dark:bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
            <AlertCircle size={16} className="text-muted-foreground" />
            Unsaved changes detected.
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-3 font-bold text-foreground hover:bg-muted rounded-xl transition-colors">
              Discard
            </button>
            <button className="flex-1 sm:flex-none bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] active:scale-95">
              <UploadCloud size={18} />
              <span>Publish Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
