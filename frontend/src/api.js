// -----------------------------------------------------------------------
// Mock API layer.
//
// Every function here stands in for a real backend endpoint. Each is
// written so a component only ever calls `api.xyz(...)` and awaits a
// promise — it never touches mock logic directly. That means swapping
// mock -> real backend is a one-file change: rewrite the body of each
// function below to call `fetch(...)` against your teammate's API,
// keeping the same function name and return shape, and nothing in any
// screen component needs to change.
//
// Suggested real endpoints (agree the exact shape with your backend dev):
//   POST /api/prompt/submit        -> submitPrompt()
//   POST /api/instructor/automark  -> runAutoMark()
//   POST /api/instructor/quiz      -> generateQuiz()
//   POST /api/privacy/ask          -> askPrivacyAssistant()
// -----------------------------------------------------------------------

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Student: submit a prompt, get back a rubric-based evaluation.
// If VITE_API_URL is set the real backend is called first (POST /api/prompt/submit);
// otherwise (or on failure) the explainable local rubric below is used.
const API_URL = import.meta.env?.VITE_API_URL;
const CONCEPTS = {
  1: [/even/i, /digit/i], 2: [/subclass|base class|abstract/i, /override|polymorph/i],
  3: [/node/i, /next|pointer/i], 4: [/complexity|O\(|T\(n\)/i, /trace|merge/i], 5: [/interface/i, /abstract/i],
};
const RUBRIC = [
  { id: "format", label: "Output format", w: 20, re: /return|output|print|format|only/i, tip: "Say exactly what to return (e.g. 'return only a function named ...')." },
  { id: "signature", label: "Function signature", w: 15, re: /def |function|signature|named|\w+\(/i, tip: "Name the function/class and its parameters so the sandbox can call it." },
  { id: "edge", label: "Edge cases", w: 20, re: /edge|empty|zero|none|null|negative|single/i, tip: "Mention empty / single-element / boundary inputs explicitly." },
  { id: "examples", label: "Examples used", w: 15, re: /\d|->|=>|input|example/i, tip: "Quote one of the input → output examples inside the prompt." },
  { id: "constraints", label: "Constraints", w: 15, re: /must|should|do not|don't|without|iterative|recursive|complexity|o\(/i, tip: "Add a constraint (iterative, O(n), no extra libraries...)." },
  { id: "clarity", label: "Clear & concise", w: 15, test: (t) => t.length >= 40 && t.length <= 700, tip: "Keep the prompt between ~40 and 700 characters: specific, not rambling." },
];
function localEvaluate(problemId, prompt, llm) {
  const text = prompt.trim(), concept = CONCEPTS[problemId];
  const crit = RUBRIC.map((c) => ({ id: c.id, label: c.label, w: c.w, tip: c.tip, ok: c.test ? c.test(text) : c.re.test(text) }));
  if (concept) crit.push({ id: "concept", label: "Problem concept", w: 20, tip: "Name the key concept this problem tests (see the problem guidance).", ok: concept.every((r) => r.test(text)) });
  const pct = (ids) => { const g = crit.filter((c) => ids.includes(c.id)); const t = g.reduce((a, c) => a + c.w, 0); return t ? Math.round((g.filter((c) => c.ok).reduce((a, c) => a + c.w, 0) / t) * 100) : 0; };
  const total = crit.reduce((a, c) => a + c.w, 0);
  const overall = Math.round((crit.filter((c) => c.ok).reduce((a, c) => a + c.w, 0) / total) * 100);
  const missed = crit.filter((c) => !c.ok);
  const passed = overall >= 70 && (concept ? crit.find((c) => c.id === "concept").ok : true);
  return {
    correctness: pct(["concept", "edge", "examples", "format"]), efficiency: pct(["constraints", "clarity"]), style: pct(["format", "signature", "clarity"]),
    overall, passed, llm, criteria: crit,
    firstFailingTest: passed ? null : `Missing: ${missed[0]?.label || "detail"} — ${missed[0]?.tip || "add more precision."}`,
  };
}
export async function submitPrompt(problemId, prompt, llm = "ChatGPT") {
  if (!prompt || !prompt.trim()) throw new Error("Prompt is required.");
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/prompt/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ problemId, prompt, llm }) });
      if (res.ok) return { llm, ...(await res.json()) };
    } catch { /* fall back to local rubric */ }
  }
  await delay(700);
  return localEvaluate(problemId, prompt, llm);
}

// Teacher: run auto-marking on a queued submission.
// Real version: POST { submissionId } -> { status: 'graded'|'flagged', confidence }
export async function runAutoMark(submissionId) {
  await delay(900);
  const confidence = 86;
  const score = 82;
  return {
    status: confidence < 80 ? "flagged" : "graded",
    confidence,
    score,
    feedback: "Auto-generated: rubric criteria mostly met; check edge-case handling.",
  };
}

// Teacher: manual override of a flagged grade.
// Real version: POST { submissionId } -> { status: 'graded' }
export async function overrideGrade(submissionId) {
  await delay(200);
  return { status: "graded" };
}

// Teacher: generate a quiz from a topic/learning outcome.
// Real version: POST { course, topic } -> { title, course, questions: [{q, type}] }
export async function generateQuiz(course, topic) {
  await delay(900);
  return {
    title: `${topic} — Quick Check`,
    course,
    questions: [
      { q: `Which best describes ${topic.toLowerCase()}?`, type: "MCQ" },
      { q: `Write a one-sentence prompt to make an LLM demonstrate ${topic.toLowerCase()}.`, type: "Short answer" },
      { q: `What's a common mistake students make with ${topic.toLowerCase()}?`, type: "MCQ" },
    ],
  };
}

// Student: ask the privacy assistant a question.
// Real version: POST { question } -> { answer }
export async function askPrivacyAssistant(question) {
  await delay(500);
  const lower = question.toLowerCase();
  let answer;
  if (lower.includes("prompt") && lower.includes("store")) {
    answer =
      "Your prompts are stored so you can review your own attempt history, and to compute class-wide analytics your instructor sees in aggregate — never tied to your name in those reports.";
  } else if (lower.includes("share") || lower.includes("third party")) {
    answer =
      "Your submissions are sent to the LLM provider to generate code, and to nothing else. We don't sell or share data with advertisers.";
  } else if (lower.includes("delete") || lower.includes("remove")) {
    answer =
      "You can request deletion of your attempt history from your account settings; this doesn't affect your recorded grades.";
  } else {
    answer =
      "I can only answer from the platform's own privacy notice — that specific question isn't covered there, so I'd rather not guess. Try asking about storage, sharing, or deletion.";
  }
  return { answer };
}
