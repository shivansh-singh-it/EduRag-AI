"""
Vector Store for EduRAG AI
Manages document chunks, embedding vectors, metadata filtering,
and cosine similarity retrieval.
"""

import os
import json
import math
import logging
from typing import List, Dict, Any, Optional
from backend.config.settings import settings
from backend.rag.embeddings import embedding_engine

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self):
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.chunks: List[Dict[str, Any]] = []
        self._load_corpus()

    def _load_corpus(self):
        """Loads and indexes the educational corpus from data/knowledge_base/."""
        corpus_path = os.path.join(settings.KNOWLEDGE_BASE_DIR, "educational_corpus.json")
        if not os.path.exists(corpus_path):
            logger.warning(f"Corpus file not found at {corpus_path}")
            return
            
        try:
            with open(corpus_path, "r", encoding="utf-8") as f:
                docs = json.load(f)
                for doc in docs:
                    self.add_document(doc)
            logger.info(f"Loaded and indexed {len(self.chunks)} educational chunks in Vector Store.")
        except Exception as e:
            logger.error(f"Error loading corpus: {e}")

    def add_document(self, doc_data: Dict[str, Any]):
        """Indexes a document and its chunk with semantic embeddings."""
        doc_id = doc_data["id"]
        self.documents[doc_id] = doc_data
        
        # In this educational corpus, each doc entry acts as a rich chunk with metadata
        content = doc_data.get("content", "")
        title = doc_data.get("title", "")
        combined_text = f"{title}. {content}"
        
        embedding = embedding_engine.get_embedding_sync(combined_text)
        
        chunk = {
            "id": f"{doc_id}_chunk_0",
            "document_id": doc_id,
            "title": title,
            "course": doc_data.get("course", "Computer Science"),
            "module": doc_data.get("module", "FFF"),
            "topic": doc_data.get("topic", "General"),
            "difficulty": doc_data.get("difficulty", "Intermediate"),
            "academic_level": doc_data.get("academic_level", "Undergraduate Year 1"),
            "source": doc_data.get("source", "Course Materials"),
            "page": doc_data.get("page", 1),
            "content": content,
            "embedding": embedding
        }
        
        # Remove existing chunk with same id if any
        self.chunks = [c for c in self.chunks if c["id"] != chunk["id"]]
        self.chunks.append(chunk)

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Computes cosine similarity between two normalized vectors."""
        if not vec_a or not vec_b:
            return 0.0
        # Vectors are already L2 normalized, so dot product = cosine similarity
        min_len = min(len(vec_a), len(vec_b))
        dot = sum(vec_a[i] * vec_b[i] for i in range(min_len))
        return max(-1.0, min(1.0, dot))

    def search(
        self,
        query_vector: List[float],
        top_k: int = 3,
        module_filter: Optional[str] = None,
        difficulty_filter: Optional[str] = None,
        topic_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Searches chunks with cosine similarity and metadata filters."""
        candidates = self.chunks
        
        # Apply metadata filters
        if module_filter:
            candidates = [c for c in candidates if c["module"].upper() == module_filter.upper()]
            
        if topic_filter:
            candidates = [c for c in candidates if topic_filter.lower() in c["topic"].lower()]
            
        if difficulty_filter:
            # Prefer matching difficulty, but allow adjacent if not enough candidates
            matching = [c for c in candidates if c["difficulty"].lower() == difficulty_filter.lower()]
            if len(matching) >= top_k:
                candidates = matching
                
        # Calculate similarity scores
        scored = []
        for chunk in candidates:
            score = self._cosine_similarity(query_vector, chunk["embedding"])
            # Format return dict without the raw vector to save bandwidth
            scored.append({
                "id": chunk["id"],
                "document_id": chunk["document_id"],
                "title": chunk["title"],
                "course": chunk["course"],
                "module": chunk["module"],
                "topic": chunk["topic"],
                "difficulty": chunk["difficulty"],
                "academic_level": chunk["academic_level"],
                "source": chunk["source"],
                "page": chunk["page"],
                "content": chunk["content"],
                "similarity_score": round(score, 4)
            })
            
        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:top_k]

vector_store = VectorStore()
