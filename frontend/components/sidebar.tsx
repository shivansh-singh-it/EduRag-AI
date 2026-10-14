"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, MessageSquare, Brain, Compass, BookOpen, 
  CheckCircle2, HelpCircle, BarChart3, Lightbulb, AlertTriangle, 
  Settings, Database, FileSpreadsheet, Activity, ChevronLeft, ChevronRight,
  TrendingUp, Award, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

const STUDENT_NAV: NavItem[] = [
  { name: "Student Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Tutor", href: "/tutor", icon: MessageSquare, badge: "PRAG" },
  { name: "My Learning Profile", href: "/profile", icon: Brain },
  { name: "Learning Path", href: "/learning-path", icon: Compass },
  { name: "Subjects & Modules", href: "/modules", icon: BookOpen },
  { name: "Assessments", href: "/assessments", icon: CheckCircle2 },
  { name: "Practice & Quiz", href: "/quiz", icon: HelpCircle, badge: "Adaptive" },
  { name: "Progress Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Knowledge Gaps", href: "/knowledge-gaps", icon: AlertTriangle },
  { name: "Recommendations", href: "/recommendations", icon: Lightbulb },
  { name: "Settings", href: "/settings", icon: Settings },
];

const RESEARCH_NAV: NavItem[] = [
  { name: "Admin Analytics", href: "/admin", icon: TrendingUp },
  { name: "Dataset Explorer", href: "/admin/dataset", icon: FileSpreadsheet },
  { name: "Model / RAG Eval", href: "/admin/evaluation", icon: Award, badge: "Metrics" },
  { name: "Ablation Study", href: "/admin/ablation", icon: Layers },
  { name: "Risk Analytics", href: "/admin/risk-analytics", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] sticky top-16 border-r border-border/70 glass-panel flex flex-col justify-between transition-all duration-300 z-40 select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        
        {/* Student Section */}
        <div>
          {!collapsed && (
            <h3 className="px-3 text-[11px] font-bold text-muted-foreground/80 tracking-wider uppercase mb-2">
              Student Platform
            </h3>
          )}
          <nav className="space-y-1">
            {STUDENT_NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                    active
                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-primary/80")} />
                  {!collapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                      active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin / Research Section */}
        <div className="pt-2 border-t border-border/50">
          {!collapsed && (
            <h3 className="px-3 text-[11px] font-bold text-muted-foreground/80 tracking-wider uppercase mb-2">
              Research & Admin
            </h3>
          )}
          <nav className="space-y-1">
            {RESEARCH_NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                    active
                      ? "bg-secondary text-white shadow-sm shadow-secondary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-secondary")} />
                  {!collapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                      active ? "bg-white/20 text-white" : "bg-secondary/10 text-secondary"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-border/60 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[11px] text-muted-foreground font-medium truncate">
              OULAD Engine: Online
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
