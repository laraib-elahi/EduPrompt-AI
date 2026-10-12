import React,{useState} from "react";
import { CheckCircle2,Filter } from "lucide-react";
import { INK,RULE,MUTED,ACCENT,SOFT } from "../theme.js";
import { SectionHeading,CourseTag,StatusPill,ProblemCard } from "../components/Shared.jsx";
import { COURSES } from "../data/mockData.js";

export default function StudentProblems({problems,progress,onOpenProblem}){
 const [courseFilter,setCourseFilter]=useState("All");
 const filtered=problems.filter(p=>courseFilter==="All"||p.course===courseFilter);
 return <div>
  <SectionHeading eyebrow="Learn from input → output evidence" title="Prompt Problems" trailing={<StatusPill tone="info"><Filter size={11}/> No plain-text solution</StatusPill>}/>
  <div className="flex gap-2 mb-6 flex-wrap"><select aria-label="Filter by course" value={courseFilter} onChange={e=>setCourseFilter(e.target.value)} className="px-3 py-2.5 rounded-xl" style={{fontFamily:"IBM Plex Mono",fontSize:10,border:`1px solid ${RULE}`,background:"#fff",color:INK}}><option>All</option>{COURSES.map(c=><option key={c}>{c}</option>)}</select><div className="px-3 py-2.5 rounded-xl flex items-center gap-1.5" style={{fontFamily:"DM Sans",fontSize:10,color:MUTED,background:"#fff",border:`1px solid ${RULE}`}}><CheckCircle2 size={12} color={ACCENT}/> Open a problem to write and test your own prompt</div></div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{filtered.map(p=><ProblemCard key={p.id} problem={p} solved={progress[p.id]?.solved} onOpen={onOpenProblem}/>)}</div>
 </div>
}
