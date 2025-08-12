from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import Optional
from services.palmistry_service import PalmistryService
from routers.auth import get_current_user_dependency
from models import PalmistryResponse
import base64
from io import BytesIO
from PIL import Image
import json
import sys
sys.path.append('..')
from server import get_palmistry_service

router = APIRouter(prefix="/api/palmistry", tags=["palmistry"])

@router.post("/scan", response_model=PalmistryResponse)
async def analyze_palm_scan(
    user_session: str,
    image_data: str,  # Base64 encoded image
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    palmistry_service: PalmistryService = Depends(get_palmistry_service)
):
    """Analyze palm scan from camera image"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        
        # For guests, require login after taking the scan
        if not current_user:
            return PalmistryResponse(
                success=False,
                analysis=None,
                message="Please log in to get your palm reading results. Your scan has been saved and will be analyzed after login."
            )
        
        response = await palmistry_service.analyze_palm_scan(
            user_session=user_session,
            user_id=user_id,
            image_data=image_data
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Palm scan analysis failed: {str(e)}")

@router.post("/upload", response_model=PalmistryResponse)
async def upload_palm_image(
    user_session: str,
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    palmistry_service: PalmistryService = Depends()
):
    """Upload palm image file for analysis"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and convert image to base64
        image_bytes = await file.read()
        
        # Optional: Resize image to reduce size
        try:
            image = Image.open(BytesIO(image_bytes))
            # Resize if too large
            if image.width > 1024 or image.height > 1024:
                image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
                buffer = BytesIO()
                image.save(buffer, format=image.format)
                image_bytes = buffer.getvalue()
        except Exception as e:
            print(f"Image processing warning: {str(e)}")
        
        # Convert to base64
        image_base64 = base64.b64encode(image_bytes).decode()
        image_data = f"data:{file.content_type};base64,{image_base64}"
        
        # For guests, require login after taking the scan
        if not current_user:
            return PalmistryResponse(
                success=False,
                analysis=None,
                message="Please log in to get your palm reading results. Your image has been saved and will be analyzed after login."
            )
        
        response = await palmistry_service.analyze_palm_scan(
            user_session=user_session,
            user_id=user_id,
            image_data=image_data
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Palm image upload failed: {str(e)}")

@router.get("/history/{user_session}")
async def get_palm_history(
    user_session: str,
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    palmistry_service: PalmistryService = Depends()
):
    """Get user's palm scan history"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        
        # Require login to view history
        if not current_user:
            raise HTTPException(
                status_code=401,
                detail="Please log in to view your palm reading history"
            )
        
        history = await palmistry_service.get_palm_history(
            user_session=user_session,
            user_id=user_id
        )
        
        return {
            "success": True,
            "history": history,
            "count": len(history)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get palm history: {str(e)}")

@router.get("/features")
async def get_palmistry_features():
    """Get information about palmistry features and interpretations"""
    
    return {
        "success": True,
        "features": {
            "lines": {
                "life_line": {
                    "description": "Represents vitality, health, and life force",
                    "characteristics": ["length", "depth", "curves", "breaks"]
                },
                "heart_line": {
                    "description": "Indicates emotional nature and relationships",
                    "characteristics": ["curve", "length", "ending_position", "branches"]
                },
                "head_line": {
                    "description": "Shows intellectual capacity and thinking style",
                    "characteristics": ["length", "depth", "slope", "clarity"]
                },
                "fate_line": {
                    "description": "Reveals career path and life direction",
                    "characteristics": ["presence", "clarity", "start_point", "end_point"]
                }
            },
            "mounts": {
                "venus": "Love, passion, and vitality",
                "jupiter": "Leadership and ambition",
                "saturn": "Responsibility and discipline", 
                "apollo": "Creativity and success",
                "mercury": "Communication and business acumen"
            },
            "hand_shapes": {
                "earth": "Practical, reliable, grounded",
                "air": "Intellectual, communicative, social",
                "fire": "Energetic, enthusiastic, creative",
                "water": "Emotional, intuitive, caring"
            }
        },
        "disclaimer": "Palmistry is for entertainment and spiritual guidance purposes only. It should not be used for making important life decisions or medical diagnoses."
    }

@router.post("/validate-image")
async def validate_palm_image(
    image_data: str,
    palmistry_service: PalmistryService = Depends()
):
    """Validate if uploaded image is suitable for palm reading"""
    
    try:
        validation = palmistry_service._validate_image_quality(image_data)
        
        return {
            "success": True,
            "validation": validation,
            "message": "Image validated successfully" if validation["is_valid"] else "Image quality issues detected"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image validation failed: {str(e)}")

@router.get("/tips")
async def get_scanning_tips():
    """Get tips for taking good palm scan photos"""
    
    return {
        "success": True,
        "tips": {
            "lighting": [
                "Use natural light when possible",
                "Avoid harsh shadows on the palm",
                "Ensure even illumination across the hand"
            ],
            "positioning": [
                "Hold hand flat and steady",
                "Keep palm facing the camera directly",
                "Position hand to fill most of the frame",
                "Keep fingers slightly apart to show palm lines clearly"
            ],
            "camera": [
                "Use highest resolution available",
                "Focus on the center of the palm",
                "Avoid blur by keeping camera steady",
                "Take multiple shots for best results"
            ],
            "hand_preparation": [
                "Clean hands before scanning",
                "Remove jewelry that might interfere",
                "Relax hand to show natural lines",
                "Use dominant hand for primary reading"
            ]
        }
    }