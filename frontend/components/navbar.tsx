"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, BookOpen, GraduationCap, LayoutDashboard, 
  MessageSquare, Brain, Sun, Moon, Shield, Award
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const pathname = usePathname();
  const { user, isDemoMode } = useAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Default to dark mode for sleek AI aesthetics
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
  };

  const isPublicPage = pathname === "/" || pathname === "/about" || pathname === "/research" || pathname === "/features";

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-border/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                EduRAG
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-none hidden sm:block">
              PRAG-EDU + OULAD
            </p>
          </div>
        </Link>

        {/* Center Navigation Links (Public Pages) */}
        {isPublicPage && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition-colors hover:text-primary ${pathname === "/" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Home
            </Link>
            <Link 
              href="/research" 
              className={`transition-colors hover:text-primary ${pathname === "/research" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Research & Paper
            </Link>
            <Link 
              href="/features" 
              className={`transition-colors hover:text-primary ${pathname === "/features" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Features
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors hover:text-primary ${pathname === "/about" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              About
            </Link>
          </nav>
        )}

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          
          {/* Demo Mode Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm" title="Running in intelligent deterministic fallback mode without requiring paid API keys">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Demo Mode Active
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Quick Launch Buttons */}
          <Link
            href="/tutor"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border/80 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            AI Tutor
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/30 transition-all hover:scale-[1.02]"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          {/* User Profile Avatar */}
          <Link href="/profile" className="flex items-center gap-2 pl-1 group" title="Logged in as Alex Morgan (Intermediate)">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center border border-white/20 group-hover:ring-2 ring-primary/40 transition-all">
              AM
            </div>
          </Link>

        </div>

      </div>
    </header>
  );
}
