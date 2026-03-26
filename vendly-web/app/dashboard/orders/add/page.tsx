"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  UserPlus,
  Search,
  Plus,
  Minus,
  Trash2,
  MapPin,
  CreditCard,
  Lightbulb,
  CheckCircle2,
  X,
  Banknote,
  Building2,
  Monitor,
  Link2,
  Package,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { apiJson, buildQuery } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  image: string;
};

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type ApiProduct = {
  id: string;
  title: string;
  basePrice?: number;
  mapPrice?: number;
  stockLevel?: number;
  images?: { url: string }[];
};

type ApiCustomer = {
  id: string;
  identifier: string;
  name: string;
  phone?: string;
};

type OrderResponse = {
  id: string;
  paymentLink?: string;
};

const FALLBACK_PRODUCTS: Product[] = [
  { id: "p1", name: "Emerald Trail Runners", sku: "VLD-4421-G", price: 45000, stock: 12, image: "/images/shoes.png" },
  { id: "p2", name: "Velocity X1 Sneakers", sku: "VL-RUN-42", price: 38000, stock: 8, image: "/images/shoes.png" },
  { id: "p3", name: "Heritage Leather Watch", sku: "WR-LTH-01", price: 120000, stock: 5, image: "/images/shoes.png" },
  { id: "p4", name: "Verdant Pro Headphones", sku: "VD-PRO-90", price: 55000, stock: 15, image: "/images/shoes.png" },
  { id: "p5", name: "Organic Coffee Beans (500g)", sku: "CB-ORG-500", price: 8500, stock: 40, image: "/images/shoes.png" },
  { id: "p6", name: "Premium Shea Butter (1kg)", sku: "SB-PRM-1KG", price: 14000, stock: 20, image: "/images/shoes.png" },
  { id: "p7", name: "Artisan Spice Kit", sku: "SK-ART-01", price: 22000, stock: 30, image: "/images/shoes.png" },
];

const FALLBACK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Adebola Johnson", email: "ade.johnson@example.com", phone: "+234 812 345 6789" },
  { id: "c2", name: "Elena Aris", email: "elena@example.com", phone: "+234 801 234 5678" },
  { id: "c3", name: "Kofi Osei", email: "kofi.o@provider.gh", phone: "+233 24 555 0192" },
  { id: "c4", name: "Mariam Ade", email: "m.ade@web.ng", phone: "+234 703 456 7890" },
  { id: "c5", name: "Chidi Laolu", email: "chidi@corp.com", phone: "+234 905 678 9012" },
];

type CartItem = { id: string; name: string; sku: string; price: number; qty: number; image: string; variant?: string };

const PAYMENT_METHODS = [
  { id: "CASH", label: "Cash", icon: Banknote },
  { id: "BANK", label: "Bank Transfer", icon: Building2 },
  { id: "POS", label: "POS Terminal", icon: Monitor },
  { id: "LINK", label: "Payment Link", icon: Link2 },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreateManualOrderPage() {
  const router = useRouter();
  const { data: products } = useSWR<ApiProduct[]>(
    `/products${buildQuery({ skip: 0, limit: 100 })}`
  );
  const { data: customers } = useSWR<ApiCustomer[]>(
    `/customers${buildQuery({ skip: 0, limit: 100 })}`
  );

  const productCatalog = useMemo<Product[]>(() => {
    if (!products || products.length === 0) return FALLBACK_PRODUCTS;
    return products.map((product) => ({
      id: product.id,
      name: product.title,
      sku: product.id,
      price: product.basePrice ?? product.mapPrice ?? 0,
      stock: product.stockLevel ?? 0,
      image: product.images?.[0]?.url || "/images/shoes.png",
    }));
  }, [products]);

  const customerCatalog = useMemo<Customer[]>(() => {
    if (!customers || customers.length === 0) return FALLBACK_CUSTOMERS;
    return customers.map((customer) => ({
      id: customer.identifier || customer.id,
      name: customer.name || customer.identifier,
      phone: customer.phone || customer.identifier,
    }));
  }, [customers]);

  // Customer form
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductResults, setShowProductResults] = useState(false);

  // Logistics
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK" | "POS" | "LINK">("CASH");

  // Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return [];
    const q = productSearch.toLowerCase();
    return productCatalog.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    );
  }, [productSearch, productCatalog]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customerCatalog;
    const q = customerSearch.toLowerCase();
    return customerCatalog.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.email || \"\").toLowerCase().includes(q)
    );
  }, [customerSearch, customerCatalog]);

  const SHIPPING_COST = 2500;
  const TAX_RATE = 0.075;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + SHIPPING_COST + tax;

  const fmt = (n: number) => formatCurrency(n);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, sku: product.sku, price: product.price, qty: 1, image: product.image }];
    });
    setProductSearch("");
    setShowProductResults(false);
    toast.success(`${product.name} added to order`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id: string, name: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    toast.success(`${name} removed from order`);
  };

  const selectCustomer = (c: Customer) => {
    setCustomerName(c.name);
    setCustomerEmail(c.email || "");
    setCustomerPhone(c.phone);
    setShowCustomerModal(false);
    setCustomerSearch("");
    toast.success(`Customer set to ${c.name}`);
  };

  const handleCreateOrder = async () => {
    if (!customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Add at least one item to the order.");
      return;
    }
    setIsSubmitting(true);
    toast.loading("Creating order...", { id: "create-order" });

    const shippingAddress = [streetAddress, city, state].filter(Boolean).join(", ");
    try {
      const payload = {
        customerName,
        customerPhone,
        shippingAddress,
        totalAmount: total,
        notes: orderNotes,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.qty,
          price: item.price,
          variant: item.variant || undefined,
        })),
      };

      const created = await apiJson<OrderResponse>("/orders", "POST", payload);
      setPaymentLink(created.paymentLink || null);
      toast.success(`Order ${created.id} created successfully!`, {
        id: "create-order",
        description: created.paymentLink ? "Payment link is ready." : undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create order.";
      toast.error(message, { id: "create-order" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    toast.info("Draft discarded.");
    router.push("/dashboard/orders");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 pb-20">

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCustomerModal(false)} />
          <div className="relative bg-background dark:bg-card rounded-[4px] border border-border shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-foreground">Select Customer</h3>
              <button onClick={() => setShowCustomerModal(false)} className="p-1.5 rounded-[4px] hover:bg-muted transition-colors text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full bg-muted/40 border border-border/50 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                autoFocus
              />
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filteredCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCustomer(c)}
                  className="w-full text-left p-4 rounded-[4px] hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                >
                  <p className="text-sm font-extrabold text-foreground">{c.name}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-0.5">
                    {c.email ? `${c.email} · ${c.phone || "--"}` : c.phone || "--"}
                  </p>
                </button>
              ))}
              {filteredCustomers.length === 0 && (
                <p className="text-sm font-bold text-muted-foreground text-center py-6">No customers found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 text-sm font-extrabold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors w-fit group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create Manual Order</h1>
        <p className="text-muted-foreground font-medium">Generate a new transaction for in-person sales or phone orders.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">

        {/* ── Left Column ── */}
        <div className="flex-1 space-y-8 w-full">

          {/* Customer Selection */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                  <UserPlus size={18} />
                </div>
                <h2 className="text-xl font-extrabold text-foreground">Customer Selection</h2>
              </div>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="text-xs font-extrabold text-green-700 dark:text-green-500 hover:underline flex items-center gap-1.5"
              >
                <Search size={13} />
                Select Existing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chinua Achebe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-muted/40 border border-border/50 rounded-[4px] px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  placeholder="chinua@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-muted/40 border border-border/50 rounded-[4px] px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+234 ..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-muted/40 border border-border/50 rounded-[4px] px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>
            </div>
          </div>

          {/* Items & Inventory */}
          <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                  <Package size={18} />
                </div>
                <h2 className="text-xl font-extrabold text-foreground">Items &amp; Inventory</h2>
              </div>
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">
                {cart.length} item{cart.length !== 1 ? "s" : ""} added
              </span>
            </div>

            {/* Cart items */}
            {cart.length > 0 && (
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-muted/30 border border-border/60 rounded-[4px] p-4 flex flex-col sm:flex-row items-center gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="w-14 h-14 rounded-[4px] bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                        <Image src={item.image} width={40} height={40} alt={item.name} className="object-cover brightness-110" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-foreground">{item.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{item.sku}</p>
                        <p className="text-xs font-extrabold text-green-700 dark:text-green-500 mt-1">{fmt(item.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2 bg-white dark:bg-card border border-border/60 rounded-[4px] px-3 py-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-[4px] bg-muted hover:bg-muted/80 transition-colors text-foreground"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-extrabold text-foreground w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-[4px] bg-muted hover:bg-muted/80 transition-colors text-foreground"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-sm font-extrabold text-foreground min-w-[80px] text-right">
                        {fmt(item.price * item.qty)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id, item.name)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-[4px] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product search */}
            <div className="relative">
              <div className="border border-border/60 rounded-[4px] p-6">
                <p className="text-xs font-bold text-muted-foreground mb-3 text-center">
                  {cart.length === 0 ? "Search for products to add to this order" : "Add more products"}
                </p>
                <div className="relative max-w-sm w-full mx-auto">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                  <input
                    type="text"
                    placeholder="Type product name or SKU..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductResults(true);
                    }}
                    onFocus={() => setShowProductResults(true)}
                    onBlur={() => setTimeout(() => setShowProductResults(false), 200)}
                    className="w-full bg-muted/40 border border-border/50 rounded-[4px] pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  />
                </div>

                {/* Search results dropdown */}
                {showProductResults && filteredProducts.length > 0 && (
                  <div className="mt-3 bg-white dark:bg-card border border-border/50 rounded-[4px] overflow-hidden max-w-sm mx-auto">
                    {filteredProducts.map((p) => {
                      const inCart = cart.find((c) => c.id === p.id);
                      return (
                        <button
                          key={p.id}
                          onMouseDown={() => addToCart(p)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border/30 last:border-0 text-left"
                        >
                          <div className="w-10 h-10 rounded-[4px] bg-slate-900 overflow-hidden shrink-0">
                            <Image src={p.image} width={40} height={40} alt={p.name} className="object-cover brightness-110" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-foreground truncate">{p.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground">{p.sku} · Stock: {p.stock}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-extrabold text-green-700 dark:text-green-500">{fmt(p.price)}</p>
                            {inCart && (
                              <span className="text-[9px] font-extrabold text-green-600 uppercase tracking-widest">In cart</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {showProductResults && productSearch.trim() && filteredProducts.length === 0 && (
                  <p className="text-xs font-bold text-muted-foreground text-center mt-3">No products found for &quot;{productSearch}&quot;</p>
                )}
              </div>
            </div>
          </div>

          {/* Logistics & Notes */}
          <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-[4px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-foreground">Logistics &amp; Notes</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest mb-2">Shipping Address</h3>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-muted/40 border border-border/50 rounded-[4px] px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-muted/40 border border-border/50 rounded-[4px] px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  />
                  <input
                    type="text"
                    placeholder="State / Province"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-muted/40 border border-border/50 rounded-[4px] px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  />
                </div>
                <label
                  className="flex items-center gap-3 cursor-pointer mt-2 group w-fit"
                  onClick={() => setShippingSameAsBilling((v) => !v)}
                >
                  <div
                    className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                      shippingSameAsBilling
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-muted-foreground bg-transparent"
                    }`}
                  >
                    {shippingSameAsBilling && <CheckCircle2 size={12} className="stroke-[4]" />}
                  </div>
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors select-none">
                    Billing address same as shipping
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest mb-2">Order Notes</h3>
                <textarea
                  placeholder="Add any special instructions or internal notes here..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full h-[150px] bg-muted/40 border border-border/50 rounded-[4px] px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-medium resize-none border-dashed"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-card rounded-[4px] border border-border/50 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-[4px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                <CreditCard size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-foreground">Payment Method</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setPaymentMethod(id as any);
                    toast.success(`Payment method set to ${label}`);
                  }}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[4px] border-2 transition-all ${
                    paymentMethod === id
                      ? "bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 scale-[1.02]"
                      : "bg-muted/30 border-border/50 hover:border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={22} className={paymentMethod === id ? "text-green-600 dark:text-green-500" : ""} />
                  <span className="text-xs font-extrabold uppercase tracking-widest leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column (Sticky Summary) ── */}
        <div className="w-full xl:w-[400px] shrink-0 space-y-6 xl:sticky xl:top-8">

          <div className="bg-green-50/50 dark:bg-green-950/10 rounded-[4px] border border-green-100 dark:border-green-900/30 p-6 lg:p-8 flex flex-col">
            <h2 className="text-xl font-extrabold text-foreground mb-8">Order Summary</h2>

            {/* Cart preview */}
            {cart.length > 0 ? (
              <div className="space-y-2 mb-6 pb-4 border-b border-green-200/50 dark:border-green-900/50">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-muted-foreground truncate max-w-[160px]">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-extrabold text-foreground shrink-0">{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 pb-6 border-b border-green-200/50 dark:border-green-900/50 text-center">
                <p className="text-xs font-bold text-muted-foreground">No items added yet</p>
              </div>
            )}

            <div className="space-y-4 mb-6 pb-6 border-b border-green-200/50 dark:border-green-900/50">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Subtotal</span>
                <span className="font-extrabold text-foreground">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Shipping</span>
                <span className="font-extrabold text-foreground">{fmt(SHIPPING_COST)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-muted-foreground">Tax (7.5%)</span>
                <span className="font-extrabold text-foreground">{fmt(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest pb-1">
                TOTAL<br />AMOUNT
              </span>
              <div className="text-right">
                <div className="text-4xl font-black tracking-tight text-green-700 dark:text-green-400">
                  {fmt(total)}
                </div>
                <p className="text-[9px] font-bold text-muted-foreground mt-1">
                  {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                </p>
              </div>
            </div>

            {paymentLink && (
              <div className="mb-6 rounded-[4px] border border-green-200/60 bg-white/80 dark:bg-card/40 p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400 mb-2">
                  Payment Link
                </p>
                <p className="text-xs font-bold text-muted-foreground break-all mb-3">{paymentLink}</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-[4px] bg-green-700 hover:bg-green-800 text-white text-xs font-extrabold transition-colors"
                  >
                    Open Link
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentLink);
                      toast.success("Payment link copied.");
                    }}
                    className="px-4 py-2 rounded-[4px] border border-border text-xs font-extrabold text-foreground hover:bg-muted transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3 mt-auto">
              <button
                onClick={handleCreateOrder}
                disabled={isSubmitting}
                className={`w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-[4px] font-extrabold text-base transition-all hover:scale-105 active:scale-95 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed hover:scale-100 active:scale-100" : ""
                }`}
              >
                {isSubmitting ? "Processing..." : "✓ Create Order"}
              </button>
              <button
                onClick={handleDiscard}
                disabled={isSubmitting}
                className="w-full bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-900/50 py-4 rounded-[4px] font-extrabold text-sm transition-colors text-center disabled:opacity-50"
              >
                Discard Draft
              </button>
            </div>
          </div>

          {/* Quick tip */}
          <div className="bg-muted/40 rounded-[4px] border border-border/50 p-6 flex gap-4">
            <div className="w-8 h-8 rounded-[4px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
              <Lightbulb size={16} className="fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-foreground mb-1">Quick Tip</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Orders created manually will automatically deduct stock from your main inventory. Ensure you check availability before confirming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
