"""
PRAG-EDU Inspired Rule-Based Student Proficiency Engine
Converts multi-source OULAD signals (Assessment Performance, Completion Rate,
VLE Engagement, and Learning Consistency) into transparent, calibrated proficiency tiers.
"""

from typing import Dict, Any, Tuple
from backend.config.proficiency_config import (
    PROFICIENCY_TIERS,
    DEFAULT_PROFICIENCY_WEIGHTS,
    MODULE_WEIGHT_OVERLAYS,
    MIN_ASSESSMENTS_FOR_HIGH_CONFIDENCE,
    MIN_CLICKS_FOR_HIGH_CONFIDENCE
)

class ProficiencyEngine:
    def __init__(self, custom_weights: Dict[str, float] = None):
        self.weights = custom_weights or DEFAULT_PROFICIENCY_WEIGHTS

    def calculate_proficiency(
        self,
        academic_profile: Dict[str, Any],
        engagement_profile: Dict[str, Any],
        module_code: str = "GLOBAL"
    ) -> Dict[str, Any]:
        """Calculates multi-dimensional proficiency score, tier, confidence, and explanation."""
        weights = MODULE_WEIGHT_OVERLAYS.get(module_code, self.weights)
        
        # 1. Assessment Score Component (0-100)
        assessment_score = float(academic_profile.get("weighted_score", 0.0) or academic_profile.get("average_score", 0.0))
        
        # 2. Completion Component (0-100)
        completion_ratio = float(academic_profile.get("completion_rate", 0.0))
        completion_score = min(100.0, completion_ratio * 100.0)
        
        # 3. VLE Engagement Component (0-100 normalized)
        # Using a sigmoid-like or logarithmic saturation: 400 clicks is benchmark 100%
        total_clicks = float(engagement_profile.get("total_clicks", 0))
        active_days = float(engagement_profile.get("active_days", 0))
        engagement_score = min(100.0, (total_clicks / 400.0) * 70.0 + min(30.0, (active_days / 30.0) * 30.0))
        
        # 4. Consistency Component (0-100)
        # Lower std dev in scores -> higher consistency score
        score_std = float(academic_profile.get("score_std", 15.0))
        consistency_score = max(0.0, min(100.0, 100.0 - (score_std * 2.5)))
        
        # Weighted Composite Score
        composite_score = (
            assessment_score * weights["assessment_performance"] +
            completion_score * weights["assessment_completion"] +
            engagement_score * weights["vle_engagement"] +
            consistency_score * weights["learning_consistency"]
        )
        composite_score = round(max(0.0, min(100.0, composite_score)), 1)
        
        # Determine Tier
        assigned_tier = "INTERMEDIATE"
        tier_info = PROFICIENCY_TIERS["INTERMEDIATE"]
        for tier_key, info in PROFICIENCY_TIERS.items():
            if info["min_score"] <= composite_score <= info["max_score"]:
                assigned_tier = tier_key
                tier_info = info
                break
                
        # Confidence Score Calculation
        assessments_taken = academic_profile.get("total_taken", 0)
        assessment_factor = min(1.0, assessments_taken / float(MIN_ASSESSMENTS_FOR_HIGH_CONFIDENCE))
        engagement_factor = min(1.0, total_clicks / float(MIN_CLICKS_FOR_HIGH_CONFIDENCE))
        
        # Base confidence from data richness
        base_confidence = 0.50 + (0.30 * assessment_factor) + (0.20 * engagement_factor)
        
        # Deduct if high variance with few assessments
        if assessments_taken < 2:
            base_confidence *= 0.75
            
        confidence_percentage = round(min(0.98, max(0.40, base_confidence)) * 100, 1)
        
        # Explainable AI Reasoning Generation
        reasons = []
        reasons.append(
            f"Assigned '{tier_info['label']}' with {confidence_percentage}% confidence based on composite score of {composite_score}/100."
        )
        reasons.append(
            f"Assessment performance contributed {round(assessment_score * weights['assessment_performance'], 1)} pts (avg score: {round(assessment_score, 1)})."
        )
        reasons.append(
            f"VLE activity contributed {round(engagement_score * weights['vle_engagement'], 1)} pts ({int(total_clicks)} clicks across {int(active_days)} active study days)."
        )
        reasons.append(
            f"Assessment submission rate ({int(completion_ratio * 100)}%) and score consistency (std: {round(score_std, 1)}) contributed {round((completion_score * weights['assessment_completion']) + (consistency_score * weights['learning_consistency']), 1)} pts."
        )
        
        reasoning_text = " ".join(reasons)
        
        return {
            "overall_score": composite_score,
            "tier": assigned_tier,
            "tier_label": tier_info["label"],
            "description": tier_info["description"],
            "confidence_score": confidence_percentage,
            "target_depth": tier_info["target_explanation_depth"],
            "quiz_difficulty": tier_info["quiz_difficulty"],
            "color": tier_info["color"],
            "reasoning": reasoning_text,
            "breakdown": {
                "assessment_score": round(assessment_score, 1),
                "completion_score": round(completion_score, 1),
                "engagement_score": round(engagement_score, 1),
                "consistency_score": round(consistency_score, 1)
            }
        }
