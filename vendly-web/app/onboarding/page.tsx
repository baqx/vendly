"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Bot, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Smartphone, 
  Send,
  Sparkles,
  Rocket
} from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "My Awesome Store",
    category: "Fashion",
    location: "Lagos, Nigeria",
    botPersonality: "Professional & Courteous",
    systemPrompt: "",
    telegramToken: "",
    whatsappToken: ""
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFinish = () => {
    // In a real app, we'd save to backend here
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar Placeholder */}
      <nav className="px-6 py-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-[8px] flex items-center justify-center text-white font-black text-xl">V</div>
          <span className="font-black text-xl tracking-tight text-primary">Vendly</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Step {step} of 4
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 flex flex-col">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted rounded-[8px] mb-12 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-2 border border-primary/20">
                   <Store size={14} />
                   <span>Phase 1: Identity</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Tell us about your Store</h1>
                <p className="text-muted-foreground font-medium">This helps your AI employee understand it's workplace.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Store Name</label>
                  <input 
                    type="text" 
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    className="w-full px-4 py-4 rounded-[8px] border border-border bg-card font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                    placeholder="Enter store name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Niche/Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-4 rounded-[8px] border border-border bg-card font-medium outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                    >
                      <option>Fashion</option>
                      <option>Electronics</option>
                      <option>Beauty & Health</option>
                      <option>Home & Decor</option>
                      <option>Food & Grocery</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Location</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-4 rounded-[8px] border border-border bg-card font-medium outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. Lagos, Nigeria"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-2 border border-primary/20">
                   <Bot size={14} />
                   <span>Phase 2: Personality</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Design your AI Employee</h1>
                <p className="text-muted-foreground font-medium">What is your bot's vibe? How should it handle customers?</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                  {["Professional", "Friendly", "Direct", "Gen-Z"].map((p) => (
                    <button 
                      key={p}
                      onClick={() => setFormData({...formData, botPersonality: p})}
                      className={`p-4 rounded-[8px] border-2 transition-all text-left space-y-1 ${
                        formData.botPersonality === p 
                        ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                        : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <h4 className="font-bold">{p}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">Default {p.toLowerCase()} voice.</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Custom Instructions (Optional)</label>
                  <textarea 
                    rows={4}
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
                    className="w-full px-4 py-4 rounded-[8px] border border-border bg-card font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="e.g. Always speak Yoruba, or offer 10% off for first-time buyers..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-2 border border-primary/20">
                   <Zap size={14} />
                   <span>Phase 3: Integration</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Connect your Channels</h1>
                <p className="text-muted-foreground font-medium">Link your bot to where your customers are.</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-[8px] border border-border bg-card space-y-4 group hover:border-blue-400 transition-all shadow-minimal">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="text-blue-500" size={20} />
                      <h3 className="font-bold text-lg">Telegram Bot</h3>
                    </div>
                    <CheckCircle2 className="text-muted-foreground group-hover:text-blue-400 transition-all" size={20} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Bot Token</label>
                    <input 
                      type="password"
                      value={formData.telegramToken}
                      onChange={(e) => setFormData({...formData, telegramToken: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-[8px] border border-border bg-background text-sm font-medium outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="Enter token from @BotFather"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-[8px] border border-border bg-card space-y-4 opacity-70 group cursor-not-allowed grayscale">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="text-green-500" size={20} />
                      <h3 className="font-bold text-lg">WhatsApp API</h3>
                    </div>
                    <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded-[8px]">COMING SOON</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium italic">WhatsApp integration is currently in beta. You can link it later in settings.</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 py-10 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-[8px] flex items-center justify-center text-primary animate-bounce">
                  <Rocket size={40} />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight">All systems go!</h1>
                <p className="text-muted-foreground font-medium text-lg">Your AI employee is ready to start selling for {formData.storeName}.</p>
              </div>

              <div className="bg-card p-6 rounded-[8px] border border-border text-left space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Onboarding Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Personality</p>
                    <p className="font-bold">{formData.botPersonality}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Channel</p>
                    <p className="font-bold">{formData.telegramToken ? "Telegram" : "Self-test only"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-border">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-all pr-4 py-2"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-[8px] font-bold flex items-center gap-2 transition-all active:scale-95 translate-y-0 hover:-translate-y-1"
            >
              Next Step
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="bg-primary hover:bg-secondary text-white px-10 py-4 rounded-[8px] font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              Launch Dashboard
              <Sparkles size={20} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
