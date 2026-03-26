"use client";

import { use } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import Link from "next/link";
import { 
  ArrowLeft,
  UserCircle2,
  Phone,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  Clock,
  ChevronRight,
  Bot
} from "lucide-react";
import { format } from "date-fns";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const identifier = decodeURIComponent(unwrappedParams.id);
  
  const { data, isLoading, error } = useSWR(`/customers/${identifier}`, swrFetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin flex items-center justify-center"></div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <UserCircle2 size={48} className="mb-4 text-slate-300" />
        <h3 className="text-xl font-bold text-foreground">Customer Not Found</h3>
        <p className="mb-6">We couldn&apos;t load the records for this customer.</p>
        <Link href="/dashboard/customers" className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-[4px] font-bold">
          Go Back
        </Link>
      </div>
    );
  }

  const customer = data.data;
  const { session, orders, totalSpent } = customer;

  return (
    <div className="space-y-8 pb-10 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      {/* ── Breadcrumb & Header ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/customers" className="text-muted-foreground hover:text-foreground transition-colors font-bold flex items-center gap-1.5 text-xs">
            <ArrowLeft size={14} /> Back to Directory
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-[4px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0 border border-border">
              <UserCircle2 size={36} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground truncate max-w-[400px]">
                {session?.customerName || orders?.[0]?.customerName || "Anonymous Customer"}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                  <Phone size={14} /> {identifier}
                </p>
                {session?.channel && (
                  <span className="px-2 py-0.5 rounded-[4px] bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest">
                    {session.channel}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-[4px] border border-border bg-card hover:bg-muted text-sm font-bold transition-all shadow-none">
              <MessageCircle size={16} /> Send Message
            </button>
          </div>
        </div>
      </div>

      {/* ── Metrics Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/50 rounded-[4px] p-6 shadow-none">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Lifetime Value</p>
            <div className="w-8 h-8 rounded-[4px] bg-green-50 text-green-700 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">₦ {(totalSpent || 0).toLocaleString()}</h2>
        </div>
        
        <div className="bg-card border border-border/50 rounded-[4px] p-6 shadow-none">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Total Orders</p>
            <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100/50">
              <ShoppingBag size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">{orders?.length || 0}</h2>
        </div>

        <div className="bg-card border border-border/50 rounded-[4px] p-6 shadow-none">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Last Interaction</p>
            <div className="w-8 h-8 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-border/50">
              <Clock size={16} />
            </div>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground mt-2">
            {session ? new Date(session.updatedAt).toLocaleDateString() : "Never"}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ── Order History (Left column) ── */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <ShoppingBag size={16} className="text-muted-foreground" /> Order History
          </h3>
          
          <div className="bg-card border border-border/50 rounded-[4px] overflow-hidden shadow-none">
            {orders?.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20">
                    <th className="py-4 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Order ID</th>
                    <th className="py-4 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Date</th>
                    <th className="py-4 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="group hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-extrabold tracking-widest uppercase ${
                          order.status === "PAID" ? "bg-green-100 text-green-700 border border-green-200" :
                          order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" :
                          "bg-amber-50 text-amber-700 border border-amber-200/50"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-foreground text-right">
                        ₦ {parseFloat(order.totalAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <ShoppingBag size={32} className="text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm font-bold text-foreground">No orders yet</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">This customer hasn&apos;t completed a purchase.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Interaction Log (Right column) ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Bot size={16} className="text-muted-foreground" /> Bot Interactions
            </h3>
            {session && (
              <Link href={`/dashboard/messages?chatId=${session.id}`} className="text-[11px] font-bold text-green-700 uppercase tracking-wider flex items-center hover:text-green-800 transition-colors">
                View Chat <ChevronRight size={14} />
              </Link>
            )}
          </div>
          
          <div className="bg-[#F8F9FF] dark:bg-card border border-border/50 rounded-[4px] p-6 shadow-none min-h-[400px]">
            {!session || session.messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-10">
                <MessageCircle size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-bold text-foreground">No chat history</p>
                <p className="text-xs font-medium mt-1">No AI interactions recorded.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {session.messages.slice(-5).map((msg: any) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === "CUSTOMER" ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 mx-1">
                      {msg.role === "CUSTOMER" ? "Customer" : "AI Assistant"}
                    </span>
                    <div className={`px-4 py-2.5 rounded-[4px] text-[13px] font-medium max-w-[90%] leading-relaxed ${
                      msg.role === "CUSTOMER" 
                        ? "bg-foreground text-background" 
                        : "bg-white dark:bg-muted border border-border/60 text-foreground"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {session.messages.length > 5 && (
                  <div className="text-center pt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-border/20 px-3 py-1 rounded-[4px]">
                      +{session.messages.length - 5} older messages
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
