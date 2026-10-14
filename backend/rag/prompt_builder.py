"""
PRAG-EDU Context-Aware Prompt Builder for EduRAG AI
Constructs structured pedagogical prompts combining Student Profile, Proficiency Signals,
Retrieved Educational Knowledge, and Grade-Level LLM Directives.
"""

from typing import Dict, List, Any, Optional

class PromptBuilder:
    def __init__(self):
        pass

    def build_system_prompt(self, student_profile: Dict[str, Any], module: str = "FFF") -> str:
        """Constructs the pedagogical system instructions tailored to the student."""
        proficiency = student_profile.get("proficiency", {})
        tier = proficiency.get("tier", "INTERMEDIATE")
        tier_label = proficiency.get("tier_label", "Intermediate")
        confidence = proficiency.get("confidence_score", 75.0)
        strengths = student_profile.get("strengths", [])
        weaknesses = student_profile.get("weaknesses", [])
        
        tier_instructions = {
            "BEGINNER": (
                "- EXPLANATION STYLE: Use an intuitive real-world analogy first (e.g. toy trains, recipe steps, boxes).\n"
                "- TERMINOLOGY: Keep technical jargon to an absolute minimum. Define new terms before using them.\n"
                "- CODE EXAMPLES: Provide concise, clean, heavily-commented code (3-8 lines). Avoid complex idioms.\n"
                "- COGNITIVE LOAD: Step-by-step sequential breakdown. Limit to 1 core concept at a time.\n"
                "- PEDAGOGICAL HOOK: End with 1 simple, encouraging check-for-understanding practice question."
            ),
            "DEVELOPING": (
                "- EXPLANATION STYLE: Blend concrete analogies with foundational technical mechanics.\n"
                "- TERMINOLOGY: Introduce standard programmatic terms with brief explanatory glosses.\n"
                "- CODE EXAMPLES: Provide practical examples showing both setup and typical execution.\n"
                "- COGNITIVE LOAD: Highlight common pitfalls, off-by-one errors, or misunderstandings.\n"
                "- PEDAGOGICAL HOOK: Provide a guided practice snippet with an intentional blank or modification."
            ),
            "INTERMEDIATE": (
                "- EXPLANATION STYLE: Balanced academic rigor. Focus on architectural flow and execution lifecycle.\n"
                "- TERMINOLOGY: Use standard industry and university computer science terminology.\n"
                "- CODE EXAMPLES: Full implementation patterns including traversal, insertion/deletion, or parameter handling.\n"
                "- COMPLEXITY: Explicitly discuss Big-O time and space complexity.\n"
                "- PEDAGOGICAL HOOK: Challenge the student with a follow-up problem considering realistic edge cases."
            ),
            "ADVANCED": (
                "- EXPLANATION STYLE: In-depth analytical and algorithmic reasoning.\n"
                "- TERMINOLOGY: Advanced technical precision (cache lines, activation records, memory models).\n"
                "- CODE EXAMPLES: Idiomatic, optimized implementations with error-handling and complexity bounds.\n"
                "- COMPLEXITY & TRADEOFFS: Compare alternative data structures/algorithms with detailed trade-off matrices.\n"
                "- PEDAGOGICAL HOOK: Pose an optimization or distributed systems challenge question."
            ),
            "MASTERY": (
                "- EXPLANATION STYLE: Theoretical synthesis, proof sketches, and low-level systems mechanics.\n"
                "- TERMINOLOGY: Compiler optimizations (TCO, inlining), hardware cache locality, amortized bounds.\n"
                "- COMPLEXITY: Deep asymptotic analysis, recurrence relations (Master Theorem), memory layout.\n"
                "- PEDAGOGICAL HOOK: Ask the student to evaluate trade-offs in mission-critical or high-concurrency settings."
            )
        }
        
        system_text = f"""You are EduRAG AI, an expert adaptive educational AI tutor inspired by the PRAG-EDU architecture.
Your core mission is to empower students through personalized, pedagogically sound, and level-adapted explanations.

==================================================
STUDENT LEARNING PROFILE
==================================================
Student Name: {student_profile.get('name', 'Student')} (ID: {student_profile.get('student_id', 10001)})
Current Module: {module}
Current Proficiency Tier: {tier} ({tier_label}) — {confidence}% Confidence
Assigned Explanation Depth: {proficiency.get('target_depth', 'standard')}
Known Strengths: {', '.join(strengths) if strengths else 'Foundational Programming'}
Identified Knowledge Gaps: {', '.join(weaknesses) if weaknesses else 'Algorithmic Complexity'}

==================================================
TIER-SPECIFIC PEDAGOGICAL DIRECTIVES ({tier_label.upper()} LEVEL)
==================================================
{tier_instructions.get(tier, tier_instructions['INTERMEDIATE'])}

==================================================
CORE GROUNDING RULES
==================================================
1. Ground your answers primarily in the retrieved educational knowledge where available.
2. State uncertainty clearly if the context lacks sufficient information; do NOT hallucinate facts.
3. Always format your responses using rich Markdown: code blocks with language tags, bullet points, and LaTeX for math (e.g. $O(n \\log n)$).
4. Actively address and scaffold the student's identified knowledge gaps if relevant to their inquiry.
5. Maintain an inspiring, patient, university-grade academic tone.
"""
        return system_text

    def format_retrieved_context(self, retrieved_chunks: List[Dict[str, Any]]) -> str:
        """Formats retrieved educational knowledge chunks into citations."""
        if not retrieved_chunks:
            return "No specific course documents retrieved for this query. Use core verified pedagogical knowledge."
            
        formatted_chunks = []
        for i, chunk in enumerate(retrieved_chunks, 1):
            source = chunk.get("source", "Course Document")
            page = chunk.get("page", 1)
            title = chunk.get("title", "Topic Guide")
            difficulty = chunk.get("difficulty", "General")
            content = chunk.get("content", "")
            
            formatted_chunks.append(
                f"[Source {i}]: {title} ({source}, Page {page} | Difficulty: {difficulty})\n{content}"
            )
            
        return "\n\n".join(formatted_chunks)

    def build_user_prompt(
        self,
        query: str,
        retrieved_context: str,
        recent_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """Constructs the combined user prompt containing query, retrieved context, and dialogue history."""
        history_text = ""
        if recent_history:
            history_lines = []
            for h in recent_history[-3:]: # Last 3 turns
                role = "Student" if h.get("sender") == "user" else "Tutor"
                history_lines.append(f"{role}: {h.get('content', '')}")
            history_text = "\nRECENT CONVERSATION CONTEXT:\n" + "\n".join(history_lines) + "\n"
            
        return f"""==================================================
RETRIEVED EDUCATIONAL KNOWLEDGE
==================================================
{retrieved_context}
{history_text}
==================================================
STUDENT QUESTION
==================================================
{query}

Please provide your personalized, level-adapted pedagogical response now following your system directives.
"""

prompt_builder = PromptBuilder()
