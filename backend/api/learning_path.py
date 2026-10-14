"""
Personalized Learning Path API Router for EduRAG AI
Builds a sequential, milestone-based educational roadmap with status,
prerequisites, mastery percentages, and unlock conditions.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from backend.api.auth import get_current_user
from backend.schemas.pydantic_models import UserOut
from backend.data_pipeline.load_data import OULADLoader
from backend.data_pipeline.clean_data import OULADCleaner
from backend.data_pipeline.student_profile import StudentProfileBuilder

router = APIRouter(prefix="/learning-path", tags=["Personalized Learning Path"])

loader = OULADLoader()
cleaner = OULADCleaner()
profile_builder = StudentProfileBuilder()

@router.get("")
def get_learning_path(current_user: UserOut = Depends(get_current_user)):
    student_id = current_user.student_id or 10001
    raw_data = cleaner.clean_all(loader.load_all())
    profile = profile_builder.build_profile(student_id, raw_data, student_name_override=current_user.name)
    
    # 7-stage roadmap reflecting PRAG-EDU progression
    roadmap_nodes = [
        {
            "id": "node_1",
            "stage": "FOUNDATION",
            "title": "Python Basics & Core Syntax",
            "status": "Completed", # Completed, In Progress, Needs Practice, Locked
            "difficulty": "Beginner",
            "estimated_time": "15 hours",
            "prerequisites": [],
            "mastery_percentage": 92,
            "badge_color": "emerald",
            "description": "Variables, standard types, conditionals, and iteration structures in Python.",
            "is_locked": False
        },
        {
            "id": "node_2",
            "stage": "FOUNDATION",
            "title": "Functions & Modular Architecture",
            "status": "In Progress",
            "difficulty": "Beginner",
            "estimated_time": "12 hours",
            "prerequisites": ["Python Basics"],
            "mastery_percentage": 72,
            "badge_color": "blue",
            "description": "Parameter passing, scope resolution, return semantics, and code modularity.",
            "is_locked": False
        },
        {
            "id": "node_3",
            "stage": "KNOWLEDGE GAP",
            "title": "Recursion & Call Stack Frames",
            "status": "Needs Practice",
            "difficulty": "Medium",
            "estimated_time": "18 hours",
            "prerequisites": ["Functions & Modular Architecture"],
            "mastery_percentage": 42,
            "badge_color": "amber",
            "description": "Base cases, call stack unwinding, activation records, and tree traversal.",
            "is_locked": False,
            "is_current_focus": True
        },
        {
            "id": "node_4",
            "stage": "RECOMMENDED TOPIC",
            "title": "Linear Data Structures (Linked Lists & Queues)",
            "status": "In Progress",
            "difficulty": "Intermediate",
            "estimated_time": "20 hours",
            "prerequisites": ["Functions", "Basic Recursion"],
            "mastery_percentage": 65,
            "badge_color": "indigo",
            "description": "Node pointers, sequential traversal, dynamic memory allocation vs contiguous arrays.",
            "is_locked": False
        },
        {
            "id": "node_5",
            "stage": "PRACTICE & LAB",
            "title": "Algorithmic Complexity & Big-O Tracing",
            "status": "Locked",
            "difficulty": "Intermediate",
            "estimated_time": "14 hours",
            "prerequisites": ["Linear Data Structures"],
            "mastery_percentage": 0,
            "badge_color": "purple",
            "description": "Asymptotic notation, best/average/worst-case analysis, and space bounds.",
            "is_locked": True,
            "lock_reason": "Complete 'Recursion' practice set (minimum 70% mastery required)."
        },
        {
            "id": "node_6",
            "stage": "ASSESSMENT PREPARATION",
            "title": "Object-Oriented Programming & Systems Design",
            "status": "Locked",
            "difficulty": "Advanced",
            "estimated_time": "25 hours",
            "prerequisites": ["Linear Data Structures", "Complexity Tracing"],
            "mastery_percentage": 0,
            "badge_color": "purple",
            "description": "Encapsulation, inheritance, polymorphism, and modular class hierarchies.",
            "is_locked": True,
            "lock_reason": "Locked until Stage 4 is completed."
        },
        {
            "id": "node_7",
            "stage": "NEXT LEVEL / MASTERY",
            "title": "Dynamic Programming & Optimization",
            "status": "Locked",
            "difficulty": "Expert",
            "estimated_time": "30 hours",
            "prerequisites": ["Recursion & Call Stack Frames", "Big-O Tracing"],
            "mastery_percentage": 0,
            "badge_color": "rose",
            "description": "Optimal substructure, overlapping subproblems, memoization vs tabulation.",
            "is_locked": True,
            "lock_reason": "Prerequisite: Recursion & Complexity Tracing."
        }
    ]
    
    total_nodes = len(roadmap_nodes)
    completed_nodes = sum(1 for n in roadmap_nodes if n["status"] == "Completed")
    overall_progress = round((completed_nodes / total_nodes) * 100, 1)
    
    return {
        "student_name": profile["name"],
        "module": "FFF - Computer Science & Software Systems",
        "current_stage": "Stage 3: Remediating Knowledge Gap (Recursion)",
        "overall_path_progress": overall_progress,
        "nodes": roadmap_nodes
    }
