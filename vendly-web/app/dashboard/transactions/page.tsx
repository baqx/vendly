"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  Download, 
  Filter, 
  Banknote,
  ShieldCheck,
  Building
} from "lucide-react";
import useSWR from "swr";
import { buildQuery } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  timestamp: string;
  orderId?: string | null;
};

type Summary = {
  totalEarned: number;
  totalWithdrawn: number;
  currentBalance: number;
  pendingPayouts: number;
};

type Payout = {
  id: string;
  amount: number;
  type: string;
  timestamp: string;
};

const FALLBACK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_829103",
    timestamp: "2023-11-08T10:05:00.000Z",
    type: "SALE",
    amount: 45000,
  },
  {
    id: "tx_112893",
    timestamp: "2023-11-06T10:05:00.000Z",
    type: "PAYOUT",
    amount: -120000,
  },
  {
    id: "tx_553401",
    timestamp: "2023-11-05T10:05:00.000Z",
    type: "REFUND",
    amount: -8250,
  },
  {
    id: "tx_998124",
    timestamp: "2023-11-04T10:05:00.000Z",
    type: "SALE",
    amount: 104020,
  },
];


export default function WalletPage() {
  const [chartFilter, setChartFilter] = useState<"7days" | "30days">("7days");
  const [txFilter, setTxFilter] = useState<string>("All Types");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: summary } = useSWR<Summary>("/transactions/summary");
  const { data: transactions } = useSWR<Transaction[]>(
    `/transactions${buildQuery({ skip: 0, limit: 100 })}`
  );
  const { data: payouts } = useSWR<Payout[]>("/payouts");

  const transactionRows = useMemo(() => {
    const list = transactions && transactions.length > 0 ? transactions : FALLBACK_TRANSACTIONS;
    return list.map((tx) => {
      const typeKey = tx.type.toUpperCase();
      const label =
        typeKey === "SALE"
          ? "Sale"
          : typeKey === "PAYOUT"
          ? "Payout"
          : typeKey === "REFUND"
          ? "Refund"
          : typeKey;
      return {
        id: tx.id,
        date: formatDate(tx.timestamp),
        type: label,
        typeKey,
        status: "Completed",
        amount: formatCurrency(tx.amount),
        isPositive: tx.amount >= 0,
      };
    });
  }, [transactions]);

  const payoutRows = useMemo(() => {
    const list = payouts && payouts.length > 0 ? payouts : [];
    return list.map((tx) => ({
      id: tx.id,
      date: formatDate(tx.timestamp),
      amount: formatCurrency(Math.abs(tx.amount)),
    }));
  }, [payouts]);

  const filteredTransactions = transactionRows.filter((tx) => {
    if (txFilter === "All Types") return true;
    return tx.typeKey === txFilter.toUpperCase();
  });
  
  return (
    <div className="space-y-8 pb-16">
      {/* Invisible overlay to close dropdowns on outside click */}
      {filterOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setFilterOpen(false)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-foreground leading-none">Wallet & Payouts</h1>
          <p className="text-muted-foreground font-medium mt-2">Manage your revenue, withdrawals, and financial health.</p>
        </div>
        <Link href="/dashboard/transactions/withdraw" className="bg-green-700 hover:bg-green-800 text-white px-6 py-3.5 rounded-[4px] font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm">
          <Building2 size={20} />
          <span>Withdraw Funds</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-white dark:bg-card rounded-[4px] p-6 shadow-minimal border border-border/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 rounded-[4px] bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
              <Wallet size={24} className="opacity-90" />
            </div>
            <span className="text-[10px] font-extrabold tracking-widest text-green-600 dark:text-green-500 uppercase bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-[4px]">
              AVAILABLE
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-1">Available Balance</p>
            <h2 className="text-4xl sm:text-[42px] font-black tracking-tighter text-foreground leading-none mb-3">{formatCurrency(summary?.currentBalance ?? 0)}</h2>
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-bold text-sm">
              <ArrowUpRight size={16} strokeWidth={3} />
              <span>+12.5% from last month</span>
            </div>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white dark:bg-card rounded-[4px] p-6 shadow-minimal border border-border/50 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 rounded-[4px] bg-muted dark:bg-muted/50 text-foreground flex items-center justify-center">
              <Clock size={24} className="opacity-80" />
            </div>
            <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase bg-muted px-2.5 py-1 rounded-[4px]">
              PROCESSING
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-1">Pending Balance</p>
            <h2 className="text-4xl sm:text-[42px] font-black tracking-tighter text-foreground leading-none mb-3">{formatCurrency(summary?.pendingPayouts ?? 0)}</h2>
            <p className="text-muted-foreground font-medium text-sm italic opacity-80">Expected settlement in 3 business days</p>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white dark:bg-card rounded-[4px] p-6 shadow-minimal border border-border/50 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 rounded-[4px] bg-green-50 dark:bg-green-900/30 text-green-700 flex items-center justify-center">
              <Banknote size={24} className="opacity-90" />
            </div>
            <span className="text-[10px] font-extrabold tracking-widest text-foreground uppercase px-2.5 py-1">
              LIFETIME
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-1">Total Withdrawn</p>
            <h2 className="text-4xl sm:text-[42px] font-black tracking-tighter text-foreground leading-none mb-3">{formatCurrency(summary?.totalWithdrawn ?? 0)}</h2>
            <div className="flex items-center gap-2 text-foreground font-bold text-sm opacity-80">
              <ShieldCheck size={16} />
              <span>{payoutRows.length} successful payouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Bank Account */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-card rounded-[4px] p-6 shadow-minimal border border-border/50 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[18px] font-bold text-foreground">Earnings Growth</h3>
            <div className="flex bg-muted/50 p-1 rounded-[4px]">
              <button 
                onClick={() => setChartFilter("7days")}
                className={`text-[13px] font-bold px-4 py-1.5 rounded-[4px] transition-all ${
                  chartFilter === "7days" ? "bg-white dark:bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Last 7 Days
              </button>
              <button 
                onClick={() => setChartFilter("30days")}
                className={`text-[13px] font-bold px-4 py-1.5 rounded-[4px] transition-all ${
                  chartFilter === "30days" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end mt-4 relative h-[250px] w-full items-center transition-all duration-500">
            {chartFilter === "7days" ? (
              <div className="w-full flex items-end justify-between gap-1 sm:gap-4 px-2 h-[200px] mb-4 animate-in fade-in duration-500">
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[35%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[45%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[35%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[45%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[40%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[65%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[30%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[40%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[58%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-600 dark:bg-green-500 rounded-t-[4px] h-[85%] relative group">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    +$1,420.50
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-end justify-between gap-1 sm:gap-4 px-2 h-[200px] mb-4 animate-in fade-in zoom-in-95 duration-500">
                {/* Simulated 30 days data (more bars, different heights) */}
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[20%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[25%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[40%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[60%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[55%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[75%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[40%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[85%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t-[4px] h-[50%] transition-all hover:bg-green-200" />
                <div className="w-full bg-green-600 dark:bg-green-500 rounded-t-[4px] h-[95%] relative group">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    +$3,450.00
                  </div>
                </div>
              </div>
            )}
            {/* X-Axis labels */}
            <div className="w-full flex justify-between px-4 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest border-t border-border/50 pt-4">
              <span>{chartFilter === "7days" ? "15 OCT" : "01 OCT"}</span>
              <span>{chartFilter === "7days" ? "22 OCT" : "15 OCT"}</span>
              <span>{chartFilter === "7days" ? "29 OCT" : "29 OCT"}</span>
              <span>TODAY</span>
            </div>
          </div>
        </div>

        {/* Linked Account */}
        <div className="bg-[#F8F9FF] dark:bg-card/40 rounded-[4px] p-8 shadow-minimal border border-border/50 flex flex-col relative overflow-hidden h-full">
          <h3 className="text-[18px] font-bold text-foreground mb-6">Linked Account</h3>
          
          <div className="bg-white dark:bg-card rounded-[4px] p-6 shadow-sm border border-border/20 flex-1 relative flex flex-col justify-between">
            <div className="flex justify-between items-start mb-10">
              <div className="w-10 h-10 rounded-full bg-[#E5F1EC] dark:bg-green-900/30 flex items-center justify-center text-green-700">
                <Building size={20} />
              </div>
              {/* Optional card chip visual */}
              <div className="w-10 h-6 bg-muted rounded-[4px] border border-border/50 opacity-50" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[12px] font-extrabold text-muted-foreground uppercase tracking-widest">BANK OF VERDANT</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-foreground tracking-widest">****</span>
                <span className="text-xl font-black text-foreground">8291</span>
              </div>
            </div>
          </div>

          <button className="mt-8 text-sm font-extrabold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors w-full text-center py-2">
            Update Bank Details
          </button>
          
          <p className="text-[8px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.2em] text-center mt-6">
            SECURELY ENCRYPTED BY PAYOUT PROTOCOL V2.1
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-card rounded-[4px] shadow-minimal border border-border/50 p-6 sm:p-8 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-[35]">
          <div>
            <h3 className="text-xl font-bold text-foreground">Transaction History</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Detailed log of your financial movement.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 hover:bg-muted dark:hover:bg-muted/50 text-[13px] font-bold rounded-[4px] transition-colors ${
                  filterOpen ? "bg-muted dark:bg-muted/50 text-foreground border border-border/60" : "bg-muted/40 dark:bg-card text-foreground border border-transparent dark:border-border/50"
                }`}
              >
                <Filter size={16} />
                <span>{txFilter === "All Types" ? "Filter By Type" : txFilter}</span>
              </button>
              
              <div className={`absolute right-0 top-[calc(100%+8px)] w-48 bg-white dark:bg-card border border-border/60 rounded-[4px] shadow-sm overflow-hidden z-50 transition-all origin-top-right duration-200 ${
                filterOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}>
                <div className="py-1">
                  {["All Types", "Sale", "Payout", "Refund"].map((item) => (
                    <button
                      key={item}
                      onClick={() => { setTxFilter(item); setFilterOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[13px] font-bold transition-colors ${
                        txFilter === item ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20" : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="p-2.5 bg-muted/40 hover:bg-muted dark:bg-card dark:border dark:border-border/50 rounded-[4px] transition-colors text-foreground">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-[4px]">
              <p className="text-muted-foreground font-bold">No transactions match the selected filter.</p>
              <button onClick={() => setTxFilter("All Types")} className="mt-4 text-green-700 dark:text-green-500 font-bold hover:underline">Clear Filter</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">TRANSACTION ID</th>
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">DATE</th>
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">TYPE</th>
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">STATUS</th>
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-muted/20 transition-colors">
                    <td className="py-5 font-bold text-[13px] text-foreground cursor-pointer group-hover:text-green-600 transition-colors">{tx.id}</td>
                    <td className="py-5 font-medium text-[14px] text-muted-foreground">{tx.date}</td>
                    <td className="py-5">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold ${
                        tx.typeKey === "SALE" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
                        tx.typeKey === "PAYOUT" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === "Completed" ? "bg-green-500" : "bg-muted-foreground"
                        }`} />
                        <span className="font-bold text-[13px] text-foreground">{tx.status}</span>
                      </div>
                    </td>
                    <td className={`py-5 text-right font-black text-[15px] ${
                      tx.isPositive ? "text-foreground" : "text-red-600 dark:text-red-400"
                    }`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => alert("Simulating loading more records from the database...")}
              className="px-6 py-2.5 bg-white dark:bg-card border border-border/80 text-foreground text-[13px] font-bold rounded-[4px] hover:bg-muted/50 transition-colors shadow-sm active:scale-95"
            >
              Load More Transactions
            </button>
          </div>
        )}
      </div>



      {/* Payouts */}
      <div className="bg-white dark:bg-card rounded-[4px] shadow-minimal border border-border/50 p-6 sm:p-8 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Payout Requests</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Latest withdrawal activity.</p>
          </div>
        </div>
        {payoutRows.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-[4px]">
            <p className="text-muted-foreground font-bold">No payouts yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Withdrawals will show here once requested.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">PAYOUT ID</th>
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">DATE</th>
                  <th className="pb-4 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {payoutRows.map((payout) => (
                  <tr key={payout.id} className="group hover:bg-muted/20 transition-colors">
                    <td className="py-5 font-bold text-[13px] text-foreground">{payout.id}</td>
                    <td className="py-5 font-medium text-[14px] text-muted-foreground">{payout.date}</td>
                    <td className="py-5 text-right font-black text-[15px] text-foreground">{payout.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Footer Text */}
      <div className="flex justify-center mt-12 pb-8">
        <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.25em]">
          VERDANT LEDGER FINANCIAL SYSTEMS • SECURED WITH BIO-METRIC ENCRYPTION
        </p>
      </div>

    </div>
  );
}
