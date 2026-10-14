"""
EduRAG AI - Single Host Runner
Orchestrates both the FastAPI backend and Next.js frontend under a single host.

Single Host Access:
  - Web UI:       http://localhost:3000
  - API Routes:   http://localhost:3000/api/...
  - Swagger Docs: http://localhost:3000/docs
"""

import sys
import os
import time
import subprocess
import signal
import threading

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

def stream_output(process, prefix):
    for line in iter(process.stdout.readline, b""):
        try:
            decoded = line.decode("utf-8", errors="replace").rstrip()
            if decoded:
                print(f"[{prefix}] {decoded}", flush=True)
        except Exception:
            pass

def main():
    print("=" * 60, flush=True)
    print("  🚀 EduRAG AI - Starting Single Host System", flush=True)
    print("=" * 60, flush=True)
    print(f"  Working Directory: {ROOT_DIR}", flush=True)
    print("  Backend API:       http://127.0.0.1:8000 (Internal)", flush=True)
    print("  Unified Host:      http://localhost:3000 (UI + API + Docs)", flush=True)
    print("=" * 60, flush=True)

    # 1. Start Backend FastAPI
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=ROOT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )

    # 2. Start Frontend Next.js
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=(sys.platform == "win32")
    )

    t1 = threading.Thread(target=stream_output, args=(backend_proc, "BACKEND"), daemon=True)
    t2 = threading.Thread(target=stream_output, args=(frontend_proc, "FRONTEND"), daemon=True)
    t1.start()
    t2.start()

    print("\n✅ Single Host Active at: http://localhost:3000\n", flush=True)
    print("Press Ctrl+C to terminate both servers.\n", flush=True)

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("[!] Backend exited unexpectedly.", flush=True)
                break
            if frontend_proc.poll() is not None:
                print("[!] Frontend exited unexpectedly.", flush=True)
                break
    except KeyboardInterrupt:
        print("\n[Shutting down servers...]", flush=True)
    finally:
        try:
            if sys.platform == "win32":
                subprocess.call(["taskkill", "/F", "/T", "/PID", str(backend_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                subprocess.call(["taskkill", "/F", "/T", "/PID", str(frontend_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                backend_proc.terminate()
                frontend_proc.terminate()
        except Exception:
            pass
        print("[Servers stopped.]", flush=True)

if __name__ == "__main__":
    main()
