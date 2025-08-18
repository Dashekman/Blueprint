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
    user_id: Optional[str] = None  # Added for authenticated users
    answers: Dict[str, Any]
    raw_score: Dict[str, Any]
    result_type: str
    confidence: float
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    ai_analysis: Optional[str] = None
    puzzle_piece: Optional[str] = None  # Which puzzle piece this unlocks

class UnifiedProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_session: str
    user_id: Optional[str] = None  # Added for authenticated users
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
    superhuman_qualities: List[str] = Field(default_factory=list)  # Unlocked qualities
    puzzle_completion: float = 0.0  # Progress toward superhuman (0-1)

class MicroRoutine(BaseModel):
    name: str
    duration: str
    description: str
    steps: List[str]

class Meditation(BaseModel):
    title: str
    duration: str
    script: str
    focus_area: Optional[str] = None
    voice_url: Optional[str] = None  # URL to AI-generated voice file

class DailyContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_session: str
    user_id: Optional[str] = None  # Added for authenticated users
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
    difficulty_level: str = "beginner"
    generate_voice: bool = True  # Whether to generate AI voice

class UserStats(BaseModel):
    tests_completed: int
    profile_confidence: float
    days_active: int
    meditations_completed: int
    last_activity: datetime
    puzzle_pieces_unlocked: List[str] = Field(default_factory=list)
    superhuman_progress: float = 0.0

class ExportData(BaseModel):
    user_session: str
    user_id: Optional[str] = None
    test_results: List[TestResult]
    unified_profile: Optional[UnifiedProfile]
    daily_content_history: List[DailyContent]
    export_date: datetime = Field(default_factory=datetime.utcnow)

# Premium Test Result Models
class PremiumTestResult(BaseModel):
    """Enhanced model for premium test results with detailed scoring"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    test_id: str
    user_session: str
    user_id: Optional[str] = None
    answers: Dict[str, Any]
    dimension_scores: Dict[str, float]  # Detailed dimension scores
    analysis: Dict[str, Any]  # Comprehensive analysis
    confidence: float
    test_category: str  # e.g., "Core Personality", "Values", "Career"
    completion_time_minutes: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestCompletionStatus(BaseModel):
    """Track user's test completion progress"""
    user_session: str
    user_id: Optional[str] = None  
    completed_tests: List[str] = Field(default_factory=list)
    premium_tests_completed: List[str] = Field(default_factory=list)
    total_tests_available: int = 0
    completion_percentage: float = 0.0
    current_level: str = "Beginner"  # Beginner, Explorer, Developing, Advanced, Enlightened, Superhuman
    constellation_pieces: List[str] = Field(default_factory=list)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

# Authentication Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: datetime = Field(default_factory=datetime.utcnow)
    session_token: Optional[str] = None
    is_premium: bool = False

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    is_active: bool = True

# AI Chat Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_session: str
    user_id: Optional[str] = None
    message: str
    response: str
    context_tests: List[str] = Field(default_factory=list)  # Which test results were used for context
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ai_model_used: str = "gpt-4o-mini"

class ChatRequest(BaseModel):
    user_session: str
    message: str
    include_context: bool = True

# Palmistry Models
class PalmScan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_session: str
    user_id: Optional[str] = None
    image_data: str  # Base64 encoded image
    analysis_result: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PalmistryResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_session: str
    scan_id: str
    life_line: Dict[str, Any]
    heart_line: Dict[str, Any]
    head_line: Dict[str, Any]
    fate_line: Dict[str, Any]
    personality_traits: List[str]
    life_predictions: List[str]
    confidence: float
    analysis_date: datetime = Field(default_factory=datetime.utcnow)

# Response Models
class TestResultResponse(BaseModel):
    success: bool
    result: TestResult
    insights: str
    next_recommendations: List[str]
    puzzle_unlocked: Optional[str] = None
    superhuman_progress: float = 0.0

class ProfileResponse(BaseModel):
    success: bool
    profile: Optional[UnifiedProfile]
    completion_percentage: float
    missing_tests: List[str]
    message: str
    superhuman_qualities: List[str] = Field(default_factory=list)

class DailyContentResponse(BaseModel):
    success: bool
    content: DailyContent
    personalization_level: str

class ChatResponse(BaseModel):
    success: bool
    message: str
    response: str
    confidence: float
    context_used: List[str]

class PalmistryResponse(BaseModel):
    success: bool
    analysis: Optional[PalmistryResult]
    message: str

class AuthResponse(BaseModel):
    success: bool
    user: Optional[User]
    session_token: Optional[str]
    message: str

class AIGenerationStatus(BaseModel):
    status: str  # generating, completed, failed
    progress: float
    estimated_time_remaining: Optional[int]  # seconds
    error_message: Optional[str]