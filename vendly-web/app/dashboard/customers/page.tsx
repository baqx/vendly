"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Megaphone,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_CUSTOMERS = [
  {
    id: "c1",
    name: "Amara Okafor",
    email: "amara.okafor@email.com",
    status: "VIP",
    totalSpent: 450000,
    orders: 42,
    lastOrder: "Oct 24, 2023",
    avatar: "/images/avatar1.png", 
  },
  {
    id: "c2",
    name: "Chinwe Adeleke",
    email: "c.adeleke@domain.ng",
    status: "ACTIVE",
    totalSpent: 128500,
    orders: 12,
    lastOrder: "Nov 02, 2023",
    avatar: "/images/avatar1.png",
  },
  {
    id: "c3",
    name: "Babajide Sanwo",
    email: "bj.sanwo@provider.com",
    status: "NEW",
    totalSpent: 12400,
    orders: 1,
    lastOrder: "Yesterday",
    avatar: "/images/avatar1.png",
  },
  {
    id: "c4",
    name: "Fatima Yusuf",
    email: "f.yusuf@web.com",
    status: "VIP",
    totalSpent: 892300,
    orders: 89,
    lastOrder: "Oct 12, 2023",
    avatar: "/images/avatar1.png",
  },
  {
    id: "c5",
    name: "Tunde Bakare",
    email: "tunde.b@corp.ng",
    status: "ACTIVE",
    totalSpent: 215000,
    orders: 24,
    lastOrder: "Nov 01, 2023",
    avatar: "/images/avatar1.png",
  },
];

type TabType = "All Customers" | "VIP Only" | "New Leads";

export default function CustomersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("All Customers");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = useMemo(() => {
    switch (activeTab) {
      case "VIP Only":
        return MOCK_CUSTOMERS.filter((c) => c.status === "VIP");
      case "New Leads":
        return MOCK_CUSTOMERS.filter((c) => c.status === "NEW");
      default:
        return MOCK_CUSTOMERS;
    }
  }, [activeTab]);

  const totalPages = Math.ceil(1429 / itemsPerPage); // Mocking large dataset count

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "VIP":
        return (
          <span className="px-3 py-1 rounded-[8px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-[11px] font-extrabold tracking-widest uppercase">
            VIP
          </span>
        );
      case "ACTIVE":
        return (
          <span className="px-3 py-1 rounded-[8px] bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] font-extrabold tracking-widest uppercase border border-emerald-100 dark:border-emerald-800/30">
            ACTIVE
          </span>
        );
      case "NEW":
        return (
          <span className="px-3 py-1 rounded-[8px] bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[11px] font-extrabold tracking-widest uppercase">
            NEW
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* ── Header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Customer Directory</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Manage relationships and track customer lifetime value.
          </p>
        </div>
        
        {/* Total Customers Metric Card */}
        <div className="bg-card border border-border/50 rounded-[8px] p-4 shadow-none min-w-[200px] flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-extrabold text-muted-foreground mb-1">Total Customers</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground tracking-tight">1,429</span>
              <span className="flex items-center text-xs font-bold text-green-600">
                <TrendingUp size={12} className="mr-0.5" /> 12%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-[8px] bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-700 dark:text-green-500 shrink-0">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* ── Tabs & Actions ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-1 bg-card p-1 rounded-[8px] border border-border/50 shadow-none overflow-x-auto w-full sm:w-auto">
          {(["All Customers", "VIP Only", "New Leads"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-[8px] text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-muted/50 text-green-700 dark:text-green-400 shadow-none"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => toast.info("Filter modal triggered")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-card border border-border hover:bg-muted px-4 py-2.5 rounded-[8px] text-sm font-bold text-foreground transition-all shadow-none"
          >
            <Filter size={16} /> Filters
          </button>
          <Link 
            href="/dashboard/customers/add"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-[8px] text-sm font-bold transition-all shadow-none shadow-green-700/20"
          >
            <Plus size={16} /> Add Customer
          </Link>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-card border border-border/50 rounded-[8px] shadow-none overflow-hidden pt-2 relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40">
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest w-[35%]">Customer Name</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Total Spent</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Orders</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                  className="group hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[8px] bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-border">
                         <Image src={customer.avatar} width={40} height={40} alt={customer.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-foreground truncate">{customer.name}</p>
                        <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="py-4 px-6 text-sm font-black text-foreground">
                    ₦ {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-foreground">
                    {customer.orders}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {customer.lastOrder}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm font-medium">
                    No customers found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10 dark:bg-transparent">
          <p className="text-xs font-bold text-muted-foreground">
            Showing <span className="text-foreground">1-5</span> of <span className="text-foreground">1,429</span> customers
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors disabled:opacity-50">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-green-700 text-white font-extrabold text-xs shadow-none shadow-green-700/20">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-muted transition-colors text-foreground font-bold text-xs">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-muted transition-colors text-foreground font-bold text-xs">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-muted-foreground font-bold text-xs">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-muted transition-colors text-foreground font-bold text-xs">
              12
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Insights Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Engagement Split */}
        <div className="bg-muted/30 border border-border/50 rounded-[8px] p-6 lg:p-8">
          <h3 className="text-sm font-extrabold text-foreground mb-6">Engagement Split</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted-foreground">Returning Customers</span>
                <span className="text-xs font-extrabold text-green-700 dark:text-green-500">64%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-[8px] overflow-hidden">
                <div className="bg-green-700 h-full rounded-[8px] w-[64%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted-foreground">First-time Buyers</span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">36%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-[8px] overflow-hidden">
                <div className="bg-slate-400 dark:bg-slate-500 h-full rounded-[8px] w-[36%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Automated Retention */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-[8px] p-6 lg:p-8 flex items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 flex-1">
             <h3 className="text-sm font-extrabold text-foreground mb-2">Automated Retention</h3>
             <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-[280px]">
               Send specialized coupons to customers who haven&apos;t ordered in the last 30 days. Currently targeting <strong className="text-foreground">112 customers</strong>.
             </p>
             <button className="mt-4 flex items-center gap-1.5 text-xs font-extrabold text-green-700 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 group transition-colors">
               Enable Workflow <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
          <div className="w-20 h-20 rounded-[8px] bg-[#e3ecf8] dark:bg-blue-900/40 flex items-center justify-center shrink-0 shadow-inner relative z-10">
            <Megaphone size={28} className="text-green-700 dark:text-green-500" />
          </div>
        </div>

      </div>

    </div>
  );
}
