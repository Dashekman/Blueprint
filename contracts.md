# Personal Blueprint Backend Integration Contracts

## API Contracts

### 1. Test Management Endpoints
- `POST /api/tests/{testId}/submit` - Submit completed test answers
- `GET /api/tests/{testId}/result/{resultId}` - Retrieve test results
- `GET /api/tests/progress/{testId}` - Get saved test progress
- `PUT /api/tests/progress/{testId}` - Save test progress

### 2. AI Synthesis Endpoints
- `POST /api/profile/synthesize` - Generate unified profile from completed tests
- `GET /api/profile/unified` - Retrieve current unified profile
- `POST /api/profile/regenerate` - Regenerate AI insights

### 3. Daily Content Endpoints
- `GET /api/daily/content` - Get personalized daily content
- `POST /api/daily/meditation/generate` - Generate custom meditation
- `GET /api/daily/horoscope` - Get personalized horoscope

### 4. User Data Endpoints
- `POST /api/user/export` - Export user data
- `DELETE /api/user/data` - Delete all user data
- `GET /api/user/stats` - Get user statistics

## Data Models

### TestResult
```python
{
    "id": "uuid",
    "test_id": "string",
    "user_session": "string", 
    "answers": "dict",
    "raw_score": "dict",
    "result_type": "string",
    "completed_at": "datetime",
    "confidence": "float"
}
```

### UnifiedProfile
```python
{
    "id": "uuid",
    "user_session": "string",
    "source_tests": ["list of test_ids"],
    "strengths": ["list"],
    "challenges": ["list"], 
    "communication_style": "string",
    "career_guidance": "string",
    "study_tactics": "string",
    "motivation_levers": "string",
    "relationship_tips": "string",
    "daily_micro_coaching": "string",
    "confidence": "float",
    "generated_at": "datetime",
    "ai_model_used": "string"
}
```

### DailyContent
```python
{
    "id": "uuid",
    "user_session": "string",
    "date": "date",
    "horoscope": "string",
    "mantra": "string",
    "micro_routine": {
        "name": "string",
        "duration": "string", 
        "description": "string",
        "steps": ["list"]
    },
    "meditation": {
        "title": "string",
        "duration": "string",
        "script": "string"
    },
    "generated_at": "datetime"
}
```

## Mock Data Replacement Strategy

### Currently Mocked in Frontend (mock.js)
1. **Test Results** - Replace with AI-powered result analysis
2. **Unified Profile** - Replace with real AI synthesis of multiple tests
3. **Daily Content** - Replace with personalized AI-generated content
4. **Meditation Scripts** - Replace with AI-generated guided meditations

### Frontend Integration Changes
1. Replace localStorage with API calls
2. Add loading states for AI generation
3. Implement error handling for AI failures
4. Add progress indicators for synthesis

## AI Integration Plan

### Emergent LLM Integration
1. **Profile Synthesis Prompt**:
   - Input: All completed test results + user goals/context
   - Output: Comprehensive personality analysis with actionable insights
   - Confidence scoring based on test completion

2. **Daily Content Generation**:
   - Input: Unified profile + current date + user preferences
   - Output: Personalized horoscope, mantra, micro-routine, meditation

3. **Meditation Script Generation**:
   - Input: User profile + specific focus area + duration preference
   - Output: Complete guided meditation script with timing cues

### Error Handling & Fallbacks
1. AI service unavailable → Use cached/default content
2. Insufficient test data → Provide limited insights with clear disclaimers
3. Generation timeout → Queue for background processing

## Backend Architecture

### FastAPI Structure
```
/app/backend/
├── server.py (main application)
├── models/ (Pydantic models)
├── services/ (business logic)
│   ├── ai_service.py (Emergent LLM integration)
│   ├── test_service.py (test scoring & analysis)
│   └── profile_service.py (profile synthesis)
├── routers/ (API endpoints)
└── utils/ (helpers & scoring algorithms)
```

### Database Schema Updates
1. Add test_results collection
2. Add unified_profiles collection  
3. Add daily_content collection
4. Add user_sessions collection (for tracking without accounts)

## Implementation Phases

### Phase 2A: Core Backend Services
1. Set up Emergent LLM integration
2. Implement test scoring algorithms
3. Create profile synthesis service
4. Build basic API endpoints

### Phase 2B: AI Content Generation
1. Implement daily content generation
2. Add meditation script generation
3. Create personalized horoscope system
4. Add confidence scoring

### Phase 2C: Frontend Integration
1. Replace mock data with API calls
2. Add loading states and error handling
3. Implement real-time profile updates
4. Add data persistence features

## Testing Strategy
1. Unit tests for scoring algorithms
2. Integration tests for AI service
3. End-to-end tests for complete user journey
4. Load testing for AI generation endpoints

## Compliance & Ethics
1. Add disclaimers to all AI-generated content
2. Implement confidence levels for all insights
3. Provide source attribution for each recommendation
4. Add medical/mental health disclaimers
5. Ensure GDPR compliance for data handling