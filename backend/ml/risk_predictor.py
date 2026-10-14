"""
Educational Risk / Early Warning Indicator Engine
Evaluates academic momentum, VLE engagement drops, and submission punctuality.
Labels: 'Low Concern', 'Moderate Concern', 'Needs Attention'
Focuses on actionable intervention rather than deterministic judgment.
"""

from typing import Dict, List, Any

class RiskPredictor:
    def __init__(self):
        pass

    def evaluate_risk(
        self,
        academic_profile: Dict[str, Any],
        engagement_profile: Dict[str, Any],
        demographics: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Evaluates non-punitive educational early warning signals."""
        reasons = []
        concern_points = 0
        
        # 1. Assessment Performance & Trend Signal
        avg_score = academic_profile.get("average_score", 70.0)
        score_trend = academic_profile.get("score_trend", "stable")
        completion_rate = academic_profile.get("completion_rate", 1.0)
        
        if avg_score < 50.0:
            concern_points += 3
            reasons.append(f"Recent assessment average ({avg_score}%) is currently below foundational pass threshold (50%).")
        elif avg_score < 65.0:
            concern_points += 1
            reasons.append(f"Assessment performance ({avg_score}%) suggests review of core algorithmic topics would be beneficial.")
            
        if score_trend == "declining":
            concern_points += 2
            reasons.append("Recent assessment trajectory demonstrates a declining score trend over consecutive submissions.")
            
        if completion_rate < 0.60:
            concern_points += 2
            reasons.append(f"Low assessment completion rate ({int(completion_rate * 100)}% of expected assessments submitted).")
            
        # 2. VLE Engagement & Trend Signal
        total_clicks = engagement_profile.get("total_clicks", 300)
        active_days = engagement_profile.get("active_days", 20)
        eng_trend = engagement_profile.get("engagement_trend", "stable")
        
        if total_clicks < 100 or active_days < 8:
            concern_points += 2
            reasons.append(f"Low platform interaction volume ({total_clicks} total clicks across {active_days} active days).")
            
        if eng_trend == "declining":
            concern_points += 1
            reasons.append("VLE study activity and resource interactions have decreased compared to earlier weeks.")
            
        # 3. Previous attempts context (educational continuity)
        prev_attempts = demographics.get("num_of_prev_attempts", 0) if demographics else 0
        if prev_attempts > 1:
            concern_points += 1
            reasons.append(f"Student has {prev_attempts} previous attempts on this module and would benefit from proactive tutoring.")

        # Classify Tier
        if concern_points >= 4:
            level = "Needs Attention"
            color = "#ef4444" # Red
            recommendation = "Schedule targeted revision on weak topics, complete the beginner-friendly practice set, and reach out to course tutors."
        elif concern_points >= 2:
            level = "Moderate Concern"
            color = "#f59e0b" # Amber
            recommendation = "Reinforce core topics before starting the next module assignment, and aim for at least 3 active study sessions per week."
        else:
            level = "Low Concern"
            color = "#10b981" # Green
            if not reasons:
                reasons.append("Study momentum, assessment scores, and online engagement are consistently on track.")
            recommendation = "Maintain regular study pace and explore intermediate-to-advanced challenge problems."
            
        return {
            "level": level,
            "color": color,
            "concern_score": concern_points,
            "reasons": reasons,
            "remediation_recommendation": recommendation,
            "last_assessment_trend": score_trend,
            "engagement_trend": eng_trend,
            "disclaimer": "Educational analytics are statistical recommendations for proactive support, not definitive judgments."
        }
