# EduPrompt AI

**EduPrompt AI: An Intelligent Platform for Adaptive Student Learning and Automated Teacher Workflows Using Large Language Models**

EduPrompt AI is a Final Year Design Project (FYDP) developed by Software Engineering students at the University of the Punjab, Lahore, Pakistan. The project aims to help students develop effective prompt-engineering skills while supporting instructors through AI-assisted assignment grading, quiz generation, and learning analytics.

## Project Overview

Students increasingly use Large Language Models (LLMs) to generate code, but they may struggle to write effective prompts or evaluate generated results. EduPrompt AI aims to address this challenge through structured, course-specific Prompt Problems, automated code evaluation, and scaffolded prompting guidance.

The platform also aims to reduce instructors' workload through automated marking and quiz workflows, while helping students understand how their data is collected and used.

## Target Courses

* Introduction to Programming (ITP)
* Object-Oriented Programming (OOP)
* Data Structures
* Analysis of Algorithms

## Key Modules

### 1. Input Domain — Prompt Problems

Course-specific programming challenges presented through input-output examples, supported by hidden test suites.

### 2. LLM Gateway

Sends student prompts to a Large Language Model API and receives generated code for evaluation.

### 3. Code Evaluation Sandbox

Executes generated code in an isolated environment and evaluates correctness, runtime, and style against test cases.

### 4. Guidance Engine

Provides prompting tips, structured prompt templates, and adaptive hints to help students improve their prompts.

### 5. Automated Marking

Supports rubric-based grading of assignments, with confidence scores and manual review of flagged results.

### 6. Quiz Generation and Grading

Generates course-specific quizzes and evaluates student responses.

### 7. Privacy Assistant

Provides conversational answers about the platform's privacy notice and how student data is collected and used.

### 8. Student and Instructor Dashboards

Aims to provide student progress tracking and instructor analytics, including success rates, attempts, grading summaries, and common mistakes.

*These modules describe the project's intended scope. Their availability depends on implementation progress.*

## Technology Stack

The proposed technology stack includes:

| Layer             | Technologies                 |
| ----------------- | ---------------------------- |
| Frontend          | React, Tailwind CSS, Vite    |
| Backend           | FastAPI / Node.js (Express)  |
| AI Integration    | Large Language Models (LLMs) |
| Code Execution    | Docker-based sandbox         |
| Databases         | PostgreSQL, MongoDB          |
| Development Tools | Git, GitHub, Docker, Postman |

The final backend framework and service configuration depend on the implementation selected for each component.

## Repository Structure

```text
EduPrompt-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── student/
│   │   ├── teacher/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
├── docs/
├── docker-compose.yml
├── .gitignore
└── README.md
```

The frontend structure shown above reflects the current frontend source organization. The backend and documentation contents depend on the files maintained in the repository.

## Prerequisites

To run the frontend locally, you need:

* Node.js
* npm
* Git

Additional dependencies, such as Python, Docker, PostgreSQL, or MongoDB, may be required when running the corresponding backend services.

## Frontend Setup

### 1. Clone the repository

```bash
git clone https://github.com/laraib-elahi/EduPrompt-AI.git
cd EduPrompt-AI
```

### 2. Switch to the frontend development branch

The updated frontend is available on `feature/frontend`.

```bash
git checkout feature/frontend
```

### 3. Navigate to the frontend directory

```bash
cd frontend
```

### 4. Install dependencies

```bash
npm install
```

### 5. Start the development server

```bash
npm run dev
```

Vite will display a local development URL in the terminal, usually:

```text
http://localhost:5173/
```

Open that URL in your browser.

### 6. Create a production build

To verify and build the frontend for production, run:

```bash
npm run build
```

The generated production files are placed in the `dist/` directory.

## Backend Setup

Backend setup depends on the framework and entry point implemented in the `backend/` directory.

For a Python backend that includes a `requirements.txt` file, a typical Windows setup is:

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Start the backend using the entry point and command documented by the backend implementation.

For a Node.js backend, follow the scripts and dependencies defined in its `package.json`.

**Note:** The commands above are general setup examples. Verify the actual backend files before running them.

## Environment Variables and Security

Backend services may require environment variables for database connections and AI API access.

If the project provides an `.env.example` file, use it as the reference for local configuration. Example variables may include:

```env
DATABASE_URL=
MONGODB_URL=
LLM_API_KEY=
```

The required variable names depend on the implementation.

**Security guidelines:**

* Never commit API keys, passwords, or database credentials to GitHub.
* Keep local `.env` files excluded from version control.
* Use environment variables for sensitive configuration.

## Development Methodology

The project follows the Agile Scrum methodology with two-week sprints.


## Team Members

| Team Member  | Roll Number | Role                                   |
| ------------ | ----------- | -------------------------------------- |
| Sadia daud  | BSEF23M034  | Scrum Master / Backend Lead            |
| Bintul Huda  | BSEF23M052  | Database, DevOps & Privacy Module Lead |
| Abeeha Tariq | BSEF23M040  | LLM Integration & Evaluation Lead      |
| Laraib Elahi | BSEF23A013  | Product Owner / Frontend Lead          |

