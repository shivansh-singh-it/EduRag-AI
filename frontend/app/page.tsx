"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Brain, Sparkles, ArrowRight, BookOpen, Award, TrendingUp, 
  CheckCircle2, Compass, Layers, ShieldCheck, Flame, Cpu, 
  HelpCircle, Lightbulb, PlayCircle, BarChart3, Database
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  const [selectedTier, setSelectedTier] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  const tierExamples = {
    beginner: {
      label: "Beginner Level (0-39% / Foundational)",
      badgeColor: "bg-red-500/10 text-red-500 border-red-500/20",
      analogy: "Like a treasure hunt with clue cards leading from one spot to the next.",
      diagram: "[Head: 10 | Next] ---> [20 | Next] ---> [30 | None]",
      code: "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\n# Pointing nodes in simple sequence:\nhead = Node(10)\nhead.next = Node(20)",
      focus: "Simple analogy, concrete node visualization, 0 jargon."
    },
    intermediate: {
      label: "Intermediate Level (60-74% / Core CS)",
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      analogy: "Discrete heap-allocated nodes decoupling list size from contiguous virtual memory.",
      diagram: "Random Access: O(n) | Head Insertion: O(1) | Tail Traversal: O(n)",
      code: "def insert_at_head(self, data):\n    new_node = Node(data)\n    new_node.next = self.head\n    self.head = new_node\n\n# Connects to recursive traversal:\ndef traverse(node):\n    if not node: return\n    process(node.data)\n    traverse(node.next)",
      focus: "Memory trade-offs, pointer reassignment mechanics, Big-O complexity."
    },
    advanced: {
      label: "Advanced Level (75-100% / Systems)",
      badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      analogy: "Pointer chasing topology inducing L1/L2 cache line misses & memory fragmentation.",
      diagram: "64-byte Cache Lines: Arrays prefetch O(1) | Linked Lists incur serialized bus stalls",
      code: "# Lock-Free Atomic CAS Insertion (Harris's Algorithm)\nwhile True:\n    succ = curr.next.get_reference()\n    if curr.next.compare_and_set(succ, new_node, False, False):\n        break",
      focus: "Cache line mechanics, 64-bit alignment overhead, lock-free concurrent structures."
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 gradient-bg-hero border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspired by PRAG-EDU Research Paper • Calibrated on OULAD</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6">
              Learn Smarter. <br />
              <span className="gradient-text-primary">Learn Your Way.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              An AI-powered personalized learning platform that understands your academic performance, 
              learning behavior, and knowledge gaps to create an educational experience tailored to you.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tutor"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-card hover:bg-muted text-foreground border border-border/80 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Brain className="w-4 h-4 text-primary" />
                <span>Explore AI Tutor</span>
              </Link>
            </div>

            {/* Hero Interactive Dashboard Preview Card */}
            <div className="max-w-5xl mx-auto glass-card rounded-2xl p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden border border-white/10 dark:border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/50 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-lg shadow-md">
                    AM
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                      Alex Morgan
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/20">
                        Intermediate Tier
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Module FFF: Computer Science & Software Systems • Student ID: 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
                    <span className="text-muted-foreground block text-[10px]">Model Confidence</span>
                    <span className="font-bold text-primary">78% Confidence</span>
                  </div>
                  <div className="bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
                    <span className="text-muted-foreground block text-[10px]">Learning Streak</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" /> 7 Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of 3 live preview widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                
                {/* 1. Proficiency & Insights */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Proficiency Signals</span>
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Assessment Avg</span>
                        <span className="font-semibold">71.0%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "71%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">VLE Engagement</span>
                        <span className="font-semibold">380 clicks</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground/90 bg-primary/5 p-2 rounded-lg border border-primary/10">
                    "Identified knowledge gap in Recursion. System automatically adapts AI explanations to reinforce base cases."
                  </p>
                </div>

                {/* 2. Knowledge Gaps Radar Preview */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Knowledge Gap Status</span>
                    <BarChart3 className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-1.5 rounded bg-card border border-border">
                      <span className="font-medium truncate">Python Basics</span>
                      <span className="text-emerald-500 font-bold text-[11px]">92% Mastered</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-card border border-border">
                      <span className="font-medium truncate">Data Structures</span>
                      <span className="text-blue-500 font-bold text-[11px]">74% Solid</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-amber-500/10 border border-amber-500/20">
                      <span className="font-medium truncate text-amber-600 dark:text-amber-400">Recursion</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">42% Needs Practice</span>
                    </div>
                  </div>
                </div>

                {/* 3. AI Tutor Adaptive Prompt Preview */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active RAG Grounding</span>
                    <Cpu className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground bg-card p-2.5 rounded-lg border border-border leading-relaxed">
                    <span className="text-primary font-bold">[PRAG-EDU Context]:</span><br />
                    • Target Level: Intermediate<br />
                    • Scaffolding: Call Stack frames<br />
                    • Source: OU FFF Unit 3 (p. 14)<br />
                    • Math: {"$\\mathcal{O}(n)$"} space
                  </div>
                  <Link
                    href="/tutor?topic=Recursion"
                    className="w-full py-1.5 rounded-lg text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-center block transition-colors"
                  >
                    Open Live Tutor Session →
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* Interactive Grade-Level Adaptation Demo Widget */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">
              See Grade-Level LLM Adaptation in Action
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              In standard LLMs, every student receives the same one-size-fits-all answer. 
              EduRAG AI uses the <strong>PRAG-EDU architecture</strong> to dynamically calibrate explanation depth, 
              code complexity, analogies, and mathematical rigor to each student's proficiency signals.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto border border-border">
            
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-6 border-b border-border gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground block">Target Query:</span>
                <span className="text-lg font-bold">"What is a Linked List?"</span>
              </div>

              {/* Tier Toggle Switch */}
              <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl">
                {(["beginner", "intermediate", "advanced"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      selectedTier === tier
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Adapted Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${tierExamples[selectedTier].badgeColor}`}>
                  {tierExamples[selectedTier].label}
                </span>
                <span className="text-xs text-muted-foreground">
                  Focus: {tierExamples[selectedTier].focus}
                </span>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border space-y-3">
                <p className="text-xs sm:text-sm text-foreground/90 font-medium">
                  <strong>Pedagogical Analogy:</strong> {tierExamples[selectedTier].analogy}
                </p>
                <div className="bg-muted/50 p-2.5 rounded-lg font-mono text-xs text-muted-foreground">
                  {tierExamples[selectedTier].diagram}
                </div>
                <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto font-mono">
                  <code>{tierExamples[selectedTier].code}</code>
                </pre>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>📚 Grounded in Open University Unit 4 Course Materials</span>
              <Link href="/tutor" className="text-primary font-bold hover:underline">
                Ask your own question in AI Tutor →
              </Link>
            </div>

          </div>
        </section>

        {/* PRAG-EDU Conceptual Architecture Visualizer */}
        <section className="py-20 bg-muted/20 border-t border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                The PRAG-EDU Pipeline
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                How student records from OULAD are converted into context-aware, level-adapted learning responses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              
              <div className="bg-card p-5 rounded-2xl border border-border space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center text-xs">
                  01
                </div>
                <h4 className="font-bold text-sm">OULAD Records</h4>
                <p className="text-xs text-muted-foreground">
                  Analyzes assessments, submission dates, VLE clicks, and module registration.
                </p>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 font-bold flex items-center justify-center text-xs">
                  02
                </div>
                <h4 className="font-bold text-sm">Proficiency Signals</h4>
                <p className="text-xs text-muted-foreground">
                  Converts scores and activity into 5 calibrated tiers (Beginner to Mastery) with confidence ratings.
                </p>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 font-bold flex items-center justify-center text-xs">
                  03
                </div>
                <h4 className="font-bold text-sm">Contextual RAG</h4>
                <p className="text-xs text-muted-foreground">
                  Enriches student queries and retrieves verified course textbook chunks with source citations.
                </p>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border space-y-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 font-bold flex items-center justify-center text-xs">
                  04
                </div>
                <h4 className="font-bold text-sm">Prompt Adaptation</h4>
                <p className="text-xs text-muted-foreground">
                  Merges profile signals, identified knowledge gaps, and retrieved documents into structured directives.
                </p>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center text-xs">
                  05
                </div>
                <h4 className="font-bold text-sm">Pedagogical Response</h4>
                <p className="text-xs text-muted-foreground">
                  LLM generates an explanation specifically calibrated to the student's current cognitive readiness.
                </p>
              </div>

            </div>

            <div className="mt-12 text-center">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
              >
                <span>Read detailed research paper methodology and ablation metrics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
