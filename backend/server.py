from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from contextlib import asynccontextmanager
import dependencies

# Import services
from services.profile_service import ProfileService
from services.auth_service import AuthService
from services.chat_service import ChatService
from services.palmistry_service import PalmistryService

# Import routers
from routers import tests, profile, daily, auth, chat, palmistry, blueprint

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Global variables for database
client = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global client, db
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'superhuman_blueprint')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Set database in dependencies
    dependencies.set_database(db)
    
    # Test connection
    try:
        await client.admin.command('ismaster')
        logging.info("Connected to MongoDB successfully")
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
    
    yield
    
    # Shutdown
    if client:
        client.close()

# Create FastAPI app with lifespan
app = FastAPI(
    title="Personal Blueprint AI API",
    description="AI-powered personality synthesis platform for creating personalized Operating Manuals",
    version="3.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # In production, specify actual origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencies to get service instances
async def get_profile_service() -> ProfileService:
    return ProfileService(db)

async def get_auth_service() -> AuthService:
    return AuthService(db)

async def get_chat_service() -> ChatService:
    return ChatService(db)

async def get_palmistry_service() -> PalmistryService:
    return PalmistryService(db)

# Include routers with dependencies
app.include_router(auth.router)
app.include_router(tests.router)
app.include_router(profile.router)
app.include_router(daily.router)
app.include_router(chat.router)
app.include_router(palmistry.router)
app.include_router(blueprint.router)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await client.admin.command('ismaster')
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "service": "Superhuman Identity Puzzle API",
        "version": "2.0.0"
    }

# Root endpoint
@app.get("/api/")
async def root():
    return {
        "message": "Personal Blueprint AI API",
        "description": "Create your personalized Operating Manual through AI-powered synthesis",
        "version": "3.0.0",
        "theme": "🧠📚 Understand yourself. Optimize your life.",
        "endpoints": {
            "authentication": "/api/auth",
            "tests": "/api/tests",
            "profile": "/api/profile", 
            "daily": "/api/daily",
            "chat": "/api/chat",
            "palmistry": "/api/palmistry",
            "blueprint": "/api/blueprint",
            "health": "/api/health"
        }
    }

# User session endpoints
@app.post("/api/user/session")
async def create_user_session():
    """Create a new user session ID"""
    import uuid
    session_id = str(uuid.uuid4())
    
    return {
        "success": True,
        "session_id": session_id,
        "message": "New user session created"
    }

@app.get("/api/user/{user_session}/summary")
async def get_user_summary(
    user_session: str, 
    request: Request,
    profile_service: ProfileService = Depends(dependencies.get_profile_service),
    auth_service: AuthService = Depends(dependencies.get_auth_service)
):
    """Get summary of user's progress and data"""
    
    try:
        # Get current user if authenticated
        session_token = request.cookies.get("session_token")
        current_user = None
        
        if session_token:
            user = await auth_service.validate_session_token(session_token)
            if user:
                current_user = user.dict()
        
        user_id = current_user.get("id") if current_user else None
        
        # Get test results
        test_results = await profile_service.get_user_test_results(user_session, user_id)
        
        # Get profile
        profile = await profile_service.get_unified_profile(user_session, user_id)
        
        # Get stats
        stats = await profile_service.get_user_stats(user_session, user_id)
        
        # Calculate puzzle pieces
        puzzle_pieces = []
        for result in test_results:
            if result.test_id == 'mbti':
                puzzle_pieces.append('Mental Architecture')
            elif result.test_id == 'enneagram':
                puzzle_pieces.append('Motivational Core')
            elif result.test_id == 'disc':
                puzzle_pieces.append('Behavioral Pattern')
            elif result.test_id == 'humanDesign':
                puzzle_pieces.append('Energy Architecture')
            elif result.test_id == 'palmistry':
                puzzle_pieces.append('Ancient Wisdom')
        
        superhuman_progress = len(puzzle_pieces) / 5.0  # 5 total puzzle pieces
        
        return {
            "success": True,
            "summary": {
                "user_session": user_session,
                "user_id": user_id,
                "authenticated": current_user is not None,
                "tests_completed": len(test_results),
                "completed_test_types": [r.test_id for r in test_results],
                "profile_generated": profile is not None,
                "profile_confidence": profile.confidence if profile else 0.0,
                "last_activity": stats["last_activity"],
                "ready_for_synthesis": len(test_results) >= 1,
                "puzzle_pieces_unlocked": puzzle_pieces,
                "superhuman_progress": superhuman_progress,
                "superhuman_qualities_unlocked": int(superhuman_progress * 6)  # 6 total qualities
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Error retrieving user summary: {str(e)}"
        }

# Superhuman progress endpoint
@app.get("/api/superhuman/progress/{user_session}")
async def get_superhuman_progress(
    user_session: str,
    request: Request,
    profile_service: ProfileService = Depends(dependencies.get_profile_service),
    auth_service: AuthService = Depends(dependencies.get_auth_service)
):
    """Get detailed superhuman evolution progress"""
    
    try:
        # Get current user if authenticated
        session_token = request.cookies.get("session_token")
        current_user = None
        
        if session_token:
            user = await auth_service.validate_session_token(session_token)
            if user:
                current_user = user.dict()
        
        user_id = current_user.get("id") if current_user else None
        
        # Get test results and profile
        test_results = await profile_service.get_user_test_results(user_session, user_id)
        profile = await profile_service.get_unified_profile(user_session, user_id)
        
        # Define puzzle pieces and superhuman qualities
        all_puzzles = [
            {"id": "mental_arch", "name": "Mental Architecture", "test": "mbti", "icon": "🧠"},
            {"id": "motivational_core", "name": "Motivational Core", "test": "enneagram", "icon": "⭐"},
            {"id": "behavioral_pattern", "name": "Behavioral Pattern", "test": "disc", "icon": "🎯"},
            {"id": "energy_arch", "name": "Energy Architecture", "test": "humanDesign", "icon": "✨"},
            {"id": "ancient_wisdom", "name": "Ancient Wisdom", "test": "palmistry", "icon": "🤚"}
        ]
        
        superhuman_qualities = [
            "Self-Awareness", "Emotional Mastery", "Cognitive Optimization",
            "Authentic Expression", "Energy Alignment", "Intuitive Wisdom"
        ]
        
        completed_tests = [r.test_id for r in test_results]
        unlocked_puzzles = []
        
        for puzzle in all_puzzles:
            if puzzle["test"] in completed_tests:
                puzzle["unlocked"] = True
                unlocked_puzzles.append(puzzle)
            else:
                puzzle["unlocked"] = False
        
        progress_percentage = len(unlocked_puzzles) / len(all_puzzles) * 100
        unlocked_qualities = int(len(unlocked_puzzles) / len(all_puzzles) * len(superhuman_qualities))
        
        return {
            "success": True,
            "progress": {
                "percentage": progress_percentage,
                "puzzles_unlocked": len(unlocked_puzzles),
                "total_puzzles": len(all_puzzles),
                "puzzle_pieces": all_puzzles,
                "superhuman_qualities": {
                    "unlocked": superhuman_qualities[:unlocked_qualities],
                    "locked": superhuman_qualities[unlocked_qualities:],
                    "total": len(superhuman_qualities)
                },
                "is_superhuman": progress_percentage >= 100,
                "next_milestone": all_puzzles[len(unlocked_puzzles)] if len(unlocked_puzzles) < len(all_puzzles) else None,
                "profile_confidence": profile.confidence if profile else 0.0
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Error getting superhuman progress: {str(e)}"
        }

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)