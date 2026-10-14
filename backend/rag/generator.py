"""
LLM Generator & Adaptive Pedagogical Response Engine for EduRAG AI
Model-provider agnostic:
1. Ollama (default local open-source)
2. Google Gemini API (if GEMINI_API_KEY set)
3. OpenAI-compatible API (if OPENAI_API_KEY set)
4. Pedagogical Demo Mode Generator (High-fidelity, deterministic, PRAG-EDU grade-level adaptation)
"""

import httpx
import json
import logging
from typing import Dict, List, Any, Optional, AsyncGenerator
from backend.config.settings import settings

logger = logging.getLogger(__name__)

class ResponseGenerator:
    def __init__(self):
        pass

    async def detect_active_provider(self) -> str:
        """Determines the active provider based on availability and configuration."""
        if settings.DEFAULT_PROVIDER != "auto" and settings.DEFAULT_PROVIDER != "demo":
            return settings.DEFAULT_PROVIDER

        # 1. Check Ollama
        if settings.OLLAMA_BASE_URL:
            try:
                async with httpx.AsyncClient(timeout=1.5) as client:
                    res = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
                    if res.status_code == 200:
                        return "Ollama"
            except Exception:
                pass

        # 2. Check Gemini
        if settings.GEMINI_API_KEY:
            return "Gemini"

        # 3. Check OpenAI
        if settings.OPENAI_API_KEY:
            return "OpenAI"

        # 4. Default to Demo Mode
        return "Demo Mode"

    async def generate_response(
        self,
        system_prompt: str,
        user_prompt: str,
        query: str,
        student_tier: str = "INTERMEDIATE",
        retrieved_sources: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generates complete adaptive pedagogical response from active provider or demo engine."""
        provider = await self.detect_active_provider()
        retrieved_sources = retrieved_sources or []
        
        # 1. Call Ollama
        if provider == "Ollama":
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{settings.OLLAMA_BASE_URL}/api/chat",
                        json={
                            "model": settings.OLLAMA_MODEL,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt}
                            ],
                            "stream": False
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        content = data.get("message", {}).get("content", "")
                        return {
                            "content": content,
                            "mode": "Ollama",
                            "model": settings.OLLAMA_MODEL,
                            "followups": self._generate_followups(query, student_tier)
                        }
            except Exception as e:
                logger.warning(f"Ollama call failed: {e}. Falling back to Demo Mode.")
                provider = "Demo Mode"

        # 2. Call Gemini
        if provider == "Gemini":
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                payload = {
                    "system_instruction": {"parts": [{"text": system_prompt}]},
                    "contents": [{"parts": [{"text": user_prompt}]}]
                }
                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        content = data["candidates"][0]["content"]["parts"][0]["text"]
                        return {
                            "content": content,
                            "mode": "Gemini",
                            "model": "gemini-1.5-flash",
                            "followups": self._generate_followups(query, student_tier)
                        }
            except Exception as e:
                logger.warning(f"Gemini call failed: {e}. Falling back to Demo Mode.")
                provider = "Demo Mode"

        # 3. Call OpenAI
        if provider == "OpenAI":
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(
                        f"{settings.OPENAI_BASE_URL}/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": "gpt-4o-mini",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt}
                            ]
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        content = data["choices"][0]["message"]["content"]
                        return {
                            "content": content,
                            "mode": "OpenAI",
                            "model": "gpt-4o-mini",
                            "followups": self._generate_followups(query, student_tier)
                        }
            except Exception as e:
                logger.warning(f"OpenAI call failed: {e}. Falling back to Demo Mode.")
                provider = "Demo Mode"

        # 4. High-Fidelity Pedagogical Demo Mode (PRAG-EDU Calibrated)
        demo_content = self._generate_pedagogical_demo_response(query, student_tier, retrieved_sources)
        return {
            "content": demo_content,
            "mode": "Demo Mode",
            "model": "PRAG-EDU Adaptive Engine",
            "followups": self._generate_followups(query, student_tier)
        }

    def _generate_pedagogical_demo_response(
        self,
        query: str,
        tier: str,
        sources: List[Dict[str, Any]]
    ) -> str:
        """Produces realistic, level-adapted responses demonstrating PRAG-EDU architecture."""
        q_lower = query.lower()
        tier_upper = tier.upper()
        
        # Source citation footer string
        citations_text = ""
        if sources:
            source_titles = [f"**{s.get('title', 'Topic Guide')}** ({s.get('source', 'Course Pack')}, p. {s.get('page', 1)})" for s in sources[:2]]
            citations_text = f"\n\n---\n*📚 Grounded in Open University Curriculum: {', '.join(source_titles)}*"

        # Scenario 1: Recursion
        if "recursion" in q_lower or "recursive" in q_lower or "base case" in q_lower:
            if tier_upper in ["BEGINNER", "DEVELOPING"]:
                return f"""### Understanding Recursion: The Russian Nesting Doll Analogy

Imagine you hold a set of **Russian nesting dolls (Matryoshka)**. You want to reach the tiny prize inside the smallest doll. What do you do?

1. You open the outermost doll.
2. Inside is a slightly smaller doll. You open that one too.
3. You repeat this exact same action until you reach the **smallest, solid doll** that cannot be opened.
4. Once you reach it, you stop!

In computer science, **Recursion** is simply a function that solves a problem by calling a smaller copy of itself, exactly like opening nested dolls.

#### The Two Golden Rules of Recursion:
1. **The Base Case (The Stopping Condition):** This is the smallest solid doll. It tells the function when to stop calling itself. Without a base case, the function loops forever and crashes!
2. **The Recursive Step (The Action):** The function calls itself with a slightly smaller input, moving closer to the base case.

#### Simple Python Example: A Countdown Timer
```python
def countdown(n):
    # Rule 1: Base Case (Stop when we hit 0)
    if n <= 0:
        print("🚀 Liftoff!")
        return
    
    # Rule 2: Do something and call itself with a smaller number
    print(n)
    countdown(n - 1)

# Let's run it:
countdown(3)
```

**Output:**
```text
3
2
1
🚀 Liftoff!
```

---
💡 **Quick Check-for-Understanding:**
*What would happen if we accidentally deleted the line `if n <= 0: return` from the code above?*{citations_text}"""

            elif tier_upper == "INTERMEDIATE":
                return f"""### Recursion: Call Stack Mechanics and Stack Frames

In software systems, a recursive algorithm solves a problem by breaking it down into smaller subproblems of the identical type, using the operating system's **Call Stack** to manage execution state.

#### 1. What Happens in Memory? (The Call Stack)
Whenever any function is called, the runtime allocates an **Activation Record (Stack Frame)** on the call stack in memory. This frame preserves:
- Local variables
- Parameter values for that specific invocation
- The return address (where to send the result when finished)

```text
[ Call Stack Unwinding ]
+-----------------------+
| factorial(1) -> returns 1
+-----------------------+
| factorial(2) -> waits for factorial(1) -> returns 2 * 1 = 2
+-----------------------+
| factorial(3) -> waits for factorial(2) -> returns 3 * 2 = 6
+-----------------------+
| factorial(4) -> waits for factorial(3) -> returns 4 * 6 = 24 (Base frame)
+-----------------------+
```

#### 2. Implementation: Computing Factorial
```python
def factorial(n: int) -> int:
    # 1. Base Case: 0! = 1 and 1! = 1
    if n <= 1:
        return 1
    
    # 2. Recursive Step: n * (n - 1)!
    return n * factorial(n - 1)
```

#### 3. Complexity Analysis:
- **Time Complexity:** $\\mathcal{{O}}(n)$ because the function is invoked exactly $n$ times.
- **Space Complexity:** $\\mathcal{{O}}(n)$ auxiliary memory on the call stack due to $n$ simultaneous stack frames pending return before unwinding begins.

---
🎯 **Practice Challenge:**
*How would you adapt this recursive structure to traverse the nodes of a Binary Search Tree in-order?*{citations_text}"""

            else: # ADVANCED & MASTERY
                return f"""### Advanced Recursion: Activation Frames, Tail Call Optimization, and Recurrences

At an architectural level, recursion is an inductive problem-decomposition paradigm whose execution characteristics are bounded by compiler frame allocation, register preservation, and the memory hierarchy.

#### 1. Memory Subsystem & Stack Frame Overhead
Each non-terminal recursive call forces the compiler to emit machine code that:
1. Adjusts the stack pointer (`RSP` / `ESP`).
2. Pushes non-volatile registers and parameters onto the stack.
3. Performs a `CALL` instruction which pushes the return instruction pointer (`RIP`).
4. Executes the prologue/epilogue for each frame.

If the recursion depth exceeds the thread's stack allocation (typically 1MB-8MB on modern OSs or `sys.getrecursionlimit()` in CPython), a **Stack Overflow Exception** is triggered.

#### 2. Tail Call Optimization (TCO)
A recursive function is **tail-recursive** if the recursive call is the strict final action executed before returning, with no pending computation applied to the return value:

```python
# Naive (Non-tail): Compiler MUST preserve caller frame to perform multiplication
def factorial_naive(n):
    if n <= 1: return 1
    return n * factorial_naive(n - 1) # Pending multiplication!

# Tail-Recursive: Accumulator carries state forward
def factorial_tail(n, accumulator=1):
    if n <= 1: return accumulator
    return factorial_tail(n - 1, n * accumulator) # Pure tail call!
```

In language runtimes supporting TCO (such as Scheme, Scala, or Clang/GCC with `-O2`), the compiler replaces the `CALL` instruction with a `JMP` instruction, overwriting the current stack frame. This collapses auxiliary space complexity from $\\mathcal{{O}}(n)$ down to $\\mathcal{{O}}(1)$.

#### 3. Formal Complexity & Recurrence Relations (Master Theorem)
Divide-and-conquer recurrences are formalized as:
$$T(n) = a \\cdot T\\left(\\frac{{n}}{{b}}\\right) + f(n)$$
- For MergeSort: $T(n) = 2T(n/2) + \\mathcal{{O}}(n) \\implies \\mathcal{{O}}(n \\log n)$ by Case 2 of the Master Theorem.
- Where overlapping subproblems exist (e.g. naive Fibonacci $T(n) = T(n-1) + T(n-2) = \\mathcal{{O}}(2^n)$), memoization or dynamic programming tabulation converts tree recursion into polynomial DAG traversals.

---
⚡ **System Optimization Question:**
*Under what architectural constraints would you prefer explicit heap-allocated stack emulation over recursive function frames in production microservices?*{citations_text}"""

        # Scenario 2: Linked List
        elif "linked list" in q_lower or "node" in q_lower or "pointer" in q_lower:
            if tier_upper in ["BEGINNER", "DEVELOPING"]:
                return f"""### What is a Linked List? (The Scavenger Hunt Analogy)

Imagine going on a **Treasure Hunt**. 
At your first clue location, you don't find all the prizes piled together. Instead, you find a small clue card that contains two things:
1. A small prize (the data).
2. The address to the next clue location (the pointer).

A **Linked List** works exactly like that treasure hunt!

#### Components of a Linked List:
- **Node:** A small container holding two items:
  1. `data`: The value you want to store (e.g., a number or name).
  2. `next`: An arrow (pointer) pointing to where the next node lives.
- **Head:** The very first node where your list starts.
- **Tail:** The last node, whose arrow points to `None` (empty), meaning the list has ended.

```text
[Head: 10 | Next] ---> [20 | Next] ---> [30 | None (Tail)]
```

#### Simple Python Example:
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None  # Initially points to nothing

# Let's link three nodes together:
head = Node("First Item")
head.next = Node("Second Item")
head.next.next = Node("Third Item")

print(head.value)        # "First Item"
print(head.next.value)   # "Second Item"
```

---
💡 **Key Takeaway:**
Unlike regular lists (arrays) where items must sit side-by-side in computer memory, linked list nodes can float anywhere in memory because each node holds directions to the next!{citations_text}"""

            elif tier_upper == "INTERMEDIATE":
                return f"""### Linked Lists: Architecture, Traversal, and Big-O Trade-offs

A **Linked List** is a linear data structure whose elements are not stored at contiguous memory locations. Instead, each element is a discrete `Node` object containing data and a reference pointer to the subsequent node in heap memory.

#### 1. Core Operations & Mechanics

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, data):
        # O(1) Constant Time Insertion
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def traverse_and_print(self):
        # O(n) Sequential Traversal
        current = self.head
        while current is not None:
            print("[" + str(current.data) + "] -> ", end="")
            current = current.next
        print("None")
```

#### 2. Comparative Analysis: Linked List vs Contiguous Array

| Operation | Array (Contiguous) | Singly Linked List | Trade-off Rationale |
| :--- | :--- | :--- | :--- |
| **Random Access (by Index)** | $\\mathcal{{O}}(1)$ | $\\mathcal{{O}}(n)$ | Arrays calculate memory offset directly: `base + i * size`. |
| **Insertion at Beginning** | $\\mathcal{{O}}(n)$ | $\\mathcal{{O}}(1)$ | Arrays must shift all $n$ elements; Linked List re-points head. |
| **Insertion at End** | $\\mathcal{{O}}(1)$ amortized | $\\mathcal{{O}}(n)$ or $\\mathcal{{O}}(1)$ with tail | Requires pointer traversal unless a tail pointer is maintained. |
| **Memory Locality** | Excellent (Cache-friendly)| Fragmented | Node pointers introduce 8-byte pointer overhead per node. |

---
🎯 **Check:**
*Why does deleting an arbitrary node from a Singly Linked List require tracking the PREVIOUS node?*{citations_text}"""

            else: # ADVANCED & MASTERY
                return f"""### Linked Lists: Memory Topology, Cache Locality, and Low-Level Trade-offs

From a systems and hardware perspective, linked lists represent a dynamic heap-allocation topology that decouples collection size from contiguous virtual memory reservation, but pays significant penalties in **L1/L2 cache locality** and **memory fragmentation**.

#### 1. Cache Line Inefficiency & Pointer Chasing
Modern CPU architectures achieve high memory throughput via hardware prefetchers that load 64-byte **Cache Lines** into the L1/L2 caches when contiguous memory addresses (arrays, vectors) are accessed. 
- In an array, accessing `arr[i]` prefetches adjacent elements with $\\mathcal{{O}}(1)$ spatial locality.
- In a linked list, each node is allocated via independent heap allocations (`malloc` / `PyObject_Malloc`), scattering nodes across non-contiguous addresses. Traversal degrades into serialized **pointer chasing**, inducing frequent L1/L2 cache misses and TLB misses.

#### 2. Memory Overhead Comparison
In a 64-bit architecture:
- 32-bit integer array element: 4 bytes.
- Singly Linked List Node: 8 bytes (data payload aligned) + 8 bytes (`next` pointer) = 16 bytes (plus 16-byte object header in managed runtimes like CPython/JVM).
- Doubly Linked List Node: Payload + `prev` pointer (8B) + `next` pointer (8B) = 24+ bytes.

#### 3. Advanced Variants & Concurrent Data Structures
- **Unrolled Linked Lists:** Each node contains a small fixed-capacity array (e.g. 16 elements) plus a pointer. Blends $\\mathcal{{O}}(1)$ pointer splicing with cache-friendly local traversals.
- **Lock-Free Concurrent Linked Lists:** Implemented using Atomic Compare-And-Swap (`CAS`) operations (Harris's linked list algorithm) with logical deletion marking bits to prevent ABA race conditions during concurrent multithreaded mutations.

---
⚡ **Engineering Decision:**
*In real-time trading engines, why are lock-free ring buffers (circular arrays) overwhelmingly preferred over linked-list queues despite fixed capacity bounds?*{citations_text}"""

        # General Adaptive Educational Response
        else:
            if tier_upper in ["BEGINNER", "DEVELOPING"]:
                return f"""### Understanding {query.strip('?')} (Beginner Level)

Let's break down **{query}** step-by-step using an intuitive, practical approach.

#### 1. The Core Idea
At its heart, this concept solves a very common problem in computer science. Think of it like organizing tools in a labeled toolbox:
- You want each tool in its proper slot so you can find it quickly.
- You keep the steps simple and predictable so mistakes don't happen.

#### 2. Key Takeaways:
- **Keep it modular:** Break big problems into bite-sized, readable pieces.
- **Trace the flow:** Follow execution from top to bottom, one line at a time.
- **Verify inputs:** Always check what data enters your code before processing.

#### 3. Simple Practical Example
```python
# Demonstrating the core concept simply
data_items = ["Item A", "Item B", "Item C"]

for index, item in enumerate(data_items, start=1):
    print("Step " + str(index) + ": Processed " + str(item))
```

---
💡 **Next Step:**
*Would you like to try a 1-minute interactive quiz question on this concept?*{citations_text}"""

            elif tier_upper == "INTERMEDIATE":
                return f"""### Comprehensive Overview: {query.strip('?')} (Intermediate Level)

Let's examine **{query}** from both architectural design and algorithmic implementation standpoints.

#### 1. Conceptual Framework & Execution Mechanics
This topic is central to modular software engineering and algorithm design. Understanding its lifecycle involves:
- **State Management:** Tracking inputs, intermediate transformations, and output invariants.
- **Algorithmic Complexity:** Ensuring operations scale predictably with input size $n$.
- **Error Handling:** Anticipating boundary conditions and invalid states.

#### 2. Implementation Pattern
```python
from typing import List, Dict, Any

def process_pipeline(elements: List[Any]) -> Dict[str, Any]:
    # Demonstrates structured execution and metric collection
    if not elements:
        return {"status": "empty", "processed_count": 0}
        
    results = []
    for item in elements:
        # Core transformation step
        results.append(str(item).upper())
        
    return {
        "status": "success",
        "processed_count": len(results),
        "data": results
    }
```

#### 3. Complexity & Design Considerations
- **Time Complexity:** Typically $\\mathcal{{O}}(n)$ for linear data structures.
- **Space Complexity:** $\\mathcal{{O}}(n)$ auxiliary storage for the transformed output.

---
🎯 **Follow-up Challenge:**
*How would you handle input scalability if the collection size exceeded available memory?*{citations_text}"""

            else:
                return f"""### Deep Analysis & System Considerations: {query.strip('?')} (Advanced/Mastery)

Let's examine **{query}** through theoretical foundations, complexity bounds, and system-level trade-offs.

#### 1. Theoretical Abstraction & Invariants
Analyzing this domain requires formalizing the underlying state space and operational invariants:
- **Asymptotic Guarantees:** Deriving tight upper ($\\\\mathcal{{O}}$) and lower ($\\\\Omega$) complexity bounds across average and worst-case permutations.
- **Memory & Resource Contention:** Evaluating cache line utilization, memory fragmentation, and garbage collection pressure.
- **Concurrency & Parallelization:** Analyzing whether operations are embarrassingly parallel, require lock-free synchronization primitives (`atomic_cas`), or map to SIMD vectorized operations.

#### 2. Optimization Principles
When engineering for high-throughput or low-latency systems:
$$\\text{{Latency}} = \\text{{Compute Time}} + \\text{{Memory Access Latency}} + \\text{{Synchronization Overhead}}$$

Where memory bandwidth dominates CPU clock cycles, data layout reorganization (such as Structure-of-Arrays over Array-of-Structures) yields orders-of-magnitude improvements in throughput.

---
⚡ **Research Exploration:**
*How does this implementation compare to purely functional, immutable persistent data structures under heavy write workloads?*{citations_text}"""

    def _generate_followups(self, query: str, tier: str) -> List[str]:
        """Generates dynamic follow-up prompt pills for the AI tutor UI."""
        tier_upper = tier.upper()
        if "recursion" in query.lower():
            if tier_upper in ["BEGINNER", "DEVELOPING"]:
                return ["Give me another simple analogy", "Show me a step-by-step diagram", "Quiz me on base cases"]
            elif tier_upper == "INTERMEDIATE":
                return ["Explain the call stack unwinding", "How does recursion compare to iteration?", "Show tree traversal recursion"]
            else:
                return ["Analyze Tail Call Optimization (TCO)", "Explain Master Theorem recurrences", "Show iterative heap-stack emulation"]
        elif "list" in query.lower():
            if tier_upper in ["BEGINNER", "DEVELOPING"]:
                return ["Explain node pointers simply", "Give a real-world example", "Why not just use an array?"]
            elif tier_upper == "INTERMEDIATE":
                return ["Compare array vs linked list Big-O", "How does insertion at head work?", "Show doubly linked list code"]
            else:
                return ["Discuss CPU cache locality and TLB misses", "Explain lock-free concurrent lists", "Show unrolled linked list trade-offs"]
        else:
            return ["Explain simpler", "Explain deeper", "Give practice question", "Quiz me on this"]

    async def generate_stream(
        self,
        system_prompt: str,
        user_prompt: str,
        query: str,
        student_tier: str = "INTERMEDIATE",
        retrieved_sources: List[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """Simulates or streams LLM generation token-by-token."""
        result = await self.generate_response(system_prompt, user_prompt, query, student_tier, retrieved_sources)
        full_text = result["content"]
        words = full_text.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i:i+3]) + " "
            yield chunk

response_generator = ResponseGenerator()
