"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/swr";
import { apiJson } from "@/lib/api";
import { 
  Bot, 
  Smartphone, 
  Send,
  User,
  Loader2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export default function AIBotPage() {
  const { data: vendorData } = useSWR<any>("/vendors/me", swrFetcher);
  const vendor = vendorData?.data;

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: "Hello! I am your AI sales assistant. Try asking me a question about your products or store to see how I respond to customers." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const payload = {
        role: "CUSTOMER",
        content: userMsg.text,
        timestamp: new Date().toISOString()
      };
      const result = await apiJson("/ai/chat", "POST", payload);
      
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: (result as any).data?.response || "I couldn't generate a response."
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (e: any) {
      toast.error("AI service error");
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "ai", text: "Error: Could not reach the AI service." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { id: Date.now().toString(), role: "ai", text: "Chat history cleared. How can I help you test my responses today?" }
    ]);
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">AI Testing Sandbox</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Simulate customer interactions with your trained digital employee.
          </p>
        </div>
        <Link 
          href="/dashboard/settings"
          className="px-5 py-2.5 rounded-[4px] bg-card border border-border text-foreground text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-muted"
        >
          <Bot size={16} />
          Edit Bot Persona
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ── Chat Interface ── */}
        <div className="lg:col-span-2 bg-[#F8F9FF] dark:bg-card border border-border/50 rounded-[4px] shadow-none flex flex-col h-[600px] overflow-hidden">
          
          <div className="bg-card border-b border-border/40 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[4px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-500 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground">Verdant AI Simulator</h3>
                <p className="text-[10px] uppercase tracking-widest text-green-600 dark:text-green-500 font-extrabold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-[4px] bg-green-500 animate-pulse" /> Live Testing
                </p>
              </div>
            </div>
            <button 
              onClick={clearChat}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-[4px] hover:bg-muted flex items-center justify-center"
              title="Reset Sandbox"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end ml-auto" : "items-start"} max-w-[75%]`}>
                {msg.role === "ai" ? (
                  <div className="text-[10px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest flex items-center gap-1.5 pr-1 mb-1">
                    Verdant AI <Bot size={12} />
                  </div>
                ) : (
                  <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 pr-1 mb-1">
                    You (Customer) <User size={12} />
                  </div>
                )}
                <div className={`px-5 py-4 rounded-[4px] text-sm font-medium leading-relaxed shadow-minimal whitespace-pre-wrap ${
                  msg.role === "user" 
                    ? "bg-foreground text-background" 
                    : "bg-white dark:bg-muted border border-border/50 text-foreground"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
             <div className="flex flex-col items-start max-w-[70%]">
               <div className="text-[10px] font-extrabold text-green-700 dark:text-green-500 uppercase tracking-widest flex items-center gap-1.5 pr-1 mb-1">
                 Verdant AI <Bot size={12} />
               </div>
               <div className="bg-white dark:bg-muted border border-border/50 rounded-[4px] px-5 py-4 text-xs italic text-muted-foreground font-semibold flex items-center gap-3">
                 <Loader2 size={14} className="animate-spin text-green-700" />
                 Analyzing intent and drafting reply...
               </div>
             </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-card border-t border-border/40 shrink-0">
            <div className="flex items-center gap-3 bg-background rounded-[4px] border border-border/50 px-4 py-3 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message as a customer..."
                className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 bg-green-700 hover:bg-green-800 text-white rounded-[4px] flex items-center justify-center transition-all shadow-md shadow-green-700/20 active:scale-95 disabled:opacity-50 shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* ── Integrations ── */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-[4px] border border-border/50 shadow-none space-y-5 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-green-50 text-green-600 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">WhatsApp</h4>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">Primary Channel</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground">Status</span>
                <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-500 px-2.5 py-1 rounded-[4px] font-extrabold uppercase tracking-widest">
                  Live
                </span>
              </div>
              <p className="text-sm font-black text-foreground">{vendor?.phone || "Linking required"}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-[4px] border border-border/50 shadow-none space-y-5 border-l-4 border-l-blue-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Send size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">Telegram</h4>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">Secondary Channel</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground">Status</span>
                {vendor?.telegramBotToken ? (
                   <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-500 px-2.5 py-1 rounded-[4px] font-extrabold uppercase tracking-widest">
                    Live
                  </span>
                ) : (
                  <span className="text-[10px] bg-muted text-muted-foreground px-2.5 py-1 rounded-[4px] font-extrabold uppercase tracking-widest">
                    Not Linked
                  </span>
                )}
              </div>
              {vendor?.telegramBotToken ? (
                <p className="text-sm font-black text-foreground truncate">{vendor.telegramBotToken.substring(0, 16)}...</p>
              ) : (
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  Link your Telegram bot token in settings to enable this channel.
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-muted/30 border border-border/50 rounded-[4px] p-5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-foreground flex items-center gap-2 mb-2">
              <Bot size={14} /> Bot Personality
            </h4>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Your AI responds based on the personality and system prompt configured in your settings. 
              Changing those values immediately updates how the bot interacts in this sandbox and live channels.
            </p>
            <Link href="/dashboard/settings" className="mt-4 flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors group">
              Update Configuration <ExternalLink size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
