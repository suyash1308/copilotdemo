import os
from datetime import timedelta

class Config:
    """Application configuration"""
    # MongoDB Configuration
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/auth_app'
    
    # For MongoDB Atlas (cloud)
    # MONGO_URI = 'mongodb+srv://username:password@cluster.mongodb.net/auth_app?retryWrites=true&w=majority'
    
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JSON_SORT_KEYS = False
    DEBUG = True
    
    # Database name
    DB_NAME = 'auth_app'

