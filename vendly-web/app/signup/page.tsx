"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Mail, Lock, User, Store, Loader2, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiJson } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    storeName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiJson("/vendors/signup", "POST", {
        email: formData.email,
        password: formData.password,
        storeName: formData.storeName,
        phoneNumber: formData.phoneNumber,
      });
      setStep(2);
      toast.success("Account created successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Account created</h1>
          <p className="text-muted-foreground font-medium mb-8">
            Your Vendly account is ready. Continue to sign in.
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
          >
            Return to login <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image src="/images/logo.png" alt="Vendly" width={48} height={48} className="mb-4" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Scale with AI</h1>
          <p className="text-muted-foreground mt-2 font-medium">Start your 14-day free trial today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  id="name"
                  type="text" 
                  placeholder="John Doe" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground" htmlFor="store">Store Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  id="store"
                  type="text" 
                  placeholder="My Shop" 
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, storeName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                id="email"
                type="email" 
                placeholder="name@company.com" 
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="phoneNumber">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                id="phoneNumber"
                type="tel" 
                placeholder="+2348012345678" 
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                id="password"
                type="password" 
                placeholder="Create a password" 
                required
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-70 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Start 14-day Free Trial"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
          Already using Vendly?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-primary font-bold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
