"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Bot,
  BrainCircuit,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Cpu,
  Zap,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Context-Aware AI Tutor",
      description: "A pedagogical conversational agent that dynamically scales its explanations from simple analogies to deep memory models based on the student's active proficiency signal.",
      icon: Bot,
      color: "text-primary bg-primary/10",
      link: "/tutor",
    },
    {
      title: "Transparent Proficiency Engine",
      description: "Deterministic 5-tier proficiency engine (Beginner to Mastery) with confidence intervals and clear explainability cards breaking down assessment weights and VLE regularity.",
      icon: BrainCircuit,
      color: "text-secondary bg-secondary/10",
      link: "/profile",
    },
    {
      title: "Adaptive Formative Quizzes",
      description: "Generates difficulty-calibrated assessment questions with immediate step-by-step pedagogical explanations and automatic difficulty progression.",
      icon: Award,
      color: "text-cyan-400 bg-cyan-400/10",
      link: "/quiz",
    },
    {
      title: "Personalized Learning Pathway",
      description: "Visual node-based curriculum roadmap that locks, unlocks, and guides students through topics based on mastery thresholds and prerequisite trees.",
      icon: Layers,
      color: "text-amber-500 bg-amber-500/10",
      link: "/learning-path",
    },
    {
      title: "Explainable Knowledge Gap Matrix",
      description: "Diagnoses specific concept gaps using historical OULAD assessment errors and VLE interaction lapses with 1-click targeted remediation.",
      icon: Sparkles,
      color: "text-rose-500 bg-rose-500/10",
      link: "/knowledge-gaps",
    },
    {
      title: "Multi-Provider LLM & Offline Demo",
      description: "Runs 100% offline out-of-the-box with deterministic PRAG-EDU pedagogical emulation, or connects seamlessly to local Ollama (Llama 3/Mistral) or cloud APIs.",
      icon: Cpu,
      color: "text-emerald-500 bg-emerald-500/10",
      link: "/settings",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Engineered for Personalized Mastery
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every component in EduRAG AI is engineered around the principle that effective education
            requires meeting students at their precise level of cognitive readiness.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card border border-border/60 hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40">
                  <Link
                    href={f.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Try Feature <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="p-8 rounded-3xl glass-card border border-border/80 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Experience the Future of AI-Powered Education
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Explore with demo student Alex Morgan or configure your local Ollama runtime to experience
            live grade-level LLM adaptation.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              Launch Student Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
