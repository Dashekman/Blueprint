from fastapi import APIRouter, HTTPException, Response, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from services.auth_service import AuthService
from models import AuthResponse
import os

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer(auto_error=False)

@router.post("/session", response_model=AuthResponse)
async def authenticate_session(
    request: Request,
    response: Response,
    session_id: str,
    auth_service: AuthService = Depends()
):
    """Authenticate user with Emergent OAuth session ID"""
    
    try:
        # Authenticate with Emergent OAuth
        auth_result = await auth_service.authenticate_session(session_id)
        
        if auth_result.success and auth_result.session_token:
            # Set secure HTTP-only cookie
            response.set_cookie(
                key="session_token",
                value=auth_result.session_token,
                httponly=True,
                secure=True,  # Enable in production with HTTPS
                samesite="none",  # Allow cross-site cookies
                max_age=7 * 24 * 60 * 60,  # 7 days
                path="/"
            )
            
            # Migrate anonymous data if user session exists in request
            user_session = request.headers.get("X-User-Session")
            if user_session and auth_result.user:
                await auth_service.migrate_anonymous_data(user_session, auth_result.user.id)
        
        return auth_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

@router.post("/logout")
async def logout_user(
    request: Request,
    response: Response,
    auth_service: AuthService = Depends()
):
    """Logout user and clear session"""
    
    try:
        # Get session token from cookie
        session_token = request.cookies.get("session_token")
        
        if session_token:
            await auth_service.logout_user(session_token)
        
        # Clear cookie
        response.delete_cookie(
            key="session_token",
            path="/",
            samesite="none"
        )
        
        return {"success": True, "message": "Logged out successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")

@router.get("/me")
async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    auth_service: AuthService = Depends()
):
    """Get current authenticated user"""
    
    try:
        # Try to get session token from cookie first, then Authorization header
        session_token = request.cookies.get("session_token")
        
        if not session_token and credentials:
            session_token = credentials.credentials
        
        if not session_token:
            return {"authenticated": False, "user": None}
        
        # Validate session
        user = await auth_service.validate_session_token(session_token)
        
        if user:
            return {"authenticated": True, "user": user.dict()}
        else:
            return {"authenticated": False, "user": None}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User validation failed: {str(e)}")

@router.post("/cleanup")
async def cleanup_expired_sessions(auth_service: AuthService = Depends()):
    """Cleanup expired sessions (admin endpoint)"""
    
    try:
        await auth_service.cleanup_expired_sessions()
        return {"success": True, "message": "Expired sessions cleaned up"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

# Dependency to get current user
async def get_current_user_dependency(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    auth_service: AuthService = Depends()
) -> Optional[dict]:
    """Dependency to get current user for protected routes"""
    
    session_token = request.cookies.get("session_token")
    
    if not session_token and credentials:
        session_token = credentials.credentials
    
    if not session_token:
        return None
    
    user = await auth_service.validate_session_token(session_token)
    return user.dict() if user else None

# Dependency to require authentication
async def require_auth(
    current_user: Optional[dict] = Depends(get_current_user_dependency)
) -> dict:
    """Dependency that requires authentication"""
    
    if not current_user:
        raise HTTPException(
            status_code=401, 
            detail="Authentication required. Please log in to access this feature."
        )
    
    return current_user