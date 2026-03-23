"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Package, ExternalLink } from "lucide-react";

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { id: 1, title: "Vintage Oversized Tee", price: "₦15,000", stock: 45, variants: 3, status: "Active" },
    { id: 2, title: "Cargo Pocket Joggers", price: "₦22,500", stock: 12, variants: 2, status: "Low Stock" },
    { id: 3, title: "Distressed Denim Jacket", price: "₦35,000", stock: 0, variants: 1, status: "Out of Stock" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your products and stock levels.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-md">
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 border border-border rounded-lg bg-card font-bold flex items-center gap-2 hover:bg-muted transition-all">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Variants</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground">
                        <Package size={20} />
                      </div>
                      <span className="font-bold text-sm text-foreground">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      product.status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
                      product.status === "Low Stock" ? "bg-orange-50 text-orange-700 border-orange-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-sm">{product.price}</td>
                  <td className="px-6 py-4 font-bold text-sm text-muted-foreground">{product.stock}</td>
                  <td className="px-6 py-4 font-bold text-sm text-muted-foreground">{product.variants}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md hover:bg-muted hover:text-primary transition-colors">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
