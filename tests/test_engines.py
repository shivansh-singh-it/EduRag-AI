"""
Unit and integration tests for EduRAG AI ML engines, RAG pipeline, and data analytics.
"""

import unittest
import sys
import os

# Ensure backend is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.ml.proficiency_engine import ProficiencyEngine
from backend.ml.risk_predictor import RiskPredictor
from backend.rag.embeddings import embedding_engine
from backend.rag.vector_store import vector_store
from backend.rag.prompt_builder import PromptBuilder


class TestProficiencyEngine(unittest.TestCase):
    def setUp(self):
        self.engine = ProficiencyEngine()

    def test_beginner_proficiency(self):
        res = self.engine.calculate_proficiency(
            academic_profile={"average_score": 25.0, "completion_rate": 0.25, "total_taken": 1},
            engagement_profile={"total_clicks": 60, "active_days": 4}
        )
        self.assertEqual(res["tier"], "BEGINNER")
        self.assertGreaterEqual(res["confidence_score"], 40.0)
        self.assertIn("reasoning", res)

    def test_developing_proficiency(self):
        res = self.engine.calculate_proficiency(
            academic_profile={"average_score": 48.0, "completion_rate": 0.50, "total_taken": 2},
            engagement_profile={"total_clicks": 180, "active_days": 12}
        )
        self.assertEqual(res["tier"], "DEVELOPING")

    def test_intermediate_proficiency(self):
        res = self.engine.calculate_proficiency(
            academic_profile={"average_score": 66.0, "completion_rate": 0.70, "total_taken": 3},
            engagement_profile={"total_clicks": 320, "active_days": 24}
        )
        self.assertEqual(res["tier"], "INTERMEDIATE")
        self.assertGreaterEqual(res["confidence_score"], 65.0)

    def test_mastery_proficiency(self):
        res = self.engine.calculate_proficiency(
            academic_profile={"average_score": 96.0, "completion_rate": 1.0, "total_taken": 6, "score_std": 2.0},
            engagement_profile={"total_clicks": 3500, "active_days": 80}
        )
        self.assertEqual(res["tier"], "MASTERY")
        self.assertGreaterEqual(res["confidence_score"], 80.0)


class TestRiskPredictor(unittest.TestCase):
    def setUp(self):
        self.predictor = RiskPredictor()

    def test_low_concern(self):
        risk = self.predictor.evaluate_risk(
            academic_profile={"average_score": 82.0, "completion_rate": 0.90, "score_trend": "stable"},
            engagement_profile={"total_clicks": 1800, "active_days": 50, "engagement_trend": "stable"}
        )
        self.assertEqual(risk["level"], "Low Concern")

    def test_needs_attention(self):
        risk = self.predictor.evaluate_risk(
            academic_profile={"average_score": 36.0, "completion_rate": 0.40, "score_trend": "declining"},
            engagement_profile={"total_clicks": 60, "active_days": 5, "engagement_trend": "declining"}
        )
        self.assertEqual(risk["level"], "Needs Attention")
        self.assertTrue(len(risk["reasons"]) > 0)


class TestRAGPipeline(unittest.TestCase):
    def setUp(self):
        self.prompt_builder = PromptBuilder()

    def test_dense_embeddings_and_similarity(self):
        vec1 = embedding_engine.get_embedding_sync("recursion call stack activation frame")
        vec2 = embedding_engine.get_embedding_sync("recursive function and stack frames")
        vec3 = embedding_engine.get_embedding_sync("social sciences qualitative survey research")

        sim_related = vector_store._cosine_similarity(vec1, vec2)
        sim_unrelated = vector_store._cosine_similarity(vec1, vec3)

        self.assertGreater(sim_related, sim_unrelated)
        self.assertGreater(sim_related, 0.2)

    def test_vector_search(self):
        q_vec = embedding_engine.get_embedding_sync("What is a stack frame?")
        results = vector_store.search(q_vec, top_k=2)
        self.assertTrue(len(results) > 0)
        self.assertIn("similarity_score", results[0])

    def test_prompt_builder(self):
        sys_prompt = self.prompt_builder.build_system_prompt(
            student_profile={
                "name": "Alex Morgan",
                "student_id": 10042,
                "proficiency": {"tier": "INTERMEDIATE", "tier_label": "Intermediate", "confidence_score": 82.0},
                "strengths": ["Programming fundamentals"],
                "weaknesses": ["Call stack activation records"],
            },
            module="GGG"
        )
        self.assertIn("Alex Morgan", sys_prompt)
        self.assertIn("INTERMEDIATE", sys_prompt)
        self.assertIn("Call stack activation records", sys_prompt)

        user_prompt = self.prompt_builder.build_user_prompt(
            query="What is recursion?",
            retrieved_context="Call stack activation frames hold local variables."
        )
        self.assertIn("What is recursion?", user_prompt)
        self.assertIn("Call stack activation frames", user_prompt)


if __name__ == "__main__":
    unittest.main()
