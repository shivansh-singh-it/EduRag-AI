"""
Pedagogical Re-ranking Engine for EduRAG AI
Scores retrieved chunks by balancing semantic relevance with pedagogical alignment
to the student's proficiency level.
"""

from typing import List, Dict, Any

class Reranker:
    def __init__(self):
        pass

    def rerank(
        self,
        candidate_chunks: List[Dict[str, Any]],
        query: str,
        student_tier: str = "INTERMEDIATE"
    ) -> List[Dict[str, Any]]:
        """Re-orders candidate chunks prioritizing semantic match and appropriate difficulty."""
        reranked = []
        
        tier_difficulty_map = {
            "BEGINNER": "Beginner",
            "DEVELOPING": "Beginner",
            "INTERMEDIATE": "Intermediate",
            "ADVANCED": "Advanced",
            "MASTERY": "Advanced"
        }
        target_diff = tier_difficulty_map.get(student_tier.upper(), "Intermediate")
        
        query_words = set(query.lower().split())
        
        for chunk in candidate_chunks:
            base_score = chunk.get("similarity_score", 0.5)
            
            # 1. Exact Topic / Title keyword boost
            title_words = set(chunk.get("title", "").lower().split())
            topic_words = set(chunk.get("topic", "").lower().split())
            overlap = len(query_words.intersection(title_words.union(topic_words)))
            topic_boost = min(0.3, overlap * 0.1)
            
            # 2. Difficulty Scaffolding Alignment
            chunk_diff = chunk.get("difficulty", "Intermediate")
            if chunk_diff.lower() == target_diff.lower():
                diff_alignment = 0.20 # Exact target tier
            elif (target_diff == "Beginner" and chunk_diff == "Intermediate") or \
                 (target_diff == "Advanced" and chunk_diff == "Intermediate"):
                diff_alignment = 0.10 # Acceptable adjacent tier
            else:
                diff_alignment = -0.10 # Mismatched complexity
                
            final_relevance = base_score + topic_boost + diff_alignment
            
            chunk_copy = dict(chunk)
            chunk_copy["reranked_score"] = round(final_relevance, 4)
            reranked.append(chunk_copy)
            
        reranked.sort(key=lambda x: x["reranked_score"], reverse=True)
        return reranked

reranker = Reranker()
