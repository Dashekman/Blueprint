import asyncio
import os
from dotenv import load_dotenv
from services.ai_service import AIService

# Load environment variables
load_dotenv()

async def test_ai_service():
    """Test the AI service integration"""
    try:
        ai_service = AIService()
        print("✅ AI Service initialized successfully")
        print(f"Using API key: {ai_service.api_key[:10]}...")
        
        # Test profile synthesis with mock data
        test_results = [
            {
                "test_id": "mbti",
                "result_type": "INTJ",
                "confidence": 0.85,
                "raw_score": {"I": 12, "N": 15, "T": 14, "J": 13},
                "completed_at": "2025-01-11T00:00:00"
            }
        ]
        
        print("\n🧠 Testing AI personality synthesis...")
        result = await ai_service.synthesize_personality_profile(
            test_results, 
            "test_session_123",
            "I want to improve my leadership skills"
        )
        
        if result["success"]:
            print("✅ AI synthesis successful!")
            profile = result["profile"]
            print(f"Generated strengths: {len(profile.get('strengths', []))}")
            print(f"Confidence level: {profile.get('confidence', 0)}")
        else:
            print(f"❌ AI synthesis failed: {result.get('error')}")
            
    except Exception as e:
        print(f"❌ Error testing AI service: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_ai_service())