"use client";

import { ArrowUpRight, ChevronDown, Plus, X, CheckCircle2, Circle, ArrowRight, Bot, Store, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, Cell } from "recharts";
import useSWR from "swr";
import { buildQuery } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";

type DashboardStats = {
  todayRevenue: number;
  monthRevenue: number;
  walletBalance: number;
  activeChats: number;
  takeoverAlerts: number;
  productCount: number;
  pendingOrders: number;
  botEnabled: boolean;
  chartData: { date: string; amount: number }[];
};

type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  variant?: string | null;
  product?: { title?: string | null };
};

type Order = {
  id: string;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

type Product = {
  id: string;
  title: string;
  basePrice: number;
  stockLevel: number;
  images?: { id: string; url: string }[];
};



const PERIODS = ["Last 6 Months", "Last 3 Months", "Last Month"];



const statusPill = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-success-bg text-green-900 dark:bg-emerald-900/30 dark:text-emerald-400 border border-green-100 dark:border-green-900/30";
    case "SHIPPED":
    case "DELIVERED":
      return "bg-success-bg text-green-900 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-900/30";
    case "PENDING":
    default:
      return "bg-success-bg text-green-700 dark:bg-muted dark:text-muted-foreground border border-green-200 dark:border-border";
  }
};

export default function DashboardHome() {
  const [period, setPeriod] = useState("Last 6 Months");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [taskModal, setTaskModal] = useState(false);

  const { data: metricsResp } = useSWR<any>("/dashboard/metrics");
  const dashboard = metricsResp;
  
  const { data: chartResp } = useSWR<any>("/dashboard/revenue-chart");
  const chartApiData = chartResp;

  const { data: tasksResp } = useSWR<any>("/dashboard/tasks");
  const tasks = tasksResp || [];

  const { data: orders } = useSWR<any>(
    `/orders${buildQuery({ skip: 0, limit: 6 })}`
  );
  const { data: products } = useSWR<any>(
    `/products${buildQuery({ skip: 0, limit: 8 })}`
  );

  const ordersList = orders || [];
  const productsList = products || [];

  const apiChart = chartApiData?.map((entry: any) => ({
    name: entry.date,
    revenue: entry.amount,
  }));
  const revenueData = apiChart && apiChart.length > 0 ? apiChart : [];

  const topProducts = productsList.slice(0, 4);
  const recentRows =
    ordersList.length > 0
      ? ordersList.slice(0, 4).map((order: any) => ({
          id: order.id,
          customer: order.customerName,
          product:
            order.items?.[0]?.product?.title ||
            order.items?.[0]?.productId ||
            "Order items",
          status: order.status,
          amount: order.totalAmount,
          date: order.createdAt,
        }))
      : [];

  const sellerRows =
    topProducts.length > 0
      ? topProducts.map((p: any) => ({
          name: p.title,
          meta: "PRODUCT",
          amount: p.basePrice,
          bg: "bg-success-bg",
          img: p.images?.[0]?.url || "/images/shop.png",
        }))
      : [];

  return (
    <div className="space-y-6 relative pb-20">
      {/* Floating + → Add New Product */}
      <Link
        href="/dashboard/inventory/add"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-[4px] flex items-center justify-center transition-transform hover:scale-105 z-50 border border-green-600"
        title="Add New Product"
      >
        <Plus size={28} />
      </Link>

      {/* Pending Tasks Modal */}
      {taskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card rounded-[4px] p-8 max-w-md w-full border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Pending Tasks</h2>
              <button onClick={() => setTaskModal(false)} className="p-2 hover:bg-muted rounded-[4px] transition-colors text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {tasks.length > 0 ? tasks.map((t: any, i: number) => (
                <Link href={t.actionUrl} key={i} onClick={() => setTaskModal(false)} className={`flex items-center gap-3 p-3 rounded-[4px] border hover:opacity-80 transition-opacity ${t.urgent ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40" : "border-border/50 bg-muted/20"}`}>
                  <span className={`w-2 h-2 rounded-[4px] shrink-0 ${t.urgent ? "bg-red-500" : "bg-muted-foreground/40"}`} />
                  <span className={`text-sm font-bold ${t.urgent ? "text-red-700 dark:text-red-400" : "text-foreground"}`}>{t.label}</span>
                </Link>
              )) : (
                <div className="p-4 text-center text-sm font-bold text-muted-foreground">No pending tasks! 🎉</div>
              )}
            </div>
            <button onClick={() => setTaskModal(false)} className="mt-6 w-full py-3 rounded-[4px] bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Onboarding Checklist */}
      {dashboard?.setupStatus && !dashboard.setupStatus.isFullyOnboarded && (
        <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 shadow-minimal overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-top-4">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-[4px] bg-green-700 text-white flex items-center justify-center text-xs font-black">!</span>
                Getting Started
              </h2>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Complete these steps to unlock the full potential of your AI employee.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Progress</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-muted rounded-[4px] overflow-hidden">
                  <div 
                    className="h-full bg-green-700 transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${
                        ((dashboard.setupStatus.profileCompleted ? 1 : 0) + 
                        (dashboard.setupStatus.productsAdded ? 1 : 0) + 
                        (dashboard.setupStatus.botConfigured ? 1 : 0)) / 3 * 100
                      }%` 
                    }}
                  />
                </div>
                <span className="text-sm font-black text-green-700">
                  {Math.round(((dashboard.setupStatus.profileCompleted ? 1 : 0) + 
                    (dashboard.setupStatus.productsAdded ? 1 : 0) + 
                    (dashboard.setupStatus.botConfigured ? 1 : 0)) / 3 * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {/* Step 1: Profile */}
            <div className={`p-6 space-y-4 hover:bg-muted/10 transition-colors relative group ${dashboard.setupStatus.profileCompleted ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 border ${dashboard.setupStatus.profileCompleted ? 'bg-success-bg border-green-200 text-green-700' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                  <Store size={20} />
                </div>
                {dashboard.setupStatus.profileCompleted ? (
                  <CheckCircle2 size={24} className="text-green-600" />
                ) : (
                  <Circle size={24} className="text-muted-foreground/30" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-foreground">Complete Profile</h4>
                <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                  Provide your store details and business location.
                </p>
              </div>
              {!dashboard.setupStatus.profileCompleted && (
                <Link href="/dashboard/settings" className="flex items-center gap-1.5 text-xs font-black text-green-700 uppercase tracking-widest group-hover:gap-2 transition-all">
                  Go to Settings <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {/* Step 2: Products */}
            <div className={`p-6 space-y-4 hover:bg-muted/10 transition-colors relative group ${dashboard.setupStatus.productsAdded ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 border ${dashboard.setupStatus.productsAdded ? 'bg-success-bg border-green-200 text-green-700' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                  <ShoppingBag size={20} />
                </div>
                {dashboard.setupStatus.productsAdded ? (
                  <CheckCircle2 size={24} className="text-green-600" />
                ) : (
                  <Circle size={24} className="text-muted-foreground/30" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-foreground">Add Products</h4>
                <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                  List items for your AI assistant to sell to customers.
                </p>
              </div>
              {!dashboard.setupStatus.productsAdded && (
                <Link href="/dashboard/inventory/add" className="flex items-center gap-1.5 text-xs font-black text-green-700 uppercase tracking-widest group-hover:gap-2 transition-all">
                  Add Item <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {/* Step 3: Bot */}
            <div className={`p-6 space-y-4 hover:bg-muted/10 transition-colors relative group ${dashboard.setupStatus.botConfigured ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 border ${dashboard.setupStatus.botConfigured ? 'bg-success-bg border-green-200 text-green-700' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                  <Bot size={20} />
                </div>
                {dashboard.setupStatus.botConfigured ? (
                  <CheckCircle2 size={24} className="text-green-600" />
                ) : (
                  <Circle size={24} className="text-muted-foreground/30" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-foreground">Setup Channels</h4>
                <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                  Connect Telegram to launch your AI store.
                </p>
              </div>
              {!dashboard.setupStatus.botConfigured && (
                <Link href="/dashboard/settings" className="flex items-center gap-1.5 text-xs font-black text-green-700 uppercase tracking-widest group-hover:gap-2 transition-all">
                  Link Telegram <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Status Indicators */}
      {dashboard?.botStatus && (
        <div className="flex flex-wrap items-center gap-4 px-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-bg border border-green-100 dark:border-green-900/30">
            <div className={`w-2 h-2 rounded-full ${dashboard.botStatus.telegram.active ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-[11px] font-bold text-foreground">Telegram AI: {dashboard.botStatus.telegram.active ? "Active" : dashboard.botStatus.telegram.configured ? "Paused" : "Not Configured"}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-info-bg border border-blue-100 dark:border-blue-900/30">
            <div className={`w-2 h-2 rounded-full ${dashboard.botStatus.whatsapp.active ? "bg-blue-500 animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-[11px] font-bold text-foreground">WhatsApp AI: {dashboard.botStatus.whatsapp.active ? "Active" : "Beta Coming Soon"}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] font-bold text-foreground">Settlement: {dashboard.walletBalance > 0 ? "Bank Linked" : "Ready"}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Revenue */}
        <Link href="/dashboard/analytics" className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 shadow-minimal flex flex-col justify-between h-full hover:bg-muted/5 transition-all group">
          <p className="text-sm font-bold text-muted-foreground">Total Revenue</p>
          <div className="mt-2">
            <h3 className="text-4xl font-extrabold text-green-700 dark:text-green-500 tracking-tight">
              {formatCurrency(dashboard?.monthRevenue ?? 0)}
            </h3>
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-green-600 dark:text-green-400 mt-3">
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Month to date</span>
            </div>
          </div>
        </Link>

        {/* Pending Orders */}
        <Link href="/dashboard/orders" className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 shadow-minimal flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">PENDING ORDERS</p>
          <h3 className="text-3xl font-extrabold mt-2 text-foreground">{dashboard?.pendingOrders ?? 0}</h3>
        </Link>

        {/* Active Chats */}
        <Link href="/dashboard/customers" className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 shadow-minimal flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">ACTIVE CHATS</p>
          <h3 className="text-3xl font-extrabold mt-2 text-foreground">{dashboard?.activeChats ?? 0}</h3>
          <div className="mt-auto pt-6 flex items-center">
            <span className="text-xs font-bold text-muted-foreground group-hover:text-green-700 transition-colors">
              View all customers
            </span>
          </div>
        </Link>

        {/* Takeover Alerts — opens modal */}
        <button
          onClick={() => setTaskModal(true)}
          className="bg-white dark:bg-card p-6 rounded-[4px] border border-border/50 shadow-minimal flex flex-col h-full text-left hover:bg-muted/5 transition-all hover:border-red-200 dark:hover:border-red-900/50"
        >
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">TAKEOVER ALERTS</p>
          <h3 className="text-3xl font-extrabold mt-2 text-foreground">{dashboard?.takeoverAlerts ?? 0}</h3>
          <div className="mt-auto pt-6 flex items-center gap-1.5 text-[13px] font-bold text-red-500">
            <span className="w-4 h-4 rounded-[4px] bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[10px] shrink-0">!</span>
            <span>Needs attention</span>
          </div>
        </button>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Revenue Growth Chart */}
        <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-foreground">Revenue Growth</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">Performance over the selected period</p>
            </div>

            {/* Period picker */}
            <div className="relative">
              <button
                onClick={() => setPeriodOpen(!periodOpen)}
                className="flex items-center gap-2 text-xs font-bold bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-[4px] transition-colors border border-border/50"
              >
                {period} <ChevronDown size={14} className={`transition-transform duration-200 ${periodOpen ? "rotate-180" : ""}`} />
              </button>
              {periodOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setPeriodOpen(false)} />
                  <div className="absolute top-[calc(100%+6px)] right-0 bg-white dark:bg-card border border-border/60 rounded-[4px] overflow-hidden z-50 min-w-[160px]">
                    {PERIODS.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors ${period === p ? "bg-success-bg text-green-700 dark:bg-green-900/30 dark:text-green-400" : "text-foreground hover:bg-muted/50"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 mt-auto w-full h-[250px] relative pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888888", fontWeight: 700 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-foreground text-background text-xs font-bold px-3 py-2 rounded-[4px]">
                          {payload[0].payload.name}: ${(payload[0].value as number).toLocaleString()}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[2, 2, 0, 0]} maxBarSize={60}>
                  {revenueData.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === revenueData.length - 1 ? "#15803d" : "#86efac"}
                      className="dark:opacity-80 transition-all duration-300 hover:opacity-100"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-sm font-bold text-green-600 dark:text-green-500 hover:text-green-700 transition-colors hover:underline">
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-muted">
                  <th className="py-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Order ID</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Customer</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Amount</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/50">
                {recentRows.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => {}}>
                    <td className="py-4 px-2 text-xs font-bold text-muted-foreground whitespace-nowrap">#{row.id}</td>
                    <td className="py-4 px-2 text-sm font-bold text-foreground whitespace-nowrap">{row.customer}</td>
                    <td className="py-4 px-2 text-sm font-medium text-foreground max-w-[150px] truncate">{row.product}</td>
                    <td className="py-4 px-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-[4px] uppercase tracking-wider ${statusPill(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm font-extrabold text-foreground text-right whitespace-nowrap">{formatCurrency(row.amount)}</td>
                    <td className="py-4 px-2 text-xs font-medium text-muted-foreground text-right whitespace-nowrap">{formatDate(row.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-foreground mb-6">Top Sellers</h3>
          <div className="space-y-5 flex-1">
            {sellerRows.map((item: any, i: number) => (
              <Link key={i} href="/dashboard/inventory" className="flex items-center gap-4 hover:bg-muted/30 rounded-[4px] p-1.5 -mx-1.5 transition-colors group">
                <div className={`w-12 h-12 rounded-[4px] flex items-center justify-center shrink-0 overflow-hidden ${item.bg}`}>
                  <Image src={item.img} width={48} height={48} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors">{item.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-0.5">{item.meta}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-sm text-green-700 dark:text-green-500">{formatCurrency(item.amount)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Inventory Report → routes to inventory page */}
          <Link
            href="/dashboard/inventory"
            className="w-full mt-6 py-3 rounded-[4px] border border-border bg-muted/30 hover:bg-muted font-bold text-sm transition-colors text-foreground text-center block hover:border-green-700/30 dark:hover:border-green-700/30"
          >
            Inventory Report
          </Link>
        </div>
      </div>
    </div>
  );
}

