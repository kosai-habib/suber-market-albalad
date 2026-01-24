import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-jwt-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///dev.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Enhancements
    from datetime import timedelta
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Shorter expiration (1 hour)
    RATELIMIT_STORAGE_URI = "memory://"
