import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [problems, setProblems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load problem list on mount (Student flow, step 1: "views Prompt Problem")
  useEffect(() => {
    fetch(`${API_BASE}/problems`)
      .then((res) => res.json())
      .then(setProblems)
      .catch(() => setError("Could not reach backend. Is it running on port 8000?"));
  }, []);

  const selectedProblem = problems.find((p) => p.id === selectedId);

  async function handleSubmit() {
    if (!selectedId || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/prompt/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: selectedId, student_prompt: prompt }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>EduPrompt AI — Prototype</h1>
      <p style={styles.subtitle}>Pick a problem, write a prompt, and see if your prompt gets the LLM to generate correct code.</p>

      <div style={styles.layout}>
        {/* Problem list */}
        <div style={styles.sidebar}>
          <h3>Prompt Problems</h3>
          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => { setSelectedId(p.id); setResult(null); }}
              style={{
                ...styles.problemCard,
                border: selectedId === p.id ? "2px solid #2563eb" : "1px solid #ddd",
              }}
            >
              <strong>{p.title}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>{p.course} · {p.difficulty}</div>
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={styles.main}>
          {!selectedProblem && <p>Select a problem to get started.</p>}

          {selectedProblem && (
            <>
              <h2>{selectedProblem.title}</h2>
              <p style={{ color: "#444" }}>
                Examples (this is all you get — no description of the algorithm):
              </p>
              <ul>
                {selectedProblem.examples.map((ex, i) => (
                  <li key={i}>
                    Input: <code>{ex.input}</code> → Output: <code>{ex.output}</code>
                  </li>
                ))}
              </ul>

              <textarea
                style={styles.textarea}
                rows={5}
                placeholder="Write your prompt here — describe what the function should do based on the examples above..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <button style={styles.button} onClick={handleSubmit} disabled={loading}>
                {loading ? "Running..." : "Submit Prompt"}
              </button>

              {error && <p style={{ color: "crimson" }}>{error}</p>}

              {result && (
                <div style={styles.resultBox}>
                  <h3>
                    {result.result.success ? "✅ Passed" : "❌ Not quite"} —{" "}
                    {result.result.passed}/{result.result.total} hidden tests
                  </h3>

                  <p style={{ fontWeight: 600 }}>Generated code:</p>
                  <pre style={styles.pre}>{result.generated_code}</pre>

                  {result.result.error && (
                    <p style={{ color: "crimson" }}>Error: {result.result.error}</p>
                  )}

                  <p style={{ fontWeight: 600 }}>Test details:</p>
                  {result.result.details.map((d, i) => (
                    <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>
                      {d.passed ? "✅" : "❌"} input={d.input} expected={d.expected} got={d.actual}
                      {d.error ? ` (error: ${d.error})` : ""}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: "system-ui, sans-serif", maxWidth: 1000, margin: "0 auto", padding: 24 },
  h1: { marginBottom: 4 },
  subtitle: { color: "#666", marginTop: 0 },
  layout: { display: "flex", gap: 24, marginTop: 24 },
  sidebar: { width: 220, flexShrink: 0 },
  problemCard: { padding: 10, borderRadius: 8, marginBottom: 8, cursor: "pointer" },
  main: { flex: 1 },
  textarea: { width: "100%", padding: 10, fontSize: 14, marginTop: 12, boxSizing: "border-box" },
  button: { marginTop: 10, padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  resultBox: { marginTop: 20, padding: 16, background: "#f7f7f8", borderRadius: 8 },
  pre: { background: "#111", color: "#0f0", padding: 12, borderRadius: 6, overflowX: "auto" },
};
