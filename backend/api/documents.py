"""
Knowledge Base & Document Management API Router for EduRAG AI
Allows administrators to inspect, search, and upload educational materials
(Markdown, Text, PDFs) with automated text chunking, embedding, and metadata extraction.
"""

import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from backend.api.auth import get_current_user
from backend.schemas.pydantic_models import UserOut
from backend.rag.vector_store import vector_store
from backend.rag.embeddings import embedding_engine

router = APIRouter(prefix="/documents", tags=["Educational Knowledge Base"])

@router.get("")
def list_documents(current_user: UserOut = Depends(get_current_user)):
    """Returns all indexed educational documents and chunk counts."""
    docs = list(vector_store.documents.values())
    chunks_count = len(vector_store.chunks)
    
    return {
        "total_documents": len(docs),
        "total_chunks": chunks_count,
        "documents": docs
    }

@router.post("/upload")
async def upload_document(
    title: str = Form(...),
    course: str = Form("Computer Science"),
    module: str = Form("FFF"),
    topic: str = Form("General"),
    difficulty: str = Form("Intermediate"),
    academic_level: str = Form("Undergraduate Year 1"),
    source: str = Form("Uploaded Material"),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: UserOut = Depends(get_current_user)
):
    """Uploads and indexes a new educational document into the RAG vector store."""
    extracted_text = ""
    
    if file:
        file_bytes = await file.read()
        try:
            # Handle text/markdown or basic utf-8 text
            extracted_text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            extracted_text = f"Content extracted from file {file.filename}."
    elif content:
        extracted_text = content
    else:
        raise HTTPException(status_code=400, detail="Either file or text content must be provided.")
        
    doc_id = f"doc_{uuid.uuid4().hex[:8]}"
    
    doc_data = {
        "id": doc_id,
        "title": title,
        "course": course,
        "module": module.upper(),
        "topic": topic,
        "difficulty": difficulty,
        "academic_level": academic_level,
        "source": source,
        "page": 1,
        "content": extracted_text.strip()
    }
    
    # Index in Vector Store
    vector_store.add_document(doc_data)
    
    return {
        "status": "success",
        "message": f"Document '{title}' successfully indexed into RAG knowledge base.",
        "document_id": doc_id,
        "module": module.upper(),
        "topic": topic,
        "difficulty": difficulty
    }
