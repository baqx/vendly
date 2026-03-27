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
  Activity,
  Wallet as WalletIcon,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import useSWR, { SWRConfig } from "swr";
import { useAuthToken } from "@/hooks/use-auth-token";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { swrFetcher } from "@/lib/swr";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutGrid },
 // { name: "Live Activity", href: "/dashboard/analytics/live", icon: Activity },
  { name: "Products", href: "/dashboard/inventory", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
 //{ name: "Wallet", href: "/dashboard/transactions", icon: WalletIcon },
 // { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// ─── Sidebar (extracted outside layout to prevent remounting) ───────────────
function Sidebar({
  isSidebarOpen,
  onToggle,
  mobile = false,
  onClose,
  pathname,
  storeName,
  logoUrl,
  onLogout,
}: {
  isSidebarOpen: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onClose: () => void;
  pathname: string;
  storeName?: string;
  logoUrl?: string | null;
  onLogout: () => void;
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
            className="p-1.5 rounded-[4px] hover:bg-muted text-muted-foreground"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-[4px] hover:bg-muted text-muted-foreground absolute -right-3 top-7 bg-background border border-border"
          >
            <ChevronLeft
              className={`${!isSidebarOpen && "rotate-180"} transition-transform`}
              size={16}
            />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && onClose()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[4px] transition-all group font-bold text-[15px] ${
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

      {/* User profile & Logout */}
      <div className="p-4 mt-auto border-t border-border/40">
        <div className={`flex items-center gap-3 ${!expanded ? "justify-center" : "px-2"}`}>
          <div className="w-9 h-9 rounded-[4px] bg-green-700/10 dark:bg-emerald-500/10 flex items-center justify-center text-green-700 dark:text-green-500 shrink-0 border border-green-700/20">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName || "Store"} className="w-full h-full object-cover rounded-[4px]" />
            ) : (
              <Image
                src="/images/shop.png"
                width={36}
                height={36}
                alt="Store"
                className="w-full h-full object-cover opacity-80"
              />
            )}
          </div>
          
          {expanded && (
            <div className="flex-1 min-w-0 pr-2">
              <p className="font-bold text-[13px] text-foreground truncate">
                {storeName || "My Store"}
              </p>
              <button 
                onClick={onLogout}
                className="text-[11px] font-extrabold text-muted-foreground hover:text-red-500 transition-colors uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>Logout</span>
              </button>
            </div>
          )}

          {!expanded && (
            <button 
              onClick={onLogout}
              className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-[4px] transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
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
  const router = useRouter();
  const { token, ready, logout } = useAuthToken();
  const { data: vendor } = useSWR<any>(token ? "/vendors/me" : null, swrFetcher as any);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Auto-collapse sidebar on the Messages page for maximum chat viewport
  useEffect(() => {
    if (pathname.startsWith("/dashboard/messages")) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (ready && !token) {
      router.replace("/login");
    }
  }, [ready, token, router]);

  return (
    <SWRConfig value={{ fetcher: swrFetcher }}>
      <div className="flex min-h-screen bg-muted/30 dark:bg-background text-foreground transition-colors duration-300">

        {/* Mobile backdrop */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar drawer */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-background dark:bg-card border-r border-border flex flex-col z-[60] transform transition-transform duration-300 md:hidden ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            isSidebarOpen={true}
            onToggle={() => {}}
            mobile={true}
            onClose={() => setIsMobileSidebarOpen(false)}
            pathname={pathname}
            storeName={vendor?.storeName}
            logoUrl={vendor?.logoUrl}
            onLogout={logout}
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
            storeName={vendor?.storeName}
            logoUrl={vendor?.logoUrl}
            onLogout={logout}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-[40] transition-colors shadow-minimal">
            <div className="flex items-center gap-4 flex-1">
              <button
                className="md:hidden p-2 hover:bg-muted rounded-[4px] transition-colors"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-extrabold hidden sm:block tracking-tight text-foreground">
                {vendor?.storeName ? `${vendor.storeName} Dashboard` : "Vendly Dashboard"}
              </h2>

              <div className="hidden md:flex items-center flex-1 max-w-md ml-8 bg-muted/50 dark:bg-muted/30 border border-border/50 rounded-[4px] px-4 py-2 hover:bg-muted/80 transition-colors focus-within:bg-background focus-within:ring-2 focus-within:ring-green-500/20 shadow-minimal">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search analytics, orders, or products..."
                  className="bg-transparent border-none outline-none text-sm w-full ml-2 text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <ThemeToggle />
              <NotificationCenter />
              <Link 
                href="/dashboard/messages"
                className="p-2 text-muted-foreground hover:bg-muted rounded-[4px] transition-colors hidden sm:block"
                title="Messages"
              >
                <MessageSquare size={20} />
              </Link>
              <Link
                href="/dashboard/profile"
                className="w-9 h-9 flex-shrink-0 rounded-[4px] overflow-hidden border border-border cursor-pointer ml-1 hover:ring-2 hover:ring-green-500/40 transition-all"
                title="Account Settings"
              >
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Image
                    src="/images/shop.png"
                    width={36}
                    height={36}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </SWRConfig>
  );
}

