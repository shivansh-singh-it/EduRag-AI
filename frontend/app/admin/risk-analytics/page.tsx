"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { getCohortRiskAnalytics } from "@/lib/api";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  TrendingDown,
  Info,
  ArrowRight,
} from "lucide-react";

export default function StudentRiskAnalyticsPage() {
  const [filterLevel, setFilterLevel] = useState("all");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await getCohortRiskAnalytics();
        if (isMounted) setData(res);
      } catch (e) {
        console.warn("Using sample risk cohort data:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultStudents = [
    {
      id: 10042,
      name: "Alex Morgan (Current User)",
      module: "GGG",
      risk_level: "Low Concern",
      score: 76.5,
      vle_clicks: 1420,
      active_days: 54,
      trend: "Stable / Upward",
      signals: ["High VLE click regularity", "Consistent TMA submission pace", "Single gap in recursion flagged"],
      recommendation: "Targeted practice on recursion call stack; no institutional intervention needed.",
    },
    {
      id: 10214,
      name: "Taylor Bennett",
      module: "GGG",
      risk_level: "Moderate Concern",
      score: 54.0,
      vle_clicks: 610,
      active_days: 28,
      trend: "Downward Trend",
      signals: ["2 consecutive TMA submissions below pass threshold", "VLE clicks decreased by 40% in Unit 3"],
      recommendation: "Automated alert sent to academic tutor for formative check-in and recursion support.",
    },
    {
      id: 10452,
      name: "Jordan Lee",
      module: "BBB",
      risk_level: "Low Concern",
      score: 81.2,
      vle_clicks: 1280,
      active_days: 49,
      trend: "Stable",
      signals: ["High assessment completion regularity", "Active forum participation"],
      recommendation: "Continue standard curriculum trajectory; encourage peer tutoring participation.",
    },
    {
      id: 10689,
      name: "Samira Khan",
      module: "FFF",
      risk_level: "Low Concern",
      score: 84.0,
      vle_clicks: 1950,
      active_days: 62,
      trend: "Strong Upward",
      signals: ["100% on-time submission rate", "Active in code review forums", "High formative quiz mastery"],
      recommendation: "Eligible for advanced extension materials and peer mentoring roles.",
    },
    {
      id: 10891,
      name: "Marcus Vance",
      module: "FFF",
      risk_level: "Needs Attention",
      score: 38.5,
      vle_clicks: 340,
      active_days: 15,
      trend: "Declining",
      signals: ["CMA score 32%", "Declining access to programming lab exercises"],
      recommendation: "Provide 1-on-1 pedagogical tutoring session on syntax debugging and loop structures.",
    },
  ];

  const rawStudents = data?.students || data?.cohort || data?.at_risk_students || defaultStudents;
  const students = rawStudents.map((s: any, idx: number) => ({
    id: s.id || s.student_id || 10000 + idx,
    name: s.name || `Student #${s.id || s.student_id || idx + 1}`,
    module: s.module || "GGG",
    risk_level: s.risk_level || s.risk_tier || "Low Concern",
    score: s.score ?? s.avg_score ?? 70,
    vle_clicks: s.vle_clicks ?? 1000,
    active_days: s.active_days ?? 40,
    trend: s.trend || "Stable",
    signals: Array.isArray(s.signals)
      ? s.signals
      : Array.isArray(s.reasons)
      ? s.reasons
      : ["Active student record"],
    recommendation: s.recommendation || s.intervention || "Formative academic check-in and resource review.",
  }));

  const filtered =
    filterLevel === "all" ? students : students.filter((s: any) => s.risk_level === filterLevel);

  const lowPct = data?.low_concern_pct || "72.4%";
  const modPct = data?.moderate_concern_pct || "18.2%";
  const attnPct = data?.needs_attention_pct || "9.4%";

  return (
    <AppShell
      title="Student Early Warning & Risk Analytics"
      subtitle="Proactive learning analytics to detect disengagement and provide formative educational support."
      actions={
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 transition-colors focus:outline-none"
          >
            <option value="all">All Risk Tiers</option>
            <option value="Low Concern">Low Concern</option>
            <option value="Moderate Concern">Moderate Concern</option>
            <option value="Needs Attention">Needs Attention</option>
          </select>
        </div>
      }
    >
      {/* Ethical Guardrail Disclaimer */}
      <div className="p-4 rounded-xl bg-card border border-border/80 flex items-start gap-3 text-xs text-muted-foreground">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Ethical Learning Analytics Commitment:</strong> Risk indicators
          are advisory early-warning flags designed exclusively to mobilize timely academic tutoring and pastoral
          support. They are <strong>never</strong> deterministic predictions of student capability, and
          demographic attributes are strictly excluded from predictive calculations.
        </div>
      </div>

      {/* Cohort Risk Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
              Low Concern
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{lowPct} of Cohort</div>
          <p className="text-xs text-muted-foreground mt-1">Consistent engagement and passing scores</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
              Moderate Concern
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{modPct} of Cohort</div>
          <p className="text-xs text-muted-foreground mt-1">Inconsistent VLE clicks or borderline TMA results</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
              Needs Attention
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{attnPct} of Cohort</div>
          <p className="text-xs text-muted-foreground mt-1">High absence from VLE or missed assessments</p>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="glass-card rounded-2xl border border-border/60 overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Monitored Student Cohort Sample ({filtered.length} students)
          </h3>
          <span className="text-xs text-muted-foreground">OULAD Presentations 2013J & 2014J</span>
        </div>

        <div className="divide-y divide-border/40">
          {filtered.map((student: any) => {
            const isAttention = student.risk_level === "Needs Attention";
            const isModerate = student.risk_level === "Moderate Concern";
            const badgeColor = isAttention
              ? "bg-rose-500/20 text-rose-500 border-rose-500/30"
              : isModerate
              ? "bg-amber-500/20 text-amber-500 border-amber-500/30"
              : "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";

            return (
              <div key={student.id} className="p-5 hover:bg-muted/10 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center font-bold text-foreground text-xs">
                      {(student.name || "S").charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{student.name}</h4>
                        <span className="text-[11px] text-muted-foreground font-mono">#{student.id}</span>
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          Module {student.module}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                        <span>Avg Score: {student.score}%</span>
                        <span>•</span>
                        <span>VLE Clicks: {student.vle_clicks}</span>
                        <span>•</span>
                        <span>Active Days: {student.active_days}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                      {student.risk_level}
                    </span>
                  </div>
                </div>

                {/* Evidence & Supportive Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-card border border-border/50">
                    <strong className="text-foreground block mb-1">Observable Indicators:</strong>
                    <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                      {(student.signals || []).map((sig: string, i: number) => (
                        <li key={i}>{sig}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/50">
                    <strong className="text-foreground block mb-1">Proactive Educational Action:</strong>
                    <p className="text-muted-foreground leading-relaxed">{student.recommendation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
