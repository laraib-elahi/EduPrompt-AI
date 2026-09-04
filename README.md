# EduPrompt AI — Prototype (D1)

A minimal working vertical slice of the platform described in the
FYDP proposal: student picks a Prompt Problem, writes a prompt, the
backend sends it to an LLM, generated code runs against hidden tests
in a sandbox, and the result is shown back to the student.

## Tech stack
- Frontend: React + Vite
- Backend: FastAPI (Python)
- LLM: Anthropic API (optional — runs in STUB mode without a key)
- Sandbox: subprocess-based (see `backend/docker_sandbox_notes.md` for
  how to upgrade to real Docker isolation later)

## Prerequisites
- Node.js 18+ (https://nodejs.org)
- Python 3.10+
- VS Code (https://code.visualstudio.com)

## 1. Backend setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Optional: copy .env.example to .env and add your Anthropic API key
# to use real LLM generation instead of the stub response.
cp .env.example .env

uvicorn main:app --reload --port 8000
```

Backend now running at http://localhost:8000
Check it's alive: http://localhost:8000/api/health

## 2. Frontend setup (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend now running at http://localhost:5173 — open this in your browser.

## 3. Try it
1. Pick a problem from the sidebar (e.g. "Reverse a String")
2. Write a prompt describing what the function should do, based on the
   examples shown
3. Click "Submit Prompt"
4. See the generated code and pass/fail results against hidden tests

If you haven't set an API key yet, you'll see a stub response — that's
expected, and lets you build/demo the full pipeline before connecting
a real LLM.

## Project structure
```
eduprompt-ai/
├── backend/
│   ├── main.py              # FastAPI app & routes
│   ├── llm_gateway.py       # Sends prompts to LLM, gets code back
│   ├── sandbox.py           # Runs generated code against hidden tests
│   ├── data/problems.json   # Sample Prompt Problems
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/App.jsx          # Main UI
│   └── ...
└── docker-compose.yml       # Postgres, for when you add persistence
```

## Next steps toward your D1 milestones
- [ ] Add user auth (student/instructor login)
- [ ] Persist submissions to Postgres instead of in-memory
- [ ] Add more Prompt Problems for OOP / Data Structures / AoA
- [ ] Add the Guidance Engine (hints after failed attempts)
- [ ] Swap subprocess sandbox for real Docker isolation (see notes)
