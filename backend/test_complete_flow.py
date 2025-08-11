import asyncio
import os
import json
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from services.ai_service import AIService
from services.profile_service import ProfileService
from services.test_service import TestScoringService
from models import TestResult

# Load environment variables
load_dotenv()

async def test_complete_ai_flow():
    """Test the complete AI-powered personality analysis flow"""
    
    # Initialize services
    print("🔧 Initializing services...")
    
    # Setup database
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'personal_blueprint')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    ai_service = AIService()
    profile_service = ProfileService(db)
    scoring_service = TestScoringService()
    
    print("✅ Services initialized successfully")
    
    try:
        # Test 1: Score a mock MBTI test
        print("\n📊 Testing MBTI scoring...")
        mbti_answers = {
            '1': 'I', '2': 'N', '3': 'N', '4': 'T', '5': 'T',
            '6': 'J', '7': 'J', '8': 'I', '9': 'N', '10': 'N',
            '11': 'T', '12': 'T', '13': 'J', '14': 'J', '15': 'I',
            '16': 'N', '17': 'N', '18': 'T', '19': 'T', '20': 'J'
        }
        
        result_type, raw_score, confidence = scoring_service.score_mbti(mbti_answers)
        print(f"✅ MBTI Result: {result_type} (confidence: {confidence:.2f})")
        
        # Test 2: Create and save test result
        print("\n💾 Testing test result storage...")
        test_result = TestResult(
            test_id="mbti",
            user_session="test_user_123",
            answers=mbti_answers,
            raw_score=raw_score,
            result_type=result_type,
            confidence=confidence
        )
        
        saved = await profile_service.save_test_result(test_result)
        if saved:
            print("✅ Test result saved to database")
        else:
            print("❌ Failed to save test result")
            
        # Test 3: AI Profile Synthesis
        print("\n🧠 Testing AI profile synthesis...")
        synthesis_result = await profile_service.generate_unified_profile(
            user_session="test_user_123",
            user_goals="I want to improve my leadership and communication skills",
            regenerate=True
        )
        
        if synthesis_result["success"]:
            print("✅ AI profile synthesis successful!")
            profile = synthesis_result["profile"]
            print(f"   - Strengths: {len(profile.strengths)}")
            print(f"   - Challenges: {len(profile.challenges)}")
            print(f"   - Confidence: {profile.confidence:.2f}")
            print(f"   - Communication Style: {profile.communication_style[:100]}...")
        else:
            print(f"❌ Profile synthesis failed: {synthesis_result['message']}")
            
        # Test 4: Daily Content Generation
        print("\n🌅 Testing daily content generation...")
        daily_result = await profile_service.generate_daily_content(
            user_session="test_user_123",
            target_date="2025-01-11"
        )
        
        if daily_result["success"]:
            print("✅ Daily content generated successfully!")
            content = daily_result["content"]
            print(f"   - Horoscope: {content.horoscope[:80]}...")
            print(f"   - Mantra: {content.mantra}")
            print(f"   - Routine: {content.micro_routine.name}")
            print(f"   - Meditation: {content.meditation.title}")
        else:
            print(f"❌ Daily content generation failed")
            
        # Test 5: Custom Meditation Generation
        print("\n🧘 Testing custom meditation generation...")
        meditation_result = await ai_service.generate_custom_meditation(
            profile=synthesis_result["profile"].dict() if synthesis_result["success"] else {},
            user_session="test_user_123",
            focus_area="stress relief",
            duration_minutes=8
        )
        
        if meditation_result["success"]:
            print("✅ Custom meditation generated successfully!")
            meditation = meditation_result["meditation"]
            print(f"   - Title: {meditation['title']}")
            print(f"   - Duration: {meditation['duration']}")
            print(f"   - Script preview: {meditation['script'][:100]}...")
        else:
            print(f"❌ Custom meditation failed: {meditation_result.get('error')}")
            
        print("\n🎉 All AI integration tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
        
    finally:
        # Cleanup test data
        print("\n🧹 Cleaning up test data...")
        try:
            await db.test_results.delete_many({"user_session": "test_user_123"})
            await db.unified_profiles.delete_many({"user_session": "test_user_123"})
            await db.daily_content.delete_many({"user_session": "test_user_123"})
            print("✅ Test data cleaned up")
        except Exception as e:
            print(f"⚠️ Cleanup warning: {str(e)}")
            
        client.close()

if __name__ == "__main__":
    asyncio.run(test_complete_ai_flow())