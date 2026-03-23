"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Mail, Lock, User, Store, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  if (step === 2) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Check your email</h1>
          <p className="text-muted-foreground font-medium mb-8">
            We've sent a verification link to your email address.
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
          <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
