"""
Database Layer for EduRAG AI
Supports SQLite (local file database) and PostgreSQL.
Creates and manages all 19 required tables:
users, student_profiles, student_modules, student_assessments,
learning_activity, student_proficiency, knowledge_gaps, learning_paths,
topics, resources, documents, document_chunks, embeddings,
chat_sessions, chat_messages, quiz_attempts, recommendations,
feedback, evaluation_results.
"""

import sqlite3
import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.config.settings import settings

logger = logging.getLogger(__name__)

DB_PATH = os.path.join(settings.BASE_DIR, "edurag.db")

def get_connection():
    """Returns a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Creates all 19 tables and required indexes."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student', -- 'student', 'admin', 'researcher'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    );
    """)
    
    # 2. student_profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_profiles (
        student_id INTEGER PRIMARY KEY,
        user_id INTEGER,
        name TEXT NOT NULL,
        gender TEXT,
        region TEXT,
        highest_education TEXT,
        imd_band TEXT,
        age_band TEXT,
        num_of_prev_attempts INTEGER DEFAULT 0,
        studied_credits INTEGER DEFAULT 60,
        disability TEXT DEFAULT 'N',
        preferred_explanation_style TEXT DEFAULT 'step_by_step',
        preferred_learning_pace TEXT DEFAULT 'moderate',
        preferred_media_type TEXT DEFAULT 'mixed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    );
    """)
    
    # 3. student_modules
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        code_module TEXT NOT NULL,
        code_presentation TEXT NOT NULL,
        module_name TEXT,
        date_registration INTEGER,
        date_unregistration INTEGER,
        final_result TEXT DEFAULT 'Pass',
        credits INTEGER DEFAULT 30,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 4. student_assessments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        id_assessment INTEGER NOT NULL,
        code_module TEXT NOT NULL,
        assessment_type TEXT NOT NULL, -- TMA, CMA, Exam
        date_due INTEGER,
        date_submitted INTEGER,
        weight REAL DEFAULT 10.0,
        score REAL,
        is_banked INTEGER DEFAULT 0,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 5. learning_activity (VLE interactions)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS learning_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        code_module TEXT NOT NULL,
        code_presentation TEXT NOT NULL,
        id_site INTEGER NOT NULL,
        activity_type TEXT DEFAULT 'oucontent',
        date INTEGER NOT NULL,
        clicks INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 6. student_proficiency
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_proficiency (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        code_module TEXT DEFAULT 'GLOBAL',
        overall_score REAL NOT NULL,
        proficiency_tier TEXT NOT NULL, -- BEGINNER, DEVELOPING, INTERMEDIATE, ADVANCED, MASTERY
        confidence_score REAL NOT NULL,
        assessment_score_component REAL,
        completion_component REAL,
        engagement_component REAL,
        consistency_component REAL,
        reasoning TEXT,
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 7. knowledge_gaps
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_gaps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        code_module TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        current_mastery REAL NOT NULL, -- 0 to 100%
        status TEXT NOT NULL, -- 'Strong', 'Weak', 'Needs Revision', 'Mastered'
        evidence TEXT,
        recommended_action TEXT,
        identified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 8. learning_paths
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS learning_paths (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        code_module TEXT NOT NULL,
        path_name TEXT NOT NULL,
        current_step_id INTEGER DEFAULT 1,
        total_steps INTEGER DEFAULT 5,
        status TEXT DEFAULT 'in_progress',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 9. topics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code_module TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        difficulty TEXT DEFAULT 'Intermediate',
        prerequisites TEXT, -- JSON array of strings
        estimated_minutes INTEGER DEFAULT 30,
        description TEXT
    );
    """)
    
    # 10. resources
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER,
        title TEXT NOT NULL,
        resource_type TEXT NOT NULL, -- 'study_guide', 'video', 'exercise', 'documentation'
        difficulty TEXT DEFAULT 'Intermediate',
        url TEXT,
        summary TEXT,
        FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE SET NULL
    );
    """)
    
    # 11. documents (Knowledge Base)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        course TEXT NOT NULL,
        module TEXT NOT NULL,
        topic TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        academic_level TEXT,
        source TEXT,
        page INTEGER,
        file_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 12. document_chunks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS document_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        tokens_count INTEGER,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
    );
    """)
    
    # 13. embeddings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS embeddings (
        chunk_id TEXT PRIMARY KEY,
        embedding_vector TEXT NOT NULL, -- JSON array of floats
        model_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chunk_id) REFERENCES document_chunks (id) ON DELETE CASCADE
    );
    """)
    
    # 14. chat_sessions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        student_id INTEGER NOT NULL,
        code_module TEXT DEFAULT 'FFF',
        topic TEXT DEFAULT 'General',
        title TEXT DEFAULT 'Learning Session',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 15. chat_messages
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        sender TEXT NOT NULL, -- 'user', 'assistant'
        content TEXT NOT NULL,
        prompt_context TEXT, -- JSON record of proficiency, retrieved sources, etc.
        retrieved_sources TEXT, -- JSON array of source citations
        explanation_tier TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE
    );
    """)
    
    # 16. quiz_attempts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        student_id INTEGER NOT NULL,
        topic TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        score REAL NOT NULL,
        total_questions INTEGER NOT NULL,
        accuracy REAL NOT NULL,
        mistakes_json TEXT,
        feedback TEXT,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 17. recommendations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        recommendation_type TEXT NOT NULL, -- 'topic', 'resource', 'practice', 'revision', 'quiz'
        priority INTEGER DEFAULT 1,
        estimated_minutes INTEGER DEFAULT 20,
        difficulty TEXT DEFAULT 'Intermediate',
        reason TEXT NOT NULL,
        evidence TEXT,
        status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'dismissed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student_profiles (student_id) ON DELETE CASCADE
    );
    """)
    
    # 18. feedback
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id TEXT NOT NULL,
        student_id INTEGER NOT NULL,
        rating TEXT NOT NULL, -- 'thumbs_up', 'thumbs_down', 'bookmarked'
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES chat_messages (id) ON DELETE CASCADE
    );
    """)
    
    # 19. evaluation_results (Research & Ablation Metrics)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evaluation_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        evaluation_type TEXT NOT NULL, -- 'rag_metrics', 'ablation_study', 'qualitative'
        model_name TEXT NOT NULL,
        system_variant TEXT NOT NULL, -- 'full_prag_edu', 'no_personalization', 'no_retrieval', 'vanilla_llm'
        bert_score_f1 REAL,
        rouge_l REAL,
        meteor REAL,
        bleu REAL,
        mean_rating_score REAL,
        bayesian_average REAL,
        high_quality_rate REAL,
        perfect_alignment_rate REAL,
        notes TEXT,
        evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # Create strategic performance indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_student_assessments_id ON student_assessments(student_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_learning_activity_student ON learning_activity(student_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_student ON knowledge_gaps(student_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_recommendations_student ON recommendations(student_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_documents_topic ON documents(topic);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_document_chunks_doc ON document_chunks(document_id);")
    
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully with 19 tables.")

if __name__ == "__main__":
    init_db()
    print("Database initialization complete.")
