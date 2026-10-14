"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  BrainCircuit,
  FlaskConical,
  BookOpen,
  Layers,
  ArrowRight,
  Database,
  Sparkles,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
            Research & Methodology
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            The PRAG-EDU Architecture Adapted to OULAD
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Bridging dense vector retrieval, multi-attribute student telemetry, and grade-conditioned
            prompt generation for personalized higher education.
          </p>
        </div>

        {/* 5-Stage Conceptual Pipeline */}
        <div className="p-8 rounded-3xl glass-card border border-border/80 space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            The 5-Stage PRAG-EDU Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="font-mono text-primary font-black">Stage 01</span>
              <h4 className="font-bold text-foreground">Telemetry Ingestion</h4>
              <p className="text-muted-foreground leading-relaxed">
                Extracts student assessment grades (TMA/CMA), submission dates, and VLE click logs from OULAD.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="font-mono text-secondary font-black">Stage 02</span>
              <h4 className="font-bold text-foreground">Proficiency Engine</h4>
              <p className="text-muted-foreground leading-relaxed">
                Maps weighted assessment scores and study consistency into 5 discrete tiers with confidence intervals.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="font-mono text-cyan-400 font-black">Stage 03</span>
              <h4 className="font-bold text-foreground">Contextual RAG</h4>
              <p className="text-muted-foreground leading-relaxed">
                Rewrites query with student module context and retrieves accredited syllabus notes via vector similarity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="font-mono text-amber-500 font-black">Stage 04</span>
              <h4 className="font-bold text-foreground">Prompt Conditioning</h4>
              <p className="text-muted-foreground leading-relaxed">
                Injects student profile, identified gaps, and retrieved educational passages into the system prompt.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="font-mono text-emerald-500 font-black">Stage 05</span>
              <h4 className="font-bold text-foreground">Adapted Output</h4>
              <p className="text-muted-foreground leading-relaxed">
                Generates responses scaled in vocabulary, mathematical rigor, and scaffolding to match the student&apos;s level.
              </p>
            </div>
          </div>
        </div>

        {/* Paper Alignment vs OULAD Adaptation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Original PRAG-EDU Concept
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The research paper <em>&quot;Towards Personalized AI Education&quot;</em> validated that conditioning LLMs
              on student grade levels significantly boosts pedagogical alignment scores (BERTScore, ROUGE-L)
              compared to vanilla chatbots.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside pt-1">
              <li>Primary signal: Subject grade levels</li>
              <li>Target: Direct alignment with student curriculum</li>
              <li>Evaluated via: BLEU, METEOR, ROUGE, and BERTScore</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-secondary" />
              Adaptation to OULAD Dataset
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              OULAD expands this framework into real-world distance learning by providing longitudinal VLE
              behavioral engagement, multi-attempt assessments, and registration timeframes.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside pt-1">
              <li>Synthesizes: Academic scores + VLE interaction frequency</li>
              <li>Calculates: Diagnostic confidence intervals</li>
              <li>Includes: Proactive early-warning risk indicators</li>
            </ul>
          </div>
        </div>

        {/* Call to Evaluation Dashboards */}
        <div className="p-8 rounded-3xl glass-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Inspect Live Evaluation & Ablation Metrics</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Explore our quantitative benchmark suite comparing PRAG-EDU against generic LLMs across 250 test prompts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/admin/evaluation"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <FlaskConical className="w-4 h-4" /> Live Evaluation Suite
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
