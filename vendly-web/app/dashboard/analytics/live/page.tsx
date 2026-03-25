"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  ShoppingCart,
  CheckCircle,
  User,
  Eye,
  AlertTriangle,
  Info,
  ChevronRight,
  History,
  TrendingUp,
  AlignJustify,
  Banknote,
  Clock,
  Plus,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import InteractiveMap from "./components/interactive-map";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const RECENT_FEED = [
  {
    id: 1,
    type: "cart",
    user: "Sarah O.",
    action: "added",
    item: "Organic Shea Butter",
    location: "Lagos, Nigeria",
    time: "2 mins ago",
    icon: ShoppingCart,
    border: "border-l-[4px] border-l-green-600",
    bgIcon: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
  {
    id: 2,
    type: "order",
    orderId: "#12844",
    user: "Musa K.",
    action: "successfully placed by",
    amount: "₦12,400.00",
    location: "Abuja, Nigeria",
    time: "5 mins ago",
    icon: CheckCircle,
    border: "border-l-[4px] border-l-green-800 dark:border-l-green-500",
    bgIcon: "bg-green-800 text-white dark:bg-green-700",
    badge: true,
  },
  {
    id: 3,
    type: "session",
    action: "New customer session started from",
    location: "Ibadan",
    time: "8 mins ago",
    icon: User,
    border: "border-l-[4px] border-l-slate-200 dark:border-l-slate-700",
    bgIcon: "bg-slate-100 text-muted-foreground dark:bg-slate-800 dark:text-muted-foreground",
  },
  {
    id: 4,
    type: "trending",
    item: "Handwoven Basket",
    action: "is trending",
    views: "(12 views in 5 min).",
    time: "12 mins ago",
    icon: Eye,
    border: "border-l-[4px] border-l-slate-200 dark:border-l-slate-700",
    bgIcon: "bg-slate-100 text-muted-foreground dark:bg-slate-800 dark:text-muted-foreground",
  },
];

const PULSE_DATA = Array.from({ length: 24 }, (_, i) => ({
  sales: Math.floor(Math.random() * 40) + 20,
  views: Math.floor(Math.random() * 50) + 30,
  highlight: i === 12,
}));

// ─── Components ──────────────────────────────────────────────────────────────

function LiveRevenueCard({ className }: { className?: string }) {
  return (
    <div className={`bg-card rounded-2xl p-8 relative overflow-hidden shadow-sm border border-border/40 ${className}`}>
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <TrendingUp size={16} />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Revenue (Today)</p>
        </div>
        
        <div className="flex items-center gap-3 mt-2">
          <AlignJustify size={48} className="text-foreground dark:text-muted-foreground" strokeWidth={3} />
          <div className="flex items-baseline">
            <span className="text-6xl font-black text-foreground tracking-tighter">
              482,900
            </span>
            <span className="text-3xl font-black text-green-700 dark:text-green-500 ml-1">.50</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-8">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-xs font-black tracking-wide">
            <ArrowUpRight size={14} strokeWidth={3} />
            12.5% vs Yesterday
          </div>
          <p className="text-xs text-muted-foreground dark:text-muted-foregroundfont-semibold flex items-center gap-1.5">
            <Clock size={14} />
            Last update 2s ago
          </p>
        </div>
      </div>

      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-green-50 dark:text-green-900/20 pointer-events-none">
        <Banknote size={100} strokeWidth={1.5} className="opacity-70 drop-shadow-sm" />
      </div>
    </div>
  );
}

function LiveNowCard({ className }: { className?: string }) {
  return (
    <div className={`bg-[#0f5a34] dark:bg-[#0a4528] rounded-2xl p-8 text-white relative shadow-md ${className}`}>
      <div className="flex flex-col h-full relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-green-200 mb-2">Live Now</p>
        <div className="flex items-baseline gap-2 mb-8 mt-2">
          <span className="text-6xl font-black tracking-tighter leading-none">1,284</span>
          <span className="text-base font-semibold text-green-200">Active</span>
        </div>

        <div className="space-y-6 mt-auto pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-green-100">
              <span>Browsing Store</span>
              <span className="text-white">842</span>
            </div>
            <div className="h-[4px] bg-green-900/60 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[65%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-green-100">
              <span>At Checkout</span>
              <span className="text-white">442</span>
            </div>
            <div className="h-[4px] bg-green-900/60 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 w-[35%] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapCard({ className }: { className?: string }) {
  const [view, setView] = useState<string>("lagos");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const regions = ["lagos", "abuja", "kano", "port harcourt"];

  return (
    <div className={`bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col min-h-[400px] ${className}`}>
      <div className="p-6 flex items-center justify-between border-b border-border bg-card z-20 relative">
        <h3 className="text-sm font-bold text-foreground">Active Sessions by Region</h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 relative border border-border shadow-inner">
          
          {/* Custom Dropdown for Regions */}
          <div className="relative">
            <button 
               onClick={() => {
                 setDropdownOpen(!dropdownOpen);
                 if (view === "global") setView("lagos");
               }}
               className={`flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors ${view !== "global" ? 'bg-white dark:bg-slate-600 text-foreground ring-1 ring-slate-200 dark:ring-slate-500' : 'text-muted-foregroundhover:text-foreground dark:text-muted-foreground dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700'}`}>
               {view === "global" ? "Region" : view.replace("-", " ")}
               <ChevronDown size={12} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-slate-800 border border-border rounded-md shadow-xl py-1 z-50 overflow-hidden">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setView(r);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-green-50 dark:hover:bg-slate-700 ${view === r ? 'text-green-700 dark:text-green-400 bg-green-50/50 dark:bg-slate-700/50' : 'text-foreground dark:text-slate-300'}`}
                  >
                    {r.replace("-", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
             onClick={() => {
               setView("global");
               setDropdownOpen(false);
             }}
             className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors ${view === "global" ? 'bg-white dark:bg-slate-600 text-foreground ring-1 ring-slate-200 dark:ring-slate-500' : 'text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700'}`}>
             Global
          </button>
        </div>
      </div>
      <div className="flex-1 relative bg-slate-50 dark:bg-slate-900/50 overflow-hidden z-10">
        <InteractiveMap view={view} />
      </div>
    </div>
  );
}


function RecentFeedCard({ className }: { className?: string }) {
  return (
    <div className={`bg-slate-50 dark:bg-card border border-border/40 rounded-2xl shadow-sm flex flex-col ${className}`}>
      <div className="p-6 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Recent Feed</h3>
        <button 
          onClick={() => toast.info("Opening full feed history...")}
          className="text-muted-foregroundhover:text-muted-foreground dark:hover:text-slate-200 transition-colors"
        >
          <History size={16} />
        </button>
      </div>
      <div className="px-6 pb-6 space-y-3 flex-1 overflow-y-auto">
        {RECENT_FEED.map((item) => (
          <div key={item.id} className={`bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm flex gap-4 ${item.border}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.bgIcon}`}>
              <item.icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-foreground dark:text-slate-300 leading-snug">
                {item.type === 'order' ? (
                   <>Order <span className="font-bold text-foreground">{item.orderId}</span> {item.action} <span className="font-bold text-foreground">{item.user}</span>.</>
                ) : item.type === 'cart' ? (
                   <><span className="font-bold text-foreground">{item.user}</span> added <span className="font-bold text-green-700 dark:text-green-400">{item.item}</span> to cart.</>
                ) : item.type === 'session' ? (
                   <>{item.action} <span className="font-bold text-foreground">{item.location}</span>.</>
                ) : (
                   <><span className="font-bold text-foreground">{item.item}</span> {item.action} <span className="text-muted-foreground">{item.views}</span></>
                )}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-muted-foreground dark:text-muted-foreground">
                  {item.type !== 'session' ? item.location : ''} {item.type !== 'session' && item.location ? '•' : ''} {item.time}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold rounded">
                    {item.amount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionPulseCard({ className }: { className?: string }) {
  return (
    <div className={`bg-card border border-border/40 rounded-2xl p-8 shadow-sm flex flex-col min-h-[350px] ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-foreground">Transaction Pulse</h3>
          <p className="text-xs text-muted-foregroundmt-0.5">Real-time volume (last 60 minutes)</p>
        </div>
        <div className="flex items-center gap-4 hidden sm:flex">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0f5a34]" />
            <span className="text-[10px] font-bold text-muted-foregrounduppercase tracking-widest">Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-200 dark:bg-green-800" />
            <span className="text-[10px] font-bold text-muted-foregrounduppercase tracking-widest">Views</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end gap-1.5 sm:gap-[3px] px-2 mb-2 h-full">
        {PULSE_DATA.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
             <div className="w-full flex flex-col gap-0.5 h-full justify-end">
                <div 
                  className={`w-full rounded-[2px] mt-auto transition-all duration-300 ${d.highlight ? 'bg-[#0f5a34]' : 'bg-[#0f5a34]/30 dark:bg-[#0f5a34]/60 group-hover:opacity-80'}`}
                  style={{ height: d.sales + '%' }}
                />
                <div 
                  className={`w-full rounded-[2px] transition-all duration-300 ${d.highlight ? 'bg-green-400' : 'bg-green-200 dark:bg-green-800/60 group-hover:opacity-80'}`}
                  style={{ height: d.views + '%' }}
                />
             </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
        <span className="text-[10px] font-semibold text-muted-foregrounduppercase tracking-widest">60 min ago</span>
        <span className="text-[10px] font-semibold text-muted-foregrounduppercase tracking-widest">30 min ago</span>
        <span className="text-[10px] font-semibold text-muted-foregrounduppercase tracking-widest">Now</span>
      </div>
    </div>
  );
}

function CriticalAlertsCard({ className }: { className?: string }) {
  return (
    <div className={`bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col ${className}`}>
      <h3 className="text-sm font-bold text-foreground mb-6">Critical Alerts</h3>
      
      <div className="space-y-3 flex-1">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-red-800 dark:text-red-400">Low Inventory</p>
            <p className="text-xs text-red-600/80 dark:text-red-300/60 mt-0.5">
              Palm Oil (Litres) is below 5 units.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-muted-foreground flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground dark:text-slate-300">System Update</p>
            <p className="text-xs text-muted-foregroundmt-0.5">
              Payment gateway maintenance scheduled at 02:00 AM.
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => toast.info("Navigating to all alerts...")}
        className="mt-6 w-full py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2"
      >
        View All Alerts
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LiveActivityPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Live Activity</h1>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full" />
             <p className="text-sm text-muted-foregroundfont-medium">Real-time system monitoring active</p>
          </div>
        </div>
        
        <div className="bg-card border border-border/40 px-4 py-2 rounded-full flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">Operational</span>
        </div>
      </div>

      {/* ── Strictly Aligned Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Row 1 */}
        <div className="lg:col-span-2 flex h-full">
          <LiveRevenueCard className="flex-1 w-full" />
        </div>
        <div className="lg:col-span-1 flex h-full">
          <LiveNowCard className="flex-1 w-full" />
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-2 flex h-full">
          <MapCard className="flex-1 w-full" />
        </div>
        <div className="lg:col-span-1 flex h-full">
          <RecentFeedCard className="flex-1 w-full" />
        </div>

        {/* Row 3 */}
        <div className="lg:col-span-2 flex h-full">
          <TransactionPulseCard className="flex-1 w-full" />
        </div>
        <div className="lg:col-span-1 flex h-full relative">
          <CriticalAlertsCard className="flex-1 w-full" />
          
          {/* Floating Action Button */}
          <button 
            onClick={() => toast.success("Opening new alert wizard...")}
            className="absolute bottom-6 right-6 w-12 h-12 bg-[#0f5a34] justify-center text-white rounded-full flex items-center shadow-lg hover:bg-green-800 transition-colors z-20"
          >
            <Plus size={24} />
          </button>
        </div>
        
      </div>
    </div>
  );
}
