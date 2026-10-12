import React, { useState, useRef, useEffect } from "react";
import { Send, ShieldCheck, Bot, UserRound, Trash2 } from "lucide-react";
import { INK, RULE, MUTED, BODY, ACCENT, SOFT } from "../theme.js";
import { SectionHeading, StatusPill } from "../components/Shared.jsx";
import { askPrivacyAssistant } from "../api.js";

const HELLO = { role: "assistant", text: "Ask me anything about how EduPrompt AI collects or uses your data." };
const SUGGESTIONS = ["Are my prompts stored?", "Do you share my data with third parties?", "How do I delete my attempt history?"];

function Avatar({ user }) {
  return <span className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center" style={user ? { background: INK, color: "#fff" } : { background: `linear-gradient(135deg,${ACCENT},#9B72CB)`, color: "#fff" }}>{user ? <UserRound size={15} /> : <Bot size={15} />}</span>;
}

export default function PrivacyAssistant() {
  const [messages, setMessages] = useState([HELLO]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => { boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }); }, [messages, sending]);

  async function send(text = input) {
    const q = text.trim();
    if (!q || sending) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput(""); setSending(true);
    try {
      const { answer } = await askPrivacyAssistant(q);
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "I couldn't retrieve that privacy explanation right now. Please try again." }]);
    } finally { setSending(false); }
  }

  return (
    <div>
      <SectionHeading eyebrow="RAG over the platform's own privacy notice" title="Privacy Assistant"
        trailing={<div className="flex items-center gap-2"><StatusPill tone="success"><ShieldCheck size={11} /> Answers only from the privacy notice</StatusPill><button onClick={() => setMessages([HELLO])} aria-label="Clear chat" title="Clear chat" className="w-9 h-9 flex items-center justify-center" style={{background: "#fff", border: `1px solid ${RULE}`, color: MUTED}}><Trash2 size={14} /></button></div>} />
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${RULE}`, background: "#fff", boxShadow: "0 12px 30px rgba(15,23,42,.06)" }}>
        <div ref={boxRef} className="px-5 py-5 flex flex-col gap-4" style={{ minHeight: 300, maxHeight: 460, overflowY: "auto" }} role="log" aria-live="polite">
          {messages.map((m, i) => {
            const user = m.role === "user";
            return (
              <div key={i} className="flex items-end gap-2.5" style={{ flexDirection: user ? "row-reverse" : "row", animation: "fadeUp .25s ease" }}>
                <Avatar user={user} />
                <div className="px-4 py-2.5 max-w-[75%]" style={{ fontFamily: "DM Sans", fontSize: 13, lineHeight: 1.55, borderRadius: user ? "16px 16px 4px 16px" : "16px 16px 16px 4px", color: user ? "#fff" : BODY, background: user ? `linear-gradient(135deg,${ACCENT},#9B72CB)` : SOFT, border: user ? "none" : `1px solid ${RULE}` }}>{m.text}</div>
              </div>
            );
          })}
          {sending && (
            <div className="flex items-end gap-2.5"><Avatar />
              <div className="px-4 py-3 flex gap-1" style={{ background: SOFT, border: `1px solid ${RULE}`, borderRadius: "16px 16px 16px 4px" }} aria-label="Assistant is typing">
                {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT, animation: `dot 1.1s ${d * 0.15}s infinite` }} />)}
              </div>
            </div>
          )}
        </div>
        {messages.length === 1 && (
          <div className="px-5 pb-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="px-3 py-1.5" style={{ fontFamily: "DM Sans", fontSize: 11, fontWeight: 600, color: ACCENT, background: SOFT, border: "1px solid #D2E3FC", borderRadius: 999 }}>{s}</button>)}
          </div>
        )}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `1px solid ${RULE}`, background: "#F8FAFC" }}>
          <label className="sr-only" htmlFor="privacy-chat-input">Ask the privacy assistant a question</label>
          <input id="privacy-chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={sending ? "Assistant is responding…" : "Ask about data storage, sharing, deletion…"}
            className="flex-1 px-3 py-2.5 outline-none text-[13px]" style={{ fontFamily: "DM Sans", background: "#fff", border: `1px solid ${RULE}`, color: INK }} />
          <button onClick={() => send()} disabled={sending || !input.trim()} aria-label="Send message" className="w-10 h-10 flex items-center justify-center disabled:opacity-50" style={{ background: ACCENT, color: "#fff" }}><Send size={15} /></button>
        </div>
      </div>
    </div>
  );
}
