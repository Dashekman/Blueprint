from typing import List, Dict, Any, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from emergentintegrations.llm.chat import LlmChat, UserMessage
from models import ChatMessage, ChatRequest, ChatResponse, TestResult, UnifiedProfile
from services.ai_service import AIService
import json
import os
from dotenv import load_dotenv

load_dotenv()

class ChatService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.ai_service = AIService()
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        
    async def process_chat_message(
        self, 
        user_session: str,
        user_id: Optional[str],
        message: str,
        include_context: bool = True
    ) -> ChatResponse:
        """Process chat message with personality context"""
        
        try:
            # Get user's personality context if requested
            context_data = {}
            context_tests = []
            
            if include_context:
                context_data = await self._get_user_context(user_session, user_id)
                context_tests = list(context_data.keys())
            
            # Generate AI response
            ai_response = await self._generate_chat_response(
                message, 
                context_data,
                user_session
            )
            
            if not ai_response["success"]:
                return ChatResponse(
                    success=False,
                    message=message,
                    response="I apologize, but I'm having trouble processing your request right now. Please try again later.",
                    confidence=0.0,
                    context_used=[]
                )
            
            # Save chat message
            chat_message = ChatMessage(
                user_session=user_session,
                user_id=user_id,
                message=message,
                response=ai_response["response"],
                context_tests=context_tests,
                ai_model_used="gpt-4o-mini"
            )
            
            await self._save_chat_message(chat_message)
            
            return ChatResponse(
                success=True,
                message=message,
                response=ai_response["response"],
                confidence=ai_response.get("confidence", 0.8),
                context_used=context_tests
            )
            
        except Exception as e:
            return ChatResponse(
                success=False,
                message=message,
                response=f"I encountered an error: {str(e)}",
                confidence=0.0,
                context_used=[]
            )
    
    async def _get_user_context(self, user_session: str, user_id: Optional[str]) -> Dict[str, Any]:
        """Get user's personality context from completed tests and profile"""
        
        context = {}
        
        try:
            # Get test results
            query = {"user_session": user_session}
            if user_id:
                query["user_id"] = user_id
                
            test_cursor = self.db.test_results.find(query)
            test_results = await test_cursor.to_list(length=100)
            
            for result in test_results:
                context[result["test_id"]] = {
                    "type": result["result_type"],
                    "confidence": result["confidence"],
                    "completed_at": result["completed_at"],
                    "key_insights": result.get("ai_analysis", "")
                }
            
            # Get unified profile if available
            profile_doc = await self.db.unified_profiles.find_one(query)
            if profile_doc:
                context["unified_profile"] = {
                    "strengths": profile_doc.get("strengths", []),
                    "challenges": profile_doc.get("challenges", []),
                    "communication_style": profile_doc.get("communication_style", ""),
                    "motivation_levers": profile_doc.get("motivation_levers", ""),
                    "superhuman_qualities": profile_doc.get("superhuman_qualities", []),
                    "confidence": profile_doc.get("confidence", 0.0)
                }
            
            return context
            
        except Exception as e:
            print(f"Error getting user context: {str(e)}")
            return {}
    
    async def _generate_chat_response(
        self, 
        message: str, 
        context: Dict[str, Any],
        user_session: str
    ) -> Dict[str, Any]:
        """Generate AI chat response with personality context"""
        
        system_message = """You are an expert personality coach and consultant with deep knowledge of psychology, personality systems (MBTI, Enneagram, DISC, Human Design), and human development.

Your role is to provide personalized guidance, answer questions, and help users understand themselves better based on their personality assessment results.

GUIDELINES:
- Use the user's test results and profile to provide personalized advice
- Be supportive, insightful, and encouraging
- Reference their specific personality traits when relevant
- Provide actionable advice they can implement
- Ask clarifying questions when needed
- Maintain a balance of professionalism and warmth
- Focus on growth, self-awareness, and practical application
- If no context is available, provide general but helpful guidance

PERSONALITY CONTEXT AVAILABLE:
{context}

Always provide helpful, personalized responses that help the user grow and understand themselves better."""

        # Prepare context summary for the prompt
        context_summary = "No personality data available yet."
        if context:
            context_summary = f"User has completed: {', '.join(context.keys())}"
            if 'unified_profile' in context:
                profile = context['unified_profile']
                context_summary += f"\n\nKey traits: {', '.join(profile.get('strengths', [])[:3])}"
                context_summary += f"\nCommunication style: {profile.get('communication_style', 'Unknown')}"
                context_summary += f"\nMotivation: {profile.get('motivation_levers', 'Unknown')}"
        
        prompt = f"""The user asks: "{message}"

CONTEXT: {context_summary}

Provide a helpful, personalized response that:
1. Addresses their specific question or concern
2. References their personality traits when relevant  
3. Offers practical, actionable advice
4. Encourages their growth and self-discovery journey
5. Maintains an encouraging and supportive tone

Keep responses conversational but insightful, typically 2-4 paragraphs."""

        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"chat_{user_session}",
                system_message=system_message.format(context=context_summary)
            ).with_model("openai", "gpt-4o-mini")
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            return {
                "success": True,
                "response": response.strip(),
                "confidence": 0.85 if context else 0.7
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Chat generation failed: {str(e)}"
            }
    
    async def _save_chat_message(self, chat_message: ChatMessage):
        """Save chat message to database"""
        
        try:
            await self.db.chat_messages.insert_one(chat_message.dict())
        except Exception as e:
            print(f"Error saving chat message: {str(e)}")
    
    async def get_chat_history(
        self, 
        user_session: str,
        user_id: Optional[str] = None,
        limit: int = 50
    ) -> List[ChatMessage]:
        """Get chat history for user"""
        
        try:
            query = {"user_session": user_session}
            if user_id:
                query["user_id"] = user_id
            
            cursor = self.db.chat_messages.find(query).sort("timestamp", -1).limit(limit)
            messages = await cursor.to_list(length=limit)
            
            # Convert to ChatMessage objects and reverse for chronological order
            chat_messages = [ChatMessage(**msg) for msg in reversed(messages)]
            return chat_messages
            
        except Exception as e:
            print(f"Error getting chat history: {str(e)}")
            return []
    
    async def delete_chat_history(self, user_session: str, user_id: Optional[str] = None) -> bool:
        """Delete all chat history for user"""
        
        try:
            query = {"user_session": user_session}
            if user_id:
                query["user_id"] = user_id
                
            result = await self.db.chat_messages.delete_many(query)
            return result.deleted_count > 0
            
        except Exception as e:
            print(f"Error deleting chat history: {str(e)}")
            return False