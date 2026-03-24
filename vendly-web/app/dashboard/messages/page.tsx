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
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type MessageStatus = "AI Active" | "Human Needed" | "Resolved";

interface Conversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  status: MessageStatus;
  avatar: string;
  location: string;
  lifetimeValue: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  sender: "customer" | "ai" | "human";
  text: string;
  time: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const CONVERSATIONS: Conversation[] = [
  {
    id: "m1",
    name: "Adama Traoré",
    preview: "Can I pay for the organic fertilizers via mobile...",
    time: "10:42 AM",
    status: "AI Active",
    avatar: "AT",
    location: "Abuja, Nigeria",
    lifetimeValue: "₦142,500.00",
    messages: [
      { id: "1", sender: "customer", text: "Hello, I'm interested in the Organic Fertilizer (25kg). Is it available in stock for Abuja delivery?", time: "10:40 AM" },
      { id: "2", sender: "ai", text: "Yes, Adama! We have 45 bags of Organic Fertilizer in stock. Delivery to Abuja typically takes 24-48 hours. Would you like me to calculate the shipping cost for you?", time: "10:41 AM" },
      { id: "3", sender: "customer", text: "Yes, please. Also, can I pay via mobile money on arrival?", time: "10:42 AM" },
    ],
  },
  {
    id: "m2",
    name: "Fatima Bello",
    preview: "The last batch of seeds didn't sprout. I'd like a ...",
    time: "09:15 AM",
    status: "Human Needed",
    avatar: "FB",
    location: "Kano, Nigeria",
    lifetimeValue: "₦85,000.00",
    messages: [
      { id: "1", sender: "customer", text: "Hi, I bought seeds last week and none of them sprouted. I need a refund.", time: "09:10 AM" },
      { id: "2", sender: "ai", text: "I'm so sorry to hear that, Fatima. Let me check your recent order.", time: "09:11 AM" },
      { id: "3", sender: "customer", text: "The last batch of seeds didn't sprout. I'd like a replacement or a full refund.", time: "09:15 AM" },
    ],
  },
  {
    id: "m3",
    name: "John Okafor",
    preview: "Thank you! The delivery was very fast. Great ...",
    time: "Yesterday",
    status: "Resolved",
    avatar: "JO",
    location: "Lagos, Nigeria",
    lifetimeValue: "₦220,000.00",
    messages: [
      { id: "1", sender: "customer", text: "I just received my order. Thank you! The delivery was very fast.", time: "Yesterday" },
      { id: "2", sender: "ai", text: "Wonderful! We're so glad your order arrived on time, John. Thank you for shopping with us!", time: "Yesterday" },
      { id: "3", sender: "customer", text: "Great service, will definitely order again.", time: "Yesterday" },
    ],
  },
];

const STATUS_STYLES: Record<MessageStatus, { pill: string; dot: string; label: string }> = {
  "AI Active":     { pill: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400", dot: "bg-green-500", label: "AI Active" },
  "Human Needed":  { pill: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400", dot: "bg-red-500", label: "Human Needed" },
  "Resolved":      { pill: "bg-muted text-muted-foreground", dot: "bg-muted-foreground", label: "Resolved" },
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(
    Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c.messages]))
  );
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isTakenOver, setIsTakenOver] = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = CONVERSATIONS.find((c) => c.id === selectedId) || CONVERSATIONS[0];
  const currentMessages = messages[selectedId] || [];
  const takenOver = isTakenOver[selectedId] || false;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setInput("");
    setIsAiTyping(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isAiTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: takenOver ? "human" : "customer",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), newMsg] }));
    setInput("");

    // Simulate AI reply if not taken over
    if (!takenOver) {
      setIsAiTyping(true);
      setTimeout(() => {
        const aiReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Thank you for your message! Let me look into that for you right away.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), aiReply] }));
        setIsAiTyping(false);
      }, 1800);
    }
  };

  const handleTakeOver = () => {
    setIsTakenOver((prev) => ({ ...prev, [selectedId]: !prev[selectedId] }));
    toast.success(
      takenOver ? "AI resumed for this conversation" : `You've taken over this conversation`
    );
  };

  return (
    // Messages page uses a full-height 3-column layout; we escape the parent padding
    <div className="flex h-[calc(100vh-72px)] -m-6 lg:-m-8 overflow-hidden rounded-[4px] border border-border/30">

      {/* ── Column 1: Inbox List ── */}
      <div className="w-[280px] lg:w-[300px] shrink-0 border-r border-border/40 bg-card flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <h2 className="text-base font-black text-foreground">Inbox</h2>
          <span className="bg-green-700 text-white text-[10px] font-black px-2.5 py-1 rounded-[4px] tracking-wide">
            12 New
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((conv) => {
            const s = STATUS_STYLES[conv.status];
            const isActive = selectedId === conv.id;
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
                  <span className="text-sm font-extrabold text-foreground">{conv.name}</span>
                  <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-2">{conv.time}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-2 line-clamp-1">{conv.preview}</p>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-[4px] uppercase tracking-widest ${s.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-[4px] shrink-0 ${s.dot}`} />
                  {conv.status === "Resolved" ? (
                    <><CircleCheck size={10} /> {s.label}</>
                  ) : s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Column 2: Chat View ── */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 lg:p-5 border-b border-border/30 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300 font-black text-sm flex items-center justify-center shrink-0">
              {selected.avatar}
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground leading-tight">{selected.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-[8px] shrink-0 ${STATUS_STYLES[selected.status].dot}`} />
                <span className="text-[10px] font-bold text-muted-foreground">
                  {takenOver ? "Human Active" : selected.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleTakeOver}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-sm font-extrabold transition-all shadow-none active:scale-95 ${
              takenOver
                ? "bg-muted text-foreground border border-border"
                : "bg-green-700 hover:bg-green-800 text-white shadow-green-700/20"
            }`}
          >
            {takenOver ? <Bot size={16} /> : <User size={16} />}
            {takenOver ? "Restore AI" : "Take Over Manually"}
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5">
          {currentMessages.map((msg) => {
            if (msg.sender === "customer") {
              return (
                <div key={msg.id} className="flex flex-col items-start gap-1 max-w-[70%]">
                  <div className="bg-card border border-border/50 rounded-[8px] px-5 py-4 text-sm font-medium text-foreground shadow-minimal leading-relaxed">
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium px-1">{msg.time}</span>
                </div>
              );
            }
            if (msg.sender === "ai") {
              return (
                <div key={msg.id} className="flex flex-col items-end gap-1 ml-auto max-w-[70%]">
                  <div className="text-[10px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest flex items-center gap-1.5 pr-1">
                    Verdant AI <Bot size={12} />
                  </div>
                  <div className="bg-green-700 text-white rounded-3xl rounded-tr-lg px-5 py-4 text-sm font-medium leading-relaxed shadow-md shadow-green-700/20">
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium px-1">{msg.time}</span>
                </div>
              );
            }
            // human
            return (
              <div key={msg.id} className="flex flex-col items-end gap-1 ml-auto max-w-[70%]">
                <div className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 pr-1">
                  You <User size={12} />
                </div>
                <div className="bg-blue-600 text-white rounded-3xl rounded-tr-lg px-5 py-4 text-sm font-medium leading-relaxed">
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium px-1">{msg.time}</span>
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAiTyping && (
            <div className="flex flex-col items-end gap-1 ml-auto max-w-[70%]">
              <div className="text-[10px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest flex items-center gap-1.5 pr-1">
                Verdant AI <Bot size={12} />
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl px-5 py-3 text-xs italic text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" />
                AI is drafting a reply...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 lg:p-5 border-t border-border/30 bg-card shrink-0">
          <div className="flex items-center gap-3 bg-muted/40 rounded-2xl border border-border/50 px-4 py-3 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
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
              className="w-9 h-9 bg-green-700 hover:bg-green-800 text-white rounded-[8px] flex items-center justify-center transition-all shadow-md shadow-green-700/20 active:scale-95 disabled:opacity-50 shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Column 3: AI Performance & Customer Info ── */}
      <div className="w-[260px] lg:w-[280px] shrink-0 border-l border-border/40 bg-card flex flex-col overflow-y-auto">
        
        {/* AI Performance */}
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-green-600 dark:text-green-500" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">AI Performance</h3>
          </div>

          <div className="space-y-4">
            <PerfCard label="Avg. Response Time" value="1.2s" trend="↓ 40%" positive />
            <PerfCard label="Conversion Rate" value="24.8%" trend="↑ 5.2%" positive />
            <div className="bg-muted/20 border border-border/50 rounded-2xl p-4">
              <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest mb-2">AI Autonomy</p>
              <p className="text-3xl font-black text-foreground mb-2">92%</p>
              <div className="w-full h-1.5 bg-muted rounded-[8px] overflow-hidden mb-2">
                <div className="h-full bg-green-600 rounded-[8px]" style={{ width: "92%" }} />
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
              <div className="w-8 h-8 rounded-[8px] bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold">Location</p>
                <p className="text-sm font-extrabold text-foreground">{selected.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                <Wallet size={14} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold">Lifetime Value</p>
                <p className="text-sm font-extrabold text-foreground">{selected.lifetimeValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 space-y-3">
          <button
            onClick={() => toast.info("Opening order history...")}
            className="w-full py-3 rounded-[8px] bg-muted/40 hover:bg-muted border border-border/50 text-sm font-bold text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} />
            View Order History
          </button>
          <button
            onClick={() => toast.info("Add Customer Tag")}
            className="w-full py-3 rounded-[8px] bg-muted/40 hover:bg-muted border border-border/50 text-sm font-bold text-foreground transition-colors flex items-center justify-center gap-2"
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
    <div className="bg-muted/20 border border-border/50 rounded-2xl p-4">
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
