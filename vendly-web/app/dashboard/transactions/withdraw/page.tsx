"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Building,
  CheckCircle2,
  Info,
  Clock,
  MinusCircle,
  ShieldCheck,
  Loader2,
  AlertCircle
} from "lucide-react";
import useSWR from "swr";
import { apiJson } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default function WithdrawFundsPage() {
  const [amount, setAmount] = useState<string>("5000");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableBalance = 14280.50;

  // Handle preset amounts
  const handlePreset = (val: number | "MAX") => {
    setErrorMsg(null);
    if (val === "MAX") {
      setAmount(availableBalance.toString());
    } else {
      setAmount(val.toString());
    }
  };

  // Safe number parsing
  const parsedAmount = parseFloat(amount) || 0;
  const processingFee = parsedAmount * 0.002; // 0.2% fee
  const totalToReceive = parsedAmount - processingFee;

  const handleWithdrawal = () => {
    setErrorMsg(null);
    if (parsedAmount < 50) {
      setErrorMsg("Minimum withdrawal amount is $50.00.");
      return;
    }
    if (parsedAmount > availableBalance) {
      setErrorMsg("Amount exceeds available balance.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Auto dismiss success and clear after 3s
      setTimeout(() => {
        setIsSuccess(false);
        setAmount("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <Link href="/dashboard/transactions" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to Wallet
        </Link>
        <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-foreground leading-none">Withdraw Funds</h1>
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Available Balance Card */}
          <div className="bg-gradient-to-r from-white via-white to-green-50 dark:from-card dark:via-card dark:to-green-900/10 rounded-[4px] p-6 sm:p-8 shadow-minimal border border-border/50 relative overflow-hidden">
            {/* Soft backdrop glow matching screenshot */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-green-400/20 to-transparent blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <p className="text-[11px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest mb-2">Available Balance</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl sm:text-[48px] font-black tracking-tighter text-foreground leading-none">$14,280.50</h2>
                <span className="text-lg font-bold text-muted-foreground uppercase">USD</span>
              </div>
            </div>
          </div>

          {/* Payout Destination */}
          <div className="bg-white dark:bg-card rounded-[4px] p-6 sm:p-8 shadow-minimal border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Payout Destination</h3>
              <button 
                onClick={() => alert("Multi-bank account links are coming in v2.0!")}
                className="text-[13px] font-bold text-green-700 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 transition-colors"
                type="button"
              >
                Change Account
              </button>
            </div>

            <div className="bg-[#F8F9FF] dark:bg-muted/30 border-2 border-green-600/20 dark:border-green-500/30 rounded-[4px] p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all hover:border-green-600/40 cursor-pointer gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[4px] bg-white dark:bg-card border border-border/50 shadow-sm flex items-center justify-center shrink-0 text-green-700 dark:text-green-500">
                  <Building size={24} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-foreground">Bank of Verdant</h4>
                  <div className="flex items-center flex-wrap gap-2 mt-0.5">
                    <span className="text-lg tracking-widest text-muted-foreground leading-none mt-1">••••</span>
                    <span className="text-sm font-bold text-muted-foreground">8291</span>
                    <span className="text-[9px] font-extrabold bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-[4px] uppercase tracking-wider ml-1">PRIMARY</span>
                  </div>
                </div>
              </div>
              <CheckCircle2 size={24} className="text-green-600 dark:text-green-500 self-end sm:self-auto shrink-0" />
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="bg-white dark:bg-card rounded-[4px] p-6 sm:p-8 shadow-minimal border border-border/50">
            <h3 className="text-xl font-bold text-foreground mb-6">Withdrawal Amount</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-muted-foreground mb-2">Amount to withdraw</label>
                <div className="relative flex items-center">
                  <span className="absolute left-6 text-2xl font-black text-muted-foreground pointer-events-none">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrorMsg(null);
                    }}
                    className={`w-full bg-white dark:bg-card border ${errorMsg ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:ring-green-600/20'} rounded-[4px] py-6 pl-12 pr-6 text-[32px] font-black text-foreground shadow-sm focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground/30`}
                    placeholder="0.00"
                    disabled={isSubmitting || isSuccess}
                  />
                </div>
                {errorMsg && (
                  <div className="flex items-center gap-1.5 mt-3 text-red-500 font-bold text-[13px]">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {[500, 1000, 5000].map((val) => (
                  <button 
                    key={val}
                    onClick={() => handlePreset(val)}
                    disabled={isSubmitting || isSuccess}
                    className="px-5 py-2 rounded-[4px] border border-border/80 bg-white dark:bg-muted/20 text-[13px] font-bold text-muted-foreground hover:bg-muted dark:hover:bg-muted/50 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ${val.toLocaleString()}
                  </button>
                ))}
                <button 
                  onClick={() => handlePreset("MAX")}
                  disabled={isSubmitting || isSuccess}
                  className="px-5 py-2 rounded-[4px] border border-green-200 dark:border-green-900 bg-success-bg dark:bg-green-900/20 text-[13px] font-bold text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Max Balance
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Summary & Guidelines */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Transaction Summary */}
          <div className="bg-white dark:bg-card rounded-[4px] p-6 sm:p-8 shadow-minimal border border-border/50">
            <h3 className="text-[18px] font-bold text-foreground mb-6">Transaction Summary</h3>
            
            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <span className="text-[14px] font-medium text-muted-foreground w-1/2">Withdrawal Amount</span>
                <span className="text-[15px] font-bold text-foreground">${parsedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-[14px] font-medium text-muted-foreground w-1/2">Processing Fee (0.2%)</span>
                <span className="text-[15px] font-bold text-foreground">${processingFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>

              <div className="pt-5 border-t border-border/60 flex justify-between items-center bg-transparent mt-2">
                <span className="text-[16px] font-bold text-foreground tracking-tight">Total to Receive</span>
                <span className="text-[24px] sm:text-[28px] font-black text-green-700 dark:text-green-500 transition-all">
                  ${Math.max(0, totalToReceive).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
            </div>

            <button 
              onClick={handleWithdrawal}
              disabled={isSubmitting || isSuccess || parsedAmount <= 0}
              className={`w-full flex items-center justify-center gap-2 mt-8 py-4 rounded-[4px] font-extrabold text-[15px] transition-all shadow-sm ${
                isSuccess 
                  ? "bg-success-bg text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                  : isSubmitting || parsedAmount <= 0
                    ? "bg-green-700/50 text-white cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800 text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Withdrawal Successful!</span>
                </>
              ) : (
                "Request Withdrawal"
              )}
            </button>
            <p className="text-center text-[11px] font-medium text-muted-foreground mt-4 px-2 leading-relaxed">
              By clicking this button you agree to our <a href="#" className="underline hover:text-foreground">Terms of Service</a>.
            </p>
          </div>


          {/* Guidelines */}
          <div className="bg-white dark:bg-card rounded-[4px] p-6 sm:p-8 shadow-minimal border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Info size={20} className="text-green-700 dark:text-green-500" />
              <h3 className="text-[18px] font-bold text-foreground">Guidelines</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-[4px] bg-muted dark:bg-muted/50 flex items-center justify-center shrink-0 text-foreground mt-0.5">
                  <Clock size={14} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Estimated time</h4>
                  <p className="text-[13px] font-medium text-muted-foreground mt-1">1-3 business days for processing.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-[4px] bg-muted dark:bg-muted/50 flex items-center justify-center shrink-0 text-foreground mt-0.5">
                  <MinusCircle size={14} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Minimum amount</h4>
                  <p className="text-[13px] font-medium text-muted-foreground mt-1">Minimum withdrawal is $50.00.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-[4px] bg-success-bg dark:bg-green-900/30 flex items-center justify-center shrink-0 text-green-700 dark:text-green-500 mt-0.5">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Security Verification</h4>
                  <p className="text-[13px] font-medium text-muted-foreground mt-1">You may be asked for 2FA confirmation.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

