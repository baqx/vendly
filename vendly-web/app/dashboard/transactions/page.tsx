"use client";

import { CreditCard, Wallet, Download, ArrowUpRight, ArrowDownLeft, FileText, Filter, Search } from "lucide-react";

export default function TransactionsPage() {
  const transactions = [
    { id: "TX-9901", date: "Oct 24, 2026", type: "Sale", amount: "+₦25,000", status: "Settled", order: "#ORD-7721" },
    { id: "TX-9902", date: "Oct 23, 2026", type: "Payout", amount: "-₦150,000", status: "Processing", order: "-" },
    { id: "TX-9903", date: "Oct 22, 2026", type: "Sale", amount: "+₦12,500", status: "Settled", order: "#ORD-7719" },
    { id: "TX-9904", date: "Oct 21, 2026", type: "Refund", amount: "-₦5,000", status: "Settled", order: "#ORD-7705" },
  ];

  return (
    <div className="space-y-8">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-primary rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
            <Wallet size={120} />
          </div>
          
          <div className="relative z-10">
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Total Balance</p>
            <h2 className="text-5xl font-black tracking-tighter">₦4.2M</h2>
            <div className="flex items-center gap-4 mt-8">
              <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-secondary hover:text-white transition-all">
                Request Payout
              </button>
              <button className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-all border border-white/10">
                Wallet Settings
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-primary mb-4 border border-border">
              <CreditCard size={28} />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available for Payout</p>
            <h3 className="text-3xl font-black mt-1">₦850,000</h3>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium bg-muted p-2 rounded-lg mt-4 border border-border italic text-center">
            Next settlement scheduled for Monday at 12:00 AM
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold tracking-tight">Recent Activity</h3>
          <div className="flex gap-2">
            <button className="p-2 border border-border rounded-lg bg-card hover:bg-muted transition-all text-foreground">
              <Download size={18} />
            </button>
            <button className="p-2 border border-border rounded-lg bg-card hover:bg-muted transition-all text-foreground">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-muted/30 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-border shadow-sm ${
                    tx.amount.startsWith("+") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {tx.amount.startsWith("+") ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-foreground">{tx.type}</span>
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border uppercase">{tx.id}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      {tx.date} • {tx.order}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 text-left sm:text-right flex items-center sm:block gap-4 sm:gap-0">
                  <p className={`text-lg font-black ${
                    tx.amount.startsWith("+") ? "text-green-600" : "text-foreground"
                  }`}>
                    {tx.amount}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border mt-1 ${
                    tx.status === "Settled" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
