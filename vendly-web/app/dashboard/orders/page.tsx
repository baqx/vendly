"use client";

import { useState } from "react";
import { Download, Plus, Filter, Calendar, ChevronLeft, ChevronRight, ChevronRight as ChevronRightSmall, CheckCircle2, Clock, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const allOrders = [
  { id: "#ORD-8821", customer: "Elena Aris", email: "elena@example.com", avatar: "EA", product: "Organic Coffee Beans", qty: "2× 500g Packs", status: "DELIVERED", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", amount: "$45.00", date: "Oct 24, 2023" },
  { id: "#ORD-8820", customer: "Kofi Osei", email: "kofi.o@provider.gh", avatar: "KO", product: "Premium Shea Butter", qty: "1× 1kg Tub", status: "SHIPPED", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", amount: "$28.50", date: "Oct 24, 2023" },
  { id: "#ORD-8819", customer: "Mariam Ade", email: "m.ade@web.ng", avatar: "MA", product: "Artisan Spice Kit", qty: "3× Starter Sets", status: "PAID", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", amount: "$112.00", date: "Oct 23, 2023" },
  { id: "#ORD-8818", customer: "Chidi L.", email: "chidi@corp.com", avatar: "CL", product: "Woven Storage Baskets", qty: "4× Medium", status: "PENDING", statusColor: "bg-green-50 text-green-700 dark:bg-muted dark:text-muted-foreground border border-green-200 dark:border-border", amount: "$210.00", date: "Oct 23, 2023" },
  { id: "#ORD-8817", customer: "Jane Doe", email: "jane.doe@mail.com", avatar: "JD", product: "Handcrafted Soap Bar", qty: "10× Bulk Order", status: "DELIVERED", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", amount: "$60.00", date: "Oct 22, 2023" },
  { id: "#ORD-8816", customer: "Sarah T.", email: "sarah@web.com", avatar: "ST", product: "Vanilla Extract", qty: "2× Bottles", status: "PENDING", statusColor: "bg-green-50 text-green-700 dark:bg-muted dark:text-muted-foreground border border-green-200 dark:border-border", amount: "$35.00", date: "Oct 21, 2023" },
  { id: "#ORD-8815", customer: "Mark Z.", email: "markz@mail.com", avatar: "MZ", product: "Cocoa Powder", qty: "5× 1kg Bags", status: "PAID", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", amount: "$85.00", date: "Oct 20, 2023" },
];

const tabs = ["All Orders", "Pending", "Paid", "Shipped", "Delivered"];

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab ] = useState("All Orders");
  const [activeOrder, setActiveOrder] = useState(allOrders[0]); // For bottom preview
  
  // Interactive States
  const [currentPage, setCurrentPage] = useState(1);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("Oct 01 - Oct 31, 2023");
  
  const ITEMS_PER_PAGE = 5;
  
  // Filter Data
  const filteredOrders = allOrders.filter(o => {
    // Tab Filter
    const matchesTab = activeTab === "All Orders" ? true : o.status === activeTab.toUpperCase();
    
    // Date Filter (Simulated logic to actually change the list)
    let matchesDate = true;
    if (selectedDateFilter === "Today") {
      matchesDate = o.date === "Oct 24, 2023"; // Simulating "Today"
    } else if (selectedDateFilter === "Yesterday") {
      matchesDate = o.date === "Oct 23, 2023";
    } else if (selectedDateFilter === "Last 7 Days") {
      matchesDate = ["Oct 24, 2023", "Oct 23, 2023", "Oct 22, 2023", "Oct 21, 2023", "Oct 20, 2023"].includes(o.date);
    }
    
    return matchesTab && matchesDate;
  });
  
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExport = () => {
    alert("Preparing CSV export... Your download will begin shortly.");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Order Management</h1>
          <p className="text-muted-foreground font-medium mt-2">Track and fulfill your customer requests across the ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-5 py-3 rounded-[4px] bg-muted/50 hover:bg-muted text-foreground font-bold transition-all text-sm border border-border/50 active:scale-95">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <Link href="/dashboard/orders/add" className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-[4px] font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 text-sm">
            <Plus size={18} />
            <span>New Manual Order</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">TOTAL ORDERS</p>
          <h3 className="text-4xl font-extrabold mt-2 text-foreground">1,284</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 dark:text-green-400 mt-auto pt-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-45"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            <span>+12.5% this month</span>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">PENDING FULFILLMENT</p>
          <h3 className="text-4xl font-extrabold mt-2 text-foreground">42</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mt-auto pt-4">
            <span>Requires Action</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">AVERAGE ORDER VALUE</p>
          <h3 className="text-4xl font-extrabold mt-2 text-foreground">$158.20</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 dark:text-green-400 mt-auto pt-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-45"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            <span>+$4.10 growth</span>
          </div>
        </div>

        {/* Successful Delivery */}
        <div className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">SUCCESSFUL DELIVERY</p>
          <h3 className="text-4xl font-extrabold mt-2 text-foreground">98.2%</h3>
          <div className="mt-auto pt-5">
            <div className="h-1.5 w-full bg-muted rounded-[4px] overflow-hidden">
              <div className="h-full bg-green-700 dark:bg-green-500 w-[98.2%] rounded-[4px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Orders Table Area */}
      <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 shadow-minimal overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 lg:px-8 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border/50 bg-muted/10">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-[4px] w-fit overflow-x-auto no-scrollbar border border-border/40">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-5 py-2.5 rounded-[8px] text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-white dark:bg-card text-green-700 dark:text-green-400 shadow-none" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Date Picker & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsDateOpen(!isDateOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card border border-border/60 hover:bg-muted rounded-[8px] text-xs font-bold text-foreground transition-colors shadow-none"
              >
                <Calendar size={14} className="text-muted-foreground" />
                <span>{selectedDateFilter}</span>
              </button>
              {isDateOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card border border-border/50 rounded-[8px] shadow-xl z-10 overflow-hidden">
                  {["Today", "Yesterday", "Last 7 Days", "Oct 01 - Oct 31, 2023", "Custom Range..."].map((d) => (
                    <button key={d} onClick={() => { setSelectedDateFilter(d); setIsDateOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors">
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center justify-center w-10 h-10 hover:bg-muted border border-border/40 hover:border-border/60 rounded-[8px] text-foreground transition-colors ${isFilterOpen ? "bg-muted" : "bg-muted/40"}`}
              >
                <Filter size={16} className="text-muted-foreground" />
              </button>
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-card border border-border/50 rounded-[8px] shadow-xl z-10 p-4">
                  <p className="text-xs font-extrabold text-foreground mb-3">Filter by</p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border/50 text-green-600 focus:ring-green-500" />
                      <span className="text-xs font-bold text-muted-foreground">High Value Orders</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border/50 text-green-600 focus:ring-green-500" />
                      <span className="text-xs font-bold text-muted-foreground">International Shipping</span>
                    </label>
                  </div>
                  <button onClick={() => setIsFilterOpen(false)} className="w-full mt-4 bg-muted/50 hover:bg-muted text-xs font-extrabold py-2 rounded-lg transition-colors">
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/5">
                <th className="py-5 px-6 lg:px-8 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Order ID</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Customer</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Product & Qty</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Amount</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="py-5 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => router.push(`/dashboard/orders/${order.id.replace('#', '')}`)}
                  onMouseEnter={() => setActiveOrder(order)} // Updates the preview lightly on hover if needed, or we can just leave it as router push
                  className={`hover:bg-muted/20 transition-colors cursor-pointer group ${activeOrder.id === order.id ? "bg-muted/10" : ""}`}
                >
                  <td className="py-5 px-6 lg:px-8 text-sm font-extrabold text-foreground">{order.id}</td>
                  
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[8px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center font-extrabold text-[12px] shrink-0">
                        {order.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-foreground">{order.customer}</span>
                        <span className="text-[11px] font-bold text-muted-foreground mt-0.5">{order.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-foreground">{order.product}</span>
                      <span className="text-[11px] font-bold text-muted-foreground mt-0.5">{order.qty}</span>
                    </div>
                  </td>

                  <td className="py-5 px-6">
                    <span className={`text-[9px] font-extrabold px-3 py-1.5 rounded-[8px] uppercase tracking-wider ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="py-5 px-6 text-sm font-extrabold text-foreground">{order.amount}</td>
                  
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{order.date}</span>
                    </div>
                  </td>

                  <td className="py-5 px-4 text-right">
                    <button 
                      onClick={() => router.push(`/dashboard/orders/${order.id.replace('#', '')}`)}
                      className="p-2 mr-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 inline-flex items-center justify-center"
                    >
                      <ChevronRightSmall size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={7} className="py-12 text-center">
                     <div className="flex flex-col items-center justify-center">
                       <Filter size={32} className="text-muted-foreground/30 mb-3" />
                       <p className="text-sm font-bold text-foreground">No orders found</p>
                       <p className="text-xs font-medium text-muted-foreground mt-1">Try adjusting your filters or tabs.</p>
                     </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 sm:p-6 lg:px-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5">
          <p className="text-xs font-bold text-muted-foreground">
            Showing <strong className="text-foreground">{filteredOrders.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}</strong> of <strong className="text-foreground">{filteredOrders.length}</strong> orders
          </p>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-extrabold transition-all ${
                  currentPage === i + 1 
                    ? "bg-green-700 text-white shadow-sm shadow-green-700/30" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Preview (Bottom Section) */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-5 px-2">
          <h2 className="text-xl font-extrabold text-foreground">Order Details Preview</h2>
          <button 
            onClick={() => router.push(`/dashboard/orders/${activeOrder.id.replace('#', '')}`)}
            className="text-[10px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest hover:underline px-2 py-1 flex items-center gap-1 group"
          >
            EXPAND FULL RECORD
            <ChevronRightSmall size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Logistics Status */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8 flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-[8px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">Logistics Status</h3>
                <p className="text-xs font-bold text-muted-foreground mt-0.5">Tracker ID: #LX-200938</p>
              </div>
            </div>

            <div className="relative pl-3 flex-1">
              <div className="absolute top-1 bottom-6 left-5 border-l-2 border-dashed border-border/60" />
              
              <div className="relative flex gap-4 mb-6">
                <div className="w-4 h-4 rounded-[8px] bg-green-600 dark:bg-green-500 shrink-0 z-10 flex items-center justify-center mt-0.5 ring-4 ring-white dark:ring-card">
                  <CheckCircle2 size={10} className="text-white relative top-[0.5px]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-foreground">Delivered to Recipient</h4>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1">TODAY, 2:14 PM</p>
                </div>
              </div>

              <div className="relative flex gap-4 mb-6">
                <div className="w-4 h-4 rounded-[8px] bg-green-600 dark:bg-green-500 shrink-0 z-10 flex items-center justify-center mt-0.5 ring-4 ring-white dark:ring-card">
                  <CheckCircle2 size={10} className="text-white relative top-[0.5px]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-foreground">Out for Delivery</h4>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1">OCT 24, 09:30 AM</p>
                </div>
              </div>

              <div className="relative flex gap-4 opacity-50">
                <div className="w-4 h-4 rounded-[8px] bg-muted-foreground/30 shrink-0 z-10 mt-0.5 ring-4 ring-white dark:ring-card" />
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground">Arrived at Distribution Hub</h4>
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1">OCT 23, 11:15 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8 flex flex-col h-full hover:shadow-md transition-all">
            <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-6">CUSTOMER DETAILS</h3>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/40">
              <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-500 flex items-center justify-center font-extrabold text-xl shrink-0">
                {activeOrder.avatar}
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-foreground">{activeOrder.customer}</h4>
                <p className="text-xs font-bold text-muted-foreground mt-1">Premium Customer since 2021</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm font-bold text-foreground">{activeOrder.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm font-bold text-foreground">+233 24 555 0192</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8 flex flex-col h-full hover:shadow-md transition-all">
            <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-6">DELIVERY ADDRESS</h3>
            
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 mb-6 flex-1">
              <p className="text-[15px] font-extrabold text-foreground leading-relaxed">
                42 Innovation Dr. <br />
                Floor 4, Suite 102 <br />
                Osu, Accra, Ghana
              </p>
            </div>

            <button 
              onClick={() => alert("Opening Map Application...")}
              className="flex items-center gap-2 text-[11px] font-black text-green-700 dark:text-green-500 uppercase tracking-widest hover:underline px-1 w-fit"
            >
              <MapPin size={14} className="mb-0.5 relative top-[-1px]" />
              View on Map
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
