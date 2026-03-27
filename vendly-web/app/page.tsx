import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  Shield, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  Lock as LucideLock 
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors selection:bg-primary/20">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <Image 
            src="/images/logo.png" 
            alt="Vendly Logo" 
            width={40} 
            height={40} 
            className="group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-black tracking-tighter text-foreground">Vendly</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-muted-foreground font-nunito">
            <Link href="#features" className="hover:text-primary transition-colors">Platform</Link>
            <Link href="#solutions" className="hover:text-primary transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </div>
          <div className="h-4 w-px bg-border hidden md:block" />
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary text-white px-5 py-2.5 rounded-[8px] text-sm font-bold hover:bg-secondary transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col pt-12 md:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-8 w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col items-center space-y-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-foreground">
              Hire an <span className="text-primary italic relative">AI Employee<span className="absolute bottom-2 left-0 w-full h-2 bg-primary/10 -z-10" /></span> for your business.
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
              Vendly automates your sales on WhatsApp and Telegram. Smart negotiation, 
              frictionless payments, and real-time inventory management.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link 
                href="/signup" 
                className="bg-primary text-white px-10 py-5 rounded-[8px] text-lg font-bold hover:bg-secondary transition-all flex items-center justify-center gap-3 group active:scale-95"
              >
                Start Transacting 
                <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-col items-center gap-6 pt-12">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-[8px] border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/40?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Trusted by <span className="text-foreground">500+</span> Merchants
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition / Digital Employee Section */}
        <section id="features" className="py-24 bg-card/30 border-y border-border/40 mt-20 transition-colors">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                  The workforce of the <span className="text-primary italic">next decade</span>.
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Stop managing chats manually. Deploy an AI employee that understands your products, 
                  negotiates like an expert, and never takes a day off.
                </p>
              </div>
              <Link href="/onboarding" className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-primary/20 pb-1">
                Explore the platform <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 rounded-[8px] overflow-hidden border border-border/40 transition-all">
              <div className="bg-card p-10 space-y-8 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary">
                  <Bot size={26} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">Autonomous Sales</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Our proprietary negotiation engine handles haggling, product inquiries, and upselling automatically.
                  </p>
                </div>
              </div>
              
              <div className="bg-card p-10 space-y-8 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-[8px] bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Zap size={26} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">Instant Checkout</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Direct integration with Interswitch allows customers to pay inside the chat without ever leaving.
                  </p>
                </div>
              </div>

              <div className="bg-card p-10 space-y-8 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-[8px] bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <BarChart3 size={26} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">Global Inventory</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Sync your stock across WhatsApp, Telegram, and Web in real-time. No more overselling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-8 text-center bg-background">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Ready to scale your commerce?</h2>
            <p className="text-xl text-muted-foreground font-medium">Join 500+ merchants who have automated their sales funnel with Vendly.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/onboarding" 
                className="bg-primary textbg-white dark:bg-card p-8 rounded-[8px] border border-border/50 shadow-minimal flex flex-col items-start text-left transition-all hover:bg-muted/5 groupll sm:w-auto text-center"
              >
                Launch your Bot
              </Link>
              <button className="px-10 py-5 rounded-[8px] text-lg font-bold border border-border hover:bg-muted transition-all w-full sm:w-auto">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-border px-8 bg-card/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
              <span className="text-xl font-black tracking-tight">Vendly</span>
            </div>
            <p className="text-muted-foreground font-medium max-w-sm">
              We're building the infrastructure for the next generation of social commerce. Digital employees for everyone.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Product</h4>
            <ul className="space-y-2 text-sm font-bold text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Negotiation Engine</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Developer API</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Company</h4>
            <ul className="space-y-2 text-sm font-bold text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            © 2026 Vendly AI Labs. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 grayscale opacity-50">
            <Shield size={20} />
            <Zap size={20} />
            <LucideLock size={20} />
          </div>
        </div>
      </footer>
    </div>
  );
}
