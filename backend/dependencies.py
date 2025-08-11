from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.profile_service import ProfileService

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