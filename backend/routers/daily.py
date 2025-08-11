from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import date

from models import DailyContentRequest, DailyContentResponse
from services.profile_service import ProfileService

router = APIRouter(prefix="/api/daily", tags=["daily"])

@router.get("/content/{user_session}", response_model=DailyContentResponse)
async def get_daily_content(
    user_session: str,
    target_date: Optional[str] = None,
    focus_area: Optional[str] = None,
    profile_service: ProfileService = Depends()
):
    """Get personalized daily content"""
    
    try:
        if not target_date:
            target_date = date.today().isoformat()
        
        result = await profile_service.generate_daily_content(
            user_session=user_session,
            target_date=target_date,
            focus_area=focus_area
        )
        
        return DailyContentResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating daily content: {str(e)}")

@router.post("/content", response_model=DailyContentResponse)
async def create_daily_content(
    request: DailyContentRequest,
    profile_service: ProfileService = Depends()
):
    """Generate daily content for specific date and focus"""
    
    try:
        target_date = request.date or date.today().isoformat()
        
        result = await profile_service.generate_daily_content(
            user_session=request.user_session,
            target_date=target_date,
            focus_area=request.focus_area
        )
        
        return DailyContentResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating daily content: {str(e)}")

@router.get("/horoscope/{user_session}")
async def get_personalized_horoscope(
    user_session: str,
    target_date: Optional[str] = None,
    profile_service: ProfileService = Depends()
):
    """Get personalized horoscope for the day"""
    
    try:
        if not target_date:
            target_date = date.today().isoformat()
        
        # Get daily content which includes horoscope
        result = await profile_service.generate_daily_content(
            user_session=user_session,
            target_date=target_date
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail="Failed to generate horoscope")
        
        return {
            "success": True,
            "horoscope": result["content"].horoscope,
            "date": target_date,
            "personalization_level": result["personalization_level"],
            "disclaimer": "Entertainment and spiritual guidance only"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating horoscope: {str(e)}")

@router.get("/mantra/{user_session}")
async def get_daily_mantra(
    user_session: str,
    target_date: Optional[str] = None,
    profile_service: ProfileService = Depends()
):
    """Get personalized daily mantra"""
    
    try:
        if not target_date:
            target_date = date.today().isoformat()
        
        # Get daily content which includes mantra
        result = await profile_service.generate_daily_content(
            user_session=user_session,
            target_date=target_date
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail="Failed to generate mantra")
        
        return {
            "success": True,
            "mantra": result["content"].mantra,
            "date": target_date,
            "personalization_level": result["personalization_level"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating mantra: {str(e)}")

@router.get("/routine/{user_session}")
async def get_micro_routine(
    user_session: str,
    target_date: Optional[str] = None,
    profile_service: ProfileService = Depends()
):
    """Get personalized micro-routine for the day"""
    
    try:
        if not target_date:
            target_date = date.today().isoformat()
        
        # Get daily content which includes micro-routine
        result = await profile_service.generate_daily_content(
            user_session=user_session,
            target_date=target_date
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail="Failed to generate routine")
        
        return {
            "success": True,
            "routine": result["content"].micro_routine.dict(),
            "date": target_date,
            "personalization_level": result["personalization_level"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating routine: {str(e)}")

@router.get("/meditation/{user_session}")
async def get_daily_meditation(
    user_session: str,
    target_date: Optional[str] = None,
    profile_service: ProfileService = Depends()
):
    """Get personalized meditation for the day"""
    
    try:
        if not target_date:
            target_date = date.today().isoformat()
        
        # Get daily content which includes meditation
        result = await profile_service.generate_daily_content(
            user_session=user_session,
            target_date=target_date
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail="Failed to generate meditation")
        
        return {
            "success": True,
            "meditation": result["content"].meditation.dict(),
            "date": target_date,
            "personalization_level": result["personalization_level"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating meditation: {str(e)}")

@router.post("/meditation/generate")
async def generate_custom_meditation(
    user_session: str,
    focus_area: str,
    duration: int = 7,
    profile_service: ProfileService = None
):
    """Generate a custom meditation for specific focus area"""
    
    try:
        # Get user's profile
        profile = await profile_service.get_unified_profile(user_session)
        
        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found. Complete tests and generate profile first."
            )
        
        # Generate custom meditation
        ai_service = profile_service.ai_service
        result = await ai_service.generate_custom_meditation(
            profile=profile.dict(),
            user_session=user_session,
            focus_area=focus_area,
            duration_minutes=duration
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Meditation generation failed"))
        
        return {
            "success": True,
            "meditation": result["meditation"],
            "focus_area": focus_area,
            "duration": duration,
            "generated_at": result["generation_time"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Custom meditation generation failed: {str(e)}")