"""
EduPrompt AI - Backend API (FastAPI)
--------------------------------------
Vertical-slice prototype implementing the flow from your D1 System
Design Overview:

  Student selects course -> views Prompt Problem -> writes prompt
  -> LLM generates code -> sandbox evaluates -> result returned.

Run with:
    uvicorn main:app --reload --port 8000
"""

import json
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import llm_gateway
import sandbox

app = FastAPI(title="EduPrompt AI API")

# Allow the React dev server (Vite, default port 5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "problems.json"


def load_problems():
    with open(DATA_PATH) as f:
        return json.load(f)


PROBLEMS = load_problems()


class PromptSubmission(BaseModel):
    problem_id: str
    student_prompt: str


@app.get("/api/health")
def health():
    return {"status": "ok", "llm_mode": "stub" if llm_gateway.USE_STUB else "live"}


@app.get("/api/problems")
def list_problems():
    """Returns problems WITHOUT hidden tests (students shouldn't see those)."""
    return [
        {
            "id": p["id"],
            "course": p["course"],
            "title": p["title"],
            "difficulty": p["difficulty"],
            "examples": p["examples"],
        }
        for p in PROBLEMS
    ]


@app.get("/api/problems/{problem_id}")
def get_problem(problem_id: str):
    for p in PROBLEMS:
        if p["id"] == problem_id:
            return {
                "id": p["id"],
                "course": p["course"],
                "title": p["title"],
                "difficulty": p["difficulty"],
                "examples": p["examples"],
            }
    raise HTTPException(status_code=404, detail="Problem not found")


@app.post("/api/prompt/submit")
def submit_prompt(submission: PromptSubmission):
    """
    Core pipeline endpoint:
    1. Look up the problem
    2. Send student's prompt -> LLM Gateway -> generated code
    3. Run generated code -> Sandbox -> pass/fail per hidden test
    4. Return result to the student
    """
    problem = next((p for p in PROBLEMS if p["id"] == submission.problem_id), None)
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")

    generated_code = llm_gateway.generate_code(
        student_prompt=submission.student_prompt,
        problem_description=problem["description"],
        examples=problem["examples"],
    )

    result = sandbox.evaluate(
        code=generated_code,
        function_name=problem["function_name"],
        hidden_tests=problem["hidden_tests"],
    )

    return {
        "problem_id": problem["id"],
        "generated_code": generated_code,
        "result": result.to_dict(),
    }
