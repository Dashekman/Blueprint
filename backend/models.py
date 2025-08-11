from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
import uuid

class TestAnswer(BaseModel):
    question_id: int
    value: Any

class TestSubmission(BaseModel):
    test_id: str
    answers: Dict[str, Any]
    user_session: Optional[str] = None

class TestResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    test_id: str
    user_session: str
    answers: Dict[str, Any]
    raw_score: Dict[str, Any]
    result_type: str
    confidence: float
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    ai_analysis: Optional[str] = None

class UnifiedProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_session: str
    source_tests: List[str]
    strengths: List[str]
    challenges: List[str]
    communication_style: str
    career_guidance: str
    study_tactics: str
    motivation_levers: str
    relationship_tips: str
    daily_micro_coaching: str
    confidence: float
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    ai_model_used: str
    reasoning_summary: str

class MicroRoutine(BaseModel):
    name: str
    duration: str
    description: str
    steps: List[str]

class Meditation(BaseModel):
    title: str
    duration: str
    script: str

class DailyContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_session: str
    date: str
    horoscope: str
    mantra: str
    micro_routine: MicroRoutine
    meditation: Meditation
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    profile_based: bool = True

class ProfileSynthesisRequest(BaseModel):
    user_session: str
    user_goals: Optional[str] = None
    regenerate: bool = False

class DailyContentRequest(BaseModel):
    user_session: str
    date: Optional[str] = None
    focus_area: Optional[str] = None

class CustomMeditationRequest(BaseModel):
    user_session: str
    focus_area: str
    duration_minutes: int = 7
    difficulty_level: str = "beginner"  # beginner, intermediate, advanced

class UserStats(BaseModel):
    tests_completed: int
    profile_confidence: float
    days_active: int
    meditations_completed: int
    last_activity: datetime

class ExportData(BaseModel):
    user_session: str
    test_results: List[TestResult]
    unified_profile: Optional[UnifiedProfile]
    daily_content_history: List[DailyContent]
    export_date: datetime = Field(default_factory=datetime.utcnow)

# Response Models
class TestResultResponse(BaseModel):
    success: bool
    result: TestResult
    insights: str
    next_recommendations: List[str]

class ProfileResponse(BaseModel):
    success: bool
    profile: Optional[UnifiedProfile]
    completion_percentage: float
    missing_tests: List[str]
    message: str

class DailyContentResponse(BaseModel):
    success: bool
    content: DailyContent
    personalization_level: str  # high, medium, low
    
class AIGenerationStatus(BaseModel):
    status: str  # generating, completed, failed
    progress: float
    estimated_time_remaining: Optional[int]  # seconds
    error_message: Optional[str]