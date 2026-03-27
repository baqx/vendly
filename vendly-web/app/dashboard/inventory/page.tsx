"use client";

import { useMemo, useState } from "react";
import { Plus, ChevronDown, LayoutGrid, List, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { buildQuery } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

type Product = {
  id: string;
  title: string;
  basePrice: number;
  stockLevel: number;
  tags?: string | null;
  images?: { id: string; url: string }[];
};



const bgOptions = ["bg-slate-50 dark:bg-slate-900", "bg-[#A29E8D] dark:bg-[#726E5D]", "bg-[#A0C3B5] dark:bg-[#608375]"];

export default function InventoryPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState("All Categories");
  const [price, setPrice] = useState("Any Price");
  const [stock, setStock] = useState("All Status");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const { data: apiProducts } = useSWR<Product[]>(
    `/products${buildQuery({ skip: (currentPage - 1) * PAGE_SIZE, limit: PAGE_SIZE })}`
  );

  const products = (apiProducts || []).map((product, index) => {
    const status =
      product.stockLevel <= 0 ? "Out of Stock" : product.stockLevel < 5 ? "Low Stock" : "In Stock";
    const statusColor =
      product.stockLevel <= 0 ? "bg-red-500" : product.stockLevel < 5 ? "bg-orange-500" : "bg-green-600 dark:bg-green-500";
    const textColor =
      product.stockLevel <= 0 ? "text-red-600 dark:text-red-500" : product.stockLevel < 5 ? "text-orange-600 dark:text-orange-500" : "text-green-700 dark:text-green-500";
    const tags = product.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
    const categoryLabel = tags[0]?.toUpperCase() || "GENERAL";

    return {
      id: product.id,
      title: product.title,
      price: formatCurrency(product.basePrice),
      priceValue: product.basePrice,
      stock: product.stockLevel,
      status,
      statusColor,
      textColor,
      category: categoryLabel,
      img: product.images?.[0]?.url || "",
      bg: bgOptions[index % bgOptions.length],
      padding: "p-4",
    };
  });

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["All Categories", ...Array.from(unique)];
  }, [products]);

  const hasNextPage = (apiProducts?.length ?? 0) === PAGE_SIZE;
  const totalPages = hasNextPage ? currentPage + 1 : currentPage;

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    if (category !== "All Categories" && p.category !== category) return false;
    if (stock === "In Stock" && p.status !== "In Stock") return false;
    if (stock === "Low Stock" && p.status !== "Low Stock") return false;
    if (stock === "Out of Stock" && p.status !== "Out of Stock") return false;
    const priceNum = p.priceValue ?? 0;
    if (price === "Under ₦100,000" && priceNum >= 100000) return false;
    if (price === "Over ₦100,000" && priceNum < 100000) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Inventory Ledger</h1>
          {/* <p className="text-muted-foreground font-medium mt-2">Manage your product catalog and stock levels.</p> */}
        </div>
        <Link href="/dashboard/inventory/add" className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-[4px] font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
          <Plus size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Invisible overlay to close dropdowns on outside click */}
      {openDropdown && (
        <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
      )}

      {/* Filters & View Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 relative z-[35]">
        <div className="flex flex-wrap items-center gap-3">

          {/* CATEGORY FILTER */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              className={`flex items-center gap-3 px-4 py-2 bg-white hover:bg-muted/50 dark:bg-card dark:hover:bg-muted/50 border rounded-[4px] transition-all min-w-[200px] ${openDropdown === "category" ? "border-green-600/50 ring-2 ring-green-600/20" : "border-border/60"}`}
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CATEGORY</span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5 ml-auto">
                {category} <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${openDropdown === "category" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <div className={`absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white dark:bg-card border border-border/60 rounded-[4px] shadow-none overflow-hidden z-50 transition-all origin-top duration-200 ${openDropdown === "category" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
              <div className="py-1.5 flex flex-col">
                {categories.map((item) => (
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
              className={`flex items-center gap-3 px-4 py-2 bg-white hover:bg-muted/50 dark:bg-card dark:hover:bg-muted/50 border rounded-[4px] transition-all min-w-[180px] ${openDropdown === "price" ? "border-green-600/50 ring-2 ring-green-600/20" : "border-border/60"}`}
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PRICE</span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5 ml-auto">
                {price} <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${openDropdown === "price" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <div className={`absolute top-[calc(100%+8px)] left-0 w-full min-w-[180px] bg-white dark:bg-card border border-border/60 rounded-[4px] shadow-none overflow-hidden z-50 transition-all origin-top duration-200 ${openDropdown === "price" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
              <div className="py-1.5 flex flex-col">
                {["Any Price", "Under ₦100,000", "Over ₦100,000"].map((item) => (
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
              className={`flex items-center gap-3 px-4 py-2 bg-white hover:bg-muted/50 dark:bg-card dark:hover:bg-muted/50 border rounded-[4px] transition-all min-w-[180px] ${openDropdown === "stock" ? "border-green-600/50 ring-2 ring-green-600/20" : "border-border/60"}`}
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">STOCK</span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5 ml-auto">
                {stock === "All Status" ? "All" : stock} <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${openDropdown === "stock" ? "rotate-180" : ""}`} />
              </span>
            </button>
            <div className={`absolute top-[calc(100%+8px)] left-0 w-full min-w-[180px] bg-white dark:bg-card border border-border/60 rounded-[4px] shadow-none overflow-hidden z-50 transition-all origin-top duration-200 ${openDropdown === "stock" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
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
        <div className="flex items-center bg-muted/30 p-1 rounded-[4px] border border-border/50">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-[4px] transition-all ${view === "grid" ? "bg-white dark:bg-muted text-green-700 dark:text-green-500 border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-[4px] transition-all ${view === "list" ? "bg-white dark:bg-muted text-green-700 dark:text-green-500 border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Dynamic View */}
      <div className="mt-8 relative">
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[4px]">
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
              <div key={product.id} className="bg-white dark:bg-card rounded-[4px] border border-border/50 shadow-minimal overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:z-20 relative origin-bottom group">
                <div className={`relative w-full h-48 flex items-center justify-center ${product.bg} ${product.padding} overflow-hidden`}>
                  <div className="absolute top-3 left-3 bg-green-200 dark:bg-green-900/60 text-green-900 dark:text-green-300 px-2.5 py-1 rounded-[4px] text-[9px] font-extrabold tracking-wider uppercase z-10">
                    {product.category}
                  </div>
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center mix-blend-multiply dark:mix-blend-normal">
                    <Image src={product.img} fill alt={product.title} className="object-contain" />
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <Link href={`/dashboard/inventory/${product.id}`} className="bg-green-50 text-green-950 font-extrabold text-[13px] py-2.5 px-6 rounded-[4px] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105 active:scale-95 border border-green-200">
                      Inventory Details
                    </Link>
                    {/* Inventory Cleanup
                      - [x] Remove Non-Dynamic Inventory Elements
                      - [x] Remove hardcoded "Featured Top Seller" from `InventoryPage`
                      - [x] Clean up images and static text in `InventoryDetailsPage`
                      - [x] Fix SKU and Category labels to be fully dynamic
                    */}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 relative z-30 bg-white dark:bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-foreground leading-tight">{product.title}</h3>
                    <span className="text-base font-extrabold text-green-700 dark:text-green-500">{product.price}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-[4px] ${product.statusColor}`} />
                    <span className={`text-[11px] font-bold ${product.textColor}`}>
                      {product.status} {product.stock > 0 && <span className="opacity-70">({product.stock} units)</span>}
                    </span>
                  </div>
                  <div className="mt-auto pt-5 flex w-full items-center gap-2">
                    {/* Edit → routes to add/edit form */}
                    <Link href={`/dashboard/inventory/add?id=${product.id}`} className="flex-1 py-2.5 text-center bg-muted/40 hover:bg-muted dark:bg-muted/20 dark:hover:bg-muted/40 text-foreground font-bold text-[13px] rounded-[4px] transition-colors hover:scale-[1.02] active:scale-[0.98]">
                      Edit
                    </Link>
                    <Link href={`/dashboard/inventory/${product.id}`} className="p-2.5 bg-muted/40 hover:bg-muted dark:bg-muted/20 dark:hover:bg-muted/40 text-foreground rounded-[4px] transition-colors flex items-center justify-center hover:scale-110 active:scale-95">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : view === "list" && filteredProducts.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 transform hover:-translate-x-1 hover:z-20 relative group/list">
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className={`relative w-28 h-28 rounded-[4px] shrink-0 overflow-hidden flex items-center justify-center ${product.bg}`}>
                    <Image src={product.img} fill alt={product.title} className="object-cover p-2 mix-blend-multiply dark:mix-blend-normal transform group-hover/list:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/list:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                      <Link href={`/dashboard/inventory/${product.id}`} className="bg-white text-black font-extrabold text-[10px] py-2 px-3 rounded-[4px] transform translate-y-2 group-hover/list:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95 border border-border/20">
                        Details
                      </Link>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.category}</span>
                    <h3 className="text-lg font-bold text-foreground truncate">{product.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-[4px] ${product.statusColor}`} />
                      <span className={`text-xs font-bold ${product.textColor}`}>
                        {product.status} {product.stock > 0 && <span className="opacity-70">({product.stock} units)</span>}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 shrink-0">
                  <span className="text-xl font-extrabold text-green-700 dark:text-green-500">{product.price}</span>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/inventory/add?id=${product.id}`} className="px-5 py-2.5 bg-muted/40 hover:bg-muted text-foreground font-bold text-xs rounded-[4px] transition-colors hover:scale-[1.02] active:scale-[0.98]">
                      Edit
                    </Link>
                    <Link href={`/dashboard/inventory/${product.id}`} className="p-2.5 bg-muted/40 hover:bg-muted text-foreground rounded-[4px] transition-colors hover:scale-110 active:scale-95">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}


          </div>
        ) : null}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
        <p className="text-sm font-medium text-muted-foreground">
          Showing <strong className="font-extrabold text-foreground">{filteredProducts.length}</strong> products — Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-[4px] text-muted-foreground hover:bg-muted font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            return (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-[4px] font-extrabold transition-colors ${
                currentPage === p
                  ? "bg-green-700 text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-[4px] text-muted-foreground hover:bg-muted font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
