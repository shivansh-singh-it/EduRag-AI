import React from "react";
import Link from "next/link";
import { Brain, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                <Brain className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">EduRAG AI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Personalized AI education powered by student academic analytics and context-aware RAG adaptation.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Student Dashboard</Link></li>
              <li><Link href="/tutor" className="hover:text-primary transition-colors">AI Personalized Tutor</Link></li>
              <li><Link href="/learning-path" className="hover:text-primary transition-colors">Adaptive Roadmap</Link></li>
              <li><Link href="/quiz" className="hover:text-primary transition-colors">Diagnostic Quizzes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Research & Ethics</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/research" className="hover:text-primary transition-colors">PRAG-EDU Architecture</Link></li>
              <li><Link href="/admin/evaluation" className="hover:text-primary transition-colors">Evaluation Metrics</Link></li>
              <li><Link href="/admin/ablation" className="hover:text-primary transition-colors">Ablation Study</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Dataset Ethics & Guardrails</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Foundational Data</h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Adapted to the Open University Learning Analytics Dataset (OULAD) from Kaggle.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted text-foreground border border-border">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              Open University UK Dataset
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 EduRAG AI. Inspired by PRAG-EDU. Educational analytics are statistical recommendations, not definitive judgments.</p>
          <div className="flex items-center gap-4">
            <Link href="/research" className="hover:text-foreground transition-colors">Methodology</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
