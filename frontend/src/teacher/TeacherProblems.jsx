import React,{useMemo,useState} from "react";
import { Search,Pencil,Save,Lightbulb,ChevronRight } from "lucide-react";
import { INK,PAPER,RULE,MUTED,ACCENT,SOFT,BODY,AMBER } from "../theme.js";
import { SectionHeading,CourseTag,StatusPill } from "../components/Shared.jsx";
import { COURSES } from "../data/mockData.js";

const field={fontFamily:"DM Sans",border:`1px solid ${RULE}`,background:"#fff",color:INK};
function Editor({problem,onSave,onCancel}){
 const [title,setTitle]=useState(problem.title),[difficulty,setDifficulty]=useState(problem.difficulty),[examples,setExamples]=useState(problem.examples.map(e=>`${e.input} => ${e.output}`).join("\n")),[guidance,setGuidance]=useState((problem.guidance||[]).join("\n"));
 function save(){const ex=examples.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const [input,...rest]=l.split("=>");return {input:input.trim(),output:rest.join("=>").trim()}});onSave({...problem,title,difficulty,examples:ex,guidance:guidance.split("\n").map(s=>s.trim()).filter(Boolean)});}
 return <div className="mt-4 p-5 rounded-2xl" style={{background:"linear-gradient(135deg,#E8F0FE,#F5F3FF)",border:"1px solid #D2E3FC"}}>
  <div className="flex items-center gap-2 mb-4"><Pencil size={14} color={ACCENT}/><div style={{fontFamily:"Manrope",fontWeight:800,fontSize:13,color:INK}}>Edit faulty prompt problem</div></div>
  <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3 mb-4"><input aria-label="Title" value={title} onChange={e=>setTitle(e.target.value)} className="px-3 py-2.5" style={field}/><select aria-label="Difficulty" value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="px-3 py-2.5" style={{...field,fontFamily:"IBM Plex Mono",fontSize:11}}>{["Easy","Medium","Hard"].map(d=><option key={d}>{d}</option>)}</select></div>
  <label className="block text-[10px] uppercase tracking-wider mb-1" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>Input → output examples (same as student view)</label><textarea rows={4} value={examples} onChange={e=>setExamples(e.target.value)} className="w-full px-3 py-2 mb-4" style={{...field,fontFamily:"IBM Plex Mono",fontSize:11}}/>
  <label className="block text-[10px] uppercase tracking-wider mb-1" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>Problem-specific guidance (one point per line)</label><textarea rows={4} value={guidance} onChange={e=>setGuidance(e.target.value)} className="w-full px-3 py-2 mb-4" placeholder="Guidance for THIS problem…" style={{...field,fontSize:12}}/>
  <div className="flex justify-end gap-2"><button onClick={onCancel} className="px-3 py-2" style={{fontFamily:"DM Sans",fontSize:11,color:BODY,border:`1px solid ${RULE}`,background:"#fff"}}>Cancel</button><button onClick={save} className="px-4 py-2 rounded-lg flex items-center gap-1" style={{fontFamily:"DM Sans",fontSize:11,fontWeight:800,color:"#fff",background:ACCENT}}><Save size={12}/> Save changes</button></div>
 </div>
}
export default function TeacherProblems({problems,setProblems,editId,setEditId}){
 const [query,setQuery]=useState(""),[courseFilter,setCourseFilter]=useState("All");
 const filtered=useMemo(()=>problems.filter(p=>p.title.toLowerCase().includes(query.toLowerCase())&&(courseFilter==="All"||p.course===courseFilter)),[problems,query,courseFilter]);
 const save=p=>{setProblems(prev=>prev.map(x=>x.id===p.id?p:x));setEditId(null);};
 return <div>
  <SectionHeading eyebrow="Teacher view = student view" title="Prompt Problems" trailing={<StatusPill tone="info"><Lightbulb size={11}/> Same examples + same guidance</StatusPill>}/>
  <div className="flex gap-3 mb-6 flex-wrap"><div className="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-[220px] rounded-xl" style={{border:`1px solid ${RULE}`,background:"#fff"}}><Search size={14} color={MUTED}/><input aria-label="Search problems" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search prompt problems…" className="flex-1 outline-none text-[12px]" style={{fontFamily:"DM Sans",background:"transparent",color:INK}}/></div><select aria-label="Filter by course" value={courseFilter} onChange={e=>setCourseFilter(e.target.value)} className="px-3 py-2.5 rounded-xl" style={{fontFamily:"IBM Plex Mono",fontSize:10,...field}}><option>All</option>{COURSES.map(c=><option key={c}>{c}</option>)}</select></div>
  <div className="grid grid-cols-1 gap-5">{filtered.map(p=><div key={p.id} className="rounded-2xl overflow-hidden" style={{background:"#fff",border:`1px solid ${RULE}`,boxShadow:"0 10px 26px rgba(15,23,42,.05)"}}>
    <div className="p-5" style={{background:"linear-gradient(135deg,#FFFFFF,#F8FAFF)"}}><div className="flex items-center justify-between gap-2 flex-wrap"><div className="flex items-center gap-2"><CourseTag course={p.course}/><StatusPill tone={p.passRate>=70?"success":p.passRate>=50?"warning":"danger"}>{p.passRate}% pass</StatusPill></div><button onClick={()=>setEditId(editId===p.id?null:p.id)} className="px-3 py-2 rounded-xl flex items-center gap-1" style={{fontFamily:"DM Sans",fontSize:11,fontWeight:800,color:ACCENT,background:SOFT}}><Pencil size={12}/>{editId===p.id?"Close editor":"Edit problem"}</button></div>
      <div className="mt-4" style={{fontFamily:"Manrope",fontWeight:800,fontSize:18,color:INK}}>{p.title}</div><div className="mt-1" style={{fontFamily:"DM Sans",fontSize:11,color:MUTED}}>{p.difficulty} · {p.attempts} attempts</div></div>
    <div className="px-5 py-5"><div className="text-[10px] uppercase tracking-wider mb-3" style={{fontFamily:"IBM Plex Mono",color:MUTED}}>Input → Output examples</div><div className="rounded-xl overflow-hidden" style={{border:`1px solid ${RULE}`}}>{p.examples.map((ex,i)=><div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3" style={{fontFamily:"IBM Plex Mono",fontSize:11,borderBottom:i<p.examples.length-1?`1px solid ${RULE}`:"none"}}><span style={{color:INK}}>{ex.input}</span><ChevronRight size={13} color={MUTED}/><span style={{color:BODY}}>{ex.output}</span></div>)}</div>
      <div className="mt-5 p-4 rounded-xl" style={{background:"#FFFBEB",border:"1px solid #FDE68A"}}><div className="flex gap-2"><Lightbulb size={15} color={AMBER}/><div><div style={{fontFamily:"DM Sans",fontWeight:800,fontSize:12,color:"#92400E"}}>Guidance for this exact problem</div><ul className="mt-2 pl-4 space-y-1" style={{fontFamily:"DM Sans",fontSize:11,color:"#78350F",listStyle:"disc"}}>{(p.guidance||[]).map((g,i)=><li key={i}>{g}</li>)}</ul></div></div></div>
      {p.failNote&&<div className="mt-4 text-[11px] px-3 py-2 rounded-lg" style={{background:"#FFF1F2",color:"#9F1239",border:"1px solid #FECDD3"}}>{p.failNote}</div>}
    </div>
    {editId===p.id&&<div className="px-5 pb-5"><Editor problem={p} onSave={save} onCancel={()=>setEditId(null)}/></div>}
  </div>)}</div>
  {filtered.length===0&&<div className="px-5 py-8 text-center text-sm rounded-2xl" style={{border:`1px solid ${RULE}`,color:MUTED,background:"#fff"}}>No prompt problems match your search.</div>}
 </div>
}
