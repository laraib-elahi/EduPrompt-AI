import React, { useState } from "react";
import { Layers, BookOpen, FolderTree, Pencil, Terminal, ChevronRight, Check, XCircle } from "lucide-react";
import { INK, RULE, MUTED, BODY, ACCENT, SOFT, MINT, RUST } from "../theme.js";
import { StatusPill } from "./Shared.jsx";
import { submitPrompt } from "../api.js";
import { LLMS } from "../data/mockData.js";

const uniq = (a) => [...new Set(a)];

function Pills({ icon: I, label, items, value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <span className="flex items-center gap-1.5 w-24" style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: MUTED }}><I size={12} />{label}</span>
      {items.map((x) => (
        <button key={x} onClick={() => onChange(x)} aria-pressed={value === x} className="px-3.5 py-1.5"
          style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 600, borderRadius: 999, color: value === x ? "#fff" : BODY, background: value === x ? `linear-gradient(135deg,${ACCENT},#9B72CB)` : "#fff", border: `1px solid ${value === x ? "transparent" : RULE}` }}>{x}</button>
      ))}
    </div>
  );
}

function Examples({ p }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${RULE}` }}>
      <div className="px-4 py-2" style={{ background: SOFT, fontFamily: "IBM Plex Mono", fontSize: 10, color: ACCENT }}>INPUT → OUTPUT</div>
      {p.examples.map((ex, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2.5" style={{ fontFamily: "IBM Plex Mono", fontSize: 12, borderTop: `1px solid ${RULE}` }}>
          <span style={{ color: INK }}>{ex.input}</span><ChevronRight size={13} color={MUTED} /><span style={{ color: BODY }}>{ex.output}</span>
        </div>
      ))}
    </div>
  );
}

function StudentCard({ p, onAttempt }) {
  const [text, setText] = useState(""), [llm, setLlm] = useState(LLMS[0]), [busy, setBusy] = useState(false), [r, setR] = useState(null);
  async function run() {
    if (!text.trim() || busy) return;
    setBusy(true); setR(null);
    try { const x = await submitPrompt(p.id, text, llm); setR(x); onAttempt && onAttempt(p.id, x.passed); }
    catch { setR({ error: true }); } finally { setBusy(false); }
  }
  return (
    <div className="p-5 rounded-2xl" style={{ background: "#fff", border: `1px solid ${RULE}`, boxShadow: "0 8px 24px rgba(15,23,42,.05)" }}>
      <div className="flex items-start justify-between gap-3 mb-1"><div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 16, color: INK }}>{p.title}</div><StatusPill tone={p.difficulty === "Hard" ? "danger" : p.difficulty === "Medium" ? "warning" : "info"}>{p.difficulty}</StatusPill></div>
      <div className="mb-4" style={{ fontFamily: "DM Sans", fontSize: 12, color: BODY }}>{p.description}</div>
      <Examples p={p} />
      <label className="block mt-4 mb-1.5" htmlFor={`pb-${p.id}`} style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: MUTED }}>YOUR PROMPT</label>
      <textarea id={`pb-${p.id}`} rows={4} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(); }} placeholder="Write your prompt here…" className="w-full px-4 py-3" style={{ fontFamily: "IBM Plex Mono", fontSize: 12, border: `1px solid ${RULE}`, background: "#F8FAFD", color: INK }} />
      <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
        <select aria-label="LLM" value={llm} onChange={(e) => setLlm(e.target.value)} className="px-3 py-2" style={{ fontFamily: "DM Sans", fontSize: 11, border: `1px solid ${RULE}`, background: "#fff", color: INK }}>{LLMS.map((m) => <option key={m}>{m}</option>)}</select>
        <button onClick={run} disabled={busy || !text.trim()} className="px-4 py-2.5 flex items-center gap-2" style={{ fontFamily: "DM Sans", fontSize: 12, fontWeight: 700, color: "#fff", background: !text.trim() ? "#CBD5E1" : `linear-gradient(135deg,${ACCENT},#9B72CB)` }}><Terminal size={13} />{busy ? "Evaluating…" : "Run prompt"}</button>
      </div>
      {r && (r.error ? <div className="mt-3 text-[12px]" style={{ color: RUST }}>Could not evaluate. Try again.</div> :
        <div className="mt-3 px-4 py-3 rounded-xl flex items-center gap-3 flex-wrap" style={{ background: r.passed ? "#E6F4EA" : "#FCE8E6", border: `1px solid ${r.passed ? "#A8DAB5" : "#F6AEA9"}` }}>
          {r.passed ? <Check size={15} color={MINT} /> : <XCircle size={15} color={RUST} />}
          <b style={{ fontFamily: "Manrope", fontSize: 13, color: INK }}>{r.passed ? "Passed" : "Needs improvement"}</b>
          <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: BODY }}>Correctness {r.correctness} · Efficiency {r.efficiency} · Style {r.style}</span>
          {!r.passed && <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: RUST }}>{r.firstFailingTest}</span>}
        </div>)}
    </div>
  );
}

function TeacherCard({ p, onEdit }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: "#fff", border: `1px solid ${RULE}`, boxShadow: "0 8px 24px rgba(15,23,42,.05)" }}>
      <div className="flex items-start justify-between gap-3 mb-1"><div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 16, color: INK }}>{p.title}</div><StatusPill tone={p.passRate >= 70 ? "success" : p.passRate >= 50 ? "warning" : "danger"}>{p.passRate}% pass</StatusPill></div>
      <div className="mb-4" style={{ fontFamily: "DM Sans", fontSize: 12, color: BODY }}>{p.description}</div>
      <Examples p={p} />
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2"><span style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: MUTED }}>{p.difficulty} · {p.attempts} attempts · {(p.guidance || []).length} guidance points</span>
        {onEdit && <button onClick={() => onEdit(p.id)} className="px-3 py-2 flex items-center gap-1" style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 700, color: ACCENT, background: SOFT }}><Pencil size={12} /> Edit prompt</button>}</div>
    </div>
  );
}

export default function CourseExplorer({ problems, mode = "student", onAttempt, onEdit }) {
  const [sel, setSel] = useState({});
  const courses = uniq(problems.map((p) => p.course));
  const course = courses.includes(sel.course) ? sel.course : courses[0];
  const topics = uniq(problems.filter((p) => p.course === course).map((p) => p.topic));
  const topic = topics.includes(sel.topic) ? sel.topic : topics[0];
  const subs = uniq(problems.filter((p) => p.course === course && p.topic === topic).map((p) => p.subtopic));
  const sub = subs.includes(sel.sub) ? sel.sub : subs[0];
  const list = problems.filter((p) => p.course === course && p.topic === topic && p.subtopic === sub);
  return (
    <div>
      <div className="p-4 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg,#fff,#F3F7FE)", border: `1px solid ${RULE}` }}>
        <Pills icon={Layers} label="COURSE" items={courses} value={course} onChange={(v) => setSel({ course: v })} />
        <Pills icon={BookOpen} label="TOPIC" items={topics} value={topic} onChange={(v) => setSel({ course, topic: v })} />
        <Pills icon={FolderTree} label="SUB TOPIC" items={subs} value={sub} onChange={(v) => setSel({ course, topic, sub: v })} />
      </div>
      <div className="mb-3" style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: MUTED }}>{course} › {topic} › {sub} · {list.length} PROMPT PROBLEM{list.length === 1 ? "" : "S"}</div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {list.map((p) => mode === "teacher" ? <TeacherCard key={p.id} p={p} onEdit={onEdit} /> : <StudentCard key={p.id} p={p} onAttempt={onAttempt} />)}
      </div>
    </div>
  );
}
