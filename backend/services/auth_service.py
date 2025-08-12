import os
import aiohttp
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import User, UserSession, AuthResponse
from fastapi import HTTPException
import uuid

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.emergent_auth_url = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
        
    async def authenticate_session(self, session_id: str) -> AuthResponse:
        """Authenticate user with Emergent OAuth session"""
        
        try:
            # Call Emergent auth API
            headers = {"X-Session-ID": session_id}
            
            async with aiohttp.ClientSession() as client:
                async with client.get(self.emergent_auth_url, headers=headers) as response:
                    if response.status != 200:
                        return AuthResponse(
                            success=False,
                            user=None,
                            session_token=None,
                            message="Invalid session ID or authentication failed"
                        )
                    
                    auth_data = await response.json()
            
            # Extract user data
            user_data = {
                "id": auth_data.get("id"),
                "email": auth_data.get("email"),
                "name": auth_data.get("name"),
                "picture": auth_data.get("picture")
            }
            
            # Check if user exists
            existing_user = await self.db.users.find_one({"email": user_data["email"]})
            
            if existing_user:
                # Update last login
                await self.db.users.update_one(
                    {"email": user_data["email"]},
                    {"$set": {"last_login": datetime.utcnow()}}
                )
                user = User(**existing_user)
            else:
                # Create new user
                user = User(**user_data)
                await self.db.users.insert_one(user.dict())
            
            # Generate session token
            session_token = auth_data.get("session_token") or str(uuid.uuid4())
            expires_at = datetime.utcnow() + timedelta(days=7)
            
            # Store session
            user_session = UserSession(
                user_id=user.id,
                session_token=session_token,
                expires_at=expires_at
            )
            
            # Remove any existing active sessions for this user
            await self.db.user_sessions.update_many(
                {"user_id": user.id},
                {"$set": {"is_active": False}}
            )
            
            # Insert new session
            await self.db.user_sessions.insert_one(user_session.dict())
            
            return AuthResponse(
                success=True,
                user=user,
                session_token=session_token,
                message="Authentication successful"
            )
            
        except Exception as e:
            return AuthResponse(
                success=False,
                user=None,
                session_token=None,
                message=f"Authentication error: {str(e)}"
            )
    
    async def validate_session_token(self, session_token: str) -> Optional[User]:
        """Validate session token and return user if valid"""
        
        try:
            # Find active session
            session_doc = await self.db.user_sessions.find_one({
                "session_token": session_token,
                "is_active": True,
                "expires_at": {"$gt": datetime.utcnow()}
            })
            
            if not session_doc:
                return None
            
            # Get user
            user_doc = await self.db.users.find_one({"id": session_doc["user_id"]})
            if not user_doc:
                return None
            
            return User(**user_doc)
            
        except Exception as e:
            print(f"Session validation error: {str(e)}")
            return None
    
    async def logout_user(self, session_token: str) -> bool:
        """Logout user by deactivating session"""
        
        try:
            result = await self.db.user_sessions.update_one(
                {"session_token": session_token},
                {"$set": {"is_active": False}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Logout error: {str(e)}")
            return False
    
    async def cleanup_expired_sessions(self):
        """Cleanup expired sessions - should be run periodically"""
        
        try:
            await self.db.user_sessions.update_many(
                {"expires_at": {"$lt": datetime.utcnow()}},
                {"$set": {"is_active": False}}
            )
        except Exception as e:
            print(f"Cleanup error: {str(e)}")
    
    async def migrate_anonymous_data(self, user_session: str, user_id: str):
        """Migrate anonymous user data to authenticated user"""
        
        try:
            # Update test results
            await self.db.test_results.update_many(
                {"user_session": user_session, "user_id": None},
                {"$set": {"user_id": user_id}}
            )
            
            # Update unified profiles
            await self.db.unified_profiles.update_many(
                {"user_session": user_session, "user_id": None},
                {"$set": {"user_id": user_id}}
            )
            
            # Update daily content
            await self.db.daily_content.update_many(
                {"user_session": user_session, "user_id": None},
                {"$set": {"user_id": user_id}}
            )
            
            # Update chat messages
            await self.db.chat_messages.update_many(
                {"user_session": user_session, "user_id": None},
                {"$set": {"user_id": user_id}}
            )
            
            # Update palm scans
            await self.db.palm_scans.update_many(
                {"user_session": user_session, "user_id": None},
                {"$set": {"user_id": user_id}}
            )
            
            return True
            
        except Exception as e:
            print(f"Data migration error: {str(e)}")
            return False