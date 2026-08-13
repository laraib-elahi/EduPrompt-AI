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
trustworthy-ta-agent/
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

```bash
cd backend
python -m venv venv
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
| Bintul Huda  | Scrum Master / Backend       |
| Sadia Daud   | Database / DevOps / Privacy  |
| Abeeha Tariq | LLM Integration / Evaluation |
| Laraib Elahi | Product Owner / Frontend     |

