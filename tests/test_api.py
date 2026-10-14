"""
Integration tests for EduRAG AI FastAPI REST endpoints.
Tests health, student dashboard, profile, chat, and admin endpoints.
Supports in-process FastAPI TestClient for robust, headless CI/CD execution.
"""

import unittest
from fastapi.testclient import TestClient
from backend.main import app


class TestAPIEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_check(self):
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertIn("version", data)

    def test_student_dashboard(self):
        resp = self.client.get("/api/student/dashboard?student_id=10042")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("student_name", data)
        self.assertIn("cards", data)
        self.assertIn("performance_trend", data)
        self.assertIn("module_performance", data)

    def test_student_profile(self):
        resp = self.client.get("/api/student/profile?student_id=10042")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("student_id"), 10042)
        self.assertIn("proficiency", data)
        self.assertIn("strengths", data)

    def test_adaptive_chat(self):
        payload = {
            "message": "What is recursion?",
            "module": "GGG",
            "proficiency_override": "Intermediate",
        }
        resp = self.client.post("/api/chat", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("content", data)
        self.assertEqual(data.get("proficiency_level"), "Intermediate")

    def test_adaptive_quiz_generation(self):
        payload = {
            "topic": "Recursion",
            "difficulty": "Medium",
            "num_questions": 3,
        }
        resp = self.client.post("/api/quiz/generate", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("questions", data)
        self.assertTrue(len(data["questions"]) > 0)

    def test_admin_analytics(self):
        resp = self.client.get("/api/admin/analytics")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("overview", data)

    def test_student_assessments(self):
        resp = self.client.get("/api/student/assessments?student_id=10042")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("assessments", data)
        self.assertIn("total", data)

    def test_admin_risk_analytics(self):
        resp = self.client.get("/api/admin/risk-analytics")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("cohort", data)
        self.assertIn("summary", data)
        self.assertIn("low_concern_pct", data)

    def test_admin_load_dataset(self):
        resp = self.client.post("/api/admin/load-dataset")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("summary", data)


if __name__ == "__main__":
    unittest.main()
