"""
Context-Aware Query Rewriting Engine for EduRAG AI
Enriches student inquiries with learning profile context, module concepts,
and pedagogical target depth before vector retrieval.
"""

from typing import Dict, Any, List

class QueryRewriter:
    def __init__(self):
        pass

    def rewrite_query(
        self,
        raw_query: str,
        student_profile: Dict[str, Any],
        current_module: str = "FFF",
        current_topic: str = "General"
    ) -> Dict[str, Any]:
        """Expands query with domain keywords and target proficiency depth."""
        proficiency = student_profile.get("proficiency", {})
        tier = proficiency.get("tier", "INTERMEDIATE")
        weaknesses = student_profile.get("weaknesses", [])
        
        expansion_terms = []
        
        # Module context
        if current_module == "FFF":
            expansion_terms.append("Computer Science Python Programming Data Structures Algorithms")
        elif current_module == "BBB":
            expansion_terms.append("Social Sciences Educational Analytics Research Methods")
        elif current_module == "CCC":
            expansion_terms.append("Mathematical Methods Computing Discrete Systems")

        # Proficiency depth directive terms
        if tier in ["BEGINNER", "DEVELOPING"]:
            expansion_terms.append("introductory fundamentals base cases simple analogy core concepts")
        elif tier == "INTERMEDIATE":
            expansion_terms.append("implementation mechanisms call stack traversal data structures trade-offs")
        elif tier in ["ADVANCED", "MASTERY"]:
            expansion_terms.append("complexity optimization tail recursion memory allocation theoretical models")
            
        # Weakness reinforcement
        for w in weaknesses:
            if any(term in raw_query.lower() for term in w.lower().split()):
                expansion_terms.append(f"targeted clarification for knowledge gap {w}")
                
        expanded_query = f"{raw_query}. {' '.join(expansion_terms)}"
        
        return {
            "original_query": raw_query,
            "expanded_query": expanded_query,
            "target_tier": tier,
            "module_context": current_module,
            "topic_context": current_topic
        }

query_rewriter = QueryRewriter()
