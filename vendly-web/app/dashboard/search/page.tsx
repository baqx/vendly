"use client";

import { useSearchParams } from "next/navigation";
import { Search, Package, ShoppingCart, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          Search Results
        </h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Showing results for &quot;<span className="text-foreground font-bold">{query}</span>&quot; across your entire store.
        </p>
      </div>

      {query ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-foreground uppercase tracking-widest">
              <Package size={16} className="text-green-600" />
              Products
            </h2>
            <div className="bg-card border border-border/40 rounded-[4px] p-6 text-center shadow-minimal">
              <p className="text-sm text-muted-foreground font-medium">
                No products found matching &quot;{query}&quot;.
              </p>
              <Link href="/dashboard/inventory" className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-500 mt-4 hover:underline">
                View all products <ArrowRight size={12} />
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-foreground uppercase tracking-widest">
              <ShoppingCart size={16} className="text-green-600" />
              Orders
            </h2>
            <div className="bg-card border border-border/40 rounded-[4px] p-6 text-center shadow-minimal">
              <p className="text-sm text-muted-foreground font-medium">
                No orders found matching &quot;{query}&quot;.
              </p>
              <Link href="/dashboard/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-500 mt-4 hover:underline">
                View all orders <ArrowRight size={12} />
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-foreground uppercase tracking-widest">
              <Users size={16} className="text-green-600" />
              Customers
            </h2>
            <div className="bg-card border border-border/40 rounded-[4px] p-6 text-center shadow-minimal">
              <p className="text-sm text-muted-foreground font-medium">
                No customers found matching &quot;{query}&quot;.
              </p>
              <Link href="/dashboard/customers" className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-500 mt-4 hover:underline">
                View all customers <ArrowRight size={12} />
              </Link>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border/40 rounded-[4px] text-center shadow-minimal">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Search size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Type to search</h2>
          <p className="text-sm text-muted-foreground font-medium mt-2 max-w-xs mx-auto">
            Find anything in your store—products, orders, customers, or analytics insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}

