"""
Pydantic Schemas for Request & Response Payloads in EduRAG AI
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str
    role: str
    student_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    student_id: Optional[int] = None

# Onboarding Schemas
class StudentOnboarding(BaseModel):
    name: str
    email: Optional[str] = None
    gender: Optional[str] = "Prefer not to say"
    region: Optional[str] = "South East Region"
    highest_education: Optional[str] = "A Level or Equivalent"
    age_band: Optional[str] = "0-35"
    studied_credits: Optional[int] = 60
    disability: Optional[str] = "N"
    modules: List[str] = Field(default_factory=lambda: ["FFF"])
    preferred_explanation_style: Optional[str] = "step_by_step"
    preferred_learning_pace: Optional[str] = "moderate"
    preferred_media_type: Optional[str] = "mixed"
    difficulty_preference: Optional[str] = "balanced"

# Profile & Proficiency Schemas
class AcademicProfile(BaseModel):
    average_assessment_score: float
    total_assessments_taken: int
    assessment_completion_rate: float
    score_consistency_std: float
    banked_credits: int
    passed_modules_count: int

class EngagementProfile(BaseModel):
    total_vle_clicks: int
    active_learning_days: int
    average_clicks_per_active_day: float
    early_engagement_score: float
    recent_activity_trend: str # 'increasing', 'stable', 'declining'
    learning_streak_days: int

class ProficiencyResult(BaseModel):
    overall_score: float
    tier: str # BEGINNER, DEVELOPING, INTERMEDIATE, ADVANCED, MASTERY
    tier_label: str
    confidence_score: float
    target_depth: str
    color: str
    reasoning: str
    breakdown: Dict[str, float]

class RiskIndicator(BaseModel):
    level: str # 'Low Concern', 'Moderate Concern', 'Needs Attention'
    color: str
    reasons: List[str]
    remediation_recommendation: str
    last_assessment_trend: str

class StudentProfileResponse(BaseModel):
    student_id: int
    name: str
    demographics: Dict[str, Any]
    academic_profile: Dict[str, Any]
    engagement_profile: Dict[str, Any]
    proficiency: Dict[str, Any]
    risk_indicator: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    enrolled_modules: List[Dict[str, Any]]
    # Compatibility fields for frontend
    education_level: Optional[str] = None
    credits_studied: Optional[int] = None
    proficiency_level: Optional[str] = None
    confidence_score: Optional[float] = None
    learning_risk: Optional[str] = None
    signals: Optional[Dict[str, Any]] = None
    radar_data: Optional[List[Dict[str, Any]]] = None


# Dashboard Schemas
class DashboardMetricCard(BaseModel):
    title: str
    value: str
    change: Optional[str] = None
    status: Optional[str] = "neutral"
    icon: str

class LearningInsight(BaseModel):
    type: str # 'positive', 'warning', 'action'
    title: str
    message: str
    action_text: Optional[str] = None
    action_link: Optional[str] = None

class DashboardOverview(BaseModel):
    student_name: str
    student_id: int
    proficiency_tier: str
    confidence_score: float
    cards: List[DashboardMetricCard]
    performance_trend: List[Dict[str, Any]]
    module_performance: List[Dict[str, Any]]
    engagement_trend: List[Dict[str, Any]]
    knowledge_gaps: List[Dict[str, Any]]
    insights: List[LearningInsight]
    recommended_topics: List[Dict[str, Any]]
    # Compatibility fields for frontend
    profile: Optional[Dict[str, Any]] = None
    trend_data: Optional[List[Dict[str, Any]]] = None
    modules: Optional[List[Dict[str, Any]]] = None

# Assessment Schemas
class AssessmentItem(BaseModel):
    id: str
    module: str
    name: str
    type: str
    weight: float
    date_submitted: str
    score: Optional[float] = None
    status: str
    feedback: str
    topics: List[str]

class StudentAssessmentsResponse(BaseModel):
    student_id: int
    student_name: str
    total: Optional[int] = None
    summary: Dict[str, Any]
    modules: List[str]
    assessments: List[AssessmentItem]

# Chat & Tutor Schemas
class ChatMessageIn(BaseModel):
    session_id: Optional[str] = None
    message: str
    module: Optional[str] = "FFF"
    topic: Optional[str] = "General"
    proficiency_override: Optional[str] = None # For testing adaptive responses
    stream: Optional[bool] = False

class SourceCitation(BaseModel):
    id: str
    title: str
    topic: str
    difficulty: str
    source: str
    page: Optional[int] = None
    relevance_score: Optional[float] = 0.0

class ChatMessageOut(BaseModel):
    id: str
    session_id: str
    sender: str
    content: str
    proficiency_level: str
    explanation_tier: str
    prompt_context: Optional[Dict[str, Any]] = None
    retrieved_sources: List[SourceCitation] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)
    mode: str = "Demo Mode" # 'Ollama', 'Gemini', 'OpenAI', 'Demo Mode'

class ChatFeedbackIn(BaseModel):
    message_id: str
    rating: str # 'thumbs_up', 'thumbs_down', 'bookmarked'
    comment: Optional[str] = None

# Quiz Schemas
class QuizGenerateRequest(BaseModel):
    topic: str
    module: Optional[str] = "FFF"
    difficulty: Optional[str] = None # Auto-selected from proficiency if omitted
    num_questions: Optional[int] = 4

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    difficulty: str
    hint: Optional[str] = None

class QuizSubmission(BaseModel):
    topic: str
    difficulty: str
    answers: Dict[Any, int] # question_id (int or str) -> chosen option index (0..3)

class QuizResultOut(BaseModel):
    attempt_id: str
    topic: str
    difficulty: str
    score: float
    total: Optional[int] = None
    total_questions: int
    correct_count: int
    accuracy: float
    next_difficulty: Optional[str] = None
    next_difficulty_recommendation: str
    review: List[Dict[str, Any]] # Question, your answer, correct answer, explanation
    feedback: str
    recommendation: Optional[str] = None

# Recommendations & Gaps
class RecommendationItem(BaseModel):
    id: int
    title: str
    type: str # topic, resource, practice, revision, quiz
    priority: Any = 1 # int or string label e.g. "High Priority"
    estimated_minutes: int
    duration: Optional[str] = None
    difficulty: str
    reason: str
    rationale: Optional[str] = None
    evidence: Optional[str] = None
    module: Optional[str] = "FFF"
    action_url: Optional[str] = None
    actionLabel: Optional[str] = "Launch Session with AI Tutor"
    actionHref: Optional[str] = "/tutor"

class KnowledgeGapItem(BaseModel):
    id: Any
    topic: Optional[str] = None
    topic_name: str
    module: str
    mastery: Optional[float] = None
    current_mastery: float
    status: str # Strong, Weak, Needs Revision, Mastered
    evidence: Any # list of strings or single string
    why_identified: Optional[str] = None
    recommendation: Optional[str] = None
    recommended_action: str
    confidence: Optional[str] = "High Diagnostic Confidence"
    primaryAction: Optional[Dict[str, str]] = None

# Admin & Research Evaluation
class RAGEvaluationMetrics(BaseModel):
    bert_score_f1: float
    rouge_l: float
    meteor: float
    bleu: float
    mean_rating_score: float
    bayesian_average: float
    high_quality_rate: float
    perfect_alignment_rate: float
    label: str = "Illustrative / Demo Data"
