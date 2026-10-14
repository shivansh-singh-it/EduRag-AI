"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth-context";
import { getStudentDashboard } from "@/lib/api";
import {
  TrendingUp,
  Flame,
  Award,
  Activity,
  Bot,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "modules">("overview");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const studentIdToQuery = user?.student_id || user?.id || 10001;
        const res = await getStudentDashboard(studentIdToQuery);
        if (isMounted) setData(res);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fallback / Sample state if API takes a second or during load
  const profile = data?.profile || {
    name: user?.name || "Alex Morgan",
    proficiency_level: "Intermediate",
    confidence_score: 0.82,
    avg_score: 76.5,
    total_interactions: 1420,
    streak_days: 7,
    risk_level: "Low Concern",
    strengths: ["Programming Fundamentals", "Data Structures Basics", "Iterative Logic"],
    weaknesses: ["Recursion & Call Stacks", "Dynamic Programming", "Algorithmic Complexity"],
  };

  const insights = data?.insights || [
    {
      title: "Strong Assessment Momentum",
      description: "Your score in the recent Module BBB TMA increased by 14% compared to baseline.",
      type: "positive",
      metric: "+14% score",
    },
    {
      title: "VLE Engagement Consistency",
      description: "You accessed forum resources and course materials across 5 of the past 7 days.",
      type: "neutral",
      metric: "5 / 7 active days",
    },
    {
      title: "Recursion Revision Priority",
      description: "Assessment analysis shows recursion challenges; review the beginner recursion guide.",
      type: "action",
      metric: "Topic gap: 42%",
    },
  ];

  const trendData = data?.trend_data || [
    { name: "W1", score: 62, cohort: 60, clicks: 120 },
    { name: "W2", score: 68, cohort: 62, clicks: 180 },
    { name: "W3", score: 71, cohort: 64, clicks: 230 },
    { name: "W4", score: 69, cohort: 65, clicks: 190 },
    { name: "W5", score: 75, cohort: 66, clicks: 310 },
    { name: "W6", score: 82, cohort: 68, clicks: 280 },
    { name: "W7", score: 78, cohort: 67, clicks: 250 },
  ];

  const moduleData = data?.modules || [
    { code: "BBB", name: "Intro to Social Sciences & Tech", score: 81, completion: 74, status: "Active" },
    { code: "FFF", name: "STEM: Computer Programming", score: 74, completion: 65, status: "Active" },
    { code: "GGG", name: "Data Structures & Principles", score: 68, completion: 52, status: "Needs Practice" },
  ];

  const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#3b82f6"];

  return (
    <AppShell
      title={`Welcome back, ${user?.name || "Alex"}`}
      subtitle="Here is your personalized academic standing, learning momentum, and AI recommendations."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/tutor"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <Bot className="w-4 h-4" />
            Launch AI Tutor
          </Link>
        </div>
      }
    >
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Proficiency Card */}
        <div className="p-5 rounded-2xl glass-card border border-border/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proficiency</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-foreground">{profile.proficiency_level}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{Math.round(profile.confidence_score * 100)}% engine confidence</span>
            </div>
          </div>
        </div>

        {/* Average Performance */}
        <div className="p-5 rounded-2xl glass-card border border-border/60 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Score</span>
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-foreground">{profile.avg_score}%</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-500 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+6.2% vs cohort average</span>
            </div>
          </div>
        </div>

        {/* VLE Engagement */}
        <div className="p-5 rounded-2xl glass-card border border-border/60 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">VLE Clicks</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-foreground">{profile.total_interactions.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <span>88th percentile activity</span>
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="p-5 rounded-2xl glass-card border border-border/60 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-foreground">{profile.streak_days} Days</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-medium">
              <span>Consistent momentum</span>
            </div>
          </div>
        </div>

        {/* Early Warning Risk */}
        <div className="p-5 rounded-2xl glass-card border border-border/60 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk Status</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-emerald-500">{profile.risk_level}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <span>On-track for module credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Performance Chart & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance & Engagement Trends (2 cols) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Academic Performance & VLE Activity
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Assessment scores vs cohort benchmark across course timeline (OULAD weeks)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Alex Score
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Cohort Avg
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} domain={[40, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e2f",
                    borderRadius: "12px",
                    border: "1px solid #333355",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGrad)"
                  name="Student Score"
                />
                <Area
                  type="monotone"
                  dataKey="cohort"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={0}
                  name="Cohort Average"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Module Performance Quick Bar */}
          <div className="mt-6 pt-5 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {moduleData.map((m: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-card border border-border/40 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">Module {m.code}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {m.score}% avg
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate mt-1">{m.name}</div>
                <div className="mt-2.5 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${m.completion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Learning Insights & Explanations (1 col) */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                Explainable Insights
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-semibold">
                PRAG-EDU
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {insights.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-card border border-border/40 hover:border-border transition-colors text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      {item.type === "positive" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {item.type === "action" && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                      {item.type === "neutral" && <Activity className="w-3.5 h-3.5 text-primary" />}
                      {item.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.metric}</span>
                  </div>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/50">
            <Link
              href="/knowledge-gaps"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 text-primary font-semibold text-xs hover:bg-primary/20 transition-colors"
            >
              <span>Explore Knowledge Gap Matrix</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Knowledge Gaps & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Gaps Card */}
        <div className="glass-card rounded-2xl p-6 border border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground text-base">Key Knowledge Gaps</h3>
              <p className="text-xs text-muted-foreground">Topics identified for reinforcement before next assessment</p>
            </div>
            <Link href="/knowledge-gaps" className="text-xs text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {profile.weaknesses.map((topic: string, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/40 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">{topic}</span>
                    <span className="text-[11px] text-muted-foreground">Assigned priority based on quiz & assessment scores</span>
                  </div>
                </div>
                <Link
                  href={`/tutor?topic=${encodeURIComponent(topic)}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Ask Tutor
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Next Recommended Actions */}
        <div className="glass-card rounded-2xl p-6 border border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground text-base">Next Recommended Tasks</h3>
              <p className="text-xs text-muted-foreground">Personalized schedule generated by recommendation engine</p>
            </div>
            <Link href="/recommendations" className="text-xs text-primary font-semibold hover:underline">
              View Full Queue
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-card border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Revise Recursion & Call Stacks</h4>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 20 min</span>
                    <span>•</span>
                    <span className="text-amber-500 font-medium">High Priority</span>
                  </p>
                </div>
              </div>
              <Link
                href="/learning-path"
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Adaptive Quiz: Data Structures</h4>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10 min</span>
                    <span>•</span>
                    <span>Intermediate difficulty</span>
                  </p>
                </div>
              </div>
              <Link
                href="/quiz?topic=Data%20Structures"
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
