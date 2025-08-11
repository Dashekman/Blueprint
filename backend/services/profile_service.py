from typing import Dict, List, Optional, Any
from datetime import datetime, date
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.ai_service import AIService
from services.test_service import TestScoringService
from models import TestResult, UnifiedProfile, DailyContent

class ProfileService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.ai_service = AIService()
        self.scoring_service = TestScoringService()
    
    async def get_user_test_results(self, user_session: str) -> List[TestResult]:
        """Get all test results for a user session"""
        cursor = self.db.test_results.find({"user_session": user_session})
        results = []
        async for doc in cursor:
            # Convert MongoDB document to TestResult
            doc['id'] = str(doc['_id'])
            del doc['_id']
            results.append(TestResult(**doc))
        return results
    
    async def save_test_result(self, test_result: TestResult) -> bool:
        """Save a test result to database"""
        try:
            result_dict = test_result.dict()
            result_dict['_id'] = result_dict.pop('id')
            await self.db.test_results.insert_one(result_dict)
            return True
        except Exception as e:
            print(f"Error saving test result: {str(e)}")
            return False
    
    async def generate_unified_profile(
        self, 
        user_session: str, 
        user_goals: Optional[str] = None,
        regenerate: bool = False
    ) -> Dict[str, Any]:
        """Generate or retrieve unified personality profile"""
        
        # Check if profile already exists and regeneration not requested
        if not regenerate:
            existing_profile = await self.get_unified_profile(user_session)
            if existing_profile:
                return {
                    "success": True,
                    "profile": existing_profile,
                    "completion_percentage": self._calculate_completion_percentage(existing_profile.source_tests),
                    "message": "Retrieved existing profile"
                }
        
        # Get user's test results
        test_results = await self.get_user_test_results(user_session)
        
        if not test_results:
            return {
                "success": False,
                "profile": None,
                "completion_percentage": 0,
                "missing_tests": ["mbti", "enneagram", "disc", "humanDesign"],
                "message": "No test results found. Complete at least one personality test to generate your profile."
            }
        
        # Prepare test data for AI synthesis
        test_data = []
        for result in test_results:
            test_data.append({
                "test_id": result.test_id,
                "result_type": result.result_type,
                "confidence": result.confidence,
                "raw_score": result.raw_score,
                "completed_at": result.completed_at.isoformat()
            })
        
        # Generate AI synthesis
        ai_response = await self.ai_service.synthesize_personality_profile(
            test_data, user_session, user_goals
        )
        
        if not ai_response["success"]:
            return {
                "success": False,
                "profile": None,
                "completion_percentage": self._calculate_completion_percentage([r.test_id for r in test_results]),
                "message": f"AI synthesis failed: {ai_response.get('error', 'Unknown error')}"
            }
        
        # Create UnifiedProfile object
        profile_data = ai_response["profile"]
        unified_profile = UnifiedProfile(
            user_session=user_session,
            source_tests=[r.test_id for r in test_results],
            **profile_data
        )
        
        # Save to database
        await self.save_unified_profile(unified_profile)
        
        completion_percentage = self._calculate_completion_percentage(unified_profile.source_tests)
        missing_tests = self._get_missing_tests(unified_profile.source_tests)
        
        return {
            "success": True,
            "profile": unified_profile,
            "completion_percentage": completion_percentage,
            "missing_tests": missing_tests,
            "message": "Profile generated successfully" if not regenerate else "Profile regenerated successfully"
        }
    
    async def get_unified_profile(self, user_session: str) -> Optional[UnifiedProfile]:
        """Retrieve existing unified profile"""
        doc = await self.db.unified_profiles.find_one({"user_session": user_session})
        if doc:
            doc['id'] = str(doc['_id'])
            del doc['_id']
            return UnifiedProfile(**doc)
        return None
    
    async def save_unified_profile(self, profile: UnifiedProfile) -> bool:
        """Save unified profile to database"""
        try:
            # Remove existing profile for this user session
            await self.db.unified_profiles.delete_many({"user_session": profile.user_session})
            
            # Insert new profile
            profile_dict = profile.dict()
            profile_dict['_id'] = profile_dict.pop('id')
            await self.db.unified_profiles.insert_one(profile_dict)
            return True
        except Exception as e:
            print(f"Error saving unified profile: {str(e)}")
            return False
    
    async def generate_daily_content(
        self,
        user_session: str,
        target_date: Optional[str] = None,
        focus_area: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate personalized daily content"""
        
        if not target_date:
            target_date = date.today().isoformat()
        
        # Check if content already exists for this date
        existing_content = await self.get_daily_content(user_session, target_date)
        if existing_content:
            return {
                "success": True,
                "content": existing_content,
                "personalization_level": "high" if existing_content.profile_based else "low"
            }
        
        # Get user's unified profile
        profile = await self.get_unified_profile(user_session)
        
        if not profile:
            # Generate basic content without profile
            return await self._generate_basic_daily_content(user_session, target_date)
        
        # Generate AI-powered personalized content
        profile_dict = profile.dict()
        ai_response = await self.ai_service.generate_daily_content(
            profile_dict, user_session, target_date, focus_area
        )
        
        if not ai_response["success"]:
            return await self._generate_basic_daily_content(user_session, target_date)
        
        # Create DailyContent object
        content_data = ai_response["content"]
        daily_content = DailyContent(
            user_session=user_session,
            date=target_date,
            horoscope=content_data["horoscope"],
            mantra=content_data["mantra"],
            micro_routine=content_data["micro_routine"],
            meditation=content_data["meditation"],
            profile_based=True
        )
        
        # Save to database
        await self.save_daily_content(daily_content)
        
        return {
            "success": True,
            "content": daily_content,
            "personalization_level": ai_response.get("personalization_level", "high")
        }
    
    async def get_daily_content(self, user_session: str, target_date: str) -> Optional[DailyContent]:
        """Retrieve daily content for specific date"""
        doc = await self.db.daily_content.find_one({
            "user_session": user_session,
            "date": target_date
        })
        if doc:
            doc['id'] = str(doc['_id'])
            del doc['_id']
            return DailyContent(**doc)
        return None
    
    async def save_daily_content(self, content: DailyContent) -> bool:
        """Save daily content to database"""
        try:
            content_dict = content.dict()
            content_dict['_id'] = content_dict.pop('id')
            await self.db.daily_content.insert_one(content_dict)
            return True
        except Exception as e:
            print(f"Error saving daily content: {str(e)}")
            return False
    
    async def _generate_basic_daily_content(self, user_session: str, target_date: str) -> Dict[str, Any]:
        """Generate basic daily content without personalization"""
        basic_content = DailyContent(
            user_session=user_session,
            date=target_date,
            horoscope="Today brings opportunities for growth and self-reflection. Trust in your abilities and stay open to new experiences.",
            mantra="I am capable of positive change and growth.",
            micro_routine={
                "name": "Mindful Breathing",
                "duration": "3 minutes",
                "description": "A simple breathing practice to center yourself",
                "steps": [
                    "Find a comfortable seated position",
                    "Close your eyes gently",
                    "Breathe in slowly for 4 counts",
                    "Hold for 2 counts",
                    "Exhale slowly for 6 counts",
                    "Repeat 8 times"
                ]
            },
            meditation={
                "title": "Daily Centering Meditation",
                "duration": "5 minutes",
                "script": "Begin by finding your comfortable position... Take three deep breaths... Allow your mind to settle... Focus on the present moment... You are exactly where you need to be..."
            },
            profile_based=False
        )
        
        await self.save_daily_content(basic_content)
        
        return {
            "success": True,
            "content": basic_content,
            "personalization_level": "low"
        }
    
    def _calculate_completion_percentage(self, completed_tests: List[str]) -> float:
        """Calculate profile completion percentage"""
        total_tests = 4  # mbti, enneagram, disc, humanDesign
        return (len(completed_tests) / total_tests) * 100
    
    def _get_missing_tests(self, completed_tests: List[str]) -> List[str]:
        """Get list of tests not yet completed"""
        all_tests = ["mbti", "enneagram", "disc", "humanDesign"]
        return [test for test in all_tests if test not in completed_tests]
    
    async def get_user_stats(self, user_session: str) -> Dict[str, Any]:
        """Get user statistics"""
        test_count = await self.db.test_results.count_documents({"user_session": user_session})
        profile = await self.get_unified_profile(user_session)
        
        # Get last activity from most recent test or profile generation
        last_test = await self.db.test_results.find_one(
            {"user_session": user_session}, 
            sort=[("completed_at", -1)]
        )
        
        last_activity = None
        if last_test:
            last_activity = last_test["completed_at"]
        elif profile:
            last_activity = profile.generated_at
        else:
            last_activity = datetime.utcnow()
        
        return {
            "tests_completed": test_count,
            "profile_confidence": profile.confidence if profile else 0.0,
            "days_active": 1,  # Simplified - could track actual usage
            "meditations_completed": 0,  # Would need tracking
            "last_activity": last_activity
        }
    
    async def export_user_data(self, user_session: str) -> Dict[str, Any]:
        """Export all user data"""
        test_results = await self.get_user_test_results(user_session)
        profile = await self.get_unified_profile(user_session)
        
        # Get daily content history
        cursor = self.db.daily_content.find({"user_session": user_session})
        daily_content = []
        async for doc in cursor:
            doc['id'] = str(doc['_id'])
            del doc['_id']
            daily_content.append(DailyContent(**doc))
        
        return {
            "user_session": user_session,
            "test_results": [result.dict() for result in test_results],
            "unified_profile": profile.dict() if profile else None,
            "daily_content_history": [content.dict() for content in daily_content],
            "export_date": datetime.utcnow().isoformat()
        }
    
    async def delete_user_data(self, user_session: str) -> bool:
        """Delete all data for a user session"""
        try:
            await self.db.test_results.delete_many({"user_session": user_session})
            await self.db.unified_profiles.delete_many({"user_session": user_session})
            await self.db.daily_content.delete_many({"user_session": user_session})
            return True
        except Exception as e:
            print(f"Error deleting user data: {str(e)}")
            return False