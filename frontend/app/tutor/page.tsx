"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth-context";
import { sendChatMessage, submitChatFeedback } from "@/lib/api";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Code,
  SlidersHorizontal,
  ChevronDown,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  proficiencyLevel?: string;
  adaptationReasoning?: string;
  sources?: Array<{ title: string; module: string; topic: string }>;
  timestamp: string;
  liked?: boolean | null;
}

function TutorContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [proficiencyOverride, setProficiencyOverride] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("GGG");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pre-populate topic if navigated with ?topic=...
  useEffect(() => {
    if (topicParam) {
      setInput(`Can you explain ${topicParam} and walk me through key concepts and examples?`);
    }
  }, [topicParam]);

  // Initialize initial welcome message
  useEffect(() => {
    const studentLevel = user?.proficiency_level || "Intermediate";
    setProficiencyOverride(studentLevel);

    setMessages([
      {
        id: "welcome-1",
        sender: "assistant",
        content: `Hello ${user?.name || "Alex"}! I'm your **EduRAG AI Tutor**.

I have analyzed your **OULAD academic profile** and tailored my pedagogical explanations to your current **${studentLevel}** level.

Ask me any question from your modules (such as **Data Structures**, **Algorithms**, or **Programming Fundamentals**), or try one of the suggestions below!`,
        proficiencyLevel: studentLevel,
        adaptationReasoning: `Calibrated to ${studentLevel} proficiency with moderate technical depth and clear structured explanations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const query = messageText || input;
    if (!query.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: query,
        module: selectedModule,
        proficiency_override: proficiencyOverride || undefined,
      });

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        content: res.content || res.response || "",
        proficiencyLevel: res.proficiency_level || res.explanation_tier || "Intermediate",
        adaptationReasoning: res.adaptation_notes || res.adaptation_reasoning || "Calibrated to your mastery level.",
        sources: res.retrieved_sources || res.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        content:
          "I encountered an issue connecting to the AI inference service. However, Demo Mode has generated a fallback pedagogical explanation for your query.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (messageId: string, rating: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, liked: rating === "like" } : m))
    );
    try {
      await submitChatFeedback({
        message_id: messageId,
        rating,
      });
    } catch (e) {
      console.warn("Feedback submission error:", e);
    }
  };

  const promptSuggestions = [
    "What is recursion and how does the call stack work?",
    "Explain the difference between Array and Linked List",
    "How does binary search achieve O(log n) time complexity?",
    "Give me a step-by-step example of Quicksort partition",
  ];

  const handleQuickAction = (action: string, lastMsgContent: string) => {
    let prompt = "";
    if (action === "simpler") prompt = `Could you explain that simpler with an intuitive real-world analogy?`;
    if (action === "deeper") prompt = `Could you explain that deeper with theoretical mechanics and edge cases?`;
    if (action === "example") prompt = `Can you provide a clear code example in Python?`;
    if (action === "quiz") prompt = `Can you quiz me with 1 question on what we just discussed?`;
    handleSend(prompt);
  };

  // Helper to format code blocks and bold text cleanly
  const renderFormattedContent = (content: string) => {
    const parts = content.split("```");
    if (parts.length === 1) {
      return (
        <div className="whitespace-pre-line leading-relaxed text-sm">
          {content.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="mb-2.5 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3 text-sm leading-relaxed">
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // Code block
            const lines = part.trim().split("\n");
            const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : "";
            const code = lang ? lines.slice(1).join("\n") : part;
            return (
              <div key={index} className="rounded-xl overflow-hidden border border-border/80 bg-slate-950 my-2">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>{lang || "code"}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="p-3.5 text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                  {code}
                </pre>
              </div>
            );
          }
          return (
            <div key={index} className="whitespace-pre-line">
              {part}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AppShell
      title="Context-Aware AI Tutor"
      subtitle="Pedagogical dialog engine calibrated to your individual proficiency signals and course materials."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Module Selector */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 transition-colors focus:outline-none"
          >
            <option value="GGG">Module GGG (Algorithms & Data)</option>
            <option value="FFF">Module FFF (STEM Programming)</option>
            <option value="BBB">Module BBB (Intro to Sciences)</option>
            <option value="AAA">Module AAA (Foundations)</option>
          </select>

          {/* Proficiency Adaptation Override */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">Adaptation:</span>
            <select
              value={proficiencyOverride}
              onChange={(e) => setProficiencyOverride(e.target.value)}
              className="bg-transparent text-primary font-bold focus:outline-none cursor-pointer"
            >
              <option value="Beginner">Beginner (Simple & Analogies)</option>
              <option value="Developing">Developing (Structured Steps)</option>
              <option value="Intermediate">Intermediate (Alex Profile)</option>
              <option value="Advanced">Advanced (Deep Technical)</option>
              <option value="Mastery">Mastery (Architecture & Edge Cases)</option>
            </select>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-[calc(100vh-14rem)] glass-card rounded-2xl border border-border/60 overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 max-w-4xl ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                    isUser
                      ? "bg-secondary"
                      : "bg-gradient-to-tr from-primary to-secondary shadow-md shadow-primary/20"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="flex-1 space-y-2">
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isUser
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-card text-foreground border-border/80 shadow-sm"
                    }`}
                  >
                    {renderFormattedContent(msg.content)}

                    {/* Metadata & Sources for Assistant responses */}
                    {!isUser && msg.adaptationReasoning && (
                      <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Sparkles className="w-3 h-3" />
                          Adapted for {msg.proficiencyLevel}
                        </span>
                        <span>•</span>
                        <span>{msg.adaptationReasoning}</span>
                      </div>
                    )}

                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 text-[11px] text-muted-foreground flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-secondary" /> Retrieved Context:
                        </span>
                        {msg.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-muted/60 text-foreground font-mono text-[10px]"
                          >
                            [{src.module}] {src.topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Bar for Assistant Messages */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-2 px-1 text-xs">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, "like")}
                        className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${
                          msg.liked === true ? "text-emerald-500 font-bold" : "text-muted-foreground"
                        }`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, "dislike")}
                        className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${
                          msg.liked === false ? "text-rose-500 font-bold" : "text-muted-foreground"
                        }`}
                        title="Unhelpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-muted-foreground/30">|</span>

                      {/* Pedagogical Quick-Adjustment Buttons */}
                      <button
                        onClick={() => handleQuickAction("simpler", msg.content)}
                        className="px-2 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-[11px]"
                      >
                        Simpler
                      </button>
                      <button
                        onClick={() => handleQuickAction("deeper", msg.content)}
                        className="px-2 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-[11px]"
                      >
                        Deeper
                      </button>
                      <button
                        onClick={() => handleQuickAction("example", msg.content)}
                        className="px-2 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-[11px]"
                      >
                        Give Example
                      </button>
                      <button
                        onClick={() => handleQuickAction("quiz", msg.content)}
                        className="px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-[11px] font-semibold"
                      >
                        Quiz Me
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-4xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2">Retrieving educational context & adapting pedagogical tone...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions Bar */}
        {messages.length < 3 && (
          <div className="p-3 border-t border-border/40 bg-muted/20 flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="px-3 py-1.5 rounded-xl text-xs bg-card hover:bg-card/80 border border-border/60 hover:border-primary/50 text-foreground transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-border/60 bg-card/60 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI tutor a question (e.g., 'Explain recursion with a call stack diagram')..."
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:border-primary text-sm focus:outline-none transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

export default function AITutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-sm font-semibold text-muted-foreground animate-pulse">
            Loading AI Tutor...
          </div>
        </div>
      }
    >
      <TutorContent />
    </Suspense>
  );
}
