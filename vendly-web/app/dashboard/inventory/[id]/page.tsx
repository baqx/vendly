"use client";

import { Trash2, Edit2, TrendingUp, Star, Truck, Clock, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const SIZES = ["250ml", "500ml", "1000ml"];

const THUMBS = [
  { bg: "bg-[#a06830]/80", border: true },
  { bg: "bg-amber-50 dark:bg-amber-900/10", border: false },
  { bg: "bg-green-100 dark:bg-green-900/20", border: false },
];

type Product = {
  id: string;
  title: string;
  description?: string | null;
  basePrice: number;
  mapPrice?: number | null;
  stockLevel: number;
  tags?: string | null;
  technicalSpecs?: Record<string, string> | null;
  images?: { id: string; url: string }[];
  variants?: { id: string; name: string; value: string }[];
};

export default function InventoryDetailsPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("250ml");
  const [activeThumb, setActiveThumb] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [expandedLogistic, setExpandedLogistic] = useState<number | null>(null);
  const [deleted, setDeleted] = useState(false);
  const { data: product } = useSWR<Product>(`/products/${params.id}`);
  const { data: analyticsResp } = useSWR<any>(`/products/${params.id}/analytics`);
  const { data: reviewsResp } = useSWR<any>(`/products/${params.id}/reviews`);
  const { data: logsResp } = useSWR<any>(`/dashboard/activity-logs`);

  const analytics = analyticsResp;
  const reviews = reviewsResp;
  const logs = logsResp || [];

  const handleDelete = async () => {
    try {
      await apiRequest(`/products/${params.id}`, { method: "DELETE" });
      setDeleted(true);
      setShowDeleteModal(false);
    } catch (error) {
      setShowDeleteModal(false);
    }
  };

  if (deleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
          <Trash2 size={36} />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">Product Deleted</h2>
        <p className="text-muted-foreground font-medium">This product has been removed from your inventory.</p>
        <Link href="/dashboard/inventory" className="mt-4 bg-green-700 text-white px-8 py-3 rounded-[4px] font-bold hover:bg-green-800 transition-colors shadow-lg">
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 relative">

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card rounded-[4px] p-8 max-w-md w-full shadow-2xl border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-[4px] bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                <Trash2 size={28} />
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-[4px] transition-colors text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">Delete Product?</h2>
            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{product?.title || "this product"}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-[4px] border border-border font-bold text-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-[4px] bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg active:scale-95">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card rounded-[4px] p-8 max-w-lg w-full shadow-2xl border border-border/50 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-card pb-2 z-10">
              <h2 className="text-2xl font-extrabold text-foreground">Customer Reviews</h2>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-muted rounded-[4px] transition-colors text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5">
              {(reviews?.recentReviews?.length > 0 ? reviews.recentReviews : []).map((review: any, i: number) => (
                <div key={i} className="p-4 bg-muted/30 rounded-[4px] border border-border/40">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-extrabold text-foreground text-sm">{review.name}</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground/70 shrink-0">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
              {(!reviews?.recentReviews || reviews.recentReviews.length === 0) && (
                <div className="text-center p-8 text-sm font-medium text-muted-foreground">
                  No customer reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Link href="/dashboard/inventory" className="hover:text-foreground transition-colors">Products</Link>
          <span>›</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">
            {product?.tags?.split(",")[0] || "Inventory"}
          </span>
          <span>›</span>
          <span className="text-foreground">{product?.title || "Product"}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-muted/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-600 rounded-[4px] font-bold transition-all text-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
          <Link
            href={`/dashboard/inventory/add?id=${params.id}`}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-[4px] font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-700/20 hover:scale-105 active:scale-95 text-sm"
          >
            <Edit2 size={16} />
            <span>Edit Product</span>
          </Link>
        </div>
      </div>

      {/* Top Section: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-[2rem] bg-[#a06830] overflow-hidden flex items-center justify-center shadow-lg">
            <Image
              src={product?.images?.[activeThumb]?.url || ""}
              fill
              alt={product?.title || "Product"}
              className="object-cover mix-blend-normal transition-opacity duration-300"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product?.images?.length ? product.images : []).slice(0, 3).map((t: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={`aspect-square rounded-[1.2rem] ${t.bg || "bg-muted"} relative overflow-hidden flex items-center justify-center p-3 cursor-pointer transition-all ${activeThumb === i ? "border-[3px] border-green-700 shadow-md" : "border border-border/70 hover:opacity-80"}`}
              >
                <Image src={t.url || ""} fill alt={`Thumb ${i + 1}`} className="object-cover mix-blend-multiply dark:mix-blend-normal" />
              </button>
            ))}
            {product?.images && product.images.length > 3 && (
              <button
                onClick={() => setActiveThumb(3)}
                className={`aspect-square rounded-[1.2rem] bg-muted relative overflow-hidden flex items-center justify-center cursor-pointer transition-all ${activeThumb === 3 ? "border-[3px] border-green-700" : "hover:opacity-90"}`}
              >
                <Image src={product.images[3].url} fill alt="More" className="object-cover opacity-60 blur-[3px]" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-extrabold text-xl">
                  +{product.images.length - 3}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col space-y-6 pt-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
              {product?.tags?.split(",")[0]?.toUpperCase() || "GENERAL"}
            </span>
            <span className={`${(product?.stockLevel ?? 0) > 0 ? "bg-green-500" : "bg-red-500"} text-white px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-none`}>
              {(product?.stockLevel ?? 0) > 0 ? "✓ In Stock" : "× Out of Stock"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            {product?.title || "Product Details"}
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-4xl font-extrabold text-green-700 dark:text-green-500">{formatCurrency(product?.basePrice ?? 0)}</span>
            {product?.mapPrice ? (
              <span className="text-xl font-extrabold text-muted-foreground line-through">{formatCurrency(product.mapPrice)}</span>
            ) : null}
            <span className="text-sm font-bold text-muted-foreground">SKU: V-{product?.id?.slice(0, 8).toUpperCase() || "PENDING"}</span>
          </div>

          {/* Size Selector — interactive */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Select Size</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {(product?.variants?.length ? product.variants.map((v) => v.value) : []).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 rounded-[4px] text-sm font-extrabold transition-all active:scale-95 shadow-none ${
                    selectedSize === size
                      ? "border-2 border-green-700 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-400 shadow-green-700/10"
                      : "border border-border bg-white dark:bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Selected: <strong className="text-green-700 dark:text-green-500">{selectedSize}</strong> — {product?.stockLevel ?? 0} units available
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-extrabold text-foreground">Product Description</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {product?.description || "No description provided for this product yet."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 pt-4">
            <div className="space-y-4">
              <h3 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">Specifications</h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-[4px] border border-border/40">
                {product?.technicalSpecs
                  ? Object.entries(product.technicalSpecs).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-muted-foreground">{k}</span>
                        <span className="font-extrabold text-foreground">{v}</span>
                      </div>
                    ))
                  : (
                    <p className="text-sm font-medium text-muted-foreground">No specifications provided.</p>
                  )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">Inventory</h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-[4px] border border-border/40">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-muted-foreground">Quantity</span>
                  <span className="font-extrabold text-foreground">{product?.stockLevel ?? 0} units</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-muted-foreground">Status</span>
                  <span className="font-extrabold text-foreground">
                    {(product?.stockLevel ?? 0) > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Sales Performance Card */}
        <div className="bg-white dark:bg-card rounded-[2rem] p-8 border border-border/50 shadow-none flex flex-col h-full relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10 gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-foreground">Sales Performance</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Last 30 days revenue</p>
            </div>
            <div className="text-right flex flex-col items-end shrink-0">
              <span className="text-2xl font-extrabold text-green-700 dark:text-green-500">{formatCurrency(analytics?.totalRevenue ?? 0)}</span>
              <div className="flex items-center justify-end gap-1 text-[11px] font-bold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 mt-2 px-2 py-1 rounded-[4px]">
                <TrendingUp size={12} />
                <span>{analytics?.revenueGrowth ?? 0}% vs last month</span>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full h-44 flex items-end justify-between gap-3 relative z-10 px-2">
            {(analytics?.salesHistory || []).map((entry: any, i: number) => {
               // Calculate relative height, ensure min 5% for visibility, max 100%
               const maxSales = Math.max(...(analytics.salesHistory.map((s: any) => s.sales) as number[]), 1);
               const height = Math.max((entry.sales / maxSales) * 100, 5);
               return (
                <div key={i} className="w-full relative group/bar flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-green-600/15 dark:bg-green-500/15 hover:bg-green-600/40 dark:hover:bg-green-500/40 rounded-t-[4px] transition-all duration-300 relative cursor-pointer"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[11px] font-bold py-1.5 px-2.5 rounded-[4px] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-10 pointer-events-none">
                      {entry.sales} units
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
          <div className="flex items-center justify-between mt-3 px-2 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest pt-4">
            {(analytics?.salesHistory || []).map((entry: any) => {
              const d = new Date(entry.date);
              return <span key={entry.date}>{d.getDate()}/{d.getMonth()+1}</span>;
            })}
          </div>
        </div>

        {/* Customer Sentiment Card */}
        <div className="bg-white dark:bg-card rounded-[2rem] p-8 border border-border/50 shadow-none flex flex-col h-full relative">
          <button
            onClick={() => setShowReviewModal(true)}
            className="absolute top-8 right-8 w-11 h-11 rounded-full bg-green-700 text-white flex items-center justify-center shadow-lg shadow-green-700/30 hover:bg-green-800 transition-colors z-20 hover:scale-110 active:scale-95"
            title="View all reviews"
          >
            <Plus size={24} />
          </button>

          <h3 className="text-xl font-extrabold text-foreground mb-6">Customer Sentiment</h3>

          <div className="flex items-center gap-6 mb-8 mt-2">
            <span className="text-6xl font-extrabold text-foreground tracking-tighter">{reviews?.averageRating?.toFixed(1) ?? "0.0"}</span>
            <div className="flex flex-col gap-1.5 items-start">
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.round(reviews?.averageRating ?? 0) }).map((_, s) => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}
                {Array.from({ length: 5 - Math.round(reviews?.averageRating ?? 0) }).map((_, s) => <Star key={`empty-${s}`} size={16} className="fill-yellow-400 text-yellow-400 opacity-20" />)}
              </div>
              <span className="text-xs font-bold text-muted-foreground w-32 leading-tight">Based on {reviews?.totalReviews ?? 0} verified sales</span>
            </div>
          </div>

          <div className="space-y-6 flex-1 w-full max-w-sm">
            {Object.entries(reviews?.ratingAttributes || {}).map(([label, score]) => (
              <div key={label} className="flex flex-col gap-2.5">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-foreground">{label}</span>
                  <span className="text-xs font-extrabold text-foreground">{score as number}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-green-700 dark:bg-green-600 rounded-full" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-sm">
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full py-4 rounded-[4px] border-2 border-border/80 font-extrabold text-sm text-foreground hover:bg-muted/50 hover:border-border transition-colors shadow-none active:scale-[0.98]"
            >
              View Detailed Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Logistics */}
      <div className="mt-10">
        <h3 className="text-xl font-extrabold text-foreground mb-5 pl-2">Recent Logistics</h3>
        <div className="bg-white dark:bg-card rounded-[2rem] p-3 border border-border/50 shadow-none">
          {logs.map((item: any, idx: number) => (
            <div key={item.id}>
              <button
                onClick={() => setExpandedLogistic(expandedLogistic === item.id ? null : item.id)}
                className="w-full flex items-center gap-5 p-5 hover:bg-muted/30 transition-colors rounded-[1.5rem] group text-left"
              >
                <div className={`w-14 h-14 rounded-[4px] flex items-center justify-center shrink-0 ${item.type === "ORDER" ? "bg-green-100 text-green-700" : "bg-muted/60 text-muted-foreground"}`}>
                  {item.type === "ORDER" ? <Truck size={24} /> : <Clock size={24} />}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-[15px] font-extrabold text-foreground truncate">{item.title}</h4>
                  <p className="text-[13px] font-medium text-muted-foreground truncate mt-1">{item.summary}</p>
                </div>
                <div className="flex flex-col items-end justify-center shrink-0 pr-2 gap-1">
                  <span className="text-[11px] font-bold text-muted-foreground/70">{new Date(item.createdAt).toLocaleDateString()}</span>
                  {expandedLogistic === item.id
                    ? <ChevronUp size={16} className="text-muted-foreground" />
                    : <ChevronDown size={16} className="text-muted-foreground group-hover:translate-y-0.5 transition-transform" />
                  }
                </div>
              </button>

              {expandedLogistic === item.id && (
                <div className="mx-5 mb-4 p-5 bg-muted/30 rounded-[4px] border border-border/40 text-sm font-medium text-muted-foreground leading-relaxed">
                  {item.detail}
                </div>
              )}

              {item.id === 0 && <div className="h-px bg-border/40 mx-8 my-1" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

