"use client";

import { useState } from "react";
import { Search, Filter, Eye, CheckCircle2, Truck, Clock, AlertCircle } from "lucide-react";

export default function OrdersPage() {
  const [activeTab, setActiveTab ] = useState("All");

  const orders = [
    { id: "ORD-7721", customer: "Amaka Okafor", items: 2, total: "₦30,000", status: "Paid", channel: "WhatsApp" },
    { id: "ORD-7722", customer: "Musa Kunle", items: 1, total: "₦15,000", status: "Pending", channel: "Telegram" },
    { id: "ORD-7723", customer: "Sarah Lawson", items: 3, total: "₦55,000", status: "Shipped", channel: "WhatsApp" },
  ];

  const tabs = ["All", "Pending", "Paid", "Shipped", "Cancelled"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
        <p className="text-muted-foreground font-medium mt-1">Track and manage customer orders across all channels.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border p-1 bg-card rounded-xl shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Channel</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-bold text-primary">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground">{order.customer}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{order.items} items</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 font-medium">
                      {order.channel === "WhatsApp" ? <CheckCircle2 size={12} className="text-green-500" /> : <Clock size={12} className="text-blue-400" />}
                      {order.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold">{order.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold">
                      {order.status === "Paid" && <CheckCircle2 className="text-green-500" size={16} />}
                      {order.status === "Pending" && <Clock className="text-orange-500" size={16} />}
                      {order.status === "Shipped" && <Truck className="text-blue-500" size={16} />}
                      {order.status === "Cancelled" && <AlertCircle className="text-red-500" size={16} />}
                      <span className={
                        order.status === "Paid" ? "text-green-700" :
                        order.status === "Pending" ? "text-orange-700" :
                        order.status === "Shipped" ? "text-blue-700" :
                        "text-red-700"
                      }>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg border border-border bg-white hover:bg-muted font-bold text-xs flex items-center gap-1 ml-auto">
                      <Eye size={14} /> Details
                    </button>
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
