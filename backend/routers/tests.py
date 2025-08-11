from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from typing import Dict, Any
import uuid
from datetime import datetime

from models import TestSubmission, TestResultResponse, AIGenerationStatus
from services.test_service import TestScoringService
from services.ai_service import AIService
from services.profile_service import ProfileService
from models import TestResult

router = APIRouter(prefix="/api/tests", tags=["tests"])

# Global instances
scoring_service = TestScoringService()
ai_service = AIService()

@router.post("/{test_id}/submit", response_model=TestResultResponse)
async def submit_test(
    test_id: str,
    submission: TestSubmission,
    background_tasks: BackgroundTasks,
    profile_service: ProfileService = Depends()
):
    """Submit completed test and get AI-powered results"""
    
    try:
        # Generate user session if not provided
        user_session = submission.user_session or str(uuid.uuid4())
        
        # Score the test
        result_type, raw_score, confidence = scoring_service.score_test(
            test_id, submission.answers
        )
        
        if result_type == "unknown":
            raise HTTPException(status_code=400, detail=f"Unknown test type: {test_id}")
        
        # Create test result
        test_result = TestResult(
            test_id=test_id,
            user_session=user_session,
            answers=submission.answers,
            raw_score=raw_score,
            result_type=result_type,
            confidence=confidence
        )
        
        # Save to database
        await profile_service.save_test_result(test_result)
        
        # Generate AI analysis in the background
        background_tasks.add_task(
            generate_test_analysis,
            test_result,
            profile_service
        )
        
        # Get immediate insights based on test type
        insights = generate_immediate_insights(test_id, result_type, raw_score)
        
        # Get recommendations for next steps
        next_recommendations = get_next_recommendations(test_id, user_session, profile_service)
        
        return TestResultResponse(
            success=True,
            result=test_result,
            insights=insights,
            next_recommendations=await next_recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing test: {str(e)}")

@router.get("/{test_id}/result/{result_id}")
async def get_test_result(test_id: str, result_id: str, profile_service: ProfileService = Depends()):
    """Get detailed test result by ID"""
    
    try:
        # In a real implementation, you'd query by result_id
        # For now, we'll return a placeholder response
        return {
            "success": True,
            "result": f"Test result for {test_id} with ID {result_id}",
            "message": "Result retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving result: {str(e)}")

@router.get("/metadata/{test_id}")
async def get_test_metadata(test_id: str):
    """Get metadata about a specific test"""
    
    metadata = scoring_service.get_test_metadata(test_id)
    if not metadata:
        raise HTTPException(status_code=404, detail=f"Test {test_id} not found")
    
    return {
        "success": True,
        "metadata": metadata
    }

async def generate_test_analysis(test_result: TestResult, profile_service: ProfileService):
    """Background task to generate AI analysis of test results"""
    
    try:
        ai_response = await ai_service.analyze_test_result(
            test_result.test_id,
            test_result.answers,
            test_result.raw_score,
            test_result.result_type
        )
        
        if ai_response["success"]:
            # Update test result with AI analysis
            test_result.ai_analysis = ai_response["analysis"]["insights"]
            # In a real implementation, you'd update the database here
            
    except Exception as e:
        print(f"Background AI analysis failed: {str(e)}")

def generate_immediate_insights(test_id: str, result_type: str, raw_score: Dict[str, Any]) -> str:
    """Generate immediate insights based on test results"""
    
    insights_templates = {
        "mbti": f"Your MBTI type is {result_type}. This indicates your preferences for {_get_mbti_description(result_type)}. Your results show strongest preferences in areas where you scored highest.",
        
        "enneagram": f"Your Enneagram type is {result_type}. This suggests your core motivation revolves around {_get_enneagram_description(result_type)}. Understanding this can help you recognize your patterns and growth opportunities.",
        
        "disc": f"Your DISC style is {result_type}. This indicates you tend to be {_get_disc_description(result_type)}. This style influences how you communicate and work with others.",
        
        "humanDesign": f"Your Human Design type is {result_type}. According to this system, your strategy involves {_get_human_design_description(result_type)}. Remember, this is for entertainment and spiritual guidance only."
    }
    
    return insights_templates.get(test_id, f"Your result type is {result_type}. This provides insights into your personality and behavioral patterns.")

def _get_mbti_description(mbti_type: str) -> str:
    descriptions = {
        "INTJ": "strategic thinking, independence, and long-term planning",
        "ENFP": "enthusiasm, creativity, and connecting with others",
        "ESTJ": "organization, leadership, and practical decision-making",
        "ISFP": "authenticity, harmony, and personal values"
    }
    return descriptions.get(mbti_type, "your unique combination of psychological preferences")

def _get_enneagram_description(type_num: str) -> str:
    descriptions = {
        "1": "perfection, improvement, and doing things correctly",  
        "2": "helping others and being needed",
        "3": "success, achievement, and recognition",
        "4": "authenticity, uniqueness, and emotional depth",
        "5": "understanding, competence, and self-sufficiency",
        "6": "security, loyalty, and managing anxiety",
        "7": "variety, excitement, and maintaining happiness",
        "8": "control, justice, and protecting others",
        "9": "harmony, peace, and avoiding conflict"
    }
    return descriptions.get(type_num, "your core motivational patterns")

def _get_disc_description(disc_type: str) -> str:
    descriptions = {
        "D": "direct, results-oriented, and decisive in your approach",
        "I": "enthusiastic, social, and influential in your interactions", 
        "S": "steady, supportive, and collaborative in your relationships",
        "C": "careful, analytical, and quality-focused in your work"
    }
    return descriptions.get(disc_type, "focused on your particular behavioral strengths")

def _get_human_design_description(hd_type: str) -> str:
    descriptions = {
        "Manifesting Generator": "responding to opportunities and then taking action",
        "Generator": "responding to what excites and energizes you",
        "Projector": "waiting for recognition and invitation to share your insights",
        "Manifestor": "initiating action and informing others of your plans",
        "Reflector": "waiting a full lunar cycle before making major decisions"
    }
    return descriptions.get(hd_type, "following your unique energetic strategy")

async def get_next_recommendations(test_id: str, user_session: str, profile_service: ProfileService) -> list:
    """Get recommendations for next steps"""
    
    # Get user's existing test results
    test_results = await profile_service.get_user_test_results(user_session)
    completed_test_ids = [result.test_id for result in test_results]
    
    all_tests = ["mbti", "enneagram", "disc", "humanDesign"]
    remaining_tests = [t for t in all_tests if t not in completed_test_ids]
    
    recommendations = []
    
    if remaining_tests:
        recommendations.append(f"Complete the {remaining_tests[0].upper()} assessment to build your comprehensive profile")
        
    if len(completed_test_ids) >= 2:
        recommendations.append("Generate your unified Personal Blueprint to see AI-powered insights")
        
    recommendations.append("Explore your daily personalized guidance")
    recommendations.append("Browse the meditation library for practices tailored to your personality")
    
    return recommendations[:3]  # Return top 3 recommendations