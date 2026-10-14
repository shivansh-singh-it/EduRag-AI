"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  Clock,
  CheckCircle2,
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
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("all");

  const weeklyClicks = [
    { week: "W1", forum: 45, resource: 80, quiz: 20 },
    { week: "W2", forum: 60, resource: 110, quiz: 35 },
    { week: "W3", forum: 85, resource: 140, quiz: 40 },
    { week: "W4", forum: 70, resource: 95, quiz: 50 },
    { week: "W5", forum: 120, resource: 160, quiz: 85 },
    { week: "W6", forum: 110, resource: 150, quiz: 65 },
    { week: "W7", forum: 95, resource: 130, quiz: 45 },
  ];

  const resourceDistribution = [
    { name: "Forum Discussions", value: 380, color: "#6366f1" },
    { name: "Course Content / Subpage", value: 620, color: "#a855f7" },
    { name: "Interactive Quizzes", value: 240, color: "#06b6d4" },
    { name: "External Resources & URLs", value: 180, color: "#10b981" },
  ];

  const consistencyMetrics = [
    { day: "Mon", hours: 1.8, active: true },
    { day: "Tue", hours: 2.4, active: true },
    { day: "Wed", hours: 0.8, active: true },
    { day: "Thu", hours: 2.1, active: true },
    { day: "Fri", hours: 1.5, active: true },
    { day: "Sat", hours: 3.2, active: true },
    { day: "Sun", hours: 0.0, active: false },
  ];

  return (
    <AppShell
      title="Student Progress & VLE Analytics"
      subtitle="Comprehensive telemetry measuring learning interaction patterns and performance trajectories."
      actions={
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 transition-colors focus:outline-none"
          >
            <option value="all">Entire Term (OULAD Cohort)</option>
            <option value="recent">Last 4 Weeks</option>
          </select>
        </div>
      }
    >
      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-border/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total VLE Interactions
          </span>
          <div className="text-2xl font-black text-foreground mt-2">1,420 Clicks</div>
          <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% above cohort average
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Weekly Study Consistency
          </span>
          <div className="text-2xl font-black text-foreground mt-2">5.1 Days / Wk</div>
          <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High regularity signal
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Formative Assessment Accuracy
          </span>
          <div className="text-2xl font-black text-foreground mt-2">78.4%</div>
          <p className="text-xs text-muted-foreground mt-1">Over 38 total practice questions</p>
        </div>
      </div>

      {/* Main Charts: Activity Stacked Bar & Resource Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Clicks by Category */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                VLE Activity by Resource Type
              </h3>
              <p className="text-xs text-muted-foreground">Weekly interaction intensity across learning materials</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" /> Forums
              </span>
              <span className="flex items-center gap-1 text-secondary">
                <span className="w-2 h-2 rounded-full bg-secondary" /> Resources
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Quizzes
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyClicks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                <XAxis dataKey="week" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e2f",
                    borderRadius: "10px",
                    border: "1px solid #333355",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="forum" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} name="Forums" />
                <Bar dataKey="resource" stackId="a" fill="#a855f7" radius={[0, 0, 0, 0]} name="Resources" />
                <Bar dataKey="quiz" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Quizzes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Distribution Pie */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-secondary" />
              Engagement Proportion
            </h3>
            <p className="text-xs text-muted-foreground">Cumulative distribution of learning activities</p>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {resourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e2f",
                      borderRadius: "10px",
                      border: "1px solid #333355",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border/40 text-xs">
            {resourceDistribution.map((res, i) => (
              <div key={i} className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: res.color }} />
                  <span className="text-foreground font-medium">{res.name}</span>
                </span>
                <span>{res.value} clicks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Study Routine Heatmap Bar */}
      <div className="glass-card rounded-2xl p-6 border border-border/60">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-primary" />
          Weekly Study Distribution & Time Dedicated
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          Hours dedicated across weekdays indicating steady distributed learning habits
        </p>

        <div className="grid grid-cols-7 gap-3 text-center">
          {consistencyMetrics.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                day.hours > 0
                  ? "bg-card border-border/80 hover:border-primary/50"
                  : "bg-muted/20 border-border/40 opacity-50"
              }`}
            >
              <span className="text-xs font-bold text-muted-foreground block">{day.day}</span>
              <div className="text-lg font-black text-foreground mt-1">{day.hours}h</div>
              <div className="mt-2 w-full bg-muted rounded-full h-1 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${(day.hours / 3.5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
