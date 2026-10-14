"""
Student Profile Generator for EduRAG AI
Integrates clean OULAD data, engineered features, and strengths/weaknesses.
"""

from typing import Dict, List, Any, Optional
from backend.data_pipeline.feature_engineering import FeatureEngineer

class StudentProfileBuilder:
    def __init__(self):
        self.engineer = FeatureEngineer()

    def build_profile(
        self,
        student_id: int,
        data: Dict[str, List[Dict[str, Any]]],
        student_name_override: Optional[str] = None
    ) -> Dict[str, Any]:
        """Assembles a complete Student Learning Profile object."""
        student_infos = [s for s in data.get("student_info", []) if s["id_student"] == student_id]
        primary_info = student_infos[0] if student_infos else {
            "id_student": student_id,
            "gender": "Unknown",
            "region": "South East Region",
            "highest_education": "A Level or Equivalent",
            "imd_band": "50-60%",
            "age_band": "0-35",
            "num_of_prev_attempts": 0,
            "studied_credits": 60,
            "disability": "N",
            "final_result": "Pass"
        }
        
        # Name resolution
        name = student_name_override
        if not name:
            name_map = {
                10001: "Alex Morgan",
                10002: "Marcus Vance",
                10003: "Elena Rostova",
                10004: "David Kim",
                10005: "Sophia Chen",
                10006: "Liam Connor",
                10007: "Priya Sharma"
            }
            name = name_map.get(student_id, f"Student {student_id}")
            
        academic = self.engineer.extract_student_academic_features(
            student_id,
            data.get("student_assessment", []),
            data.get("assessments", [])
        )
        
        engagement = self.engineer.extract_student_engagement_features(
            student_id,
            data.get("student_vle", []),
            data.get("vle", [])
        )
        
        modules = self.engineer.extract_module_level_features(
            student_id,
            data.get("student_info", []),
            data.get("student_assessment", []),
            data.get("assessments", [])
        )
        
        # Determine Strengths and Weaknesses based on assessment items & topics
        strengths = []
        weaknesses = []
        
        # Check individual assessment performance
        submissions = [s for s in data.get("student_assessment", []) if s["id_student"] == student_id]
        for s in submissions:
            score = s["score"]
            if score >= 80:
                if s["id_assessment"] in [34885, 15020]:
                    strengths.append("Programming Fundamentals & Basic Syntax")
                elif s["id_assessment"] in [34886, 24290]:
                    strengths.append("Core Data Structures (Arrays & Lists)")
            elif score < 65:
                if s["id_assessment"] in [34887]:
                    weaknesses.append("Recursive Problem Solving & Stack Frames")
                elif s["id_assessment"] in [34888]:
                    weaknesses.append("Object-Oriented Design Principles")
                elif s["id_assessment"] in [34889]:
                    weaknesses.append("Complex Algorithmic Analysis")
                    
        # Defaults if empty
        if not strengths:
            if academic["average_score"] >= 70:
                strengths = ["Structured Programming", "Algorithmic Logic", "Independent Study Habits"]
            else:
                strengths = ["Interactive Quizzes", "Introductory Concepts", "Visual Code Tracing"]
                
        if not weaknesses:
            if academic["average_score"] < 60:
                weaknesses = ["Algorithmic Complexity", "Recursion", "Memory Allocation Models"]
            else:
                weaknesses = ["Advanced Dynamic Programming", "Edge-Case Optimization"]
                
        # Deduplicate
        strengths = list(dict.fromkeys(strengths))
        weaknesses = list(dict.fromkeys(weaknesses))
        
        return {
            "student_id": student_id,
            "name": name,
            "demographics": {
                "gender": primary_info["gender"],
                "region": primary_info["region"],
                "highest_education": primary_info["highest_education"],
                "imd_band": primary_info["imd_band"],
                "age_band": primary_info["age_band"],
                "num_of_prev_attempts": primary_info["num_of_prev_attempts"],
                "studied_credits": primary_info["studied_credits"],
                "disability": primary_info["disability"]
            },
            "academic_profile": academic,
            "engagement_profile": engagement,
            "module_profiles": modules,
            "strengths": strengths,
            "weaknesses": weaknesses
        }
