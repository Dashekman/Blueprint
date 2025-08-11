from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from contextlib import asynccontextmanager

# Import dependencies
from dependencies import set_database, get_profile_service

# Import routers
from routers import tests, profile, daily
from services.profile_service import ProfileService

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
    db_name = os.environ.get('DB_NAME', 'personal_blueprint')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Set database in dependencies module
    set_database(db)
    
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
    title="Personal Blueprint API",
    description="AI-powered personality assessment and synthesis platform",
    version="1.0.0",
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

# Include routers
app.include_router(tests.router)
app.include_router(profile.router)
app.include_router(daily.router)

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
        "service": "Personal Blueprint API",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/api/")
async def root():
    return {
        "message": "Personal Blueprint API",
        "description": "AI-powered personality assessment and synthesis platform",
        "version": "1.0.0",
        "endpoints": {
            "tests": "/api/tests",
            "profile": "/api/profile", 
            "daily": "/api/daily",
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
async def get_user_summary(user_session: str, profile_service: ProfileService = Depends(get_profile_service)):
    """Get summary of user's progress and data"""
    
    try:
        # Get test results
        test_results = await profile_service.get_user_test_results(user_session)
        
        # Get profile
        profile = await profile_service.get_unified_profile(user_session)
        
        # Get stats
        stats = await profile_service.get_user_stats(user_session)
        
        return {
            "success": True,
            "summary": {
                "user_session": user_session,
                "tests_completed": len(test_results),
                "completed_test_types": [r.test_id for r in test_results],
                "profile_generated": profile is not None,
                "profile_confidence": profile.confidence if profile else 0.0,
                "last_activity": stats["last_activity"],
                "ready_for_synthesis": len(test_results) >= 1
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Error retrieving user summary: {str(e)}"
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