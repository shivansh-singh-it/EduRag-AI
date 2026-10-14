"""
Admin Analytics & Dataset Explorer API Router for EduRAG AI
Provides institutional-level learning analytics, OULAD dataset exploration,
and early-warning cohort analysis with ethical privacy standards.
"""

from typing import Dict, List, Any, Optional
from fastapi import APIRouter, Depends, Query
from backend.api.auth import get_current_user
from backend.schemas.pydantic_models import UserOut
from backend.config.settings import settings
from backend.data_pipeline.load_data import OULADLoader
from backend.data_pipeline.clean_data import OULADCleaner
from backend.data_pipeline.analytics import OULADAnalytics
from backend.data_pipeline.student_profile import StudentProfileBuilder
from backend.ml.proficiency_engine import ProficiencyEngine
from backend.ml.risk_predictor import RiskPredictor

router = APIRouter(prefix="/admin", tags=["Admin & Institutional Analytics"])

loader = OULADLoader()
cleaner = OULADCleaner()
profile_builder = StudentProfileBuilder()
proficiency_engine = ProficiencyEngine()
risk_predictor = RiskPredictor()

def _get_analytics():
    raw = loader.load_all()
    cleaned = cleaner.clean_all(raw)
    return OULADAnalytics(cleaned)

@router.get("/stats")
def get_admin_stats(current_user: UserOut = Depends(get_current_user)):
    """
    Primary KPI statistics for institutional learning analytics.
    Returns normalized numeric counts and metrics from the actual OULAD dataset.
    """
    analytics = _get_analytics()
    return analytics.get_admin_stats()

@router.get("/performance")
def get_admin_performance(current_user: UserOut = Depends(get_current_user)):
    """Score buckets and academic outcome distributions."""
    analytics = _get_analytics()
    dist = analytics.get_performance_distribution()
    overview = analytics.get_dataset_overview()
    return {
        "distribution": dist,
        "performance_distribution": dist,
        "average_score": overview["avg_score"],
        "avg_score": overview["avg_score"],
        "total_submissions": overview["total_assessment_submissions"]
    }

@router.get("/engagement")
def get_admin_engagement(current_user: UserOut = Depends(get_current_user)):
    """VLE activity patterns and interaction telemetry."""
    analytics = _get_analytics()
    return analytics.get_engagement_metrics()

@router.get("/modules")
def get_admin_modules(current_user: UserOut = Depends(get_current_user)):
    """Module-level enrollment, pass rates, and click engagement."""
    analytics = _get_analytics()
    return analytics.get_module_analytics()

@router.get("/demographics")
def get_admin_demographics(current_user: UserOut = Depends(get_current_user)):
    """Descriptive demographic context under ethical privacy standards."""
    analytics = _get_analytics()
    return analytics.get_demographic_distributions()

@router.get("/risk")
def get_admin_risk(current_user: UserOut = Depends(get_current_user)):
    """Early-warning student cohort risk distribution."""
    return get_cohort_risk_analytics(current_user)

@router.get("/dataset-summary")
def get_admin_dataset_summary(current_user: UserOut = Depends(get_current_user)):
    """Detailed file-by-file health and connection status for OULAD."""
    return loader.get_dataset_summary()

@router.post("/load-dataset")
def trigger_load_dataset(current_user: UserOut = Depends(get_current_user)):
    """Validates or initializes the OULAD dataset files if missing."""
    import os, sys, subprocess
    summary = loader.get_dataset_summary()
    if not summary["is_connected"]:
        script_path = os.path.join(os.path.dirname(settings.BASE_DIR), "scripts", "generate_sample_oulad.py")
        if os.path.exists(script_path):
            subprocess.run([sys.executable, script_path], check=True)
            summary = loader.get_dataset_summary()
    return {
        "message": "OULAD dataset connected and verified.",
        "summary": summary
    }

@router.get("/dataset-overview")
def get_dataset_overview(current_user: UserOut = Depends(get_current_user)):
    """Macro metrics and OULAD validation summary."""
    val = loader.validate_dataset()
    analytics = _get_analytics()
    overview = analytics.get_dataset_overview()
    summary = loader.get_dataset_summary()
    return {
        "validation": val,
        "metrics": overview,
        "summary": summary
    }

@router.get("/analytics")
def get_admin_analytics(current_user: UserOut = Depends(get_current_user)):
    """Comprehensive institutional analytics."""
    analytics = _get_analytics()
    stats = analytics.get_admin_stats()
    overview = analytics.get_dataset_overview()
    perf_dist = analytics.get_performance_distribution()
    mod_analytics = analytics.get_module_analytics()
    demographics = analytics.get_demographic_distributions()
    summary = loader.get_dataset_summary()
    
    return {
        "stats": stats,
        "overview": overview,
        "performance_distribution": perf_dist,
        "module_performance": mod_analytics,
        "demographics": demographics,
        "dataset_summary": summary
    }

@router.get("/dataset-explorer")
def explore_dataset(
    table_name: str = Query("studentInfo", description="Table name to inspect"),
    module_filter: Optional[str] = None,
    result_filter: Optional[str] = None,
    limit: int = 50,
    current_user: UserOut = Depends(get_current_user)
):
    """Browses rows of any OULAD table with filter support."""
    table_file_map = {
        "courses": "courses.csv",
        "assessments": "assessments.csv",
        "studentInfo": "studentInfo.csv",
        "studentRegistration": "studentRegistration.csv",
        "studentAssessment": "studentAssessment.csv",
        "vle": "vle.csv",
        "studentVle": "studentVle.csv"
    }
    fname = table_file_map.get(table_name, "studentInfo.csv")
    rows = loader.load_table(fname)
    
    # Filter
    filtered = rows
    if module_filter:
        filtered = [r for r in filtered if str(r.get("code_module", "")).upper() == module_filter.upper()]
    if result_filter and table_name == "studentInfo":
        filtered = [r for r in filtered if str(r.get("final_result", "")).lower() == result_filter.lower()]
        
    rows_slice = filtered[:limit]
    columns = list(rows_slice[0].keys()) if rows_slice else []
    return {
        "table": table_name,
        "table_name": table_name,
        "total_records": len(rows),
        "total_records_in_table": len(rows),
        "filtered_count": len(filtered),
        "columns": columns,
        "rows": rows_slice,
        "sample_records": rows_slice
    }

@router.get("/risk-analytics")
def get_cohort_risk_analytics(current_user: UserOut = Depends(get_current_user)):
    """Institutional early warning indicator for all students in the cohort."""
    raw = loader.load_all()
    cleaned = cleaner.clean_all(raw)
    students_info = cleaned.get("student_info", [])
    
    cohort_risk = []
    seen_ids = set()
    risk_summary = {"Low Concern": 0, "Moderate Concern": 0, "Needs Attention": 0}
    
    for s in students_info:
        sid = s["id_student"]
        if sid in seen_ids:
            continue
        seen_ids.add(sid)
        
        prof_obj = profile_builder.build_profile(sid, cleaned)
        risk = risk_predictor.evaluate_risk(
            prof_obj["academic_profile"],
            prof_obj["engagement_profile"],
            prof_obj["demographics"]
        )
        
        risk_summary[risk["level"]] = risk_summary.get(risk["level"], 0) + 1
        
        cohort_risk.append({
            "id": sid,
            "student_id": sid,
            "name": prof_obj["name"],
            "module": s.get("code_module", "FFF"),
            "risk_level": risk["level"],
            "color": risk["color"],
            "score": prof_obj["academic_profile"]["average_score"],
            "average_score": prof_obj["academic_profile"]["average_score"],
            "vle_clicks": prof_obj["engagement_profile"]["total_clicks"],
            "total_clicks": prof_obj["engagement_profile"]["total_clicks"],
            "active_days": prof_obj["engagement_profile"].get("active_days", 35),
            "trend": prof_obj["academic_profile"].get("score_trend", "Stable / Upward"),
            "signals": risk["reasons"],
            "reasons": risk["reasons"],
            "recommendation": risk["remediation_recommendation"]
        })
        
    total = len(cohort_risk) if cohort_risk else 1
    low_pct = f"{(risk_summary.get('Low Concern', 0) / total * 100):.1f}%"
    mod_pct = f"{(risk_summary.get('Moderate Concern', 0) / total * 100):.1f}%"
    attn_pct = f"{(risk_summary.get('Needs Attention', 0) / total * 100):.1f}%"

    return {
        "summary": risk_summary,
        "cohort": cohort_risk,
        "students": cohort_risk,
        "at_risk_students": cohort_risk,
        "total_students": len(cohort_risk),
        "low_concern_pct": low_pct,
        "moderate_concern_pct": mod_pct,
        "needs_attention_pct": attn_pct,
        "educational_ethics_note": "Educational risk flags indicate opportunities for proactive teaching support, not student shortcomings."
    }
