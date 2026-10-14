"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  BrainCircuit,
  Bot,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  User,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("alex.morgan@student.open.ac.uk");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      console.warn("Using demo session fallback:", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudentLogin = () => {
    login("alex.morgan@student.open.ac.uk", "demo123");
    router.push("/dashboard");
  };

  const handleDemoAdminLogin = () => {
    login("admin.research@edurag.ai", "admin123");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/25">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">
              EduRAG<span className="text-primary font-black">AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your personalized learning profile and AI tutor
          </p>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-3xl glass-card border border-border/80 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="alex.morgan@student.open.ac.uk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                <label>Password</label>
                <a href="#" className="text-primary hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Instant 1-Click Demo Buttons */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block text-center">
              Or Instant 1-Click Demo Access
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                className="p-2.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <User className="w-3.5 h-3.5" /> Student (Alex)
              </button>
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="p-2.5 rounded-xl border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 text-secondary font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Researcher
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Register & Onboard
          </Link>
        </p>
      </div>
    </div>
  );
}
