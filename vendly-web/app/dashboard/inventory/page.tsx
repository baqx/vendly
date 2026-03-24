"use client";

import { useState } from "react";
import { Plus, ChevronDown, LayoutGrid, List, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const products = [
  { 
    id: 1, 
    title: "Nordic Minimalist Watch", 
    price: "$124.00", 
    stock: 42, 
    status: "In Stock",
    statusColor: "bg-green-600 dark:bg-green-500",
    textColor: "text-green-700 dark:text-green-500", 
    category: "ELECTRONICS", 
    img: "/images/watch.png",
    bg: "bg-slate-50 dark:bg-slate-900",
    padding: "p-6"
  },
  { 
    id: 2, 
    title: "Crimson Aero Runners", 
    price: "$89.50", 
    stock: 3, 
    status: "Low Stock",
    statusColor: "bg-orange-500", 
    textColor: "text-orange-600 dark:text-orange-500",
    category: "FASHION", 
    img: "/images/shoes.png",
    bg: "bg-slate-50 dark:bg-slate-900",
    padding: "p-4"
  },
  { 
    id: 3, 
    title: "Sonic Pods G2", 
    price: "$55.00", 
    stock: 0, 
    status: "Out of Stock",
    statusColor: "bg-red-500", 
    textColor: "text-red-600 dark:text-red-500",
    category: "ELECTRONICS", 
    img: "/images/earbuds.png",
    bg: "bg-[#A29E8D] dark:bg-[#726E5D]",
    padding: "p-3"
  },
  { 
    id: 4, 
    title: "Vintage Shot Z-10", 
    price: "$410.00", 
    stock: 12, 
    status: "In Stock",
    statusColor: "bg-green-600 dark:bg-green-500", 
    textColor: "text-green-700 dark:text-green-500",
    category: "ELECTRONICS", 
    img: "/images/camera.png",
    bg: "bg-[#A0C3B5] dark:bg-[#608375]",
    padding: "p-3"
  },
];

export default function InventoryPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState("All Categories");
  const [price, setPrice] = useState("Any Price");
  const [stock, setStock] = useState("All Status");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const TOTAL_PAGES = 3;

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    if (category !== "All Categories" && p.category !== category) return false;
    if (stock === "In Stock" && p.status !== "In Stock") return false;
    if (stock === "Low Stock" && p.status !== "Low Stock") return false;
    if (stock === "Out of Stock" && p.status !== "Out of Stock") return false;
    const priceNum = parseFloat(p.price.replace("$", ""));
    if (price === "Under $100" && priceNum >= 100) return false;
    if (price === "Over $100" && priceNum < 100) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Inventory Ledger</h1>
          <p className="text-muted-foreground font-medium mt-2">Manage your product catalog and stock levels.</p>
        </div>
        <Link href="/dashboard/inventory/add" className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-[8px] font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
          <Plus size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Invisible overlay to close dropdowns on outside click */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
      )}

      {/* Filters & View Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 relative z-50">
        <div className="flex flex-wrap items-center gap-3">

          {/* CATEGORY FILTER */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              className={`flex items-center gap-3 px-4 py-2 bg-white hover:bg-muted/50 dark:bg-card dark:hover:bg-muted/50 border rounded-[8px] transition-all min-w-[200px] ${openDropdown === "category" ? "border-green-600/50 ring-2 ring-green-600/20" : "border-border/60"}`}
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CATEGORY</span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5 ml-auto">
                {category} <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${openDropdown === "category" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <div className={`absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white dark:bg-card border border-border/60 rounded-[8px] shadow-none overflow-hidden z-50 transition-all origin-top duration-200 ${openDropdown === "category" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
              <div className="py-1.5 flex flex-col">
                {["All Categories", "ELECTRONICS", "FASHION"].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setCategory(item); setOpenDropdown(null); }}
                    className={`px-4 py-3 text-left text-sm font-bold transition-colors ${category === item ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-500" : "text-foreground hover:bg-muted/50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PRICE FILTER */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
              className={`flex items-center gap-3 px-4 py-2 bg-white hover:bg-muted/50 dark:bg-card dark:hover:bg-muted/50 border rounded-[8px] transition-all min-w-[180px] ${openDropdown === "price" ? "border-green-600/50 ring-2 ring-green-600/20" : "border-border/60"}`}
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PRICE</span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5 ml-auto">
                {price} <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${openDropdown === "price" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <div className={`absolute top-[calc(100%+8px)] left-0 w-full min-w-[180px] bg-white dark:bg-card border border-border/60 rounded-[8px] shadow-none overflow-hidden z-50 transition-all origin-top duration-200 ${openDropdown === "price" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
              <div className="py-1.5 flex flex-col">
                {["Any Price", "Under $100", "Over $100"].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setPrice(item); setOpenDropdown(null); }}
                    className={`px-4 py-3 text-left text-sm font-bold transition-colors ${price === item ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-500" : "text-foreground hover:bg-muted/50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STOCK FILTER */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "stock" ? null : "stock")}
              className={`flex items-center gap-3 px-4 py-2 bg-white hover:bg-muted/50 dark:bg-card dark:hover:bg-muted/50 border rounded-[8px] transition-all min-w-[180px] ${openDropdown === "stock" ? "border-green-600/50 ring-2 ring-green-600/20" : "border-border/60"}`}
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">STOCK</span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5 ml-auto">
                {stock === "All Status" ? "All" : stock} <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${openDropdown === "stock" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <div className={`absolute top-[calc(100%+8px)] left-0 w-full min-w-[180px] bg-white dark:bg-card border border-border/60 rounded-[8px] shadow-none overflow-hidden z-50 transition-all origin-top duration-200 ${openDropdown === "stock" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
              <div className="py-1.5 flex flex-col">
                {["All Status", "In Stock", "Low Stock", "Out of Stock"].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setStock(item); setOpenDropdown(null); }}
                    className={`px-4 py-3 text-left text-sm font-bold transition-colors ${stock === item ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-500" : "text-foreground hover:bg-muted/50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-muted/30 p-1 rounded-[8px] border border-border/50">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-[8px] transition-all ${view === "grid" ? "bg-white dark:bg-muted text-green-700 dark:text-green-500 border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-[8px] transition-all ${view === "list" ? "bg-white dark:bg-muted text-green-700 dark:text-green-500 border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Dynamic View */}
      <div className="mt-8 relative">
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[8px]">
            <p className="text-muted-foreground font-bold">No products match the selected filters.</p>
            <button
              onClick={() => { setCategory("All Categories"); setPrice("Any Price"); setStock("All Status"); }}
              className="mt-4 text-green-700 dark:text-green-500 font-extrabold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {view === "grid" && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-card rounded-[8px] border border-border/50 shadow-minimal overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:z-20 relative origin-bottom group">
                <div className={`relative w-full h-48 flex items-center justify-center ${product.bg} ${product.padding} overflow-hidden`}>
                  <div className="absolute top-3 left-3 bg-green-200 dark:bg-green-900/60 text-green-900 dark:text-green-300 px-2.5 py-1 rounded-[8px] text-[9px] font-extrabold tracking-wider uppercase z-10">
                    {product.category}
                  </div>
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center mix-blend-multiply dark:mix-blend-normal">
                    <Image src={product.img} fill alt={product.title} className="object-contain" />
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <Link href={`/dashboard/inventory/${product.id}`} className="bg-green-50 text-green-950 font-extrabold text-[13px] py-2.5 px-6 rounded-[8px] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105 active:scale-95 border border-green-200">
                      Inventory Details
                    </Link>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 relative z-30 bg-white dark:bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-foreground leading-tight">{product.title}</h3>
                    <span className="text-base font-extrabold text-green-700 dark:text-green-500">{product.price}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-[8px] ${product.statusColor}`} />
                    <span className={`text-[11px] font-bold ${product.textColor}`}>
                      {product.status} {product.stock > 0 && <span className="opacity-70">({product.stock} units)</span>}
                    </span>
                  </div>
                  <div className="mt-auto pt-5 flex w-full items-center gap-2">
                    {/* Edit → routes to add/edit form */}
                    <Link href={`/dashboard/inventory/add`} className="flex-1 py-2.5 text-center bg-muted/40 hover:bg-muted dark:bg-muted/20 dark:hover:bg-muted/40 text-foreground font-bold text-[13px] rounded-[8px] transition-colors hover:scale-[1.02] active:scale-[0.98]">
                      Edit
                    </Link>
                    <Link href={`/dashboard/inventory/${product.id}`} className="p-2.5 bg-muted/40 hover:bg-muted dark:bg-muted/20 dark:hover:bg-muted/40 text-foreground rounded-[8px] transition-colors flex items-center justify-center hover:scale-110 active:scale-95">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Featured Top Seller */}
            <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-green-800 dark:bg-[#0f4a26] rounded-[8px] overflow-hidden flex flex-col relative transition-all duration-300 transform hover:-translate-y-1 hover:z-20 origin-bottom group/feature border border-green-700">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-green-500/30 blur-[80px] rounded-[8px] pointer-events-none" />
              <div className="relative w-full h-64 lg:h-80 flex items-center justify-center p-4 z-10 overflow-hidden">
                <div className="absolute top-6 left-6 bg-green-300 text-green-950 px-3 py-1 rounded-[8px] text-[10px] font-extrabold tracking-wider uppercase z-20">
                  TOP SELLER
                </div>
                <div className="w-full h-full relative group-hover/feature:scale-110 transition-transform duration-700">
                  <Image src="/images/headphones.png" fill alt="Elite Headphones" className="object-contain mix-blend-normal drop-shadow-2xl" />
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/feature:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Link href={`/dashboard/inventory/elite-pro`} className="bg-white text-green-950 font-extrabold text-[14px] py-3.5 px-8 rounded-[8px] transform translate-y-4 group-hover/feature:translate-y-0 transition-all duration-500 hover:scale-105 active:scale-95">
                    View Inventory Details
                  </Link>
                </div>
              </div>
              <div className="p-8 pt-0 flex flex-col flex-1 justify-end z-10 relative bg-gradient-to-t from-green-900 via-green-800/80 to-transparent">
                <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-3">Elite Sound-Cancel Pro</h2>
                <p className="text-green-100/80 font-medium text-sm leading-relaxed mb-6">
                  Our highest performing audio product this month with 240+ sales.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                  <span className="text-4xl font-extrabold text-white">$299.00</span>
                  <Link href={`/dashboard/inventory/elite-pro`} className="bg-white text-green-900 px-6 py-3 rounded-[8px] font-bold text-sm hover:bg-green-50 transition-colors hover:scale-105 active:scale-95">
                    Inventory Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

        ) : view === "list" && filteredProducts.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-card rounded-[8px] border border-border/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 transform hover:-translate-x-1 hover:z-20 relative group/list">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className={`relative w-28 h-28 rounded-[8px] shrink-0 overflow-hidden flex items-center justify-center ${product.bg}`}>
                    <Image src={product.img} fill alt={product.title} className="object-cover p-2 mix-blend-multiply dark:mix-blend-normal transform group-hover/list:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/list:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                      <Link href={`/dashboard/inventory/${product.id}`} className="bg-white text-black font-extrabold text-[10px] py-2 px-3 rounded-[8px] transform translate-y-2 group-hover/list:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95 border border-border/20">
                        Details
                      </Link>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.category}</span>
                    <h3 className="text-lg font-bold text-foreground truncate">{product.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-[8px] ${product.statusColor}`} />
                      <span className={`text-xs font-bold ${product.textColor}`}>
                        {product.status} {product.stock > 0 && <span className="opacity-70">({product.stock} units)</span>}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 shrink-0">
                  <span className="text-xl font-extrabold text-green-700 dark:text-green-500">{product.price}</span>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/inventory/add`} className="px-5 py-2.5 bg-muted/40 hover:bg-muted text-foreground font-bold text-xs rounded-[8px] transition-colors hover:scale-[1.02] active:scale-[0.98]">
                      Edit
                    </Link>
                    <Link href={`/dashboard/inventory/${product.id}`} className="p-2.5 bg-muted/40 hover:bg-muted text-foreground rounded-[8px] transition-colors hover:scale-110 active:scale-95">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Elite Sound-Cancel Pro — List Item */}
            <div className="bg-green-800 dark:bg-[#0f4a26] rounded-[8px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 transform hover:-translate-x-1 hover:z-20 relative group/list border border-green-700">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="relative w-28 h-28 rounded-[8px] shrink-0 overflow-hidden flex items-center justify-center bg-white/10 p-2">
                  <Image src="/images/headphones.png" fill alt="Headphones" className="object-contain transform group-hover/list:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/list:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <Link href={`/dashboard/inventory/elite-pro`} className="bg-white text-green-950 font-extrabold text-[10px] py-2 px-3 rounded-[8px] transform translate-y-2 group-hover/list:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95">
                      Details
                    </Link>
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-green-200 uppercase tracking-widest bg-green-900/50 px-2 py-0.5 rounded-[8px]">TOP SELLER</span>
                  <h3 className="text-lg font-bold text-white truncate mt-2">Elite Sound-Cancel Pro</h3>
                  <div className="mt-1">
                    <span className="text-xs font-medium text-green-100/80">Highest performing item - 240+ sales</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 shrink-0">
                <span className="text-xl font-extrabold text-white">$299.00</span>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/inventory/elite-pro`} className="flex items-center justify-center px-5 py-2.5 bg-white text-green-900 font-bold text-xs rounded-[8px] transition-colors hover:scale-[1.02] active:scale-[0.98]">
                    Inventory Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
        <p className="text-sm font-medium text-muted-foreground">
          Showing <strong className="font-extrabold text-foreground">{filteredProducts.length + 1}</strong> of <strong className="font-extrabold text-foreground">148</strong> products &mdash; Page {currentPage} of {TOTAL_PAGES}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-muted-foreground hover:bg-muted font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {"<"}
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-[8px] font-extrabold transition-colors ${
                currentPage === p
                  ? "bg-green-700 text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={currentPage === TOTAL_PAGES}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-muted-foreground hover:bg-muted font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
