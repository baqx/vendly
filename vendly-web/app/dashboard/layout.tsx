"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Bot, 
  Wallet as WalletIcon,
  Settings, 
  ChevronLeft,
  LogOut,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Vendly AI", href: "/dashboard/ai", icon: Bot },
  { name: "Wallet", href: "/dashboard/transactions", icon: WalletIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col hidden md:flex sticky top-0 h-screen`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Vendly" width={32} height={32} />
            {isSidebarOpen && <span className="font-extrabold text-xl tracking-tight text-primary">Vendly</span>}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
          >
            <ChevronLeft className={`${!isSidebarOpen && "rotate-180"} transition-transform`} size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-white" : "group-hover:text-primary"} />
                {isSidebarOpen && <span className="font-bold text-[15px]">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <Link 
            href="/dashboard/help" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted dark:text-muted-foreground/80 dark:hover:bg-white/5 hover:text-foreground font-bold text-[15px]"
          >
            <HelpCircle size={22} />
            {isSidebarOpen && <span>Help Center</span>}
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-[15px]"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold truncate">
              {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md text-[10px] font-bold border border-border">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              AI BOT ONLINE
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 cursor-pointer">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
