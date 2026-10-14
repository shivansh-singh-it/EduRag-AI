"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getKnowledgeGaps } from "@/lib/api";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Bot,
  Award,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  BookOpen,
} from "lucide-react";

interface GapTopic {
  id: string;
  topic: string;
  module: string;
  status: string;
  mastery: number;
  confidence: string;
  why_identified: string;
  evidence: string[];
  recommendation: string;
  primaryAction: {
    label: string;
    href: string;
  };
}

const FALLBACK_GAP_TOPICS: GapTopic[] = [
  {
    id: "gap-1",
    topic: "Recursion & Call Stack Dynamics",
    module: "GGG",
    status: "Priority Gap",
    mastery: 42,
    confidence: "High Diagnostic Confidence",
    why_identified: "Identified due to sub-threshold performance in TMA 02 and repeated errors on recursive unwinding in formative quizzes.",
    evidence: [
      "TMA 02 Question 3 scored 52% (Base case logic missing)",
      "Call stack trace question missed on CMA 01",
      "Formative quiz attempts required 3 retries",
    ],
    recommendation: "Review beginner recursion conceptual analogy and complete 5 scaffolded call-stack trace exercises.",
    primaryAction: {
      label: "Study with AI Tutor",
      href: "/tutor?topic=Recursion%20and%20Call%20Stacks",
    },
  },
  {
    id: "gap-2",
    topic: "Dynamic Programming & Memoization",
    module: "GGG",
    status: "High Concern",
    mastery: 38,
    confidence: "Moderate Confidence",
    why_identified: "Identified as an upcoming topic where foundational recursion prerequisites have not yet achieved the 70% threshold.",
    evidence: [
      "Prerequisite 'Recursion' currently at 42% mastery",
      "VLE reading material for Unit 4 accessed only once",
    ],
    recommendation: "Build confidence with top-down Fibonacci memoization before tackling table-based 2D dynamic programming.",
    primaryAction: {
      label: "Study with AI Tutor",
      href: "/tutor?topic=Dynamic%20Programming%20Memoization",
    },
  },
  {
    id: "gap-3",
    topic: "Algorithmic Complexity & Big-O Bounds",
    module: "GGG",
    status: "Moderate Concern",
    mastery: 58,
    confidence: "High Diagnostic Confidence",
    why_identified: "Confusion between worst-case Big-O and average-case Big-Theta identified during recent quiz submission.",
    evidence: [
      "Formative quiz question on Quicksort worst case vs average case missed",
      "Assessment mark: 64%",
    ],
    recommendation: "Review the asymptotic growth visualization chart in the knowledge base.",
    primaryAction: {
      label: "Practice Big-O Quiz",
      href: "/quiz?topic=Algorithmic%20Complexity",
    },
  },
  {
    id: "str-1",
    topic: "Programming Fundamentals & Control Flow",
    module: "FFF",
    status: "Mastered",
    mastery: 94,
    confidence: "Verified",
    why_identified: "Demonstrated consistent mastery across all TMA and CMA assessments with zero remediation flags.",
    evidence: [
      "TMA 01 scored 92%",
      "100% completion of weekly programming exercises",
    ],
    recommendation: "Solid foundation established. Can be utilized as an anchor for advanced OOP concepts.",
    primaryAction: {
      label: "Review Advanced Notes",
      href: "/tutor?topic=Advanced%20Control%20Flow",
    },
  },
  {
    id: "str-2",
    topic: "Linear Data Structures (Arrays & Lists)",
    module: "GGG",
    status: "Mastered",
    mastery: 88,
    confidence: "Verified",
    why_identified: "Consistently high accuracy on sequential traversal, pointer manipulation, and indexing.",
    evidence: [
      "TMA 01 scored 86%",
      "Quiz accuracy: 90% across 10 questions",
    ],
    recommendation: "Ready to proceed to non-linear structures (Trees and Graphs).",
    primaryAction: {
      label: "Explore Trees",
      href: "/learning-path",
    },
  },
];

export default function KnowledgeGapsPage() {
  const [filter, setFilter] = useState<"all" | "weak" | "mastered">("all");
  const [gapTopics, setGapTopics] = useState<GapTopic[]>(FALLBACK_GAP_TOPICS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchGaps = async () => {
      try {
        setLoading(true);
        const res = await getKnowledgeGaps();
        if (isMounted && res) {
          const rawItems = Array.isArray(res) ? res : res.gaps || res.knowledge_gaps || [];
          if (rawItems.length > 0) {
            const mapped: GapTopic[] = rawItems.map((g: any, idx: number) => {
              const rawMastery = g.mastery ?? g.current_mastery ?? 50;
              const mastery = Math.round(Number(rawMastery));
              const isWeak = mastery < 70;
              const topicName = g.topic || g.topic_name || "Algorithmic Concept";

              return {
                id: g.id || g.topic_id || `gap-${idx}`,
                topic: topicName,
                module: g.module || "GGG",
                status: g.status || (isWeak ? "Priority Gap" : "Mastered"),
                mastery,
                confidence: g.confidence || "High Diagnostic Confidence",
                why_identified:
                  g.why_identified ||
                  g.rationale ||
                  "Identified from assessment performance metrics and quiz responses.",
                evidence: Array.isArray(g.evidence)
                  ? g.evidence
                  : typeof g.evidence === "string"
                  ? [g.evidence]
                  : ["Formative assessment evaluation", "VLE learning trace telemetry"],
                recommendation:
                  g.recommendation ||
                  g.suggested_action ||
                  "Review concepts and practice targeted questions.",
                primaryAction: {
                  label:
                    g.primaryAction?.label ||
                    (isWeak ? "Study with AI Tutor" : "Review Concepts"),
                  href:
                    g.primaryAction?.href ||
                    (isWeak
                      ? `/tutor?topic=${encodeURIComponent(topicName)}`
                      : "/learning-path"),
                },
              };
            });
            setGapTopics(mapped);
          }
        }
      } catch (err) {
        console.warn("Using fallback knowledge gap topics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGaps();
    return () => {
      isMounted = false;
    };
  }, []);

  const weakCount = gapTopics.filter((g) => g.mastery < 70).length;
  const masteredCount = gapTopics.filter((g) => g.mastery >= 70).length;

  const filtered =
    filter === "all"
      ? gapTopics
      : filter === "weak"
      ? gapTopics.filter((g) => g.mastery < 70)
      : gapTopics.filter((g) => g.mastery >= 70);

  return (
    <AppShell
      title="Knowledge Gap Analysis"
      subtitle="Explainable diagnostic matrix highlighting strengths, weaknesses, and evidence-backed remediation pathways."
      actions={
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "all" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Topics ({gapTopics.length})
          </button>
          <button
            onClick={() => setFilter("weak")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "weak" ? "bg-amber-500 text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Gaps ({weakCount})
          </button>
          <button
            onClick={() => setFilter("mastered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "mastered" ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mastered ({masteredCount})
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {filtered.map((item) => {
          const isWeak = item.mastery < 70;
          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl glass-card border transition-all ${
                isWeak
                  ? "border-amber-500/40 hover:border-amber-500/60 bg-amber-500/5"
                  : "border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-500/5"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                      Module {item.module}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isWeak ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-muted-foreground">• {item.confidence}</span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mt-2">{item.topic}</h3>
                </div>

                {/* Mastery Gauge */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Topic Mastery</div>
                    <div
                      className={`text-2xl font-black ${
                        isWeak ? "text-amber-500" : "text-emerald-500"
                      }`}
                    >
                      {item.mastery}%
                    </div>
                  </div>
                  <div className="w-20 bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isWeak ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, Math.max(0, item.mastery))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rationale & Evidence Grid */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Why Identified */}
                <div className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    Diagnostic Rationale
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.why_identified}</p>
                </div>

                {/* Concrete Evidence */}
                <div className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    Supporting OULAD Evidence
                  </div>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {item.evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-foreground font-medium">
                  <strong>Recommended Step:</strong> {item.recommendation}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={item.primaryAction.href}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    {item.primaryAction.label}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
