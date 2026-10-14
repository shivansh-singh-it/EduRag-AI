"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getModules } from "@/lib/api";
import {
  BookOpen,
  Award,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bot,
  ArrowRight,
  Sparkles,
  BarChart2,
} from "lucide-react";

export default function ModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await getModules();
        if (isMounted && res) {
          const raw = Array.isArray(res) ? res : res.modules || [];
          if (raw.length > 0) {
            setModules(raw);
          }
        }
      } catch (e) {
        console.warn("Using sample modules for OULAD:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultModules = [
    {
      code: "GGG",
      name: "Data Structures & Computational Problem Solving",
      domain: "STEM / Computing",
      credits: 30,
      length_days: 269,
      student_score: 68,
      completion: 52,
      status: "In Progress",
      description: "Fundamental data structures, computational complexity, memory management, and recursive problem decomposition.",
      topics: ["Arrays & Dynamic Lists", "Stacks & Queues", "Recursion", "Binary Search Trees", "Sorting & Searching"],
    },
    {
      code: "FFF",
      name: "Software Development & Programming Principles",
      domain: "STEM / Computing",
      credits: 60,
      length_days: 240,
      student_score: 74,
      completion: 65,
      status: "In Progress",
      description: "Core procedural and object-oriented programming concepts, clean code design, and testing methodologies.",
      topics: ["Object-Oriented Design", "Control Flow", "Functions & Scope", "Exception Handling", "Unit Testing"],
    },
    {
      code: "BBB",
      name: "Introduction to Social Sciences & Applied Research",
      domain: "Social Sciences",
      credits: 30,
      length_days: 268,
      student_score: 81,
      completion: 74,
      status: "In Progress",
      description: "Investigating social phenomena, qualitative and quantitative data methodologies, and research synthesis.",
      topics: ["Qualitative Inquiry", "Quantitative Sampling", "Ethical Frameworks", "Literature Synthesis"],
    },
    {
      code: "AAA",
      name: "Foundations in Higher Education & Academic Literacy",
      domain: "Arts & Humanities",
      credits: 60,
      length_days: 268,
      student_score: 86,
      completion: 100,
      status: "Completed",
      description: "Academic argument construction, peer-reviewed evaluation, critical reasoning, and scholarly presentation.",
      topics: ["Critical Discourse", "Peer Review Analysis", "Structured Argumentation", "Scholarly Writing"],
    },
  ];

  const displayList = modules.length > 0 ? modules : defaultModules;

  return (
    <AppShell
      title="Course Modules & Curriculum"
      subtitle="Explore OULAD modules, track module credit progress, and launch targeted tutoring sessions."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayList.map((m: any, idx: number) => {
          const isCompleted = m.status === "Completed";
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      Module {m.code}
                    </span>
                    <span className="text-xs text-muted-foreground">{m.domain}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mt-3 group-hover:text-primary transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {m.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-muted-foreground">Module Progress</span>
                    <span className="text-foreground font-bold">{m.completion}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                      style={{ width: `${m.completion}%` }}
                    />
                  </div>
                </div>

                {/* Key Syllabus Topics */}
                {m.topics && (
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                      Curricular Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.topics.map((t: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-muted/60 text-foreground font-mono text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-primary" /> {m.credits} Credits • {m.length_days} Days
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/tutor?module=${m.code}`}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" /> Tutor
                  </Link>
                  <Link
                    href={`/quiz?topic=${encodeURIComponent(m.topics ? m.topics[0] : m.name)}`}
                    className="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" /> Quiz
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
