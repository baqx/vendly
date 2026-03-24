"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3,
  Wallet as WalletIcon,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Search,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutGrid },
  { name: "Products", href: "/dashboard/inventory", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Wallet", href: "/dashboard/transactions", icon: WalletIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// ─── Sidebar (extracted outside layout to prevent remounting) ───────────────
function Sidebar({
  isSidebarOpen,
  onToggle,
  mobile = false,
  onClose,
  pathname,
}: {
  isSidebarOpen: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const expanded = isSidebarOpen || mobile;

  return (
    <>
      {/* Logo row */}
      <div className="p-6 flex items-center justify-between relative">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() => mobile && onClose()}
        >
          {expanded ? (
            <div className="relative h-8 w-32">
              <Image
                src="/images/logo-text.png"
                alt="Vendly Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/logo-text.png"
                alt="Vendly Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          ) : (
            <div className="relative h-8 w-8 mx-auto">
              <Image
                src="/images/logo.png"
                alt="Vendly Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/logo.png"
                alt="Vendly Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          )}
        </Link>

        {mobile ? (
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] hover:bg-muted text-muted-foreground"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-[8px] hover:bg-muted text-muted-foreground absolute -right-3 top-7 bg-background border border-border"
          >
            <ChevronLeft
              className={`${!isSidebarOpen && "rotate-180"} transition-transform`}
              size={16}
            />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && onClose()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all group font-bold text-[15px] ${
                isActive
                  ? "bg-white dark:bg-muted border border-border/40 dark:border-border text-green-700 dark:text-green-500"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              } ${!expanded ? "justify-center px-0" : ""}`}
            >
              <item.icon
                size={20}
                className={
                  isActive
                    ? "text-green-600 dark:text-green-400"
                    : "group-hover:text-foreground"
                }
              />
              {expanded && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-4 mt-auto">
        <div className="bg-background dark:bg-muted/50 rounded-[8px] p-3 border border-border/50 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="w-10 h-10 rounded-[8px] bg-green-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
            VS
          </div>
          {expanded && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-foreground truncate">
                Vendly Store
              </p>
              <p className="text-[11px] text-muted-foreground font-medium truncate">
                Premium Merchant
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Layout ─────────────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auto-collapse sidebar on the Messages page for maximum chat viewport
  useEffect(() => {
    if (pathname.startsWith("/dashboard/messages")) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-muted/30 dark:bg-background text-foreground transition-colors duration-300">

      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-background dark:bg-card border-r border-border flex flex-col z-50 transform transition-transform duration-300 md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          isSidebarOpen={true}
          onToggle={() => {}}
          mobile={true}
          onClose={() => setIsMobileSidebarOpen(false)}
          pathname={pathname}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-background dark:bg-card border-r border-border transition-all duration-300 flex-col hidden md:flex sticky top-0 h-screen`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((v) => !v)}
          mobile={false}
          onClose={() => {}}
          pathname={pathname}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 transition-colors shadow-minimal">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="md:hidden p-2 hover:bg-muted rounded-[8px] transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-extrabold hidden sm:block tracking-tight text-foreground">
              Vendly Dashboard
            </h2>

            <div className="hidden md:flex items-center flex-1 max-w-md ml-8 bg-muted/50 dark:bg-muted/30 border border-border/50 rounded-[8px] px-4 py-2 hover:bg-muted/80 transition-colors focus-within:bg-background focus-within:ring-2 focus-within:ring-green-500/20 shadow-minimal">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search analytics, orders, or products..."
                className="bg-transparent border-none outline-none text-sm w-full ml-2 text-foreground placeholder:text-muted-foreground font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <ThemeToggle />
            <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-[8px] transition-colors hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-[8px] border-2 border-background" />
            </button>
            <button className="p-2 text-muted-foreground hover:bg-muted rounded-[8px] transition-colors hidden sm:block">
              <MessageSquare size={20} />
            </button>
            <div className="w-9 h-9 flex-shrink-0 rounded-[8px] overflow-hidden border border-border cursor-pointer ml-1">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Image
                  src="/images/avatar1.png"
                  width={36}
                  height={36}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
