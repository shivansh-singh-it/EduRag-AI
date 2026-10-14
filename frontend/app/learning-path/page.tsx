"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getLearningPath } from "@/lib/api";
import {
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  AlertCircle,
  Bot,
  Award,
  ChevronRight,
  BookOpen,
  Sparkles,
  ArrowDown,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function LearningPathPage() {
  const [pathData, setPathData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPath() {
      try {
        const res = await getLearningPath();
        if (isMounted) setPathData(res);
      } catch (err) {
        console.warn("Failed to fetch learning path:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPath();
    return () => {
      isMounted = false;
    };
  }, []);

  const nodes = pathData?.nodes || [
    {
      id: "node-1",
      stage: "FOUNDATION",
      title: "Programming Basics & Memory",
      difficulty: "Easy",
      mastery: 94,
      status: "Completed",
      estimated_time: "Completed",
      prerequisites: "None",
      description: "Primitive data types, variables, control flow, functions and memory addressing.",
    },
    {
      id: "node-2",
      stage: "FOUNDATION",
      title: "Linear Data Structures (Arrays & Lists)",
      difficulty: "Easy",
      mastery: 88,
      status: "Completed",
      estimated_time: "Completed",
      prerequisites: "Programming Basics",
      description: "Array indexing, dynamic resizing, sequential search, linked lists and operations.",
    },
    {
      id: "node-3",
      stage: "CURRENT LEVEL",
      title: "Stacks, Queues & Call Frames",
      difficulty: "Medium",
      mastery: 74,
      status: "In Progress",
      estimated_time: "15 min remaining",
      prerequisites: "Linear Data Structures",
      description: "LIFO vs FIFO semantics, call stack activation records, stack overflows and queue buffers.",
    },
    {
      id: "node-4",
      stage: "KNOWLEDGE GAP (PRIORITY)",
      title: "Recursion & Divide-and-Conquer",
      difficulty: "Medium",
      mastery: 42,
      status: "Needs Practice",
      estimated_time: "25 min",
      prerequisites: "Stacks & Call Frames",
      description: "Base cases, recursive transitions, call stack unwinding, binary recursion, and tree traversal.",
    },
    {
      id: "node-5",
      stage: "RECOMMENDED NEXT TOPIC",
      title: "Trees & Binary Search Trees (BST)",
      difficulty: "Medium",
      mastery: 20,
      status: "Unlocked",
      estimated_time: "30 min",
      prerequisites: "Recursion & Divide-and-Conquer",
      description: "Hierarchical data representation, inorder/preorder/postorder traversal, search complexity.",
    },
    {
      id: "node-6",
      stage: "NEXT LEVEL (ADVANCED)",
      title: "Dynamic Programming & Memoization",
      difficulty: "Hard",
      mastery: 0,
      status: "Locked",
      estimated_time: "45 min",
      prerequisites: "Recursion & Trees",
      description: "Overlapping subproblems, optimal substructure, top-down memoization vs bottom-up tabulation.",
    },
    {
      id: "node-7",
      stage: "MASTERY",
      title: "Graph Algorithms & Shortest Path",
      difficulty: "Expert",
      mastery: 0,
      status: "Locked",
      estimated_time: "60 min",
      prerequisites: "Dynamic Programming & Trees",
      description: "Adjacency lists, Breadth-First Search, Depth-First Search, and Dijkstra's shortest path.",
    },
  ];

  const completedCount = nodes.filter((n: any) => n.status === "Completed").length;
  const inProgressCount = nodes.filter((n: any) => n.status === "In Progress").length;
  const gapCount = nodes.filter((n: any) => n.status === "Needs Practice" || n.is_gap || n.is_current_focus).length;
  const lockedCount = nodes.filter((n: any) => n.status === "Locked" || n.is_locked).length;
  const overallProgress = pathData?.overall_path_progress ?? (nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 45);

  return (
    <AppShell
      title="Personalized Learning Pathway"
      subtitle="Visual curricular roadmap dynamically adapted to your mastery levels, knowledge gaps, and prerequisites."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/tutor?topic=Recursion"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary shadow-md hover:scale-[1.02] transition-all"
          >
            <Bot className="w-4 h-4" /> Study Priority Gap
          </Link>
        </div>
      }
    >
      {/* Top Pathway Progress Bar */}
      <div className="p-6 rounded-2xl glass-card border border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Roadmap Velocity
            </span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              {pathData?.module || "Module GGG: Data Structures & Algorithms"}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" /> {completedCount} Completed
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <PlayCircle className="w-4 h-4" /> {inProgressCount} In Progress
            </span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <AlertCircle className="w-4 h-4" /> {gapCount} Priority Gap
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Lock className="w-4 h-4" /> {lockedCount} Locked
            </span>
          </div>
        </div>

        <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary via-secondary to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
          />
        </div>
      </div>

      {/* Visual Vertical Roadmap */}
      <div className="relative max-w-4xl mx-auto py-6">
        {/* Central connecting line */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 bg-border/80 -translate-x-1/2 z-0" />

        <div className="space-y-8 relative z-10">
          {nodes.map((node: any, idx: number) => {
            const isCompleted = node.status === "Completed";
            const isInProgress = node.status === "In Progress";
            const isGap = node.status === "Needs Practice";
            const isLocked = node.status === "Locked";
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={node.id}
                className={`flex flex-col sm:flex-row items-start ${
                  isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                } gap-6 group`}
              >
                {/* Node Card */}
                <div
                  className={`w-full sm:w-[calc(50%-2rem)] p-5 rounded-2xl glass-card border transition-all ${
                    isGap
                      ? "border-amber-500/50 shadow-md shadow-amber-500/10 bg-amber-500/5"
                      : isInProgress
                      ? "border-primary/50 shadow-md shadow-primary/10"
                      : isLocked
                      ? "opacity-60 border-border/40 bg-card/40"
                      : "border-border/60 hover:border-border"
                  }`}
                >
                  {/* Stage and Difficulty */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isGap
                          ? "bg-amber-500/20 text-amber-500"
                          : isInProgress
                          ? "bg-primary/20 text-primary"
                          : isCompleted
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {node.stage}
                    </span>
                    <span className="text-muted-foreground font-medium">{node.difficulty}</span>
                  </div>

                  <h3 className="font-bold text-base text-foreground flex items-center justify-between">
                    <span>{node.title}</span>
                    {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {node.description}
                  </p>

                  {/* Progress bar */}
                  {(() => {
                    const masteryVal = node.mastery ?? node.mastery_percentage ?? 0;
                    const prereqText = Array.isArray(node.prerequisites)
                      ? (node.prerequisites.length > 0 ? node.prerequisites.join(", ") : "None")
                      : (node.prerequisites || "None");

                    return (
                      <>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-muted-foreground">Mastery Level</span>
                            <span className="font-bold text-foreground">{masteryVal}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isCompleted
                                  ? "bg-emerald-500"
                                  : isGap
                                  ? "bg-amber-500"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, masteryVal))}%` }}
                            />
                          </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {node.estimated_time}
                          </span>

                          {!isLocked ? (
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/tutor?topic=${encodeURIComponent(node.title)}`}
                                className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <Bot className="w-3 h-3" /> Study
                              </Link>
                              <Link
                                href={`/quiz?topic=${encodeURIComponent(node.title)}`}
                                className="px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <Award className="w-3 h-3" /> Quiz
                              </Link>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Requires: {prereqText}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Central Milestone Indicator */}
                <div className="hidden sm:flex w-10 h-10 rounded-full border-4 border-background bg-card items-center justify-center z-10 flex-shrink-0 shadow-md">
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {isInProgress && <PlayCircle className="w-5 h-5 text-primary" />}
                  {isGap && <AlertCircle className="w-5 h-5 text-amber-500" />}
                  {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>

                {/* Empty spacer for alignment */}
                <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
