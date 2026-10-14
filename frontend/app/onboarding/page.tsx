"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  User,
  BookOpen,
  Sliders,
  ShieldCheck,
  Bot,
  Activity,
  Layers,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@student.open.ac.uk",
    age_group: "0-35",
    education_level: "A Level or Equivalent",
    gender: "Unspecified",
    region: "East Anglian Region",
    disability: "No",
    modules: ["GGG", "FFF", "BBB"],
    previous_attempts: 0,
    credits: 120,
    explanation_style: "Balanced with code & analogies",
    learning_pace: "Moderate (3-5 sessions/week)",
    difficulty_preference: "Adaptive (Starts at current baseline)",
    practice_frequency: "Daily short formative checks",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edurag_reg_temp") || localStorage.getItem("learnwise_reg_temp");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const handleNext = () => {
    if (step === 3) {
      // Transition to Step 4 with dynamic computation simulation
      setStep(4);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
      }, 2000);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  const availableModules = [
    { code: "GGG", name: "Data Structures & Computational Problem Solving" },
    { code: "FFF", name: "STEM: Computer Programming & Software Principles" },
    { code: "BBB", name: "Introduction to Social Sciences & Applied Research" },
    { code: "CCC", name: "Applied Mathematics & Quantitative Methods" },
    { code: "AAA", name: "Foundations in Higher Education & Academic Literacy" },
  ];

  const toggleModule = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(code)
        ? prev.modules.filter((m) => m !== code)
        : [...prev.modules, code],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              EduRAG<span className="text-primary">AI</span> Onboarding
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-primary"
                    : s < step
                    ? "w-4 bg-emerald-500"
                    : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground block font-medium">
            Step {step} of 4:{" "}
            {step === 1 && "Basic Student Profile"}
            {step === 2 && "Academic Standing & Courses"}
            {step === 3 && "Learning Preferences"}
            {step === 4 && "PRAG-EDU Profile Synthesis"}
          </span>
        </div>

        {/* Wizard Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-border/80 shadow-xl space-y-6">
          {/* STEP 1: BASIC DEMOGRAPHICS & PROFILE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Basic Profile & Background</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Demographic details are utilized exclusively for cohort equity analysis, not to predetermine ability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Age Band</label>
                  <select
                    value={formData.age_group}
                    onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  >
                    <option value="0-35">0-35 Years</option>
                    <option value="35-55">35-55 Years</option>
                    <option value="55<=">55+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Highest Education Level</label>
                  <select
                    value={formData.education_level}
                    onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  >
                    <option value="A Level or Equivalent">A Level or Equivalent</option>
                    <option value="HE Qualification">HE Qualification (Diploma/Cert)</option>
                    <option value="Lower Than A Level">Secondary / Lower Than A Level</option>
                    <option value="Post Graduate">Postgraduate Degree</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Geographic Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Accessibility Support / Disability</label>
                  <select
                    value={formData.disability}
                    onChange={(e) => setFormData({ ...formData, disability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  >
                    <option value="No">None Declared</option>
                    <option value="Yes">Requested Accommodations</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC STANDING & MODULES */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Select OULAD Course Modules</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select the course modules you are actively enrolled in or plan to study.
                </p>
              </div>

              <div className="space-y-2">
                {availableModules.map((m) => {
                  const isChecked = formData.modules.includes(m.code);
                  return (
                    <div
                      key={m.code}
                      onClick={() => toggleModule(m.code)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isChecked
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-card border-border/70 hover:border-border text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                          Module {m.code}
                        </span>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          isChecked ? "bg-primary text-white" : "border border-border"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Previous Module Attempts</label>
                  <input
                    type="number"
                    value={formData.previous_attempts}
                    onChange={(e) => setFormData({ ...formData, previous_attempts: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Credits Studied</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LEARNING PREFERENCES */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Personalized Learning Preferences</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  How would you prefer the AI Tutor to calibrate explanations, pacing, and difficulty?
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Explanation Depth</label>
                  <select
                    value={formData.explanation_style}
                    onChange={(e) => setFormData({ ...formData, explanation_style: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  >
                    <option value="Concise with analogies">Concise with visual real-world analogies</option>
                    <option value="Balanced with code & analogies">Balanced step-by-step with code snippets</option>
                    <option value="Deep mathematical & algorithmic">Deep theoretical proofs and memory models</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Study Pace</label>
                  <select
                    value={formData.learning_pace}
                    onChange={(e) => setFormData({ ...formData, learning_pace: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  >
                    <option value="Accelerated">Intensive (Daily study sessions)</option>
                    <option value="Moderate (3-5 sessions/week)">Steady (3-5 sessions / week)</option>
                    <option value="Flexible self-paced">Self-Paced / Weekend focus</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Adaptive Quiz Frequency</label>
                  <select
                    value={formData.practice_frequency}
                    onChange={(e) => setFormData({ ...formData, practice_frequency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
                  >
                    <option value="Daily short formative checks">Daily 3-question formative checks</option>
                    <option value="Weekly milestone tests">Weekly milestone reviews before TMA deadlines</option>
                    <option value="Only on request">Only when I trigger them manually</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROFILE GENERATION & COMPUTATION */}
          {step === 4 && (
            <div className="space-y-6">
              {analyzing ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <h3 className="text-base font-bold text-foreground">Analyzing Your Learning Profile...</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Computing multi-dimensional signals across OULAD modules, historical TMA weights, and VLE interaction rates.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-foreground">Profile Synthesized Successfully!</h3>
                    <p className="text-xs text-muted-foreground">
                      PRAG-EDU calibration completed for student <strong>{formData.name}</strong>.
                    </p>
                  </div>

                  {/* Computed Signals Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground block">Assigned Proficiency</span>
                      <div className="text-base font-bold text-primary mt-1">Intermediate (82% Confidence)</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground block">Engagement Level</span>
                      <div className="text-base font-bold text-foreground mt-1">High (88th Percentile)</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground block">Initial Priority Gap</span>
                      <div className="text-base font-bold text-amber-500 mt-1">Recursion & Call Stacks</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-card border border-border/60">
                      <span className="text-muted-foreground block">Early Warning Risk Status</span>
                      <div className="text-base font-bold text-emerald-500 mt-1">Low Concern (On Track)</div>
                    </div>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    Enter Personalized Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          {step < 4 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <button
                disabled={step === 1}
                onClick={handleBack}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md"
              >
                {step === 3 ? "Generate Profile" : "Continue"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
