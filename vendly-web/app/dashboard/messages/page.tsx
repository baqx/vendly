"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Smile,
  Send,
  TrendingUp,
  TrendingDown,
  MapPin,
  Wallet,
  ShoppingBag,
  Tag,
  Bot,
  User,
  CircleCheck,
  Loader2,
  ChevronLeft,
  Info
} from "lucide-react";

import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiJson } from "@/lib/api";

type MessageStatus = "AI Active" | "Human Needed" | "Resolved";

const STATUS_STYLES: Record<MessageStatus, { pill: string; dot: string; label: string }> = {
  "AI Active":     { pill: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400", dot: "bg-green-500", label: "AI Active" },
  "Human Needed":  { pill: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", dot: "bg-amber-500", label: "Human Needed" },
  "Resolved":      { pill: "bg-muted text-muted-foreground", dot: "bg-muted-foreground", label: "Resolved" },
};

function getSessionStatus(session: any): MessageStatus {
  if (!session.active) return "Resolved";
  if (session.humanTakeover) return "Human Needed";
  return "AI Active";
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { data: chats, mutate, isLoading } = useSWR("/chats", swrFetcher, { refreshInterval: 5000 });
  const conversations = chats || [];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [mobileView, setMobileView] = useState<"inbox" | "chat" | "info">("inbox");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  const selected = conversations.find((c: any) => c.id === selectedId) || null;
  const currentMessages = selected?.messages || [];
  const takenOver = selected?.humanTakeover || false;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setInput("");
    setMobileView("chat");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    toast.error("Dashboard messaging is not yet implemented. Please reply directly via WhatsApp/Telegram.");
    setInput("");
  };

  const handleTakeOver = async () => {
    if (!selected) return;
    try {
      const isTakingOver = !takenOver;
      await apiJson(`/chats/${selected.id}/takeover?takeover=${isTakingOver}`, "PATCH");
      await mutate();
      toast.success(
        isTakingOver ? "You've taken over this conversation." : "AI resumed for this conversation."
      );
    } catch (e) {
      toast.error("Takeover action failed");
    }
  };

  return (
    // Messages page uses a full-height 3-column layout; we escape the parent padding
    <div className="flex h-[calc(100vh-72px)] -m-6 lg:-m-8 overflow-hidden rounded-[4px] border border-border/30">

      {/* ── Column 1: Inbox List ── */}
      <div className={`shrink-0 border-r border-border/40 bg-card flex-col lg:flex lg:w-[300px] ${mobileView === "inbox" ? "flex w-full" : "hidden"}`}>
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <h2 className="text-base font-black text-foreground">Inbox</h2>
          {conversations.length > 0 && (
            <span className="bg-green-700 text-white text-[10px] font-black px-2.5 py-1 rounded-[4px] tracking-wide">
              {conversations.length} Active
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-green-700" /></div>
          ) : (
            conversations.map((conv: any) => {
              const status = getSessionStatus(conv);
              const s = STATUS_STYLES[status];
              const isActive = selectedId === conv.id;
              const name = conv.customerName || conv.customerIdentifier || "Anonymous";
              
              let preview = "No messages";
              let time = "";
              if (conv.messages?.length > 0) {
                const lastMsg = conv.messages[conv.messages.length - 1];
                preview = lastMsg.content;
                time = new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  className={`w-full text-left p-4 border-b border-border/20 transition-colors ${
                    isActive
                      ? "bg-green-50 dark:bg-green-900/10 border-l-[3px] border-l-green-600"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-extrabold text-foreground truncate pl-1">{name}</span>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-2">{time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mb-2 line-clamp-1 pl-1">{preview}</p>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-[4px] uppercase tracking-widest ${s.pill} mx-1`}>
                    <span className={`w-1.5 h-1.5 rounded-[4px] shrink-0 ${s.dot}`} />
                    {status === "Resolved" ? (
                      <><CircleCheck size={10} /> {s.label}</>
                    ) : s.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Column 2: Chat View ── */}
      <div className={`flex-1 flex-col bg-background min-w-0 lg:flex ${mobileView === "chat" ? "flex" : "hidden"}`}>
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 lg:p-5 border-b border-border/30 bg-card shrink-0">
          {selected && (
            <div className="flex items-center gap-3">
              <button 
                className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground" 
                onClick={() => setMobileView("inbox")}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="w-10 h-10 rounded-[4px] bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300 font-black text-sm flex items-center justify-center shrink-0 uppercase">
                {(selected.customerName || selected.customerIdentifier || "A").substring(0, 2)}
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground leading-tight">{selected.customerName || selected.customerIdentifier}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-[4px]">
                    {selected.channel}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTakeOver}
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-sm font-extrabold transition-all shadow-none active:scale-95 ${
                takenOver
                  ? "bg-muted text-foreground border border-border"
                  : "bg-green-700 hover:bg-green-800 text-white shadow-green-700/20"
              }`}
            >
              {takenOver ? <Bot size={16} /> : <User size={16} />}
              {takenOver ? "Restore AI" : "Take Over"}
            </button>
            <button 
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground" 
              onClick={() => setMobileView("info")}
            >
              <Info size={20} />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5">
          {currentMessages.map((msg: any) => {
            const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (msg.role === "CUSTOMER") {
              return (
                <div key={msg.id} className="flex flex-col items-start gap-1 max-w-[70%]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-1 mb-0.5">Customer</span>
                  <div className="bg-card border border-border/50 rounded-[4px] px-5 py-4 text-sm font-medium text-foreground shadow-minimal leading-relaxed">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium px-1 mt-0.5">{time}</span>
                </div>
              );
            }
            if (msg.role === "BOT") {
              return (
                <div key={msg.id} className="flex flex-col items-end gap-1 ml-auto max-w-[70%]">
                  <div className="text-[10px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest flex items-center gap-1.5 pr-1">
                    Verdant AI <Bot size={12} />
                  </div>
                  <div className="bg-green-700 text-white rounded-[4px] rounded-tr-[4px] px-5 py-4 text-sm font-medium leading-relaxed shadow-md shadow-green-700/20">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium px-1 mt-0.5">{time}</span>
                </div>
              );
            }
            // human (VENDOR)
            return (
              <div key={msg.id} className="flex flex-col items-end gap-1 ml-auto max-w-[70%]">
                <div className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 pr-1">
                  You <User size={12} />
                </div>
                <div className="bg-blue-600 text-white rounded-[4px] rounded-tr-[4px] px-5 py-4 text-sm font-medium leading-relaxed">
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium px-1 mt-0.5">{time}</span>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 lg:p-5 border-t border-border/30 bg-card shrink-0">
          <div className="flex items-center gap-3 bg-muted/40 rounded-[4px] border border-border/50 px-4 py-3 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
            <button
              onClick={() => toast.info("Attachment picker")}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Plus size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={takenOver ? "Type a message..." : "Type a message or use / for AI commands"}
              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => toast.info("Emoji picker")}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Smile size={20} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 bg-green-700 hover:bg-green-800 text-white rounded-[4px] flex items-center justify-center transition-all shadow-md shadow-green-700/20 active:scale-95 disabled:opacity-50 shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Column 3: AI Performance & Customer Info ── */}
      <div className={`shrink-0 border-l border-border/40 bg-card flex-col overflow-y-auto lg:flex lg:w-[280px] ${mobileView === "info" ? "flex w-full" : "hidden"}`}>
        
        {/* AI Performance */}
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center gap-2 mb-4">
            <button 
              className="lg:hidden p-1 -ml-2 text-muted-foreground hover:text-foreground" 
              onClick={() => setMobileView("chat")}
            >
              <ChevronLeft size={16} />
            </button>
            <TrendingUp size={14} className="text-green-600 dark:text-green-500" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">AI Performance</h3>
          </div>

          <div className="space-y-4">
            <PerfCard label="Avg. Response Time" value="1.2s" trend="↓ 40%" positive />
            <PerfCard label="Conversion Rate" value="24.8%" trend="↑ 5.2%" positive />
            <div className="bg-muted/20 border border-border/50 rounded-[4px] p-4">
              <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest mb-2">AI Autonomy</p>
              <p className="text-3xl font-black text-foreground mb-2">92%</p>
              <div className="w-full h-1.5 bg-muted rounded-[4px] overflow-hidden mb-2">
                <div className="h-full bg-green-600 rounded-[4px]" style={{ width: "92%" }} />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground leading-snug">
                92% of queries resolved without human intervention.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-5 border-b border-border/30">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-4">
            Customer Info
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8pxipip] bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold">Interaction Value</p>
                <p className="text-sm font-extrabold text-foreground">Tracked via Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 space-y-3">
          <button
            onClick={() => toast.info("Opening order history...")}
            className="w-full py-3 rounded-[4px] bg-muted/40 hover:bg-muted border border-border/50 text-sm font-bold text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} />
            View Order History
          </button>
          <button
            onClick={() => toast.info("Add Customer Tag")}
            className="w-full py-3 rounded-[4px] bg-muted/40 hover:bg-muted border border-border/50 text-sm font-bold text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <Tag size={15} />
            Add Customer Tag
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for AI Performance metrics
function PerfCard({ label, value, trend, positive }: { label: string; value: string; trend: string; positive: boolean }) {
  return (
    <div className="bg-muted/20 border border-border/50 rounded-[4px] p-4">
      <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-black text-foreground">{value}</p>
        <span className={`text-xs font-extrabold ${positive ? "text-green-600 dark:text-green-500" : "text-red-500"}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
