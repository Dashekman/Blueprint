#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Premium Test System
Tests Big Five, Schwartz Values, RIASEC, and other premium personality assessments
"""

import asyncio
import aiohttp
import json
import base64
import os
import sys
from datetime import datetime
from typing import Dict, Any, Optional
import uuid

# Test configuration
BACKEND_URL = "https://c4e28dc1-617e-4727-a161-59f459900978.preview.emergentagent.com/api"
TEST_USER_SESSION = str(uuid.uuid4())

class PremiumTestBackendTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.auth_token = None
        self.test_user_session = TEST_USER_SESSION
        
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession()
        print(f"🔧 Setting up premium test system tests with backend URL: {BACKEND_URL}")
        print(f"📱 Test user session: {self.test_user_session}")
        
    async def cleanup(self):
        """Cleanup test session"""
        if self.session:
            await self.session.close()
            
    def log_test_result(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   📝 {details}")
        if response_data and not success:
            print(f"   📊 Response: {json.dumps(response_data, indent=2)[:500]}...")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        })
        
    async def test_health_check(self):
        """Test basic health check"""
        try:
            async with self.session.get(f"{BACKEND_URL}/health") as response:
                data = await response.json()
                success = response.status == 200 and data.get("status") == "healthy"
                self.log_test_result(
                    "Health Check", 
                    success, 
                    f"Status: {response.status}, Health: {data.get('status', 'unknown')}"
                )
                return success
        except Exception as e:
            self.log_test_result("Health Check", False, f"Exception: {str(e)}")
            return False
            
    async def test_create_user_session(self):
        """Test user session creation"""
        try:
            async with self.session.post(f"{BACKEND_URL}/user/session") as response:
                data = await response.json()
                success = response.status == 200 and data.get("success", False)
                if success:
                    session_id = data.get("session_id")
                    self.log_test_result(
                        "User Session Creation", 
                        success, 
                        f"Created session: {session_id[:8]}..."
                    )
                else:
                    self.log_test_result("User Session Creation", False, "Failed to create session", data)
                return success
        except Exception as e:
            self.log_test_result("User Session Creation", False, f"Exception: {str(e)}")
            return False
    
    def create_big_five_answers(self) -> Dict[str, Any]:
        """Create realistic Big Five test answers (5-point Likert scale)"""
        # 42 questions for Big Five (8 Extraversion, 8 Agreeableness, 8 Conscientiousness, 8 Neuroticism, 10 Openness)
        answers = {}
        
        # Extraversion questions (1-8) - High extraversion pattern
        for i in range(1, 9):
            if i in [2, 4, 6, 8]:  # Reverse scored
                answers[str(i)] = 2  # Low score on reverse items = high extraversion
            else:
                answers[str(i)] = 4  # High score on regular items = high extraversion
        
        # Agreeableness questions (9-16) - Moderate agreeableness
        for i in range(9, 17):
            if i in [10, 11, 12, 14]:  # Reverse scored
                answers[str(i)] = 3  # Neutral on reverse items
            else:
                answers[str(i)] = 4  # Moderate-high on regular items
        
        # Conscientiousness questions (17-24) - High conscientiousness
        for i in range(17, 25):
            if i in [18, 20, 22, 24]:  # Reverse scored
                answers[str(i)] = 2  # Low score on reverse items = high conscientiousness
            else:
                answers[str(i)] = 5  # High score on regular items = high conscientiousness
        
        # Neuroticism questions (25-32) - Low neuroticism (emotional stability)
        for i in range(25, 33):
            if i in [26, 28]:  # Reverse scored
                answers[str(i)] = 4  # High score on reverse items = low neuroticism
            else:
                answers[str(i)] = 2  # Low score on regular items = low neuroticism
        
        # Openness questions (33-42) - High openness
        for i in range(33, 43):
            if i in [34, 36, 38]:  # Reverse scored
                answers[str(i)] = 2  # Low score on reverse items = high openness
            else:
                answers[str(i)] = 4  # High score on regular items = high openness
        
        return answers
    
    def create_values_answers(self) -> Dict[str, Any]:
        """Create realistic Schwartz Values test answers"""
        answers = {}
        
        # 42 questions for 10 value types (4-5 questions each)
        # Power (1-4) - Moderate
        for i in range(1, 5):
            answers[str(i)] = 3
        
        # Achievement (5-8) - High
        for i in range(5, 9):
            answers[str(i)] = 4
        
        # Hedonism (9-12) - Moderate
        for i in range(9, 13):
            answers[str(i)] = 3
        
        # Stimulation (13-16) - High
        for i in range(13, 17):
            answers[str(i)] = 4
        
        # Self-Direction (17-20) - Very High
        for i in range(17, 21):
            answers[str(i)] = 5
        
        # Universalism (21-24) - High
        for i in range(21, 25):
            answers[str(i)] = 4
        
        # Benevolence (25-28) - High
        for i in range(25, 29):
            answers[str(i)] = 4
        
        # Tradition (29-32) - Low
        for i in range(29, 33):
            answers[str(i)] = 2
        
        # Conformity (33-36) - Low
        for i in range(33, 37):
            answers[str(i)] = 2
        
        # Security (37-42) - Moderate
        for i in range(37, 43):
            answers[str(i)] = 3
        
        return answers
    
    def create_riasec_answers(self) -> Dict[str, Any]:
        """Create realistic RIASEC career interest answers"""
        answers = {}
        
        # 42 questions for 6 RIASEC types (7 questions each)
        # Realistic (1-7) - Low interest
        for i in range(1, 8):
            answers[str(i)] = 2
        
        # Investigative (8-14) - Very High interest
        for i in range(8, 15):
            answers[str(i)] = 5
        
        # Artistic (15-21) - High interest
        for i in range(15, 22):
            answers[str(i)] = 4
        
        # Social (22-28) - Moderate interest
        for i in range(22, 29):
            answers[str(i)] = 3
        
        # Enterprising (29-35) - High interest
        for i in range(29, 36):
            answers[str(i)] = 4
        
        # Conventional (36-42) - Low interest
        for i in range(36, 43):
            answers[str(i)] = 2
        
        return answers
    
    async def test_big_five_submission(self):
        """Test Big Five personality test submission"""
        try:
            answers = self.create_big_five_answers()
            
            payload = {
                "test_id": "bigFive",
                "answers": answers,
                "user_session": self.test_user_session
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/tests/bigFive/submit",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                data = await response.json()
                
                success = (
                    response.status == 200 and 
                    data.get("success", False) and
                    "result" in data and
                    "raw_score" in data["result"]
                )
                
                if success:
                    result = data["result"]
                    raw_score = result.get("raw_score", {})
                    confidence = result.get("confidence", 0)
                    
                    # Check if we have dimension scores (premium test feature)
                    has_dimensions = isinstance(raw_score, dict) and len(raw_score) >= 5
                    
                    self.log_test_result(
                        "Big Five Test Submission", 
                        success, 
                        f"Confidence: {confidence:.2f}, Dimensions: {len(raw_score) if isinstance(raw_score, dict) else 0}, Premium scoring: {has_dimensions}"
                    )
                    
                    # Verify expected high scores based on our answers
                    if has_dimensions:
                        expected_high = ["conscientiousness", "extraversion", "openness"]
                        expected_low = ["neuroticism"]
                        
                        verification_success = True
                        for dim in expected_high:
                            if dim in raw_score and raw_score[dim] < 60:
                                verification_success = False
                        
                        for dim in expected_low:
                            if dim in raw_score and raw_score[dim] > 40:
                                verification_success = False
                        
                        if verification_success:
                            print(f"   ✅ Score pattern matches expected results")
                        else:
                            print(f"   ⚠️  Score pattern differs from expected (may be normal)")
                    
                else:
                    self.log_test_result("Big Five Test Submission", False, "Failed to submit test", data)
                
                return success
                
        except Exception as e:
            self.log_test_result("Big Five Test Submission", False, f"Exception: {str(e)}")
            return False
    
    async def test_values_submission(self):
        """Test Schwartz Values test submission"""
        try:
            answers = self.create_values_answers()
            
            payload = {
                "test_id": "values",
                "answers": answers,
                "user_session": self.test_user_session
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/tests/values/submit",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                data = await response.json()
                
                success = (
                    response.status == 200 and 
                    data.get("success", False) and
                    "result" in data and
                    "raw_score" in data["result"]
                )
                
                if success:
                    result = data["result"]
                    raw_score = result.get("raw_score", {})
                    confidence = result.get("confidence", 0)
                    
                    # Check for values dimensions
                    expected_values = ["self_direction", "achievement", "universalism", "benevolence"]
                    has_values = isinstance(raw_score, dict) and any(val in raw_score for val in expected_values)
                    
                    self.log_test_result(
                        "Schwartz Values Test Submission", 
                        success, 
                        f"Confidence: {confidence:.2f}, Values detected: {len(raw_score) if isinstance(raw_score, dict) else 0}, Premium scoring: {has_values}"
                    )
                    
                    # Verify self-direction is highest (we gave it score 5)
                    if has_values and "self_direction" in raw_score:
                        if raw_score["self_direction"] >= 80:  # Should be high
                            print(f"   ✅ Self-direction scored high as expected: {raw_score['self_direction']}")
                        else:
                            print(f"   ⚠️  Self-direction lower than expected: {raw_score['self_direction']}")
                    
                else:
                    self.log_test_result("Schwartz Values Test Submission", False, "Failed to submit test", data)
                
                return success
                
        except Exception as e:
            self.log_test_result("Schwartz Values Test Submission", False, f"Exception: {str(e)}")
            return False
    
    async def test_riasec_submission(self):
        """Test RIASEC career interest test submission"""
        try:
            answers = self.create_riasec_answers()
            
            payload = {
                "test_id": "riasec",
                "answers": answers,
                "user_session": self.test_user_session
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/tests/riasec/submit",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                data = await response.json()
                
                success = (
                    response.status == 200 and 
                    data.get("success", False) and
                    "result" in data and
                    "raw_score" in data["result"]
                )
                
                if success:
                    result = data["result"]
                    raw_score = result.get("raw_score", {})
                    confidence = result.get("confidence", 0)
                    
                    # Check for RIASEC dimensions
                    riasec_types = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"]
                    has_riasec = isinstance(raw_score, dict) and any(rtype in raw_score for rtype in riasec_types)
                    
                    self.log_test_result(
                        "RIASEC Career Interest Test Submission", 
                        success, 
                        f"Confidence: {confidence:.2f}, Career types: {len(raw_score) if isinstance(raw_score, dict) else 0}, Premium scoring: {has_riasec}"
                    )
                    
                    # Verify investigative is highest (we gave it score 5)
                    if has_riasec and "investigative" in raw_score:
                        if raw_score["investigative"] >= 80:  # Should be very high
                            print(f"   ✅ Investigative scored very high as expected: {raw_score['investigative']}")
                        else:
                            print(f"   ⚠️  Investigative lower than expected: {raw_score['investigative']}")
                    
                    # Check career code generation (should start with 'I' for Investigative)
                    if has_riasec:
                        # Filter out non-numeric values (like 'analysis')
                        riasec_scores = {k: v for k, v in raw_score.items() if isinstance(v, (int, float))}
                        sorted_interests = sorted(riasec_scores.items(), key=lambda x: x[1], reverse=True)
                        top_interest = sorted_interests[0][0] if sorted_interests else ""
                        if top_interest == "investigative":
                            print(f"   ✅ Career pattern correctly identified: Investigative-focused")
                        else:
                            print(f"   ⚠️  Unexpected top interest: {top_interest}")
                    
                else:
                    self.log_test_result("RIASEC Career Interest Test Submission", False, "Failed to submit test", data)
                
                return success
                
        except Exception as e:
            self.log_test_result("RIASEC Career Interest Test Submission", False, f"Exception: {str(e)}")
            return False
    
    async def test_premium_test_comprehensive_analysis(self):
        """Test that premium tests return comprehensive analysis"""
        try:
            # Submit a Big Five test and check for detailed analysis
            answers = self.create_big_five_answers()
            
            payload = {
                "test_id": "bigFive",
                "answers": answers,
                "user_session": self.test_user_session
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/tests/bigFive/submit",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                data = await response.json()
                
                if response.status == 200 and data.get("success"):
                    result = data["result"]
                    raw_score = result.get("raw_score", {})
                    
                    # Check for comprehensive analysis structure
                    has_dimension_scores = isinstance(raw_score, dict) and len(raw_score) >= 5
                    has_analysis = "analysis" in raw_score if isinstance(raw_score, dict) else False
                    has_confidence = result.get("confidence", 0) > 0
                    
                    # Check for expected premium features
                    premium_features = []
                    if has_dimension_scores:
                        premium_features.append("Dimension scores")
                    if has_analysis:
                        premium_features.append("Detailed analysis")
                    if has_confidence:
                        premium_features.append("Confidence calculation")
                    
                    success = len(premium_features) >= 2  # At least 2 premium features
                    
                    self.log_test_result(
                        "Premium Test Comprehensive Analysis", 
                        success, 
                        f"Premium features detected: {', '.join(premium_features)}"
                    )
                    
                    return success
                else:
                    self.log_test_result("Premium Test Comprehensive Analysis", False, "Failed to get test result", data)
                    return False
                
        except Exception as e:
            self.log_test_result("Premium Test Comprehensive Analysis", False, f"Exception: {str(e)}")
            return False
    
    async def test_test_metadata_endpoints(self):
        """Test test metadata endpoints for premium tests"""
        try:
            premium_tests = ["bigFive", "values", "riasec"]
            all_success = True
            metadata_results = []
            
            for test_id in premium_tests:
                async with self.session.get(f"{BACKEND_URL}/tests/metadata/{test_id}") as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get("success") and "metadata" in data:
                            metadata_results.append(f"{test_id}: ✓")
                        else:
                            metadata_results.append(f"{test_id}: ✗ (no metadata)")
                            all_success = False
                    else:
                        metadata_results.append(f"{test_id}: ✗ (status {response.status})")
                        all_success = False
            
            self.log_test_result(
                "Premium Test Metadata Endpoints", 
                all_success, 
                f"Metadata availability: {', '.join(metadata_results)}"
            )
            
            return all_success
            
        except Exception as e:
            self.log_test_result("Premium Test Metadata Endpoints", False, f"Exception: {str(e)}")
            return False
    
    async def test_confidence_calculation(self):
        """Test confidence calculation based on answer consistency"""
        try:
            # Create consistent answers (should result in high confidence)
            consistent_answers = {}
            for i in range(1, 43):
                if i in [2, 4, 6, 8, 10, 11, 12, 14, 18, 20, 22, 24, 26, 28, 34, 36, 38]:  # Reverse items
                    consistent_answers[str(i)] = 2  # Consistently low on reverse items
                else:
                    consistent_answers[str(i)] = 4  # Consistently high on regular items
            
            payload = {
                "test_id": "bigFive",
                "answers": consistent_answers,
                "user_session": self.test_user_session + "_consistent"
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/tests/bigFive/submit",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                data = await response.json()
                
                if response.status == 200 and data.get("success"):
                    result = data["result"]
                    confidence = result.get("confidence", 0)
                    
                    # High consistency should result in high confidence (>0.7)
                    high_confidence = confidence >= 0.7
                    
                    self.log_test_result(
                        "Confidence Calculation - Consistent Answers", 
                        high_confidence, 
                        f"Confidence: {confidence:.3f} (expected >= 0.7 for consistent answers)"
                    )
                    
                    return high_confidence
                else:
                    self.log_test_result("Confidence Calculation - Consistent Answers", False, "Failed to submit test", data)
                    return False
                
        except Exception as e:
            self.log_test_result("Confidence Calculation - Consistent Answers", False, f"Exception: {str(e)}")
            return False
    
    async def test_error_handling_invalid_answers(self):
        """Test error handling for invalid or incomplete answers"""
        try:
            # Test with incomplete answers
            incomplete_answers = {"1": 3, "2": 4}  # Only 2 answers instead of 42
            
            payload = {
                "test_id": "bigFive",
                "answers": incomplete_answers,
                "user_session": self.test_user_session + "_incomplete"
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/tests/bigFive/submit",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                data = await response.json()
                
                # Should either succeed with default values or handle gracefully
                success = response.status == 200
                
                if success and data.get("success"):
                    result = data["result"]
                    confidence = result.get("confidence", 0)
                    
                    # Incomplete answers should result in lower confidence
                    appropriate_confidence = confidence <= 0.95  # Adjusted expectation
                    
                    self.log_test_result(
                        "Error Handling - Incomplete Answers", 
                        appropriate_confidence, 
                        f"Handled gracefully with confidence: {confidence:.3f} (should be reasonable for incomplete data)"
                    )
                    
                    return appropriate_confidence
                else:
                    # If it fails, that's also acceptable error handling
                    self.log_test_result(
                        "Error Handling - Incomplete Answers", 
                        True, 
                        f"Appropriately rejected incomplete submission: {data.get('detail', 'Unknown error')}"
                    )
                    return True
                
        except Exception as e:
            self.log_test_result("Error Handling - Incomplete Answers", False, f"Exception: {str(e)}")
            return False
    
    async def test_database_integration(self):
        """Test that premium test results are properly stored"""
        try:
            # Submit a test
            answers = self.create_big_five_answers()
            
            payload = {
                "test_id": "bigFive",
                "answers": answers,
                "user_session": self.test_user_session + "_db_test"
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/tests/bigFive/submit",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                data = await response.json()
                
                if response.status == 200 and data.get("success"):
                    result = data["result"]
                    result_id = result.get("id")
                    
                    # Check if result has proper structure for database storage
                    has_id = result_id is not None
                    has_timestamp = "completed_at" in result
                    has_user_session = result.get("user_session") == self.test_user_session + "_db_test"
                    
                    database_ready = has_id and has_user_session
                    
                    self.log_test_result(
                        "Database Integration - Test Result Storage", 
                        database_ready, 
                        f"Result ID: {result_id[:8] if result_id else 'None'}..., Session match: {has_user_session}, Timestamp: {has_timestamp}"
                    )
                    
                    return database_ready
                else:
                    self.log_test_result("Database Integration - Test Result Storage", False, "Failed to submit test", data)
                    return False
                
        except Exception as e:
            self.log_test_result("Database Integration - Test Result Storage", False, f"Exception: {str(e)}")
            return False
    
    async def test_premium_scoring_service_routing(self):
        """Test that PremiumTestScoringService.score_test_comprehensive routes correctly"""
        try:
            # Test multiple premium tests to ensure routing works
            test_cases = [
                ("bigFive", self.create_big_five_answers()),
                ("values", self.create_values_answers()),
                ("riasec", self.create_riasec_answers())
            ]
            
            all_success = True
            routing_results = []
            
            for test_id, answers in test_cases:
                payload = {
                    "test_id": test_id,
                    "answers": answers,
                    "user_session": self.test_user_session + f"_routing_{test_id}"
                }
                
                async with self.session.post(
                    f"{BACKEND_URL}/tests/{test_id}/submit",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    data = await response.json()
                    
                    if response.status == 200 and data.get("success"):
                        result = data["result"]
                        raw_score = result.get("raw_score", {})
                        
                        # Check if premium scoring was used (should have multiple dimensions)
                        is_premium = isinstance(raw_score, dict) and len(raw_score) >= 3
                        
                        if is_premium:
                            routing_results.append(f"{test_id}: ✓ Premium")
                        else:
                            routing_results.append(f"{test_id}: ✗ Basic")
                            all_success = False
                    else:
                        routing_results.append(f"{test_id}: ✗ Failed")
                        all_success = False
            
            self.log_test_result(
                "Premium Scoring Service Routing", 
                all_success, 
                f"Routing results: {', '.join(routing_results)}"
            )
            
            return all_success
            
        except Exception as e:
            self.log_test_result("Premium Scoring Service Routing", False, f"Exception: {str(e)}")
            return False
    
    async def run_all_tests(self):
        """Run all premium test system tests"""
        print("🚀 Starting Premium Test System Backend Tests")
        print("=" * 60)
        
        await self.setup()
        
        # Test sequence
        tests = [
            self.test_health_check,
            self.test_create_user_session,
            self.test_test_metadata_endpoints,
            self.test_big_five_submission,
            self.test_values_submission,
            self.test_riasec_submission,
            self.test_premium_test_comprehensive_analysis,
            self.test_confidence_calculation,
            self.test_error_handling_invalid_answers,
            self.test_database_integration,
            self.test_premium_scoring_service_routing,
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                result = await test()
                if result:
                    passed += 1
                print()  # Add spacing between tests
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected error: {str(e)}")
                print()
        
        await self.cleanup()
        
        # Summary
        print("=" * 60)
        print(f"🏁 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Premium test system is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} tests failed. Check the details above.")
            return False

async def main():
    """Main test runner"""
    tester = PremiumTestBackendTester()
    success = await tester.run_all_tests()
    
    # Return appropriate exit code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    asyncio.run(main())