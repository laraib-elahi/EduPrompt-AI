import React,{useState} from "react";
import { Sparkles,Send,Eye,CheckCircle2,Edit3,ClipboardCheck } from "lucide-react";
import { INK,PAPER,RULE,MUTED,ACCENT,SOFT,MINT,BODY } from "../theme.js";
import { SectionHeading,CourseTag,StatusPill } from "../components/Shared.jsx";
import { COURSES } from "../data/mockData.js";
import { generateQuiz } from "../api.js";

export default function QuizStudio({published,onPublish}) {
 const [topic,setTopic]=useState(""),[course,setCourse]=useState(COURSES[0]),[generating,setGenerating]=useState(false),[quiz,setQuiz]=useState(null),[submitted,setSubmitted]=useState(false),[error,setError]=useState("");
 async function handleGenerate(){if(!topic.trim())return;setGenerating(true);setSubmitted(false);setError("");try{setQuiz(await generateQuiz(course,topic));}catch(e){setError("Quiz generation failed. Please check the topic and try again.");}finally{setGenerating(false);}}
 function submit(){if(!quiz)return;onPublish(quiz);setSubmitted(true);setQuiz(null);setTopic("");}
 return <div>
  <SectionHeading eyebrow="Create · review · submit" title="Quiz Studio" trailing={<StatusPill tone="info"><Sparkles size={11}/> AI-assisted quiz creation</StatusPill>}/>
  {error&&<div className="mb-5 px-4 py-3 rounded-xl" style={{background:"#FFF1F2",border:"1px solid #FECDD3",fontFamily:"DM Sans",fontSize:12,color:"#9F1239"}}>{error}</div>}
  {submitted&&<div className="mb-5 px-4 py-3 rounded-xl flex items-center gap-2" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",fontFamily:"DM Sans",fontSize:12,color:"#047857"}}><CheckCircle2 size={15}/> Quiz submitted successfully and published to students.</div>}
  <div className="p-5 rounded-2xl mb-7" style={{background:"linear-gradient(135deg,#FFFFFF,#F5F3FF)",border:`1px solid ${RULE}`,boxShadow:"0 12px 30px rgba(66,133,244,.07)"}}>
   <div className="flex items-center gap-2 mb-4"><ClipboardCheck size={16} color={ACCENT}/><div style={{fontFamily:"Manrope",fontWeight:800,fontSize:14,color:INK}}>Build a quiz</div></div>
   <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-4 items-end">
    <div><label className="block text-[10px] uppercase tracking-wider mb-1" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>Course</label><select value={course} onChange={e=>setCourse(e.target.value)} className="w-full px-3 py-2.5" style={{fontFamily:"DM Sans",fontSize:12,border:`1px solid ${RULE}`,background:PAPER}}>{COURSES.map(c=><option key={c}>{c}</option>)}</select></div>
    <div><label className="block text-[10px] uppercase tracking-wider mb-1" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>Topic / learning outcome</label><input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGenerate()} placeholder="e.g. Recursion base cases" className="w-full px-3 py-2.5" style={{fontFamily:"DM Sans",fontSize:12,border:`1px solid ${RULE}`,background:PAPER}}/></div>
    <button onClick={handleGenerate} disabled={generating||!topic.trim()} className="px-4 py-2.5 flex items-center justify-center gap-2 rounded-xl" style={{fontFamily:"DM Sans",fontSize:11,fontWeight:800,color:"#fff",background:!topic.trim()?"#CBD5E1":`linear-gradient(135deg,${ACCENT},#9B72CB)`}}><Sparkles size={13}/>{generating?"Generating…":"Generate Quiz"}</button>
   </div>
  </div>
  {quiz&&<div className="rounded-2xl overflow-hidden mb-8" style={{border:`1px solid ${RULE}`,background:"#fff",boxShadow:"0 12px 30px rgba(15,23,42,.05)"}}>
    <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-2" style={{background:"linear-gradient(135deg,#E8F0FE,#F5F3FF)",borderBottom:`1px solid ${RULE}`}}><div><div style={{fontFamily:"Manrope",fontWeight:800,fontSize:16,color:INK}}>{quiz.title}</div><div className="mt-2"><CourseTag course={quiz.course}/></div></div><StatusPill tone="warning"><Eye size={11}/> Review before submitting</StatusPill></div>
    <div className="px-5 py-3" style={{background:"#FFFBEB",fontFamily:"DM Sans",fontSize:11,color:"#92400E"}}>Teacher review checkpoint: inspect every generated question before submitting the quiz to students.</div>
    {quiz.questions.map((q,i)=><div key={i} className="px-5 py-4" style={{borderBottom:i<quiz.questions.length-1?`1px solid ${RULE}`:"none"}}><div className="flex gap-3"><span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:"#F1F5F9",fontFamily:"IBM Plex Mono",fontSize:10,color:MUTED}}>Q{i+1}</span><div><div style={{fontFamily:"DM Sans",fontWeight:700,fontSize:13,color:INK}}>{q.q}</div><div className="mt-1" style={{fontFamily:"IBM Plex Mono",fontSize:9,color:MUTED}}>{q.type}</div></div></div></div>)}
    <div className="px-5 py-4 flex justify-end gap-2" style={{background:"#F8FAFC",borderTop:`1px solid ${RULE}`}}><button onClick={()=>setQuiz(null)} className="px-3 py-2" style={{fontFamily:"DM Sans",fontSize:11,color:BODY,border:`1px solid ${RULE}`,background:"#fff"}}><Edit3 size={12} className="inline mr-1"/>Discard draft</button><button onClick={submit} className="px-5 py-2.5 rounded-xl flex items-center gap-1.5" style={{fontFamily:"DM Sans",fontSize:11,fontWeight:800,color:"#fff",background:`linear-gradient(135deg,${MINT},#0F766E)`,boxShadow:"0 8px 18px rgba(5,150,105,.2)"}}><Send size={12}/> Submit Quiz</button></div>
  </div>}
  <div className="flex items-center justify-between mb-3"><div style={{fontFamily:"Manrope",fontWeight:800,fontSize:14,color:INK}}>Published quizzes</div><span style={{fontFamily:"IBM Plex Mono",fontSize:10,color:MUTED}}>{published.length} live</span></div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{published.length===0?<div className="px-5 py-7 rounded-2xl text-[12px]" style={{color:MUTED,border:`1px solid ${RULE}`,background:"#fff"}}>Generate a quiz above to create your first assessment.</div>:published.map((p)=><div key={p.id} className="p-5 rounded-2xl" style={{border:`1px solid ${RULE}`,background:"#fff"}}><div className="flex items-center justify-between gap-2"><CourseTag course={p.course}/><StatusPill tone="success"><CheckCircle2 size={11}/> Live</StatusPill></div><div className="mt-3" style={{fontFamily:"Manrope",fontWeight:800,fontSize:14,color:INK}}>{p.title}</div><div className="mt-1" style={{fontFamily:"DM Sans",fontSize:10,color:MUTED}}>{p.questions.length} questions · Students submit → auto-mark → teacher review</div></div>)}</div>
 </div>
}
