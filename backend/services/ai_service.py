import os
import json
import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
            
    def _create_chat(self, session_id: str, system_message: str) -> LlmChat:
        """Create a new LLM chat instance"""
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=system_message
        )
        # Using gpt-4o-mini as default model
        return chat.with_model("openai", "gpt-4o-mini")
    
    async def synthesize_personality_profile(
        self, 
        test_results: List[Dict], 
        user_session: str,
        user_goals: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate unified personality profile from multiple test results"""
        
        system_message = """You are a careful, transparent AI personality coach specializing in synthesizing multiple personality assessments into actionable insights.

CONSTRAINTS:
- Separate evidence-based items from esoteric/entertainment items with labels
- Provide specific, practical guidance (work, study, relationships, daily habits)
- Include confidence levels and attributions for all insights
- Avoid health/diagnosis claims
- Be concise: focus on what the user can try today and this week
- Output valid JSON matching the required schema

CONFIDENCE SCORING:
- 0.9-1.0: High confidence (3+ tests, consistent patterns)
- 0.7-0.89: Medium confidence (2+ tests, some consistency)
- 0.5-0.69: Low confidence (limited data, mixed signals)
- Below 0.5: Insufficient data

Always include source attribution for each insight."""

        # Prepare test data summary
        test_summary = []
        for result in test_results:
            test_info = {
                "test_type": result.get("test_id"),
                "result": result.get("result_type"),
                "confidence": result.get("confidence", 0.7),
                "key_traits": result.get("raw_score", {})
            }
            test_summary.append(test_info)
        
        user_context = f"User goals/context: {user_goals}" if user_goals else "No specific user goals provided."
        
        prompt = f"""Synthesize the following personality test results into a comprehensive profile:

TEST RESULTS:
{json.dumps(test_summary, indent=2)}

USER CONTEXT:
{user_context}

Generate a JSON response with this exact structure:
{{
    "strengths": ["list of 4-6 key strengths with specific examples"],
    "challenges": ["list of 3-5 growth areas with actionable advice"],
    "communication_style": "detailed description of how they communicate and interact",
    "career_guidance": "specific career advice with concrete next steps",
    "study_tactics": "learning style recommendations with practical techniques",
    "motivation_levers": "what drives them with specific strategies",
    "relationship_tips": "interpersonal advice with actionable steps",
    "daily_micro_coaching": "one specific action they can take today",
    "confidence": 0.85,
    "reasoning_summary": "brief explanation of how insights were derived and which tests contributed",
    "ai_model_used": "gpt-4o-mini"
}}

Ensure all advice is practical, specific, and actionable. Include confidence levels based on consistency across tests."""

        try:
            chat = self._create_chat(f"profile_synthesis_{user_session}", system_message)
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse JSON response
            profile_data = json.loads(response.strip())
            
            # Remove source_tests if present (we'll set it separately)
            if 'source_tests' in profile_data:
                del profile_data['source_tests']
            
            return {
                "success": True,
                "profile": profile_data,
                "generation_time": datetime.utcnow().isoformat()
            }
            
        except json.JSONDecodeError as e:
            return {
                "success": False,
                "error": f"Failed to parse AI response as JSON: {str(e)}",
                "fallback_used": True
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"AI generation failed: {str(e)}",
                "fallback_used": True
            }
    
    async def generate_daily_content(
        self, 
        profile: Dict[str, Any], 
        user_session: str,
        date: str,
        focus_area: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate personalized daily content"""
        
        system_message = """You are an AI wellness coach creating personalized daily content based on personality profiles.

GUIDELINES:
- Generate content that matches the user's personality type and preferences
- Keep horoscopes light and practical (clearly marked as entertainment)
- Create actionable micro-routines (3-7 minutes)
- Design meditation scripts that align with their communication style
- Focus on practical guidance they can use today

Output valid JSON in the specified format."""

        # Extract key personality traits for personalization
        personality_summary = {
            "strengths": profile.get("strengths", [])[:3],
            "communication_style": profile.get("communication_style", ""),
            "current_challenges": profile.get("challenges", [])[:2],
            "motivation_style": profile.get("motivation_levers", "")
        }
        
        focus_context = f"Special focus area: {focus_area}" if focus_area else ""
        
        prompt = f"""Create personalized daily content for {date} based on this personality profile:

PERSONALITY PROFILE:
{json.dumps(personality_summary, indent=2)}

{focus_context}

Generate JSON with this exact structure:
{{
    "horoscope": "70-120 words of supportive, practical guidance (marked as entertainment)",
    "mantra": "personalized affirmation matching their communication style",
    "micro_routine": {{
        "name": "descriptive name for the 3-7 minute practice",
        "duration": "X minutes",
        "description": "brief explanation of benefits",
        "steps": ["step 1", "step 2", "step 3", "step 4", "step 5"]
    }},
    "meditation": {{
        "title": "meditation name tailored to their personality",
        "duration": "5-8 minutes",
        "script": "complete guided meditation script (200-300 words) with timing cues and pauses. Match their communication style and current needs."
    }}
}}

Make all content personally relevant and actionable for today."""

        try:
            chat = self._create_chat(f"daily_content_{user_session}_{date}", system_message)
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse JSON response
            daily_data = json.loads(response.strip())
            
            return {
                "success": True,
                "content": daily_data,
                "personalization_level": "high" if len(profile.get("source_tests", [])) >= 2 else "medium",
                "generation_time": datetime.utcnow().isoformat()
            }
            
        except json.JSONDecodeError as e:
            return {
                "success": False,
                "error": f"Failed to parse daily content JSON: {str(e)}",
                "fallback_used": True
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Daily content generation failed: {str(e)}",
                "fallback_used": True
            }
    
    async def generate_custom_meditation(
        self,
        profile: Dict[str, Any],
        user_session: str,
        focus_area: str,
        duration_minutes: int = 7
    ) -> Dict[str, Any]:
        """Generate custom meditation script"""
        
        system_message = """You are an expert meditation guide creating personalized guided meditations.

GUIDELINES:
- Tailor language and pacing to the user's personality
- Include specific techniques that match their learning style
- Provide clear timing cues and natural pauses
- Make content relevant to their focus area
- Keep scripts calm, supportive, and non-judgmental

Output a complete meditation script with timing markers."""

        communication_style = profile.get("communication_style", "balanced and thoughtful")
        strengths = profile.get("strengths", [])[:2]
        
        prompt = f"""Create a {duration_minutes}-minute guided meditation script for:

FOCUS AREA: {focus_area}
COMMUNICATION STYLE: {communication_style}
KEY STRENGTHS: {strengths}

The meditation should:
1. Match their communication preferences
2. Build on their existing strengths
3. Address the specific focus area
4. Include timing cues for a {duration_minutes}-minute session

Generate JSON:
{{
    "title": "specific title for this meditation",
    "duration": "{duration_minutes} minutes",
    "script": "complete meditation script with [pause] markers and timing cues",
    "techniques_used": ["list of meditation techniques included"],
    "personality_adaptations": "how this was tailored to their profile"
}}

Make the script ready for immediate use with clear guidance throughout."""

        try:
            chat = self._create_chat(f"meditation_{user_session}_{focus_area}", system_message)
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            meditation_data = json.loads(response.strip())
            
            return {
                "success": True,
                "meditation": meditation_data,
                "generation_time": datetime.utcnow().isoformat()
            }
            
        except json.JSONDecodeError as e:
            return {
                "success": False,
                "error": f"Failed to parse meditation JSON: {str(e)}",
                "fallback_used": True
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Meditation generation failed: {str(e)}",
                "fallback_used": True
            }

    async def analyze_test_result(
        self,
        test_id: str,
        answers: Dict[str, Any],
        raw_score: Dict[str, Any],
        result_type: str
    ) -> Dict[str, Any]:
        """Generate AI-powered analysis of individual test results"""
        
        system_message = """You are a personality assessment expert providing insights on individual test results.

GUIDELINES:
- Provide clear, actionable insights based on the specific test
- Explain what the results mean in practical terms
- Suggest concrete next steps
- Include appropriate disclaimers for entertainment-based assessments
- Keep analysis balanced and constructive

Focus on practical applications rather than theoretical descriptions."""

        # Include test-specific context
        test_context = {
            "mbti": "Myers-Briggs Type Indicator - psychological preferences in perception and decision-making",
            "enneagram": "Enneagram - core motivations, fears, and behavioral patterns",
            "disc": "DISC - behavioral styles and communication preferences",
            "humanDesign": "Human Design - energetic blueprint and life strategy (entertainment/spiritual guidance)"
        }
        
        context = test_context.get(test_id, "Personality assessment")
        disclaimer = " (Note: Entertainment/spiritual guidance only)" if test_id == "humanDesign" else ""
        
        prompt = f"""Analyze this {context} result{disclaimer}:

TEST: {test_id}
RESULT TYPE: {result_type}
SCORES: {json.dumps(raw_score, indent=2)}

Provide JSON analysis:
{{
    "insights": "clear explanation of what this result means (150-200 words)",
    "key_implications": ["3-4 main takeaways"],
    "actionable_next_steps": ["3-4 specific actions they can take"],
    "confidence_level": 0.85,
    "source_attribution": "based on {context}",
    "disclaimer": "appropriate disclaimer if needed"
}}

Make insights practical and immediately useful."""

        try:
            chat = self._create_chat(f"test_analysis_{test_id}", system_message)
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            analysis_data = json.loads(response.strip())
            
            return {
                "success": True,
                "analysis": analysis_data,
                "generation_time": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Test analysis failed: {str(e)}",
                "fallback_used": True
            }