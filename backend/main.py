"""
Main FastAPI Application Entrypoint for EduRAG AI
"Personalized Learning Powered by Student Analytics + Context-Aware RAG"
Inspired by the PRAG-EDU architecture, adapted to the OULAD dataset.
"""

import os
import logging
from fastapi import FastAPI
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.config.settings import settings
from backend.models.database import init_db, get_connection
from backend.api import auth, student, chat, quiz, recommendations, knowledge_gaps, learning_path, documents, admin, evaluation
from backend.rag.generator import response_generator

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("edurag")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_SUBTITLE,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(quiz.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(knowledge_gaps.router, prefix=settings.API_V1_STR)
app.include_router(learning_path.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(evaluation.router, prefix=settings.API_V1_STR)

# Aliases for docs so both /docs and /api/docs work seamlessly
@app.get("/api/docs", include_in_schema=False)
async def api_docs_redirect():
    return RedirectResponse(url="/docs")

@app.get("/api/redoc", include_in_schema=False)
async def api_redoc_redirect():
    return RedirectResponse(url="/redoc")

@app.get("/", summary="Root Health & Service Status")
async def root_index():
    provider = await response_generator.detect_active_provider()
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "subtitle": settings.PROJECT_SUBTITLE,
        "version": settings.VERSION,
        "active_provider": provider,
        "docs_url": "/docs",
        "api_health": "/api/health",
        "endpoints": {
            "auth": "/api/auth/login",
            "student_dashboard": "/api/student/dashboard?student_id=10001",
            "chat": "/api/chat",
            "quiz": "/api/quiz/generate",
            "admin": "/api/admin/analytics"
        }
    }

@app.get("/api", summary="API Index")
async def api_index():
    return await root_index()

@app.on_event("startup")
async def startup_event():
    """Initializes database schema and ensures baseline demo accounts exist."""
    init_db()
    conn = get_connection()
    cur = conn.cursor()
    
    # 1. Seed demo student accounts (both domains supported)
    student_emails = ["alex.morgan@open.ac.uk", "alex.morgan@student.open.ac.uk"]
    pw_hash = auth.hash_password("learnwise123")
    for email in student_emails:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if not existing:
            cur.execute(
                "INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
                (email, "Alex Morgan", pw_hash, "student")
            )
            u_id = cur.lastrowid
            cur.execute(
                """INSERT OR IGNORE INTO student_profiles (
                    student_id, user_id, name, gender, region, highest_education,
                    imd_band, age_band, num_of_prev_attempts, studied_credits, disability
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (10001, u_id, "Alex Morgan", "F", "South East Region", "A Level or Equivalent",
                 "50-60%", "0-35", 0, 60, "N")
            )
            logger.info(f"Created student demo account: {email}")

    # 2. Seed demo researcher / admin account (support both edurag and learnwise)
    admin_emails = ["admin.research@edurag.ai", "admin.research@learnwise.ai", "admin@edurag.ai"]
    admin_pw_hash = auth.hash_password("admin123")
    for a_email in admin_emails:
        existing_admin = conn.execute("SELECT id FROM users WHERE email = ?", (a_email,)).fetchone()
        if not existing_admin:
            cur.execute(
                "INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
                (a_email, "Dr. Sarah Lin (Research)", admin_pw_hash, "admin")
            )
            adm_id = cur.lastrowid
            cur.execute(
                """INSERT OR IGNORE INTO student_profiles (
                    student_id, user_id, name, gender, region, highest_education,
                    imd_band, age_band, num_of_prev_attempts, studied_credits, disability
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (99999, adm_id, "Dr. Sarah Lin", "F", "East Anglian Region", "Post Graduate",
                 "80-90%", "35-55", 0, 120, "N")
            )
            logger.info(f"Created researcher admin demo account: {a_email}")

    conn.commit()
    conn.close()
    
    active_provider = await response_generator.detect_active_provider()
    logger.info(f"EduRAG AI initialized. Active LLM Provider: {active_provider}")

@app.get("/api/health")
async def health_check():
    provider = await response_generator.detect_active_provider()
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "subtitle": settings.PROJECT_SUBTITLE,
        "version": settings.VERSION,
        "active_provider": provider,
        "dataset": "OULAD (Open University Learning Analytics Dataset)",
        "framework": "PRAG-EDU Context-Aware RAG"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
