"""
Adaptive Quiz Generation and Evaluation Router for EduRAG AI
Calibrates quiz difficulty dynamically based on student proficiency and knowledge gaps.
Provides instantaneous pedagogical feedback and next-step difficulty adaptation.
"""

import uuid
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from backend.api.auth import get_current_user
from backend.schemas.pydantic_models import (
    QuizGenerateRequest, QuizQuestion, QuizSubmission, QuizResultOut, UserOut
)
from backend.models.database import get_connection

router = APIRouter(prefix="/quiz", tags=["Adaptive Quiz System"])

# Comprehensive Curated Question Bank by Topic & Difficulty
QUESTION_BANK = {
    "Recursion": {
        "Easy": [
            {
                "id": 101,
                "question": "What is the primary role of a 'Base Case' in a recursive function?",
                "options": [
                    "To allocate extra memory for recursive parameters",
                    "To define the stopping condition and prevent infinite loops",
                    "To speed up CPU clock cycles during function execution",
                    "To double the size of the array being processed"
                ],
                "correct": 1,
                "hint": "Think about what happens if you never tell a countdown loop to stop.",
                "explanation": "The base case acts as the termination condition. Without it, the function calls itself indefinitely until it causes a stack overflow error."
            },
            {
                "id": 102,
                "question": "In Python, what error is raised when a function recurses too deeply without terminating?",
                "options": [
                    "RecursionError: maximum recursion depth exceeded",
                    "MemoryAllocationException: Heap Full",
                    "SyntaxError: Invalid recursive call syntax",
                    "IndexError: Out of bounds"
                ],
                "correct": 0,
                "hint": "Python's standard library enforces a recursion guard limit (typically 1000).",
                "explanation": "Python throws 'RecursionError: maximum recursion depth exceeded in comparison' when the call stack reaches sys.getrecursionlimit()."
            }
        ],
        "Medium": [
            {
                "id": 103,
                "question": "What is the auxiliary space complexity of calculating factorial(n) with naive recursion?",
                "options": [
                    "O(1) constant auxiliary space",
                    "O(n) auxiliary space on the call stack",
                    "O(n^2) space due to duplicated parameters",
                    "O(log n) space due to binary division"
                ],
                "correct": 1,
                "hint": "Each recursive call allocates a stack frame that remains in memory until the base case returns.",
                "explanation": "Because n stack frames exist simultaneously on the call stack before unwinding begins, naive recursion consumes O(n) auxiliary memory."
            },
            {
                "id": 104,
                "question": "Which of the following functions is genuinely tail-recursive?",
                "options": [
                    "def f(n): return n * f(n - 1)",
                    "def f(n, acc=1): return acc if n <= 1 else f(n - 1, acc * n)",
                    "def f(n): return f(n - 1) + f(n - 2)",
                    "def f(n): return 1 + f(n - 1)"
                ],
                "correct": 1,
                "hint": "In tail recursion, the recursive call must be the strict final operation with no pending arithmetic.",
                "explanation": "Option B uses an accumulator parameter, meaning no operation is pending after `f(n - 1, acc * n)` returns. The compiler can reuse the current frame."
            }
        ],
        "Hard": [
            {
                "id": 105,
                "question": "Under the Master Theorem, what is the asymptotic time complexity of T(n) = 2T(n/2) + O(n)?",
                "options": [
                    "O(n)",
                    "O(n log n)",
                    "O(n^2)",
                    "O(2^n)"
                ],
                "correct": 1,
                "hint": "Compare n^(log_b a) with the work done per level f(n). Here a=2, b=2, so n^(log_2 2) = n^1.",
                "explanation": "Because f(n) = O(n) matches n^(log_b a) = n^1, this falls into Case 2 of the Master Theorem, yielding O(n log n) (as in MergeSort)."
            }
        ]
    },
    "Data Structures": {
        "Easy": [
            {
                "id": 201,
                "question": "What is the key difference between a Python List and a Linked List?",
                "options": [
                    "Python Lists store characters only; Linked Lists store numbers only",
                    "Python Lists are stored in contiguous memory; Linked List nodes can be scattered across heap memory",
                    "Linked Lists do not support pointers or references",
                    "Python Lists cannot be iterated over using a for-loop"
                ],
                "correct": 1,
                "hint": "Consider how items are arranged in the computer's memory.",
                "explanation": "Python lists are dynamic arrays stored contiguously in memory. Linked list nodes are discrete heap objects linked via reference pointers."
            }
        ],
        "Medium": [
            {
                "id": 202,
                "question": "What is the worst-case time complexity of inserting an item at the beginning (head) of a Singly Linked List?",
                "options": [
                    "O(1) constant time",
                    "O(n) linear time",
                    "O(log n) logarithmic time",
                    "O(n^2) quadratic time"
                ],
                "correct": 0,
                "hint": "Does adding to the head require shifting existing items?",
                "explanation": "Inserting at the head simply requires pointing the new node's next pointer to the current head and updating the head pointer, taking O(1) time."
            }
        ],
        "Hard": [
            {
                "id": 203,
                "question": "Why do contiguous arrays frequently outperform linked lists in real-world iteration benchmarks despite identical O(n) asymptotic traversal complexity?",
                "options": [
                    "Arrays bypass the operating system kernel entirely",
                    "CPU cache line prefetching and spatial locality minimize memory bus wait states",
                    "Linked lists require dynamic recompilation on every node access",
                    "Arrays execute in parallel across multiple CPU cores automatically"
                ],
                "correct": 1,
                "hint": "Think about CPU hardware L1/L2 caches and 64-byte cache lines.",
                "explanation": "Contiguous array elements fit into CPU cache lines, triggering hardware prefetching and minimizing L1/L2 cache misses. Linked list pointer-chasing triggers frequent cache and TLB misses."
            }
        ]
    },
    "Dynamic Programming": {
        "Easy": [
            {
                "id": 301,
                "question": "What are the two core prerequisites an optimization problem must satisfy to be solved via Dynamic Programming?",
                "options": [
                    "Random access memory and static types",
                    "Optimal substructure and overlapping subproblems",
                    "Greedy choice property and sorting",
                    "Polymorphic inheritance and recursion"
                ],
                "correct": 1,
                "hint": "Think about breaking a problem down and reusing previous sub-solutions.",
                "explanation": "Dynamic Programming applies when solutions to subproblems can be combined to solve the overall problem (optimal substructure) and the same subproblems are solved repeatedly (overlapping subproblems)."
            }
        ],
        "Medium": [
            {
                "id": 302,
                "question": "What is the primary difference between Memoization and Tabulation?",
                "options": [
                    "Memoization is top-down using recursion and a cache; Tabulation is bottom-up using iteration",
                    "Tabulation requires exponential time complexity",
                    "Memoization only works for sorting algorithms",
                    "Tabulation cannot be implemented in Python"
                ],
                "correct": 0,
                "hint": "Consider the direction of problem solving (top-down vs bottom-up).",
                "explanation": "Memoization solves problems top-down by caching recursive call results. Tabulation solves iteratively from the smallest subproblems upward into a table."
            }
        ],
        "Hard": [
            {
                "id": 303,
                "question": "In the 0/1 Knapsack problem with N items and maximum weight W, what are the time and auxiliary space complexities of the standard bottom-up DP table?",
                "options": [
                    "Time: O(2^N), Space: O(N)",
                    "Time: O(N * W), Space: O(N * W) (optimizable to O(W))",
                    "Time: O(N log W), Space: O(1)",
                    "Time: O(W^2), Space: O(N^2)"
                ],
                "correct": 1,
                "hint": "The state table has dimensions of items (N) by weights (W).",
                "explanation": "The table entries DP[i][w] take O(N * W) pseudo-polynomial time and space, which can be space-optimized to O(W) with a single 1D array."
            }
        ]
    },
    "Algorithms": {
        "Easy": [
            {
                "id": 401,
                "question": "What is the asymptotic time complexity of Binary Search on a sorted array of N elements?",
                "options": [
                    "O(1)",
                    "O(log N)",
                    "O(N)",
                    "O(N^2)"
                ],
                "correct": 1,
                "hint": "Each comparison cuts the search interval in half.",
                "explanation": "Binary search divides the remaining candidate space by 2 on every step, yielding O(log N) logarithmic time."
            }
        ],
        "Medium": [
            {
                "id": 402,
                "question": "What is the worst-case time complexity of QuickSort and when does it occur?",
                "options": [
                    "O(N log N) when the pivot divides the list evenly",
                    "O(N^2) when the chosen pivot is consistently the minimum or maximum element",
                    "O(N) when the array is already reversed",
                    "O(2^N) when all elements are duplicates"
                ],
                "correct": 1,
                "hint": "What happens if every partition step results in an unbalanced split of 0 and N-1 elements?",
                "explanation": "When pivots are repeatedly the smallest or largest elements, the recurrence becomes T(n) = T(n-1) + O(n), degenerating to O(N^2)."
            }
        ],
        "Hard": [
            {
                "id": 403,
                "question": "Which asymptotic notation describes a tight bound (both upper and lower bound simultaneously)?",
                "options": [
                    "Big-O (O)",
                    "Big-Omega (Ω)",
                    "Big-Theta (Θ)",
                    "Little-o (o)"
                ],
                "correct": 2,
                "hint": "Big-O is upper bound, Big-Omega is lower bound.",
                "explanation": "Big-Theta (Θ) defines an asymptotically tight bound, bounding the growth rate from both above and below within constant factors."
            }
        ]
    }
}

@router.post("/generate")
def generate_quiz(payload: QuizGenerateRequest, current_user: UserOut = Depends(get_current_user)):
    """Generates an adaptive quiz tailored to the student's proficiency level."""
    topic = payload.topic
    difficulty = payload.difficulty or "Medium"
    if difficulty.lower() == "expert":
        difficulty = "Hard"
    
    # Match topic or default to Recursion
    topic_lower = topic.lower()
    if "dynamic" in topic_lower or "dp" in topic_lower or "memo" in topic_lower:
        matched_topic = "Dynamic Programming"
    elif "algo" in topic_lower or "complexity" in topic_lower or "big-o" in topic_lower:
        matched_topic = "Algorithms"
    elif "data" in topic_lower or "struct" in topic_lower or "list" in topic_lower or "array" in topic_lower:
        matched_topic = "Data Structures"
    else:
        matched_topic = "Recursion"
            
    bank_topic = QUESTION_BANK.get(matched_topic, QUESTION_BANK["Recursion"])
    questions_list = bank_topic.get(difficulty, bank_topic.get("Medium", []))
    
    # If not enough questions, pull from adjacent difficulty
    if len(questions_list) < (payload.num_questions or 2):
        for diff_key in ["Easy", "Medium", "Hard"]:
            if diff_key != difficulty and diff_key in bank_topic:
                questions_list = questions_list + bank_topic[diff_key]
                
    questions_out = []
    for q in questions_list[:payload.num_questions or 4]:
        questions_out.append(QuizQuestion(
            id=q["id"],
            question=q["question"],
            options=q["options"],
            difficulty=q.get("difficulty", difficulty),
            hint=q.get("hint")
        ))
        
    return {
        "topic": matched_topic,
        "difficulty": difficulty,
        "total_questions": len(questions_out),
        "questions": questions_out
    }

@router.post("/submit", response_model=QuizResultOut)
def submit_quiz(submission: QuizSubmission, current_user: UserOut = Depends(get_current_user)):
    """Evaluates quiz answers, updates student mastery, and adapts the next difficulty level."""
    # Find all questions in bank across all topics
    all_q_map = {}
    for topic, diff_dict in QUESTION_BANK.items():
        for diff, q_list in diff_dict.items():
            for q in q_list:
                all_q_map[q["id"]] = q
                
    correct_count = 0
    total = len(submission.answers)
    review = []
    
    for q_id, chosen_idx in submission.answers.items():
        q_data = None
        try:
            q_data = all_q_map.get(int(q_id))
        except (ValueError, TypeError):
            pass
        if not q_data:
            q_data = all_q_map.get(str(q_id))
        if not q_data:
            continue
            
        is_correct = (chosen_idx == q_data["correct"])
        if is_correct:
            correct_count += 1
            
        review.append({
            "question_id": q_id,
            "question": q_data["question"],
            "your_answer": q_data["options"][chosen_idx] if 0 <= chosen_idx < len(q_data["options"]) else "Skipped",
            "correct_answer": q_data["options"][q_data["correct"]],
            "is_correct": is_correct,
            "explanation": q_data["explanation"]
        })
        
    accuracy = (correct_count / total) * 100.0 if total > 0 else 0.0
    score = round(accuracy, 1)
    
    # Adaptive Next Difficulty Logic
    if accuracy >= 80.0:
        if submission.difficulty == "Easy":
            next_diff = "Medium"
        elif submission.difficulty == "Medium":
            next_diff = "Hard"
        else:
            next_diff = "Expert"
        feedback = "Outstanding performance! You have demonstrated strong mastery of these concepts. Your next practice set has been leveled up."
    elif accuracy >= 50.0:
        next_diff = submission.difficulty
        feedback = "Good progress! You grasp the fundamentals, but reviewing the explanations for missed items will solidify your command."
    else:
        next_diff = "Easy" if submission.difficulty != "Easy" else "Easy"
        feedback = "Needs targeted review. We recommend revisiting the foundational analogies and call stack visualizations in the AI Tutor."
        
    attempt_id = f"attempt_{uuid.uuid4().hex[:8]}"
    
    # Persist attempt to SQLite
    try:
        conn = get_connection()
        conn.execute(
            "INSERT INTO quiz_attempts (id, student_id, topic, difficulty, score, total_questions, accuracy, feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (attempt_id, current_user.student_id or 10001, submission.topic, submission.difficulty, score, total, accuracy, feedback)
        )
        conn.commit()
        conn.close()
    except Exception:
        pass
        
    return QuizResultOut(
        attempt_id=attempt_id,
        topic=submission.topic,
        difficulty=submission.difficulty,
        score=score,
        total=total,
        total_questions=total,
        correct_count=correct_count,
        accuracy=round(accuracy, 1),
        next_difficulty=next_diff,
        next_difficulty_recommendation=next_diff,
        review=review,
        feedback=feedback,
        recommendation=feedback
    )
