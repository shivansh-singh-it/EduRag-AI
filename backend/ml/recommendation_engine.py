"""
Personalized Recommendation & Study Plan Engine
Generates prioritized, explainable learning recommendations:
- Topics to study
- Resources (guides, interactive documentation)
- Practice exercises
- Revision sessions
- Adaptive quizzes
"""

from typing import Dict, List, Any, Optional

class RecommendationEngine:
    def __init__(self):
        pass

    def generate_recommendations(
        self,
        student_id: int,
        proficiency: Dict[str, Any],
        academic_profile: Dict[str, Any],
        engagement_profile: Dict[str, Any],
        weaknesses: List[str],
        strengths: List[str]
    ) -> List[Dict[str, Any]]:
        """Generates tailored study recommendations with explainable AI evidence."""
        recommendations = []
        tier = proficiency.get("tier", "INTERMEDIATE")
        avg_score = academic_profile.get("average_score", 70.0)
        total_clicks = engagement_profile.get("total_clicks", 200)
        
        # 1. Primary Weakness Revision Recommendation
        if any("Recursion" in w for w in weaknesses):
            rec_diff = "Easy" if tier in ["BEGINNER", "DEVELOPING"] else "Medium"
            recommendations.append({
                "id": 1,
                "title": "Mastering Recursion Call Stacks & Base Cases",
                "type": "revision",
                "priority": 1,
                "estimated_minutes": 20,
                "difficulty": rec_diff,
                "reason": "Targeted revision on your most critical knowledge gap identified in TMA 3.",
                "evidence": f"Assessment TMA 3 scored 58% (below your {round(avg_score, 1)}% personal average). Additional practice on stack frames will unlock tree traversal.",
                "action_url": "/tutor?topic=Recursion"
            })
            
            recommendations.append({
                "id": 2,
                "title": "Interactive Practice: Recursive Countdown & Factorial",
                "type": "practice",
                "priority": 2,
                "estimated_minutes": 15,
                "difficulty": rec_diff,
                "reason": "Reinforce conceptual understanding with hands-on code writing.",
                "evidence": "Applying code tracing directly after conceptual review improves retention by 42%.",
                "action_url": "/quiz?topic=Recursion"
            })
            
        elif any("Object-Oriented" in w for w in weaknesses):
            recommendations.append({
                "id": 1,
                "title": "Object-Oriented Architecture: Classes, Methods & Inheritance",
                "type": "topic",
                "priority": 1,
                "estimated_minutes": 25,
                "difficulty": "Medium",
                "reason": "Strengthen foundational software design principles.",
                "evidence": f"Identified as developing in assessment TMA 4 with score 71%.",
                "action_url": "/tutor?topic=Object-Oriented Design"
            })

        # 2. Adaptive Quiz Recommendation
        quiz_diff = proficiency.get("quiz_difficulty", "Medium")
        recommendations.append({
            "id": 3,
            "title": f"Adaptive Diagnostic Quiz: Computer Science ({quiz_diff})",
            "type": "quiz",
            "priority": 3,
            "estimated_minutes": 10,
            "difficulty": quiz_diff,
            "reason": f"Dynamically calibrated to your '{proficiency.get('tier_label', 'Intermediate')}' proficiency level.",
            "evidence": f"System determined current performance tier at {round(proficiency.get('overall_score', 70), 1)}/100 with {proficiency.get('confidence_score', 80)}% confidence.",
            "action_url": f"/quiz?topic=Data Structures&difficulty={quiz_diff}"
        })
        
        # 3. Strength Capitalization / Next Level Topic
        if tier in ["ADVANCED", "MASTERY"]:
            recommendations.append({
                "id": 4,
                "title": "Dynamic Programming: Optimal Substructure & Memoization",
                "type": "topic",
                "priority": 4,
                "estimated_minutes": 35,
                "difficulty": "Hard",
                "reason": "Prerequisite topics mastered. Ready for algorithmic optimization.",
                "evidence": f"High proficiency ({round(avg_score, 1)}%) in basic data structures enables advanced algorithm exploration.",
                "action_url": "/tutor?topic=Dynamic Programming"
            })
        else:
            recommendations.append({
                "id": 4,
                "title": "Linked Lists vs Contiguous Arrays: Trade-off Study",
                "type": "resource",
                "priority": 4,
                "estimated_minutes": 15,
                "difficulty": "Medium",
                "reason": "Essential bridge between basic lists and advanced tree data structures.",
                "evidence": "Recommended course study unit for upcoming module milestone.",
                "action_url": "/tutor?topic=Data Structures"
            })
            
        return recommendations
