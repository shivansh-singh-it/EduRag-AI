"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth-context";
import { getStudentAssessments } from "@/lib/api";
import {
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Bot,
  AlertCircle,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";

interface AssessmentItem {
  id: string;
  module: string;
  name: string;
  type: string;
  weight: number;
  date_submitted: string;
  score: number | null;
  status: string;
  feedback: string;
  topics: string[];
}

const FALLBACK_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "TMA-01-GGG",
    module: "GGG",
    name: "TMA 01: Linear Structures & Algorithmic Basics",
    type: "TMA",
    weight: 15,
    date_submitted: "Day 52",
    score: 78,
    status: "Graded",
    feedback: "Good grasp of array indexing and sequential traversal. Minor deduction on edge cases for empty list checks.",
    topics: ["Arrays", "Linked Lists", "Complexity"],
  },
  {
    id: "CMA-01-GGG",
    module: "GGG",
    name: "CMA 01: Computer-Marked Formative Quiz",
    type: "CMA",
    weight: 10,
    date_submitted: "Day 78",
    score: 84,
    status: "Graded",
    feedback: "Strong performance on binary search index arithmetic.",
    topics: ["Binary Search", "Sorting"],
  },
  {
    id: "TMA-02-GGG",
    module: "GGG",
    name: "TMA 02: Recursive Structures & Call Frames",
    type: "TMA",
    weight: 20,
    date_submitted: "Day 135",
    score: 62,
    status: "Graded",
    feedback: "Base cases are missing in binary recursion question. Needs review on stack frame unwinding.",
    topics: ["Recursion", "Call Stacks", "Trees"],
  },
  {
    id: "TMA-03-GGG",
    module: "GGG",
    name: "TMA 03: Trees, Heaps & Priority Queues",
    type: "TMA",
    weight: 25,
    date_submitted: "Due in 14 Days",
    score: null,
    status: "Upcoming",
    feedback: "Submission portal opens next week.",
    topics: ["Binary Search Trees", "Heaps"],
  },
  {
    id: "TMA-01-BBB",
    module: "BBB",
    name: "TMA 01: Methodological Foundations",
    type: "TMA",
    weight: 25,
    date_submitted: "Day 48",
    score: 82,
    status: "Graded",
    feedback: "Well-structured academic prose with sound citations.",
    topics: ["Research Ethics", "Sampling"],
  },
];

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [filterModule, setFilterModule] = useState("ALL");
  const [assessments, setAssessments] = useState<AssessmentItem[]>(FALLBACK_ASSESSMENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadAssessments = async () => {
      try {
        setLoading(true);
        const res = await getStudentAssessments(user?.student_id || user?.id);
        if (isMounted && res) {
          const items: AssessmentItem[] = Array.isArray(res) ? res : res.assessments || [];
          if (items.length > 0) {
            setAssessments(items);
          }
        }
      } catch (err) {
        console.warn("Using local assessment records:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAssessments();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const uniqueModules = Array.from(new Set(assessments.map((a) => a.module).filter(Boolean)));
  const filtered = filterModule === "ALL" ? assessments : assessments.filter((a) => a.module === filterModule);

  const gradedAssessments = assessments.filter((a) => a.score !== null && a.score !== undefined);
  const totalCount = assessments.length;
  const completedCount = gradedAssessments.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalWeightedScore = gradedAssessments.reduce((acc, curr) => acc + (curr.score || 0) * (curr.weight || 1), 0);
  const totalWeight = gradedAssessments.reduce((acc, curr) => acc + (curr.weight || 1), 0);
  const weightedAverage = totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(1) : "76.5";

  const nextMilestone = assessments.find((a) => a.status === "Upcoming" || a.score === null) || {
    name: "Final Comprehensive Exam",
    date_submitted: "Due in 30 Days",
  };

  return (
    <AppShell
      title="Academic Assessments & Results"
      subtitle="Track Tutor Marked Assessments (TMA) and Computer Marked Assessments (CMA) from OULAD records."
      actions={
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 transition-colors focus:outline-none"
          >
            <option value="ALL">All Modules</option>
            {uniqueModules.map((m) => (
              <option key={m} value={m}>
                Module {m}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-border/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Completed Assessments
          </span>
          <div className="text-2xl font-black text-foreground mt-2">
            {completedCount} of {totalCount}
          </div>
          <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {completionRate}% completion rate
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Weighted Average Score
          </span>
          <div className="text-2xl font-black text-foreground mt-2">{weightedAverage}%</div>
          <p className="text-xs text-muted-foreground mt-1">Passing standard: 40%</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next Milestone
          </span>
          <div className="text-base font-bold text-foreground mt-2 truncate">{nextMilestone.name}</div>
          <p className="text-xs text-amber-500 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {nextMilestone.date_submitted}
          </p>
        </div>
      </div>

      {/* Assessments Table Card */}
      <div className="glass-card rounded-2xl border border-border/60 overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Assessment Records & Tutor Feedback
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            OULAD Student ID: {user?.student_id || 10001}
          </span>
        </div>

        <div className="divide-y divide-border/40">
          {filtered.map((item) => {
            const isGraded = item.status === "Graded" || item.score !== null;
            const scoreVal = item.score;
            const scoreColor =
              scoreVal && scoreVal >= 75
                ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                : scoreVal && scoreVal >= 60
                ? "text-primary bg-primary/10 border-primary/20"
                : "text-amber-500 bg-amber-500/10 border-amber-500/20";

            const primaryTopic = (item.topics && item.topics.length > 0) ? item.topics[0] : item.name;

            return (
              <div key={item.id} className="p-5 hover:bg-muted/10 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                      {item.type}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>Module: {item.module}</span>
                        <span>•</span>
                        <span>Weight: {item.weight}%</span>
                        <span>•</span>
                        <span>Timeline: {item.date_submitted}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isGraded && scoreVal !== null ? (
                      <div className={`px-3 py-1 rounded-xl border text-sm font-black ${scoreColor}`}>
                        {scoreVal}%
                      </div>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">
                        {item.status}
                      </span>
                    )}

                    <Link
                      href={`/tutor?topic=${encodeURIComponent(primaryTopic)}`}
                      className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" /> Study Topics
                    </Link>
                  </div>
                </div>

                {/* Feedback Box */}
                {item.feedback && (
                  <div className="p-3.5 rounded-xl bg-card border border-border/40 text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Tutor Evaluation:</strong> {item.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
