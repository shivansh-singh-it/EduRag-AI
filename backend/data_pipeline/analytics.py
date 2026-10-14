"""
OULAD Dataset-Wide Analytics and Research Metrics
Aggregates macro-level distributions, module pass rates, engagement metrics,
and demographic views with strict ethical guardrails (descriptive only).
"""

from typing import Dict, List, Any
from collections import defaultdict

class OULADAnalytics:
    def __init__(self, data: Dict[str, List[Dict[str, Any]]]):
        self.data = data

    def get_dataset_overview(self) -> Dict[str, Any]:
        """
        Provides macro metrics of the loaded dataset.
        
        Calculations:
        - Total Students: Unique student identifiers from studentInfo.csv
        - Total Modules: Unique course module codes from courses.csv
        - Total Assessments: Number of assessment records from assessments.csv
        - Total VLE Interactions: Number of interaction log records from studentVle.csv
        - Average Score: Mean score across valid non-null studentAssessment submissions
        
        Completion Rate Formula:
        Completion Rate (%) = (Enrollments with final_result in ['Pass', 'Distinction']) / (Total enrollments) * 100
        Students who withdraw or fail are categorized as non-completed.
        """
        students = self.data.get("student_info", [])
        unique_students = len(set(s["id_student"] for s in students if s.get("id_student") is not None))
        courses = self.data.get("courses", [])
        unique_modules = len(set(c["code_module"] for c in courses if c.get("code_module")))
        assessments = self.data.get("assessments", [])
        submissions = self.data.get("student_assessment", [])
        vle_logs = self.data.get("student_vle", [])
        total_clicks = sum(log.get("sum_click", 0) for log in vle_logs if log.get("sum_click") is not None)
        
        # Calculate Average Score from valid studentAssessment records
        valid_scores = [
            float(s["score"]) for s in submissions
            if s.get("score") is not None and s.get("score") != "" and s.get("score") != "?"
        ]
        avg_score = round(sum(valid_scores) / len(valid_scores), 2) if valid_scores else 0.0

        # Calculate Completion Rate
        completed = [
            s for s in students
            if str(s.get("final_result", "")).strip().title() in ["Pass", "Distinction"]
        ]
        completion_rate = round((len(completed) / len(students)) * 100, 2) if students else 0.0
        
        modules_count = unique_modules if unique_modules > 0 else len(courses)
        
        return {
            "total_students": unique_students,
            "total_enrollments": len(students),
            "total_modules": modules_count,
            "total_courses": len(courses),
            "total_assessments": len(assessments),
            "total_assessments_configured": len(assessments),
            "total_assessment_submissions": len(submissions),
            "total_interactions": len(vle_logs),
            "total_vle_interactions": len(vle_logs),
            "total_vle_clicks": total_clicks,
            "avg_score": avg_score,
            "completion_rate": completion_rate,
            "courses_catalog": courses
        }

    def get_admin_stats(self) -> Dict[str, Any]:
        """
        Standard contract for GET /api/admin/stats.
        Returns normalized top-level KPI metrics calculated from OULAD data.
        """
        overview = self.get_dataset_overview()
        return {
            "total_students": overview["total_students"],
            "total_modules": overview["total_modules"],
            "total_assessments": overview["total_assessments"],
            "total_interactions": overview["total_interactions"],
            "total_vle_interactions": overview["total_vle_interactions"],
            "total_courses": overview["total_courses"],
            "avg_score": overview["avg_score"],
            "completion_rate": overview["completion_rate"],
            "data_source": "Live OULAD Analytics" if overview["total_students"] > 0 else "Demo Data",
            "dataset_connected": bool(overview["total_students"] > 0 and overview["total_assessments"] > 0)
        }

    def get_engagement_metrics(self) -> Dict[str, Any]:
        """Calculates VLE interactions and click distribution."""
        vle_logs = self.data.get("student_vle", [])
        total_interactions = len(vle_logs)
        total_clicks = sum(log.get("sum_click", 0) for log in vle_logs if log.get("sum_click") is not None)
        students = self.data.get("student_info", [])
        unique_students = len(set(s["id_student"] for s in students if s.get("id_student") is not None))
        avg_clicks = round(total_clicks / unique_students, 1) if unique_students > 0 else 0.0
        return {
            "total_interactions": total_interactions,
            "total_clicks": total_clicks,
            "avg_clicks_per_student": avg_clicks,
            "active_vle_records": total_interactions
        }

    def get_performance_distribution(self) -> List[Dict[str, Any]]:
        """Score buckets (0-39, 40-59, 60-74, 75-89, 90-100)."""
        submissions = self.data.get("student_assessment", [])
        buckets = {
            "0-39 (Fail / Beginner)": 0,
            "40-59 (Pass / Developing)": 0,
            "60-74 (Merit / Intermediate)": 0,
            "75-89 (High Merit / Advanced)": 0,
            "90-100 (Distinction / Mastery)": 0
        }
        for s in submissions:
            score = s.get("score", 0)
            if score < 40:
                buckets["0-39 (Fail / Beginner)"] += 1
            elif score < 60:
                buckets["40-59 (Pass / Developing)"] += 1
            elif score < 75:
                buckets["60-74 (Merit / Intermediate)"] += 1
            elif score < 90:
                buckets["75-89 (High Merit / Advanced)"] += 1
            else:
                buckets["90-100 (Distinction / Mastery)"] += 1
                
        return [{"range": k, "count": v} for k, v in buckets.items()]

    def get_module_analytics(self) -> List[Dict[str, Any]]:
        """Calculates pass/distinction/fail/withdrawn counts and average clicks per module."""
        students = self.data.get("student_info", [])
        vle_logs = self.data.get("student_vle", [])
        mod_clicks = defaultdict(int)
        for log in vle_logs:
            m = log.get("code_module", "Unknown")
            mod_clicks[m] += int(log.get("sum_click", 0) or 0)

        mod_map = defaultdict(lambda: {"Pass": 0, "Distinction": 0, "Fail": 0, "Withdrawn": 0, "Total": 0})
        for s in students:
            mod = s.get("code_module", "Unknown")
            res = s.get("final_result", "Pass")
            mod_map[mod][res] = mod_map[mod].get(res, 0) + 1
            mod_map[mod]["Total"] += 1
            
        results = []
        for mod, stats in mod_map.items():
            tot = stats["Total"]
            pass_rate = round(((stats["Pass"] + stats["Distinction"]) / tot) * 100, 1) if tot > 0 else 0.0
            clicks = mod_clicks.get(mod, 0)
            avg_clicks = round(clicks / tot, 0) if tot > 0 else 0
            results.append({
                "code_module": mod,
                "code": mod,
                "total_students": tot,
                "pass_count": stats["Pass"],
                "distinction_count": stats["Distinction"],
                "fail_count": stats["Fail"],
                "withdrawn_count": stats["Withdrawn"],
                "pass_rate": pass_rate,
                "pass_rate_percentage": pass_rate,
                "avg_clicks": int(avg_clicks)
            })
            
        return sorted(results, key=lambda x: x["code_module"])

    def get_demographic_distributions(self) -> Dict[str, List[Dict[str, Any]]]:
        """Returns descriptive distributions across gender, education, age, region, and disability."""
        students = self.data.get("student_info", [])
        
        def count_attr(attr_name: str) -> List[Dict[str, Any]]:
            counts = defaultdict(int)
            for s in students:
                v = s.get(attr_name, "Unknown")
                counts[str(v)] += 1
            return [{"category": k, "count": v} for k, v in counts.items()]
            
        return {
            "gender": count_attr("gender"),
            "highest_education": count_attr("highest_education"),
            "age_band": count_attr("age_band"),
            "region": count_attr("region"),
            "disability": count_attr("disability"),
            "final_result": count_attr("final_result"),
            "ethics_disclaimer": "Demographic variables are descriptive context only. Demographic attributes are NEVER used to infer individual academic potential."
        }
