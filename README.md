# EduPrompt AI

**EduPrompt AI** is an AI-powered educational platform designed to help students learn effective prompt engineering while supporting instructors with automated grading, quiz generation, and learning analytics.

## Project Overview

The system initially focuses on:

* Introduction to Programming (ITP)
* Object-Oriented Programming (OOP)
* Data Structures
* Analysis of Algorithms

### Key Features

* Course-specific prompt problems
* LLM-based code generation
* Automated code evaluation
* Hidden test-case evaluation
* Prompting guidance and adaptive hints
* Automated assignment grading
* Quiz generation and grading
* Privacy Assistant
* Student and Instructor dashboards

## Technology Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** FastAPI / Node.js
* **Database:** PostgreSQL, MongoDB
* **AI:** Large Language Models (LLMs)
* **Sandbox:** Docker
* **Tools:** Git, GitHub, Postman

## Repository Structure

```text
EdupromptAI/
├── frontend/       # React frontend
├── backend/        # Backend and AI services
├── docs/           # Project documentation
├── .gitignore
└── README.md
```

## Setup

### Prerequisites

* Python
* Node.js
* Git
* PostgreSQL
* MongoDB
* Docker

### Backend



## 2. Frontend setup (in a second terminal)
=======
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend


```bash
cd frontend
npm install
npm run dev
```

<<<<<<< HEAD
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
=======
## Environment Variables

Create a `.env` file for sensitive configuration such as:

```env
DATABASE_URL=
MONGODB_URL=
LLM_API_KEY=
```

Do not upload API keys or passwords to GitHub.

## GitHub Workflow

The project uses a `main` branch and feature branches:

```text
main
feature/frontend
feature/backend
feature/llm-gateway
feature/database
feature/sandbox
```

Development work is completed on feature branches and merged into `main` after review.

## Team

| Name         | Role                         |
| ------------ | ---------------------------- |
| Sadia daud   | Scrum Master / Backend       |
| Bintul huda | Database / DevOps / Privacy  |
| Abeeha Tariq | LLM Integration / Evaluation |
| Laraib Elahi | Product Owner / Frontend     
