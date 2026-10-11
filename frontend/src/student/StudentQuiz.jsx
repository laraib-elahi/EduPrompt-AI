import React, { useState } from "react";
import { CheckCircle2, Send, ArrowLeft, Sparkles } from "lucide-react";
import { INK, PAPER, RULE, MINT, MUTED, BODY, ACCENT, SOFT } from "../theme.js";
import { SectionHeading, CourseTag, StatusPill } from "../components/Shared.jsx";

export default function StudentQuiz({ student, published, submittedIds, onSubmit }) {
  const [openId, setOpenId] = useState(null);
  const [answers, setAnswers] = useState({});
  const quiz = openId ? published.find(q=>q.id===openId) : null;
  const done = quiz ? quiz.questions.filter((_,i)=>(answers[i]||"").trim()).length : 0;

  function submit(){ if(!quiz||done<quiz.questions.length)return; onSubmit(quiz,answers); setOpenId(null); setAnswers({}); }

  if (quiz) return <div>
    <button onClick={()=>setOpenId(null)} className="text-[12px] mb-6 flex items-center gap-1" style={{fontFamily:"DM Sans",color:MUTED}}><ArrowLeft size={13}/> All quizzes</button>
    <SectionHeading eyebrow={`${quiz.course} · ${student}`} title={quiz.title} trailing={<StatusPill tone="info"><Sparkles size={11}/> Complete & submit</StatusPill>}/>
    <div className="p-4 rounded-2xl mb-5" style={{background:SOFT,border:"1px solid #D2E3FC"}}><div style={{fontFamily:"DM Sans",fontSize:12,color:BODY}}>Answer every question, then use <b>Submit Quiz</b>. Your submission goes to the teacher's Auto-Marking queue for review.</div></div>
    <div className="mb-5"><div className="flex justify-between mb-1.5" style={{fontFamily:"IBM Plex Mono",fontSize:10,color:MUTED}}><span>PROGRESS</span><span>{done}/{quiz.questions.length} ANSWERED</span></div><div className="h-2 rounded-full overflow-hidden" style={{background:"#E2E8F0"}}><div className="h-2 rounded-full" style={{width:`${(done/quiz.questions.length)*100}%`,background:`linear-gradient(90deg,${ACCENT},#10B981)`,transition:"width .3s ease"}}/></div></div>
    <div className="flex flex-col gap-4">
      {quiz.questions.map((q,i)=><div key={i} className="p-5 rounded-2xl" style={{border:`1px solid ${RULE}`,background:"#fff",boxShadow:"0 8px 24px rgba(15,23,42,.04)"}}>
        <div className="flex gap-3"><span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"#E8F0FE",color:ACCENT,fontFamily:"IBM Plex Mono",fontSize:10}}>Q{i+1}</span><div className="flex-1"><div style={{fontFamily:"Manrope",fontWeight:700,fontSize:14,color:INK}}>{q.q}</div><div className="mt-1"><StatusPill tone="neutral">{q.type}</StatusPill></div></div></div>
        <textarea aria-label={`Answer ${i+1}`} rows={3} value={answers[i]||""} onChange={e=>setAnswers({...answers,[i]:e.target.value})} className="w-full px-3 py-2.5 mt-4" style={{fontFamily:"DM Sans",fontSize:13,border:`1px solid ${RULE}`,background:PAPER,color:INK}} placeholder="Write your answer…" />
      </div>)}
    </div>
    <div className="mt-6 flex justify-end items-center gap-3">{done<quiz.questions.length&&<span style={{fontFamily:"DM Sans",fontSize:11,color:MUTED}}>Answer all questions to submit</span>}<button onClick={submit} disabled={done<quiz.questions.length} className="px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50" style={{fontFamily:"DM Sans",fontSize:12,fontWeight:800,color:"#fff",background:`linear-gradient(135deg,${ACCENT},#9B72CB)`,boxShadow:"0 8px 20px rgba(66,133,244,.25)"}}><Send size={14}/> Submit Quiz</button></div>
  </div>;

  return <div>
    <SectionHeading eyebrow={`Assessment workspace · ${student}`} title="Quizzes" trailing={<StatusPill tone="success"><CheckCircle2 size={11}/> Teacher-reviewed results appear in My Progress</StatusPill>}/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {published.length===0&&<div className="p-7 rounded-2xl" style={{fontFamily:"DM Sans",color:MUTED,border:`1px solid ${RULE}`,background:"#fff"}}>No quizzes published yet.</div>}
      {published.map((p)=><div key={p.id} className="p-5 rounded-2xl" style={{border:`1px solid ${RULE}`,background:"#fff",boxShadow:"0 8px 24px rgba(15,23,42,.04)"}}>
        <div className="flex items-center justify-between gap-3"><CourseTag course={p.course}/>{submittedIds.includes(p.id)?<StatusPill tone="success">Submitted</StatusPill>:<StatusPill tone="info">Ready</StatusPill>}</div>
        <div className="mt-4" style={{fontFamily:"Manrope",fontWeight:800,fontSize:16,color:INK}}>{p.title}</div>
        <div className="mt-2" style={{fontFamily:"DM Sans",fontSize:11,color:MUTED}}>{p.questions.length} questions · Teacher review required after auto-marking</div>
        <button disabled={submittedIds.includes(p.id)} onClick={()=>setOpenId(p.id)} className="mt-5 w-full py-2.5 rounded-xl" style={{fontFamily:"DM Sans",fontSize:11,fontWeight:800,color:submittedIds.includes(p.id)?MUTED:"#fff",background:submittedIds.includes(p.id)?"#F1F5F9":ACCENT}}>{submittedIds.includes(p.id)?"Already submitted":"Start Quiz"}</button>
      </div>)}
    </div>
  </div>;
}
