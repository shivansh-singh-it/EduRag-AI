"""
Configurable Proficiency Weights and Thresholds for EduRAG AI
Inspired by the PRAG-EDU conceptual framework adapted for OULAD data signals.
"""

from typing import Dict, List, Tuple

# Proficiency Tier Definitions
PROFICIENCY_TIERS = {
    "BEGINNER": {
        "min_score": 0.0,
        "max_score": 39.99,
        "label": "Beginner",
        "description": "Foundational understanding. Benefits from simple analogies, step-by-step guidance, and concrete code demonstrations without overwhelming abstraction.",
        "color": "#ef4444", # Red
        "badge_variant": "destructive",
        "target_explanation_depth": "introductory",
        "quiz_difficulty": "Easy"
    },
    "DEVELOPING": {
        "min_score": 40.0,
        "max_score": 59.99,
        "label": "Developing",
        "description": "Grasping core concepts. Needs reinforcement on multi-step mechanics, guided practice, and structured breakdown of problem-solving techniques.",
        "color": "#f59e0b", # Amber
        "badge_variant": "warning",
        "target_explanation_depth": "guided",
        "quiz_difficulty": "Medium"
    },
    "INTERMEDIATE": {
        "min_score": 60.0,
        "max_score": 74.99,
        "label": "Intermediate",
        "description": "Solid comprehension of principles. Ready for standard technical terminology, architectural flow, implementation patterns, and moderate complexity.",
        "color": "#3b82f6", # Blue
        "badge_variant": "default",
        "target_explanation_depth": "standard",
        "quiz_difficulty": "Medium"
    },
    "ADVANCED": {
        "min_score": 75.0,
        "max_score": 89.99,
        "label": "Advanced",
        "description": "High academic command. Thrives on algorithmic reasoning, time/space complexity analysis, edge cases, and architectural tradeoffs.",
        "color": "#8b5cf6", # Purple
        "badge_variant": "secondary",
        "target_explanation_depth": "deep",
        "quiz_difficulty": "Hard"
    },
    "MASTERY": {
        "min_score": 90.0,
        "max_score": 100.0,
        "label": "Mastery",
        "description": "Expert synthesis and theoretical mastery. Engages with advanced optimizations, mathematical proofs, low-level mechanics, and cutting-edge paradigms.",
        "color": "#10b981", # Emerald
        "badge_variant": "success",
        "target_explanation_depth": "expert",
        "quiz_difficulty": "Expert"
    }
}

# Signal Weights for Multi-Dimensional Proficiency Computation
# Total sums to 1.00 (100%)
DEFAULT_PROFICIENCY_WEIGHTS = {
    "assessment_performance": 0.45,  # Weighted average score on TMAs/CMAs/Exams
    "assessment_completion": 0.20,   # Percentage of expected assessments submitted
    "vle_engagement": 0.20,          # Relative activity volume (clicks & active days)
    "learning_consistency": 0.15      # Stability of score and regularity of access
}

# Module-Specific Weight Adjustments (Optional Fine-tuning by Domain)
MODULE_WEIGHT_OVERLAYS: Dict[str, Dict[str, float]] = {
    "FFF": {  # Computer Science / STEM: heavier emphasis on assessments & problem solving
        "assessment_performance": 0.50,
        "assessment_completion": 0.20,
        "vle_engagement": 0.15,
        "learning_consistency": 0.15
    },
    "BBB": {  # Social Sciences / Collaborative: heavier emphasis on VLE & forums
        "assessment_performance": 0.40,
        "assessment_completion": 0.20,
        "vle_engagement": 0.25,
        "learning_consistency": 0.15
    },
    "CCC": {  # Advanced Computing / Quantitative
        "assessment_performance": 0.45,
        "assessment_completion": 0.20,
        "vle_engagement": 0.20,
        "learning_consistency": 0.15
    }
}

# Confidence Score Parameters
MIN_ASSESSMENTS_FOR_HIGH_CONFIDENCE = 3
MIN_CLICKS_FOR_HIGH_CONFIDENCE = 150
CONFIDENCE_DECAY_PER_MISSING_ASSESSMENT = 0.15
