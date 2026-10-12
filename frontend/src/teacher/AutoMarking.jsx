import React,{useState} from "react";
import { Sparkles, ShieldCheck, Eye, CheckCircle2, Clock3, FileText } from "lucide-react";
import { INK,PAPER,RULE,MUTED,BODY,ACCENT,MINT,AMBER,RUST,SOFT } from "../theme.js";
import { SectionHeading,CourseTag,StatusPill,MetricCard } from "../components/Shared.jsx";
import { statusMeta } from "../data/mockData.js";
import { runAutoMark } from "../api.js";

export default function AutoMarking({queue,setQueue,onApprove}) {
  const [markingId,setMarkingId]=useState(null),[reviewId,setReviewId]=useState(null),[score,setScore]=useState(0),[feedback,setFeedback]=useState(""),[error,setError]=useState("");

  async function run(id){setMarkingId(id);setError("");try{const r=await runAutoMark(id);setQueue(prev=>prev.map(x=>x.id===id?{...x,...r,status:"needs_review",reviewed:false}:x));}catch(e){setError("Auto-marking could not be completed. Please run it again.");}finally{setMarkingId(null);}}
  function openReview(item){setReviewId(item.id);setScore(item.score??0);setFeedback(item.feedback||"");}
  function approve(item){const done={...item,status:"graded",reviewed:true,score:Number(score),feedback};setQueue(prev=>prev.map(x=>x.id===item.id?done:x));onApprove(done);setReviewId(null);}
  const queued=queue.filter(q=>q.status==="queued"), review=queue.filter(q=>q.status==="needs_review"||q.status==="flagged"), graded=queue.filter(q=>q.status==="graded");
  const btn={fontFamily:"IBM Plex Mono",fontSize:11};

  return <div>
    <SectionHeading eyebrow="Teacher review workflow" title="Auto-Marking Engine" trailing={<StatusPill tone="info"><ShieldCheck size={11}/> Final approval required</StatusPill>}/>
    {error&&<div className="mb-5 px-4 py-3 rounded-xl" style={{background:"#FFF1F2",border:"1px solid #FECDD3",fontFamily:"DM Sans",fontSize:12,color:RUST}}>{error}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
      <MetricCard label="Waiting to run" value={queued.length} note="Submissions not yet auto-marked" icon={Clock3} tone="amber"/>
      <MetricCard label="Needs your review" value={review.length} note="Auto-marked, not sent to students" icon={Eye} tone="rose"/>
      <MetricCard label="Finalized" value={graded.length} note="Marks visible in My Progress" icon={CheckCircle2} tone="emerald"/>
    </div>
    <div className="p-4 rounded-2xl mb-7" style={{background:"#E8F0FE",border:"1px solid #D2E3FC"}}>
      <div className="flex gap-3"><ShieldCheck size={18} color={ACCENT}/>
        <div><div style={{fontFamily:"DM Sans",fontWeight:700,fontSize:13,color:INK}}>Teacher-controlled grading</div>
        <div style={{fontFamily:"DM Sans",fontSize:12,color:BODY,marginTop:2}}>Auto-marking only creates a suggested score. A teacher must review and approve it before the final mark appears on a student's progress.</div></div>
      </div>
    </div>

    <div className="text-[12px] uppercase tracking-wider mb-3" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>1 · Run auto-mark</div>
    <div className="rounded-2xl overflow-hidden mb-8" style={{border:`1px solid ${RULE}`,background:"#fff"}}>
      {queued.length===0?<div className="px-5 py-7 text-sm" style={{color:MUTED}}>No new submissions are waiting.</div>:
      queued.map((item,i)=><div key={item.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3" style={{borderBottom:i<queued.length-1?`1px solid ${RULE}`:"none"}}>
        <div className="flex items-center gap-3 flex-wrap"><span style={{...btn,color:MUTED}}>#{String(item.id).padStart(3,"0")}</span><span style={{fontFamily:"DM Sans",fontSize:13,fontWeight:700,color:INK}}>{item.student}</span><CourseTag course={item.course}/><span style={{fontFamily:"DM Sans",fontSize:12,color:BODY}}>{item.assignment}</span></div>
        <button onClick={()=>run(item.id)} disabled={markingId===item.id} className="px-3 py-2 flex items-center gap-1.5 rounded-lg" style={{...btn,color:"#fff",background:markingId===item.id?MUTED:ACCENT}}><Sparkles size={12}/>{markingId===item.id?"Running…":"Run auto-mark"}</button>
      </div>)}
    </div>

    <div className="text-[12px] uppercase tracking-wider mb-3" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>2 · Review and finalize</div>
    <div className="rounded-2xl overflow-hidden mb-8" style={{border:`1px solid ${RULE}`,background:"#fff"}}>
      {review.length===0?<div className="px-5 py-7 text-sm" style={{color:MUTED}}>Nothing is waiting for teacher review.</div>:
      review.map((item,i)=><div key={item.id} style={{borderBottom:i<review.length-1?`1px solid ${RULE}`:"none"}}>
        <div className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap"><span style={{...btn,color:MUTED}}>#{String(item.id).padStart(3,"0")}</span><span style={{fontFamily:"DM Sans",fontWeight:700,fontSize:13,color:INK}}>{item.student}</span><CourseTag course={item.course}/><span style={{fontFamily:"DM Sans",fontSize:12,color:BODY}}>{item.assignment}</span></div>
          <div className="flex items-center gap-3"><StatusPill tone="warning">Auto {item.score}/100 · {item.confidence}% confidence</StatusPill><button onClick={()=>openReview(item)} className="px-3 py-2 rounded-lg" style={{fontFamily:"DM Sans",fontSize:11,fontWeight:700,color:"#fff",background:ACCENT}}><Eye size={12} className="inline mr-1"/>Review</button></div>
        </div>
        {reviewId===item.id&&<div className="px-5 py-5" style={{background:"#F8FAFC",borderTop:`1px solid ${RULE}`}}><div className="mb-4 p-4 rounded-xl" style={{background:"#fff",border:`1px solid ${RULE}`}}><div className="flex items-center gap-2 mb-2" style={{fontFamily:"Manrope",fontWeight:800,fontSize:12,color:INK}}><FileText size={14} color={ACCENT}/> Teacher review of submitted quiz</div><div style={{fontFamily:"DM Sans",fontSize:11,color:BODY}}>The auto-mark is only a suggestion. Review the student's submitted answers, change the final mark if needed, and add feedback before approval.</div>{item.quizQuestions&&<div className="mt-3 space-y-2">{item.quizQuestions.map((q,i)=><div key={i} className="p-3 rounded-lg" style={{background:PAPER,border:`1px solid ${RULE}`}}><div style={{fontFamily:"DM Sans",fontWeight:700,fontSize:11,color:INK}}>Q{i+1}. {q.q}</div><div className="mt-1" style={{fontFamily:"DM Sans",fontSize:11,color:MUTED}}>Student answer: {item.answers?.[i]||"No answer"}</div></div>)}</div>}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-[11px] mb-1" style={{color:MUTED}}>Suggested score</label><div className="px-3 py-2 rounded-lg" style={{background:"#fff",border:`1px solid ${RULE}`,fontFamily:"IBM Plex Mono",fontSize:13}}>{item.score}/100</div></div>
            <div><label className="block text-[11px] mb-1" style={{color:MUTED}}>Confidence</label><div className="px-3 py-2 rounded-lg" style={{background:"#fff",border:`1px solid ${RULE}`,fontFamily:"IBM Plex Mono",fontSize:13}}>{item.confidence}%</div></div>
            <div><label htmlFor={`score-${item.id}`} className="block text-[11px] mb-1" style={{color:MUTED}}>Final teacher mark</label><input id={`score-${item.id}`} type="number" min="0" max="100" value={score} onChange={e=>setScore(e.target.value)} className="w-full px-3 py-2" style={{fontFamily:"IBM Plex Mono",fontSize:13,border:`1px solid ${RULE}`}}/></div>
          </div>
          <label className="block text-[11px] mb-1" style={{color:MUTED}}>Teacher feedback</label>
          <textarea rows={3} value={feedback} onChange={e=>setFeedback(e.target.value)} className="w-full px-3 py-2 mb-3" placeholder="Explain the final mark to the student…" style={{fontFamily:"DM Sans",fontSize:13,border:`1px solid ${RULE}`}}/>
          <div className="flex justify-end gap-2"><button onClick={()=>setReviewId(null)} className="px-3 py-2" style={{fontFamily:"DM Sans",fontSize:11,color:BODY,border:`1px solid ${RULE}`,background:"#fff"}}>Cancel</button><button onClick={()=>approve(item)} className="px-4 py-2 rounded-lg" style={{fontFamily:"DM Sans",fontSize:11,fontWeight:700,color:"#fff",background:MINT}}>Approve & send to My Progress</button></div>
        </div>}
      </div>)}
    </div>

    <div className="text-[12px] uppercase tracking-wider mb-3" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>Finalized marks</div>
    <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${RULE}`,background:"#fff"}}>
      {graded.length===0?<div className="px-5 py-6 text-sm" style={{color:MUTED}}>Approved marks will appear here.</div>:graded.map((item,i)=><div key={item.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3" style={{borderBottom:i<graded.length-1?`1px solid ${RULE}`:"none"}}><div><div style={{fontFamily:"DM Sans",fontWeight:700,fontSize:13,color:INK}}>{item.student} · {item.assignment}</div><div style={{fontFamily:"DM Sans",fontSize:11,color:MUTED}}>{item.feedback}</div></div><StatusPill tone="success"><CheckCircle2 size={11}/> {item.score}/100 · visible to student</StatusPill></div>)}
    </div>
  </div>
}
