"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import Link from "next/link";
import { toast } from "sonner";
import {
  Download,
  Activity,
  TrendingUp,
  TrendingDown,
  Bot,
  Sparkles,
  Clock,
  Zap,
  ChevronDown
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface MetricCard {
  label: string;
  value: string;
  badge: string;
  badgePositive: boolean;
  sub: string;
}

interface TrafficSource {
  label: string;
  count: number;
  max: number;
}

interface Category {
  label: string;
  pct: number;
  color: string;
}

interface AnalyticsData {
  conversionRate?: string;
  avgOrderValue?: number;
  totalOrders?: number;
  topCategories?: Category[];
  sessionCount?: number;
  aiAssistedSales?: number;
}

const TRAFFIC_SOURCES: TrafficSource[] = [
  { label: "Direct Search", count: 4120, max: 4120 },
  { label: "Social Media", count: 2840, max: 4120 },
  { label: "Referral Links", count: 1450, max: 4120 },
  { label: "Email Campaigns", count: 940, max: 4120 },
];

/** Metric card at the top */
function MetricCard({ label, value, badge, badgePositive, sub }: MetricCard) {
  return (
    <div className="bg-card border border-border/40 rounded-[4px] p-6 flex flex-col gap-2 shadow-minimal">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <span
          className={`text-xs font-extrabold px-2.5 py-1 rounded-[4px] ${
            badgePositive
              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          }`}
        >
          {badge}
        </span>
      </div>
      <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground font-medium">{sub}</p>
    </div>
  );
}

/** Single bar for the revenue chart */
function Bar({
  revenue,
  expenses,
  day,
  maxVal,
}: {
  revenue: number;
  expenses: number;
  day: string;
  maxVal: number;
}) {
  const revH = Math.round((revenue / maxVal) * 100);
  const expH = Math.round((expenses / maxVal) * 100);
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="flex items-end gap-[3px] h-[140px] w-full justify-center">
        {/* Revenue bar */}
        <div
          className="w-[45%] rounded-t-[4px] bg-green-400 dark:bg-green-600 transition-all duration-700"
          style={{ height: `${revH}%` }}
        />
        {/* Expenses bar */}
        <div
          className="w-[45%] rounded-t-[4px] bg-green-200 dark:bg-green-900/60 transition-all duration-700"
          style={{ height: `${expH}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-muted-foreground tracking-widest">{day}</span>
    </div>
  );
}

/** Donut chart drawn with SVG */
function DonutChart({ categories }: { categories: Category[] }) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 48;
  const strokeW = 18;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = categories.map((cat) => {
    const dashLength = (cat.pct / 100) * circumference;
    const gap = circumference - dashLength;
    const segment = { ...cat, dashLength, gap, offset };
    offset += dashLength; // no gap between segments
    return segment;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeW}
            className="text-muted/40"
          />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeDasharray={`${seg.dashLength} ${seg.gap}`}
              strokeDashoffset={-seg.offset}
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black text-foreground">72%</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Growth
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-1.5 mt-2">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs font-semibold text-muted-foreground">{cat.label}</span>
            </div>
            <span className="text-xs font-extrabold text-foreground">{cat.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Traffic source row with progress bar */
function TrafficRow({ label, count, max }: TrafficSource) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-sm font-extrabold text-foreground">{count.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 dark:bg-emerald-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { data: metricsResp } = useSWR<any>("/dashboard/metrics", swrFetcher);
  const { data: chartResp } = useSWR<any>("/dashboard/revenue-chart", swrFetcher);
  const { data: analyticsResp } = useSWR<AnalyticsData>("/dashboard/analytics", swrFetcher as any);

  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const stats = metricsResp || {};
  const detailed = analyticsResp || {};
  const chartData = chartResp || [];

  const METRICS = [
    {
      label: "Conversion Rate",
      value: detailed.conversionRate || "0%",
      badge: "Live",
      badgePositive: true,
      sub: `Based on ${detailed.sessionCount || 0} sessions`,
    },
    {
      label: "Avg. Order Value",
      value: `₦${detailed.avgOrderValue?.toLocaleString() || "0"}`,
      badge: "Real-time",
      badgePositive: true,
      sub: `Across ${detailed.totalOrders || 0} orders`,
    },
    {
      label: "Wallet Balance",
      value: `₦${stats.walletBalance?.toLocaleString() || "0"}`,
      badge: "Available",
      badgePositive: true,
      sub: "Net earnings after commissions",
    },
  ];

  const maxVal = Math.max(...chartData.map((d: any) => Number(d.amount) || 0), 1);

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Analytics &amp; Insights
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            Performance tracking for the Vendly ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.info("Downloading report...")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-border bg-background text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <Download size={15} />
            Download Report
          </button>
          {/* <Link
            href="/dashboard/analytics/live"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-green-700 hover:bg-green-800 text-white text-sm font-bold transition-colors shadow-md shadow-green-700/20"
          >
            <Activity size={15} />
            Real-time View
          </Link> */}
        </div>
      </div>

      {/* ── Metric Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {METRICS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue vs Expenses (2/3 width) */}
        <div className="lg:col-span-2 bg-card border border-border/40 rounded-[4px] p-6 shadow-minimal">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
            <h2 className="text-base font-extrabold text-foreground">Revenue vs. Expenses</h2>
            
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Legend */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-muted-foreground">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-200 dark:bg-green-900/60" />
                  <span className="text-xs font-semibold text-muted-foreground">Expenses</span>
                </div>
              </div>

              {/* Tab switcher Dropdown */}
              <div className="relative z-10">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 hover:bg-muted border border-border/50 rounded-[4px] text-xs font-extrabold capitalize text-foreground transition-colors shadow-sm"
                >
                  {activeTab} 
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border/50 shadow-lg rounded-[4px] py-1 z-50 overflow-hidden">
                    {(["weekly", "monthly", "yearly"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => { setActiveTab(t); setDropdownOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider transition-colors hover:bg-muted/50 ${activeTab === t ? 'text-green-600 dark:text-green-500 bg-success-bg dark:bg-green-900/10' : 'text-muted-foreground'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-2 px-2 h-[160px]">
            {chartData.length > 0 ? (
              chartData.map((d: any, i: number) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-end gap-[3px] h-[120px] w-full justify-center">
                    <div
                      className="w-[60%] rounded-t-[4px] bg-emerald-500 dark:bg-green-600 transition-all duration-700"
                      style={{ height: `${(d.amount / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              ))
            ) : (
              <div className="w-full flex items-center justify-center text-muted-foreground font-bold italic py-10">
                No revenue data available for the period.
              </div>
            )}
          </div>
        </div>

        {/* Top Categories (1/3 width) */}
        <div className="bg-card border border-border/40 rounded-[4px] p-6 shadow-minimal">
          <h2 className="text-base font-extrabold text-foreground mb-6">Top Categories</h2>
          <DonutChart categories={detailed.topCategories || []} />
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* AI Performance Insights */}
        <div className="bg-card border border-border/40 rounded-[4px] p-6 shadow-minimal relative overflow-hidden">
          {/* Sparkle decoration */}
          <div className="absolute top-5 right-5 text-green-400 opacity-60">
            <Sparkles size={22} />
          </div>

          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-extrabold text-foreground">AI Performance Insights</h2>
          </div>

          {/* AI Assisted Sales block */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[4px] bg-success-bg dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
              <Bot size={20} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground">AI Assistant Assisted Sales</p>
              <p className="text-xs text-muted-foreground font-medium">Last 30 days performance</p>
            </div>
          </div>

          <p className="text-4xl font-black text-foreground mb-2">{detailed.aiAssistedSales || 0}</p>
          <p className="text-sm text-muted-foreground font-medium mb-5">
            Total orders closed by AI Assistant. That&apos;s {Math.round(((detailed.aiAssistedSales || 0) / (detailed.totalOrders || 1)) * 100)}% of your total volume.
          </p>

          {/* Sub-stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 border border-border/40 rounded-[4px] p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={13} className="text-muted-foreground" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Time Saved
                </p>
              </div>
              <p className="text-xl font-black text-foreground">142 hrs</p>
            </div>
            <div className="bg-muted/30 border border-border/40 rounded-[4px] p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap size={13} className="text-muted-foreground" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Conv. Boost
                </p>
              </div>
              <p className="text-xl font-black text-green-600 dark:text-green-400">+18.4%</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-card border border-border/40 rounded-[4px] p-6 shadow-minimal">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-extrabold text-foreground">Traffic Sources</h2>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Session Source
            </span>
          </div>
          <div className="space-y-5">
            {TRAFFIC_SOURCES.map((src) => (
              <TrafficRow key={src.label} {...src} />
            ))}
          </div>

          {/* Trend footer */}
          <div className="mt-6 pt-5 border-t border-border/30 flex items-center gap-2">
            <TrendingUp size={14} className="text-green-600 dark:text-green-400 shrink-0" />
            <p className="text-xs font-semibold text-muted-foreground">
              Overall traffic is up{" "}
              <span className="text-green-600 dark:text-green-400 font-extrabold">+18%</span> vs.
              last month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

