"""
Research Evaluation & Ablation Study API Router for EduRAG AI
Inspired by the PRAG-EDU research paper:
- Quantitative metrics: BERTScore F1, ROUGE-L, METEOR, BLEU
- Qualitative metrics: Mean Rating Score, Bayesian Average, High-Quality Response Rate
- A/B Evaluation: Generic LLM vs Context-Aware Personalized RAG
- 4-Way Ablation Study (Full PRAG-EDU, No Personalization, No Retrieval, Vanilla LLM)
Clearly labelled: 'Illustrative / Demo Data (Paper Inspired)'
"""

from typing import Dict, List, Any
from fastapi import APIRouter, Depends
from backend.api.auth import get_current_user
from backend.schemas.pydantic_models import UserOut, RAGEvaluationMetrics

router = APIRouter(prefix="/admin", tags=["Research & Evaluation"])

@router.get("/evaluation")
def get_evaluation_metrics(current_user: UserOut = Depends(get_current_user)):
    """Returns RAG and adaptation evaluation metrics inspired by the research paper."""
    metrics = {
        "data_status": "Illustrative / Demo Data (Paper Inspired)",
        "paper_citation": "Towards Personalized AI Education: Context-Aware Retrieval-Augmented Generation With Grade-Level LLM Adaptation",
        "quantitative_metrics": {
            "bert_score_f1": 0.884,
            "rouge_l": 0.672,
            "meteor": 0.548,
            "bleu_4": 0.461,
            "semantic_similarity": 0.892
        },
        "qualitative_metrics": {
            "mean_rating_score": 4.62, # Out of 5.0
            "bayesian_average_rating": 4.54,
            "high_quality_response_rate": 0.915, # 91.5%
            "perfect_alignment_rate": 0.864 # 86.4%
        },
        "grade_level_adaptation_fidelity": {
            "beginner_analogy_presence_rate": 0.94,
            "intermediate_complexity_coverage": 0.89,
            "advanced_tradeoff_depth_rate": 0.92,
            "hallucination_rate": 0.03 # 3%
        }
    }
    return metrics

@router.get("/ab-comparison")
def get_ab_comparison(current_user: UserOut = Depends(get_current_user)):
    """Provides side-by-side A/B comparison of Generic LLM vs Personalized RAG."""
    comparison = {
        "question": "What is a linked list and how is it used in memory?",
        "student_profile": {
            "name": "Alex Morgan",
            "proficiency_tier": "Intermediate",
            "confidence": "78%",
            "weakness": "Recursion & memory structures",
            "strength": "Python syntax"
        },
        "generic_llm_response": {
            "system_type": "Vanilla LLM (Zero Context / Generic)",
            "explanation_level": "Uniform One-Size-Fits-All",
            "content": (
                "A linked list is a data structure consisting of nodes where each node contains data and a pointer to the next node. "
                "Unlike arrays, linked lists are not stored contiguously in memory. Linked lists can be singly linked, doubly linked, "
                "or circular. In C, you use malloc() to allocate memory for each node: struct Node* head = malloc(sizeof(struct Node)). "
                "Linked lists allow dynamic memory sizing but require extra memory for pointers and do not allow random access."
            ),
            "citations": [],
            "pedagogical_score": 3.1,
            "strengths": ["Technically accurate", "Concise"],
            "drawbacks": ["Does not match student's current Python focus", "Fails to address known recursion/stack gaps", "No check-for-understanding"]
        },
        "personalized_rag_response": {
            "system_type": "PRAG-EDU Context-Aware RAG (EduRAG AI)",
            "explanation_level": "Adapted to Intermediate Proficiency",
            "content": (
                "In your Computer Science module (FFF), a Linked List is a linear data structure whose elements are not stored at contiguous "
                "memory addresses. Instead, each element is a discrete `Node` object containing data and a reference pointer to the subsequent "
                "node in heap memory.\n\n"
                "### Memory Layout vs Contiguous Arrays:\n"
                "Unlike standard Python lists (which use contiguous memory blocks for O(1) indexed lookups), linked list nodes can reside "
                "anywhere in memory. You trade O(1) random access for O(1) insertion at the head without shifting elements.\n\n"
                "```python\n"
                "class Node:\n"
                "    def __init__(self, data):\n"
                "        self.data = data\n"
                "        self.next = None\n"
                "```\n\n"
                "Because your recent assessment highlighted recursive call stacks, notice how linked lists naturally connect to recursive "
                "traversal: traversing a list is simply processing the head and recursing on `head.next` until reaching the base case `None`!"
            ),
            "citations": [
                {"title": "Linked Lists vs Arrays: Memory Layout and Big-O Trade-offs", "source": "Open University FFF Data Structures Handbook, p. 44"}
            ],
            "pedagogical_score": 4.8,
            "strengths": [
                "Directly bridges known knowledge gap (Recursion)",
                "Matches student's enrolled module (FFF Python)",
                "Explicitly compares contiguous vs heap memory models",
                "Includes verified course curriculum citation"
            ],
            "drawbacks": ["Slightly longer token length"]
        }
    }
    return comparison

@router.get("/ablation-study")
def get_ablation_study(current_user: UserOut = Depends(get_current_user)):
    """Returns 4-way ablation analysis metrics comparing architectural components."""
    ablation_results = [
        {
            "variant": "Full Personalized RAG (PRAG-EDU)",
            "description": "Student Proficiency Signals + Vector Retrieval + Grade-Level Prompt Adaptation",
            "factual_alignment": 94.2,
            "semantic_similarity": 89.2,
            "pedagogical_suitability": 93.5,
            "hallucination_rate": 2.8,
            "bert_score_f1": 0.884,
            "bleu": 0.461
        },
        {
            "variant": "No Personalization (RAG Only)",
            "description": "Vector Retrieval enabled, but uniform generic prompts without student proficiency tiering",
            "factual_alignment": 91.8,
            "semantic_similarity": 81.4,
            "pedagogical_suitability": 74.0,
            "hallucination_rate": 3.4,
            "bert_score_f1": 0.812,
            "bleu": 0.385
        },
        {
            "variant": "No Retrieval (Personalization Only)",
            "description": "Student Proficiency Signals enabled, but no vector grounding against verified curriculum documents",
            "factual_alignment": 76.5,
            "semantic_similarity": 78.2,
            "pedagogical_suitability": 82.1,
            "hallucination_rate": 11.6,
            "bert_score_f1": 0.768,
            "bleu": 0.312
        },
        {
            "variant": "Vanilla LLM (Zero Context)",
            "description": "Standard base LLM with no student profile and no retrieved course material",
            "factual_alignment": 72.0,
            "semantic_similarity": 69.5,
            "pedagogical_suitability": 61.2,
            "hallucination_rate": 14.8,
            "bert_score_f1": 0.704,
            "bleu": 0.245
        }
    ]
    return {
        "status": "Illustrative / Demo Data (Paper Inspired)",
        "metrics_description": "Ablation results illustrating the incremental pedagogical gains of combining student academic signals with contextual vector retrieval.",
        "variants": ablation_results
    }
