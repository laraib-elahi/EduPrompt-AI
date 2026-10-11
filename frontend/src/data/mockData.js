export const COURSES = ["ITP", "OOP", "Data Structures", "Analysis of Algorithms"];

export const INITIAL_QUEUE = [
  { id: 1, student: "Bintul H.", course: "OOP", assignment: "Assignment 3 — Inheritance", submitted: "2h ago", status: "queued" },
  { id: 2, student: "Sadia D.", course: "ITP", assignment: "Lab 5 — Loops & Prompts", submitted: "3h ago", status: "queued" },
  { id: 3, student: "Abeeha T.", course: "Data Structures", assignment: "HW 2 — Linked Lists", submitted: "5h ago", status: "queued" },
  { id: 4, student: "Laraib E.", course: "Analysis of Algorithms", assignment: "PS 1 — Big-O Proofs", submitted: "6h ago", status: "queued" },
  { id: 5, student: "Hamza R.", course: "OOP", assignment: "Assignment 3 — Inheritance", submitted: "8h ago", status: "queued" },
  { id: 6, student: "Zainab K.", course: "ITP", assignment: "Lab 5 — Loops & Prompts", submitted: "9h ago", status: "queued" },
];

const BASE = [
  {
    id: 1,
    course: "ITP",
    title: "Sum of Even Digits",
    description: "Write a prompt that guides an LLM to produce a function that sums only the even digits of an integer.",
    difficulty: "Easy",
    attempts: 214,
    passRate: 78,
    examples: [
      { input: "4586", output: "10" },
      { input: "13579", output: "0" },
      { input: "2048", output: "14" },
    ],
  },
  {
    id: 2,
    course: "OOP",
    title: "Polymorphic Shape Area",
    description: "Write a prompt that makes an LLM model shape polymorphism with separate area behavior.",
    difficulty: "Medium",
    attempts: 158,
    passRate: 61,
    examples: [
      { input: "Circle(r=3)", output: "28.27" },
      { input: "Rectangle(w=4,h=5)", output: "20.0" },
    ],
  },
  {
    id: 3,
    course: "Data Structures",
    title: "Reverse a Linked List",
    description: "Write a prompt that guides an LLM to reverse a linked list while handling empty and single-node cases.",
    difficulty: "Medium",
    attempts: 189,
    passRate: 54,
    examples: [
      { input: "1 -> 2 -> 3 -> None", output: "3 -> 2 -> 1 -> None" },
      { input: "None", output: "None" },
    ],
  },
  {
    id: 4,
    course: "Analysis of Algorithms",
    title: "Merge Sort Trace",
    description: "Write a prompt that asks for a merge-sort trace together with the required complexity reasoning.",
    difficulty: "Hard",
    attempts: 97,
    passRate: 39,
    examples: [{ input: "[5, 2, 9, 1]", output: "[1, 2, 5, 9], T(n)=O(n log n)" }],
  },
  {
    id: 5,
    course: "OOP",
    title: "Interface vs. Abstract Class",
    description: "Write a prompt that makes an LLM demonstrate the difference between an interface and an abstract class.",
    difficulty: "Easy",
    attempts: 176,
    passRate: 82,
    examples: [{ input: "Vehicle (abstract), Flyable (interface)", output: "compiles, correct override" }],
  },
];

export const COMMON_MISTAKES = [
  { course: "OOP", mistake: "Prompt omits constructor signature — LLM invents fields", pct: 34 },
  { course: "ITP", mistake: "Vague I/O spec leads to off-by-one loop bounds", pct: 41 },
  { course: "Data Structures", mistake: "No edge-case mention for empty/single-node list", pct: 29 },
  { course: "Analysis of Algorithms", mistake: "Asks for code, not proof — LLM skips complexity analysis", pct: 47 },
];

export const TACTICS = [
  { name: "Use delimiters", tip: "Wrap the I/O examples in triple backticks so the model treats them as literal data, not prose." },
  { name: "Ask for structured output", tip: 'Request "return only a function named X" so the sandbox can call it directly.' },
  { name: "State edge cases", tip: "Name empty input, single-element, and boundary cases explicitly — models skip them otherwise." },
  { name: "Multi-step prompting", tip: "For hard problems, ask for a plan first, then ask it to implement the plan." },
];

export function statusMeta(status) {
  if (status === "graded") return { color: "#059669", label: "Graded" };
  if (status === "needs_review") return { color: "#D97706", label: "Needs review" };
  if (status === "flagged") return { color: "#E11D48", label: "Flagged" };
  return { color: "#E29A0C", label: "Queued" };
}

export const LLMS = ["ChatGPT", "Gemini", "DeepSeek", "Claude"];
export const STUDENTS = ["Bintul H.", "Sadia D.", "Abeeha T.", "Laraib E.", "Hamza R.", "Zainab K."];

// Guidance is specific to each problem (not the general tactic library).
const GUIDE = {
  1: ["Say the input is an integer and the output is a single integer.", "Tell the model 0 is even, and to ignore odd digits.", "Mention negative numbers if they should be handled."],
  2: ["Name the base class and both subclasses with their constructor fields.", "Ask for area() overridden in each subclass, not one if/else function.", "Specify rounding to 2 decimals."],
  3: ["Give the Node class fields (val, next) so the model doesn't invent its own.", "Explicitly ask for the empty list and single-node cases.", "Ask for an iterative solution with three pointers."],
  4: ["Ask for the recursion trace first, complexity proof second.", "State the split rule (mid = len // 2) so traces are comparable.", "Request T(n) = 2T(n/2) + O(n) written out."],
  5: ["Ask for both declarations before any usage code.", "Say which method the interface forces and which the abstract class implements."],
};
const FAIL = { 3: "46% of failures happen on the empty-list test — the prompt gives no hint for it.", 4: "Most attempts get code but no complexity proof — problem statement never asks for one." };
// Course > Topic > Subtopic hierarchy for each prompt problem
const TAX = { 1: ["Loops & Numbers", "Digit Manipulation"], 2: ["Inheritance & Polymorphism", "Polymorphism"], 3: ["Linked Lists", "Reversal"], 4: ["Sorting Algorithms", "Merge Sort"], 5: ["Inheritance & Polymorphism", "Abstraction"] };
export const PROBLEMS = BASE.map((p) => ({ ...p, topic: TAX[p.id]?.[0] || "General", subtopic: TAX[p.id]?.[1] || "General", guidance: GUIDE[p.id] || [], failNote: FAIL[p.id] || "" }));

export const STUDENT_STATS = [
  { name: "Bintul H.", solved: 4, attempts: 19, avg: 82 },
  { name: "Sadia D.", solved: 3, attempts: 16, avg: 74 },
  { name: "Abeeha T.", solved: 2, attempts: 22, avg: 61 },
  { name: "Laraib E.", solved: 3, attempts: 14, avg: 77 },
  { name: "Hamza R.", solved: 1, attempts: 18, avg: 48 },
  { name: "Zainab K.", solved: 2, attempts: 11, avg: 66 },
];
