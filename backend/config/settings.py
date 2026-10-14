import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "EduRAG AI"
    PROJECT_SUBTITLE: str = "Personalized Learning Powered by Student Analytics + Context-Aware RAG"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment Variables
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./edurag.db")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "edurag-secret-jwt-key-edu-ai-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Model Provider Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    
    # Active Provider Mode ("ollama", "gemini", "openai", "demo")
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "auto")
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "data")
    OULAD_DIR: str = os.path.join(DATA_DIR, "oulad")
    KNOWLEDGE_BASE_DIR: str = os.path.join(DATA_DIR, "knowledge_base")

settings = Settings()
