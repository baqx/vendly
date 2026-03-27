"use client";

import { useState } from "react";
import {
  Bell,
  ShoppingCart,
  AlertTriangle,
  Wallet,
  MessageSquare,
  Settings2,
  Check,
  CheckCheck,
  Package,
  X,
  ChevronRight,
  RefreshCw,
  Inbox,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type NotificationCategory = "all" | "orders" | "alerts" | "messages";

interface Notification {
  id: string;
  type: "order" | "alert" | "payment" | "message" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actions?: { label: string; variant: "primary" | "secondary"; href?: string }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "New Order Received (#ORD-4921)",
    description:
      "Fresh Harvest Box x 2 and Organic Ginger x 5. Customer is requesting same-day delivery to Lagos Island.",
    time: "2m ago",
    read: false,
    actions: [
      { label: "Accept Order", variant: "primary", href: "/dashboard/orders" },
      { label: "Details", variant: "secondary", href: "/dashboard/orders" },
    ],
  },
  {
    id: "n2",
    type: "alert",
    title: "Inventory Alert: Palm Oil",
    description:
      "Your stock level for 'Refined Palm Oil (5L)' has dropped below 10 units. Current stock: 4.",
    time: "45m ago",
    read: false,
    actions: [
      { label: "Restock Now", variant: "primary", href: "/dashboard/inventory" },
    ],
  },
  {
    id: "n3",
    type: "payment",
    title: "Payment Payout Successful",
    description:
      "A payout of ₦245,000 has been successfully processed to your linked Zenith Bank account ending in *4291.",
    time: "1h ago",
    read: false,
    actions: [
      { label: "Download Receipt", variant: "secondary" },
    ],
  },
  {
    id: "n4",
    type: "message",
    title: "Message from Sarah O.",
    description:
      '"Hello! Is the Shea Butter back in stock? I\'d love to order 3 tubs for my salon."',
    time: "Yesterday",
    read: true,
    actions: [
      { label: "Reply", variant: "primary", href: "/dashboard/messages" },
    ],
  },
  {
    id: "n5",
    type: "system",
    title: "Scheduled Maintenance",
    description:
      "Vendly will undergo brief maintenance on Sunday, Oct 22, from 02:00 to 04:00 GMT.",
    time: "2 days ago",
    read: true,
    actions: [{ label: "More Details", variant: "secondary" }],
  },
];

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: Notification["type"] }) {
  const base = "w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0";
  switch (type) {
    case "order":
      return (
        <div className={`${base} bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400`}>
          <ShoppingCart size={20} />
        </div>
      );
    case "alert":
      return (
        <div className={`${base} bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400`}>
          <AlertTriangle size={20} />
        </div>
      );
    case "payment":
      return (
        <div className={`${base} bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400`}>
          <Wallet size={20} />
        </div>
      );
    case "message":
      return (
        <div className={`${base} bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400`}>
          <MessageSquare size={20} />
        </div>
      );
    case "system":
      return (
        <div className={`${base} bg-muted text-muted-foreground`}>
          <Settings2 size={20} />
        </div>
      );
  }
}

// ─── Category filter tabs ─────────────────────────────────────────────────────
const TABS: { id: NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "orders", label: "Orders" },
  { id: "alerts", label: "Alerts" },
  { id: "messages", label: "Messages" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const ordersCount = notifications.filter((n) => n.type === "order" && !n.read).length;
  const alertsCount = notifications.filter((n) => n.type === "alert" && !n.read).length;
  const messagesCount = notifications.filter((n) => n.type === "message" && !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "orders") return n.type === "order";
    if (activeTab === "alerts") return n.type === "alert";
    if (activeTab === "messages") return n.type === "message";
    return true;
  });

  // Split into recent (unread or <1 day) and earlier
  const recent = filtered.filter((n) =>
    !n.read || ["2m ago", "45m ago", "1h ago"].includes(n.time)
  );
  const earlier = filtered.filter(
    (n) => n.read && !["2m ago", "45m ago", "1h ago"].includes(n.time)
  );

  return (
    <div className="max-w-[860px] mx-auto pb-16 animate-in fade-in duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-foreground leading-none">
            Notifications
          </h1>
          <p className="text-muted-foreground font-medium mt-2 text-[15px]">
            You have{" "}
            <span className="text-green-600 dark:text-green-400 font-bold">
              {unreadCount} unread
            </span>{" "}
            updates today
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border border-border/60 bg-white dark:bg-card text-[14px] font-bold text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-minimal"
        >
          <CheckCheck size={16} />
          Mark all read
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "New Orders", count: ordersCount, icon: ShoppingCart, color: "text-green-700 dark:text-green-400" },
          { label: "Alerts", count: alertsCount, icon: AlertTriangle, color: "text-red-600 dark:text-red-400" },
          { label: "Messages", count: messagesCount, icon: MessageSquare, color: "text-blue-600 dark:text-blue-400" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-card border border-border/50 rounded-[4px] p-4 sm:p-5 shadow-minimal flex flex-col items-center text-center gap-1"
          >
            <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
              {card.label}
            </p>
            <p className={`text-3xl sm:text-4xl font-black ${card.color}`}>{card.count}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="bg-muted/30 dark:bg-card/60 border border-border/80 rounded-[4px] p-1.5 mb-6 flex gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-center px-4 py-2.5 rounded-[4px] font-bold text-[13px] transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white dark:bg-muted text-green-700 dark:text-green-400 shadow-sm border border-border/50"
                : "text-muted-foreground hover:bg-white/50 dark:hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Notifications list ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Inbox size={28} />
          </div>
          <p className="text-[18px] font-extrabold text-foreground">You&apos;re all caught up!</p>
          <p className="text-muted-foreground font-medium text-[14px] max-w-xs">
            New alerts will appear here as your shop grows and activities occur.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recent */}
          {recent.length > 0 && (
            <section>
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground mb-3 px-1">
                Recent
              </p>
              <div className="space-y-3">
                {recent.map((n) => (
                  <NotifCard
                    key={n.id}
                    notification={n}
                    onMarkRead={markRead}
                    onDismiss={dismiss}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Earlier */}
          {earlier.length > 0 && (
            <section>
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground mb-3 px-1">
                Earlier
              </p>
              <div className="space-y-3">
                {earlier.map((n) => (
                  <NotifCard
                    key={n.id}
                    notification={n}
                    onMarkRead={markRead}
                    onDismiss={dismiss}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── All caught up footer ── */}
      {filtered.length > 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 mt-4">
          <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
            <Bell size={22} />
          </div>
          <p className="text-[16px] font-extrabold text-foreground">You&apos;re all caught up!</p>
          <p className="text-[13px] font-medium text-muted-foreground max-w-xs">
            New alerts will appear here as your shop grows and activities occur.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────
function NotifCard({
  notification: n,
  onMarkRead,
  onDismiss,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const leftAccent = n.read
    ? "border-l-transparent"
    : n.type === "order"
    ? "border-l-green-500"
    : n.type === "alert"
    ? "border-l-red-500"
    : n.type === "payment"
    ? "border-l-emerald-500"
    : n.type === "message"
    ? "border-l-blue-500"
    : "border-l-border";

  return (
    <div
      className={`relative bg-white dark:bg-card border border-border/50 rounded-[4px] p-4 sm:p-5 shadow-minimal border-l-4 ${leftAccent} transition-all hover:shadow-sm group`}
    >
      {/* Top row */}
      <div className="flex items-start gap-4">
        <NotifIcon type={n.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[14px] font-extrabold text-foreground leading-tight">
                {n.title}
              </h3>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[12px] font-medium text-muted-foreground whitespace-nowrap">
                {n.time}
              </span>
              {!n.read && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  title="Mark as read"
                  className="ml-1 p-1 rounded-[4px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Check size={14} />
                </button>
              )}
              <button
                onClick={() => onDismiss(n.id)}
                title="Dismiss"
                className="p-1 rounded-[4px] text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <p className="text-[13px] font-medium text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {n.description}
          </p>
        </div>
      </div>

      {/* Actions */}
      {n.actions && n.actions.length > 0 && (
        <div className="flex items-center gap-2 mt-4 pl-14 flex-wrap">
          {n.actions.map((action) =>
            action.href ? (
              <Link
                key={action.label}
                href={action.href}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] text-[13px] font-bold transition-all ${
                  action.variant === "primary"
                    ? "bg-green-700 hover:bg-green-800 text-white"
                    : "bg-transparent border border-border/60 hover:bg-muted text-foreground"
                }`}
              >
                {action.label}
                {action.variant === "primary" && <ChevronRight size={13} />}
              </Link>
            ) : (
              <button
                key={action.label}
                onClick={() => {
                  if (action.label === "Download Receipt") {
                    alert("Receipt download will be available soon.");
                  } else if (action.label === "More Details") {
                    alert("No additional details at this time.");
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] text-[13px] font-bold transition-all ${
                  action.variant === "primary"
                    ? "bg-green-700 hover:bg-green-800 text-white"
                    : "bg-transparent border border-border/60 hover:bg-muted text-foreground"
                }`}
              >
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

