"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getRecommendations } from "@/lib/api";
import {
  Sparkles,
  Clock,
  BookOpen,
  Award,
  Bot,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  type: string;
  duration: string;
  priority: string;
  module: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
  icon?: string;
}

const DEFAULT_RECS: Recommendation[] = [
  {
    id: "rec-1",
    title: "Targeted Revision: Recursion & Call Frames",
    type: "Concept Revision",
    duration: "20 min",
    priority: "High Priority",
    module: "GGG",
    rationale:
      "Your recent TMA 02 result and formative assessment showed difficulty with stack frame unwinding. Revise with the interactive AI Tutor.",
    actionLabel: "Launch Session with AI Tutor",
    actionHref: "/tutor?topic=Recursion%20and%20Call%20Frames",
    icon: "bot",
  },
  {
    id: "rec-2",
    title: "Adaptive Practice Quiz: Binary Search Trees",
    type: "Formative Quiz",
    duration: "10 min",
    priority: "Medium Priority",
    module: "GGG",
    rationale:
      "Strengthen your tree traversal skills before the upcoming TMA 03 submission deadline.",
    actionLabel: "Take Adaptive Quiz",
    actionHref: "/quiz?topic=Binary%20Search%20Trees",
    icon: "quiz",
  },
  {
    id: "rec-3",
    title: "Reading: Dynamic Programming Foundations",
    type: "Course Reading",
    duration: "25 min",
    priority: "Standard",
    module: "GGG",
    rationale:
      "Pre-reading Unit 4 course notes will prepare you for next week's computational problem-solving workshop.",
    actionLabel: "Read Course Notes",
    actionHref: "/tutor?topic=Dynamic%20Programming%20Notes",
    icon: "book",
  },
  {
    id: "rec-4",
    title: "Forum Engagement: Code Review Discussion",
    type: "VLE Engagement",
    duration: "15 min",
    priority: "Engagement Boost",
    module: "FFF",
    rationale:
      "Participating in student peer reviews increases retention and aligns with positive course completion trends in OULAD.",
    actionLabel: "Review Guidance",
    actionHref: "/tutor?topic=Python%20Peer%20Code%20Review",
    icon: "bot",
  },
];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(DEFAULT_RECS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await getRecommendations();
        if (isMounted && res) {
          const raw = Array.isArray(res) ? res : res.recommendations || [];
          if (raw.length > 0) {
            const normalized: Recommendation[] = raw.map((r: any, i: number) => ({
              id: r.id || `rec-${i}`,
              title: r.title || "Targeted Revision Activity",
              type: r.type || "Concept Revision",
              duration: r.duration || "20 min",
              priority: r.priority || "High Priority",
              module: r.module || "GGG",
              rationale:
                r.rationale ||
                r.reason ||
                "Recommended based on recent learning patterns and assessment performance.",
              actionLabel: r.actionLabel || r.action_label || "Start Study Session",
              actionHref:
                r.actionHref ||
                r.action_href ||
                `/tutor?topic=${encodeURIComponent(r.title || "Recursion")}`,
              icon: r.icon || "bot",
            }));
            setRecommendations(normalized);
          }
        }
      } catch (e) {
        console.warn("Using sample recommendations:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell
      title="Personalized Study Recommendations"
      subtitle="Prioritized learning activities generated dynamically based on your current knowledge gaps and academic timeline."
    >
      <div className="space-y-4">
        {recommendations.map((rec: Recommendation, idx: number) => {
          const isHigh = rec.priority === "High Priority";
          return (
            <div
              key={rec.id || idx}
              className={`p-6 rounded-2xl glass-card border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                isHigh
                  ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60 shadow-sm"
                  : "border-border/60 hover:border-primary/40"
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                    Module {rec.module}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isHigh
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {rec.duration}
                  </span>
                  <span className="text-xs text-muted-foreground">• {rec.type}</span>
                </div>

                <h3 className="text-base font-bold text-foreground">{rec.title}</h3>

                {/* Explainable AI rationale */}
                <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                  <strong className="text-foreground">Why this task: </strong>
                  {rec.rationale}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={rec.actionHref || "/tutor"}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {rec.actionLabel || "Study with AI Tutor"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
