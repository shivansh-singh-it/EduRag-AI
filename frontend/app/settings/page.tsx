"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth-context";
import {
  SlidersHorizontal,
  Bot,
  ShieldCheck,
  User,
  Sparkles,
  Save,
  CheckCircle2,
  Cpu,
  Key,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [provider, setProvider] = useState("demo");
  const [ollamaUrl, setOllamaUrl] = useState("http://127.0.0.1:11434");
  const [modelName, setModelName] = useState("llama3");
  const [explanationStyle, setExplanationStyle] = useState("balanced");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell
      title="Profile & System Settings"
      subtitle="Customize your learning preferences, AI model provider, and pedagogical adaptation parameters."
    >
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Student Profile Card */}
          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Student Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1.5">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || "Alex Morgan"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1.5">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || "alex.morgan@student.open.ac.uk"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1.5">Assigned Cohort Level</label>
                <input
                  type="text"
                  disabled
                  defaultValue="Intermediate (PRAG-EDU Signal)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1.5">Weekly Goal</label>
                <input
                  type="text"
                  defaultValue="5 Study Days / Week"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* AI Inference Provider */}
          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-secondary" />
                AI Inference Engine & Provider
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-semibold">
                Provider Agnostic
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              EduRAG AI operates offline out-of-the-box using the deterministic PRAG-EDU pedagogical simulator,
              or can connect seamlessly to local Ollama instances or cloud APIs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setProvider("demo")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  provider === "demo"
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-card border-border/70 hover:border-border text-muted-foreground"
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Pedagogical Demo</span>
                  {provider === "demo" && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Zero keys needed, 100% offline & fast.</p>
              </div>

              <div
                onClick={() => setProvider("ollama")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  provider === "ollama"
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-card border-border/70 hover:border-border text-muted-foreground"
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Ollama Local</span>
                  {provider === "ollama" && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Run local Llama 3 or Mistral.</p>
              </div>

              <div
                onClick={() => setProvider("cloud")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  provider === "cloud"
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-card border-border/70 hover:border-border text-muted-foreground"
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Gemini / OpenAI API</span>
                  {provider === "cloud" && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Via .env API key configuration.</p>
              </div>
            </div>

            {provider === "ollama" && (
              <div className="pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Ollama Base URL</label>
                  <input
                    type="text"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Model Name</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pedagogical Customization */}
          <div className="p-6 rounded-2xl glass-card border border-border/60 space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Pedagogical Tone & Depth
            </h3>

            <div className="space-y-3 text-xs">
              <label className="font-semibold text-muted-foreground block">
                Preferred Explanation Depth
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "concise", label: "Concise & Direct", desc: "Brief explanations with rapid analogies" },
                  { id: "balanced", label: "Balanced (Recommended)", desc: "Moderate technical depth with code snippets" },
                  { id: "deep", label: "Comprehensive", desc: "In-depth theoretical analysis & edge cases" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setExplanationStyle(item.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      explanationStyle === item.id
                        ? "bg-primary/10 border-primary text-foreground"
                        : "bg-card border-border/70 hover:border-border text-muted-foreground"
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Preferences successfully saved!
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
