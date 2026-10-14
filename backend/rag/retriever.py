"""
Retrieval Pipeline for EduRAG AI
Coordinates Query Rewriting, Vector Search, and Pedagogical Re-ranking.
"""

from typing import List, Dict, Any, Optional
from backend.rag.embeddings import embedding_engine
from backend.rag.vector_store import vector_store
from backend.rag.query_rewriter import query_rewriter
from backend.rag.reranker import reranker

class EducationalRetriever:
    def __init__(self):
        pass

    async def retrieve_context(
        self,
        query: str,
        student_profile: Dict[str, Any],
        module: str = "FFF",
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """Executes full RAG retrieval pipeline with student context."""
        proficiency = student_profile.get("proficiency", {})
        tier = proficiency.get("tier", "INTERMEDIATE")
        
        # 1. Query Analysis and Rewriting
        rewritten = query_rewriter.rewrite_query(query, student_profile, current_module=module)
        search_text = rewritten["expanded_query"]
        
        # 2. Vector Embedding
        query_vector = await embedding_engine.get_embedding(search_text)
        
        # 3. Vector Similarity Search with Module Filtering
        candidates = vector_store.search(
            query_vector=query_vector,
            top_k=top_k * 2, # Fetch broader candidate pool for re-ranking
            module_filter=module
        )
        
        # If module filter returned too few, search without module filter
        if len(candidates) < top_k:
            broader_candidates = vector_store.search(
                query_vector=query_vector,
                top_k=top_k * 2
            )
            candidates = list({c["id"]: c for c in candidates + broader_candidates}.values())
            
        # 4. Pedagogical Re-ranking
        ranked = reranker.rerank(candidates, query=query, student_tier=tier)
        
        return ranked[:top_k]

retriever = EducationalRetriever()
