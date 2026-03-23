import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, Bot } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Bonjour, John! 👋</h1>
        <p className="text-muted-foreground font-medium mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "₦420,500", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Orders", value: "156", icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
          { label: "Products", value: "24", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Active Sessions", value: "12", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-extrabold mt-1">{stat.value}</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 mt-2">
                <ArrowUpRight size={12} />
                <span>+12.5% vs last month</span>
              </div>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Bento Grid (Sample) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-muted/30 rounded-lg px-2 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center font-bold text-sm">
                    {["AO", "MK", "SL", "PJ", "BW"][i]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Order #{1000 + i}</p>
                    <p className="text-xs text-muted-foreground font-medium">2 mins ago • WhatsApp</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-sm text-foreground">₦25,000</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Health Card */}
        <div className="bg-primary text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
          
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Bot size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-2 tracking-tight">Vendly AI is optimized.</h3>
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              Your digital employee has handled 12 sessions today with a 65% conversion rate.
            </p>
          </div>

          <button className="mt-8 bg-white text-primary py-3 rounded-lg font-bold text-sm hover:bg-secondary hover:text-white transition-all z-10 shadow-lg">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
