from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import date

from models import ProfileSynthesisRequest, ProfileResponse, CustomMeditationRequest
from services.profile_service import ProfileService

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.post("/synthesize", response_model=ProfileResponse)
async def synthesize_profile(
    request: ProfileSynthesisRequest,
    profile_service: ProfileService = Depends()
):
    """Generate unified personality profile from completed tests"""
    
    try:
        result = await profile_service.generate_unified_profile(
            user_session=request.user_session,
            user_goals=request.user_goals,
            regenerate=request.regenerate
        )
        
        return ProfileResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile synthesis failed: {str(e)}")

@router.get("/unified/{user_session}", response_model=ProfileResponse)
async def get_unified_profile(user_session: str, profile_service: ProfileService = Depends()):
    """Retrieve existing unified profile"""
    
    try:
        profile = await profile_service.get_unified_profile(user_session)
        
        if not profile:
            # Check if user has any test results
            test_results = await profile_service.get_user_test_results(user_session)
            
            if not test_results:
                return ProfileResponse(
                    success=False,
                    profile=None,
                    completion_percentage=0,
                    missing_tests=["mbti", "enneagram", "disc", "humanDesign"],
                    message="No test results found. Complete personality tests to generate your profile."
                )
            else:
                return ProfileResponse(
                    success=False,
                    profile=None,
                    completion_percentage=profile_service._calculate_completion_percentage([r.test_id for r in test_results]),
                    missing_tests=profile_service._get_missing_tests([r.test_id for r in test_results]),
                    message="Profile not generated yet. Click 'Generate Profile' to create your unified blueprint."
                )
        
        return ProfileResponse(
            success=True,
            profile=profile,
            completion_percentage=profile_service._calculate_completion_percentage(profile.source_tests),
            missing_tests=profile_service._get_missing_tests(profile.source_tests),
            message="Profile retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving profile: {str(e)}")

@router.post("/regenerate/{user_session}")
async def regenerate_profile(
    user_session: str,
    user_goals: Optional[str] = None,
    profile_service: ProfileService = Depends()
):
    """Regenerate unified profile with latest test data"""
    
    try:
        result = await profile_service.generate_unified_profile(
            user_session=user_session,
            user_goals=user_goals,
            regenerate=True
        )
        
        return ProfileResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile regeneration failed: {str(e)}")

@router.get("/stats/{user_session}")
async def get_user_stats(user_session: str, profile_service: ProfileService = Depends()):
    """Get user statistics and progress"""
    
    try:
        stats = await profile_service.get_user_stats(user_session)
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")

@router.post("/custom-meditation")
async def generate_custom_meditation(
    request: CustomMeditationRequest,
    profile_service: ProfileService = Depends()
):
    """Generate custom meditation based on user profile"""
    
    try:
        # Get user's profile
        profile = await profile_service.get_unified_profile(request.user_session)
        
        if not profile:
            raise HTTPException(
                status_code=404, 
                detail="Profile not found. Complete tests and generate profile first."
            )
        
        # Generate custom meditation
        ai_service = profile_service.ai_service
        result = await ai_service.generate_custom_meditation(
            profile=profile.dict(),
            user_session=request.user_session,
            focus_area=request.focus_area,
            duration_minutes=request.duration_minutes
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Meditation generation failed"))
        
        return {
            "success": True,
            "meditation": result["meditation"],
            "generated_at": result["generation_time"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Custom meditation generation failed: {str(e)}")

@router.delete("/data/{user_session}")
async def delete_user_data(user_session: str, profile_service: ProfileService):
    """Delete all user data"""
    
    try:
        success = await profile_service.delete_user_data(user_session)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete user data")
        
        return {
            "success": True,
            "message": "All user data deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user data: {str(e)}")

@router.get("/export/{user_session}")
async def export_user_data(user_session: str, profile_service: ProfileService):
    """Export all user data"""
    
    try:
        export_data = await profile_service.export_user_data(user_session)
        
        return {
            "success": True,
            "data": export_data,
            "message": "Data exported successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting data: {str(e)}")