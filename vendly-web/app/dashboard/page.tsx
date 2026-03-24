"use client";

import { ArrowUpRight, ChevronDown, Star, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, Cell } from "recharts";

const allData: Record<string, { name: string; revenue: number }[]> = {
  "Last 6 Months": [
    { name: "Jan", revenue: 5200 },
    { name: "Feb", revenue: 6100 },
    { name: "Mar", revenue: 7800 },
    { name: "Apr", revenue: 8900 },
    { name: "May", revenue: 10500 },
    { name: "Jun", revenue: 12450 },
  ],
  "Last 3 Months": [
    { name: "Apr", revenue: 8900 },
    { name: "May", revenue: 10500 },
    { name: "Jun", revenue: 12450 },
  ],
  "Last Month": [
    { name: "Week 1", revenue: 2800 },
    { name: "Week 2", revenue: 3100 },
    { name: "Week 3", revenue: 3500 },
    { name: "Week 4", revenue: 3050 },
  ],
};

const PERIODS = ["Last 6 Months", "Last 3 Months", "Last Month"];

export default function DashboardHome() {
  const [period, setPeriod] = useState("Last 6 Months");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [taskModal, setTaskModal] = useState(false);

  const revenueData = allData[period];

  return (
    <div className="space-y-6 relative pb-20">
      {/* Floating + → Add New Product */}
      <Link
        href="/dashboard/inventory/add"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-[8px] flex items-center justify-center transition-transform hover:scale-105 z-50 border border-green-600"
        title="Add New Product"
      >
        <Plus size={28} />
      </Link>

      {/* Pending Tasks Modal */}
      {taskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card rounded-[8px] p-8 max-w-md w-full border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Pending Tasks</h2>
              <button onClick={() => setTaskModal(false)} className="p-2 hover:bg-muted rounded-[8px] transition-colors text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Ship order #VL-8819 to Sarah Johnson", urgent: true },
                { label: "Restock: Shea Butter Gold (low stock)", urgent: true },
                { label: "Reply to 3 customer messages", urgent: false },
                { label: "Review flagged product listing", urgent: false },
                { label: "Upload Q4 inventory report", urgent: false },
              ].map((t, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-[8px] border ${t.urgent ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40" : "border-border/50 bg-muted/20"}`}>
                  <span className={`w-2 h-2 rounded-[8px] shrink-0 ${t.urgent ? "bg-red-500" : "bg-muted-foreground/40"}`} />
                  <span className={`text-sm font-bold ${t.urgent ? "text-red-700 dark:text-red-400" : "text-foreground"}`}>{t.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setTaskModal(false)} className="mt-6 w-full py-3 rounded-[8px] bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Revenue */}
        <Link href="/dashboard/analytics" className="bg-white dark:bg-card p-6 rounded-[8px] border border-border/50 shadow-minimal flex flex-col justify-between h-full hover:bg-muted/5 transition-all group">
          <p className="text-sm font-bold text-muted-foreground">Total Revenue</p>
          <div className="mt-2">
            <h3 className="text-4xl font-extrabold text-green-700 dark:text-green-500 tracking-tight">$12,450.00</h3>
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-green-600 dark:text-green-400 mt-3">
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>+12.5% from last month</span>
            </div>
          </div>
        </Link>

        {/* Total Orders */}
        <Link href="/dashboard/orders" className="bg-white dark:bg-card p-6 rounded-[8px] border border-border/50 shadow-minimal flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">TOTAL ORDERS</p>
          <h3 className="text-3xl font-extrabold mt-2 text-foreground">324</h3>
          <div className="mt-auto pt-6">
            <div className="h-1.5 w-full bg-muted rounded-[8px] overflow-hidden">
              <div className="h-full bg-green-700 dark:bg-green-500 w-2/3 rounded-[8px]" />
            </div>
          </div>
        </Link>

        {/* Active Customers */}
        <Link href="/dashboard/customers" className="bg-white dark:bg-card p-6 rounded-[8px] border border-border/50 shadow-minimal flex flex-col h-full hover:bg-muted/5 transition-all">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">ACTIVE CUSTOMERS</p>
          <h3 className="text-3xl font-extrabold mt-2 text-foreground">215</h3>
          <div className="mt-auto pt-6 flex items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-[8px] border-2 border-white dark:border-card bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  <Image src={`/images/avatar${i}.png`} width={32} height={32} alt={`User ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-[8px] border-2 border-white dark:border-card bg-muted flex items-center justify-center z-10 text-[10px] font-bold text-muted-foreground shrink-0">
                +211
              </div>
            </div>
          </div>
        </Link>

        {/* Pending Tasks — opens modal */}
        <button
          onClick={() => setTaskModal(true)}
          className="bg-white dark:bg-card p-6 rounded-[8px] border border-border/50 shadow-minimal flex flex-col h-full text-left hover:bg-muted/5 transition-all hover:border-red-200 dark:hover:border-red-900/50"
        >
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">PENDING TASKS</p>
          <h3 className="text-3xl font-extrabold mt-2 text-foreground">12</h3>
          <div className="mt-auto pt-6 flex items-center gap-1.5 text-[13px] font-bold text-red-500">
            <span className="w-4 h-4 rounded-[8px] bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[10px] shrink-0">!</span>
            <span>Needs attention</span>
          </div>
        </button>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-card rounded-[8px] border border-border/50 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-foreground">Revenue Growth</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">Performance over the selected period</p>
            </div>

            {/* Period picker */}
            <div className="relative">
              <button
                onClick={() => setPeriodOpen(!periodOpen)}
                className="flex items-center gap-2 text-xs font-bold bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-[8px] transition-colors border border-border/50"
              >
                {period} <ChevronDown size={14} className={`transition-transform duration-200 ${periodOpen ? "rotate-180" : ""}`} />
              </button>
              {periodOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setPeriodOpen(false)} />
                  <div className="absolute top-[calc(100%+6px)] right-0 bg-white dark:bg-card border border-border/60 rounded-[8px] overflow-hidden z-50 min-w-[160px]">
                    {PERIODS.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors ${period === p ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "text-foreground hover:bg-muted/50"}`}
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
                        <div className="bg-foreground text-background text-xs font-bold px-3 py-2 rounded-[8px]">
                          {payload[0].payload.name}: ${(payload[0].value as number).toLocaleString()}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[2, 2, 0, 0]} maxBarSize={60}>
                  {revenueData.map((_, index) => (
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

        {/* Orders by Category */}
        <div className="bg-white dark:bg-card rounded-[8px] border border-border/50 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">Orders by Category</h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">Sales volume by department</p>
          </div>
          <div className="space-y-5 flex-1">
            {[
              { name: "Organic Produce", val: "45%", w: "w-[45%]", color: "bg-green-700 dark:bg-green-500" },
              { name: "Dairy & Eggs", val: "28%", w: "w-[28%]", color: "bg-green-400 dark:bg-green-600" },
              { name: "Handmade Crafts", val: "15%", w: "w-[15%]", color: "bg-green-200 dark:bg-green-800" },
              { name: "Others", val: "12%", w: "w-[12%]", color: "bg-indigo-100 dark:bg-indigo-900/50" },
            ].map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-foreground">{cat.name}</span>
                  <span className="text-xs font-bold text-muted-foreground">{cat.val}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-[8px] overflow-hidden">
                  <div className={`h-full rounded-[8px] ${cat.w} ${cat.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-green-50 dark:bg-green-950/30 rounded-[8px] p-4 border border-green-100 dark:border-green-900/50 flex gap-3">
            <div className="mt-0.5 text-green-600 dark:text-green-500 shrink-0">
              <Star size={18} className="fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-900 dark:text-green-400">Insight</p>
              <p className="text-xs font-medium text-green-800/80 dark:text-green-500/80 mt-0.5 leading-relaxed">
                Organic Produce is up 20% this week.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white dark:bg-card rounded-[8px] border border-border/50 p-6 overflow-hidden flex flex-col">
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
                {[
                  { id: "#VL-8821", customer: "Amara Okafor", product: "Premium Honey Bundle", status: "SHIPPED", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", amount: "$124.00", date: "Oct 24, 2023" },
                  { id: "#VL-8820", customer: "David Mensah", product: "Organic Coffee Beans", status: "PAID", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", amount: "$45.50", date: "Oct 24, 2023" },
                  { id: "#VL-8819", customer: "Sarah Johnson", product: "Hand-woven Basket", status: "PENDING", statusColor: "bg-green-50 text-green-700 dark:bg-muted dark:text-muted-foreground border border-green-200 dark:border-border", amount: "$89.00", date: "Oct 23, 2023" },
                  { id: "#VL-8818", customer: "Kwame Boateng", product: "Shea Butter Gold", status: "SHIPPED", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", amount: "$210.00", date: "Oct 23, 2023" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => {}}>
                    <td className="py-4 px-2 text-xs font-bold text-muted-foreground whitespace-nowrap">{row.id}</td>
                    <td className="py-4 px-2 text-sm font-bold text-foreground whitespace-nowrap">{row.customer}</td>
                    <td className="py-4 px-2 text-sm font-medium text-foreground max-w-[150px] truncate">{row.product}</td>
                    <td className="py-4 px-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-[8px] uppercase tracking-wider ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm font-extrabold text-foreground text-right whitespace-nowrap">{row.amount}</td>
                    <td className="py-4 px-2 text-xs font-medium text-muted-foreground text-right whitespace-nowrap">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white dark:bg-card rounded-[8px] border border-border/50 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-foreground mb-6">Top Sellers</h3>
          <div className="space-y-5 flex-1">
            {[
              { name: "Wild Forest Honey", meta: "PANTRY • 124 SALES", amount: "$2,480", bg: "bg-amber-100", img: "/images/honey.png" },
              { name: "Shea Butter Gold", meta: "BEAUTY • 98 SALES", amount: "$1,960", bg: "bg-orange-100", img: "/images/shea.png" },
              { name: "Ceramic Earth Vase", meta: "DECOR • 76 SALES", amount: "$1,520", bg: "bg-stone-200", img: "/images/vase.png" },
              { name: "Premium Mangoes", meta: "FRUIT • 64 SALES", amount: "$1,280", bg: "bg-yellow-100", img: "/images/mangoes.png" },
            ].map((item, i) => (
              <Link key={i} href="/dashboard/inventory" className="flex items-center gap-4 hover:bg-muted/30 rounded-[8px] p-1.5 -mx-1.5 transition-colors group">
                <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden ${item.bg}`}>
                  <Image src={item.img} width={48} height={48} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors">{item.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-0.5">{item.meta}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-sm text-green-700 dark:text-green-500">{item.amount}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Inventory Report → routes to inventory page */}
          <Link
            href="/dashboard/inventory"
            className="w-full mt-6 py-3 rounded-[8px] border border-border bg-muted/30 hover:bg-muted font-bold text-sm transition-colors text-foreground text-center block hover:border-green-700/30 dark:hover:border-green-700/30"
          >
            Inventory Report
          </Link>
        </div>
      </div>
    </div>
  );
}
