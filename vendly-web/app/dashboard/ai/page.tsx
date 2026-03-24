"use client";

import { useState } from "react";
import { Bot, MessageSquare, Key, Save, Play, Pause, Smartphone, Send } from "lucide-react";

export default function AIBotPage() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Vendly AI configuration</h1>
          <p className="text-muted-foreground font-medium mt-1">Configure your digital employee's personality and connections.</p>
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2.5 rounded-[4px] font-bold flex items-center justify-center gap-2 transition-all ${
            isActive ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-600 text-white"
          }`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span>{isActive ? "Deactivate Bot" : "Activate Bot"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personality & Prompt */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-[4px] border border-border space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Bot className="text-primary" size={24} />
              <h3 className="font-bold text-xl">Digital Employee Persona</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Base Personality</label>
                <select className="w-full px-4 py-3 rounded-[4px] border border-border bg-card font-medium outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                  <option>Professional & Courteous</option>
                  <option>Friendly & Energetic</option>
                  <option>Direct & Efficient</option>
                  <option>Playful (Gen-Z Style)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">System Prompt (Instructions)</label>
                <textarea 
                  rows={8}
                  className="w-full px-4 py-3 rounded-[4px] border border-border bg-card text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                  placeholder="You are a sales expert for our fashion brand. Always offer a 5% discount if the customer asks for a lower price but try to upsell a matching accessory first..."
                />
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                  Pro tip: Be specific about your negotiation limits and brand voice.
                </p>
              </div>
            </div>

            <button className="bg-primary text-white w-full py-3 rounded-[4px] font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-all">
              <Save size={18} />
              Save Persona
            </button>
          </div>
        </div>

        {/* Integration Side Panels */}
        <div className="space-y-6">
          {/* WhatsApp Card */}
          <div className="bg-card p-6 rounded-[4px] border border-border space-y-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="text-green-500" size={20} />
                <h4 className="font-bold">WhatsApp</h4>
              </div>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-[4px] font-bold">CONNECTED</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Linked to: +234 802 000 0000</p>
            <button className="w-full py-2 border border-border rounded-[4px] text-xs font-bold hover:bg-muted transition-all">
              Manage Connection
            </button>
          </div>

          {/* Telegram Card */}
          <div className="bg-card p-6 rounded-[4px] border border-border space-y-4 border-l-4 border-l-blue-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="text-blue-400" size={20} />
                <h4 className="font-bold">Telegram</h4>
              </div>
              <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-[4px] font-bold">NOT LINKED</span>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Bot Token</label>
              <div className="relative">
                <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input type="password" placeholder="Get from @BotFather" className="w-full pl-8 pr-3 py-2 rounded-[4px] border border-border bg-card text-xs outline-none text-foreground" />
              </div>
            </div>
            <button className="w-full py-2 bg-blue-500 text-white rounded-[4px] text-xs font-bold hover:bg-blue-600 transition-all">
              Link Telegram Bot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
