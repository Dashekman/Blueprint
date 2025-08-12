from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from services.chat_service import ChatService
from services.auth_service import AuthService
from routers.auth import get_current_user_dependency
from models import ChatRequest, ChatResponse, ChatMessage
from dependencies import get_chat_service

router = APIRouter(prefix="/api/chat", tags=["ai-chat"])

@router.post("/message", response_model=ChatResponse)
async def send_chat_message(
    request: ChatRequest,
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    chat_service: ChatService = Depends(get_chat_service)
):
    """Send message to AI personality coach"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        
        response = await chat_service.process_chat_message(
            user_session=request.user_session,
            user_id=user_id,
            message=request.message,
            include_context=request.include_context
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@router.get("/history/{user_session}")
async def get_chat_history(
    user_session: str,
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    chat_service: ChatService = Depends()
):
    """Get chat history for user session"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        
        history = await chat_service.get_chat_history(
            user_session=user_session,
            user_id=user_id,
            limit=50
        )
        
        return {
            "success": True,
            "messages": [msg.dict() for msg in history],
            "count": len(history)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get chat history: {str(e)}")

@router.delete("/history/{user_session}")
async def delete_chat_history(
    user_session: str,
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    chat_service: ChatService = Depends()
):
    """Delete chat history for user session"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        
        success = await chat_service.delete_chat_history(
            user_session=user_session,
            user_id=user_id
        )
        
        return {
            "success": success,
            "message": "Chat history deleted successfully" if success else "No chat history found"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete chat history: {str(e)}")

@router.get("/context/{user_session}")
async def get_personality_context(
    user_session: str,
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    chat_service: ChatService = Depends()
):
    """Get available personality context for chat"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        
        context = await chat_service._get_user_context(user_session, user_id)
        
        return {
            "success": True,
            "context": context,
            "available_tests": list(context.keys()),
            "has_unified_profile": "unified_profile" in context
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get context: {str(e)}")

@router.post("/quick-questions")
async def get_quick_questions(
    user_session: str,
    current_user: Optional[dict] = Depends(get_current_user_dependency),
    chat_service: ChatService = Depends()
):
    """Get suggested quick questions based on user's profile"""
    
    try:
        user_id = current_user.get("id") if current_user else None
        context = await chat_service._get_user_context(user_session, user_id)
        
        # Generate contextual quick questions
        questions = []
        
        if not context:
            questions = [
                "What personality test should I take first?",
                "How can I better understand myself?",
                "What are the benefits of personality assessments?",
                "How do I start my self-discovery journey?"
            ]
        else:
            if 'mbti' in context:
                questions.append(f"How can I use my {context['mbti']['type']} personality type in my career?")
                questions.append("What are the best ways to communicate with other personality types?")
            
            if 'enneagram' in context:
                questions.append(f"How can I grow as an Enneagram Type {context['enneagram']['type']}?")
                questions.append("What are healthy ways to manage my core fears?")
            
            if 'unified_profile' in context:
                questions.append("How can I leverage my unique combination of traits?")
                questions.append("What specific steps should I take for personal growth?")
                questions.append("How can I become more of a 'superhuman' version of myself?")
            
            # Add general questions
            questions.extend([
                "What meditation practices work best for my personality?",
                "How can I improve my relationships based on my personality?",
                "What career paths align with my personality profile?"
            ])
        
        return {
            "success": True,
            "questions": questions[:8]  # Return max 8 questions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")