"""
Recommendations API Router for EduRAG AI
Provides transparent, explainable recommendations aligned with student signals.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends
from backend.api.auth import get_current_user
from backend.schemas.pydantic_models import RecommendationItem, UserOut
from backend.data_pipeline.load_data import OULADLoader
from backend.data_pipeline.clean_data import OULADCleaner
from backend.data_pipeline.student_profile import StudentProfileBuilder
from backend.ml.proficiency_engine import ProficiencyEngine
from backend.ml.recommendation_engine import RecommendationEngine

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

loader = OULADLoader()
cleaner = OULADCleaner()
profile_builder = StudentProfileBuilder()
proficiency_engine = ProficiencyEngine()
rec_engine = RecommendationEngine()

@router.get("", response_model=List[RecommendationItem])
def get_recommendations(current_user: UserOut = Depends(get_current_user)):
    student_id = current_user.student_id or 10001
    raw_data = cleaner.clean_all(loader.load_all())
    profile = profile_builder.build_profile(student_id, raw_data, student_name_override=current_user.name)
    prof = proficiency_engine.calculate_proficiency(profile["academic_profile"], profile["engagement_profile"], "FFF")
    
    recs = rec_engine.generate_recommendations(
        student_id=student_id,
        proficiency=prof,
        academic_profile=profile["academic_profile"],
        engagement_profile=profile["engagement_profile"],
        weaknesses=profile["weaknesses"],
        strengths=profile["strengths"]
    )
    
    return [RecommendationItem(**r) for r in recs]
