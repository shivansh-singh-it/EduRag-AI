"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getEvaluationMetrics, getABComparison } from "@/lib/api";
import {
  FlaskConical,
  Award,
  Sparkles,
  BarChart3,
  Bot,
  Info,
  CheckCircle2,
  ArrowRight,
  Split,
  FileCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ModelEvaluationPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [abData, setAbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [mRes, abRes] = await Promise.all([getEvaluationMetrics(), getABComparison()]);
        if (isMounted) {
          setMetrics(mRes);
          setAbData(abRes);
        }
      } catch (e) {
        console.warn("Using sample evaluation metrics:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const benchmarkData = [
    { metric: "BERTScore F1", generic: 0.74, prag_edu: 0.88 },
    { metric: "ROUGE-L", generic: 0.32, prag_edu: 0.54 },
    { metric: "METEOR", generic: 0.28, prag_edu: 0.46 },
    { metric: "BLEU-4", generic: 0.22, prag_edu: 0.39 },
  ];

  const qualitativeMetrics = [
    { name: "Mean Rating Score (1-5)", value: "4.62 / 5.0", delta: "+1.14 vs Generic" },
    { name: "Bayesian Average Rating", value: "4.51 / 5.0", delta: "+0.98 vs Generic" },
    { name: "High-Quality Response Rate", value: "91.4%", delta: "+28.2% gain" },
    { name: "Perfect Alignment Rate", value: "86.8%", delta: "Calibrated to proficiency" },
  ];

  const abComparison = abData || {
    question: "What is recursion and how should I trace it?",
    student_profile: {
      name: "Alex Morgan",
      level: "Intermediate",
      strengths: "Programming fundamentals, Iterative logic",
      weakness: "Call stack activation records, Base case reasoning",
    },
    generic_response: `Recursion is a programming technique where a function calls itself directly or indirectly. It requires a base case to terminate and a recursive case that moves towards the base case. Common examples include factorial, fibonacci, and tree traversals. In memory, each recursive call consumes stack space. If too many calls are made without reaching the base case, a stack overflow error occurs.`,
    personalized_response: `Let's break down **recursion** specifically focusing on the **call stack frames** where you've noted questions in Module GGG.

### 1. The Call Stack Mechanics
Every time your function calls itself, Python places a new **activation record (stack frame)** on top of the call stack. This frame stores:
- The parameter values for that invocation
- Local variables
- The return address to resume execution

### 2. Concrete Example: Countdown with Call Stack Trace
\`\`\`python
def countdown(n):
    # Base Case: Terminates stack growth
    if n <= 0:
        print("Blastoff!")
        return
    print(f"Pushing frame: countdown({n})")
    countdown(n - 1)  # Recursive Step
    print(f"Popping frame: countdown({n})")

countdown(2)
\`\`\`

### 3. Step-by-Step Frame Trace:
1. \`countdown(2)\` is pushed onto stack.
2. \`countdown(1)\` is pushed on top.
3. \`countdown(0)\` hits the **base case** and returns.
4. Frames unwind in **Last-In, First-Out (LIFO)** order.

*Pedagogical note: Focus on identifying the base case before writing recursive transitions.*`,
    retrieved_sources: [
      { module: "GGG", title: "Unit 3: Stack Activation Records & Function Calls" },
      { module: "GGG", title: "TMA 02 Model Solutions: Base Case Verification" },
    ],
  };

  return (
    <AppShell
      title="Model & RAG Evaluation"
      subtitle="Empirical benchmark suite inspired by the PRAG-EDU paper comparing vanilla LLM generation against context-aware RAG."
      actions={
        <Link
          href="/admin/ablation"
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors flex items-center gap-1.5"
        >
          <FlaskConical className="w-3.5 h-3.5" /> View Ablation Study
        </Link>
      }
    >
      {/* Research Label Banner */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3 text-xs text-primary">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Evaluation Methodology Disclaimer:</strong> Quantitative metrics below follow the evaluation
          protocol established in <em>&quot;Towards Personalized AI Education: Context-Aware Retrieval-Augmented Generation
          With Grade-Level LLM Adaptation&quot;</em>. All values in this demonstration platform are illustrative and
          grounded on OULAD-adapted evaluation prompts.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {qualitativeMetrics.map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-card border border-border/60">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              {item.name}
            </span>
            <div className="text-2xl font-black text-foreground mt-2">{item.value}</div>
            <div className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {item.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Quantitative Benchmark Chart */}
      <div className="glass-card rounded-2xl p-6 border border-border/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Comparative RAG Metrics: PRAG-EDU vs Generic LLM
            </h3>
            <p className="text-xs text-muted-foreground">Standardized NLP similarity and alignment scores</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> PRAG-EDU (Personalized)
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Generic LLM Baseline
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
              <XAxis dataKey="metric" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} domain={[0, 1.0]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e2f",
                  borderRadius: "10px",
                  border: "1px solid #333355",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="prag_edu" fill="#6366f1" radius={[4, 4, 0, 0]} name="PRAG-EDU" />
              <Bar dataKey="generic" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Generic Baseline" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive A/B Comparison Visualizer */}
      <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Split className="w-5 h-5 text-secondary" />
              Side-by-Side Response Comparison (A/B Test)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Evaluating how prompt conditioning adapts tone and pedagogical structure for student Alex Morgan
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-card border border-border">
            Prompt: &quot;{abComparison.question}&quot;
          </span>
        </div>

        {/* Student Context Card */}
        <div className="p-3.5 rounded-xl bg-card border border-border/50 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-foreground">Target Student: {abComparison.student_profile.name}</span>
            <span>•</span>
            <span className="text-primary font-semibold">Proficiency: {abComparison.student_profile.level}</span>
            <span>•</span>
            <span className="text-amber-500 font-medium">Target Gap: {abComparison.student_profile.weakness}</span>
          </div>
        </div>

        {/* The Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generic Response */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs mb-3">
                <span className="font-bold text-muted-foreground">Generic Vanilla LLM Response</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  No Student Profile / No RAG
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {abComparison.generic_response}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
              ⚠️ General definition without addressing specific stack frame gaps or course syllabus.
            </div>
          </div>

          {/* PRAG-EDU Personalized Response */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/40 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs mb-3">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> PRAG-EDU Personalized Response
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  Context-Aware RAG
                </span>
              </div>
              <div className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                {abComparison.personalized_response}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-primary flex flex-wrap items-center gap-2">
              <span className="font-bold">Retrieved Context:</span>
              {abComparison.retrieved_sources.map((src: any, i: number) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-primary/10 font-mono text-[10px]">
                  [{src.module}] {src.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
