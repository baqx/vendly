"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Mail, 
  MapPin, 
  Phone, 
  Bot,
  Package,
  TrendingUp,
  CreditCard,
  Clock,
  Plus
} from "lucide-react";

// Mock Data targeting the "Amara Okafor" profile from the design mockup
const MOCK_PROFILE = {
  id: "c1",
  name: "Amara Okafor",
  memberSince: "October 2022",
  email: "amara.o@lifestyle.ng",
  phone: "+234 803 123 4567",
  address: "42 Banana Island Road, Ikoyi, Lagos, Nigeria",
  avatar: "/images/avatar1.png",
  status: "VIP",
  metrics: {
    totalSpent: "₦1.24M",
    spentTrend: "Top 1% of vendors",
    totalOrders: "58",
    ordersAvg: "Avg. 2.4 orders / month",
    avgOrderValue: "₦21,400",
    aovStatus: "Consistent high-tier",
    lastPurchase: "2d ago",
    activeStatus: "Active engagement"
  },
  aiSummary: {
    chats: 42,
    snippet: '"Frequently asks about restocks on Organic Shea Butter and delivery timelines to Ikoyi."'
  },
  orderHistory: [
    { id: "VL-90284", items: 3, date: "14 May, 2024", total: "₦45,200", status: "DELIVERED" },
    { id: "VL-89421", items: 1, date: "28 April, 2024", total: "₦12,500", status: "DELIVERED" },
    { id: "VL-88102", items: 5, date: "02 April, 2024", total: "₦89,000", status: "DELIVERED" }
  ],
  preferences: [
    { name: "Organic Skincare", pct: 65 },
    { name: "Hair Wellness", pct: 25 },
    { name: "Lifestyle Accessories", pct: 10 }
  ]
};

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const profile = MOCK_PROFILE; // In a real app, fetch using params.id
  
  const [newNote, setNewNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([
    {
      text: "Requested eco-friendly packaging only. Loyal customer, consider adding a sample to her next high-value order.",
      date: "Updated 3 days ago"
    }
  ]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setSavedNotes([{ text: newNote, date: "Just now" }, ...savedNotes]);
    setNewNote("");
    toast.success("Note saved to profile");
  };
  
  return (
    <div className="space-y-6 max-w-[1280px] mx-auto pb-20">
      
      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard/customers" className="text-muted-foreground hover:text-foreground transition-colors">
            Customers
          </Link>
          <span className="text-muted-foreground/50">›</span>
          <span className="font-extrabold text-foreground">{profile.name}</span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => toast.info(`Drafting email to ${profile.email}...`)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-[8px] bg-muted/40 hover:bg-muted text-foreground text-sm font-bold border border-border/50 transition-colors shadow-none"
          >
            Send Email
          </button>
          <button 
            onClick={() => toast.success("Edit Profile modal opened")}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-[8px] bg-green-700 hover:bg-green-800 text-white text-sm font-bold shadow-none shadow-green-700/20 transition-colors active:scale-95"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ── Top Level Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Profile Info */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-[8px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8 shadow-none">
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[8px] overflow-hidden border-2 border-border/50 bg-slate-100 dark:bg-slate-800">
               <Image src={profile.avatar} alt={profile.name} width={150} height={150} className="w-full h-full object-cover" />
            </div>
            {profile.status === "VIP" && (
              <div className="absolute -bottom-3 -right-3 bg-green-400 text-green-950 font-black text-xs px-3 py-1.5 rounded-lg border-2 border-card uppercase tracking-widest shadow-lg">
                VIP
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{profile.name}</h1>
              <p className="text-sm font-medium text-muted-foreground mt-1">Customer since {profile.memberSince}</p>
            </div>
            
            <div className="flex flex-col gap-2.5 mt-4">
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <Mail size={16} className="text-green-600 dark:text-green-500 shrink-0" />
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <Phone size={16} className="text-green-600 dark:text-green-500 shrink-0" />
                <span className="font-medium">{profile.phone}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-foreground">
                <MapPin size={16} className="text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                <span className="font-medium max-w-[280px] leading-snug">{profile.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Interaction Summary */}
        <div className="bg-muted/20 border border-border/50 rounded-[8px] p-6 md:p-8 flex flex-col justify-center shadow-none relative overflow-hidden">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-4">AI Interaction Summary</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-[8px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center shrink-0">
               <Bot size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">{profile.aiSummary.chats} Chats</h2>
              <p className="text-xs font-semibold text-muted-foreground">Concierge interactions</p>
            </div>
          </div>
          <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
            {profile.aiSummary.snippet}
          </p>
        </div>
      </div>

      {/* ── Metrics Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Spent" 
          value={profile.metrics.totalSpent} 
          subText={profile.metrics.spentTrend} 
          icon={<TrendingUp size={14} className="text-green-600" />} 
          trendColor="text-green-600 dark:text-green-500" 
        />
        <MetricCard 
          label="Total Orders" 
          value={profile.metrics.totalOrders} 
          subText={profile.metrics.ordersAvg} 
        />
        <MetricCard 
          label="Avg. Order Value" 
          value={profile.metrics.avgOrderValue} 
          subText={profile.metrics.aovStatus} 
        />
        <MetricCard 
          label="Last Purchase" 
          value={profile.metrics.lastPurchase} 
          subText={profile.metrics.activeStatus} 
        />
      </div>

      {/* ── Lower Main Layout (Left: Orders, Right: Insights) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order History */}
        <div className="lg:col-span-2 space-y-4 pt-2">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-black text-foreground">Order History</h2>
             <button 
               onClick={() => router.push("/dashboard/orders")}
               className="text-sm font-bold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors"
             >
               View All
             </button>
           </div>
           
           <div className="space-y-4">
             {profile.orderHistory.map((order, i) => (
               <div 
                 key={i} 
                 onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                 className="bg-card border border-border/50 rounded-[8px] p-5 flex items-center justify-between shadow-none hover:shadow-none transition-shadow group cursor-pointer"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-[8px] bg-muted/40 border border-border/50 text-muted-foreground flex items-center justify-center group-hover:bg-muted transition-colors">
                     <Package size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-extrabold text-foreground tracking-tight">Order #{order.id}</p>
                     <p className="text-xs font-semibold text-muted-foreground mt-0.5">{order.items} Items • {order.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-black text-foreground mb-1">{order.total}</p>
                   <span className="inline-block px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[9px] font-black tracking-widest uppercase rounded-md">
                     {order.status}
                   </span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6 pt-2">
          
          {/* Preferred Categories */}
          <div className="bg-card border border-border/50 rounded-[8px] p-6 lg:p-7 shadow-none">
             <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground mb-6">Preferred Categories</h3>
             <div className="space-y-6">
                {profile.preferences.map((pref, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-muted-foreground">{pref.name}</span>
                      <span className="text-green-700 dark:text-green-500">{pref.pct}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full h-1.5 bg-muted rounded-[8px] overflow-hidden">
                       <div 
                         className="h-full bg-green-700 dark:bg-green-600 rounded-[8px]" 
                         style={{ width: `${pref.pct}%` }}
                       />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Private Notes */}
          <div className="bg-card border border-border/50 rounded-[8px] p-6 lg:p-7 shadow-none">
             <div className="flex items-center justify-between mb-5">
               <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground">Private Notes</h3>
               <button 
                 onClick={() => {
                    const el = document.getElementById("note-textarea");
                    if (el) el.focus();
                 }}
                 className="text-xs font-bold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors flex items-center gap-1"
               >
                 <Plus size={12} /> New Note
               </button>
             </div>
             
             {/* Existing Note blocks */}
             <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
               {savedNotes.map((note, idx) => (
                 <div key={idx} className="bg-muted/30 border border-border/50 rounded-[8px] p-5">
                   <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                     {note.text}
                   </p>
                   <p className="text-[10px] font-bold text-muted-foreground/60 mt-4">{note.date}</p>
                 </div>
               ))}
             </div>

             {/* Add Note Input Area */}
             <div className="relative mt-2">
               <textarea 
                 id="note-textarea"
                 value={newNote}
                 onChange={(e) => setNewNote(e.target.value)}
                 placeholder="Add a quick note..."
                 className="w-full bg-transparent border border-border/50 rounded-[8px] p-4 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none h-24 placeholder:text-muted-foreground/50 pb-12"
               />
               <button 
                 onClick={handleAddNote}
                 disabled={!newNote.trim()}
                 className="absolute bottom-3 right-3 bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-none shadow-green-700/20 active:scale-95 disabled:opacity-50"
               >
                 Save
               </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Sub-component for Metrics
function MetricCard({ label, value, subText, icon, trendColor }: { label: string, value: string, subText: string, icon?: React.ReactNode, trendColor?: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-[8px] p-6 lg:p-7 shadow-none hover:shadow-none transition-shadow">
      <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground mb-3">{label}</p>
      <p className="text-3xl font-black text-foreground mb-2">{value}</p>
      <div className="flex items-center gap-2">
        {icon}
        <span className={`text-xs font-bold ${trendColor || "text-muted-foreground"}`}>{subText}</span>
      </div>
    </div>
  );
}
