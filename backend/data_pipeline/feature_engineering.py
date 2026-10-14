"""
OULAD Feature Engineering Engine
Extracts academic, engagement, behavioral, and module-level features
for every student in the dataset.
"""

import math
from typing import Dict, List, Any, Optional
from collections import defaultdict

class FeatureEngineer:
    def __init__(self):
        pass

    def extract_student_academic_features(
        self,
        student_id: int,
        student_assessments: List[Dict[str, Any]],
        assessments_catalog: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculates academic performance, completion, consistency, and weighting."""
        catalog_map = {a["id_assessment"]: a for a in assessments_catalog}
        submissions = [s for s in student_assessments if s["id_student"] == student_id]
        
        if not submissions:
            return {
                "average_score": 0.0,
                "weighted_score": 0.0,
                "total_taken": 0,
                "completion_rate": 0.0,
                "score_std": 0.0,
                "min_score": 0.0,
                "max_score": 0.0,
                "score_trend": "no_data"
            }
            
        scores = [s["score"] for s in submissions]
        avg_score = sum(scores) / len(scores)
        
        # Calculate standard deviation (consistency)
        variance = sum((x - avg_score) ** 2 for x in scores) / len(scores) if len(scores) > 1 else 0.0
        score_std = math.sqrt(variance)
        
        # Weighted score computation based on assessment weights
        total_weight = 0.0
        weighted_sum = 0.0
        for s in submissions:
            cat = catalog_map.get(s["id_assessment"], {})
            w = cat.get("weight", 10.0)
            if w > 0:
                weighted_sum += s["score"] * w
                total_weight += w
                
        weighted_score = (weighted_sum / total_weight) if total_weight > 0 else avg_score
        
        # Score trend: compare last 2 against previous
        if len(scores) >= 3:
            recent_avg = sum(scores[-2:]) / 2
            prior_avg = sum(scores[:-2]) / len(scores[:-2])
            if recent_avg > prior_avg + 3:
                trend = "improving"
            elif recent_avg < prior_avg - 3:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "stable"
            
        return {
            "average_score": round(avg_score, 2),
            "weighted_score": round(weighted_score, 2),
            "total_taken": len(submissions),
            "completion_rate": round(min(1.0, len(submissions) / 5.0), 2), # Assuming 5 typical assessments/module
            "score_std": round(score_std, 2),
            "min_score": round(min(scores), 2),
            "max_score": round(max(scores), 2),
            "score_trend": trend
        }

    def extract_student_engagement_features(
        self,
        student_id: int,
        student_vle: List[Dict[str, Any]],
        vle_catalog: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculates total clicks, active days, click density, early/late engagement."""
        vle_map = {v["id_site"]: v for v in vle_catalog}
        logs = [log for log in student_vle if log["id_student"] == student_id]
        
        if not logs:
            return {
                "total_clicks": 0,
                "active_days": 0,
                "clicks_per_active_day": 0.0,
                "early_engagement_clicks": 0,
                "late_engagement_clicks": 0,
                "resource_type_breakdown": {},
                "engagement_trend": "inactive",
                "learning_streak_days": 0
            }
            
        total_clicks = sum(log["sum_click"] for log in logs)
        dates = sorted(list(set(log["date"] for log in logs)))
        active_days = len(dates)
        clicks_per_active_day = (total_clicks / active_days) if active_days > 0 else 0.0
        
        # Early engagement (before day 30) vs Late (after day 100)
        early_clicks = sum(log["sum_click"] for log in logs if log["date"] <= 30)
        late_clicks = sum(log["sum_click"] for log in logs if log["date"] > 100)
        
        # Resource diversity breakdown
        resource_breakdown = defaultdict(int)
        for log in logs:
            res_meta = vle_map.get(log["id_site"], {})
            act_type = res_meta.get("activity_type", "oucontent")
            resource_breakdown[act_type] += log["sum_click"]
            
        # Engagement trend (last 30 days vs prior)
        if len(dates) > 3:
            midpoint = len(dates) // 2
            first_half = sum(l["sum_click"] for l in logs if l["date"] in dates[:midpoint])
            second_half = sum(l["sum_click"] for l in logs if l["date"] in dates[midpoint:])
            if second_half > first_half * 1.15:
                trend = "increasing"
            elif second_half < first_half * 0.85:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "stable"
            
        # Approximate learning streak
        streak = min(7, active_days)
        
        return {
            "total_clicks": total_clicks,
            "active_days": active_days,
            "clicks_per_active_day": round(clicks_per_active_day, 2),
            "early_engagement_clicks": early_clicks,
            "late_engagement_clicks": late_clicks,
            "resource_type_breakdown": dict(resource_breakdown),
            "engagement_trend": trend,
            "learning_streak_days": streak
        }

    def extract_module_level_features(
        self,
        student_id: int,
        student_info: List[Dict[str, Any]],
        student_assessments: List[Dict[str, Any]],
        assessments_catalog: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Extracts performance per enrolled module."""
        enrolled = [info for info in student_info if info["id_student"] == student_id]
        catalog_map = {a["id_assessment"]: a for a in assessments_catalog}
        
        module_profiles = []
        for reg in enrolled:
            mod_code = reg["code_module"]
            pres = reg["code_presentation"]
            
            # Submissions for this module
            mod_submissions = [
                s for s in student_assessments
                if s["id_student"] == student_id and catalog_map.get(s["id_assessment"], {}).get("code_module") == mod_code
            ]
            
            scores = [s["score"] for s in mod_submissions]
            avg_score = (sum(scores) / len(scores)) if scores else 0.0
            
            # Module name friendly map
            mod_names = {
                "AAA": "Discovering Arts and Humanities",
                "BBB": "Introduction to Social Sciences",
                "CCC": "Mathematical Methods & Computing",
                "DDD": "Engineering & Technology Core",
                "EEE": "Basic Sciences & Experimentation",
                "FFF": "Computer Science & Software Systems",
                "GGG": "Psychology & Cognitive Science"
            }
            
            module_profiles.append({
                "code_module": mod_code,
                "code_presentation": pres,
                "module_name": mod_names.get(mod_code, f"Course Module {mod_code}"),
                "enrolled_credits": reg["studied_credits"],
                "final_result": reg["final_result"],
                "assessments_count": len(mod_submissions),
                "average_score": round(avg_score, 1),
                "completion_status": "Active" if reg["final_result"] != "Withdrawn" else "Withdrawn"
            })
            
        return module_profiles
