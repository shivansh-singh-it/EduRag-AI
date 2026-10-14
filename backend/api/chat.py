"""
AI Tutor & Context-Aware Chat Router for EduRAG AI
Integrates PRAG-EDU Pipeline:
Student Profile -> Proficiency Engine -> Query Rewriting -> Vector Retrieval -> Prompt Builder -> LLM Generator
"""

import uuid
import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from backend.api.auth import get_current_user
from backend.schemas.pydantic_models import (
    ChatMessageIn, ChatMessageOut, ChatFeedbackIn, SourceCitation, UserOut
)
from backend.data_pipeline.load_data import OULADLoader
from backend.data_pipeline.clean_data import OULADCleaner
from backend.data_pipeline.student_profile import StudentProfileBuilder
from backend.ml.proficiency_engine import ProficiencyEngine
from backend.rag.retriever import retriever
from backend.rag.prompt_builder import prompt_builder
from backend.rag.generator import response_generator
from backend.models.database import get_connection

router = APIRouter(prefix="/chat", tags=["AI Tutor"])

loader = OULADLoader()
cleaner = OULADCleaner()
profile_builder = StudentProfileBuilder()
proficiency_engine = ProficiencyEngine()

# In-memory session message store for rapid responsiveness
SESSION_MESSAGES: Dict[str, List[Dict[str, Any]]] = {}

@router.post("", response_model=ChatMessageOut)
async def chat_interaction(
    payload: ChatMessageIn,
    current_user: UserOut = Depends(get_current_user)
):
    student_id = current_user.student_id or 10001
    session_id = payload.session_id or f"session_{uuid.uuid4().hex[:8]}"
    
    # 1. Load Student Learning Profile & Calculate Proficiency
    raw_data = cleaner.clean_all(loader.load_all())
    profile = profile_builder.build_profile(student_id, raw_data, student_name_override=current_user.name)
    prof = proficiency_engine.calculate_proficiency(profile["academic_profile"], profile["engagement_profile"], payload.module or "FFF")
    
    # Allow manual override for adaptive testing in the UI
    active_tier = payload.proficiency_override or prof["tier"]
    prof["tier"] = active_tier
    prof["tier_label"] = active_tier.capitalize()
    profile["proficiency"] = prof
    
    # 2. Retrieve Educational Context via RAG
    retrieved_chunks = await retriever.retrieve_context(
        query=payload.message,
        student_profile=profile,
        module=payload.module or "FFF",
        top_k=2
    )
    
    # 3. Build Context-Aware Prompts
    system_prompt = prompt_builder.build_system_prompt(profile, module=payload.module or "FFF")
    retrieved_context_str = prompt_builder.format_retrieved_context(retrieved_chunks)
    history = SESSION_MESSAGES.get(session_id, [])
    user_prompt = prompt_builder.build_user_prompt(payload.message, retrieved_context_str, history)
    
    # 4. Generate Level-Adapted Pedagogical Response
    gen_result = await response_generator.generate_response(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        query=payload.message,
        student_tier=active_tier,
        retrieved_sources=retrieved_chunks
    )
    
    # 5. Format Source Citations
    citations = []
    for c in retrieved_chunks:
        citations.append(SourceCitation(
            id=c["id"],
            title=c["title"],
            topic=c["topic"],
            difficulty=c["difficulty"],
            source=c["source"],
            page=c.get("page", 1),
            relevance_score=c.get("reranked_score", 0.85)
        ))
        
    msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    
    # Store in history
    if session_id not in SESSION_MESSAGES:
        SESSION_MESSAGES[session_id] = []
    SESSION_MESSAGES[session_id].append({"sender": "user", "content": payload.message})
    SESSION_MESSAGES[session_id].append({"sender": "assistant", "content": gen_result["content"]})
    
    # Persist session and message to SQLite database
    try:
        conn = get_connection()
        conn.execute(
            "INSERT OR IGNORE INTO chat_sessions (id, student_id, code_module, topic, title) VALUES (?, ?, ?, ?, ?)",
            (session_id, student_id, payload.module or "FFF", payload.topic or "General", f"Chat: {payload.message[:30]}")
        )
        conn.execute(
            "INSERT INTO chat_messages (id, session_id, sender, content, explanation_tier) VALUES (?, ?, ?, ?, ?)",
            (msg_id, session_id, "assistant", gen_result["content"], active_tier)
        )
        conn.commit()
        conn.close()
    except Exception:
        pass
        
    return ChatMessageOut(
        id=msg_id,
        session_id=session_id,
        sender="assistant",
        content=gen_result["content"],
        proficiency_level=active_tier,
        explanation_tier=f"{active_tier.capitalize()} Level",
        prompt_context={
            "module": payload.module or "FFF",
            "proficiency_tier": active_tier,
            "target_depth": prof.get("target_depth", "standard"),
            "retrieved_chunk_count": len(retrieved_chunks),
            "model": gen_result.get("model", "PRAG-EDU Adaptive Engine")
        },
        retrieved_sources=citations,
        suggested_followups=gen_result.get("followups", ["Explain simpler", "Explain deeper", "Give practice question"]),
        mode=gen_result.get("mode", "Demo Mode")
    )

@router.get("/adaptive-demo")
async def get_adaptive_demo(
    topic: str = Query("linked list", description="Topic to generate comparisons for")
):
    """Demonstrates PRAG-EDU 3-tier adaptive output side-by-side (Beginner vs Intermediate vs Advanced)."""
    raw_data = cleaner.clean_all(loader.load_all())
    profile = profile_builder.build_profile(10001, raw_data)
    
    retrieved = await retriever.retrieve_context(topic, profile, "FFF", top_k=2)
    
    beginner_resp = await response_generator.generate_response("", "", topic, "BEGINNER", retrieved)
    intermediate_resp = await response_generator.generate_response("", "", topic, "INTERMEDIATE", retrieved)
    advanced_resp = await response_generator.generate_response("", "", topic, "ADVANCED", retrieved)
    
    return {
        "topic": topic,
        "question": f"What is a {topic}?",
        "comparisons": {
            "beginner": {
                "tier": "BEGINNER",
                "label": "Beginner Level",
                "focus": "Intuitive Real-world Analogy + Simple Diagram + Basic Code",
                "content": beginner_resp["content"]
            },
            "intermediate": {
                "tier": "INTERMEDIATE",
                "label": "Intermediate Level",
                "focus": "Node Topology + Traversal Mechanics + Big-O Time/Space Matrix",
                "content": intermediate_resp["content"]
            },
            "advanced": {
                "tier": "ADVANCED",
                "label": "Advanced / Mastery Level",
                "focus": "L1/L2 Cache Locality + Pointer Overhead + Lock-Free Concurrent Structures",
                "content": advanced_resp["content"]
            }
        },
        "retrieved_sources": [
            {"title": r["title"], "source": r["source"], "page": r.get("page", 1)} for r in retrieved
        ]
    }

@router.post("/feedback")
def submit_chat_feedback(feedback: ChatFeedbackIn, current_user: UserOut = Depends(get_current_user)):
    try:
        conn = get_connection()
        conn.execute(
            "INSERT INTO feedback (message_id, student_id, rating, comment) VALUES (?, ?, ?, ?)",
            (feedback.message_id, current_user.student_id or 10001, feedback.rating, feedback.comment)
        )
        conn.commit()
        conn.close()
    except Exception:
        pass
    return {"status": "success", "message": "Feedback recorded. Thank you for helping EduRAG AI improve!"}
