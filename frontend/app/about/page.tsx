"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  BrainCircuit,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Users,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            About EduRAG AI
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Democratizing Higher Education Through Pedagogical Intelligence
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            EduRAG AI bridges the chasm between massive educational datasets like the Open University
            Learning Analytics Dataset (OULAD) and real-time generative tutoring.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Pedagogical Scaffolding</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inspired by Lev Vygotsky&apos;s Zone of Proximal Development (ZPD), responses are calibrated precisely
              to a student&apos;s current cognitive proficiency rather than offering generic explanations.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Empirically Grounded in OULAD</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We leverage 32,593 Open University student records across 7 distinct STEM and social science modules
              to train our diagnostic engines and evaluate early intervention signals.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Ethical Transparency</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Student proficiency is derived strictly from objective academic submissions and VLE engagement.
              Demographic variables are utilized solely for equity auditing and bias prevention.
            </p>
          </div>
        </div>

        {/* PRAG-EDU Inspiration Box */}
        <div className="p-8 rounded-3xl glass-card border border-border/80 relative overflow-hidden space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Academic Lineage
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Inspired by the PRAG-EDU Architecture
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our framework builds directly upon the concepts proposed in{" "}
            <em>&quot;Towards Personalized AI Education: Context-Aware Retrieval-Augmented Generation With Grade-Level
            LLM Adaptation&quot;</em>. By combining vector retrieval from accredited syllabus notes with grade-level
            conditioned prompts, EduRAG AI delivers tailored instruction with verified source attribution.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/research"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Explore Research & Methodology <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
