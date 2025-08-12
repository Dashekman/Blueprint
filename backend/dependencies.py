from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.profile_service import ProfileService
from services.auth_service import AuthService
from services.chat_service import ChatService
from services.palmistry_service import PalmistryService

# Global database instance - will be set by server.py
db = None

def set_database(database: AsyncIOMotorDatabase):
    """Set the global database instance"""
    global db
    db = database

def get_database():
    """Get database instance"""
    return db

def get_profile_service(database = Depends(get_database)) -> ProfileService:
    """Get ProfileService instance with database dependency"""
    return ProfileService(database)

def get_auth_service(database = Depends(get_database)) -> AuthService:
    """Get AuthService instance with database dependency"""
    return AuthService(database)

def get_chat_service(database = Depends(get_database)) -> ChatService:
    """Get ChatService instance with database dependency"""
    return ChatService(database)

def get_palmistry_service(database = Depends(get_database)) -> PalmistryService:
    """Get PalmistryService instance with database dependency"""
    return PalmistryService(database)