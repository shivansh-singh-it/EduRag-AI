"""
OULAD Data Cleaning & Preprocessing
Cleans raw OULAD records:
- Handles missing values & imputation
- Validates score ranges [0, 100]
- Type coercion (ints, floats, dates)
- Removes corrupted entries
- Categorical encodings
"""

import math
from typing import Dict, List, Any, Optional

class OULADCleaner:
    def __init__(self):
        pass

    def clean_student_assessments(self, raw_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Cleans student assessment submissions."""
        cleaned = []
        for r in raw_records:
            try:
                # Score parsing and bounds enforcement
                raw_score = r.get("score")
                if raw_score is None or raw_score == "":
                    continue # Ignore unsubmitted or unscored
                score = float(raw_score)
                if score < 0.0 or score > 100.0:
                    continue # Drop invalid scores
                    
                cleaned.append({
                    "id_assessment": int(r["id_assessment"]),
                    "id_student": int(r["id_student"]),
                    "date_submitted": int(r["date_submitted"]) if r.get("date_submitted") is not None else 0,
                    "is_banked": int(r.get("is_banked", 0)),
                    "score": round(score, 2)
                })
            except (ValueError, TypeError):
                continue
        return cleaned

    def clean_student_info(self, raw_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Cleans student demographic and registration records."""
        cleaned = []
        for r in raw_records:
            try:
                student_id = int(r["id_student"])
                cleaned.append({
                    "code_module": str(r.get("code_module", "")).strip(),
                    "code_presentation": str(r.get("code_presentation", "")).strip(),
                    "id_student": student_id,
                    "gender": str(r.get("gender", "Unknown")).strip(),
                    "region": str(r.get("region", "Unknown")).strip(),
                    "highest_education": str(r.get("highest_education", "A Level or Equivalent")).strip(),
                    "imd_band": str(r.get("imd_band", "Missing")).strip() if r.get("imd_band") else "Unknown",
                    "age_band": str(r.get("age_band", "0-35")).strip(),
                    "num_of_prev_attempts": int(r.get("num_of_prev_attempts", 0) or 0),
                    "studied_credits": int(r.get("studied_credits", 60) or 60),
                    "disability": str(r.get("disability", "N")).strip(),
                    "final_result": str(r.get("final_result", "Pass")).strip()
                })
            except (ValueError, TypeError):
                continue
        return cleaned

    def clean_student_vle(self, raw_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Cleans student VLE click activity logs."""
        cleaned = []
        for r in raw_records:
            try:
                clicks = int(r.get("sum_click", 1) or 1)
                if clicks <= 0:
                    continue
                cleaned.append({
                    "code_module": str(r.get("code_module", "")).strip(),
                    "code_presentation": str(r.get("code_presentation", "")).strip(),
                    "id_student": int(r["id_student"]),
                    "id_site": int(r["id_site"]),
                    "date": int(r.get("date", 0) or 0),
                    "sum_click": clicks
                })
            except (ValueError, TypeError):
                continue
        return cleaned

    def clean_assessments(self, raw_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Cleans assessment catalog data."""
        cleaned = []
        for r in raw_records:
            try:
                cleaned.append({
                    "code_module": str(r.get("code_module", "")).strip(),
                    "code_presentation": str(r.get("code_presentation", "")).strip(),
                    "id_assessment": int(r["id_assessment"]),
                    "assessment_type": str(r.get("assessment_type", "TMA")).strip(),
                    "date": int(r.get("date", 0) or 0),
                    "weight": float(r.get("weight", 10.0) or 10.0)
                })
            except (ValueError, TypeError):
                continue
        return cleaned

    def clean_vle_resources(self, raw_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Cleans VLE resources."""
        cleaned = []
        for r in raw_records:
            try:
                cleaned.append({
                    "id_site": int(r["id_site"]),
                    "code_module": str(r.get("code_module", "")).strip(),
                    "code_presentation": str(r.get("code_presentation", "")).strip(),
                    "activity_type": str(r.get("activity_type", "oucontent")).strip(),
                    "week_from": int(r["week_from"]) if r.get("week_from") is not None else None,
                    "week_to": int(r["week_to"]) if r.get("week_to") is not None else None,
                })
            except (ValueError, TypeError):
                continue
        return cleaned

    def clean_all(self, raw_data: Dict[str, List[Dict[str, Any]]]) -> Dict[str, List[Dict[str, Any]]]:
        """Cleans all loaded raw tables."""
        return {
            "courses": raw_data.get("courses", []),
            "assessments": self.clean_assessments(raw_data.get("assessments", [])),
            "student_info": self.clean_student_info(raw_data.get("student_info", [])),
            "student_registration": raw_data.get("student_registration", []),
            "student_assessment": self.clean_student_assessments(raw_data.get("student_assessment", [])),
            "vle": self.clean_vle_resources(raw_data.get("vle", [])),
            "student_vle": self.clean_student_vle(raw_data.get("student_vle", []))
        }
